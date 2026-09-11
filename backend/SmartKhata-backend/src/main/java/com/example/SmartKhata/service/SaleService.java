package com.example.SmartKhata.service;

import com.example.SmartKhata.dto.sale.SaleItemRequest;
import com.example.SmartKhata.dto.sale.SaleItemResponse;
import com.example.SmartKhata.dto.sale.SaleRequest;
import com.example.SmartKhata.dto.sale.SaleResponse;
import com.example.SmartKhata.entity.*;
import com.example.SmartKhata.enums.PaymentType;
import com.example.SmartKhata.enums.SaleStatus;
import com.example.SmartKhata.enums.TransactionStatus;
import com.example.SmartKhata.enums.TransactionType;
import com.example.SmartKhata.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {
    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public SaleResponse addSale(
            SaleRequest request,
            Shop shop) {
        Customer customer = getCustomer(request, shop);
        Sale sale = createSale(request, customer, shop);
        BigDecimal total = processSaleItems(
                sale,
                request,
                shop
        );
        sale.setTotalAmount(total);
        saleRepository.save(sale);
        createCreditTransactionIfRequired(
                request,
                customer,
                total,
                sale
        );
        return mapToSaleResponse(sale);
    }


    public List<SaleResponse> getAllSales(Shop shop) {

        return saleRepository
                .findByShopAndStatusOrderBySaleDateDesc(
                        shop,
                        SaleStatus.COMPLETED
                )
                .stream()
                .map(this::mapToSaleResponse)
                .toList();
    }
    public SaleResponse getSaleById(
            Long saleId,
            Shop shop) {

        Sale sale = saleRepository.findByIdAndShopAndStatus(saleId,shop,SaleStatus.COMPLETED)
                .orElseThrow(()->new RuntimeException("Sale not found"));

        return mapToSaleResponse(sale);
    }
    private Customer getCustomer(SaleRequest request,Shop shop){
        if (request.getCustomerId() == null) {
            if (request.getPaymentType() == PaymentType.CREDIT) {
                throw new RuntimeException(
                        "Customer is required for credit sale");
            }
            return null;
        }
        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));
        if (!customer.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Access denied");
        }
        return customer;
    }
    private Sale createSale(
            SaleRequest request,
            Customer customer,
            Shop shop) {

        Sale sale = Sale.builder()
                .customer(customer)
                .shop(shop)
                .paymentType(request.getPaymentType())
                .saleDate(LocalDateTime.now())
                .totalAmount(BigDecimal.ZERO)
                .status(SaleStatus.COMPLETED)
                .build();

        return saleRepository.save(sale);
    }
    private BigDecimal processSaleItems(
            Sale sale,
            SaleRequest request,
            Shop shop) {

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (SaleItemRequest itemRequest : request.getItems()) {

            Product product = productRepository
                    .findByIdAndShop(itemRequest.getProductId(), shop)
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException(
                        product.getName() + " has only "
                                + product.getStock()
                                + " items in stock");
            }

            BigDecimal lineTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            SaleItem saleItem = SaleItem.builder()
                    .sale(sale)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getPrice())
                    .lineTotal(lineTotal)
                    .build();

            saleItemRepository.save(saleItem);

            product.setStock(
                    product.getStock() - itemRequest.getQuantity()
            );

            productRepository.save(product);

            totalAmount = totalAmount.add(lineTotal);
        }

        return totalAmount;
    }
    private void createCreditTransactionIfRequired(
            SaleRequest request,
            Customer customer,
            BigDecimal totalAmount,
            Sale sale) {

        if (request.getPaymentType() != PaymentType.CREDIT ) {
            return;
        }

        if (customer == null) {
            return;
        }

        Transaction transaction = Transaction.builder()
                .sale(sale)
                .customer(customer)
                .amount(totalAmount)
                .type(TransactionType.CREDIT)
                .transactionStatus(TransactionStatus.ACTIVE)
                .transactionDate(LocalDateTime.now())
                .note("Credit Sale")
                .build();

        transactionRepository.save(transaction);
    }
    private SaleResponse mapToSaleResponse(Sale sale) {

        List<SaleItemResponse> items = saleItemRepository
                .findBySale(sale)
                .stream()
                .map(item -> SaleItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .lineTotal(item.getLineTotal())
                        .build())
                .toList();

        return SaleResponse.builder()
                .id(sale.getId())
                .saleDate(sale.getSaleDate())
                .customerId(
                        sale.getCustomer() != null
                                ? sale.getCustomer().getId()
                                : null
                )
                .customerName(
                        sale.getCustomer() != null
                                ? sale.getCustomer().getName()
                                : "Walk-in Customer"
                )
                .paymentType(sale.getPaymentType())
                .totalAmount(sale.getTotalAmount())
                .items(items)
                .build();
    }

    @Transactional
    public String cancelSale(Long saleId,String reason, Shop shop){
        Sale sale = saleRepository.findByIdAndShopAndStatus(saleId,shop,SaleStatus.COMPLETED)
                .orElseThrow(()->new RuntimeException("Sale not found"));

        if (sale.getStatus() == SaleStatus.CANCELLED){
            throw new RuntimeException("Sale already cancelled");
        }

        restoreStock(sale);
        cancelCreditTransaction(sale);
        sale.setStatus(SaleStatus.CANCELLED);
        sale.setCancelledAt(LocalDateTime.now());
        sale.setCancelReason(reason);
        saleRepository.save(sale);
        return "Sale cancelled successfully";
    }

    private void restoreStock(Sale sale){
        List<SaleItem> items = saleItemRepository.findBySale(sale);
        for (SaleItem item:items){
            Product product = item.getProduct();
            product.setStock(product.getStock()+ item.getQuantity());
        }
    }

    private void cancelCreditTransaction(Sale sale){
        if (sale.getPaymentType()!=PaymentType.CREDIT)return;
        Transaction transaction = transactionRepository
                .findBySale(sale).orElse(null);

        if (transaction ==null){
            return ;
        }
        transaction.setTransactionStatus(TransactionStatus.CANCELLED);
        transaction.setCancelledAt(LocalDateTime.now());
    }
}

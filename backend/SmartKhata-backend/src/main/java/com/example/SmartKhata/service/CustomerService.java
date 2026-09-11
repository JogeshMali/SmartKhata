package com.example.SmartKhata.service;

import com.example.SmartKhata.dto.customer.CustomerLedgerResponse;
import com.example.SmartKhata.dto.customer.CustomerRequest;
import com.example.SmartKhata.dto.customer.CustomerResponse;
import com.example.SmartKhata.entity.Customer;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.entity.User;
import com.example.SmartKhata.enums.TransactionType;
import com.example.SmartKhata.repository.CustomerRepository;
import com.example.SmartKhata.repository.ShopRepository;
import com.example.SmartKhata.repository.TransactionRepository;
import com.example.SmartKhata.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final ShopRepository shopRepository;
    private final TransactionRepository transactionRepository;

    public String addCustomer(CustomerRequest request, Shop shop){
        if (customerRepository.existsByShopAndPhone(shop,request.getPhone())){
            throw new RuntimeException("Customer with this phone already exists.");
        }
        Customer customer = Customer.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .creditLimit(request.getCreditLimit())
                .shop(shop)
                .build();

        customerRepository.save(customer);
        return "Customer added successfully.";
    }

    public List<CustomerResponse> getAllCustomers(Shop shop) {

        return customerRepository.findByShop(shop)
                .stream()
                .map(customer -> CustomerResponse.builder()
                        .id(customer.getId())
                        .name(customer.getName())
                        .phone(customer.getPhone())
                        .address(customer.getAddress())
                        .creditLimit(customer.getCreditLimit())
                        .outstandingAmount(calcOutstandingAmount(customer))

                        .build())
                .toList();
    }

    public CustomerResponse getCustomerById(Long id ,Shop shop){
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        if (!customer.getShop().getId().equals(shop.getId())){
            throw new RuntimeException("Access denied");
        }

        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .creditLimit(customer.getCreditLimit())
                .outstandingAmount(calcOutstandingAmount(customer))
                .build();
    }

    public String updateCustomer(Long id,CustomerRequest request,Shop shop){
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!customer.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Access denied");
        }

        if (request.getName() != null) {
            customer.setName(request.getName());
        }

        if (request.getPhone() != null) {
            customer.setPhone(request.getPhone());
        }

        if (request.getAddress() != null) {
            customer.setAddress(request.getAddress());
        }

        if (request.getCreditLimit() != null) {
            customer.setCreditLimit(request.getCreditLimit());
        }

        customerRepository.save(customer);

        return "Customer updated successfully";

    }


    public String deleteCustomer(Long id, Shop shop) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!customer.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Access denied");
        }

        customerRepository.delete(customer);

        return "Customer deleted successfully";
    }

    public CustomerLedgerResponse getCustomerLedger(Long customerId,Shop shop){
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        if (!customer.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Access denied");
        }
        BigDecimal totalCredit = transactionRepository.getTotalAmountByCustomerAndType(customer, TransactionType.CREDIT);
        BigDecimal totalPayment = transactionRepository.getTotalAmountByCustomerAndType(customer, TransactionType.PAYMENT);
        BigDecimal outstandingAmount = totalCredit.subtract(totalPayment);

        return CustomerLedgerResponse.builder()
                .customerId(customer.getId())
                .customerName(customer.getName())
                .totalCredit(totalCredit)
                .totalPayment(totalPayment)
                .outstandingAmount(outstandingAmount)
                .build();
    }

    private BigDecimal calcOutstandingAmount(Customer customer){
        BigDecimal totalCredit = transactionRepository.getTotalAmountByCustomerAndType(customer, TransactionType.CREDIT);
        BigDecimal totalPayment = transactionRepository.getTotalAmountByCustomerAndType(customer, TransactionType.PAYMENT);
        return totalCredit.subtract(totalPayment);
    }
}

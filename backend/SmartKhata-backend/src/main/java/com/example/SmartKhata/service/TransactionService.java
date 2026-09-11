package com.example.SmartKhata.service;

import com.example.SmartKhata.dto.payment.PaymentRequest;
import com.example.SmartKhata.dto.payment.PaymentResponse;
import com.example.SmartKhata.dto.statement.CustomerStatementResponse;
import com.example.SmartKhata.dto.statement.StatementResponse;
import com.example.SmartKhata.dto.transaction.TransactionRequest;
import com.example.SmartKhata.dto.transaction.TransactionResponse;
import com.example.SmartKhata.entity.Customer;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.entity.Transaction;
import com.example.SmartKhata.enums.TransactionStatus;
import com.example.SmartKhata.enums.TransactionType;
import com.example.SmartKhata.repository.CustomerRepository;
import com.example.SmartKhata.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;


    public String addTransaction(Long customerId , TransactionRequest request, Shop shop){
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!customer.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Access denied");
        }

        Transaction transaction = Transaction.builder()
                .customer(customer)
                .type(request.getType())
                .amount(request.getAmount())
                .note(request.getNote())
                .transactionDate(LocalDateTime.now())
                .build();
        transactionRepository.save(transaction);
        return "Transaction added successfully";

    }

    public List<TransactionResponse> getCustomerTransactions(Long customerId,Shop shop){
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!customer.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Access denied");
        }
        return transactionRepository
                .findByCustomerOrderByTransactionDateDesc(customer)
                .stream()
                .map(transaction -> TransactionResponse.builder()
                        .id(transaction.getId())
                        .type(transaction.getType())
                        .amount(transaction.getAmount())
                        .note(transaction.getNote())
                        .transactionDate(transaction.getTransactionDate())
                        .build())
                .toList();

    }


    public TransactionResponse getTransactionById(Long transactionId,Shop shop){
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(()->new RuntimeException("Transaction not found"));

        if (!transaction.getCustomer().getShop().getId().equals(shop.getId())){
            throw new RuntimeException("Access denied");
        }
        return TransactionResponse.builder()
                .id(transaction.getId())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .note(transaction.getNote())
                .transactionDate(transaction.getTransactionDate())
                .build();
    }
    public String updateTransaction(
            Long transactionId,
            TransactionRequest request,
            Shop shop) {

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found"));

        if (!transaction.getCustomer()
                .getShop()
                .getId()
                .equals(shop.getId())) {

            throw new RuntimeException("Access denied");
        }

        if (request.getType() != null) {
            transaction.setType(request.getType());
        }

        if (request.getAmount() != null) {
            transaction.setAmount(request.getAmount());
        }

        if (request.getNote() != null) {
            transaction.setNote(request.getNote());
        }

        transactionRepository.save(transaction);

        return "Transaction updated successfully";
    }
    public String deleteTransaction(
            Long transactionId,
            Shop shop) {

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found"));

        if (!transaction.getCustomer()
                .getShop()
                .getId()
                .equals(shop.getId())) {

            throw new RuntimeException("Access denied");
        }

        transactionRepository.delete(transaction);

        return "Transaction deleted successfully";
    }


    @Transactional
    public PaymentResponse addPayment(PaymentRequest request,Shop shop){
        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        if (!customer.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Access denied");
        }
        Transaction transaction = Transaction.builder()
                .customer(customer)
                .amount(request.getAmount())
                .type(TransactionType.PAYMENT)
                .transactionStatus(TransactionStatus.ACTIVE)
                .transactionDate(LocalDateTime.now())
                .note(request.getNote())
                .build();

        transactionRepository.save(transaction);

        return mapToPaymentResponse(transaction);
    }

    private PaymentResponse mapToPaymentResponse(Transaction transaction) {
        return PaymentResponse.builder()
                .id(transaction.getId())
                .customerId(transaction.getCustomer().getId())
                .customerName(transaction.getCustomer().getName())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .transactionDate(transaction.getTransactionDate())
                .note(transaction.getNote())
                .build();
    }
    public CustomerStatementResponse getStatement(
            Long customerId,
            Shop shop) {

        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        if (!customer.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Access denied");
        }

        List<Transaction> transactions=  transactionRepository
                .findByCustomerOrderByTransactionDateAsc(customer);

        List<StatementResponse> statementList = new ArrayList<>();
        BigDecimal balance = BigDecimal.ZERO;
        for (Transaction transaction :transactions){
            if (transaction.getTransactionStatus() == TransactionStatus.CANCELLED) {
                continue;
            }

            if (transaction.getType() == TransactionType.CREDIT) {

                balance = balance.add(transaction.getAmount());

            } else {

                balance = balance.subtract(transaction.getAmount());

            }
            statementList.add(

                    StatementResponse.builder()
                            .id(transaction.getId())
                            .transactionDate(transaction.getTransactionDate())
                            .type(transaction.getType())
                            .amount(transaction.getAmount())
                            .note(transaction.getNote())
                            .runningBalance(balance)
                            .build()

            );

        }
        return CustomerStatementResponse.builder()
                .customerId(customer.getId())
                .customerName(customer.getName())
                .phone(customer.getPhone())
                .outstandingBalance(balance)
                .transactions(statementList)
                .build();
    }
}

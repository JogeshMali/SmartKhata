package com.example.SmartKhata.controller;

import com.example.SmartKhata.dto.payment.PaymentRequest;
import com.example.SmartKhata.dto.payment.PaymentResponse;
import com.example.SmartKhata.dto.statement.CustomerStatementResponse;
import com.example.SmartKhata.dto.transaction.TransactionRequest;
import com.example.SmartKhata.dto.transaction.TransactionResponse;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.service.CurrentUserService;
import com.example.SmartKhata.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final CurrentUserService currentUserService;

    @PostMapping("/customers/{customerId}/transactions")
    public String addTransaction(
            @PathVariable Long customerId,
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication
            ){

        Shop shop = currentUserService.getCurrentShop(authentication);
        return transactionService.addTransaction(
                customerId,request,shop
        );
    }

    @GetMapping("/customers/{customerId}/transactions")
    public List<TransactionResponse> getCustomerTransactions(
            @PathVariable Long customerId,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return transactionService.getCustomerTransactions(
                customerId,
                shop
        );
    }

    @GetMapping("/transactions/{transactionId}")
    public TransactionResponse getTransactionById(
            @PathVariable Long transactionId,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return transactionService.getTransactionById(
                transactionId,
                shop
        );
    }

    @PatchMapping("/transactions/{transactionId}")
    public String updateTransaction(
            @PathVariable Long transactionId,
            @RequestBody TransactionRequest request,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return transactionService.updateTransaction(
                transactionId,
                request,
                shop
        );
    }

    @DeleteMapping("/transactions/{transactionId}")
    public String deleteTransaction(
            @PathVariable Long transactionId,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return transactionService.deleteTransaction(
                transactionId,
                shop
        );
    }

    @PostMapping("/payment")
    public PaymentResponse addPayment(
            @Valid @RequestBody PaymentRequest request,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return transactionService.addPayment(
                request,
                shop
        );
    }
    @GetMapping("/statement/{customerId}")
    public CustomerStatementResponse getStatement(
            @PathVariable Long customerId,
            Authentication authentication) {

        Shop shop = currentUserService
                .getCurrentShop(authentication);

        return transactionService.getStatement(
                customerId,
                shop
        );

    }

}

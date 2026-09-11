package com.example.SmartKhata.controller;

import com.example.SmartKhata.dto.customer.CustomerLedgerResponse;
import com.example.SmartKhata.dto.customer.CustomerRequest;
import com.example.SmartKhata.dto.customer.CustomerResponse;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.service.CurrentUserService;
import com.example.SmartKhata.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public String addCustomer(
            @RequestBody CustomerRequest request,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return customerService.addCustomer(request, shop);
    }

    @GetMapping
    public List<CustomerResponse> getAllCustomers(
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return customerService.getAllCustomers(shop);
    }

    @GetMapping("/{id}")
    public CustomerResponse getCustomerById(
            @PathVariable Long id,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return customerService.getCustomerById(id, shop);
    }

    @PatchMapping("/{id}")
    public String updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerRequest request,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return customerService.updateCustomer(id, request, shop);
    }

    @DeleteMapping("/{id}")
    public String deleteCustomer(
            @PathVariable Long id,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return customerService.deleteCustomer(id, shop);
    }

    @GetMapping("/{customerId}/ledger")
    public CustomerLedgerResponse getCustomerLedger(@PathVariable Long customerId,Authentication authentication){
        Shop shop = currentUserService.getCurrentShop(authentication);
        return customerService.getCustomerLedger(customerId,shop);
    }
}
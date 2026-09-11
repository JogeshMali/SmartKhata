package com.example.SmartKhata.controller;

import com.example.SmartKhata.dto.expense.ExpenseRequest;
import com.example.SmartKhata.dto.expense.ExpenseResponse;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.service.CurrentUserService;
import com.example.SmartKhata.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public ExpenseResponse addExpense(
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication
            ){
        Shop shop =currentUserService.getCurrentShop(authentication);
        return expenseService.addExpense(request,shop);
    }
    @GetMapping
    public List<ExpenseResponse> getAllExpenses(
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return expenseService.getAllExpenses(shop);
    }

    @GetMapping("/{expenseId}")
    public ExpenseResponse getExpenseById(
            @PathVariable Long expenseId,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return expenseService.getExpenseById(expenseId, shop);
    }

    @PatchMapping("/{expenseId}")
    public ExpenseResponse updateExpense(
            @PathVariable Long expenseId,
            @RequestBody ExpenseRequest request,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return expenseService.updateExpense(
                expenseId,
                request,
                shop
        );
    }

    @DeleteMapping("/{expenseId}")
    public String deleteExpense(
            @PathVariable Long expenseId,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return expenseService.deleteExpense(
                expenseId,
                shop
        );
    }
}

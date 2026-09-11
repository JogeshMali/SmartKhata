package com.example.SmartKhata.service;

import com.example.SmartKhata.dto.expense.ExpenseRequest;
import com.example.SmartKhata.dto.expense.ExpenseResponse;
import com.example.SmartKhata.entity.Expense;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.repository.ExpenseRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;


    @Transactional
    public ExpenseResponse addExpense(ExpenseRequest request, Shop shop){
        Expense expense = Expense.builder()
                .shop(shop)
                .category(request.getCategory())
                .amount(request.getAmount())
                .expenseDate(request.getExpenseDate())
                .description(request.getDescription())
                .build();

        expenseRepository.save(expense);

        return mapToExpenseResponse(expense);
    }

    private ExpenseResponse mapToExpenseResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .expenseDate(expense.getExpenseDate())
                .description(expense.getDescription())
                .build();
    }

    public List<ExpenseResponse> getAllExpenses(
            Shop shop) {

        return expenseRepository
                .findByShopOrderByExpenseDateDesc(shop)
                .stream()
                .map(this::mapToExpenseResponse)
                .toList();
    }
    public ExpenseResponse getExpenseById(
            Long expenseId,
            Shop shop) {

        Expense expense = expenseRepository
                .findByIdAndShop(expenseId, shop)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found"));

        return mapToExpenseResponse(expense);
    }
    @Transactional
    public ExpenseResponse updateExpense(
            Long expenseId,
            ExpenseRequest request,
            Shop shop) {

        Expense expense = expenseRepository
                .findByIdAndShop(expenseId, shop)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found"));

        if (request.getCategory() != null) {
            expense.setCategory(request.getCategory());
        }

        if (request.getAmount() != null) {
            expense.setAmount(request.getAmount());
        }

        if (request.getExpenseDate() != null) {
            expense.setExpenseDate(request.getExpenseDate());
        }

        if (request.getDescription() != null) {
            expense.setDescription(request.getDescription());
        }

        return mapToExpenseResponse(expense);
    }
    @Transactional
    public String deleteExpense(
            Long expenseId,
            Shop shop) {

        Expense expense = expenseRepository
                .findByIdAndShop(expenseId, shop)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found"));

        expenseRepository.delete(expense);

        return "Expense deleted successfully";
    }
}

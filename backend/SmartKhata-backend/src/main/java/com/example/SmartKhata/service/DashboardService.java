package com.example.SmartKhata.service;

import com.example.SmartKhata.dto.dashboard.DashboardResponse;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.enums.SaleStatus;
import com.example.SmartKhata.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SaleRepository saleRepository;
    private final ExpenseRepository expenseRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;

    public DashboardResponse getDashboard(Shop shop) {

        // Get today's date
        LocalDate today = LocalDate.now();

        // Start of today: 00:00:00
        LocalDateTime start = today.atStartOfDay();

        // Start of tomorrow: 00:00:00
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        // Today's completed sales
        BigDecimal todaySales = saleRepository.getTodaySales(
                shop,
                SaleStatus.COMPLETED,
                start,
                end
        );

        // Today's expenses
        BigDecimal todayExpenses =
                expenseRepository.getTodayExpenses(shop);

        // Today's number of completed sales
        Long todaySaleCount = saleRepository.getTodaySaleCount(
                shop,
                SaleStatus.COMPLETED,
                start,
                end
        );

        return DashboardResponse.builder()

                // Total sales made today
                .todaySales(todaySales)

                // Total expenses made today
                .todayExpenses(todayExpenses)

                // Profit = Sales - Expenses
                .todayProfit(
                        todaySales.subtract(todayExpenses)
                )

                // Total outstanding customer credit
                .outstandingCredit(
                        transactionRepository.getOutstandingCredit(shop)
                )

                // Number of customers
                .totalCustomers(
                        customerRepository.getCustomerCount(shop)
                )

                // Number of products
                .totalProducts(
                        productRepository.getProductCount(shop)
                )

                // Number of products below stock threshold
                .lowStockProducts(
                        productRepository.getLowStockCount(shop)
                )

                // Number of completed sales today
                .totalSalesToday(todaySaleCount)

                .build();
    }
}
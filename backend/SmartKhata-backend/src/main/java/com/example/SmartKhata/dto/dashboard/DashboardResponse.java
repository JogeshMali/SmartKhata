package com.example.SmartKhata.dto.dashboard;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private BigDecimal todaySales;

    private BigDecimal todayExpenses;

    private BigDecimal todayProfit;

    private BigDecimal outstandingCredit;

    private Long totalCustomers;

    private Long totalProducts;

    private Long lowStockProducts;

    private Long totalSalesToday;
}

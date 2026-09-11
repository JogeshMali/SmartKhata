package com.example.SmartKhata.dto.expense;
import com.example.SmartKhata.enums.ExpenseCategory;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {

    private Long id;

    private ExpenseCategory category;

    private BigDecimal amount;

    private LocalDate expenseDate;

    private String description;

}
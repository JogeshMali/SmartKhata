package com.example.SmartKhata.dto.statement;

import com.example.SmartKhata.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatementResponse {

    private Long id;

    private LocalDateTime transactionDate;

    private TransactionType type;

    private BigDecimal amount;

    private String note;

    private BigDecimal runningBalance;
}
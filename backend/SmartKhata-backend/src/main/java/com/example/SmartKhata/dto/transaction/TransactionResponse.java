package com.example.SmartKhata.dto.transaction;

import com.example.SmartKhata.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long id;

    private TransactionType type;

    private BigDecimal amount;

    private String note;

    private LocalDateTime transactionDate;
}
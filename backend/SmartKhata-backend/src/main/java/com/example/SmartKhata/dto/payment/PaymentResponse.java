package com.example.SmartKhata.dto.payment;

import com.example.SmartKhata.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;

    private Long customerId;

    private String customerName;

    private BigDecimal amount;

    private TransactionType type;

    private LocalDateTime transactionDate;

    private String note;

}
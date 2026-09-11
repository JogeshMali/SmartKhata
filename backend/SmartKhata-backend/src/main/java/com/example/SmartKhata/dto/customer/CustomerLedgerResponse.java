package com.example.SmartKhata.dto.customer;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerLedgerResponse {
    private Long customerId;
    private String customerName;
    private BigDecimal totalCredit;
    private BigDecimal totalPayment;
    private BigDecimal outstandingAmount;
}

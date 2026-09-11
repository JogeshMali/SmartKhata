package com.example.SmartKhata.dto.statement;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerStatementResponse {

    private Long customerId;

    private String customerName;

    private String phone;

    private BigDecimal outstandingBalance;

    private List<StatementResponse> transactions;
}

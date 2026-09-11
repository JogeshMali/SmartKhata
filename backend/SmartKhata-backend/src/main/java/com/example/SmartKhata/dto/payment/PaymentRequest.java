package com.example.SmartKhata.dto.payment;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {

    @NotNull
    private Long customerId;

    @NotNull
    @Positive
    private BigDecimal amount;

    private String note;

}
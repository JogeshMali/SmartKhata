package com.example.SmartKhata.dto.customer;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerResponse {
    private Long id;
    private String name;

    private String phone;

    private String address;

    private Integer creditLimit;
    private BigDecimal outstandingAmount;
}

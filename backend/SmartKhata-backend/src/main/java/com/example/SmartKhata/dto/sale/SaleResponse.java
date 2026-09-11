package com.example.SmartKhata.dto.sale;
import com.example.SmartKhata.enums.PaymentType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleResponse {
    private Long id;

    private LocalDateTime saleDate;

    private Long customerId;

    private String customerName;

    private PaymentType paymentType;

    private BigDecimal totalAmount;

    private List<SaleItemResponse> items;
}

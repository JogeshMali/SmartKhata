package com.example.SmartKhata.dto.sale;
import com.example.SmartKhata.enums.PaymentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleRequest {
    private Long customerId;
    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;

    @Valid
    @NotEmpty(message = "At least one product is required")
    private List<SaleItemRequest> items;
}

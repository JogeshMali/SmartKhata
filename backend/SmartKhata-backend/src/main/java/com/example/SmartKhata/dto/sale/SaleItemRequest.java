package com.example.SmartKhata.dto.sale;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.bind.annotation.GetMapping;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItemRequest {
    @NotNull(message = "Product is required")
    private Long productId;

    @NotNull(message = "Quantity id required")
    @Min(value = 1,message = "Quantity must be at least 1")
    private Integer quantity;

}

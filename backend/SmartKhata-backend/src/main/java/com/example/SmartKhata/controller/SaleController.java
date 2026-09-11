package com.example.SmartKhata.controller;


import com.example.SmartKhata.dto.sale.SaleRequest;
import com.example.SmartKhata.dto.sale.SaleResponse;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.service.CurrentUserService;
import com.example.SmartKhata.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public SaleResponse addSale(
            @Valid @RequestBody SaleRequest request,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return saleService.addSale(request, shop);
    }

    @GetMapping
    public List<SaleResponse> getAllSales(
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return saleService.getAllSales(shop);
    }

    @GetMapping("/{saleId}")
    public SaleResponse getSaleById(
            @PathVariable Long saleId,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return saleService.getSaleById(saleId, shop);
    }

    @PatchMapping("/{saleId}/cancel")
    public String cancelSale(
            @PathVariable Long saleId,
            @RequestParam String reason,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return saleService.cancelSale(
                saleId,
                reason,
                shop
        );
    }


}
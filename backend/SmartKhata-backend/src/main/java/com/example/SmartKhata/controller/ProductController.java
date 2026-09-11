package com.example.SmartKhata.controller;

import org.springframework.web.bind.annotation.RestController;


import com.example.SmartKhata.dto.product.ProductRequest;
import com.example.SmartKhata.dto.product.ProductResponse;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.service.CurrentUserService;
import com.example.SmartKhata.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public String addProduct(
            @Valid @RequestBody ProductRequest request,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return productService.addProduct(request, shop);
    }

    @GetMapping
    public List<ProductResponse> getAllProducts(
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return productService.getAllProducts(shop);
    }

    @GetMapping("/{productId}")
    public ProductResponse getProductById(
            @PathVariable Long productId,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return productService.getProductById(productId, shop);
    }

    @PatchMapping("/{productId}")
    public String updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductRequest request,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return productService.updateProduct(
                productId,
                request,
                shop
        );
    }

    @DeleteMapping("/{productId}")
    public String deleteProduct(
            @PathVariable Long productId,
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return productService.deleteProduct(
                productId,
                shop
        );
    }
}
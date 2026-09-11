package com.example.SmartKhata.service;

import com.example.SmartKhata.dto.product.ProductRequest;
import com.example.SmartKhata.dto.product.ProductResponse;
import com.example.SmartKhata.entity.Product;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public String addProduct(ProductRequest request, Shop shop){
        if (productRepository.existsByNameAndShop(request.getName(), shop)){
            throw new RuntimeException("Product already exists");
        }
        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .stock(request.getStock())
                .shop(shop)
                .build();

        productRepository.save(product);

        return "Product added successfully";
    }
    public List<ProductResponse> getAllProducts(Shop shop) {

        return productRepository.findByShop(shop)
                .stream()
                .map(product -> ProductResponse.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .stock(product.getStock())
                        .build())
                .toList();
    }
    public ProductResponse getProductById(Long productId, Shop shop) {

        Product product = productRepository.findByIdAndShop(productId, shop)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .stock(product.getStock())
                .build();
    }
    public String updateProduct(
            Long productId,
            ProductRequest request,
            Shop shop) {

        Product product = productRepository.findByIdAndShop(productId, shop)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if (request.getName() != null) {
            product.setName(request.getName());
        }

        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }

        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }

        productRepository.save(product);

        return "Product updated successfully";
    }
    public String deleteProduct(Long productId, Shop shop) {

        Product product = productRepository.findByIdAndShop(productId, shop)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        productRepository.delete(product);

        return "Product deleted successfully";
    }
}

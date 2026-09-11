package com.example.SmartKhata.repository;

import com.example.SmartKhata.entity.Product;
import com.example.SmartKhata.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {

    List<Product> findByShop(Shop shop);
    Optional<Product> findByIdAndShop(Long id,Shop shop);
    boolean existsByNameAndShop(String name,Shop shop);

    @Query("""
        SELECT COUNT(p)
        FROM Product p
        WHERE p.shop = :shop
        """)
    Long getProductCount(
            @Param("shop") Shop shop
    );

    @Query("""
        SELECT COUNT(p)
        FROM Product p
        WHERE p.shop = :shop
        AND p.stock <= p.minimumStock
        """)
    Long getLowStockCount(
            @Param("shop") Shop shop
    );
}

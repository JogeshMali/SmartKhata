package com.example.SmartKhata.repository;

import com.example.SmartKhata.entity.Sale;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.enums.SaleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findByShopAndStatusOrderBySaleDateDesc(
            Shop shop,
            SaleStatus status
    );

    Optional<Sale> findByIdAndShopAndStatus(
            Long id,
            Shop shop,
            SaleStatus status
    );

    // Today's total sales
    @Query("""
            SELECT COALESCE(SUM(s.totalAmount), 0)
            FROM Sale s
            WHERE s.shop = :shop
            AND s.status = :status
            AND s.saleDate >= :start
            AND s.saleDate < :end
            """)
    BigDecimal getTodaySales(
            @Param("shop") Shop shop,
            @Param("status") SaleStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // Today's number of sales
    @Query("""
            SELECT COUNT(s)
            FROM Sale s
            WHERE s.shop = :shop
            AND s.status = :status
            AND s.saleDate >= :start
            AND s.saleDate < :end
            """)
    Long getTodaySaleCount(
            @Param("shop") Shop shop,
            @Param("status") SaleStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
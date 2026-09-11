package com.example.SmartKhata.repository;

import com.example.SmartKhata.entity.Customer;
import com.example.SmartKhata.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer,Long> {

    List<Customer> findByShop(Shop shop);
    List<Customer> findByShopAndNameContainingIgnoreCase(Shop shop,String name);
    boolean existsByShopAndPhone(Shop shop,String phone);
    @Query("""
        SELECT COUNT(c)
        FROM Customer c
        WHERE c.shop = :shop
        """)
    Long getCustomerCount(
            @Param("shop") Shop shop
    );

}

package com.example.SmartKhata.repository;

import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop,Long> {

    Optional<Shop> findByUser (User user);

}

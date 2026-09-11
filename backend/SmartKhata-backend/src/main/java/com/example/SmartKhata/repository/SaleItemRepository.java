package com.example.SmartKhata.repository;

import com.example.SmartKhata.entity.Sale;
import com.example.SmartKhata.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem,Long> {

    List<SaleItem> findBySale(Sale sale);
}

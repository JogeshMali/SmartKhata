package com.example.SmartKhata.repository;

import com.example.SmartKhata.entity.Expense;
import com.example.SmartKhata.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense,Long> {
    List<Expense> findByShopOrderByExpenseDateDesc(Shop shop);
    Optional<Expense> findByIdAndShop(Long id,Shop shop);
    @Query("""
            SELECT COALESCE(SUM(e.amount),0)
            FROM Expense e
            WHERE e.shop = :shop
            AND e.expenseDate = CURRENT_DATE
            """)
    BigDecimal getTodayExpenses(
            @Param("shop") Shop shop
    );
}

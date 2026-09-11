package com.example.SmartKhata.repository;

import com.example.SmartKhata.entity.Customer;
import com.example.SmartKhata.entity.Sale;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.entity.Transaction;
import com.example.SmartKhata.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> {

    List<Transaction> findByCustomerOrderByTransactionDateDesc(Customer customer);
    List<Transaction> findByCustomerAndType(Customer customer, TransactionType type);

    List<Transaction> findByCustomerAndTransactionDateBetween(
            Customer customer, LocalDateTime start, LocalDateTime end
    );
    @Query("""
            SELECT COALESCE(SUM(t.amount),0)
            FROM Transaction t
            WHERE t.customer=:customer
            AND t.type = :type
            """)
    BigDecimal getTotalAmountByCustomerAndType(
            @Param("customer") Customer customer,
            @Param("type") TransactionType type
    );
    Optional<Transaction> findBySale(Sale sale);
    @Query("""
        SELECT COALESCE(SUM(t.amount),0)
        FROM Transaction t
        WHERE t.customer.shop = :shop
        AND t.type = 'CREDIT'
        AND t.transactionStatus = 'ACTIVE'
        """)
    BigDecimal getOutstandingCredit(
            @Param("shop") Shop shop
    );
    List<Transaction> findByCustomerOrderByTransactionDateAsc(
            Customer customer
    );
}

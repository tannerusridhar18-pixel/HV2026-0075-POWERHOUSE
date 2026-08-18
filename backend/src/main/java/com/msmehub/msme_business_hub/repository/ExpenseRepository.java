package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query("select coalesce(sum(e.amount), 0) from Expense e")
    BigDecimal totalAmount();

    List<Expense> findAllByOrderByDateDesc();
}

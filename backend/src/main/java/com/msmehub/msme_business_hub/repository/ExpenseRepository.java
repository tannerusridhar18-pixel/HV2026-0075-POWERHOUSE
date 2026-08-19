package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

import java.util.Optional;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query("select coalesce(sum(e.amount), 0) from Expense e")
    BigDecimal totalAmount();

    @Query("select coalesce(sum(e.amount), 0) from Expense e where e.user.id = :userId")
    BigDecimal totalAmountByUserId(@Param("userId") Long userId);

    List<Expense> findAllByOrderByDateDesc();
    List<Expense> findAllByUserId(Long userId);
    List<Expense> findAllByUserIdOrderByDateDesc(Long userId);
    Optional<Expense> findByIdAndUserId(Long id, Long userId);
}

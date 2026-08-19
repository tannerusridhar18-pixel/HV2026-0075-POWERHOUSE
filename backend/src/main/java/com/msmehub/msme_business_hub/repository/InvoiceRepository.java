package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.util.Optional;

public interface InvoiceRepository
        extends JpaRepository<Invoice, Long> {

    boolean existsByOrderId(Long orderId);
    boolean existsByOrderIdAndUserId(Long orderId, Long userId);

    long countByUserId(Long userId);

    List<Invoice> findAllByOrderByIdDesc();
    List<Invoice> findAllByUserId(Long userId);
    List<Invoice> findAllByUserIdOrderByIdDesc(Long userId);
    Optional<Invoice> findByIdAndUserId(Long id, Long userId);
}
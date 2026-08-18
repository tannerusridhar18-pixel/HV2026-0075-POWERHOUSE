package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository
        extends JpaRepository<Invoice, Long> {

    boolean existsByOrderId(Long orderId);

    List<Invoice> findAllByOrderByIdDesc();
}
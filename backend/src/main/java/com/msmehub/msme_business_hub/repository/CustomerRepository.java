package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    long countByUserId(Long userId);
    List<Customer> findAllByUserId(Long userId);
    Optional<Customer> findByIdAndUserId(Long id, Long userId);
}

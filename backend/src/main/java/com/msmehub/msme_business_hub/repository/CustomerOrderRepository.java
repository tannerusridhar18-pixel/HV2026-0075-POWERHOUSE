package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.CustomerOrder;
import com.msmehub.msme_business_hub.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.util.Optional;

public interface CustomerOrderRepository
        extends JpaRepository<CustomerOrder, Long> {

    long countByStatus(OrderStatus status);
    long countByStatusAndUserId(OrderStatus status, Long userId);

    List<CustomerOrder> findAllByOrderByIdDesc();
    List<CustomerOrder> findAllByUserId(Long userId);
    List<CustomerOrder> findAllByUserIdOrderByIdDesc(Long userId);
    Optional<CustomerOrder> findByIdAndUserId(Long id, Long userId);
}
package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.CustomerOrder;
import com.msmehub.msme_business_hub.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerOrderRepository
        extends JpaRepository<CustomerOrder, Long> {

    long countByStatus(OrderStatus status);

    List<CustomerOrder> findAllByOrderByIdDesc();
}
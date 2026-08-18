package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    long countByStatus(com.msmehub.msme_business_hub.entity.OrderStatus status);
}

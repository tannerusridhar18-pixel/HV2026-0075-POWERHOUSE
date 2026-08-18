package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {}

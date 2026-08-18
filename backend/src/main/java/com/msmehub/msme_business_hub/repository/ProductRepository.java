package com.msmehub.msme_business_hub.repository;

import com.msmehub.msme_business_hub.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {}

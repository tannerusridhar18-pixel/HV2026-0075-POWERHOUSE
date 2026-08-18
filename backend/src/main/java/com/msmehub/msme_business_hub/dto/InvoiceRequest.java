package com.msmehub.msme_business_hub.dto;

import java.math.BigDecimal;

public record InvoiceRequest(Long customerId, Long orderId, BigDecimal amount, String status) {}

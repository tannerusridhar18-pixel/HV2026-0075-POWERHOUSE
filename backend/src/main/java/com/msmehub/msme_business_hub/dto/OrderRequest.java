package com.msmehub.msme_business_hub.dto;

import java.util.List;

public record OrderRequest(Long customerId, List<OrderItemRequest> items) {}

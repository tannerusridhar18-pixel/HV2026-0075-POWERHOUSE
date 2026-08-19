package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.entity.OrderStatus;
import com.msmehub.msme_business_hub.repository.CustomerOrderRepository;
import com.msmehub.msme_business_hub.repository.ExpenseRepository;
import com.msmehub.msme_business_hub.repository.InvoiceRepository;
import com.msmehub.msme_business_hub.repository.ProductRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final CustomerOrderRepository orderRepository;
    private final ExpenseRepository expenseRepository;
    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;

    public DashboardController(CustomerOrderRepository orderRepository,
                               ExpenseRepository expenseRepository,
                               InvoiceRepository invoiceRepository,
                               ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.expenseRepository = expenseRepository;
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public Map<String, Object> summary() {
        Long userId = getCurrentUserId();

        BigDecimal totalSales = orderRepository.findAllByUserId(userId).stream()
                .map(order -> order.getTotal() == null ? BigDecimal.ZERO : order.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = expenseRepository.totalAmountByUserId(userId);
        BigDecimal estimatedProfit = totalSales.subtract(totalExpenses);
        long pendingOrders = orderRepository.countByStatusAndUserId(OrderStatus.PENDING, userId);
        long lowStockProducts = productRepository.findAllByUserId(userId).stream()
                .filter(product -> product.getStock() != null && product.getStock() < 100)
                .count();
        long invoiceCount = invoiceRepository.countByUserId(userId);

        return Map.of(
                "totalSales", totalSales,
                "totalExpenses", totalExpenses,
                "estimatedProfit", estimatedProfit,
                "pendingOrders", pendingOrders,
                "lowStockProducts", lowStockProducts,
                "invoiceCount", invoiceCount
        );
    }

    private Long getCurrentUserId() {
        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Long) {
            return (Long) auth.getPrincipal();
        }
        throw new org.springframework.security.access.AccessDeniedException("Unauthorized access.");
    }
}

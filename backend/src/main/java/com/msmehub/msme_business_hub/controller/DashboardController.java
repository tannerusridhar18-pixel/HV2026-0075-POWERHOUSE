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
        BigDecimal totalSales = orderRepository.findAll().stream()
                .map(order -> order.getTotal() == null ? BigDecimal.ZERO : order.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = expenseRepository.totalAmount();
        BigDecimal estimatedProfit = totalSales.subtract(totalExpenses);
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long lowStockProducts = productRepository.findAll().stream()
                .filter(product -> product.getStock() < 100)
                .count();

        return Map.of(
                "totalSales", totalSales,
                "totalExpenses", totalExpenses,
                "estimatedProfit", estimatedProfit,
                "pendingOrders", pendingOrders,
                "lowStockProducts", lowStockProducts,
                "invoiceCount", invoiceRepository.count()
        );
    }
}

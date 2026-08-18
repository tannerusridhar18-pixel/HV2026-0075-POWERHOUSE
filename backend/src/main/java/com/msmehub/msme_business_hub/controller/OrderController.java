package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.dto.OrderItemRequest;
import com.msmehub.msme_business_hub.dto.OrderRequest;
import com.msmehub.msme_business_hub.dto.StatusRequest;
import com.msmehub.msme_business_hub.entity.*;
import com.msmehub.msme_business_hub.exception.ResourceNotFoundException;
import com.msmehub.msme_business_hub.repository.CustomerOrderRepository;
import com.msmehub.msme_business_hub.repository.CustomerRepository;
import com.msmehub.msme_business_hub.repository.ProductRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final CustomerOrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderController(CustomerOrderRepository orderRepository,
                           CustomerRepository customerRepository,
                           ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<CustomerOrder> getAll() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public CustomerOrder getById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    @PostMapping
    @Transactional
    public CustomerOrder create(@RequestBody OrderRequest request) {
        if (request.customerId() == null || request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("customerId and at least one order item are required");
        }

        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + request.customerId()));

        CustomerOrder order = new CustomerOrder();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        long nextNumber = 10000L + orderRepository.count() + 1;
        order.setOrderNumber("ORD-" + nextNumber);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.items()) {
            if (itemRequest.productId() == null || itemRequest.quantity() == null || itemRequest.quantity() < 1) {
                throw new IllegalArgumentException("Each item requires a valid productId and quantity");
            }

            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.productId()));

            if (product.getStock() < itemRequest.quantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            BigDecimal lineTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.quantity()))
                    .setScale(2, RoundingMode.HALF_UP);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(product.getPrice());
            item.setLineTotal(lineTotal);
            order.getItems().add(item);

            product.setStock(product.getStock() - itemRequest.quantity());
            productRepository.save(product);

            subtotal = subtotal.add(lineTotal);
        }

        BigDecimal tax = subtotal.multiply(new BigDecimal("0.18"))
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(tax).setScale(2, RoundingMode.HALF_UP);

        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setTotal(total);

        return orderRepository.save(order);
    }

    @PutMapping("/{id}/status")
    @Transactional
    public CustomerOrder updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        CustomerOrder order = getById(id);
        try {
            order.setStatus(OrderStatus.valueOf(request.status().trim().toUpperCase()));
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid order status");
        }
        return orderRepository.save(order);
    }
}

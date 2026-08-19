package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.dto.OrderItemRequest;
import com.msmehub.msme_business_hub.dto.OrderRequest;
import com.msmehub.msme_business_hub.dto.StatusRequest;
import com.msmehub.msme_business_hub.entity.Customer;
import com.msmehub.msme_business_hub.entity.CustomerOrder;
import com.msmehub.msme_business_hub.entity.OrderItem;
import com.msmehub.msme_business_hub.entity.OrderStatus;
import com.msmehub.msme_business_hub.entity.Product;
import com.msmehub.msme_business_hub.exception.ResourceNotFoundException;
import com.msmehub.msme_business_hub.repository.CustomerOrderRepository;
import com.msmehub.msme_business_hub.repository.CustomerRepository;
import com.msmehub.msme_business_hub.repository.ProductRepository;
import com.msmehub.msme_business_hub.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final CustomerOrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderController(
            CustomerOrderRepository orderRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<CustomerOrder> getAll() {
        Long userId = getCurrentUserId();
        List<CustomerOrder> orders =
                orderRepository.findAllByUserIdOrderByIdDesc(userId);

        /*
         * Force all relationships needed by the frontend
         * to be initialized while the transaction is active.
         */
        orders.forEach(order -> {
            if (order.getCustomer() != null) {
                order.getCustomer().getName();
            }

            order.getItems().forEach(item -> {
                if (item.getProduct() != null) {
                    item.getProduct().getName();
                    item.getProduct().getPrice();
                    item.getProduct().getStock();
                }
            });
        });

        return orders;
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public CustomerOrder getById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        CustomerOrder order =
                orderRepository.findByIdAndUserId(id, userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found: " + id
                                )
                        );

        if (order.getCustomer() != null) {
            order.getCustomer().getName();
        }

        order.getItems().forEach(item -> {
            if (item.getProduct() != null) {
                item.getProduct().getName();
                item.getProduct().getPrice();
                item.getProduct().getStock();
            }
        });

        return order;
    }

    @PostMapping
    @Transactional
    public CustomerOrder create(
            @RequestBody OrderRequest request
    ) {
        Long userId = getCurrentUserId();

        if (request == null) {
            throw new IllegalArgumentException(
                    "Order request is required"
            );
        }

        if (request.customerId() == null) {
            throw new IllegalArgumentException(
                    "Customer is required"
            );
        }

        if (request.items() == null ||
                request.items().isEmpty()) {
            throw new IllegalArgumentException(
                    "At least one product is required"
            );
        }

        Customer customer =
                customerRepository.findByIdAndUserId(
                        request.customerId(),
                        userId
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found: "
                                        + request.customerId()
                        )
                );

        /*
         * Combine duplicate products.
         */
        Map<Long, Integer> quantities =
                new HashMap<>();

        for (OrderItemRequest item :
                request.items()) {

            if (item == null ||
                    item.productId() == null) {

                throw new IllegalArgumentException(
                        "Invalid product"
                );
            }

            if (item.quantity() == null ||
                    item.quantity() < 1) {

                throw new IllegalArgumentException(
                        "Quantity must be at least 1"
                );
            }

            quantities.merge(
                    item.productId(),
                    item.quantity(),
                    Integer::sum
            );
        }

        CustomerOrder order =
                new CustomerOrder();

        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setUser(userRepository.getReferenceById(userId));

        /*
         * Temporary number because ID is not
         * generated until save().
         */
        order.setOrderNumber(
                "TEMP-" + System.nanoTime()
        );

        BigDecimal subtotal =
                BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry :
                quantities.entrySet()) {

            Long productId = entry.getKey();
            Integer quantity = entry.getValue();

            Product product =
                    productRepository.findByIdAndUserId(productId, userId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Product not found: "
                                                    + productId
                                    )
                            );

            int stock =
                    product.getStock() == null
                            ? 0
                            : product.getStock();

            if (stock < quantity) {
                throw new IllegalArgumentException(
                        "Insufficient stock for "
                                + product.getName()
                                + ". Available stock: "
                                + stock
                );
            }

            if (product.getPrice() == null) {
                throw new IllegalArgumentException(
                        "Product price is missing for "
                                + product.getName()
                );
            }

            BigDecimal lineTotal =
                    product.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(quantity)
                            )
                            .setScale(
                                    2,
                                    RoundingMode.HALF_UP
                            );

            OrderItem orderItem =
                    new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setLineTotal(lineTotal);

            order.getItems().add(orderItem);

            product.setStock(
                    stock - quantity
            );

            productRepository.save(product);

            subtotal =
                    subtotal.add(lineTotal);
        }

        subtotal =
                subtotal.setScale(
                        2,
                        RoundingMode.HALF_UP
                );

        BigDecimal tax =
                subtotal
                        .multiply(
                                new BigDecimal("0.18")
                        )
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        BigDecimal total =
                subtotal
                        .add(tax)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setTotal(total);

        CustomerOrder saved =
                orderRepository.save(order);

        /*
         * Now the database ID exists.
         */
        saved.setOrderNumber(
                "ORD-" + (10000L + saved.getId())
        );

        return orderRepository.save(saved);
    }

    @PutMapping("/{id}/status")
    @Transactional
    public CustomerOrder updateStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request
    ) {
        if (request == null ||
                request.status() == null ||
                request.status().isBlank()) {

            throw new IllegalArgumentException(
                    "Order status is required"
            );
        }

        CustomerOrder order =
                getById(id);

        try {
            order.setStatus(
                    OrderStatus.valueOf(
                            request.status()
                                    .trim()
                                    .toUpperCase()
                    )
            );
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Invalid order status"
            );
        }

        return orderRepository.save(order);
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
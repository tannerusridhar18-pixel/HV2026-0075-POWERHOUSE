package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.dto.InvoiceRequest;
import com.msmehub.msme_business_hub.entity.Customer;
import com.msmehub.msme_business_hub.entity.CustomerOrder;
import com.msmehub.msme_business_hub.entity.Invoice;
import com.msmehub.msme_business_hub.entity.InvoiceStatus;
import com.msmehub.msme_business_hub.exception.ResourceNotFoundException;
import com.msmehub.msme_business_hub.repository.CustomerOrderRepository;
import com.msmehub.msme_business_hub.repository.CustomerRepository;
import com.msmehub.msme_business_hub.repository.InvoiceRepository;
import com.msmehub.msme_business_hub.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final CustomerOrderRepository orderRepository;
    private final UserRepository userRepository;

    public InvoiceController(
            InvoiceRepository invoiceRepository,
            CustomerRepository customerRepository,
            CustomerOrderRepository orderRepository,
            UserRepository userRepository
    ) {
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    /*
     * GET ALL INVOICES
     */
    @GetMapping
    @Transactional(readOnly = true)
    public List<Invoice> getAll() {
        Long userId = getCurrentUserId();
        List<Invoice> invoices =
                invoiceRepository.findAllByUserIdOrderByIdDesc(userId);

        /*
         * Force Hibernate to initialize all data
         * required by the frontend while the
         * transaction is still active.
         */
        invoices.forEach(invoice -> {

            if (invoice.getCustomer() != null) {
                invoice.getCustomer().getName();
                invoice.getCustomer().getPhone();
                invoice.getCustomer().getEmail();
                invoice.getCustomer().getGstin();
            }

            CustomerOrder order =
                    invoice.getOrder();

            if (order != null) {

                if (order.getCustomer() != null) {
                    order.getCustomer().getName();
                }

                order.getItems().forEach(item -> {

                    if (item.getProduct() != null) {
                        item.getProduct().getName();
                        item.getProduct().getPrice();
                    }
                });
            }
        });

        return invoices;
    }

    /*
     * GET ONE INVOICE
     */
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public Invoice getById(
            @PathVariable Long id
    ) {
        Long userId = getCurrentUserId();
        Invoice invoice =
                invoiceRepository.findByIdAndUserId(id, userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Invoice not found: " + id
                                )
                        );

        if (invoice.getCustomer() != null) {
            invoice.getCustomer().getName();
            invoice.getCustomer().getPhone();
            invoice.getCustomer().getEmail();
            invoice.getCustomer().getGstin();
        }

        CustomerOrder order =
                invoice.getOrder();

        if (order != null) {

            if (order.getCustomer() != null) {
                order.getCustomer().getName();
            }

            order.getItems().forEach(item -> {

                if (item.getProduct() != null) {
                    item.getProduct().getName();
                    item.getProduct().getPrice();
                }
            });
        }

        return invoice;
    }

    /*
     * CREATE INVOICE
     */
    @PostMapping
    @Transactional
    public Invoice create(
            @RequestBody InvoiceRequest request
    ) {
        Long userId = getCurrentUserId();

        if (request == null) {
            throw new IllegalArgumentException(
                    "Invoice request is required"
            );
        }

        if (request.customerId() == null) {
            throw new IllegalArgumentException(
                    "Customer is required"
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

        CustomerOrder order = null;

        /*
         * If an order was selected,
         * load it from the database.
         */
        if (request.orderId() != null) {

            order =
                    orderRepository.findByIdAndUserId(
                            request.orderId(),
                            userId
                    ).orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Order not found: "
                                            + request.orderId()
                            )
                    );

            /*
             * Make sure the selected customer
             * actually owns the order.
             */
            if (order.getCustomer() == null ||
                    !order.getCustomer()
                            .getId()
                            .equals(customer.getId())) {

                throw new IllegalArgumentException(
                        "Selected customer does not belong "
                                + "to the selected order."
                );
            }

            /*
             * One order = one invoice.
             *
             * This prevents a database constraint
             * error from becoming HTTP 500.
             */
            if (invoiceRepository.existsByOrderIdAndUserId(
                    request.orderId(),
                    userId
            )) {

                throw new IllegalArgumentException(
                        "An invoice already exists for order "
                                + order.getOrderNumber()
                );
            }
        }

        /*
         * Determine invoice amount.
         */
        BigDecimal amount;

        if (order != null) {

            amount = order.getTotal();

            if (amount == null ||
                    amount.compareTo(BigDecimal.ZERO) <= 0) {

                throw new IllegalArgumentException(
                        "Selected order has an invalid total."
                );
            }

        } else {

            if (request.amount() == null ||
                    request.amount()
                            .compareTo(BigDecimal.ZERO) <= 0) {

                throw new IllegalArgumentException(
                        "Amount is required for a manual invoice."
                );
            }

            amount =
                    request.amount()
                            .setScale(
                                    2,
                                    RoundingMode.HALF_UP
                            );
        }

        /*
         * Invoice status.
         */
        InvoiceStatus status =
                InvoiceStatus.GENERATED;

        if (request.status() != null &&
                !request.status().isBlank()) {

            try {

                status =
                        InvoiceStatus.valueOf(
                                request.status()
                                        .trim()
                                        .toUpperCase()
                        );

            } catch (IllegalArgumentException exception) {

                throw new IllegalArgumentException(
                        "Invalid invoice status."
                );
            }
        }

        Invoice invoice =
                new Invoice();

        invoice.setCustomer(customer);
        invoice.setOrder(order);
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setAmount(amount);
        invoice.setStatus(status);
        invoice.setUser(userRepository.getReferenceById(userId));

        /*
         * Temporary unique number.
         *
         * The final number is generated after
         * the database creates the invoice ID.
         */
        invoice.setInvoiceNumber(
                "TEMP-" + System.nanoTime()
        );

        Invoice saved =
                invoiceRepository.save(invoice);

        /*
         * Stable invoice number.
         */
        saved.setInvoiceNumber(
                "INV-" + (10000L + saved.getId())
        );

        return invoiceRepository.save(saved);
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
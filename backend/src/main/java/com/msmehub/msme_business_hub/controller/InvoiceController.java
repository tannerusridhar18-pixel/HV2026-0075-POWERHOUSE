package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.dto.InvoiceRequest;
import com.msmehub.msme_business_hub.entity.*;
import com.msmehub.msme_business_hub.exception.ResourceNotFoundException;
import com.msmehub.msme_business_hub.repository.CustomerOrderRepository;
import com.msmehub.msme_business_hub.repository.CustomerRepository;
import com.msmehub.msme_business_hub.repository.InvoiceRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final CustomerOrderRepository orderRepository;

    public InvoiceController(InvoiceRepository invoiceRepository,
                             CustomerRepository customerRepository,
                             CustomerOrderRepository orderRepository) {
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public List<Invoice> getAll() {
        return invoiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public Invoice getById(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
    }

    @PostMapping
    public Invoice create(@RequestBody InvoiceRequest request) {
        if (request.customerId() == null) {
            throw new IllegalArgumentException("customerId is required");
        }

        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + request.customerId()));

        Invoice invoice = new Invoice();
        invoice.setCustomer(customer);
        invoice.setOrder(request.orderId() == null ? null :
                orderRepository.findById(request.orderId())
                        .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + request.orderId())));

        invoice.setInvoiceNumber("INV-" + (10000L + invoiceRepository.count() + 1));
        invoice.setInvoiceDate(LocalDate.now());

        if (request.amount() != null) {
            invoice.setAmount(request.amount());
        } else if (invoice.getOrder() != null) {
            invoice.setAmount(invoice.getOrder().getTotal());
        } else {
            throw new IllegalArgumentException("amount is required when orderId is not provided");
        }

        if (request.status() != null) {
            try {
                invoice.setStatus(InvoiceStatus.valueOf(request.status().trim().toUpperCase()));
            } catch (Exception ex) {
                throw new IllegalArgumentException("Invalid invoice status");
            }
        }

        return invoiceRepository.save(invoice);
    }
}

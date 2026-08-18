package com.msmehub.msme_business_hub.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "invoice_number",
            unique = true,
            nullable = false
    )
    private String invoiceNumber;

    /*
     * EAGER is intentional here.
     *
     * The invoice list needs customer information,
     * and we don't want Jackson to try to load a
     * lazy Customer after the Hibernate session closes.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(
            name = "customer_id",
            nullable = false
    )
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Customer customer;

    /*
     * An order can have one invoice.
     *
     * EAGER allows the invoice response to contain
     * the order information needed by the frontend.
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "order_id",
            unique = true
    )
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private CustomerOrder order;

    @Column(nullable = false)
    private LocalDate invoiceDate;

    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal amount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status =
            InvoiceStatus.GENERATED;

    public Invoice() {
    }

    public Long getId() {
        return id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public Customer getCustomer() {
        return customer;
    }

    public CustomerOrder getOrder() {
        return order;
    }

    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public InvoiceStatus getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setOrder(CustomerOrder order) {
        this.order = order;
    }

    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setStatus(InvoiceStatus status) {
        this.status = status;
    }
}
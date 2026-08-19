package com.msmehub.msme_business_hub.config;

import com.msmehub.msme_business_hub.entity.*;
import com.msmehub.msme_business_hub.repository.*;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
public class DataInitializer {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CustomerOrderRepository orderRepository;
    private final ExpenseRepository expenseRepository;
    private final InvoiceRepository invoiceRepository;

    public DataInitializer(
            UserRepository userRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            CustomerOrderRepository orderRepository,
            ExpenseRepository expenseRepository,
            InvoiceRepository invoiceRepository
    ) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.expenseRepository = expenseRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Bean
    @Transactional
    public ApplicationRunner initializeData() {
        return args -> {
            List<User> allUsers = userRepository.findAll();
            if (allUsers.isEmpty()) {
                System.out.println("DataInitializer: No users found. Skipping orphan data assignment.");
                return;
            }

            User firstUser = allUsers.get(0);
            System.out.println("DataInitializer: Assigning orphan records (user_id = null) to user: " 
                    + firstUser.getEmail());

            // 1. Customers
            List<Customer> customers = customerRepository.findAll();
            int customerUpdates = 0;
            for (Customer c : customers) {
                if (c.getUser() == null) {
                    c.setUser(firstUser);
                    customerRepository.save(c);
                    customerUpdates++;
                }
            }

            // 2. Products
            List<Product> products = productRepository.findAll();
            int productUpdates = 0;
            for (Product p : products) {
                if (p.getUser() == null) {
                    p.setUser(firstUser);
                    productRepository.save(p);
                    productUpdates++;
                }
            }

            // 3. Orders
            List<CustomerOrder> orders = orderRepository.findAll();
            int orderUpdates = 0;
            for (CustomerOrder o : orders) {
                if (o.getUser() == null) {
                    o.setUser(firstUser);
                    orderRepository.save(o);
                    orderUpdates++;
                }
            }

            // 4. Expenses
            List<Expense> expenses = expenseRepository.findAll();
            int expenseUpdates = 0;
            for (Expense e : expenses) {
                if (e.getUser() == null) {
                    e.setUser(firstUser);
                    expenseRepository.save(e);
                    expenseUpdates++;
                }
            }

            // 5. Invoices
            List<Invoice> invoices = invoiceRepository.findAll();
            int invoiceUpdates = 0;
            for (Invoice i : invoices) {
                if (i.getUser() == null) {
                    i.setUser(firstUser);
                    invoiceRepository.save(i);
                    invoiceUpdates++;
                }
            }

            System.out.printf("DataInitializer complete. Updated: Customers: %d, Products: %d, Orders: %d, Expenses: %d, Invoices: %d%n",
                    customerUpdates, productUpdates, orderUpdates, expenseUpdates, invoiceUpdates);
        };
    }
}

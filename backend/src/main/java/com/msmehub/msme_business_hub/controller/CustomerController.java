package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.entity.Customer;
import com.msmehub.msme_business_hub.exception.ResourceNotFoundException;
import com.msmehub.msme_business_hub.repository.CustomerRepository;
import com.msmehub.msme_business_hub.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerRepository repository;
    private final UserRepository userRepository;

    public CustomerController(CustomerRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Customer> getAll() {
        return repository.findAllByUserId(getCurrentUserId());
    }

    @GetMapping("/{id}")
    public Customer getById(@PathVariable Long id) {
        return repository.findByIdAndUserId(id, getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
    }

    @PostMapping
    public Customer create(@Valid @RequestBody Customer customer) {
        customer.setId(null);
        customer.setUser(userRepository.getReferenceById(getCurrentUserId()));
        return repository.save(customer);
    }

    @PutMapping("/{id}")
    public Customer update(
            @PathVariable Long id,
            @Valid @RequestBody Customer updatedCustomer) {

        Customer customer = repository.findByIdAndUserId(id, getCurrentUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found: " + id));

        customer.setName(updatedCustomer.getName());
        customer.setPhone(updatedCustomer.getPhone());
        customer.setEmail(updatedCustomer.getEmail());
        customer.setGstin(updatedCustomer.getGstin());
        customer.setAddress(updatedCustomer.getAddress());

        return repository.save(customer);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        Customer customer = repository.findByIdAndUserId(id, getCurrentUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found: " + id));

        repository.delete(customer);
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

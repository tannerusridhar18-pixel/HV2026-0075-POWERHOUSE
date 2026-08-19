package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.entity.Product;
import com.msmehub.msme_business_hub.exception.ResourceNotFoundException;
import com.msmehub.msme_business_hub.repository.ProductRepository;
import com.msmehub.msme_business_hub.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository repository;
    private final UserRepository userRepository;

    public ProductController(ProductRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Product> getAll() {
        return repository.findAllByUserId(getCurrentUserId());
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return repository.findByIdAndUserId(id, getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    @PostMapping
    public Product create(@Valid @RequestBody Product product) {
        product.setId(null);
        product.setUser(userRepository.getReferenceById(getCurrentUserId()));
        return repository.save(product);
    }

    @PutMapping("/{id}")
    public Product update(
            @PathVariable Long id,
            @Valid @RequestBody Product updatedProduct) {

        Product product = repository.findByIdAndUserId(id, getCurrentUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found: " + id));

        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());

        return repository.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        Product product = repository.findByIdAndUserId(id, getCurrentUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found: " + id));

        repository.delete(product);
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

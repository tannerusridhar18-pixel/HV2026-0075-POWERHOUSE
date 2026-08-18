package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.entity.Product;
import com.msmehub.msme_business_hub.exception.ResourceNotFoundException;
import com.msmehub.msme_business_hub.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Product> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    @PostMapping
    public Product create(@Valid @RequestBody Product product) {
        product.setId(null);
        return repository.save(product);
    }
    @PutMapping("/{id}")
public Product update(
        @PathVariable Long id,
        @Valid @RequestBody Product updatedProduct) {

    Product product = repository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Product not found: " + id));

    product.setName(updatedProduct.getName());
    product.setPrice(updatedProduct.getPrice());
    product.setStock(updatedProduct.getStock());

    return repository.save(product);
}

@DeleteMapping("/{id}")
public void delete(@PathVariable Long id) {

    Product product = repository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Product not found: " + id));

    repository.delete(product);
}
}

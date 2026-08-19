package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.entity.Expense;
import com.msmehub.msme_business_hub.repository.ExpenseRepository;
import com.msmehub.msme_business_hub.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseRepository repository;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Expense> getAll() {
        return repository.findAllByUserIdOrderByDateDesc(getCurrentUserId());
    }

    @PostMapping
    public Expense create(@Valid @RequestBody Expense expense) {
        expense.setId(null);
        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }
        expense.setUser(userRepository.getReferenceById(getCurrentUserId()));
        return repository.save(expense);
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

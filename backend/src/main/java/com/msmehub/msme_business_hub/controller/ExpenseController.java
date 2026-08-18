package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.entity.Expense;
import com.msmehub.msme_business_hub.repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseRepository repository;

    public ExpenseController(ExpenseRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Expense> getAll() {
        return repository.findAllByOrderByDateDesc();
    }

    @PostMapping
    public Expense create(@Valid @RequestBody Expense expense) {
        expense.setId(null);
        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }
        return repository.save(expense);
    }
}

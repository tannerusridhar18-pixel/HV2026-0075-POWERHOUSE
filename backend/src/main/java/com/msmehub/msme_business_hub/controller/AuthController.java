package com.msmehub.msme_business_hub.controller;

import com.msmehub.msme_business_hub.dto.*;
import com.msmehub.msme_business_hub.entity.User;
import com.msmehub.msme_business_hub.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users; private final PasswordEncoder encoder;
    public AuthController(UserRepository users,PasswordEncoder encoder){this.users=users;this.encoder=encoder;}

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest r){
        String email=r.email().trim().toLowerCase();
        if(users.existsByEmailIgnoreCase(email)) throw new IllegalArgumentException("An account already exists for this email.");
        User u=new User(); u.setBusinessName(r.businessName().trim()); u.setOwnerName(r.ownerName().trim()); u.setEmail(email); u.setPhone(r.phone().trim());
        u.setGstin(r.gstin()); u.setBusinessType(r.businessType()); u.setPasswordHash(encoder.encode(r.password())); u=users.save(u);
        return response(u);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest r){
        User u=users.findByEmailIgnoreCase(r.email().trim()).orElseThrow(()->new IllegalArgumentException("Invalid email or password."));
        if(!encoder.matches(r.password(),u.getPasswordHash())) throw new IllegalArgumentException("Invalid email or password.");
        return response(u);
    }

    private AuthResponse response(User u){return new AuthResponse(UUID.randomUUID().toString(),u.getId(),u.getBusinessName(),u.getOwnerName(),u.getEmail());}
}

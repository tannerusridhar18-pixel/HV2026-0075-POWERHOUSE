package com.msmehub.msme_business_hub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(@NotBlank String businessName,@NotBlank String ownerName,@NotBlank @Email String email,@NotBlank String phone,String gstin,String businessType,@NotBlank @Size(min=6) String password) {}

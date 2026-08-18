package com.msmehub.msme_business_hub.ai.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record AIChatRequest(

        @NotBlank(message = "Message is required")
        String message,

        @Valid
        List<ChatMessage> history
) {

    public record ChatMessage(
            String role,
            String content
    ) {
    }
}
package com.msmehub.msme_business_hub.ai.controller;

import com.msmehub.msme_business_hub.ai.dto.AIChatRequest;
import com.msmehub.msme_business_hub.ai.dto.AIChatResponse;
import com.msmehub.msme_business_hub.ai.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final GeminiService geminiService;

    public AIController(
            GeminiService geminiService
    ) {
        this.geminiService =
                geminiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(
            @Valid
            @RequestBody
            AIChatRequest request
    ) {

        try {
            Long userId = getCurrentUserId();
            String response =
                    geminiService.chat(request, userId);

            return ResponseEntity.ok(
                    new AIChatResponse(response)
            );

        } catch (IllegalStateException exception) {

            return ResponseEntity
                    .status(
                            HttpStatus.SERVICE_UNAVAILABLE
                    )
                    .body(
                            Map.of(
                                    "error",
                                    exception.getMessage()
                            )
                    );
        }
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
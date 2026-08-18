package com.msmehub.msme_business_hub.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class AIConfig {

    @Bean
    public RestClient openAIClient() {
        return RestClient.builder()
                .baseUrl("https://api.openai.com")
                .build();
    }
}
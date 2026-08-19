package com.msmehub.msme_business_hub.config;

import tools.jackson.databind.ObjectMapper;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {
    private static final String SECRET = "a-very-secure-secret-key-that-is-at-least-256-bits-long-for-hmac-sha-256-msme360";
    private static final ObjectMapper mapper = new ObjectMapper();

    public static String generateToken(Long userId, String email) {
        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", userId);
            claims.put("email", email);
            claims.put("exp", System.currentTimeMillis() + 864000000L); // 10 days
            
            String payload = mapper.writeValueAsString(claims);
            String header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
            
            String headerBase64 = base64UrlEncode(header);
            String payloadBase64 = base64UrlEncode(payload);
            
            String signature = sign(headerBase64 + "." + payloadBase64, SECRET);
            return headerBase64 + "." + payloadBase64 + "." + signature;
        } catch (Exception e) {
            throw new RuntimeException("Error generating token", e);
        }
    }

    public static Map<String, Object> validateTokenAndGetClaims(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }
            
            String headerBase64 = parts[0];
            String payloadBase64 = parts[1];
            String signature = parts[2];
            
            // Verify signature
            String expectedSignature = sign(headerBase64 + "." + payloadBase64, SECRET);
            if (!expectedSignature.equals(signature)) {
                return null;
            }
            
            // Decode payload
            String payload = new String(Base64.getUrlDecoder().decode(payloadBase64), StandardCharsets.UTF_8);
            Map<String, Object> claims = mapper.readValue(payload, Map.class);
            
            // Check expiration
            Long exp = ((Number) claims.get("exp")).longValue();
            if (System.currentTimeMillis() > exp) {
                return null;
            }
            
            return claims;
        } catch (Exception e) {
            return null;
        }
    }

    private static String base64UrlEncode(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private static String sign(String data, String secret) {
        try {
            Mac sha256HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256HMAC.init(secretKey);
            byte[] hash = sha256HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Error signing token", e);
        }
    }
}

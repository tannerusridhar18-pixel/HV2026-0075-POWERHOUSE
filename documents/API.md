# API Documentation
**Repository:** `tannerusridhar18-pixel/HV2026-0075-POWERHOUSE`  
**Base URL:** `https://api.powerhouse.local/v1`  
**Authentication:** Bearer Token (`Authorization: Bearer <JWT_TOKEN>`)

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates a user and returns a JWT session token.

* **Request Body:**
```json
{
  "email": "operator@powerhouse.io",
  "password": "SecurePassword123!"
}
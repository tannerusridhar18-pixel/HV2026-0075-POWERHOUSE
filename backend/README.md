# MSME SmartBiz Hub Backend

Java 21 + Spring Boot 4.0.7 + MySQL. Includes registration/login persistence and the business APIs.

Run: `mvn clean test` then `mvn spring-boot:run`.

Auth: POST `/api/auth/register`, POST `/api/auth/login`.
Business APIs: `/api/customers`, `/api/products`, `/api/orders`, `/api/invoices`, `/api/expenses`, `/api/dashboard`.

MySQL URL includes `allowPublicKeyRetrieval=true`. Default DB is `msme_smartbiz_hub`, user `root`, password `root`; change `DB_PASSWORD` if needed.

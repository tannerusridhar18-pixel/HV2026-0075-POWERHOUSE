# MSME SmartBiz Hub Backend

Spring Boot 4 + Java 21 + MySQL backend generated to match the current frontend API contract.

## API endpoints

- GET/POST `/api/customers`
- GET/POST `/api/products`
- GET/POST `/api/orders`
- GET `/api/orders/{id}`
- PUT `/api/orders/{id}/status`
- GET/POST `/api/invoices`
- GET `/api/invoices/{id}`
- GET/POST `/api/expenses`
- GET `/api/dashboard`

## MySQL

Default values:

- database: `msme_smartbiz_hub`
- username: `root`
- password: `root`

Override them with environment variables:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

## Run

From the backend directory:

```bash
mvnw.cmd clean package
mvnw.cmd spring-boot:run
```

The API runs on:

`http://localhost:8080`

The current frontend Axios service already points to that base URL.

# MSME SmartBiz Hub - Fixed Frontend

This version keeps the React/Vite application structure and connects the pages to the Spring Boot backend.

## Important fixes

- Registration calls `/api/auth/register`.
- Login calls `/api/auth/login`.
- User ID and account information are stored after authentication.
- Business pages send `ownerId` to the backend.
- Customers, products, orders, invoices, expenses and dashboard use backend data.
- Duplicate `/login` route removed.
- `Statcard.jsx` is replaced by `StatCard.jsx`.
- Vite API URL can be overridden with `VITE_API_URL`.

## Run

```bash
npm install
npm run dev
```

Backend default:

`http://localhost:8080`

Optional `.env`:

```text
VITE_API_URL=http://localhost:8080
```

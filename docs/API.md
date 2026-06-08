# API Summary

Base: `/api`

Key endpoints:
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login, returns `{ access_token }`
- `GET /api/skus/:id` — get SKU
- `POST /api/barcodes/scan` — body `{ code }` returns SKU + inventory levels
- `POST /api/orders` — create order (protected)
- `POST /api/payments/webhook` — payments webhook to finalize orders (protected)
- `POST /api/automation/events` — publish events for automation
- `GET /api/docs` — OpenAPI/Swagger UI

Auth: Bearer JWT in `Authorization` header

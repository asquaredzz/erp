# ERP Backend (Inventory core)

Quickstart:

1. Copy `.env.sample` to `.env` and set Postgres connection values.
2. Install dependencies:

```bash
cd erp/backend
npm install
```

3. Run in dev mode:

```bash
npm run start:dev
```

Notes:
- This scaffold contains a minimal NestJS + TypeORM Inventory module (SKU, Barcode, Warehouse, InventoryLevel, InventoryTransaction).
- It expects the Postgres schema to be created (see `erp/db/schema.sql`).

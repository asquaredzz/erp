System Architecture — SKU-first, Barcode-driven ERP+CRM

Overview
- Frontend: React/Next.js apps (Admin dashboard, Inventory UI, POS UI, CRM dashboard)
- API Layer: REST/GraphQL endpoints (NestJS preferred)
- Backend Services (microservices or monolith with modules):
  - Inventory Service (SKU & Barcode engine, Inventory Levels, Transactions)
  - Order Service (Order lifecycle, reservations, payments)
  - Procurement Service (Suppliers, POs, reordering)
  - Finance Service (costs, invoices, journals)
  - CRM Service (customers, leads, lifecycle)
  - Automation Engine (event bus, rules, tasks)
  - Auth & RBAC Service (JWT, permissions)
- Database: PostgreSQL (single source of truth for SKU & inventory)
- Optional: Redis for caching, queueing, and locks

Data Flow (high level)
- Barcode scan -> Frontend POS or Warehouse UI -> API -> Inventory Service resolves SKU by barcode
- Order creation -> Order Service validates stock via Inventory Service -> stock reserved (Inventory Transactions created)
- Payment completion -> Order Service finalizes order -> Inventory Transaction SALE created -> Finance updated -> CRM updated
- Procurement automation triggers when low-stock events are emitted by Inventory Service

Design Principles
- SKU-first: every entity references SKU ID for product identity
- Inventory as single source of truth: all stock changes are persisted via Inventory Transactions
- Event-driven: services communicate via events (e.g., Kafka, Redis Streams) for scale and decoupling
- Multi-warehouse & bin-level tracking
- Auditable transaction logs for every stock movement

APIs (examples)
- GET /api/skus/:id
- POST /api/barcodes/scan -> returns SKU, available stock per warehouse
- POST /api/orders -> creates order, reserves stock
- POST /api/inventory/transactions -> append manual adjustments

Scaling & HA
- Read replicas for PostgreSQL for reporting
- Partitioning/archival for historical transaction logs
- Horizontal scaling of stateless API services behind a load balancer

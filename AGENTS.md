7 AI Agent Execution Team — Implementation Plan

1. Product Architect
- Deliver system architecture diagrams, module interactions, API contracts, and non-functional requirements (scalability, HA, security).
- Produce canonical SKU model, barcode rules, and data ownership map.

2. ERP Core Agent
- Implement Inventory domain: SKU CRUD, barcode resolution, inventory levels, multi-warehouse support, transactions, batch/serial/expiry tracking.
- Implement procurement basics: PO model, supplier integrations, reorder rules.

3. CRM Agent
- Implement Customers, Leads, Activities, and CRM flows: lead capture, assignment, opportunity tracking.
- Integrate CRM events with Orders and Inventory (e.g., mark customer lifecycle on order completion).

4. Backend Agent
- Scaffold NestJS project, modules, entities, repositories, services, controllers.
- Implement authentication, RBAC, JWT, and API validation.

5. Frontend Agent
- Scaffold Next.js with TypeScript.
- Build Inventory admin UI (SKU, barcode), POS UI (barcode input, cart), and CRM dashboard.

6. Automation Agent
- Build event bus and rules engine (e.g., Node service using Redis Streams or RabbitMQ).
- Implement workflows: low-stock -> create PO, order -> CRM update, expiry -> alert.

7. DevOps Agent
- Dockerize services, provide Kubernetes manifests, CI pipelines, backups, monitoring (Prometheus/Grafana), and secrets management.

Integration & Deliverables
- Shared Postgres schema and migrations (see db/schema.sql).
- OpenAPI/GraphQL schema for all endpoints.
- Example event payloads and rule definitions.

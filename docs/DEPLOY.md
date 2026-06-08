# Deploy / Local dev

Local development with Docker Compose:

```bash
cd erp
docker-compose up --build
```
### Notes
- The frontend expects the backend to be reachable at `http://backend:3000/api` when running in Docker Compose.
- To enable the Assistant AI proxying to OpenAI, set `OPENAI_API_KEY` in the `backend` service environment or as a secret in your deployment.

If `npm install` fails during image build due to network/timeouts, ensure your build environment has internet access and npm registry reachability. Consider building images on a machine with network access and pushing to a registry.

This starts Postgres, Redis, backend, and frontend. Backend listens on `:3000` and frontend on `:3001` by default.

Apply DB schema (if not using docker-compose):

```bash
cd erp/backend
npm install
npm run migrate
```

Seed RBAC and create admin user:

```bash
npm run seed:rbac
```

Assistant AI integration

- Endpoint: POST /api/assistant/query
- If `OPENAI_API_KEY` environment variable is set, the assistant will proxy requests to OpenAI Chat Completions API.
- If no API key is present, the assistant returns a helpful mock response for local development.

Usage:
- From frontend, call `${NEXT_PUBLIC_API_URL}/assistant/query` with `{ prompt: string }`.
- Secure this endpoint behind admin RBAC in production.

Notes:
- The assistant currently uses `gpt-4o-mini` as default in the code; replace with your desired model and parameters.

import fetch from 'node-fetch';

describe('Order finalize integration (sketch)', () => {
  it('should create an order and trigger a LOW_STOCK event', async () => {
    // This is a scaffold/test sketch. Configure base URL and credentials to run.
    const API = process.env.TEST_API_URL || 'http://localhost:3000/api';
    // TODO: create SKU, seed inventory, create order, simulate payment, assert PO creation
    const res = await fetch(`${API}/health`);
    const body = await res.json();
    expect(body.status).toBe('ok');
  }, 20000);
});

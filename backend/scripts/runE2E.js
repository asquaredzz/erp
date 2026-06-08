const fetch = global.fetch || require('node-fetch');
const { Client } = require('pg');

const BASE = process.env.BASE_URL || 'http://localhost:3000/api';

async function waitForHealth(timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(`${BASE}/health`);
      if (res.ok) return true;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

async function run() {
  console.log('E2E runner starting, base=', BASE);
  const ok = await waitForHealth(60000);
  if (!ok) {
    console.error('Backend health check failed');
    process.exit(2);
  }

  // Seed DB directly: warehouse, sku, barcode, inventory, supplier
  const db = new Client({ host: process.env.DB_HOST || 'localhost', port: process.env.DB_PORT ? parseInt(process.env.DB_PORT,10) : 5432, user: process.env.DB_USER || 'postgres', password: process.env.DB_PASS || 'postgres', database: process.env.DB_NAME || 'erp' });
  await db.connect();
  console.log('Connected to DB to seed test data');

  // create warehouse
  const whRes = await db.query(`INSERT INTO warehouses(id,name,code) VALUES (uuid_generate_v4(), 'Test WH', 'TST') RETURNING id`);
  const warehouseId = whRes.rows[0].id;

  // create supplier
  const supRes = await db.query(`INSERT INTO suppliers(id,name) VALUES (uuid_generate_v4(), 'Test Supplier') RETURNING id`);
  const supplierId = supRes.rows[0].id;

  // create sku
  const skuRes = await db.query(`INSERT INTO skus (id, sku_code, name, selling_price) VALUES (uuid_generate_v4(), $1, $2, $3) RETURNING id`, ['TST-SKU-1', 'Test SKU', 10]);
  const skuId = skuRes.rows[0].id;

  // create barcode
  await db.query(`INSERT INTO barcodes (id, sku_id, code, type, is_primary) VALUES (uuid_generate_v4(), $1, $2, 'EAN13', true)`, [skuId, '1234567890123']);

  // create inventory level with low stock to trigger reorder after sale
  await db.query(`INSERT INTO inventory_levels (id, sku_id, warehouse_id, quantity_on_hand, quantity_reserved) VALUES (uuid_generate_v4(), $1, $2, $3, 0)`, [skuId, warehouseId, 5]);

  // login as admin
  const loginRes = await fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: process.env.ADMIN_EMAIL || 'admin@local', password: process.env.ADMIN_PASS || 'admin123' }) });
  const login = await loginRes.json();
  if (!login || !login.access_token) {
    console.error('Login failed', login);
    process.exit(3);
  }
  const token = login.access_token;

  // create an order via API (admin allowed for test)
  const orderPayload = { order: { channel: 'TEST', total_amount: 10 }, items: [{ sku_id: skuId, quantity: 1, unit_price: 10 }] };
  const orderRes = await fetch(`${BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(orderPayload) });
  const orderBody = await orderRes.json();
  console.log('Created order:', orderBody);
  const orderId = orderBody.id || orderBody[0]?.id || orderBody.order?.id;
  if (!orderId) { console.error('Failed to create order', orderBody); process.exit(4); }

  // simulate payment webhook to finalize order
  const payRes = await fetch(`${BASE}/payments/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ order_id: orderId, status: 'COMPLETED', amount: 10 }) });
  const payBody = await payRes.json();
  console.log('Payment webhook response:', payBody);

  // Poll DB for purchase_order_items referencing our sku (created by automation->procurement)
  const start = Date.now();
  let found = false;
  while (Date.now() - start < 60000) {
    const poItems = await db.query(`SELECT poi.* FROM purchase_order_items poi JOIN purchase_orders po ON po.id = poi.purchase_order_id WHERE poi.sku_id = $1`, [skuId]);
    if (poItems.rows.length > 0) { found = true; console.log('Found PO items:', poItems.rows); break; }
    await new Promise(r => setTimeout(r, 1000));
  }

  if (found) {
    console.log('E2E full flow passed');
    process.exit(0);
  }

  console.error('E2E failed: PO not created');
  process.exit(5);
}

run().catch(err => { console.error('E2E runner error', err); process.exit(99); });

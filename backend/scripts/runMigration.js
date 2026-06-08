const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const sqlPath = path.resolve(__dirname, '..', 'db', 'schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'erp'
});

async function run() {
  try {
    await client.connect();
    console.log('Running migration (schema.sql) ...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration complete');
  } catch (err) {
    console.error('Migration failed:', err);
    try { await client.query('ROLLBACK'); } catch (e) {}
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

const fs = require('fs');
const { Client } = require('pg');

const sqlPath = require('path').resolve(__dirname, '..', '..', 'db', 'schema.sql');
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
    console.log('Applying SQL schema...');
    await client.query(sql);
    console.log('Schema applied successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to apply schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

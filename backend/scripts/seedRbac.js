const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

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
    console.log('Seeding RBAC data...');

    // Create roles
    const roles = ['Admin', 'Warehouse Staff', 'Sales Staff', 'Finance', 'CRM'];
    for (const r of roles) {
      await client.query(`INSERT INTO roles (id, name) VALUES (uuid_generate_v4(), $1) ON CONFLICT (name) DO NOTHING`, [r]);
    }

    // Create some permissions
    const perms = ['inventory:read','inventory:write','orders:create','orders:finalize','users:manage'];
    for (const p of perms) {
      await client.query(`INSERT INTO permissions (id, name) VALUES (uuid_generate_v4(), $1) ON CONFLICT (name) DO NOTHING`, [p]);
    }

    // Map permissions to Admin role as simple seed
    const adminIdRes = await client.query(`SELECT id FROM roles WHERE name = 'Admin' LIMIT 1`);
    const adminId = adminIdRes.rows[0].id;
    const permRows = await client.query(`SELECT id FROM permissions`);
    for (const pr of permRows.rows) {
      await client.query(`INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [adminId, pr.id]);
    }

    console.log('RBAC seed complete');
    // create admin user if not exists
    const bcrypt = require('bcryptjs');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@local';
    const adminPassword = process.env.ADMIN_PASS || 'admin123';
    const userRes = await client.query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [adminEmail]);
    let adminId;
    if (userRes.rows.length === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      const r = await client.query(`INSERT INTO users (id, email, password_hash, display_name, created_at) VALUES (uuid_generate_v4(), $1, $2, $3, now()) RETURNING id`, [adminEmail, hash, 'Admin']);
      adminId = r.rows[0].id;
      console.log('Created admin user', adminEmail);
    } else {
      adminId = userRes.rows[0].id;
      console.log('Admin user exists', adminEmail);
    }

    // assign Admin role to admin user
    const adminRoleRes = await client.query(`SELECT id FROM roles WHERE name = 'Admin' LIMIT 1`);
    if (adminRoleRes.rows.length > 0) {
      const roleId = adminRoleRes.rows[0].id;
      await client.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [adminId, roleId]);
      console.log('Assigned Admin role to user');
    }
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

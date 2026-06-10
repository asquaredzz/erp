-- PostgreSQL schema for SKU-first, Barcode-driven ERP
-- Tables: skus, barcodes, warehouses, inventory_levels, inventory_transactions,
-- orders, order_items, suppliers, customers, users, roles, permissions

-- Enable uuid-ossp for stable UUIDs (use pgcrypto in production preferable)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users, Roles, Permissions (RBAC)
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text
);

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text,
  display_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  phone text,
  address jsonb,
  created_at timestamptz DEFAULT now()
);

-- Customers (CRM)
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id text, -- for integrations
  type text DEFAULT 'customer', -- customer, lead, prospect
  name text NOT NULL,
  email text,
  phone text,
  address jsonb,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- SKUs
CREATE TABLE IF NOT EXISTS skus (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku_code text NOT NULL UNIQUE, -- human readable unique code
  name text NOT NULL,
  description text,
  category text,
  subcategory text,
  brand text,
  variant jsonb, -- e.g. {"size":"M","flavor":"vanilla"}
  parent_sku uuid REFERENCES skus(id) ON DELETE SET NULL,
  track_serial boolean DEFAULT false,
  track_batch boolean DEFAULT false,
  track_expiry boolean DEFAULT false,
  cost_price numeric(14,4),
  selling_price numeric(14,4),
  tax_category text,
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now()
);

-- Barcodes (each barcode ties to a SKU)
CREATE TABLE IF NOT EXISTS barcodes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku_id uuid REFERENCES skus(id) ON DELETE CASCADE,
  code text NOT NULL,
  type text NOT NULL, -- EAN13, UPC, CODE128, QR
  is_primary boolean DEFAULT false,
  meta jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE (sku_id, code)
);

-- Warehouses & Bins
CREATE TABLE IF NOT EXISTS warehouses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  code text UNIQUE,
  address jsonb,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id uuid REFERENCES warehouses(id) ON DELETE CASCADE,
  code text NOT NULL,
  description text,
  metadata jsonb,
  UNIQUE (warehouse_id, code)
);

-- Inventory levels (per SKU per Warehouse per Bin optional)
CREATE TABLE IF NOT EXISTS inventory_levels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku_id uuid REFERENCES skus(id) ON DELETE CASCADE,
  warehouse_id uuid REFERENCES warehouses(id) ON DELETE CASCADE,
  bin_id uuid REFERENCES bins(id) ON DELETE SET NULL,
  quantity_on_hand numeric DEFAULT 0,
  quantity_reserved numeric DEFAULT 0,
  quantity_available numeric GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  last_restock_at timestamptz,
  batch_reference text,
  expiry_date date,
  UNIQUE (sku_id, warehouse_id, bin_id)
);

-- Inventory transaction event types
CREATE TYPE inventory_event_type AS ENUM ('SALE','PURCHASE','TRANSFER','RETURN','ADJUSTMENT','RESERVE','RELEASE');

-- Inventory transactions (audit log for stock movements)
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku_id uuid REFERENCES skus(id) ON DELETE SET NULL,
  warehouse_id uuid REFERENCES warehouses(id) ON DELETE SET NULL,
  source_warehouse_id uuid REFERENCES warehouses(id) ON DELETE SET NULL,
  destination_warehouse_id uuid REFERENCES warehouses(id) ON DELETE SET NULL,
  bin_id uuid REFERENCES bins(id) ON DELETE SET NULL,
 
  change numeric NOT NULL, -- +/- quantity
  event_type inventory_event_type NOT NULL,
  reason text,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  batch_reference text,
  serial_numbers text[],
  created_at timestamptz DEFAULT now()
);

-- Orders and Order Items
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_order_no text UNIQUE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'DRAFT', -- DRAFT, CONFIRMED, PAID, CANCELLED, FULFILLED
  channel text, -- POS, ONLINE, MARKETPLACE
  total_amount numeric(14,4) DEFAULT 0,
  currency text DEFAULT 'USD',
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  sku_id uuid REFERENCES skus(id) ON DELETE SET NULL,
  barcode_id uuid REFERENCES barcodes(id) ON DELETE SET NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric(14,4),
  discount numeric(14,4) DEFAULT 0,
  tax numeric(14,4) DEFAULT 0,
  line_total numeric(14,4) GENERATED ALWAYS AS (quantity * unit_price - discount + tax) STORED
);

-- Reservations table to track reserved quantities per order
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  sku_id uuid REFERENCES skus(id) ON DELETE SET NULL,
  warehouse_id uuid REFERENCES warehouses(id) ON DELETE SET NULL,
  quantity numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Procurement: Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  external_po_no text,
  status text DEFAULT 'DRAFT', -- DRAFT, SENT, RECEIVED, CANCELLED
  total_amount numeric(14,4) DEFAULT 0,
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id uuid REFERENCES purchase_orders(id) ON DELETE CASCADE,
  sku_id uuid REFERENCES skus(id) ON DELETE SET NULL,
  quantity numeric NOT NULL,
  unit_price numeric(14,4) DEFAULT 0,
  line_total numeric(14,4) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- Payments table (simplified)
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  amount numeric(14,4) NOT NULL,
  currency text DEFAULT 'USD',
  method text,
  status text DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
  provider_response jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_skus_sku_code ON skus(sku_code);
CREATE INDEX IF NOT EXISTS idx_barcodes_code ON barcodes(code);
CREATE INDEX IF NOT EXISTS idx_inv_levels_sku_wh ON inventory_levels(sku_id, warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inv_txn_sku ON inventory_transactions(sku_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);

-- Views: available stock per SKU across warehouses
CREATE OR REPLACE VIEW sku_available_stock AS
SELECT
  sku_id,
  sum(quantity_on_hand) AS total_on_hand,
  sum(quantity_reserved) AS total_reserved,
  sum(quantity_on_hand - quantity_reserved) AS total_available
FROM inventory_levels
GROUP BY sku_id;

-- Triggers: keep inventory_levels in sync when transactions are inserted
CREATE OR REPLACE FUNCTION fn_apply_inventory_transaction() RETURNS trigger AS $$
BEGIN
  -- Handle simple case: transaction has sku_id and warehouse_id and change
  IF NEW.sku_id IS NOT NULL AND NEW.warehouse_id IS NOT NULL THEN
    LOOP
      UPDATE inventory_levels
      SET quantity_on_hand = quantity_on_hand + NEW.change,
          last_restock_at = CASE WHEN NEW.change > 0 THEN now() ELSE last_restock_at END
      WHERE sku_id = NEW.sku_id AND warehouse_id = NEW.warehouse_id AND (bin_id = NEW.bin_id OR (bin_id IS NULL AND NEW.bin_id IS NULL));

      IF FOUND THEN
        RETURN NEW;
      ELSE
        -- create level if not exists
        INSERT INTO inventory_levels(sku_id, warehouse_id, bin_id, quantity_on_hand, quantity_reserved, last_restock_at)
        VALUES(NEW.sku_id, NEW.warehouse_id, NEW.bin_id, GREATEST(NEW.change,0), 0, CASE WHEN NEW.change > 0 THEN now() ELSE NULL END);
        RETURN NEW;
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_apply_inventory_transaction ON inventory_transactions;
CREATE TRIGGER trg_apply_inventory_transaction
AFTER INSERT ON inventory_transactions
FOR EACH ROW EXECUTE PROCEDURE fn_apply_inventory_transaction();
-- Add order references after orders/order_items are defined
ALTER TABLE inventory_transactions
  ADD COLUMN IF NOT EXISTS related_order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS related_order_item_id uuid REFERENCES order_items(id) ON DELETE SET NULL;
  CREATE TABLE IF NOT EXISTS processed_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_hash VARCHAR(64) UNIQUE NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
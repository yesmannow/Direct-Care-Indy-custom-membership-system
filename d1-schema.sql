-- Direct Care Indy DPC Membership System - D1 Database Schema
-- Run this SQL in Cloudflare Dashboard > D1 > prod-d1-directcare > Console

-- 1. Households Table - Groups family members together
CREATE TABLE IF NOT EXISTS households (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

-- 2. Members Table - Individual patients with DPC membership
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    date_of_birth TEXT NOT NULL,
    household_id INTEGER,
    status TEXT NOT NULL DEFAULT 'active',
    FOREIGN KEY (household_id) REFERENCES households(id)
);

-- 3. Inventory Table - Consolidated medications and labs with wholesale pricing
-- Prices stored in CENTS to avoid floating-point precision issues
CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'medication' or 'lab'
    wholesale_price INTEGER NOT NULL, -- Price in cents (e.g., 300 for $3.00)
    stock_level INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    dosage TEXT, -- For medications: e.g., "500mg"
    lot_number TEXT, -- Lot number for batch tracking
    expiration_date TEXT, -- ISO date string for expiration tracking
    par_level INTEGER -- Minimum stock level (PAR = Periodic Automatic Replenishment)
);

-- 4. Services Table - Define which services are covered (90%) vs insurance-only (10%)
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'included' or 'insurance_only'
    description TEXT
);

-- 5. HIPAA-Compliant Audit Logs Table
-- Tracks "who, what, and when" for all PHI access and modifications
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL, -- Provider/admin user ID (from auth system)
    action TEXT NOT NULL, -- 'READ', 'UPDATE', 'DELETE', 'CREATE'
    resource_type TEXT NOT NULL, -- 'Member', 'Medication', 'Lab', 'Household', etc.
    resource_id INTEGER NOT NULL, -- ID of the resource accessed/modified
    timestamp INTEGER NOT NULL, -- Unix timestamp
    ip_address TEXT, -- Optional: IP address for additional security tracking
    user_agent TEXT, -- Optional: User agent for additional context
    details TEXT -- Optional: JSON string with additional context about the action
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_members_household_id ON members(household_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);


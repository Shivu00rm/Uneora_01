-- Seed Users Script
-- Run this AFTER setting up the initial schema

-- Note: In a real Supabase setup, you would create these users through the auth interface
-- This script shows the expected data structure for testing

-- Insert test user profiles (these would normally be created via Supabase Auth signup)
-- You'll need to create the actual auth users first in Supabase Auth, then run this

-- Sample user profiles that match the demo accounts
-- Super Admin
INSERT INTO user_profiles (
    id, 
    organization_id, 
    role, 
    name, 
    email, 
    status,
    permissions
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with actual auth user ID
    NULL, -- Super admin has no organization
    'SUPER_ADMIN',
    'System Owner',
    'admin@flowstock.com',
    'active',
    '{
        "system": ["view", "edit", "delete", "manage"],
        "organizations": ["view", "create", "edit", "delete", "manage"],
        "billing": ["view", "edit", "manage"],
        "api_keys": ["view", "edit", "manage"],
        "admin_team": ["view", "create", "edit", "delete"],
        "impersonation": ["use"]
    }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    permissions = EXCLUDED.permissions;

-- Org Admin for TechCorp
INSERT INTO user_profiles (
    id,
    organization_id,
    role,
    name,
    email,
    status,
    permissions
) VALUES (
    '00000000-0000-0000-0000-000000000002', -- Replace with actual auth user ID
    'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- TechCorp ID
    'ORG_ADMIN',
    'Rajesh Sharma',
    'admin@techcorp.com',
    'active',
    '{
        "dashboard": ["view"],
        "inventory": ["view", "create", "edit", "delete", "export"],
        "stock_movements": ["view", "create", "edit"],
        "pos": ["view", "create", "refund"],
        "vendors": ["view", "create", "edit", "delete"],
        "purchase_orders": ["view", "create", "edit", "approve", "delete"],
        "analytics": ["view", "export"],
        "users": ["view", "create", "edit", "delete"],
        "files": ["view", "upload", "delete"],
        "settings": ["view", "edit"]
    }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    organization_id = EXCLUDED.organization_id,
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    permissions = EXCLUDED.permissions;

-- Org User for TechCorp
INSERT INTO user_profiles (
    id,
    organization_id,
    role,
    name,
    email,
    status,
    permissions
) VALUES (
    '00000000-0000-0000-0000-000000000003', -- Replace with actual auth user ID
    'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- TechCorp ID
    'ORG_USER',
    'Priya Patel',
    'user@techcorp.com',
    'active',
    '{
        "dashboard": ["view"],
        "inventory": ["view", "edit"],
        "stock_movements": ["view", "create"],
        "pos": ["view", "create"],
        "vendors": ["view"],
        "purchase_orders": ["view", "create"],
        "analytics": ["view"],
        "files": ["view", "upload"]
    }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    organization_id = EXCLUDED.organization_id,
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    permissions = EXCLUDED.permissions;

-- Sample inventory data for TechCorp
INSERT INTO inventory (
    organization_id,
    sku,
    name,
    description,
    category,
    quantity,
    min_stock_level,
    unit_price,
    cost_price,
    location,
    status
) VALUES 
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'IPH14-PRO-128GB',
    'iPhone 14 Pro 128GB',
    'Apple iPhone 14 Pro with 128GB storage',
    'Mobile Phones',
    45,
    10,
    999.99,
    850.00,
    'Warehouse A',
    'active'
),
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'SGX-BUDS-PRO',
    'Samsung Galaxy Buds Pro',
    'Samsung wireless earbuds with noise cancellation',
    'Audio Accessories',
    8,
    15,
    199.99,
    150.00,
    'Warehouse A',
    'active'
),
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'MAC-AIR-M2',
    'MacBook Air M2',
    'Apple MacBook Air with M2 chip',
    'Laptops',
    12,
    5,
    1299.99,
    1100.00,
    'Warehouse B',
    'active'
);

-- Sample API integrations
INSERT INTO api_integrations (
    organization_id,
    service_name,
    service_type,
    credentials,
    config,
    status
) VALUES
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'shopify',
    'ecommerce',
    '{"shop_domain": "techcorp-demo.myshopify.com", "access_token": "encrypted_token_here"}'::jsonb,
    '{"sync_frequency": "hourly", "auto_sync": true}'::jsonb,
    'active'
),
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'razorpay',
    'payment',
    '{"key_id": "rzp_test_key", "key_secret": "encrypted_secret_here"}'::jsonb,
    '{"webhook_enabled": true}'::jsonb,
    'active'
);

-- Sample audit logs
INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    module,
    details,
    ip_address
) VALUES
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    '00000000-0000-0000-0000-000000000002',
    'create',
    'inventory',
    '{"item_name": "iPhone 14 Pro 128GB", "sku": "IPH14-PRO-128GB"}'::jsonb,
    '192.168.1.100'
),
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    '00000000-0000-0000-0000-000000000003',
    'sale',
    'pos',
    '{"amount": 25000, "items": 2}'::jsonb,
    '192.168.1.101'
),
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    '00000000-0000-0000-0000-000000000002',
    'update',
    'inventory',
    '{"item_name": "Samsung Galaxy Buds Pro", "field": "min_stock_level", "old_value": 10, "new_value": 15}'::jsonb,
    '192.168.1.100'
);

-- Create some more system alerts for demo
INSERT INTO system_alerts (
    alert_type,
    severity,
    title,
    message,
    affected_organizations,
    metadata
) VALUES
(
    'security_breach',
    'critical',
    'Suspicious Login Activity',
    'Multiple failed login attempts detected from unusual IP addresses',
    ARRAY['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
    '{"ip_addresses": ["203.0.113.1", "198.51.100.1"], "attempts": 15}'::jsonb
),
(
    'api_integration',
    'warning',
    'Shopify Sync Delayed',
    'Shopify integration experiencing sync delays due to rate limiting',
    ARRAY['f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f47ac10b-58cc-4372-a567-0e02b2c3d480'],
    '{"delay_minutes": 45, "affected_products": 156}'::jsonb
),
(
    'billing',
    'info',
    'Payment Method Expiring',
    'Credit card ending in 4567 will expire in 7 days',
    ARRAY['f47ac10b-58cc-4372-a567-0e02b2c3d480'],
    '{"expires_on": "2024-02-01", "card_last_four": "4567"}'::jsonb
);

-- Instructions for manual user creation:
/*
To complete the setup:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Create the following test users:
   - admin@flowstock.com (password: admin123)
   - admin@techcorp.com (password: admin123)  
   - user@techcorp.com (password: user123)

4. After creating each user, copy their UUID from the auth.users table
5. Update the user_profiles INSERT statements above with the actual UUIDs
6. Run this script again to insert the profiles with correct IDs

Alternative: Use the Supabase Auth API to create users programmatically:
*/

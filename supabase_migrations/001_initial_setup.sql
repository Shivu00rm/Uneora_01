-- Initial FlowStock Database Schema Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better type safety
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ORG_ADMIN', 'ORG_USER');
CREATE TYPE organization_status AS ENUM ('active', 'suspended', 'trial', 'overdue');
CREATE TYPE subscription_plan AS ENUM ('starter', 'growth', 'pro', 'enterprise');

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status organization_status DEFAULT 'trial',
    subscription_plan subscription_plan DEFAULT 'starter',
    billing_email VARCHAR(255),
    custom_domain VARCHAR(255),
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    role user_role NOT NULL DEFAULT 'ORG_USER',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    permissions JSONB DEFAULT '{}',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API integrations table
CREATE TABLE api_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL, -- 'shopify', 'woocommerce', etc.
    service_type VARCHAR(50) NOT NULL, -- 'ecommerce', 'payment', 'email', etc.
    credentials JSONB NOT NULL, -- encrypted credentials
    config JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System alerts table (for super admin)
CREATE TABLE system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'info', -- 'critical', 'warning', 'info'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    affected_organizations UUID[],
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES user_profiles(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table (organization-scoped)
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    unit_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    supplier_id UUID,
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, sku)
);

-- Stock movements table
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment'
    quantity INTEGER NOT NULL,
    reference VARCHAR(100), -- PO number, sale ID, etc.
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_integrations_updated_at BEFORE UPDATE ON api_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Super admins can view all organizations" ON organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

CREATE POLICY "Users can view their own organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM user_profiles 
            WHERE user_profiles.id = auth.uid()
        )
    );

CREATE POLICY "Super admins can manage all organizations" ON organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Org admins can view users in their organization" ON user_profiles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'ORG_ADMIN'
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

CREATE POLICY "Super admins and org admins can manage users" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role IN ('SUPER_ADMIN', 'ORG_ADMIN')
        )
    );

-- API integrations policies
CREATE POLICY "Organization members can view their integrations" ON api_integrations
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE user_profiles.id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

CREATE POLICY "Org admins can manage their integrations" ON api_integrations
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'ORG_ADMIN'
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

-- Audit logs policies
CREATE POLICY "Organization members can view their audit logs" ON audit_logs
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE user_profiles.id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- System alerts policies
CREATE POLICY "Super admins can manage system alerts" ON system_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

-- Inventory policies
CREATE POLICY "Organization members can view their inventory" ON inventory
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE user_profiles.id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

CREATE POLICY "Organization members can manage their inventory" ON inventory
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE user_profiles.id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

-- Stock movements policies
CREATE POLICY "Organization members can view their stock movements" ON stock_movements
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE user_profiles.id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'SUPER_ADMIN'
        )
    );

CREATE POLICY "Organization members can create stock movements" ON stock_movements
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE user_profiles.id = auth.uid()
        )
    );

-- Insert seed data

-- Sample organizations
INSERT INTO organizations (id, name, domain, status, subscription_plan, billing_email, features) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'TechCorp Solutions', 'techcorp.com', 'active', 'pro', 'billing@techcorp.com', ARRAY['advanced_analytics', 'automation', 'api_access']),
('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Retail Plus India', 'retailplus.in', 'active', 'growth', 'admin@retailplus.in', ARRAY['ecommerce_sync', 'automation']),
('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'StartupXYZ', 'startupxyz.io', 'trial', 'starter', 'founder@startupxyz.io', ARRAY['basic_inventory']);

-- Sample system alerts
INSERT INTO system_alerts (alert_type, severity, title, message, affected_organizations) VALUES
('database_performance', 'warning', 'High Database Load', 'Database queries are taking longer than usual', ARRAY['f47ac10b-58cc-4372-a567-0e02b2c3d479']),
('payment_failure', 'critical', 'Payment Processing Down', 'Payment gateway is experiencing issues', ARRAY['f47ac10b-58cc-4372-a567-0e02b2c3d480']),
('api_rate_limit', 'info', 'API Rate Limit Reached', 'Organization has reached 80% of API quota', ARRAY['f47ac10b-58cc-4372-a567-0e02b2c3d479']);

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'ORG_USER')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create audit log function
CREATE OR REPLACE FUNCTION create_audit_log(
  p_organization_id UUID,
  p_user_id UUID,
  p_action VARCHAR(100),
  p_module VARCHAR(50),
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_logs (organization_id, user_id, action, module, details)
  VALUES (p_organization_id, p_user_id, p_action, p_module, p_details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

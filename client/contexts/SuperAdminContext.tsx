import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { PLAN_FEATURES, type Feature, type Plan } from "@/lib/planFeatures";

interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: "starter" | "growth" | "pro" | "enterprise";
  status: "active" | "suspended" | "trial" | "overdue";
  users: number;
  monthlyRevenue: number;
  dataUsage: number; // GB
  apiCalls: number;
  lastActivity: string;
  createdAt: string;
  billingEmail: string;
  customDomain?: string;
  features: string[];
  health: "healthy" | "warning" | "critical";
}

interface SystemMetrics {
  totalOrganizations: number;
  activeUsers: number;
  monthlyRevenue: number;
  systemLoad: number;
  apiRequestsPerMinute: number;
  storageUsed: number; // GB
  uptime: number; // percentage
}

interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role:
    | "super_admin"
    | "platform_dev"
    | "data_engineer"
    | "support_lead"
    | "security_analyst";
  permissions: string[];
  lastLogin: string;
}

interface PlanChange {
  orgId: string;
  oldPlan: string;
  newPlan: string;
  timestamp: string;
  adminName: string;
}

interface SuperAdminContextType {
  organizations: Organization[];
  systemMetrics: SystemMetrics;
  superAdminUser: SuperAdminUser | null;
  isSuperAdmin: boolean;
  recentPlanChanges: PlanChange[];
  updateOrganizationPlan: (orgId: string, plan: string) => void;
  suspendOrganization: (orgId: string) => void;
  reactivateOrganization: (orgId: string) => void;
  getOrganizationMetrics: (orgId: string) => any;
  hasSystemPermission: (permission: string) => boolean;
  getPlanFeatures: (plan: Plan) => Feature[];
  applyPlanDefaults: (orgId: string) => void;
  setOrgFeature: (orgId: string, feature: Feature, enabled: boolean) => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(
  undefined,
);

// Mock data
const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "TechCorp Solutions",
    domain: "techcorp.com",
    plan: "pro",
    status: "active",
    users: 45,
    monthlyRevenue: 9999,
    dataUsage: 2.5,
    apiCalls: 125000,
    lastActivity: "2024-01-15T10:30:00Z",
    createdAt: "2023-06-15T00:00:00Z",
    billingEmail: "billing@techcorp.com",
    customDomain: "inventory.techcorp.com",
    features: [
      "advanced_analytics",
      "automation",
      "api_access",
      "priority_support",
    ],
    health: "healthy",
  },
  {
    id: "org-2",
    name: "Retail Plus India",
    domain: "retailplus.in",
    plan: "growth",
    status: "active",
    users: 23,
    monthlyRevenue: 2999,
    dataUsage: 1.2,
    apiCalls: 45000,
    lastActivity: "2024-01-15T09:15:00Z",
    createdAt: "2023-09-20T00:00:00Z",
    billingEmail: "admin@retailplus.in",
    features: ["ecommerce_sync", "automation", "whatsapp_alerts"],
    health: "healthy",
  },
  {
    id: "org-3",
    name: "StartupXYZ",
    domain: "startupxyz.io",
    plan: "starter",
    status: "trial",
    users: 8,
    monthlyRevenue: 0,
    dataUsage: 0.3,
    apiCalls: 12000,
    lastActivity: "2024-01-14T16:45:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    billingEmail: "founder@startupxyz.io",
    features: ["basic_inventory", "pos"],
    health: "warning",
  },
  {
    id: "org-4",
    name: "MegaMart Chain",
    domain: "megamart.co.in",
    plan: "enterprise",
    status: "active",
    users: 156,
    monthlyRevenue: 25000,
    dataUsage: 8.7,
    apiCalls: 450000,
    lastActivity: "2024-01-15T11:00:00Z",
    createdAt: "2023-03-10T00:00:00Z",
    billingEmail: "it@megamart.co.in",
    customDomain: "inventory.megamart.co.in",
    features: [
      "all_features",
      "dedicated_support",
      "custom_integrations",
      "sla_guarantee",
    ],
    health: "healthy",
  },
  {
    id: "org-5",
    name: "Fashion Boutique",
    domain: "fashionboutique.com",
    plan: "growth",
    status: "overdue",
    users: 12,
    monthlyRevenue: 2999,
    dataUsage: 0.8,
    apiCalls: 28000,
    lastActivity: "2024-01-10T14:20:00Z",
    createdAt: "2023-11-05T00:00:00Z",
    billingEmail: "owner@fashionboutique.com",
    features: ["ecommerce_sync", "inventory_management"],
    health: "critical",
  },
];

const mockSystemMetrics: SystemMetrics = {
  totalOrganizations: 156,
  activeUsers: 2347,
  monthlyRevenue: 485000,
  systemLoad: 67,
  apiRequestsPerMinute: 12500,
  storageUsed: 234.5,
  uptime: 99.97,
};

const mockSuperAdminUser: SuperAdminUser = {
  id: "sa-1",
  name: "System Owner",
  email: "owner@uneora.com",
  role: "super_admin",
  permissions: ["all"],
  lastLogin: "2024-01-15T12:00:00Z",
};

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] =
    useState<Organization[]>(mockOrganizations);
  const [systemMetrics] = useState<SystemMetrics>(mockSystemMetrics);
  const [superAdminUser] = useState<SuperAdminUser | null>(mockSuperAdminUser);
  const [recentPlanChanges, setRecentPlanChanges] = useState<PlanChange[]>([]);

  const isSuperAdmin = superAdminUser?.role === "super_admin" || false;

  const updateOrganizationPlan = (orgId: string, plan: string) => {
    const org = organizations.find((o) => o.id === orgId);
    if (org) {
      const planChange: PlanChange = {
        orgId,
        oldPlan: org.plan,
        newPlan: plan,
        timestamp: new Date().toISOString(),
        adminName: superAdminUser?.name || "System Admin",
      };

      setRecentPlanChanges((prev) => [planChange, ...prev.slice(0, 9)]);

      setOrganizations((prev) =>
        prev.map((o) => {
          if (o.id !== orgId) return o;
          const defaults = PLAN_FEATURES[plan as Plan];
          const current = new Set(o.features || []);
          const merged = Array.from(new Set([...defaults, ...current]));
          return { ...o, plan: plan as Organization["plan"], features: merged };
        }),
      );
    }
  };

  const suspendOrganization = (orgId: string) => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === orgId ? { ...org, status: "suspended" } : org,
      ),
    );
  };

  const reactivateOrganization = (orgId: string) => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === orgId ? { ...org, status: "active" } : org,
      ),
    );
  };

  const setOrgFeature = (orgId: string, feature: Feature, enabled: boolean) => {
    setOrganizations((prev) =>
      prev.map((o) => {
        if (o.id !== orgId) return o;
        const set = new Set(o.features || []);
        if (enabled) set.add(feature);
        else set.delete(feature);
        return { ...o, features: Array.from(set) };
      }),
    );
  };

  const applyPlanDefaults = (orgId: string) => {
    setOrganizations((prev) =>
      prev.map((o) => {
        if (o.id !== orgId) return o;
        const defaults = PLAN_FEATURES[o.plan as Plan];
        return { ...o, features: [...defaults] };
      }),
    );
  };

  const getPlanFeatures = (plan: Plan) => PLAN_FEATURES[plan];

  const getOrganizationMetrics = (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId);
    return {
      users: org?.users || 0,
      revenue: org?.monthlyRevenue || 0,
      dataUsage: org?.dataUsage || 0,
      apiCalls: org?.apiCalls || 0,
      health: org?.health || "unknown",
    };
  };

  const hasSystemPermission = (permission: string): boolean => {
    if (!superAdminUser) return false;
    if (superAdminUser.role === "super_admin") return true;
    return superAdminUser.permissions.includes(permission);
  };

  const value = {
    organizations,
    systemMetrics,
    superAdminUser,
    isSuperAdmin,
    recentPlanChanges,
    updateOrganizationPlan,
    suspendOrganization,
    reactivateOrganization,
    getOrganizationMetrics,
    hasSystemPermission,
    getPlanFeatures,
    applyPlanDefaults,
    setOrgFeature,
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (context === undefined) {
    throw new Error("useSuperAdmin must be used within a SuperAdminProvider");
  }
  return context;
}

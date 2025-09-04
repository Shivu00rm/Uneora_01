import { useState, useEffect } from "react";

// Types for Super Admin data
export interface Organization {
  id: string;
  name: string;
  domain?: string;
  subscriptionTier: "free" | "pro" | "enterprise";
  status: "active" | "suspended" | "trial" | "overdue";
  industry: "retail" | "fnb" | "pharma" | "manufacturing" | "services";
  storeCount: number;
  userCount: number;
  activeIntegrations: string[];
  usage: {
    skus: number;
    skuLimit: number;
    transactions: number;
    transactionLimit: number;
    apiCalls: number;
    apiCallLimit: number;
  };
  billing: {
    mrr: number;
    lastPayment: string;
    nextBilling: string;
    status: "paid" | "overdue" | "failed";
  };
  createdAt: string;
  lastActivity: string;
  health: "healthy" | "warning" | "critical" | "offline";
}

export interface GlobalKPIs {
  totalOrgs: number;
  activeOrgs: number;
  totalStores: number;
  totalRevenue: number;
  monthlyGrowth: number;
  integrationUsage: {
    shopify: number;
    woocommerce: number;
    amazon: number;
    flipkart: number;
  };
  systemHealth: {
    uptime: number;
    avgResponseTime: number;
    errorRate: number;
    activeIncidents: number;
  };
}

export interface SystemAlert {
  id: string;
  type: "system" | "organization" | "integration" | "billing";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  affectedOrgs: string[];
  timestamp: string;
  resolved: boolean;
}

export interface UsageAlert {
  id: string;
  organizationId: string;
  organizationName: string;
  type: "sku_limit" | "transaction_limit" | "api_limit" | "billing_overdue";
  usage: number;
  limit: number;
  severity: "warning" | "critical";
  timestamp: string;
}

// Custom hook for Super Admin data
export const useSuperAdminData = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [globalKPIs, setGlobalKPIs] = useState<GlobalKPIs | null>(null);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [usageAlerts, setUsageAlerts] = useState<UsageAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - In real implementation, this would be API calls
  const mockOrganizations: Organization[] = [
    {
      id: "tech-corp-001",
      name: "TechCorp Solutions",
      domain: "techcorp.com",
      subscriptionTier: "enterprise",
      status: "active",
      industry: "manufacturing",
      storeCount: 15,
      userCount: 48,
      activeIntegrations: ["shopify", "amazon", "woocommerce"],
      usage: {
        skus: 25000,
        skuLimit: 50000,
        transactions: 125000,
        transactionLimit: 250000,
        apiCalls: 450000,
        apiCallLimit: 1000000
      },
      billing: {
        mrr: 2500,
        lastPayment: "2024-01-15",
        nextBilling: "2024-02-15",
        status: "paid"
      },
      createdAt: "2023-06-15",
      lastActivity: "2024-01-18T10:30:00Z",
      health: "healthy"
    },
    {
      id: "fashion-boutique-002",
      name: "Fashion Boutique Chain",
      domain: "fashionboutique.in",
      subscriptionTier: "pro",
      status: "active",
      industry: "retail",
      storeCount: 8,
      userCount: 22,
      activeIntegrations: ["shopify", "woocommerce"],
      usage: {
        skus: 12000,
        skuLimit: 25000,
        transactions: 45000,
        transactionLimit: 100000,
        apiCalls: 180000,
        apiCallLimit: 500000
      },
      billing: {
        mrr: 1200,
        lastPayment: "2024-01-12",
        nextBilling: "2024-02-12",
        status: "paid"
      },
      createdAt: "2023-09-22",
      lastActivity: "2024-01-18T14:20:00Z",
      health: "warning"
    },
    {
      id: "foodie-chain-003",
      name: "Foodie Express Chain",
      domain: "foodieexpress.com",
      subscriptionTier: "free",
      status: "trial",
      industry: "fnb",
      storeCount: 3,
      userCount: 8,
      activeIntegrations: ["shopify"],
      usage: {
        skus: 850,
        skuLimit: 1000,
        transactions: 2400,
        transactionLimit: 5000,
        apiCalls: 12000,
        apiCallLimit: 25000
      },
      billing: {
        mrr: 0,
        lastPayment: "",
        nextBilling: "2024-01-25",
        status: "paid"
      },
      createdAt: "2024-01-10",
      lastActivity: "2024-01-18T16:45:00Z",
      health: "healthy"
    },
    {
      id: "pharma-plus-004",
      name: "PharmaCare Plus",
      domain: "pharmacareplus.in",
      subscriptionTier: "pro",
      status: "overdue",
      industry: "pharma",
      storeCount: 12,
      userCount: 35,
      activeIntegrations: ["amazon", "flipkart"],
      usage: {
        skus: 18500,
        skuLimit: 25000,
        transactions: 68000,
        transactionLimit: 100000,
        apiCalls: 285000,
        apiCallLimit: 500000
      },
      billing: {
        mrr: 1200,
        lastPayment: "2023-12-12",
        nextBilling: "2024-01-12",
        status: "overdue"
      },
      createdAt: "2023-04-08",
      lastActivity: "2024-01-17T09:15:00Z",
      health: "critical"
    },
    {
      id: "retail-chain-005",
      name: "MegaRetail Chain",
      domain: "megaretail.co.in",
      subscriptionTier: "enterprise",
      status: "active",
      industry: "retail",
      storeCount: 45,
      userCount: 125,
      activeIntegrations: ["shopify", "amazon", "woocommerce", "flipkart"],
      usage: {
        skus: 85000,
        skuLimit: 100000,
        transactions: 450000,
        transactionLimit: 500000,
        apiCalls: 1200000,
        apiCallLimit: 2000000
      },
      billing: {
        mrr: 4500,
        lastPayment: "2024-01-16",
        nextBilling: "2024-02-16",
        status: "paid"
      },
      createdAt: "2022-11-10",
      lastActivity: "2024-01-18T18:15:00Z",
      health: "healthy"
    }
  ];

  const mockGlobalKPIs: GlobalKPIs = {
    totalOrgs: 1247,
    activeOrgs: 1156,
    totalStores: 8934,
    totalRevenue: 245000,
    monthlyGrowth: 23.5,
    integrationUsage: {
      shopify: 45.2,
      woocommerce: 28.7,
      amazon: 15.8,
      flipkart: 10.3
    },
    systemHealth: {
      uptime: 99.97,
      avgResponseTime: 245,
      errorRate: 0.02,
      activeIncidents: 2
    }
  };

  const mockSystemAlerts: SystemAlert[] = [
    {
      id: "alert-001",
      type: "system",
      severity: "high",
      title: "API Rate Limit Approaching",
      description: "Global API rate limit at 85% capacity",
      affectedOrgs: ["All"],
      timestamp: "2024-01-18T15:30:00Z",
      resolved: false
    },
    {
      id: "alert-002",
      type: "integration",
      severity: "medium",
      title: "Shopify Sync Delays",
      description: "Shopify integration experiencing 15% higher than normal sync times",
      affectedOrgs: ["tech-corp-001", "fashion-boutique-002"],
      timestamp: "2024-01-18T14:45:00Z",
      resolved: false
    },
    {
      id: "alert-003",
      type: "billing",
      severity: "critical",
      title: "Payment Failures Spike",
      description: "45% increase in payment failures in last 24 hours",
      affectedOrgs: ["pharma-plus-004"],
      timestamp: "2024-01-18T12:20:00Z",
      resolved: true
    }
  ];

  const mockUsageAlerts: UsageAlert[] = [
    {
      id: "usage-001",
      organizationId: "retail-chain-005",
      organizationName: "MegaRetail Chain",
      type: "sku_limit",
      usage: 85000,
      limit: 100000,
      severity: "warning",
      timestamp: "2024-01-18T16:00:00Z"
    },
    {
      id: "usage-002",
      organizationId: "foodie-chain-003",
      organizationName: "Foodie Express Chain",
      type: "sku_limit",
      usage: 850,
      limit: 1000,
      severity: "warning",
      timestamp: "2024-01-18T15:30:00Z"
    },
    {
      id: "usage-003",
      organizationId: "pharma-plus-004",
      organizationName: "PharmaCare Plus",
      type: "billing_overdue",
      usage: 0,
      limit: 0,
      severity: "critical",
      timestamp: "2024-01-12T00:00:00Z"
    }
  ];

  // Simulate API loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setOrganizations(mockOrganizations);
        setGlobalKPIs(mockGlobalKPIs);
        setSystemAlerts(mockSystemAlerts);
        setUsageAlerts(mockUsageAlerts);
      } catch (err) {
        setError("Failed to load super admin data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Organization management actions
  const suspendOrganization = async (orgId: string) => {
    try {
      // TODO: API call
      setOrganizations(prev => 
        prev.map(org => 
          org.id === orgId 
            ? { ...org, status: "suspended" as const }
            : org
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to suspend organization" };
    }
  };

  const activateOrganization = async (orgId: string) => {
    try {
      // TODO: API call
      setOrganizations(prev => 
        prev.map(org => 
          org.id === orgId 
            ? { ...org, status: "active" as const }
            : org
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to activate organization" };
    }
  };

  const updateSubscriptionTier = async (orgId: string, tier: "free" | "pro" | "enterprise") => {
    try {
      // TODO: API call
      setOrganizations(prev => 
        prev.map(org => 
          org.id === orgId 
            ? { ...org, subscriptionTier: tier }
            : org
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to update subscription" };
    }
  };

  const resetApiKeys = async (orgId: string) => {
    try {
      // TODO: API call
      console.log("Resetting API keys for org:", orgId);
      return { success: true, message: "API keys reset successfully" };
    } catch (error) {
      return { success: false, error: "Failed to reset API keys" };
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      // TODO: API call
      setSystemAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, resolved: true }
            : alert
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to resolve alert" };
    }
  };

  const refreshData = async () => {
    setLoading(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  return {
    // Data
    organizations,
    globalKPIs,
    systemAlerts,
    usageAlerts,
    loading,
    error,
    
    // Actions
    suspendOrganization,
    activateOrganization,
    updateSubscriptionTier,
    resetApiKeys,
    resolveAlert,
    refreshData,
    
    // Computed values
    activeAlerts: systemAlerts.filter(alert => !alert.resolved),
    criticalAlerts: systemAlerts.filter(alert => alert.severity === "critical" && !alert.resolved),
    overdueOrganizations: organizations.filter(org => org.billing.status === "overdue"),
    highUsageOrgs: organizations.filter(org => 
      (org.usage.skus / org.usage.skuLimit) > 0.8 ||
      (org.usage.transactions / org.usage.transactionLimit) > 0.8 ||
      (org.usage.apiCalls / org.usage.apiCallLimit) > 0.8
    )
  };
};

// Helper functions
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const getSubscriptionTierColor = (tier: string) => {
  switch (tier) {
    case "free": return "bg-gray-500";
    case "pro": return "bg-blue-500";
    case "enterprise": return "bg-purple-500";
    default: return "bg-gray-500";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-500";
    case "trial": return "bg-blue-500";
    case "suspended": return "bg-red-500";
    case "overdue": return "bg-yellow-500";
    default: return "bg-gray-500";
  }
};

export const getHealthIcon = (health: string) => {
  // Return icon names that can be used with lucide-react
  switch (health) {
    case "healthy": return "CheckCircle";
    case "warning": return "AlertTriangle";
    case "critical": return "XCircle";
    case "offline": return "WifiOff";
    default: return "Wifi";
  }
};

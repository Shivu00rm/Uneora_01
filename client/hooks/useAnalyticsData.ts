import { useState, useEffect } from "react";

// Types for analytics data
export interface SalesMetrics {
  daily: number;
  weekly: number;
  monthly: number;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  store?: string;
  channel?: string;
}

export interface InventoryAlert {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  storeId: string;
  storeName: string;
  severity: "critical" | "warning" | "low";
}

export interface ActiveUserMetrics {
  role: string;
  count: number;
  lastActive: string;
  growth: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  organizationId: string;
  organizationName: string;
}

export interface AnalyticsFilters {
  dateRange: { from: Date; to: Date };
  store: string;
  channel: string;
}

export interface AuditFilters {
  search: string;
  role: string;
  action: string;
  dateFrom: string;
  dateTo: string;
}

// Hook for analytics data
export function useAnalyticsData(filters: AnalyticsFilters) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics>({
    daily: 45000,
    weekly: 285000,
    monthly: 1245000,
    growth: { daily: 12.5, weekly: 8.3, monthly: 15.7 },
  });

  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { date: "2024-01-01", revenue: 42000, orders: 156 },
    { date: "2024-01-02", revenue: 38000, orders: 142 },
    { date: "2024-01-03", revenue: 51000, orders: 189 },
    { date: "2024-01-04", revenue: 47000, orders: 167 },
    { date: "2024-01-05", revenue: 54000, orders: 203 },
    { date: "2024-01-06", revenue: 62000, orders: 234 },
    { date: "2024-01-07", revenue: 59000, orders: 221 },
    { date: "2024-01-08", revenue: 48000, orders: 178 },
    { date: "2024-01-09", revenue: 55000, orders: 205 },
    { date: "2024-01-10", revenue: 61000, orders: 228 },
    { date: "2024-01-11", revenue: 57000, orders: 213 },
    { date: "2024-01-12", revenue: 63000, orders: 241 },
    { date: "2024-01-13", revenue: 58000, orders: 219 },
    { date: "2024-01-14", revenue: 52000, orders: 195 },
    { date: "2024-01-15", revenue: 65000, orders: 248 },
  ]);

  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([
    {
      id: "1",
      productName: "Samsung Galaxy A54",
      sku: "SAM-A54-128",
      currentStock: 5,
      reorderLevel: 20,
      storeId: "store-001",
      storeName: "Delhi Main Store",
      severity: "critical",
    },
    {
      id: "2",
      productName: "Apple iPhone 15",
      sku: "APL-IP15-256",
      currentStock: 12,
      reorderLevel: 25,
      storeId: "store-002",
      storeName: "Mumbai Central",
      severity: "warning",
    },
    {
      id: "3",
      productName: "OnePlus 11",
      sku: "OPL-11-256",
      currentStock: 8,
      reorderLevel: 15,
      storeId: "store-001",
      storeName: "Delhi Main Store",
      severity: "low",
    },
    {
      id: "4",
      productName: "Xiaomi Redmi Note 12",
      sku: "XIA-RN12-128",
      currentStock: 3,
      reorderLevel: 18,
      storeId: "store-003",
      storeName: "Bangalore Tech Hub",
      severity: "critical",
    },
    {
      id: "5",
      productName: "Google Pixel 7a",
      sku: "GOO-P7A-128",
      currentStock: 14,
      reorderLevel: 22,
      storeId: "store-002",
      storeName: "Mumbai Central",
      severity: "warning",
    },
  ]);

  const [activeUsers, setActiveUsers] = useState<ActiveUserMetrics[]>([
    { role: "Super Admin", count: 12, lastActive: "2 minutes ago", growth: 5.2 },
    { role: "Org Admin", count: 156, lastActive: "5 minutes ago", growth: 12.8 },
    { role: "Store Manager", count: 489, lastActive: "1 minute ago", growth: 8.1 },
    { role: "Cashier", count: 1247, lastActive: "30 seconds ago", growth: 15.3 },
    { role: "Online Ops", count: 78, lastActive: "3 minutes ago", growth: -2.1 },
  ]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would make API calls here
      // const response = await fetch('/api/super-admin/analytics', {
      //   method: 'POST',
      //   body: JSON.stringify(filters)
      // });
      
      // Apply filters to mock data
      let filteredRevenueData = revenueData;
      
      if (filters.store !== "all") {
        // Filter by store
        filteredRevenueData = revenueData.map(item => ({
          ...item,
          revenue: item.revenue * (Math.random() * 0.4 + 0.8), // Simulate store-specific data
          orders: Math.floor(item.orders * (Math.random() * 0.4 + 0.8)),
        }));
      }
      
      if (filters.channel !== "all") {
        // Filter by channel
        filteredRevenueData = filteredRevenueData.map(item => ({
          ...item,
          revenue: item.revenue * (filters.channel === "online" ? 1.2 : 0.8),
          orders: Math.floor(item.orders * (filters.channel === "online" ? 1.1 : 0.9)),
        }));
      }
      
      setRevenueData(filteredRevenueData);
      
      // Update metrics based on filtered data
      const totalRevenue = filteredRevenueData.reduce((sum, item) => sum + item.revenue, 0);
      const avgDaily = totalRevenue / filteredRevenueData.length;
      
      setSalesMetrics(prev => ({
        ...prev,
        daily: Math.floor(avgDaily),
        weekly: Math.floor(avgDaily * 7),
        monthly: Math.floor(avgDaily * 30),
      }));
      
    } catch (err) {
      setError("Failed to fetch analytics data");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchAnalyticsData();
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters.dateRange, filters.store, filters.channel]);

  return {
    loading,
    error,
    salesMetrics,
    revenueData,
    inventoryAlerts,
    activeUsers,
    refetch,
  };
}

// Hook for audit logs
export function useAuditLogs(filters: AuditFilters) {
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: "1",
      userId: "user-001",
      userName: "John Smith",
      role: "Org Admin",
      action: "CREATE_STORE",
      module: "Store Management",
      details: "Created new store: Bangalore Tech Hub",
      timestamp: "2024-01-15T10:30:00Z",
      organizationId: "org-001",
      organizationName: "TechCorp Solutions",
    },
    {
      id: "2",
      userId: "user-002",
      userName: "Sarah Johnson",
      role: "Super Admin",
      action: "SUSPEND_ORGANIZATION",
      module: "Organization Management",
      details: "Suspended organization due to payment failure",
      timestamp: "2024-01-15T09:45:00Z",
      organizationId: "org-002",
      organizationName: "RetailCorp Inc",
    },
    {
      id: "3",
      userId: "user-003",
      userName: "Mike Chen",
      role: "Store Manager",
      action: "INVENTORY_ADJUSTMENT",
      module: "Inventory Management",
      details: "Adjusted stock for iPhone 15: +50 units",
      timestamp: "2024-01-15T09:15:00Z",
      organizationId: "org-001",
      organizationName: "TechCorp Solutions",
    },
    {
      id: "4",
      userId: "user-004",
      userName: "Emily Davis",
      role: "Cashier",
      action: "PROCESS_SALE",
      module: "Point of Sale",
      details: "Processed sale transaction: ₹2,450",
      timestamp: "2024-01-15T08:55:00Z",
      organizationId: "org-003",
      organizationName: "QuickMart Stores",
    },
    {
      id: "5",
      userId: "user-005",
      userName: "David Wilson",
      role: "Org Admin",
      action: "UPDATE_INTEGRATION",
      module: "E-commerce Integration",
      details: "Updated Shopify integration settings",
      timestamp: "2024-01-15T08:30:00Z",
      organizationId: "org-001",
      organizationName: "TechCorp Solutions",
    },
    {
      id: "6",
      userId: "user-006",
      userName: "Lisa Brown",
      role: "Store Manager",
      action: "CREATE_PURCHASE_ORDER",
      module: "Purchase Orders",
      details: "Created PO #PO-2024-001 for Samsung products",
      timestamp: "2024-01-15T08:10:00Z",
      organizationId: "org-002",
      organizationName: "RetailCorp Inc",
    },
    {
      id: "7",
      userId: "user-007",
      userName: "Mark Taylor",
      role: "Super Admin",
      action: "CREATE_ORGANIZATION",
      module: "Organization Management",
      details: "Created new organization: StartupTech Ltd",
      timestamp: "2024-01-15T07:45:00Z",
      organizationId: "org-004",
      organizationName: "StartupTech Ltd",
    },
    {
      id: "8",
      userId: "user-008",
      userName: "Anna Rodriguez",
      role: "Online Ops Manager",
      action: "SYNC_INVENTORY",
      module: "E-commerce Integration",
      details: "Synchronized inventory with Amazon marketplace",
      timestamp: "2024-01-15T07:20:00Z",
      organizationId: "org-003",
      organizationName: "QuickMart Stores",
    },
  ]);

  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchAuditLogs = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Apply filters
      let filtered = auditLogs;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(log =>
          log.userName.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower) ||
          log.module.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.role !== "all") {
        filtered = filtered.filter(log => log.role === filters.role);
      }
      
      if (filters.action !== "all") {
        filtered = filtered.filter(log => log.action === filters.action);
      }
      
      setFilteredLogs(filtered);
      setTotalCount(filtered.length);
      
    } catch (err) {
      console.error("Audit logs fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filters.search, filters.role, filters.action, filters.dateFrom, filters.dateTo]);

  return {
    loading,
    auditLogs: filteredLogs,
    totalCount,
    refetch: fetchAuditLogs,
  };
}

// Export utility functions
export const exportAnalyticsCSV = (revenueData: RevenueData[], filename?: string) => {
  const csvData = revenueData.map(item => ({
    Date: item.date,
    Revenue: `₹${item.revenue.toLocaleString()}`,
    Orders: item.orders,
    "Revenue (Raw)": item.revenue,
  }));
  
  const headers = Object.keys(csvData[0]);
  const csvContent = [
    headers.join(","),
    ...csvData.map(row => 
      headers.map(header => {
        const value = (row as any)[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename || `analytics-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAuditLogsCSV = (auditLogs: AuditLogEntry[], filename?: string) => {
  const csvData = auditLogs.map(log => ({
    "User ID": log.userId,
    "User Name": log.userName,
    "Role": log.role,
    "Action": log.action,
    "Module": log.module,
    "Details": log.details,
    "Timestamp": log.timestamp,
    "Organization": log.organizationName,
  }));
  
  const headers = Object.keys(csvData[0]);
  const csvContent = [
    headers.join(","),
    ...csvData.map(row => 
      headers.map(header => {
        const value = (row as any)[header];
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename || `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

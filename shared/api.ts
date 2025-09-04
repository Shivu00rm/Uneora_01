/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ========================================
// MULTI-STORE & E-COMMERCE TYPES
// ========================================

/**
 * Enhanced user roles with store-specific permissions
 */
export type UserRole = 
  | "SUPER_ADMIN" 
  | "ORG_ADMIN" 
  | "STORE_MANAGER" 
  | "CASHIER" 
  | "ONLINE_OPS_MANAGER" 
  | "ORG_USER";

/**
 * Store information and configuration
 */
export interface Store {
  id: string;
  organizationId: string;
  name: string;
  code: string; // Unique store code (e.g., "ST001", "NYC-01")
  type: "physical" | "online" | "hybrid";
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone?: string;
    email?: string;
    manager?: string;
  };
  settings: {
    timezone: string;
    currency: string;
    taxSettings: {
      gstNumber?: string;
      taxRate: number;
    };
    operatingHours: {
      monday: { open: string; close: string; closed?: boolean };
      tuesday: { open: string; close: string; closed?: boolean };
      wednesday: { open: string; close: string; closed?: boolean };
      thursday: { open: string; close: string; closed?: boolean };
      friday: { open: string; close: string; closed?: boolean };
      saturday: { open: string; close: string; closed?: boolean };
      sunday: { open: string; close: string; closed?: boolean };
    };
  };
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
  updatedAt: string;
}

/**
 * Store-specific user permissions
 */
export interface StorePermission {
  id: string;
  userId: string;
  storeId: string;
  role: UserRole;
  permissions: {
    inventory: string[];
    pos: string[];
    reports: string[];
    settings: string[];
    staff: string[];
    ecommerce?: string[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * E-commerce platform configurations
 */
export interface EcommercePlatform {
  id: string;
  organizationId: string;
  platform: "shopify" | "woocommerce" | "amazon" | "flipkart" | "magento" | "opencart";
  name: string; // Custom name for this integration
  credentials: {
    apiKey?: string;
    apiSecret?: string;
    storeUrl?: string;
    accessToken?: string;
    sellerId?: string;
    [key: string]: any;
  };
  syncSettings: {
    syncInventory: boolean;
    syncPrices: boolean;
    syncOrders: boolean;
    syncProducts: boolean;
    autoLowStockUpdate: boolean;
    syncFrequency: "realtime" | "hourly" | "daily";
  };
  mappings: {
    storeId?: string; // Which physical store this maps to
    categoryMappings?: Record<string, string>;
    attributeMappings?: Record<string, string>;
  };
  status: "connected" | "disconnected" | "error" | "syncing";
  lastSync?: string;
  syncStats?: {
    productsSync: number;
    ordersSync: number;
    lastSyncTime: string;
    errors?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Product with multi-store inventory
 */
export interface Product {
  id: string;
  organizationId: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  images: string[];
  
  // Pricing
  basePrice: number;
  mrp: number;
  
  // Store-specific inventory
  storeInventory: Record<string, {
    quantity: number;
    reservedQuantity: number;
    reorderLevel: number;
    maxStockLevel: number;
    location?: string; // Shelf/bin location in store
  }>;
  
  // E-commerce specific
  ecommerceData?: {
    platforms: Record<string, {
      platformProductId: string;
      title?: string;
      description?: string;
      price: number;
      isActive: boolean;
      lastSync: string;
    }>;
    seoData?: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
    };
  };
  
  // Product specifications
  specifications: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    color?: string;
    size?: string;
    material?: string;
    [key: string]: any;
  };
  
  status: "active" | "inactive" | "discontinued";
  createdAt: string;
  updatedAt: string;
}

/**
 * Multi-channel order management
 */
export interface Order {
  id: string;
  orderNumber: string;
  organizationId: string;
  storeId?: string; // null for online orders
  source: "pos" | "shopify" | "woocommerce" | "amazon" | "flipkart" | "website";
  
  customer: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
  };
  
  items: Array<{
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    storeId?: string; // Which store fulfilled this item
  }>;
  
  pricing: {
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
  };
  
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  fulfillmentStatus: "unfulfilled" | "partial" | "fulfilled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  
  fulfillment?: {
    storeId: string;
    fulfilledBy: string; // User ID
    fulfilledAt: string;
    trackingNumber?: string;
    shippingCarrier?: string;
  };
  
  platformData?: {
    platformOrderId: string;
    platformStatus: string;
    platformData: Record<string, any>;
  };
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Analytics and KPI data structures
 */
export interface StoreKPIs {
  storeId: string;
  storeName: string;
  period: {
    start: string;
    end: string;
  };
  
  sales: {
    revenue: number;
    orders: number;
    averageOrderValue: number;
    growth: {
      revenueGrowth: number;
      ordersGrowth: number;
    };
  };
  
  inventory: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    turnoverRate: number;
  };
  
  performance: {
    topSellingProducts: Array<{
      productId: string;
      name: string;
      quantity: number;
      revenue: number;
    }>;
    hourlyPerformance: Array<{
      hour: number;
      sales: number;
      orders: number;
    }>;
  };
}

export interface ConsolidatedKPIs {
  organizationId: string;
  period: {
    start: string;
    end: string;
  };
  
  overall: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalStores: number;
    activeEcommercePlatforms: number;
  };
  
  channels: {
    physical: {
      revenue: number;
      orders: number;
      stores: number;
    };
    online: {
      revenue: number;
      orders: number;
      platforms: Array<{
        platform: string;
        revenue: number;
        orders: number;
      }>;
    };
  };
  
  storePerformance: StoreKPIs[];
  
  inventory: {
    totalProducts: number;
    totalValue: number;
    criticalStockAlerts: number;
    syncStatus: {
      inSync: number;
      syncPending: number;
      syncErrors: number;
    };
  };
}

/**
 * Stock movement with multi-store support
 */
export interface StockMovement {
  id: string;
  organizationId: string;
  productId: string;
  storeId: string;
  type: "in" | "out" | "adjustment" | "transfer";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference?: {
    type: "order" | "purchase" | "transfer" | "adjustment";
    id: string;
  };
  transferDetails?: {
    fromStoreId: string;
    toStoreId: string;
    status: "pending" | "in_transit" | "completed" | "cancelled";
  };
  performedBy: string; // User ID
  notes?: string;
  createdAt: string;
}

/**
 * API Response types for multi-store operations
 */
export interface StoreListResponse {
  stores: Store[];
  total: number;
  page: number;
  limit: number;
}

export interface EcommercePlatformResponse {
  platforms: EcommercePlatform[];
  total: number;
}

export interface ConsolidatedAnalyticsResponse {
  kpis: ConsolidatedKPIs;
  storeComparison: Array<{
    storeId: string;
    storeName: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
  channelPerformance: Array<{
    channel: string;
    revenue: number;
    percentage: number;
  }>;
}

export interface SyncStatusResponse {
  platforms: Array<{
    platformId: string;
    platformName: string;
    status: "syncing" | "completed" | "error";
    lastSync: string;
    syncedItems: {
      products: number;
      orders: number;
      inventory: number;
    };
    errors?: string[];
  }>;
  overallStatus: "healthy" | "warning" | "error";
}

/**
 * Multi-store user profile
 */
export interface MultiStoreUser {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  role: UserRole;
  
  // Store-specific access
  storeAccess: Array<{
    storeId: string;
    storeName: string;
    role: UserRole;
    permissions: string[];
    isActive: boolean;
  }>;
  
  // Default store for this user
  defaultStoreId?: string;
  
  // E-commerce platform access
  ecommerceAccess?: {
    platforms: string[];
    permissions: string[];
  };
  
  settings: {
    timezone: string;
    language: string;
    notifications: {
      lowStock: boolean;
      newOrders: boolean;
      syncErrors: boolean;
    };
  };
  
  lastLogin?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

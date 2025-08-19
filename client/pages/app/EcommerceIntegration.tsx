import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Settings, 
  RefreshCw, 
  Zap,
  ShoppingCart,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Package,
  TrendingUp,
  Sync,
  Play,
  Pause,
  Edit2,
  Trash2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { EcommercePlatform, SyncStatusResponse } from "@shared/api";

// Mock data for demonstration
const mockPlatforms: EcommercePlatform[] = [
  {
    id: "platform-1",
    organizationId: "org-1",
    platform: "shopify",
    name: "Main Shopify Store",
    credentials: {
      storeUrl: "mystore.myshopify.com",
      accessToken: "shpat_***************"
    },
    syncSettings: {
      syncInventory: true,
      syncPrices: true,
      syncOrders: true,
      syncProducts: true,
      autoLowStockUpdate: true,
      syncFrequency: "realtime"
    },
    mappings: {
      storeId: "store-1"
    },
    status: "connected",
    lastSync: "2024-01-15T10:30:00Z",
    syncStats: {
      productsSync: 1250,
      ordersSync: 543,
      lastSyncTime: "2024-01-15T10:30:00Z",
      errors: []
    },
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "platform-2",
    organizationId: "org-1",
    platform: "amazon",
    name: "Amazon Seller Account",
    credentials: {
      sellerId: "A2EXAMPLE123456",
      accessToken: "Atza|***************"
    },
    syncSettings: {
      syncInventory: true,
      syncPrices: false,
      syncOrders: true,
      syncProducts: false,
      autoLowStockUpdate: true,
      syncFrequency: "hourly"
    },
    mappings: {},
    status: "connected",
    lastSync: "2024-01-15T09:00:00Z",
    syncStats: {
      productsSync: 85,
      ordersSync: 234,
      lastSyncTime: "2024-01-15T09:00:00Z",
      errors: ["Price sync failed for 3 products"]
    },
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "platform-3",
    organizationId: "org-1",
    platform: "woocommerce",
    name: "Website Store",
    credentials: {
      storeUrl: "https://mystore.com",
      apiKey: "ck_***************",
      apiSecret: "cs_***************"
    },
    syncSettings: {
      syncInventory: true,
      syncPrices: true,
      syncOrders: true,
      syncProducts: true,
      autoLowStockUpdate: false,
      syncFrequency: "daily"
    },
    mappings: {
      storeId: "store-2"
    },
    status: "error",
    lastSync: "2024-01-14T18:00:00Z",
    syncStats: {
      productsSync: 0,
      ordersSync: 0,
      lastSyncTime: "2024-01-14T18:00:00Z",
      errors: ["Authentication failed", "Connection timeout"]
    },
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-14T18:00:00Z"
  }
];

const mockSyncStatus: SyncStatusResponse = {
  platforms: [
    {
      platformId: "platform-1",
      platformName: "Main Shopify Store",
      status: "completed",
      lastSync: "2024-01-15T10:30:00Z",
      syncedItems: {
        products: 1250,
        orders: 543,
        inventory: 1250
      }
    },
    {
      platformId: "platform-2", 
      platformName: "Amazon Seller Account",
      status: "completed",
      lastSync: "2024-01-15T09:00:00Z",
      syncedItems: {
        products: 85,
        orders: 234,
        inventory: 85
      },
      errors: ["Price sync failed for 3 products"]
    },
    {
      platformId: "platform-3",
      platformName: "Website Store", 
      status: "error",
      lastSync: "2024-01-14T18:00:00Z",
      syncedItems: {
        products: 0,
        orders: 0,
        inventory: 0
      },
      errors: ["Authentication failed", "Connection timeout"]
    }
  ],
  overallStatus: "warning"
};

export default function EcommerceIntegration() {
  const { hasPermission, canManageEcommerce } = useAuth();
  const [platforms, setPlatforms] = useState<EcommercePlatform[]>(mockPlatforms);
  const [syncStatus, setSyncStatus] = useState<SyncStatusResponse>(mockSyncStatus);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRunningSync, setIsRunningSync] = useState(false);

  const getStatusIcon = (status: EcommercePlatform['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: EcommercePlatform['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      case 'syncing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: EcommercePlatform['platform']) => {
    switch (platform) {
      case 'shopify': return <ShoppingCart className="h-6 w-6 text-green-600" />;
      case 'amazon': return <Package className="h-6 w-6 text-orange-600" />;
      case 'woocommerce': return <Globe className="h-6 w-6 text-purple-600" />;
      case 'flipkart': return <TrendingUp className="h-6 w-6 text-blue-600" />;
      default: return <Globe className="h-6 w-6 text-gray-600" />;
    }
  };

  const handleRunSync = async (platformId?: string) => {
    setIsRunningSync(true);
    // Simulate sync process
    setTimeout(() => {
      setIsRunningSync(false);
      if (platformId) {
        setPlatforms(prev => prev.map(p => 
          p.id === platformId 
            ? { ...p, status: "connected", lastSync: new Date().toISOString() }
            : p
        ));
      } else {
        setPlatforms(prev => prev.map(p => ({ 
          ...p, 
          status: "connected", 
          lastSync: new Date().toISOString() 
        })));
      }
    }, 3000);
  };

  const handleTogglePlatform = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, status: p.status === "connected" ? "disconnected" : "connected" }
        : p
    ));
  };

  const handleEditPlatform = (platformId: string) => {
    console.log("Edit platform:", platformId);
    // TODO: Open edit form
  };

  const handleDeletePlatform = (platformId: string) => {
    if (confirm("Are you sure you want to remove this integration?")) {
      setPlatforms(prev => prev.filter(p => p.id !== platformId));
    }
  };

  if (!hasPermission("ecommerce", "view")) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">You don't have permission to view e-commerce integrations.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-commerce Integration</h1>
          <p className="text-gray-600">Manage multi-channel sync for inventory, orders, and pricing</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleRunSync()}
            disabled={isRunningSync}
          >
            {isRunningSync ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sync className="h-4 w-4 mr-2" />
            )}
            Sync All
          </Button>
          {canManageEcommerce() && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Platform
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="sync-status">Sync Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Platforms</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platforms.filter(p => p.status === "connected").length}</div>
                <p className="text-xs text-muted-foreground">
                  {platforms.length} total integrations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Synced Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platforms.reduce((sum, p) => sum + (p.syncStats?.productsSync || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all platforms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {platforms.reduce((sum, p) => sum + (p.syncStats?.ordersSync || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sync Health</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    {syncStatus.overallStatus === "healthy" ? "100%" : 
                     syncStatus.overallStatus === "warning" ? "75%" : "50%"}
                  </div>
                  <Badge 
                    variant={syncStatus.overallStatus === "healthy" ? "default" : 
                           syncStatus.overallStatus === "warning" ? "secondary" : "destructive"}
                  >
                    {syncStatus.overallStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall platform health
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your e-commerce integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Sync className="h-6 w-6" />
                  <span>Sync Inventory</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Package className="h-6 w-6" />
                  <span>Import Products</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span>Sync Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <Card key={platform.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(platform.platform)}
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span className="capitalize">{platform.platform}</span>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(platform.status)} text-white border-none`}
                          >
                            {platform.status}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {canManageEcommerce() && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPlatform(platform.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePlatform(platform.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sync Settings */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {platform.syncSettings.syncInventory ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Inventory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {platform.syncSettings.syncOrders ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {platform.syncSettings.syncPrices ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Prices</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {platform.syncSettings.syncProducts ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Products</span>
                    </div>
                  </div>

                  {/* Stats */}
                  {platform.syncStats && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-lg font-semibold">{platform.syncStats.productsSync}</div>
                        <div className="text-gray-600">Products</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{platform.syncStats.ordersSync}</div>
                        <div className="text-gray-600">Orders</div>
                      </div>
                    </div>
                  )}

                  {/* Last Sync */}
                  {platform.lastSync && (
                    <div className="text-sm text-gray-600">
                      Last sync: {new Date(platform.lastSync).toLocaleString()}
                    </div>
                  )}

                  {/* Errors */}
                  {platform.syncStats?.errors && platform.syncStats.errors.length > 0 && (
                    <div className="text-sm text-red-600">
                      <div className="font-medium">Recent Errors:</div>
                      <ul className="list-disc list-inside">
                        {platform.syncStats.errors.slice(0, 2).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleRunSync(platform.id)}
                      disabled={isRunningSync || platform.status === "syncing"}
                    >
                      {platform.status === "syncing" ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sync className="h-4 w-4 mr-2" />
                      )}
                      Sync
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleTogglePlatform(platform.id)}
                    >
                      {platform.status === "connected" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync-status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sync Status</CardTitle>
              <CardDescription>Real-time sync status for all connected platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncStatus.platforms.map((platform) => (
                  <div key={platform.platformId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(platform.status as any)}
                      <div>
                        <div className="font-medium">{platform.platformName}</div>
                        <div className="text-sm text-gray-600">
                          Last sync: {new Date(platform.lastSync).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {platform.syncedItems.products} products, {platform.syncedItems.orders} orders
                      </div>
                      {platform.errors && platform.errors.length > 0 && (
                        <div className="text-xs text-red-600">
                          {platform.errors.length} error(s)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(platform.platform)}
                        <span>{platform.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{platform.syncStats?.ordersSync || 0} orders</div>
                        <div className="text-sm text-gray-600">
                          {platform.syncStats?.productsSync || 0} products
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sync Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex justify-between items-center">
                      <span>{platform.name}</span>
                      <Badge variant="outline" className="capitalize">
                        {platform.syncSettings.syncFrequency}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

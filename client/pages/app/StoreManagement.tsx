import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Store, 
  MapPin, 
  Clock, 
  Settings,
  Users,
  BarChart3,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Store as StoreType } from "@shared/api";

// Mock data for demonstration
const mockStores: StoreType[] = [
  {
    id: "store-1",
    organizationId: "org-1",
    name: "Downtown Store",
    code: "DS001",
    type: "physical",
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400001",
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    contact: {
      phone: "+91 9876543210",
      email: "downtown@store.com",
      manager: "Rajesh Kumar"
    },
    settings: {
      timezone: "Asia/Kolkata",
      currency: "INR",
      taxSettings: {
        gstNumber: "27AAAAA0000A1Z5",
        taxRate: 18
      },
      operatingHours: {
        monday: { open: "09:00", close: "21:00" },
        tuesday: { open: "09:00", close: "21:00" },
        wednesday: { open: "09:00", close: "21:00" },
        thursday: { open: "09:00", close: "21:00" },
        friday: { open: "09:00", close: "21:00" },
        saturday: { open: "09:00", close: "22:00" },
        sunday: { open: "10:00", close: "20:00" }
      }
    },
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "store-2",
    organizationId: "org-1",
    name: "Mall Outlet",
    code: "MO001",
    type: "physical",
    address: {
      street: "Phoenix Mills, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra", 
      country: "India",
      pincode: "400013"
    },
    contact: {
      phone: "+91 9876543211",
      email: "mall@store.com",
      manager: "Priya Sharma"
    },
    settings: {
      timezone: "Asia/Kolkata",
      currency: "INR",
      taxSettings: {
        gstNumber: "27AAAAA0000A1Z5",
        taxRate: 18
      },
      operatingHours: {
        monday: { open: "10:00", close: "22:00" },
        tuesday: { open: "10:00", close: "22:00" },
        wednesday: { open: "10:00", close: "22:00" },
        thursday: { open: "10:00", close: "22:00" },
        friday: { open: "10:00", close: "22:00" },
        saturday: { open: "10:00", close: "23:00" },
        sunday: { open: "10:00", close: "23:00" }
      }
    },
    status: "active",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z"
  },
  {
    id: "store-3",
    organizationId: "org-1",
    name: "Online Store",
    code: "OS001",
    type: "online",
    address: {
      street: "Warehouse Complex",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      pincode: "411001"
    },
    contact: {
      phone: "+91 9876543212",
      email: "online@store.com",
      manager: "Amit Patel"
    },
    settings: {
      timezone: "Asia/Kolkata",
      currency: "INR",
      taxSettings: {
        gstNumber: "27AAAAA0000A1Z5",
        taxRate: 18
      },
      operatingHours: {
        monday: { open: "00:00", close: "23:59" },
        tuesday: { open: "00:00", close: "23:59" },
        wednesday: { open: "00:00", close: "23:59" },
        thursday: { open: "00:00", close: "23:59" },
        friday: { open: "00:00", close: "23:59" },
        saturday: { open: "00:00", close: "23:59" },
        sunday: { open: "00:00", close: "23:59" }
      }
    },
    status: "active",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  }
];

export default function StoreManagement() {
  const { hasPermission, canManageStore } = useAuth();
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Store['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: Store['type']) => {
    switch (type) {
      case 'physical': return <Store className="h-4 w-4" />;
      case 'online': return <BarChart3 className="h-4 w-4" />;
      case 'hybrid': return <Settings className="h-4 w-4" />;
      default: return <Store className="h-4 w-4" />;
    }
  };

  const handleCreateStore = () => {
    setShowCreateForm(true);
  };

  const handleEditStore = (storeId: string) => {
    console.log("Edit store:", storeId);
    // TODO: Implement edit functionality
  };

  const handleDeleteStore = (storeId: string) => {
    if (confirm("Are you sure you want to delete this store?")) {
      setStores(stores.filter(store => store.id !== storeId));
    }
  };

  const handleViewStore = (storeId: string) => {
    console.log("View store:", storeId);
    // TODO: Navigate to store dashboard
  };

  if (!hasPermission("stores", "view")) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">You don't have permission to view stores.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600">Manage your organization's stores and locations</p>
        </div>
        {hasPermission("stores", "create") && (
          <Button onClick={handleCreateStore} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Store
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search stores by name, code, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {getTypeIcon(store.type)}
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{store.code}</span>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(store.status)} text-white border-none`}
                      >
                        {store.status}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewStore(store.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canManageStore(store.id) && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStore(store.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStore(store.id)}
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
              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <div>{store.address.street}</div>
                  <div>{store.address.city}, {store.address.state} {store.address.pincode}</div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                {store.contact.manager && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{store.contact.manager}</span>
                  </div>
                )}
                {store.contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{store.contact.phone}</span>
                  </div>
                )}
                {store.contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{store.contact.email}</span>
                  </div>
                )}
              </div>

              {/* Operating Hours (for physical stores) */}
              {store.type === "physical" && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {store.settings.operatingHours.monday.open} - {store.settings.operatingHours.monday.close}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewStore(store.id)}
                >
                  View Dashboard
                </Button>
                {hasPermission("inventory", "view") && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    Inventory
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first store"}
            </p>
            {hasPermission("stores", "create") && !searchQuery && (
              <Button onClick={handleCreateStore}>
                <Plus className="h-4 w-4 mr-2" />
                Create Store
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

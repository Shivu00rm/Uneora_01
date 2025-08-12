import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  BarChart3,
  History,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ExcelImportExport } from "@/components/ExcelImportExport";
import { POGenerator } from "@/components/POGenerator";

const mockInventory = [
  {
    id: 1,
    sku: "APL-IP14-128",
    name: "Apple iPhone 14 Pro 128GB",
    category: "Electronics",
    currentStock: 15,
    reorderLevel: 10,
    maxStock: 50,
    unitPrice: 79900,
    supplier: "TechSupply India",
    location: "Warehouse A",
    lastUpdated: "2024-01-15",
    status: "in_stock",
    movements: [
      {
        type: "in",
        quantity: 20,
        date: "2024-01-10",
        reason: "Purchase Order PO-2024-001",
      },
      {
        type: "out",
        quantity: 5,
        date: "2024-01-12",
        reason: "Sale - Invoice INV-001",
      },
    ],
  },
  {
    id: 2,
    sku: "SAM-GB-PRO",
    name: "Samsung Galaxy Buds Pro",
    category: "Electronics",
    currentStock: 3,
    reorderLevel: 15,
    maxStock: 100,
    unitPrice: 15990,
    supplier: "Electronics Hub",
    location: "Warehouse A",
    lastUpdated: "2024-01-14",
    status: "low_stock",
    movements: [
      {
        type: "in",
        quantity: 50,
        date: "2024-01-05",
        reason: "Purchase Order PO-2024-002",
      },
      {
        type: "out",
        quantity: 47,
        date: "2024-01-14",
        reason: "Bulk Sale - INV-025",
      },
    ],
  },
  {
    id: 3,
    sku: "NIK-AM-270",
    name: "Nike Air Max 270 Shoes",
    category: "Footwear",
    currentStock: 0,
    reorderLevel: 20,
    maxStock: 80,
    unitPrice: 12995,
    supplier: "Fashion Hub",
    location: "Warehouse B",
    lastUpdated: "2024-01-13",
    status: "out_of_stock",
    movements: [
      {
        type: "out",
        quantity: 25,
        date: "2024-01-13",
        reason: "Sale - Multiple Orders",
      },
    ],
  },
  {
    id: 4,
    sku: "LEV-511-32",
    name: "Levi's 511 Jeans Size 32",
    category: "Clothing",
    currentStock: 45,
    reorderLevel: 25,
    maxStock: 100,
    unitPrice: 3999,
    supplier: "Clothing Co",
    location: "Warehouse B",
    lastUpdated: "2024-01-12",
    status: "in_stock",
    movements: [
      {
        type: "in",
        quantity: 50,
        date: "2024-01-08",
        reason: "Purchase Order PO-2024-003",
      },
      {
        type: "out",
        quantity: 5,
        date: "2024-01-12",
        reason: "Sale - INV-020",
      },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "in_stock":
      return "default";
    case "low_stock":
      return "secondary";
    case "out_of_stock":
      return "destructive";
    default:
      return "outline";
  }
};

const getStockStatus = (currentStock: number, reorderLevel: number) => {
  if (currentStock === 0) return "out_of_stock";
  if (currentStock <= reorderLevel) return "low_stock";
  return "in_stock";
};

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isStockMovementOpen, setIsStockMovementOpen] = useState(false);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    unitPrice: "",
    initialStock: "",
    reorderLevel: "",
    maxStock: "",
    supplier: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockItems = mockInventory.filter(
    (item) => item.currentStock <= item.reorderLevel,
  );
  const outOfStockItems = mockInventory.filter(
    (item) => item.currentStock === 0,
  );
  const totalValue = mockInventory.reduce(
    (sum, item) => sum + item.currentStock * item.unitPrice,
    0,
  );

  // Form validation
  const isFormValid = () => {
    return newProduct.name.trim() !== "" &&
           newProduct.sku.trim() !== "" &&
           newProduct.category !== "" &&
           newProduct.unitPrice !== "" &&
           newProduct.initialStock !== "" &&
           newProduct.reorderLevel !== "" &&
           newProduct.maxStock !== "" &&
           newProduct.supplier !== "" &&
           Number(newProduct.unitPrice) > 0 &&
           Number(newProduct.initialStock) >= 0 &&
           Number(newProduct.reorderLevel) >= 0 &&
           Number(newProduct.maxStock) > 0 &&
           Number(newProduct.maxStock) >= Number(newProduct.reorderLevel);
  };

  // Handle form submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    // Check if SKU already exists
    const existingSKU = mockInventory.find(item =>
      item.sku.toLowerCase() === newProduct.sku.toLowerCase()
    );

    if (existingSKU) {
      alert("A product with this SKU already exists. Please use a unique SKU.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new product object
      const productToAdd = {
        id: mockInventory.length + 1,
        sku: newProduct.sku.toUpperCase(),
        name: newProduct.name.trim(),
        category: newProduct.category,
        currentStock: Number(newProduct.initialStock),
        reorderLevel: Number(newProduct.reorderLevel),
        maxStock: Number(newProduct.maxStock),
        unitPrice: Number(newProduct.unitPrice),
        supplier: newProduct.supplier,
        location: "Warehouse A", // Default location
        lastUpdated: new Date().toISOString().split('T')[0],
        status: Number(newProduct.initialStock) === 0 ? "out_of_stock" :
                Number(newProduct.initialStock) <= Number(newProduct.reorderLevel) ? "low_stock" : "in_stock",
        movements: Number(newProduct.initialStock) > 0 ? [{
          type: "in" as const,
          quantity: Number(newProduct.initialStock),
          date: new Date().toISOString().split('T')[0],
          reason: "Initial Stock - Product Creation"
        }] : []
      };

      // In a real app, this would be an API call
      // await addProductAPI(productToAdd);

      // For demo purposes, we'll add to the mock array
      mockInventory.push(productToAdd);

      // Reset form
      setNewProduct({
        name: "",
        sku: "",
        category: "",
        unitPrice: "",
        initialStock: "",
        reorderLevel: "",
        maxStock: "",
        supplier: "",
        description: ""
      });

      // Close dialog
      setIsAddProductOpen(false);

      // Show success message
      alert(`Product "${newProduct.name}" has been successfully added to inventory!`);

    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancelAdd = () => {
    setNewProduct({
      name: "",
      sku: "",
      category: "",
      unitPrice: "",
      initialStock: "",
      reorderLevel: "",
      maxStock: "",
      supplier: "",
      description: ""
    });
    setIsAddProductOpen(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Track stock levels, movements, and get automated alerts
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <POGenerator inventory={mockInventory} />
          <ExcelImportExport />
          <Dialog
            open={isStockMovementOpen}
            onOpenChange={setIsStockMovementOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="mr-2 h-4 w-4" />
                Stock Movement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Record Stock Movement</DialogTitle>
                <DialogDescription>
                  Add stock in/out entry with reason and quantity
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-select">Product</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockInventory.map((item) => (
                        <SelectItem key={item.id} value={item.sku}>
                          {item.name} - {item.sku}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="movement-type">Movement Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Stock In</SelectItem>
                      <SelectItem value="out">Stock Out</SelectItem>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Reason for stock movement"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Record Movement</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsStockMovementOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Create a new inventory item with stock details
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name *</Label>
                    <Input
                      id="product-name"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({...prev, name: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-sku">SKU *</Label>
                    <Input
                      id="product-sku"
                      placeholder="Product SKU"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct(prev => ({...prev, sku: e.target.value.toUpperCase()}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Category *</Label>
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct(prev => ({...prev, category: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Footwear">Footwear</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit-price">Unit Price (₹) *</Label>
                    <Input
                      id="unit-price"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={newProduct.unitPrice}
                      onChange={(e) => setNewProduct(prev => ({...prev, unitPrice: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initial-stock">Initial Stock *</Label>
                    <Input
                      id="initial-stock"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={newProduct.initialStock}
                      onChange={(e) => setNewProduct(prev => ({...prev, initialStock: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reorder-level">Reorder Level *</Label>
                    <Input
                      id="reorder-level"
                      type="number"
                      placeholder="10"
                      min="0"
                      value={newProduct.reorderLevel}
                      onChange={(e) => setNewProduct(prev => ({...prev, reorderLevel: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-stock">Max Stock *</Label>
                    <Input
                      id="max-stock"
                      type="number"
                      placeholder="100"
                      min="1"
                      value={newProduct.maxStock}
                      onChange={(e) => setNewProduct(prev => ({...prev, maxStock: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier *</Label>
                    <Select value={newProduct.supplier} onValueChange={(value) => setNewProduct(prev => ({...prev, supplier: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TechSupply India">TechSupply India</SelectItem>
                        <SelectItem value="Electronics Hub">Electronics Hub</SelectItem>
                        <SelectItem value="Fashion Hub">Fashion Hub</SelectItem>
                        <SelectItem value="Global Suppliers">Global Suppliers</SelectItem>
                        <SelectItem value="Local Vendor">Local Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                      id="product-description"
                      placeholder="Product description (optional)"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({...prev, description: e.target.value}))}
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting || !isFormValid()}
                    >
                      {isSubmitting ? "Adding..." : "Add Product"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelAdd}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInventory.length}</div>
            <p className="text-xs text-muted-foreground">Active SKUs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {outOfStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Immediate attention needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalValue / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">All Inventory</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Inventory Items ({filteredInventory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const currentStatus = getStockStatus(
                      item.currentStock,
                      item.reorderLevel,
                    );
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {item.sku}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Location: {item.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {item.currentStock} units
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Reorder at: {item.reorderLevel}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(currentStatus)}>
                            {currentStatus.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          ₹{item.unitPrice.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₹
                          {(
                            item.currentStock * item.unitPrice
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Stock Alerts ({lowStockItems.length + outOfStockItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outOfStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-destructive/5"
                  >
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive" />
                        {item.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        SKU: {item.sku}
                      </div>
                      <div className="text-sm text-destructive font-medium">
                        OUT OF STOCK
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Create PO
                      </Button>
                      <Button size="sm">Add Stock</Button>
                    </div>
                  </div>
                ))}

                {lowStockItems
                  .filter((item) => item.currentStock > 0)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20"
                    >
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          {item.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {item.sku}
                        </div>
                        <div className="text-sm text-yellow-600 font-medium">
                          Only {item.currentStock} units left (Reorder at{" "}
                          {item.reorderLevel})
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Create PO
                        </Button>
                        <Button size="sm">Add Stock</Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Stock Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInventory.flatMap((item) =>
                  item.movements.map((movement, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        {movement.type === "in" ? (
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {movement.reason}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${movement.type === "in" ? "text-emerald-600" : "text-red-600"}`}
                        >
                          {movement.type === "in" ? "+" : "-"}
                          {movement.quantity} units
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {movement.date}
                        </div>
                      </div>
                    </div>
                  )),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  UserPlus,
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  Package,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const mockVendors = [
  {
    id: 1,
    name: "TechSupply India Pvt Ltd",
    contact: "Rajesh Kumar",
    email: "rajesh@techsupply.in",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra",
    gstNumber: "27AAAAA0000A1Z5",
    category: "Electronics",
    status: "active",
    rating: 4.8,
    totalOrders: 156,
    totalValue: 2500000,
    onTimeDelivery: 95,
    qualityScore: 92,
    paymentTerms: "Net 30",
    joinedDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Fashion Hub Distributors",
    contact: "Priya Sharma",
    email: "priya@fashionhub.in",
    phone: "+91 87654 32109",
    address: "Delhi, Delhi",
    gstNumber: "07BBBBB1111B2Z6",
    category: "Clothing",
    status: "active",
    rating: 4.5,
    totalOrders: 89,
    totalValue: 1200000,
    onTimeDelivery: 88,
    qualityScore: 90,
    paymentTerms: "Net 15",
    joinedDate: "2023-03-22",
  },
  {
    id: 3,
    name: "Global Electronics Corp",
    contact: "Amit Patel",
    email: "amit@globalelec.in",
    phone: "+91 76543 21098",
    address: "Bangalore, Karnataka",
    gstNumber: "29CCCCC2222C3Z7",
    category: "Electronics",
    status: "pending",
    rating: 4.2,
    totalOrders: 34,
    totalValue: 850000,
    onTimeDelivery: 82,
    qualityScore: 85,
    paymentTerms: "Advance",
    joinedDate: "2023-08-10",
  },
];

const performanceMetrics = [
  { label: "On-time Delivery", value: 91, trend: "up" },
  { label: "Quality Score", value: 89, trend: "up" },
  { label: "Price Competitiveness", value: 76, trend: "down" },
  { label: "Communication", value: 94, trend: "up" },
];

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);

  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || vendor.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || vendor.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "pending":
        return Clock;
      case "suspended":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Vendor Management
          </h1>
          <p className="text-muted-foreground">
            Manage suppliers and track their performance metrics
          </p>
        </div>

        <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Create a new vendor profile with complete business details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor-name">Company Name</Label>
                <Input id="vendor-name" placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input
                  id="contact-person"
                  placeholder="Enter contact person name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor-email">Email</Label>
                <Input
                  id="vendor-email"
                  type="email"
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor-phone">Phone</Label>
                <Input id="vendor-phone" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst-number">GST Number</Label>
                <Input id="gst-number" placeholder="GSTIN" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor-category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="food">Food & Beverages</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="stationery">Stationery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="vendor-address">Address</Label>
                <Textarea
                  id="vendor-address"
                  placeholder="Enter complete address"
                />
              </div>
              <div className="md:col-span-2 flex gap-2 pt-4">
                <Button className="flex-1">Create Vendor</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddVendorOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => {
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>
                <TrendIcon
                  className={`h-4 w-4 ${metric.trend === "up" ? "text-emerald-500" : "text-red-500"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}%</div>
                <Progress value={metric.value} className="mt-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3" style={{backgroundColor: '#f1f5f9'}}>
          <TabsTrigger
            value="vendors"
            style={{color: '#1e293b', fontWeight: '500'}}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-blue-100 data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Vendor List
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            style={{color: '#1e293b', fontWeight: '500'}}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-50 data-[state=active]:to-emerald-100 data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            style={{color: '#1e293b', fontWeight: '500'}}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-50 data-[state=active]:to-amber-100 data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Recent Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-6" style={{position: 'relative'}}>
          {/* FlowStock Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              fontSize: '4rem',
              fontWeight: '900',
              color: 'rgba(59, 130, 246, 0.04)',
              pointerEvents: 'none',
              zIndex: 0,
              userSelect: 'none',
              fontFamily: 'system-ui'
            }}
          >
            FlowStock
          </div>
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors..."
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
                    <SelectItem value="Food">Food & Beverages</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Vendors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory ({filteredVendors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => {
                    const StatusIcon = getStatusIcon(vendor.status);
                    return (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{vendor.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {vendor.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {vendor.phone}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {vendor.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{vendor.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(vendor.status)}
                            className="flex items-center gap-1 w-fit"
                          >
                            <StatusIcon className="h-3 w-3" />
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{vendor.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            {vendor.totalOrders}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            {(vendor.totalValue / 100000).toFixed(1)}L
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6" style={{position: 'relative'}}>
          {/* FlowStock Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              fontSize: '4rem',
              fontWeight: '900',
              color: 'rgba(59, 130, 246, 0.04)',
              pointerEvents: 'none',
              zIndex: 0,
              userSelect: 'none',
              fontFamily: 'system-ui'
            }}
          >
            FlowStock
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Vendors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Performing Vendors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVendors
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3)
                    .map((vendor, index) => (
                      <div
                        key={vendor.id}
                        className="flex items-center gap-3 p-3 border rounded"
                      >
                        <div className="text-lg font-bold text-muted-foreground">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.category}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{vendor.rating}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.onTimeDelivery}% on-time
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Performance chart visualization
                    </p>
                    <p className="text-sm text-muted-foreground">Coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6" style={{position: 'relative'}}>
          {/* FlowStock Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              fontSize: '4rem',
              fontWeight: '900',
              color: 'rgba(59, 130, 246, 0.04)',
              pointerEvents: 'none',
              zIndex: 0,
              userSelect: 'none',
              fontFamily: 'system-ui'
            }}
          >
            FlowStock
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Purchase order tracking
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Integration with PO module coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

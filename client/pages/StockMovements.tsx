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
import {
  Plus,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  Calendar,
  User,
  FileText,
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
} from "lucide-react";

const mockMovements = [
  {
    id: "MOV-001",
    productName: "Apple iPhone 14 Pro",
    sku: "APL-IP14-128",
    type: "in",
    quantity: 25,
    previousStock: 10,
    newStock: 35,
    reason: "Purchase Order PO-2024-001",
    date: "2024-01-15",
    time: "10:30 AM",
    user: "Rajesh Sharma",
    reference: "PO-2024-001",
    notes: "Received from TechSupply India - Invoice INV-TS-001",
  },
  {
    id: "MOV-002",
    productName: "Samsung Galaxy Buds Pro",
    sku: "SAM-GB-PRO",
    type: "out",
    quantity: 15,
    previousStock: 18,
    newStock: 3,
    reason: "Sale - Bulk Order",
    date: "2024-01-14",
    time: "03:45 PM",
    user: "Priya Patel",
    reference: "INV-2024-025",
    notes: "Bulk sale to corporate client",
  },
  {
    id: "MOV-003",
    productName: "Nike Air Max 270",
    sku: "NIK-AM-270",
    type: "out",
    quantity: 25,
    previousStock: 25,
    newStock: 0,
    reason: "Sale - Multiple Orders",
    date: "2024-01-13",
    time: "02:15 PM",
    user: "Amit Kumar",
    reference: "Multiple",
    notes: "Various customer orders throughout the day",
  },
  {
    id: "MOV-004",
    productName: "Levi's 511 Jeans",
    sku: "LEV-511-32",
    type: "in",
    quantity: 50,
    previousStock: 5,
    newStock: 55,
    reason: "Purchase Order PO-2024-003",
    date: "2024-01-12",
    time: "11:20 AM",
    user: "Rajesh Sharma",
    reference: "PO-2024-003",
    notes: "New stock arrival from Clothing Co",
  },
  {
    id: "MOV-005",
    productName: "Apple iPhone 14 Pro",
    sku: "APL-IP14-128",
    type: "adjustment",
    quantity: -2,
    previousStock: 37,
    newStock: 35,
    reason: "Damage/Loss",
    date: "2024-01-11",
    time: "04:30 PM",
    user: "Sunita Singh",
    reference: "ADJ-001",
    notes: "2 units damaged during handling - reported for insurance",
  },
];

const movementTypes = {
  in: { color: "default", icon: ArrowUpCircle, label: "Stock In" },
  out: { color: "secondary", icon: ArrowDownCircle, label: "Stock Out" },
  adjustment: { color: "outline", icon: RefreshCw, label: "Adjustment" },
} as const;

export default function StockMovements() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false);

  const filteredMovements = mockMovements.filter((movement) => {
    const matchesSearch =
      movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" || movement.type === selectedType;

    return matchesSearch && matchesType;
  });

  const todayMovements = mockMovements.filter(
    (m) => m.date === "2024-01-15",
  ).length;
  const totalStockIn = mockMovements
    .filter((m) => m.type === "in")
    .reduce((sum, m) => sum + m.quantity, 0);
  const totalStockOut = mockMovements
    .filter((m) => m.type === "out")
    .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Stock Movements
          </h1>
          <p className="text-muted-foreground">
            Track all inventory movements with detailed audit trail
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Movement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Record Stock Movement</DialogTitle>
                <DialogDescription>
                  Add a new stock in/out entry with complete details
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
                      <SelectItem value="APL-IP14-128">
                        Apple iPhone 14 Pro - APL-IP14-128
                      </SelectItem>
                      <SelectItem value="SAM-GB-PRO">
                        Samsung Galaxy Buds Pro - SAM-GB-PRO
                      </SelectItem>
                      <SelectItem value="NIK-AM-270">
                        Nike Air Max 270 - NIK-AM-270
                      </SelectItem>
                      <SelectItem value="LEV-511-32">
                        Levi's 511 Jeans - LEV-511-32
                      </SelectItem>
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
                      <SelectItem value="in">
                        <div className="flex items-center gap-2">
                          <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                          Stock In
                        </div>
                      </SelectItem>
                      <SelectItem value="out">
                        <div className="flex items-center gap-2">
                          <ArrowDownCircle className="h-4 w-4 text-red-500" />
                          Stock Out
                        </div>
                      </SelectItem>
                      <SelectItem value="adjustment">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 text-blue-500" />
                          Adjustment
                        </div>
                      </SelectItem>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase Order</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="damage">Damage/Loss</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="adjustment">
                        Manual Adjustment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    placeholder="PO number, Invoice, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or details"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Record Movement</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddMovementOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Movements
            </CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMovements}</div>
            <p className="text-xs text-muted-foreground">
              Stock transactions today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock In
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {totalStockIn}
            </div>
            <p className="text-xs text-muted-foreground">
              Units received this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock Out
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalStockOut}
            </div>
            <p className="text-xs text-muted-foreground">
              Units sold/removed this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Movement</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totalStockIn - totalStockOut >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {totalStockIn - totalStockOut >= 0 ? "+" : ""}
              {totalStockIn - totalStockOut}
            </div>
            <p className="text-xs text-muted-foreground">
              Net change this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="movements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="movements">All Movements</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="summary">Daily Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search movements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                    <SelectItem value="adjustment">Adjustments</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  className="w-full sm:w-48"
                  value={selectedDate === "all" ? "" : selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value || "all")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Movements Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Stock Movements ({filteredMovements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Movement Details</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Stock Impact</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((movement) => {
                    const config =
                      movementTypes[
                        movement.type as keyof typeof movementTypes
                      ];
                    const MovementIcon = config.icon;

                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{movement.id}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {movement.date} at {movement.time}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {movement.reason}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {movement.productName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {movement.sku}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={config.color}
                            className="flex items-center gap-1 w-fit"
                          >
                            <MovementIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-medium ${movement.type === "in" ? "text-emerald-600" : movement.type === "out" ? "text-red-600" : "text-blue-600"}`}
                          >
                            {movement.type === "in"
                              ? "+"
                              : movement.type === "out"
                                ? "-"
                                : ""}
                            {Math.abs(movement.quantity)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              {movement.previousStock}
                            </span>
                            <span className="mx-2">→</span>
                            <span className="font-medium">
                              {movement.newStock}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {movement.user}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 text-sm">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            {movement.reference}
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

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Activity (Last 24 Hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMovements.slice(0, 5).map((movement) => {
                  const config =
                    movementTypes[movement.type as keyof typeof movementTypes];
                  const MovementIcon = config.icon;

                  return (
                    <div
                      key={movement.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        <MovementIcon
                          className={`h-5 w-5 ${
                            movement.type === "in"
                              ? "text-emerald-500"
                              : movement.type === "out"
                                ? "text-red-500"
                                : "text-blue-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium">
                            {movement.productName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {movement.reason}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${
                            movement.type === "in"
                              ? "text-emerald-600"
                              : movement.type === "out"
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        >
                          {movement.type === "in"
                            ? "+"
                            : movement.type === "out"
                              ? "-"
                              : ""}
                          {Math.abs(movement.quantity)} units
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {movement.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Movement Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">Stock In</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      25
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Units received today
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownCircle className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Stock Out</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">40</div>
                    <div className="text-sm text-muted-foreground">
                      Units sold today
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Adjustments</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">2</div>
                    <div className="text-sm text-muted-foreground">
                      Adjustments made
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

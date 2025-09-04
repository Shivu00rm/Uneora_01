import React, { useMemo, useState } from "react";
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
  Eye,
  Download,
  Calendar,
  Package,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  FileText,
  Edit,
  Send,
} from "lucide-react";
import { usePermissions } from "@/contexts/AuthContext";
import { getVendorContact, upsertVendorContact } from "@/lib/vendorContacts";
import { toast } from "@/hooks/use-toast";

const initialPurchaseOrders = [
  {
    id: "PO-2024-001",
    vendor: "TechSupply India Pvt Ltd",
    date: "2024-01-15",
    expectedDelivery: "2024-01-25",
    status: "pending",
    items: 12,
    totalAmount: 125000,
    approvedBy: "Rajesh Sharma",
    progress: 25,
  },
  {
    id: "PO-2024-002",
    vendor: "Fashion Hub Distributors",
    date: "2024-01-12",
    expectedDelivery: "2024-01-20",
    status: "approved",
    items: 8,
    totalAmount: 85000,
    approvedBy: "Priya Patel",
    progress: 60,
  },
  {
    id: "PO-2024-003",
    vendor: "Global Electronics Corp",
    date: "2024-01-10",
    expectedDelivery: "2024-01-18",
    status: "delivered",
    items: 15,
    totalAmount: 200000,
    approvedBy: "Rajesh Sharma",
    progress: 100,
  },
  {
    id: "PO-2024-004",
    vendor: "Office Supplies Ltd",
    date: "2024-01-08",
    expectedDelivery: "2024-01-16",
    status: "cancelled",
    items: 5,
    totalAmount: 25000,
    approvedBy: "",
    progress: 0,
  },
];

const statusConfig = {
  draft: { color: "secondary", icon: Edit, label: "Draft" },
  pending: { color: "secondary", icon: Clock, label: "Pending Approval" },
  approved: { color: "default", icon: CheckCircle, label: "Approved" },
  shipped: { color: "default", icon: Truck, label: "Shipped" },
  delivered: { color: "default", icon: Package, label: "Delivered" },
  cancelled: { color: "destructive", icon: XCircle, label: "Cancelled" },
} as const;

type Order = (typeof initialPurchaseOrders)[number];

type SendMethod = "email" | "whatsapp";

export default function PurchaseOrders() {
  const { hasPermission } = usePermissions();
  const canSend =
    hasPermission("purchase_orders", "create") ||
    hasPermission("purchase_orders", "approve");

  const [orders, setOrders] = useState<Order[]>(initialPurchaseOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Create PO form state
  const [poVendor, setPoVendor] = useState("");
  const [poExpected, setPoExpected] = useState("");
  const [poReference, setPoReference] = useState("");
  const [poPriority, setPoPriority] = useState("");
  const [poNotes, setPoNotes] = useState("");
  const [poItems, setPoItems] = useState<
    { product: string; qty: number; price: number }[]
  >([{ product: "", qty: 0, price: 0 }]);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);

  // Send flow state
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactWhatsApp, setContactWhatsApp] = useState("");

  const addItemRow = () =>
    setPoItems((prev) => [...prev, { product: "", qty: 0, price: 0 }]);
  const updateItem = (
    idx: number,
    patch: Partial<{ product: string; qty: number; price: number }>,
  ) => {
    setPoItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );
  };
  const removeItem = (idx: number) =>
    setPoItems((prev) => prev.filter((_, i) => i !== idx));

  const lineTotal = (it: { qty: number; price: number }) =>
    (Number(it.qty) || 0) * (Number(it.price) || 0);
  const grandTotal = poItems.reduce((sum, it) => sum + lineTotal(it), 0);
  const totalQty = poItems.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);

  const canCreate = poVendor && poExpected && totalQty > 0 && grandTotal > 0;

  const resetForm = () => {
    setPoVendor("");
    setPoExpected("");
    setPoReference("");
    setPoPriority("");
    setPoNotes("");
    setPoItems([{ product: "", qty: 0, price: 0 }]);
  };

  const handleCreatePO = () => {
    if (!canCreate) return;
    const nextId = `PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, "0")}`;
    const newOrder: Order = {
      id: nextId,
      vendor: poVendor,
      date: new Date().toISOString().slice(0, 10),
      expectedDelivery: poExpected,
      status: "pending",
      items: totalQty,
      totalAmount: grandTotal,
      approvedBy: "",
      progress: 0,
    };
    setOrders((prev) => [newOrder, ...prev]);
    resetForm();
    setIsCreatePOOpen(false);
    toast({
      title: "PO created",
      description: `${nextId} created for ${poVendor}`,
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status];
    const StatusIcon = config.icon;
    return (
      <Badge variant={config.color} className="flex items-center gap-1 w-fit">
        <StatusIcon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (expectedDelivery: string) => {
    const deliveryDate = new Date(expectedDelivery);
    const today = new Date();
    const diffDays = Math.ceil(
      (deliveryDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
    );
    if (diffDays < 0) return "text-destructive";
    if (diffDays <= 3) return "text-yellow-600";
    return "text-muted-foreground";
  };

  const vendorOptions = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => set.add(o.vendor));
    return Array.from(set);
  }, [orders]);

  // Document helpers
  function buildPOHtml(order: Order) {
    return `<!doctype html><html><head><meta charset=\"utf-8\"/><title>${order.id}</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px}h1{margin:0 0 8px}table{border-collapse:collapse;width:100%;margin-top:16px}td,th{border:1px solid #ddd;padding:8px;text-align:left}small{color:#555}</style></head><body><h1>Purchase Order ${order.id}</h1><small>Date: ${new Date(order.date).toLocaleDateString()}</small><div style=\"margin-top:12px\"><strong>Vendor:</strong> ${order.vendor}</div><div style=\"margin-top:4px\"><strong>Expected Delivery:</strong> ${new Date(order.expectedDelivery).toLocaleDateString()}</div><table><thead><tr><th>Summary</th><th>Value</th></tr></thead><tbody><tr><td>Total Items</td><td>${order.items}</td></tr><tr><td>Total Amount</td><td>₹${order.totalAmount.toLocaleString()}</td></tr></tbody></table><p style=\"margin-top:16px\">This is a system-generated PO summary.</p></body></html>`;
  }

  function downloadPO(order: Order) {
    const html = buildPOHtml(order);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function openGmail(to: string, subject: string, body: string) {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openWhatsApp(numberDigits: string, text: string) {
    const url = `https://wa.me/${numberDigits}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function startSendFlow(order: Order) {
    if (!canSend) {
      toast({
        title: "Not allowed",
        description: "You don't have permission to send POs",
      });
      return;
    }
    setSelectedOrder(order);
    const contact = getVendorContact(order.vendor);
    if (!contact?.email && !contact?.whatsapp) {
      setContactEmail("");
      setContactWhatsApp("");
      setContactDialogOpen(true);
    } else {
      setContactEmail(contact?.email || "");
      setContactWhatsApp(contact?.whatsapp || "");
      setSendDialogOpen(true);
    }
  }

  function saveContactAndContinue() {
    if (!selectedOrder) return;
    upsertVendorContact(selectedOrder.vendor, {
      email: contactEmail,
      whatsapp: contactWhatsApp,
    });
    setContactDialogOpen(false);
    setSendDialogOpen(true);
  }

  function handleSend(method: SendMethod) {
    if (!selectedOrder) return;
    // Prepare document for user to attach
    downloadPO(selectedOrder);
    const subject = `Purchase Order ${selectedOrder.id}`;
    const body = `Hello,\n\nPlease find the attached Purchase Order ${selectedOrder.id} for ${selectedOrder.vendor}.\nTotal: ₹${selectedOrder.totalAmount.toLocaleString()} | Items: ${selectedOrder.items}.\nExpected Delivery: ${new Date(selectedOrder.expectedDelivery).toLocaleDateString()}.\n\nThank you.`;
    if (method === "email" && contactEmail) {
      openGmail(contactEmail, subject, body);
      toast({
        title: "Compose opened",
        description: "Gmail compose opened. Attach the downloaded PO.",
      });
    } else if (method === "whatsapp" && contactWhatsApp) {
      openWhatsApp(contactWhatsApp, `${subject}\n\n${body}`);
      toast({
        title: "WhatsApp opened",
        description: "Please send the message with the PO details.",
      });
    }
    setSendDialogOpen(false);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Purchase Orders
          </h1>
          <p className="text-muted-foreground">
            Manage and track all purchase orders with real-time status updates
          </p>
        </div>

        <Dialog open={isCreatePOOpen} onOpenChange={setIsCreatePOOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create PO
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Generate a new purchase order with vendor and product details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="po-vendor">Vendor</Label>
                <Select value={poVendor} onValueChange={setPoVendor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorOptions.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="po-delivery">Expected Delivery</Label>
                <Input
                  id="po-delivery"
                  type="date"
                  value={poExpected}
                  onChange={(e) => setPoExpected(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="po-reference">Reference Number</Label>
                <Input
                  id="po-reference"
                  placeholder="Internal reference"
                  value={poReference}
                  onChange={(e) => setPoReference(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="po-priority">Priority</Label>
                <Select value={poPriority} onValueChange={setPoPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="po-notes">Notes</Label>
                <Textarea
                  id="po-notes"
                  placeholder="Additional instructions or notes"
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Order Items</h4>
                  <Button variant="outline" size="sm" onClick={addItemRow}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium">
                    <span className="col-span-6">Product</span>
                    <span className="col-span-2">Qty</span>
                    <span className="col-span-2">Unit Price</span>
                    <span className="col-span-2">Total</span>
                  </div>
                  {poItems.map((it, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <Input
                        className="col-span-6"
                        placeholder="Product name"
                        value={it.product}
                        onChange={(e) =>
                          updateItem(idx, { product: e.target.value })
                        }
                      />
                      <Input
                        className="col-span-2"
                        type="number"
                        min={0}
                        value={it.qty}
                        onChange={(e) =>
                          updateItem(idx, { qty: Number(e.target.value) })
                        }
                      />
                      <Input
                        className="col-span-2"
                        type="number"
                        min={0}
                        value={it.price}
                        onChange={(e) =>
                          updateItem(idx, { price: Number(e.target.value) })
                        }
                      />
                      <div className="col-span-2 text-sm text-right">
                        ₹{lineTotal(it).toLocaleString()}
                      </div>
                      {poItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(idx)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-6 text-sm border-t pt-3">
                  <div>
                    <div className="text-muted-foreground">Total Qty</div>
                    <div className="font-medium">{totalQty}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Grand Total</div>
                    <div className="font-medium">
                      ₹{grandTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  onClick={handleCreatePO}
                  disabled={!canCreate}
                >
                  Create Purchase Order
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatePOOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total POs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter((po) => po.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                orders.filter(
                  (po) => po.status === "approved" || po.status === "shipped",
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {(
                orders.reduce((sum, po) => sum + po.totalAmount, 0) / 100000
              ).toFixed(1)}
              L
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-6 enhanced-tabs">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100">
          <TabsTrigger
            value="orders"
            className="tab-orders text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            All Orders
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="tab-pending text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Pending Approval
          </TabsTrigger>
          <TabsTrigger
            value="tracking"
            className="tab-tracking text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Delivery Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="orders"
          className="space-y-6 tab-content-watermark uneora-watermark"
        >
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by PO number or vendor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Details</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                          {order.approvedBy && (
                            <div className="text-sm text-muted-foreground">
                              Approved by: {order.approvedBy}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.vendor}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(
                          order.status as keyof typeof statusConfig,
                        )}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center gap-1 ${getPriorityColor(order.expectedDelivery)}`}
                        >
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            order.expectedDelivery,
                          ).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {order.items} items
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          {order.totalAmount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                URL.createObjectURL(
                                  new Blob([buildPOHtml(order)], {
                                    type: "text/html",
                                  }),
                                ),
                                "_blank",
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadPO(order)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {canSend && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startSendFlow(order)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {order.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald-600"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="pending"
          className="space-y-6 tab-content-watermark uneora-watermark"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "pending")
                  .map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.vendor}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{order.totalAmount.toLocaleString()} • {order.items}{" "}
                          items
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              URL.createObjectURL(
                                new Blob([buildPOHtml(order)], {
                                  type: "text/html",
                                }),
                              ),
                              "_blank",
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" /> Review
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="h-4 w-4 mr-2" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="tracking"
          className="space-y-6 tab-content-watermark uneora-watermark"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter(
                    (order) =>
                      order.status === "approved" ||
                      order.status === "shipped" ||
                      order.status === "delivered",
                  )
                  .map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.vendor}
                          </div>
                        </div>
                        {getStatusBadge(
                          order.status as keyof typeof statusConfig,
                        )}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Expected:{" "}
                          {new Date(
                            order.expectedDelivery,
                          ).toLocaleDateString()}
                        </span>
                        <span>{order.progress}% Complete</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact capture dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vendor contact details</DialogTitle>
            <DialogDescription>
              Add email and/or WhatsApp number for {selectedOrder?.vendor}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="vendor-email">Email</Label>
              <Input
                id="vendor-email"
                type="email"
                placeholder="orders@vendor.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor-wa">WhatsApp (digits only)</Label>
              <Input
                id="vendor-wa"
                placeholder="919876543210"
                value={contactWhatsApp}
                onChange={(e) =>
                  setContactWhatsApp(e.target.value.replace(/\D+/g, ""))
                }
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={saveContactAndContinue}>
                Continue
              </Button>
              <Button
                variant="outline"
                onClick={() => setContactDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send chooser dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Purchase Order</DialogTitle>
            <DialogDescription>
              Choose how you want to send PO {selectedOrder?.id} to{" "}
              {selectedOrder?.vendor}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              disabled={!contactEmail}
              onClick={() => handleSend("email")}
            >
              <Send className="h-4 w-4 mr-2" /> Email via Gmail
            </Button>
            <Button
              variant="outline"
              disabled={!contactWhatsApp}
              onClick={() => handleSend("whatsapp")}
            >
              <Send className="h-4 w-4 mr-2" /> WhatsApp
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            A PO file will be downloaded for you to attach when sending.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

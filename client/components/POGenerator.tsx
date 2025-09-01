import React, { useState, useMemo } from "react";
import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { getVendorContact, upsertVendorContact } from "@/lib/vendorContacts";
import { Separator } from "./ui/separator";
import {
  FileText,
  Calculator,
  Building2,
  Truck,
  Package,
  Download,
  Mail,
  Plus,
  Minus,
  AlertTriangle,
} from "lucide-react";

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  movements?: Array<{
    type: "in" | "out";
    quantity: number;
    date: string;
    reason: string;
  }>;
}

interface POItem {
  product: Product;
  calculatedQty: number;
  customQty: number;
  totalAmount: number;
}

interface POGeneratorProps {
  inventory: Product[];
}

export function POGenerator({ inventory }: POGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generationType, setGenerationType] = useState<"single" | "all">("all");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [orderFrequency, setOrderFrequency] = useState("weekly");
  const [includeAlmostLow, setIncludeAlmostLow] = useState(true);
  const [customCompany, setCustomCompany] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [sgstRate, setSgstRate] = useState(9);
  const [cgstRate, setCgstRate] = useState(9);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set(),
  );
  const [poItems, setPOItems] = useState<POItem[]>([]);
  const [showPOPreview, setShowPOPreview] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendVendor, setSendVendor] = useState<string>("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWhatsApp, setContactWhatsApp] = useState("");

  // Mock sales data for calculation (in real app, this would come from API)
  const mockSalesData = {
    lastMonth: {
      1: 45, // iPhone sold 45 units last month
      2: 120, // Galaxy Buds sold 120 units last month
      3: 35, // Nike shoes sold 35 units last month
      4: 60, // Sony headphones sold 60 units last month
    },
    thisMonth: {
      1: 12, // iPhone sold 12 units this month so far
      2: 28, // Galaxy Buds sold 28 units this month so far
      3: 8, // Nike shoes sold 8 units this month so far
      4: 15, // Sony headphones sold 15 units this month so far
    },
  };

  // Calculate the number of weeks passed in current month
  const weeksPassedThisMonth = Math.ceil(new Date().getDate() / 7);
  const totalWeeksInMonth = 4;

  // Filter products that need reordering
  const lowStockProducts = useMemo(() => {
    return inventory.filter((product) => {
      const isLowStock =
        product.status === "low_stock" || product.status === "out_of_stock";
      const isAlmostLow =
        includeAlmostLow &&
        product.currentStock <= product.reorderLevel * 1.2 &&
        product.currentStock > product.reorderLevel;

      return isLowStock || isAlmostLow;
    });
  }, [inventory, includeAlmostLow]);

  // Get unique vendors
  const vendors = useMemo(() => {
    return Array.from(new Set(inventory.map((item) => item.supplier)));
  }, [inventory]);

  // Calculate recommended quantity based on sales data and frequency
  const calculateRecommendedQty = (product: Product): number => {
    const lastMonthSales =
      mockSalesData.lastMonth[
        product.id as keyof typeof mockSalesData.lastMonth
      ] || 0;
    const thisMonthSales =
      mockSalesData.thisMonth[
        product.id as keyof typeof mockSalesData.thisMonth
      ] || 0;

    let multiplier = 1;
    switch (orderFrequency) {
      case "weekly":
        multiplier = 1;
        break;
      case "bi-weekly":
        multiplier = 2;
        break;
      case "monthly":
        multiplier = 4;
        break;
    }

    // Calculate average weekly sales
    const lastMonthWeeklyAvg = lastMonthSales / totalWeeksInMonth;
    const thisMonthWeeklyAvg =
      weeksPassedThisMonth > 0 ? thisMonthSales / weeksPassedThisMonth : 0;

    // Take average of both months
    const avgWeeklySales = (lastMonthWeeklyAvg + thisMonthWeeklyAvg) / 2;

    // Calculate recommended quantity
    const recommendedQty = Math.ceil(avgWeeklySales * multiplier);

    // Ensure minimum order and don't exceed max stock
    const minOrder = Math.max(recommendedQty, product.reorderLevel);
    const maxOrder = product.maxStock - product.currentStock;

    return Math.min(minOrder, maxOrder);
  };

  // Generate PO items based on selection
  const generatePOItems = () => {
    const filteredProducts =
      generationType === "single"
        ? lowStockProducts.filter((p) => p.supplier === selectedVendor)
        : lowStockProducts;

    const items: POItem[] = filteredProducts.map((product) => {
      const calculatedQty = calculateRecommendedQty(product);
      return {
        product,
        calculatedQty,
        customQty: calculatedQty,
        totalAmount: calculatedQty * product.unitPrice,
      };
    });

    setPOItems(items);
    setShowPOPreview(true);
  };

  // Update custom quantity
  const updateCustomQty = (productId: number, newQty: number) => {
    setPOItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              customQty: newQty,
              totalAmount: newQty * item.product.unitPrice,
            }
          : item,
      ),
    );
  };

  // Calculate totals
  const subtotal = poItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const gstAmount = subtotal * (gstRate / 100);
  const sgstAmount = subtotal * (sgstRate / 100);
  const cgstAmount = subtotal * (cgstRate / 100);
  const totalAmount = subtotal + gstAmount + sgstAmount + cgstAmount;

  // Convert number to words (simplified)
  const numberToWords = (num: number): string => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num === 0) return "Zero";
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? " " + ones[num % 10] : "")
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 !== 0 ? " " + numberToWords(num % 100) : "")
      );
    if (num < 100000)
      return (
        numberToWords(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "")
      );
    if (num < 10000000)
      return (
        numberToWords(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 !== 0 ? " " + numberToWords(num % 100000) : "")
      );

    return (
      numberToWords(Math.floor(num / 10000000)) +
      " Crore" +
      (num % 10000000 !== 0 ? " " + numberToWords(num % 10000000) : "")
    );
  };

  // Group PO items by vendor
  const groupedByVendor = useMemo(() => {
    const groups = new Map<string, POItem[]>();
    poItems.forEach((item) => {
      const vendor = item.product.supplier;
      if (!groups.has(vendor)) {
        groups.set(vendor, []);
      }
      groups.get(vendor)!.push(item);
    });
    return groups;
  }, [poItems]);

  // Build minimal PO HTML for a vendor
  const buildVendorPOHtml = (vendor: string, items: POItem[]) => {
    const vendorSubtotal = items.reduce((sum, it) => sum + it.totalAmount, 0);
    const vendorGST = vendorSubtotal * (gstRate / 100);
    const vendorSGST = vendorSubtotal * (sgstRate / 100);
    const vendorCGST = vendorSubtotal * (cgstRate / 100);
    const vendorTotal = vendorSubtotal + vendorGST + vendorSGST + vendorCGST;
    return `<!doctype html><html><head><meta charset=\"utf-8\"/><title>PO-${new Date().getFullYear()}-${vendor.replace(/\s+/g, "").substring(0,3).toUpperCase()}</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px}h1{margin:0 0 8px}table{border-collapse:collapse;width:100%;margin-top:16px}td,th{border:1px solid #ddd;padding:8px;text-align:left}small{color:#555}</style></head><body><h1>Purchase Order</h1><small>Date: ${new Date().toLocaleDateString()}</small><div style=\"margin-top:12px\"><strong>Vendor:</strong> ${vendor}</div><div style=\"margin-top:4px\"><strong>Company:</strong> ${customCompany || "Uneora Company"}</div><table><thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>${items
      .map(
        (it) => `<tr><td>${it.product.name}</td><td>${it.customQty}</td><td>₹${it.product.unitPrice.toLocaleString()}</td><td>₹${(it.customQty * it.product.unitPrice).toLocaleString()}</td></tr>`,
      )
      .join("")}</tbody></table><div style=\"margin-top:12px\"><div>Subtotal: ₹${vendorSubtotal.toLocaleString()}</div><div>GST (${gstRate}%): ₹${vendorGST.toLocaleString()}</div><div>SGST (${sgstRate}%): ₹${vendorSGST.toLocaleString()}</div><div>CGST (${cgstRate}%): ₹${vendorCGST.toLocaleString()}</div><div><strong>Total: ₹${vendorTotal.toLocaleString()}</strong></div></div></body></html>`;
  };
  const downloadVendorPO = (vendor: string, items: POItem[]) => {
    const html = buildVendorPOHtml(vendor, items);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PO-${new Date().getFullYear()}-${vendor.replace(/\s+/g, "").substring(0,3).toUpperCase()}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const openGmail = (to: string, subject: string, body: string) => {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const openWhatsApp = (numberDigits: string, text: string) => {
    const url = `https://wa.me/${numberDigits}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openSendDialog = () => {
    const firstVendor = Array.from(groupedByVendor.keys())[0] || "";
    setSendVendor(firstVendor);
    if (firstVendor) {
      const contact = getVendorContact(firstVendor);
      setContactEmail(contact?.email || "");
      setContactWhatsApp(contact?.whatsapp || "");
    } else {
      setContactEmail("");
      setContactWhatsApp("");
    }
    setSendDialogOpen(true);
  };

  const onVendorChange = (v: string) => {
    setSendVendor(v);
    const contact = getVendorContact(v);
    setContactEmail(contact?.email || "");
    setContactWhatsApp(contact?.whatsapp || "");
  };

  const saveContact = () => {
    if (!sendVendor) return;
    upsertVendorContact(sendVendor, { email: contactEmail, whatsapp: contactWhatsApp });
  };

  const handleSend = (method: "email" | "whatsapp") => {
    if (!sendVendor) return;
    const items = groupedByVendor.get(sendVendor) || [];
    downloadVendorPO(sendVendor, items);
    const subject = `Purchase Order for ${sendVendor}`;
    const body = `Hello,\n\nPlease find the attached Purchase Order for ${sendVendor}.\nItems: ${items.length}.\n\nThank you.`;
    if (method === "email" && contactEmail) {
      openGmail(contactEmail, subject, body);
    } else if (method === "whatsapp" && contactWhatsApp) {
      openWhatsApp(contactWhatsApp, `${subject}\n\n${body}`);
    }
    setSendDialogOpen(false);
  };

  const downloadAllPOs = () => {
    groupedByVendor.forEach((items, vendor) => {
      setTimeout(() => downloadVendorPO(vendor, items), 0);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generate PO
          {lowStockProducts.length > 0 && (
            <Badge variant="destructive" className="ml-1">
              {lowStockProducts.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Purchase Order Generator
          </DialogTitle>
          <DialogDescription>
            Generate purchase orders for low stock items based on sales data and
            demand forecasting
          </DialogDescription>
        </DialogHeader>

        {!showPOPreview ? (
          <div className="space-y-6">
            {/* Configuration Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">PO Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Generation Type</Label>
                    <Select
                      value={generationType}
                      onValueChange={(value: "single" | "all") =>
                        setGenerationType(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All Vendors (Separate POs)
                        </SelectItem>
                        <SelectItem value="single">Single Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {generationType === "single" && (
                    <div className="space-y-2">
                      <Label>Select Vendor</Label>
                      <Select
                        value={selectedVendor}
                        onValueChange={setSelectedVendor}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendors.map((vendor) => (
                            <SelectItem key={vendor} value={vendor}>
                              {vendor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Order Frequency</Label>
                    <Select
                      value={orderFrequency}
                      onValueChange={setOrderFrequency}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-almost-low"
                    checked={includeAlmostLow}
                    onCheckedChange={(checked) =>
                      setIncludeAlmostLow(checked as boolean)
                    }
                  />
                  <Label htmlFor="include-almost-low">
                    Include items approaching low stock threshold
                  </Label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>GST Rate (%)</Label>
                    <Input
                      type="number"
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SGST Rate (%)</Label>
                    <Input
                      type="number"
                      value={sgstRate}
                      onChange={(e) => setSgstRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CGST Rate (%)</Label>
                    <Input
                      type="number"
                      value={cgstRate}
                      onChange={(e) => setCgstRate(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Items Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Items Requiring Reorder ({lowStockProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku} | Supplier: {product.supplier}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              product.status === "out_of_stock"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {product.status.replace("_", " ")}
                          </Badge>
                          <span className="text-sm">
                            Current: {product.currentStock} | Reorder at:{" "}
                            {product.reorderLevel}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          Recommended: {calculateRecommendedQty(product)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹
                          {(
                            calculateRecommendedQty(product) * product.unitPrice
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                onClick={generatePOItems}
                disabled={generationType === "single" && !selectedVendor}
                className="flex-1"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Generate Purchase Orders
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* PO Preview */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Purchase Order Preview</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPOPreview(false)}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Back to Config
                </Button>
                <Button variant="outline" onClick={downloadAllPOs}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PO
                </Button>
                <Button onClick={openSendDialog}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send to Vendors
                </Button>
              </div>
            </div>

            {/* Render separate POs for each vendor */}
            {Array.from(groupedByVendor.entries()).map(([vendor, items]) => {
              const vendorSubtotal = items.reduce(
                (sum, item) => sum + item.totalAmount,
                0,
              );
              const vendorGST = vendorSubtotal * (gstRate / 100);
              const vendorSGST = vendorSubtotal * (sgstRate / 100);
              const vendorCGST = vendorSubtotal * (cgstRate / 100);
              const vendorTotal =
                vendorSubtotal + vendorGST + vendorSGST + vendorCGST;

              return (
                <Card key={vendor} className="print:shadow-none">
                  <CardContent className="p-6">
                    {/* PO Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-primary">
                          PURCHASE ORDER
                        </h2>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">
                              {customCompany || "Uneora Company"}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            123 Business Street, Mumbai, Maharashtra 400001
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Phone: +91 98765 43210 | Email: orders@company.com
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          PO-{new Date().getFullYear()}-
                          {vendor
                            .replace(/\s+/g, "")
                            .substring(0, 3)
                            .toUpperCase()}
                          -{String(Date.now()).slice(-4)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Date: {new Date().toLocaleDateString("en-IN")}
                        </div>
                      </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="bg-muted/30 p-4 rounded-lg mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4" />
                        <span className="font-medium">Vendor Details</span>
                      </div>
                      <div className="font-semibold">{vendor}</div>
                      <div className="text-sm text-muted-foreground">
                        Contact: vendor@
                        {vendor.toLowerCase().replace(/\s+/g, "")}.com
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-6">
                      <table className="w-full border-collapse border">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="border p-2 text-left">S.No.</th>
                            <th className="border p-2 text-left">
                              Item Description
                            </th>
                            <th className="border p-2 text-left">SKU</th>
                            <th className="border p-2 text-center">Qty</th>
                            <th className="border p-2 text-right">
                              Unit Price
                            </th>
                            <th className="border p-2 text-right">
                              Total Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={item.product.id}>
                              <td className="border p-2">{index + 1}</td>
                              <td className="border p-2">
                                <div className="font-medium">
                                  {item.product.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.product.category}
                                </div>
                              </td>
                              <td className="border p-2 font-mono text-sm">
                                {item.product.sku}
                              </td>
                              <td className="border p-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateCustomQty(
                                        item.product.id,
                                        Math.max(1, item.customQty - 1),
                                      )
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={item.customQty}
                                    onChange={(e) =>
                                      updateCustomQty(
                                        item.product.id,
                                        Number(e.target.value),
                                      )
                                    }
                                    className="w-16 text-center"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateCustomQty(
                                        item.product.id,
                                        item.customQty + 1,
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                              <td className="border p-2 text-right">
                                ₹{item.product.unitPrice.toLocaleString()}
                              </td>
                              <td className="border p-2 text-right font-medium">
                                ₹{item.totalAmount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                      <div className="w-80">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{vendorSubtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST ({gstRate}%):</span>
                            <span>₹{vendorGST.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SGST ({sgstRate}%):</span>
                            <span>₹{vendorSGST.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CGST ({cgstRate}%):</span>
                            <span>₹{vendorCGST.toLocaleString()}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total Amount:</span>
                            <span>₹{vendorTotal.toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            <strong>Amount in Words:</strong>{" "}
                            {numberToWords(Math.floor(vendorTotal))} Rupees Only
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium mb-2">Terms & Conditions:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Payment Terms: Net 30 days from delivery</li>
                        <li>• Delivery within 7-14 business days</li>
                        <li>• All items must match specifications exactly</li>
                        <li>
                          • Returns accepted within 48 hours of delivery for
                          defective items
                        </li>
                      </ul>
                    </div>

                    {/* Signatures */}
                    <div className="mt-8 grid grid-cols-2 gap-8">
                      <div>
                        <div className="border-t pt-2 mt-12">
                          <div className="text-sm font-medium">
                            Authorized Signature
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {customCompany || "Uneora Company"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="border-t pt-2 mt-12">
                          <div className="text-sm font-medium">
                            Vendor Acknowledgment
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {vendor}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      {/* Send to Vendors Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Purchase Order</DialogTitle>
            <DialogDescription>Select vendor and sending method</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Select value={sendVendor} onValueChange={onVendorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose vendor" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(groupedByVendor.keys()).map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="orders@vendor.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp (digits only)</Label>
                <Input placeholder="919876543210" value={contactWhatsApp} onChange={(e) => setContactWhatsApp(e.target.value.replace(/\D+/g, ""))} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveContact}>Save Contact</Button>
              <div className="flex-1" />
              <Button disabled={!contactEmail} onClick={() => handleSend("email")}>Email via Gmail</Button>
              <Button variant="outline" disabled={!contactWhatsApp} onClick={() => handleSend("whatsapp")}>
                WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </DialogContent>
    </Dialog>
  );
}

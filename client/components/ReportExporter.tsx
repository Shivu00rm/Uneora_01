import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  Package,
  Users,
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle,
  Building2,
  TrendingUp,
} from "lucide-react";

interface ReportConfig {
  type: string;
  name: string;
  description: string;
  icon: any;
  fields: string[];
  formats: string[];
  roleRequired?: string[];
}

export function ReportExporter() {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<string>("csv");
  const [dateRange, setDateRange] = useState<string>("last_30_days");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const reportConfigs: ReportConfig[] = [
    {
      type: "inventory",
      name: "Inventory Report",
      description: "Products, stock levels, and valuations",
      icon: Package,
      fields: [
        "product_name",
        "sku",
        "current_stock",
        "unit_price",
        "total_value",
        "low_stock_threshold",
      ],
      formats: ["csv", "pdf", "excel"],
    },
    {
      type: "sales",
      name: "Sales Report",
      description: "Transaction history and revenue analysis",
      icon: DollarSign,
      fields: [
        "date",
        "transaction_id",
        "product",
        "quantity",
        "unit_price",
        "total_amount",
        "customer",
      ],
      formats: ["csv", "pdf", "excel"],
    },
    {
      type: "purchase_orders",
      name: "Purchase Orders",
      description: "PO history and vendor analysis",
      icon: BarChart3,
      fields: [
        "po_number",
        "vendor",
        "date_created",
        "total_amount",
        "status",
        "delivery_date",
      ],
      formats: ["csv", "pdf"],
    },
    {
      type: "analytics",
      name: "Business Analytics",
      description: "KPIs and performance metrics",
      icon: TrendingUp,
      fields: [
        "metric",
        "current_value",
        "previous_value",
        "change_percent",
        "trend",
      ],
      formats: ["pdf", "excel"],
    },
  ];

  // Role-specific reports
  const orgAdminReports: ReportConfig[] = [
    {
      type: "team_activity",
      name: "Team Activity Report",
      description: "User actions and performance",
      icon: Users,
      fields: ["user", "action", "timestamp", "entity", "details"],
      formats: ["csv", "pdf"],
      roleRequired: ["ORG_ADMIN"],
    },
    {
      type: "audit_trail",
      name: "Audit Trail",
      description: "Security and access logs",
      icon: FileText,
      fields: [
        "timestamp",
        "user",
        "action",
        "ip_address",
        "user_agent",
        "resource",
      ],
      formats: ["csv", "pdf"],
      roleRequired: ["ORG_ADMIN"],
    },
  ];

  const superAdminReports: ReportConfig[] = [
    {
      type: "organization_overview",
      name: "Organization Overview",
      description: "All organizations and their metrics",
      icon: Building2,
      fields: [
        "organization",
        "plan",
        "users",
        "monthly_revenue",
        "status",
        "health",
      ],
      formats: ["csv", "pdf", "excel"],
      roleRequired: ["SUPER_ADMIN"],
    },
    {
      type: "platform_revenue",
      name: "Platform Revenue",
      description: "Cross-organization revenue analysis",
      icon: DollarSign,
      fields: [
        "organization",
        "plan",
        "monthly_fee",
        "annual_value",
        "payment_status",
        "last_payment",
      ],
      formats: ["csv", "pdf", "excel"],
      roleRequired: ["SUPER_ADMIN"],
    },
    {
      type: "system_health",
      name: "System Health Report",
      description: "Platform performance and usage",
      icon: TrendingUp,
      fields: ["metric", "value", "threshold", "status", "last_updated"],
      formats: ["pdf"],
      roleRequired: ["SUPER_ADMIN"],
    },
  ];

  const getAvailableReports = (): ReportConfig[] => {
    let reports = [...reportConfigs];

    if (user?.role === "ORG_ADMIN") {
      reports = [...reports, ...orgAdminReports];
    }

    if (user?.role === "SUPER_ADMIN") {
      reports = [...reports, ...superAdminReports];
    }

    return reports.filter(
      (report) =>
        !report.roleRequired || report.roleRequired.includes(user?.role || ""),
    );
  };

  const selectedReportConfig = getAvailableReports().find(
    (r) => r.type === selectedReport,
  );

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };

  const generateReport = async () => {
    if (!selectedReportConfig) return;

    setIsGenerating(true);

    // Simulate report generation
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, this would make an API call
      const mockData = generateMockData(selectedReport, selectedFields);

      if (selectedFormat === "csv") {
        downloadCSV(
          mockData,
          `${selectedReportConfig.name}_${new Date().toISOString().split("T")[0]}`,
        );
      } else if (selectedFormat === "pdf") {
        downloadPDF(selectedReportConfig.name, mockData);
      } else if (selectedFormat === "excel") {
        downloadExcel(
          mockData,
          `${selectedReportConfig.name}_${new Date().toISOString().split("T")[0]}`,
        );
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Report generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockData = (reportType: string, fields: string[]) => {
    // Mock data generation based on report type
    const mockDataMap: Record<string, any[]> = {
      inventory: [
        {
          product_name: "iPhone 14 Pro",
          sku: "IP14P-128",
          current_stock: 25,
          unit_price: 79999,
          total_value: 1999975,
          low_stock_threshold: 10,
        },
        {
          product_name: "Samsung Galaxy S23",
          sku: "SGS23-256",
          current_stock: 15,
          unit_price: 69999,
          total_value: 1049985,
          low_stock_threshold: 5,
        },
      ],
      sales: [
        {
          date: "2024-01-15",
          transaction_id: "TXN-001",
          product: "iPhone 14 Pro",
          quantity: 2,
          unit_price: 79999,
          total_amount: 159998,
          customer: "John Doe",
        },
        {
          date: "2024-01-14",
          transaction_id: "TXN-002",
          product: "Samsung Galaxy S23",
          quantity: 1,
          unit_price: 69999,
          total_amount: 69999,
          customer: "Jane Smith",
        },
      ],
    };

    return mockDataMap[reportType] || [];
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers =
      selectedFields.length > 0 ? selectedFields : Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((field) => row[field] || "").join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = (reportName: string, data: any[]) => {
    // In a real app, this would generate a proper PDF
    alert(
      `PDF generation for ${reportName} would be implemented with a library like jsPDF or server-side generation`,
    );
  };

  const downloadExcel = (data: any[], filename: string) => {
    // In a real app, this would use a library like xlsx
    alert(`Excel generation would be implemented with a library like xlsx`);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "excel":
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <FileSpreadsheet className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Reports
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate & Export Reports</DialogTitle>
          <DialogDescription>
            Create customizable reports based on your role and data access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-3">
            <Label>Report Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getAvailableReports().map((report) => {
                const ReportIcon = report.icon;
                return (
                  <Card
                    key={report.type}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedReport === report.type
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedReport(report.type);
                      setSelectedFields(report.fields.slice(0, 4)); // Select first 4 fields by default
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ReportIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {report.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {report.description}
                          </div>
                          {report.roleRequired && (
                            <Badge variant="outline" className="text-xs mt-2">
                              {report.roleRequired
                                .join(", ")
                                .replace(/_/g, " ")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {selectedReportConfig && (
            <>
              {/* Format Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select
                    value={selectedFormat}
                    onValueChange={setSelectedFormat}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedReportConfig.formats.map((format) => (
                        <SelectItem key={format} value={format}>
                          <div className="flex items-center gap-2">
                            {getFormatIcon(format)}
                            {format.toUpperCase()}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_7_days">Last 7 days</SelectItem>
                      <SelectItem value="last_30_days">Last 30 days</SelectItem>
                      <SelectItem value="last_90_days">Last 90 days</SelectItem>
                      <SelectItem value="last_year">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {dateRange === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Field Selection */}
              <div className="space-y-3">
                <Label>Fields to Include</Label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedReportConfig.fields.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={selectedFields.includes(field)}
                        onCheckedChange={() => handleFieldToggle(field)}
                      />
                      <Label htmlFor={field} className="text-sm">
                        {field
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={generateReport}
                  disabled={isGenerating || selectedFields.length === 0}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Eye,
  CloudUpload,
  File,
  RefreshCw
} from "lucide-react";

interface ImportPreview {
  row: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "valid" | "warning" | "error";
  issues?: string[];
}

const mockImportPreview: ImportPreview[] = [
  {
    row: 1,
    sku: "NEW-001",
    name: "Wireless Headphones Pro",
    category: "Electronics",
    price: 8999,
    stock: 50,
    status: "valid"
  },
  {
    row: 2,
    sku: "NEW-002",
    name: "Gaming Mouse RGB",
    category: "Electronics",
    price: 2499,
    stock: 30,
    status: "valid"
  },
  {
    row: 3,
    sku: "APL-IP14-128",
    name: "Apple iPhone 14 Pro",
    category: "Electronics",
    price: 79900,
    stock: 25,
    status: "warning",
    issues: ["Product already exists - will update stock"]
  },
  {
    row: 4,
    sku: "",
    name: "Missing SKU Product",
    category: "Electronics",
    price: 1999,
    stock: 10,
    status: "error",
    issues: ["SKU is required", "Name exceeds character limit"]
  }
];

const exportTemplates = [
  {
    id: "inventory",
    name: "Full Inventory",
    description: "Complete inventory with all product details",
    fields: ["SKU", "Name", "Category", "Current Stock", "Reorder Level", "Unit Price", "Supplier", "Location"]
  },
  {
    id: "stock_levels",
    name: "Stock Levels Only",
    description: "Current stock quantities and status",
    fields: ["SKU", "Name", "Current Stock", "Reorder Level", "Status"]
  },
  {
    id: "low_stock",
    name: "Low Stock Report",
    description: "Items requiring restock attention",
    fields: ["SKU", "Name", "Current Stock", "Reorder Level", "Supplier", "Last Order Date"]
  },
  {
    id: "movements",
    name: "Stock Movements",
    description: "Historical stock movement data",
    fields: ["Date", "SKU", "Product", "Type", "Quantity", "Reason", "User"]
  }
];

export function ExcelImportExport() {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedExportTemplate, setSelectedExportTemplate] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setSelectedFile(file);
      setImportStep(2);
      // Simulate file processing
      setTimeout(() => setImportStep(3), 1500);
    }
  };

  const startImport = () => {
    setImportStep(4);
    setImportProgress(0);
    
    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImportStep(5);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid": return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex gap-2">
      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={(open) => {
        setIsImportOpen(open);
        if (!open) {
          setImportStep(1);
          setSelectedFile(null);
          setImportProgress(0);
        }
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import Excel
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import Inventory from Excel</DialogTitle>
            <DialogDescription>
              Upload an Excel file to bulk import inventory data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between text-sm">
              <div className={`flex items-center gap-2 ${importStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${importStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>1</div>
                <span>Upload File</span>
              </div>
              <div className={`flex items-center gap-2 ${importStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${importStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>2</div>
                <span>Validate</span>
              </div>
              <div className={`flex items-center gap-2 ${importStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${importStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>3</div>
                <span>Preview</span>
              </div>
              <div className={`flex items-center gap-2 ${importStep >= 4 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${importStep >= 4 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>4</div>
                <span>Import</span>
              </div>
            </div>

            {/* Step 1: Upload */}
            {importStep === 1 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <CloudUpload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Upload Excel File</h3>
                    <p className="text-muted-foreground">Select an .xlsx file with inventory data</p>
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Excel Format Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Column A: SKU (required)</li>
                    <li>• Column B: Product Name (required)</li>
                    <li>• Column C: Category</li>
                    <li>• Column D: Unit Price</li>
                    <li>• Column E: Current Stock</li>
                    <li>• Column F: Reorder Level</li>
                  </ul>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
            )}

            {/* Step 2: Processing */}
            {importStep === 2 && (
              <div className="text-center space-y-4">
                <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">Processing File</h3>
                  <p className="text-muted-foreground">Validating data and checking for errors...</p>
                </div>
                <div className="max-w-xs mx-auto">
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {importStep === 3 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Import Preview</h3>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>2 Valid</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>1 Warning</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>1 Error</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Row</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Issues</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockImportPreview.map((item) => (
                        <TableRow key={item.row}>
                          <TableCell>{getStatusIcon(item.status)}</TableCell>
                          <TableCell>{item.row}</TableCell>
                          <TableCell>{item.sku || <span className="text-muted-foreground">Missing</span>}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>₹{item.price.toLocaleString()}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>
                            {item.issues && item.issues.length > 0 && (
                              <div className="text-sm text-muted-foreground">
                                {item.issues.join(", ")}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={startImport} className="flex-1">
                    Import Valid Records (2)
                  </Button>
                  <Button variant="outline" onClick={() => setImportStep(1)}>
                    Back
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Importing */}
            {importStep === 4 && (
              <div className="text-center space-y-4">
                <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">Importing Data</h3>
                  <p className="text-muted-foreground">Processing {mockImportPreview.filter(i => i.status !== "error").length} records...</p>
                </div>
                <div className="max-w-xs mx-auto">
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">{importProgress}% Complete</p>
                </div>
              </div>
            )}

            {/* Step 5: Complete */}
            {importStep === 5 && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">Import Complete!</h3>
                  <p className="text-muted-foreground">Successfully imported 2 products</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-center gap-6">
                    <div>Added: <span className="font-medium">2 products</span></div>
                    <div>Updated: <span className="font-medium">0 products</span></div>
                    <div>Skipped: <span className="font-medium">1 products</span></div>
                  </div>
                </div>
                <Button onClick={() => setIsImportOpen(false)}>
                  Done
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export to Excel</DialogTitle>
            <DialogDescription>
              Choose what data to export to Excel format
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Export Template</Label>
              <div className="grid grid-cols-1 gap-3">
                {exportTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedExportTemplate === template.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedExportTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <input
                            type="radio"
                            checked={selectedExportTemplate === template.id}
                            onChange={() => setSelectedExportTemplate(template.id)}
                            className="text-primary"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.fields.slice(0, 4).map((field) => (
                              <Badge key={field} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {template.fields.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.fields.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                disabled={!selectedExportTemplate}
                onClick={() => {
                  // Simulate download
                  setIsExportOpen(false);
                  setSelectedExportTemplate("");
                }}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Download Excel
              </Button>
              <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, FileSpreadsheet, Loader2, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export interface ExportField {
  id: string;
  label: string;
  enabled: boolean;
  required?: boolean;
}

export interface ExportOptions {
  format: "csv" | "pdf" | "excel";
  dateRange: { from: Date; to: Date };
  fields: ExportField[];
  filters: Record<string, any>;
}

interface ReportExporterProps {
  title: string;
  description?: string;
  availableFields: ExportField[];
  onExport: (options: ExportOptions) => Promise<void>;
  children?: React.ReactNode;
  defaultFormat?: "csv" | "pdf" | "excel";
  showFormatSelector?: boolean;
  showFieldSelector?: boolean;
  showDateRange?: boolean;
  disabled?: boolean;
}

export function ReportExporter({
  title,
  description,
  availableFields,
  onExport,
  children,
  defaultFormat = "csv",
  showFormatSelector = true,
  showFieldSelector = true,
  showDateRange = true,
  disabled = false,
}: ReportExporterProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | "excel">(defaultFormat);
  const [selectedFields, setSelectedFields] = useState<ExportField[]>(
    availableFields.map(field => ({ ...field, enabled: field.required || field.enabled }))
  );
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });

  const handleFieldToggle = (fieldId: string, enabled: boolean) => {
    setSelectedFields(prev =>
      prev.map(field =>
        field.id === fieldId ? { ...field, enabled } : field
      )
    );
  };

  const handleExport = async () => {
    const enabledFields = selectedFields.filter(field => field.enabled);
    
    if (enabledFields.length === 0) {
      toast({
        title: "No fields selected",
        description: "Please select at least one field to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const exportOptions: ExportOptions = {
        format: exportFormat,
        dateRange,
        fields: enabledFields,
        filters: {},
      };

      await onExport(exportOptions);
      
      clearInterval(progressInterval);
      setExportProgress(100);

      // Show success briefly before closing
      setTimeout(() => {
        setIsOpen(false);
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);

      toast({
        title: "Export successful",
        description: `${title} exported successfully as ${exportFormat.toUpperCase()}.`,
      });

    } catch (error) {
      setIsExporting(false);
      setExportProgress(0);
      
      console.error("Export failed:", error);
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "csv":
        return <FileSpreadsheet className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "excel":
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const formatOptions = [
    { value: "csv", label: "CSV", description: "Comma-separated values, great for spreadsheets" },
    { value: "pdf", label: "PDF", description: "Formatted document, ready for sharing" },
    { value: "excel", label: "Excel", description: "Excel workbook with formatting" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" disabled={disabled}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export {title}
          </DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {isExporting ? (
          <div className="space-y-4">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h3 className="font-medium mb-2">Preparing your export...</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This may take a few moments for large datasets
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>

            {exportProgress === 100 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Export completed successfully! Download should start automatically.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Format Selection */}
            {showFormatSelector && (
              <div className="space-y-3">
                <Label className="text-base font-medium">Export Format</Label>
                <div className="grid grid-cols-1 gap-3">
                  {formatOptions.map((format) => (
                    <Card 
                      key={format.value}
                      className={`cursor-pointer transition-colors ${
                        exportFormat === format.value 
                          ? "border-primary bg-primary/5" 
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setExportFormat(format.value as any)}
                    >
                      <CardContent className="flex items-center space-x-3 p-4">
                        <div className={`p-2 rounded-md ${
                          exportFormat === format.value 
                            ? "bg-primary/10" 
                            : "bg-muted"
                        }`}>
                          {getFormatIcon(format.value)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{format.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {format.description}
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          exportFormat === format.value
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}>
                          {exportFormat === format.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Date Range Selection */}
            {showDateRange && (
              <div className="space-y-3">
                <Label className="text-base font-medium">Date Range</Label>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={(range) => range && setDateRange(range)}
                />
              </div>
            )}

            {/* Field Selection */}
            {showFieldSelector && (
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Select Fields ({selectedFields.filter(f => f.enabled).length} selected)
                </Label>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                      {selectedFields.map((field) => (
                        <div key={field.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={field.id}
                            checked={field.enabled}
                            onCheckedChange={(checked) => 
                              handleFieldToggle(field.id, checked as boolean)
                            }
                            disabled={field.required}
                          />
                          <Label 
                            htmlFor={field.id}
                            className={`flex-1 ${field.required ? 'text-muted-foreground' : ''}`}
                          >
                            {field.label}
                            {field.required && (
                              <span className="text-xs ml-1">(required)</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Export Summary */}
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Export Summary:</strong> {selectedFields.filter(f => f.enabled).length} fields 
                will be exported as {exportFormat.toUpperCase()} format for the period 
                from {format(dateRange.from, "MMM dd, yyyy")} to {format(dateRange.to, "MMM dd, yyyy")}.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          {!isExporting && (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export {exportFormat.toUpperCase()}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Utility function to generate CSV
export function generateCSV(data: any[], filename?: string): void {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename || `export-${format(new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Utility function for formatting export data
export function formatExportData(
  data: any[],
  fields: ExportField[],
  formatters?: Record<string, (value: any) => string>
): any[] {
  const enabledFieldIds = fields.filter(f => f.enabled).map(f => f.id);
  
  return data.map(item => {
    const formattedItem: any = {};
    
    enabledFieldIds.forEach(fieldId => {
      const field = fields.find(f => f.id === fieldId);
      if (field) {
        const value = item[fieldId];
        formattedItem[field.label] = formatters?.[fieldId] 
          ? formatters[fieldId](value)
          : value;
      }
    });
    
    return formattedItem;
  });
}

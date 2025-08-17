import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  File,
  Image,
  FileText,
  Download,
  Trash2,
  Eye,
  Upload,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Folder,
  Plus,
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url: string;
  category: "image" | "document" | "excel" | "other";
}

const mockFiles: UploadedFile[] = [
  {
    id: "1",
    name: "inventory_template.xlsx",
    size: 25600,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    uploadDate: "2024-01-15",
    url: "https://r2.example.com/files/inventory_template.xlsx",
    category: "excel",
  },
  {
    id: "2",
    name: "product_catalog.pdf",
    size: 2048000,
    type: "application/pdf",
    uploadDate: "2024-01-14",
    url: "https://r2.example.com/files/product_catalog.pdf",
    category: "document",
  },
  {
    id: "3",
    name: "warehouse_layout.jpg",
    size: 1536000,
    type: "image/jpeg",
    uploadDate: "2024-01-13",
    url: "https://r2.example.com/files/warehouse_layout.jpg",
    category: "image",
  },
];

export function FileUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (category: string) => {
    switch (category) {
      case "image":
        return <Image className="h-4 w-4 text-blue-500" />;
      case "document":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "excel":
        return <File className="h-4 w-4 text-emerald-500" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getFileCategory = (type: string): UploadedFile["category"] => {
    if (type.startsWith("image/")) return "image";
    if (type.includes("pdf") || type.includes("document")) return "document";
    if (type.includes("spreadsheet") || type.includes("excel")) return "excel";
    return "other";
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFileUpload(selectedFiles);
    }
  };

  const handleFileUpload = async (fileList: File[]) => {
    setIsUploading(true);

    for (const file of fileList) {
      const fileId = `temp-${Date.now()}-${file.name}`;

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Add to files list after upload completes
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString().split("T")[0],
        url: `https://r2.example.com/files/${file.name}`,
        category: getFileCategory(file.type),
      };

      setFiles((prev) => [newFile, ...prev]);
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }

    setIsUploading(false);
  };

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            File Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                Upload Files to Cloudflare R2
              </h3>
              <p className="text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <div className="flex justify-center">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Uploading...</h4>
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{fileId.split("-").pop()}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Supported File Types:</h4>
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="outline">Images (JPG, PNG, GIF)</Badge>
              <Badge variant="outline">Documents (PDF, DOC, DOCX)</Badge>
              <Badge variant="outline">Spreadsheets (XLS, XLSX)</Badge>
              <Badge variant="outline">Max size: 10MB</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Uploaded Files ({files.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>
                      Organize your files by creating folders
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="folder-name"
                        className="text-sm font-medium"
                      >
                        Folder Name
                      </label>
                      <input
                        id="folder-name"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="Enter folder name"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Create Folder</Button>
                      <Button variant="outline">Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.category)}
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{file.category}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>{file.uploadDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="flex items-center gap-1 w-fit"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Uploaded
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = file.url;
                            link.download = file.name;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Used Storage</span>
              <span>4.2 GB / 100 GB</span>
            </div>
            <Progress value={4.2} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">Images</div>
                <div className="text-muted-foreground">1.5 GB</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Documents</div>
                <div className="text-muted-foreground">2.1 GB</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Spreadsheets</div>
                <div className="text-muted-foreground">0.6 GB</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Other</div>
                <div className="text-muted-foreground">0.1 GB</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

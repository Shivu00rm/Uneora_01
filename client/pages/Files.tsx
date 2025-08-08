import { FileUpload } from "@/components/FileUpload";

export default function Files() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          File Storage
        </h1>
        <p className="text-muted-foreground">
          Manage your files with Cloudflare R2 storage - fast, reliable, and
          globally distributed
        </p>
      </div>

      <FileUpload />
    </div>
  );
}

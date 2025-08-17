import { Loader2, Package } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ 
  message = "Loading...", 
  fullScreen = false 
}: LoadingScreenProps) {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50" 
    : "min-h-screen";

  return (
    <div className={`${containerClass} flex items-center justify-center`}>
      <div className="text-center space-y-4">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-3xl font-bold text-foreground">FlowStock</span>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">{message}</span>
        </div>

        {/* Progress indicator */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function InlineLoading({ 
  message = "Loading...", 
  size = "default" 
}: { 
  message?: string; 
  size?: "sm" | "default" | "lg" 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}

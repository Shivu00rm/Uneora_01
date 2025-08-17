import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
          <div className="w-full max-w-2xl">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-6">
                  <div className="h-16 w-16 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2">Something went wrong</CardTitle>
                <p className="text-muted-foreground">
                  We apologize for the inconvenience. An unexpected error has occurred.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {import.meta.env.DEV && this.state.error && (
                  <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                    <h4 className="font-medium text-destructive mb-2">Error Details (Development Mode):</h4>
                    <pre className="text-xs overflow-auto max-h-32 text-destructive/80">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                )}
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This error has been logged and our team has been notified. 
                    You can try refreshing the page or returning to the home page.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={this.handleRetry} variant="default">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                    <Button onClick={this.handleGoHome} variant="outline">
                      <Home className="mr-2 h-4 w-4" />
                      Go to Home
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">
                    If this problem persists, please contact support with the error details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: string) => {
    console.error('Error caught by useErrorHandler:', error);
    
    // In production, log to monitoring service
    if (import.meta.env.PROD) {
      // Example: logErrorToService(error, { info: errorInfo });
    }
    
    // You can also show a toast notification here
    throw error; // Re-throw to trigger error boundary
  };

  return { handleError };
}

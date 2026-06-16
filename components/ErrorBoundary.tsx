import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-gray-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-heading font-bold text-secondary mb-2">Something went wrong.</h1>
            <p className="text-gray-600 mb-6">We apologize for the inconvenience. Please try refreshing the page or return home.</p>
            <button 
                onClick={() => window.location.href = '/'} 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors"
            >
                <Home size={18} className="mr-2" /> Return Home
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
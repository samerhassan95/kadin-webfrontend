"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorCount: (prevState: ErrorBoundaryState) => prevState.errorCount + 1,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Handle DOM manipulation errors gracefully
    const isDOMError =
      error.message.includes("removeChild") ||
      error.message.includes("Node") ||
      error.message.includes("appendChild") ||
      error.message.includes("insertBefore");

    if (isDOMError) {
      console.warn("DOM manipulation error caught and handled:", error.message);

      // Auto-reset after a short delay for DOM errors
      if (this.resetTimeoutId) {
        clearTimeout(this.resetTimeoutId);
      }

      this.resetTimeoutId = setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 50); // Very short delay for DOM errors
    } else {
      console.error("Error caught by boundary:", error, errorInfo);

      // For other errors, reset after longer delay
      if (this.state.errorCount < 3) {
        // Prevent infinite error loops
        if (this.resetTimeoutId) {
          clearTimeout(this.resetTimeoutId);
        }

        this.resetTimeoutId = setTimeout(() => {
          this.setState({ hasError: false, error: undefined });
        }, 1000);
      }
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // For DOM errors, show minimal disruption
      const isDOMError =
        this.state.error?.message.includes("removeChild") ||
        this.state.error?.message.includes("Node");

      if (isDOMError) {
        return (
          this.props.fallback || (
            <div className="flex items-center justify-center p-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          )
        );
      }

      return (
        this.props.fallback || (
          <div className="flex items-center justify-center p-4 text-sm text-gray-500">
            Something went wrong. Retrying...
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

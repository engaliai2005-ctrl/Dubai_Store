"use client";

import React from "react";
import { RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Silent catch — don't expose internal errors to customers
    if (process.env.NODE_ENV === "development") {
      console.error(`[ErrorBoundary: ${this.props.componentName}]`, error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white border border-slate-200 text-center shadow-sm"
          dir="rtl"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-800">حصلت مشكلة صغيرة</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              حاول تحدّث الصفحة أو ارجع للرئيسية
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-xl bg-[#00C2CB] text-white text-xs font-bold hover:bg-[#0891B2] transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>حاول تاني</span>
            </button>
            <a
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Lightweight functional wrapper for simpler use-cases */
export function SafeWrapper({
  children,
  fallback,
  name,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string;
}) {
  return (
    <ErrorBoundary fallback={fallback} componentName={name}>
      {children}
    </ErrorBoundary>
  );
}

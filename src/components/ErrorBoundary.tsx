"use client";
import React from "react";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F1923] text-white p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-[#1F2731] to-[#151F2B] rounded-2xl p-8 border border-[#FF4655]/20 text-center">
            <FiAlertCircle className="w-16 h-16 text-[#FF4655] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bir Hata Oluştu</h2>
            <p className="text-gray-300 mb-6">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 mb-2">
                  Hata Detayları
                </summary>
                <pre className="text-xs text-red-400 bg-[#0F1923] p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] hover:from-[#FF4655]/90 hover:to-[#FF6B7A]/90 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <FiRefreshCw className="w-5 h-5" />
              Tekrar Dene
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


"use client";
import React from "react";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import FuzzyText from "./FuzzyText";
import Noise from "./Noise";

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
        <div className="relative min-h-screen flex items-center justify-center bg-[#0F1923] text-white p-4 overflow-hidden">
          <Noise patternAlpha={12} />
          <div className="relative z-10 max-w-md w-full bg-gradient-to-br from-[#1F2731]/80 via-[#1A252F]/75 to-[#0F1923]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#FF4655]/20 border-t-[#FF4655]/35 shadow-xl shadow-black/40 text-center">
            <FiAlertCircle className="w-16 h-16 text-[#FF4655] mx-auto mb-4" />
            <div role="heading" aria-level={2} aria-label="Bir Hata Oluştu" className="flex justify-center mb-2">
              <FuzzyText
                fontSize="clamp(1.5rem, 5vw, 2.25rem)"
                fontWeight={700}
                color="#fff"
                baseIntensity={0.12}
                hoverIntensity={0.35}
                fuzzRange={12}
              >
                Bir Hata Oluştu
              </FuzzyText>
            </div>
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] hover:from-[#FF4655]/90 hover:to-[#FF6B7A]/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              aria-label="Tekrar dene"
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


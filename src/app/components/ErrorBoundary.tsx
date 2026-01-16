import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#050505] text-[#EAEAEA] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="relative p-8 md:p-12 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.12),transparent_70%)]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px]" />
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-8 inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Oops! Something went wrong
                </h1>

                {/* Description */}
                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                  We encountered an unexpected error. Don't worry, your data is safe. 
                  You can try refreshing the page or return to the homepage.
                </p>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mb-8 p-4 rounded-xl bg-black/40 border border-red-500/20">
                    <p className="text-red-400 text-sm font-mono mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <details className="mt-4">
                        <summary className="text-white/40 text-xs cursor-pointer hover:text-white/60 transition-colors">
                          Stack trace
                        </summary>
                        <pre className="mt-2 text-white/30 text-xs overflow-auto max-h-64">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={this.handleReset}
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30 text-white font-medium transition-all duration-300 group"
                  >
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium transition-all duration-300"
                  >
                    <Home className="w-5 h-5" />
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

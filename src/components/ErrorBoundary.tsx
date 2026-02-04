import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6">
          <div className="max-w-md w-full text-center space-y-4">
             <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
             </div>
             <h1 className="text-2xl font-bold">Something went wrong</h1>
             <p className="text-zinc-400 text-sm">
                The application encountered an unexpected error. Please try refreshing the page.
             </p>
             <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-left overflow-auto max-h-48 text-xs font-mono text-red-300">
                {this.state.error?.message}
             </div>
             <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
             >
                Reload Application
             </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

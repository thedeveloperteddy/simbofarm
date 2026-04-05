import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 text-center border border-orange-100">
            <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">sorry/ ይቅርታ /  dhiffama</h2>
            <p className="text-gray-500 font-medium mb-8">
              We encountered an unexpected error while rendering this page. Our team has been notified.
            </p>
            <p className="text-gray-500 font-medium mb-8">
              አገልግሎቱን በማቅረብ ላይ የሆነ ችግር ተፈጥሯል፣ ሰራተኞቻችን እስኪያስተካክሉ ድረስ በተግስት ይጠባበቁብ
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-orange-100"
            > </Button>
            <RefreshCw size={18} /> Reload Application/ ከንደገና አስጀምር

            <p className="mt-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Error: {this.state.error?.message || "Unknown Error"}
            </p>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
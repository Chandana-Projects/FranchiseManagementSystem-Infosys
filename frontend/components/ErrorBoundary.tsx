"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw, ShieldCheck, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[OmniFranchise ErrorShield] Uncaught runtime error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-[#06080F] text-slate-100 flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-lg w-full p-8 rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-2xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <AlertOctagon size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-white font-mono">
                OmniFranchise Error Shield Active
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected UI boundary anomaly occurred. The system protected your active telemetry session and state ledger.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 text-left overflow-x-auto text-[11px] font-mono text-rose-300/90 max-h-32">
                {this.state.error.message || "Unknown Application Exception"}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all cursor-pointer shadow-lg shadow-teal-500/20 text-xs"
              >
                <RotateCcw size={14} />
                <span>Reload Portal</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white transition-all cursor-pointer text-xs"
              >
                <ShieldCheck size={14} className="text-teal-400" />
                <span>Try Resume</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

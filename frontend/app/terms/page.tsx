"use client";

import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft, FileText, CheckCircle, AlertOctagon } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#060709] text-slate-200 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="border-b border-amber-500/20 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Terms of Service & Platform Agreement
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                FranchiseOpsAI / OmniFranchise • Effective Date: August 2026
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          <section className="p-6 rounded-2xl bg-[#0B0D12]/80 border border-white/10 backdrop-blur-md">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-amber-400" /> 1. Platform License & Permitted Use
            </h2>
            <p className="mb-2">
              By accessing FranchiseOpsAI, you are granted a non-exclusive, revocable enterprise license to manage multi-outlet franchise operations, telemetry, inventory reorders, and staff compliance checklists.
            </p>
            <p className="text-slate-400">
              You agree not to reverse engineer, decompile, or perform unauthorized vulnerability fuzzing against the API or telemetry gateways.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0B0D12]/80 border border-white/10 backdrop-blur-md">
            <h2 className="text-lg font-bold text-sky-300 flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-sky-400" /> 2. AI Forecasting & Recommendations SLA
            </h2>
            <p className="mb-2">
              Our automated Machine Learning models (revenue forecasting, demand curves, reorder suggestions, and CCTV vision audits) provide high-probability operational intelligence.
            </p>
            <p className="text-slate-400">
              Store managers and franchise owners retain ultimate discretion for financial commitments, purchase order execution, and physical staff management.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0B0D12]/80 border border-white/10 backdrop-blur-md">
            <h2 className="text-lg font-bold text-rose-300 flex items-center gap-2 mb-3">
              <AlertOctagon className="w-5 h-5 text-rose-400" /> 3. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, FranchiseOpsAI shall not be liable for incidental loss of business profits or supply chain delays arising from network outages beyond reasonable operational control.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 FranchiseOpsAI Network. All rights reserved. • <Link href="/privacy" className="text-amber-400 hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

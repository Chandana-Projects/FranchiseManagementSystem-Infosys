"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, Database, Eye, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060709] text-slate-200 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="border-b border-amber-500/20 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Privacy Policy & Data Protection
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                FranchiseOpsAI / OmniFranchise • Last Updated: August 2026 • GDPR & CCPA Compliant
              </p>
            </div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-[#0B0D12]/80 border border-white/10 backdrop-blur-md">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-amber-400" /> 1. Data Minimization & Collection
            </h2>
            <p className="mb-3">
              We collect and process only the minimal operational telemetry strictly required to operate the multi-outlet franchise management platform:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong className="text-white">Account Information:</strong> Name, business email, assigned role, and outlet identifier. Passwords are irreversibly hashed via <code className="text-amber-300">bcrypt</code> with salt rounds before storage.</li>
              <li><strong className="text-white">Store Telemetry:</strong> SKU stock levels, daily sales totals, aggregate order counts, and SOP hygiene checklist audits.</li>
              <li><strong className="text-white">IoT & Audit Logs:</strong> Refrigeration temperatures, anonymized queue wait times, and cryptographic integrity hashes.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-2xl bg-[#0B0D12]/80 border border-white/10 backdrop-blur-md">
            <h2 className="text-lg font-bold text-sky-300 flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-sky-400" /> 2. Data Storage & Sovereign Regions
            </h2>
            <p className="mb-3">
              All production data is stored in isolated PostgreSQL databases with encrypted volume storage (AES-256) and TLS 1.3 encryption in transit.
            </p>
            <p className="text-slate-400">
              We do not sell, rent, or monetize your franchise sales or staff data to third-party ad brokers or data aggregators.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-[#0B0D12]/80 border border-white/10 backdrop-blur-md">
            <h2 className="text-lg font-bold text-emerald-300 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 3. GDPR & CCPA Rights
            </h2>
            <p className="mb-3">Regardless of your geographical location, you retain full rights over your data:</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-white block mb-1">Right to Access & Export</strong>
                <p className="text-xs text-slate-400">Export your store telemetry, transactions, and audit reports in CSV or PDF at any time.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-white block mb-1">Right to Erasure ("Be Forgotten")</strong>
                <p className="text-xs text-slate-400">Request permanent purge of staff accounts and historical logs via your Super Admin console.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-2xl bg-[#0B0D12]/80 border border-white/10 backdrop-blur-md">
            <h2 className="text-lg font-bold text-violet-300 flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-violet-400" /> 4. Cookies & Session Storage
            </h2>
            <p>
              This application uses strictly necessary authentication tokens (<code className="text-amber-300">JWT</code> in localStorage / HTTP cookies) and UI state preferences (dark/light theme, active currency). We do not deploy cross-site tracking cookies or third-party pixel trackers.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 FranchiseOpsAI Network. All rights reserved. • <Link href="/terms" className="text-amber-400 hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

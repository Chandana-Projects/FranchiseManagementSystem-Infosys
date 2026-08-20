"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("fops_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("fops_cookie_consent", "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 rounded-2xl bg-[#0B0D12]/95 border border-amber-500/30 shadow-2xl backdrop-blur-xl text-slate-200 ring-1 ring-amber-500/20"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">
              Privacy & Cookie Notice
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              We use strictly functional cookies & local session storage to remember your authentication and multi-outlet preferences. No cross-site ad tracking.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleAccept}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer"
              >
                Accept All
              </button>
              <Link
                href="/privacy"
                className="text-xs text-amber-400 hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-slate-500 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

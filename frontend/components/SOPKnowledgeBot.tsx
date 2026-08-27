"use client";

import React, { useState } from "react";
import { BookOpen, Search, X, Bot, CheckCircle2, ShieldAlert, Sparkles, Send, FileText } from "lucide-react";

interface SOPResult {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  complianceRating: string;
  standardAction: string;
  confidence: number;
}

const PRESET_QUERIES = [
  "Freezer temperature drop workflow",
  "Daily cash register variance limit",
  "Rejecting damaged supplier delivery",
  "Employee overtime authorization",
  "Deep cleaning sanitation schedule"
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function SOPKnowledgeBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [topMatch, setTopMatch] = useState<SOPResult | null>(null);
  const [allMatches, setAllMatches] = useState<SOPResult[]>([]);

  if (!isOpen) return null;

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/enterprise/sop-rag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = res.ok ? await res.json() : null;
      if (data && data.success) {
        setTopMatch(data.topMatch);
        setAnswer(data.aiGeneratedAnswer);
        setAllMatches(data.allResults || []);
      } else {
        setAnswer(`SOP Knowledge Base Answer: For "${searchQuery}", please follow standard franchise operational guidelines, maintain HACCP cleanliness standards, and ensure employee shift logs are up to date.`);
      }
    } catch (err) {
      setAnswer(`SOP AI Offline Mode: Standard operating procedure for "${searchQuery}" is active. Ensure daily opening checklists and temperature compliance audits (<= 3.8°C for dairy) are completed.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-2xl bg-[#0b0f19] border-l border-amber-500/30 text-white h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-[#0d1322] to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-black shadow-lg shadow-amber-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Franchise SOP RAG AI Assistant</h3>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Vector Match
                </span>
              </div>
              <p className="text-xs text-amber-200/70">Instant Search over Food Safety, Operations & Compliance Manuals</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Preset Prompts */}
          <div>
            <label className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider mb-2.5 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Frequently Asked Compliance Prompts
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(p)}
                  className="text-xs bg-slate-800/80 hover:bg-amber-950/50 hover:border-amber-500/50 border border-slate-700 text-slate-300 hover:text-amber-200 px-3 py-1.5 rounded-lg transition-all text-left flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 text-amber-400" />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Top Match Result Card */}
          {isLoading ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400 animate-pulse">Running TF-IDF Vector Similarity Search over SOP Repository...</p>
            </div>
          ) : topMatch ? (
            <div className="space-y-4">
              
              {/* Primary Match Card */}
              <div className="bg-gradient-to-b from-slate-900 to-[#0d1527] border border-amber-500/30 rounded-2xl p-5 shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                        {topMatch.id}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{topMatch.category}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">{topMatch.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {topMatch.confidence}% Match
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="text-xs uppercase text-slate-400 font-semibold mb-1">Executive Summary</h5>
                    <p className="text-slate-200 font-medium bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                      {topMatch.summary}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs uppercase text-slate-400 font-semibold mb-1">Standard Operating Procedure Content</h5>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                      {topMatch.content}
                    </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                      <span className="text-[11px] uppercase text-amber-400 font-semibold block mb-0.5">Compliance Level</span>
                      <span className="text-xs font-bold text-amber-200 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        {topMatch.complianceRating}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                      <span className="text-[11px] uppercase text-emerald-400 font-semibold block mb-0.5">Required Action</span>
                      <span className="text-xs font-medium text-emerald-200">{topMatch.standardAction}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related SOP Documents */}
              {allMatches.length > 1 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Other Related SOP Documents</h5>
                  <div className="space-y-2">
                    {allMatches.slice(1).map((m) => (
                      <div 
                        key={m.id}
                        onClick={() => { setTopMatch(m); setAnswer(m.content); }}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="text-xs font-mono text-amber-300 font-bold">{m.id}: </span>
                            <span className="text-xs font-medium text-slate-200">{m.title}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">{m.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
              <Bot className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-300 mb-1">Search Franchise Compliance Documents</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Type any query regarding store hygiene, cash reconciliation, temperature logs, or employee policies to retrieve exact SOP clauses.
              </p>
            </div>
          )}

        </div>

        {/* Input Bar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about SOP rules (e.g. freezer temp, cashier void)..."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-5 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Query</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

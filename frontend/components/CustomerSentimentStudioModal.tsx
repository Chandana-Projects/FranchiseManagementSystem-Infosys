"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle2,
  X,
  Filter,
  Send,
  Bot,
  Copy,
  Check,
  TrendingUp,
  Heart,
  Share2,
  Smile,
  Frown,
  Meh
} from "lucide-react";
import { playTechChime } from "@/lib/WebAudioSFX";

interface SentimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    textFaint?: string;
    panel?: string;
    gridLine?: string;
  };
  accent?: string;
  isDark?: boolean;
}

interface CustomerReview {
  id: string;
  author: string;
  outlet: string;
  channel: "Google Reviews" | "Zomato" | "Swiggy" | "Table QR";
  rating: number;
  date: string;
  comment: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  aspects: string[];
  aiReplyDraft?: string;
}

const SAMPLE_REVIEWS: CustomerReview[] = [
  {
    id: "REV-101",
    author: "Rohan Deshmukh",
    outlet: "Pune FC Road",
    channel: "Google Reviews",
    rating: 5,
    date: "Today, 14:15",
    comment: "The Hazelnut Cappuccino and artisanal sourdough toast were exceptional! Staff was super polite and orders arrived in under 4 minutes.",
    sentiment: "Positive",
    aspects: ["Taste: 10/10", "Speed: Fast", "Staff: Courteous"]
  },
  {
    id: "REV-102",
    author: "Priya Sharma",
    outlet: "Mumbai Andheri East",
    channel: "Zomato",
    rating: 2,
    date: "Today, 13:40",
    comment: "Food quality is great but delivery rider arrived 25 minutes late and cold brew had leaked in the paper bag packaging.",
    sentiment: "Negative",
    aspects: ["Packaging: Leakage", "Delivery: Delayed", "Taste: Good"]
  },
  {
    id: "REV-103",
    author: "Aditya Verma",
    outlet: "Bangalore Koramangala",
    channel: "Swiggy",
    rating: 4,
    date: "Yesterday",
    comment: "Solid espresso and great ambiance to work from. Seating was crowded during lunchtime, would love more plug sockets.",
    sentiment: "Positive",
    aspects: ["Coffee: Excellent", "Ambiance: Great", "Seating: Crowded"]
  },
  {
    id: "REV-104",
    author: "Sneha Patil",
    outlet: "Nashik City Center",
    channel: "Table QR",
    rating: 5,
    date: "Yesterday",
    comment: "Extremely clean outlet! Saw staff wearing hairnets and sanitizing tables continuously. Truly five-star hygiene.",
    sentiment: "Positive",
    aspects: ["Hygiene: 10/10", "Cleanliness: Outstanding"]
  },
  {
    id: "REV-105",
    author: "Vikram Mehta",
    outlet: "Aurangabad CIDCO",
    channel: "Google Reviews",
    rating: 3,
    date: "2 days ago",
    comment: "Average experience. The combo meal was decent, but they had run out of almond milk for the latte.",
    sentiment: "Neutral",
    aspects: ["Stock: Almond Milk Out", "Value: Moderate"]
  }
];

const ASPECT_SCORES = [
  { aspect: "Food Taste & Freshness", score: 96, positivePct: 96, status: "Outstanding" },
  { aspect: "Cleanliness & PPE Hygiene", score: 97, positivePct: 97, status: "Top Tier" },
  { aspect: "Staff Friendliness & Courtesy", score: 92, positivePct: 92, status: "Excellent" },
  { aspect: "Order Accuracy & Prep Speed", score: 88, positivePct: 88, status: "Strong" },
  { aspect: "Packaging & Delivery Integrity", score: 82, positivePct: 82, status: "Attention Needed" }
];

export default function CustomerSentimentStudioModal({
  isOpen,
  onClose,
  t,
  accent = "#3B82F6",
  isDark = true
}: SentimentModalProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>(SAMPLE_REVIEWS);
  const [activeFilter, setActiveFilter] = useState<"All" | "Positive" | "Neutral" | "Negative">("All");
  const [activeChannel, setActiveChannel] = useState<string>("All Channels");
  const [selectedReviewForReply, setSelectedReviewForReply] = useState<CustomerReview | null>(null);
  const [replyTone, setReplyTone] = useState<"Appreciative" | "Apologetic" | "Promotional">("Appreciative");
  const [generatedReply, setGeneratedReply] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchSentiment = activeFilter === "All" || r.sentiment === activeFilter;
      const matchChannel = activeChannel === "All Channels" || r.channel === activeChannel;
      return matchSentiment && matchChannel;
    });
  }, [reviews, activeFilter, activeChannel]);

  // Handle AI Reply Generation
  const handleGenerateReply = (rev: CustomerReview) => {
    playTechChime();
    setSelectedReviewForReply(rev);

    let reply = "";
    if (rev.sentiment === "Negative") {
      reply = `Hi ${rev.author}, thank you for bringing this to our attention. We are truly sorry to hear about your experience with ${rev.aspects.join(", ")} at our ${rev.outlet} outlet. Quality and customer delight are our highest priorities. We have logged this directly with our store manager and packaging team. Please enjoy a complimentary brew on us during your next visit with coupon code RELIEF100! ☕`;
      setReplyTone("Apologetic");
    } else if (rev.sentiment === "Positive") {
      reply = `Dear ${rev.author}, thank you so much for the wonderful 5-star review! Our team at ${rev.outlet} is thrilled to hear you enjoyed the ${rev.aspects.join(" and ")}. We take immense pride in crafting exceptional experiences for you every day. Looking forward to welcoming you back soon! ✨`;
      setReplyTone("Appreciative");
    } else {
      reply = `Hello ${rev.author}, thank you for your feedback! We appreciate your honest review regarding our ${rev.outlet} outlet. We have noted your comments to ensure our ingredient inventory and seating capacity are continually optimized. We hope to earn your 5-star rating on your next visit!`;
      setReplyTone("Appreciative");
    }
    setGeneratedReply(reply);
  };

  const handleCopyReply = () => {
    playTechChime();
    navigator.clipboard.writeText(generatedReply);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-6xl rounded-2xl border shadow-2xl overflow-hidden glass-card max-h-[94vh] flex flex-col transition-all"
        style={{ background: t.card, borderColor: t.border }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-3"
          style={{ borderColor: t.gridLine || t.border }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: t.text }}>
                  Customer Voice & NLP Sentiment Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> MULTI-CHANNEL NLP
                </span>
              </div>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Omnichannel customer review monitoring, aspect-based sentiment intelligence, and automated AI executive responses
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTechChime();
              onClose();
            }}
            className="p-2 rounded-xl border transition-colors hover:bg-white/10"
            style={{ borderColor: t.border, color: t.textMuted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Top Sentiment KPI Highlights Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* KPI 1: Overall CSAT */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Overall Customer CSAT
              </div>
              <div className="text-2xl font-extrabold text-amber-400">4.72 / 5.0</div>
              <div className="text-[10px] text-slate-400">Based on 14,290 verified guest reviews</div>
            </div>

            {/* KPI 2: NPS Score */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Net Promoter Score (NPS)
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">+64 NPS</div>
              <div className="text-[10px] text-emerald-300 font-bold">World-Class Brand Loyalty</div>
            </div>

            {/* KPI 3: Positive Sentiment Ratio */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-cyan-400" /> Positive Sentiment Ratio
              </div>
              <div className="text-2xl font-extrabold text-cyan-400">92.4%</div>
              <div className="text-[10px] text-slate-400">5.8% Neutral • 1.8% Critical</div>
            </div>

            {/* KPI 4: AI Reply Speed */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" /> AI Response Resolution
              </div>
              <div className="text-2xl font-extrabold text-purple-400">98.2%</div>
              <div className="text-[10px] text-slate-400">Avg turnaround &lt;15 mins</div>
            </div>
          </div>

          {/* Aspect-Based Sentiment Progress Meters */}
          <div className="p-4 rounded-xl border bg-slate-900/40 space-y-3" style={{ borderColor: t.border }}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Aspect-Based NLP Sentiment Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {ASPECT_SCORES.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-slate-800/40 border-slate-700/60 space-y-2">
                  <div className="text-xs font-semibold truncate" style={{ color: t.text }}>
                    {item.aspect}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-pink-400">{item.positivePct}%</span>
                    <span className="text-[10px] text-slate-400 font-bold">{item.status}</span>
                  </div>
                  <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                      style={{ width: `${item.positivePct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column Area: Review Stream (Left) & AI Response Generator (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Reviews Stream (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              {/* Filter Tabs Strip */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-slate-800/40 p-1 rounded-xl border border-slate-700/60">
                  {(["All", "Positive", "Neutral", "Negative"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        playTechChime();
                        setActiveFilter(filter);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeFilter === filter
                          ? "bg-pink-500 text-white shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400">
                  Showing <span className="font-bold text-white">{filteredReviews.length}</span> verified customer reviews
                </div>
              </div>

              {/* Review Cards List */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border bg-slate-900/40 border-slate-800 space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs" style={{ color: t.text }}>
                          {rev.author}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {rev.outlet}
                        </span>
                        <span className="text-[10px] text-pink-400 font-mono font-semibold">
                          {rev.channel}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 ml-1">{rev.date}</span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {rev.aspects.map((asp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60"
                          >
                            {asp}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleGenerateReply(rev)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition-all"
                      >
                        <Bot className="w-3.5 h-3.5" /> AI Draft Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Response Studio (1 Col) */}
            <div className="p-4 rounded-xl border bg-slate-900/40 space-y-4 flex flex-col justify-between" style={{ borderColor: t.border }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-pink-400" /> AI Executive Response Hub
                  </h4>
                  <span className="text-[10px] text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded">
                    1-CLICK CO-PILOT
                  </span>
                </div>

                {selectedReviewForReply ? (
                  <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs space-y-1">
                    <span className="text-[10px] text-slate-400">Replying to:</span>
                    <div className="font-bold text-white">{selectedReviewForReply.author} ({selectedReviewForReply.outlet})</div>
                    <div className="text-[11px] text-slate-300 italic truncate">"{selectedReviewForReply.comment}"</div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-dashed border-slate-700 text-center text-xs text-slate-400">
                    Select "AI Draft Reply" on any review to generate an automated executive message.
                  </div>
                )}

                {generatedReply && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Generated Reply Draft:</label>
                    <textarea
                      value={generatedReply}
                      onChange={(e) => setGeneratedReply(e.target.value)}
                      rows={7}
                      className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-400 leading-relaxed font-sans"
                    />
                  </div>
                )}
              </div>

              {generatedReply && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <button
                    onClick={handleCopyReply}
                    className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg transition-all"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {isCopied ? "Copied to Clipboard!" : "Copy & Deploy Reply to Portal"}
                  </button>
                  <p className="text-[10px] text-center text-slate-500">
                    Automatically syncs with Google My Business & Zomato Partner APIs
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

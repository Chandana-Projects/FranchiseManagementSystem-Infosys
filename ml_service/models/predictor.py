"""
predictor.py
Loads trained models from disk and provides inference functions.
All functions are safe — they return None on any error so the
caller can fall back gracefully.
"""

import os
import sys
import joblib
import numpy as np
from typing import Optional, Dict, Any

MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved")

DEMAND_LABELS = {0: "Low", 1: "Medium", 2: "High"}
TIER_MAP      = {"A": 3, "B": 2, "C": 1}

# Lazy-loaded model cache
_cache: Dict[str, Any] = {}


def _load(name: str):
    """Load a joblib artifact from disk, with in-memory caching."""
    if name not in _cache:
        path = os.path.join(MODELS_DIR, name)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model not found: {path}. Run models/trainer.py first.")
        _cache[name] = joblib.load(path)
    return _cache[name]


def predict_revenue(
    outlet_id: int,
    tier: str,
    month: int,
    avg_weekend: float,
    avg_campaign: float,
    avg_lag7: float,
    avg_lag14: float,
    avg_roll4w: float,
) -> Optional[Dict[str, Any]]:
    """
    Predict next month's revenue for an outlet.
    Returns dict with predicted_revenue and confidence_pct, or None on error.
    """
    try:
        model  = _load("revenue_model.joblib")
        scaler = _load("revenue_scaler.joblib")

        tier_enc = TIER_MAP.get(tier.upper(), 2)
        X = np.array([[outlet_id, tier_enc, month, avg_weekend, avg_campaign,
                        avg_lag7, avg_lag14, avg_roll4w]])
        X_s = scaler.transform(X)
        pred = float(model.predict(X_s)[0])

        # Confidence heuristic: based on tier data richness
        confidence = {"A": 88, "B": 82, "C": 74}.get(tier.upper(), 78)

        return {
            "predicted_revenue": round(max(0, pred), 2),
            "confidence_pct":    confidence,
        }
    except Exception as e:
        print(f"[predictor] revenue error: {e}", file=sys.stderr)
        return None


def predict_demand(
    outlet_id: int,
    tier: str,
    month: int,
    avg_weekend: float,
    avg_campaign: float,
    avg_lag7: float,
    avg_lag14: float,
    avg_roll4w: float,
) -> Optional[Dict[str, Any]]:
    """
    Predict demand level (High / Medium / Low) for an outlet.
    Returns dict with demand_label, demand_code, probabilities, or None on error.
    """
    try:
        model  = _load("demand_model.joblib")
        scaler = _load("demand_scaler.joblib")

        tier_enc = TIER_MAP.get(tier.upper(), 2)
        X = np.array([[outlet_id, tier_enc, month, avg_weekend, avg_campaign,
                        avg_lag7, avg_lag14, avg_roll4w]])
        X_s   = scaler.transform(X)
        code  = int(model.predict(X_s)[0])
        proba = model.predict_proba(X_s)[0].tolist()

        return {
            "demand_label": DEMAND_LABELS[code],
            "demand_code":  code,
            "probabilities": {
                "Low":    round(proba[0] * 100, 1),
                "Medium": round(proba[1] * 100, 1),
                "High":   round(proba[2] * 100, 1),
            },
        }
    except Exception as e:
        print(f"[predictor] demand error: {e}", file=sys.stderr)
        return None


def predict_reorder(
    outlet_id: int,
    tier: str,
    month: int,
    consumption_rate: float,
    lead_days: int,
) -> Optional[Dict[str, Any]]:
    """
    Predict recommended reorder quantity for an outlet.
    Returns dict with reorder_qty or None on error.
    """
    try:
        model  = _load("reorder_model.joblib")
        scaler = _load("reorder_scaler.joblib")

        tier_enc = TIER_MAP.get(tier.upper(), 2)
        X   = np.array([[outlet_id, tier_enc, month, consumption_rate, lead_days]])
        X_s = scaler.transform(X)
        qty = float(model.predict(X_s)[0])

        return {"reorder_qty": round(max(0, qty), 2)}
    except Exception as e:
        print(f"[predictor] reorder error: {e}", file=sys.stderr)
        return None


def models_ready() -> bool:
    """Returns True if all model files exist on disk."""
    required = [
        "revenue_model.joblib", "revenue_scaler.joblib",
        "demand_model.joblib",  "demand_scaler.joblib",
        "reorder_model.joblib", "reorder_scaler.joblib",
    ]
    return all(os.path.exists(os.path.join(MODELS_DIR, f)) for f in required)

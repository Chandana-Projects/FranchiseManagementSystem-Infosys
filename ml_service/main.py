"""
main.py — FranchiseOpsAI ML Microservice
FastAPI server exposing ML prediction, simulation, MLOps metrics, retraining,
and real-time anomaly detection endpoints.
"""

import os
import sys
import json
import threading
from datetime import datetime
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

# Ensure project root is on path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.predictor import (
    predict_revenue,
    predict_demand,
    predict_reorder,
    models_ready,
)
from models.trainer import run_full_training

# ── App setup ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="FranchiseOpsAI ML Service",
    description="Machine Learning microservice for franchise intelligence predictions",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for local debugging
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Global variables for training state and active anomalies IsolationForest
_training_lock = threading.Lock()
_training_in_progress = False

# ── Request / Response models ──────────────────────────────────────────────────

class OutletFeatures(BaseModel):
    outlet_id:    int
    tier:         str
    month:        int
    avg_weekend:  float = 0.286
    avg_campaign: float = 0.25
    avg_lag7:     float
    avg_lag14:    float
    avg_roll4w:   float


class BatchPredictRequest(BaseModel):
    outlets: List[OutletFeatures]


class ReorderRequest(BaseModel):
    outlet_id:        int
    tier:             str
    month:            int
    consumption_rate: float
    lead_days:        int


class SimulationRequest(BaseModel):
    outlet_id:        int
    tier:             str
    month:            int
    avg_lag7:         float
    avg_lag14:        float
    avg_roll4w:       float
    discount_pct:     float = Field(0.0, description="Discount rate percentage applied (0 - 50)")
    spend_multiplier: float = Field(1.0, description="Multiplier for marketing spend (0.0 - 5.0)")


class TransactionRecord(BaseModel):
    timestamp:  str
    revenue:    float
    orders:     int
    customers:  int


class AnomalyCheckRequest(BaseModel):
    outlet_id: int
    recent_transactions: List[TransactionRecord]


class WeatherForecastRequest(BaseModel):
    condition: str = "Rainy"
    temp_c: float = 24.0


class MacroShockRequest(BaseModel):
    coffee_price_increase_pct: float = 15.0
    dairy_price_increase_pct: float = 10.0


# ── Internal Anomaly Detector ──────────────────────────────────────────────────

def detect_anomaly_isolation_forest(transactions: List[TransactionRecord]) -> Dict[str, Any]:
    """Runs Isolation Forest algorithm on a sequence of transactions to flag outliers."""
    if len(transactions) < 5:
        # Not enough history to run forest, use simple thresholds
        return {"has_anomaly": False, "score": 0.0, "reason": "Insufficient history"}
        
    df = pd.DataFrame([t.model_dump() for t in transactions])
    
    # Feature engineering for anomaly detection
    df["order_value"] = df["revenue"] / df["orders"].replace(0, 1)
    df["cust_ratio"]  = df["orders"] / df["customers"].replace(0, 1)
    
    features = df[["revenue", "orders", "customers", "order_value", "cust_ratio"]].fillna(0)
    
    # Train fresh local isolation forest on the fly (super fast for 30 rows)
    clf = IsolationForest(n_estimators=50, contamination=0.1, random_state=42)
    preds = clf.fit_predict(features)
    scores = clf.decision_function(features)
    
    # Check the latest record (most recent transaction)
    latest_pred = preds[-1]
    latest_score = float(scores[-1])
    
    # An anomaly is flagged if predicted as -1
    is_anomaly = bool(latest_pred == -1)
    
    latest_rev = df["revenue"].iloc[-1]
    
    # Determine reason
    reason = "Normal operations"
    if is_anomaly:
        mean_rev = df["revenue"].mean()
        if latest_rev < mean_rev * 0.4:
            reason = f"Critical drop in revenue ({latest_rev:.1f} vs avg {mean_rev:.1f})"
        elif latest_rev > mean_rev * 2.5:
            reason = f"Unusual spike in transaction volume ({latest_rev:.1f} vs avg {mean_rev:.1f})"
        else:
            reason = "Atypical sales velocity or order patterns detected"

    return {
        "has_anomaly": is_anomaly,
        "score":       round((0.5 - latest_score) * 100, 1), # Normalize to a 0-100 gauge
        "reason":      reason,
        "latest":      float(latest_rev)
    }

# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/ml/health")
def health_check():
    return {
        "status":       "ok",
        "service":      "FranchiseOpsAI ML Service",
        "models_ready": models_ready(),
        "training_active": _training_in_progress,
        "timestamp":    datetime.utcnow().isoformat() + "Z",
    }


@app.post("/ml/predict/revenue")
def predict_revenue_endpoint(outlet: OutletFeatures):
    if not models_ready():
        raise HTTPException(status_code=503, detail="Models not trained.")
    result = predict_revenue(
        outlet_id=outlet.outlet_id,
        tier=outlet.tier,
        month=outlet.month,
        avg_weekend=outlet.avg_weekend,
        avg_campaign=outlet.avg_campaign,
        avg_lag7=outlet.avg_lag7,
        avg_lag14=outlet.avg_lag14,
        avg_roll4w=outlet.avg_roll4w,
    )
    if result is None:
        raise HTTPException(status_code=500, detail="Prediction failed.")
    return {"outlet_id": outlet.outlet_id, **result}


@app.post("/ml/predict/batch")
def batch_predict(request: BatchPredictRequest):
    if not models_ready():
        raise HTTPException(status_code=503, detail="Models not trained.")

    results = []
    for outlet in request.outlets:
        rev = predict_revenue(
            outlet_id=outlet.outlet_id, tier=outlet.tier, month=outlet.month,
            avg_weekend=outlet.avg_weekend, avg_campaign=outlet.avg_campaign,
            avg_lag7=outlet.avg_lag7, avg_lag14=outlet.avg_lag14, avg_roll4w=outlet.avg_roll4w,
        )
        dem = predict_demand(
            outlet_id=outlet.outlet_id, tier=outlet.tier, month=outlet.month,
            avg_weekend=outlet.avg_weekend, avg_campaign=outlet.avg_campaign,
            avg_lag7=outlet.avg_lag7, avg_lag14=outlet.avg_lag14, avg_roll4w=outlet.avg_roll4w,
        )
        results.append({
            "outlet_id":    outlet.outlet_id,
            "revenue":      rev,
            "demand":       dem,
        })
    return {"predictions": results, "count": len(results)}


@app.post("/ml/predict/simulate")
def simulate_forecast(req: SimulationRequest):
    """
    Runs dynamic revenue simulation. Modifies feature vectors based on
    marketing spend and discount parameters to return simulated vs original revenue.
    """
    if not models_ready():
        raise HTTPException(status_code=503, detail="Models not trained.")

    # 1. Modify average campaign days based on spend multiplier (marketing impact)
    simulated_campaign = min(1.0, max(0.0, 0.25 * req.spend_multiplier))
    
    # 2. Modify average rolling daily sales based on discount rate impact
    # A discount drives volume (lag revenue increases) but hurts margins if too high.
    # Optimal discount peak around 15% - 20%
    disc_factor = 1.0 + (req.discount_pct * 0.015) - (0.0004 * (req.discount_pct ** 2))
    
    sim_lag7 = req.avg_lag7 * disc_factor
    sim_lag14 = req.avg_lag14 * disc_factor
    sim_roll4w = req.avg_roll4w * disc_factor

    # Run predictions with modified inputs
    original = predict_revenue(
        outlet_id=req.outlet_id, tier=req.tier, month=req.month,
        avg_weekend=0.286, avg_campaign=0.25,
        avg_lag7=req.avg_lag7, avg_lag14=req.avg_lag14, avg_roll4w=req.avg_roll4w
    )

    simulated = predict_revenue(
        outlet_id=req.outlet_id, tier=req.tier, month=req.month,
        avg_weekend=0.286, avg_campaign=simulated_campaign,
        avg_lag7=sim_lag7, avg_lag14=sim_lag14, avg_roll4w=sim_roll4w
    )

    if original is None or simulated is None:
        raise HTTPException(status_code=500, detail="Simulation failed.")

    return {
        "outlet_id":        req.outlet_id,
        "original_revenue":  original["predicted_revenue"],
        "simulated_revenue": simulated["predicted_revenue"],
        "margin_delta_pct":  round((disc_factor - 1.0) * 100, 2),
        "confidence_pct":    original["confidence_pct"]
    }


@app.post("/ml/detect/anomalies")
def detect_anomalies(req: AnomalyCheckRequest):
    """Detects if recent transactions show operational or revenue anomalies (Isolation Forest)."""
    return detect_anomaly_isolation_forest(req.recent_transactions)


@app.post("/ml/predict/weather")
def weather_demand_forecast(req: WeatherForecastRequest):
    """Adjusts demand forecast based on weather signals (exogenous factors)."""
    factor = 1.0
    impact = "Neutral"
    if "rain" in req.condition.lower():
        factor = 0.88
        impact = "Cold beverages -12%, Hot coffees +18% (Heavy Rain)"
    elif "heat" in req.condition.lower() or req.temp_c > 35:
        factor = 1.14
        impact = "Iced teas & smoothies +24%, Hot brews -15%"
    elif "sun" in req.condition.lower():
        factor = 1.05
        impact = "Standard summer footfall boost (+5%)"
    
    return {
        "condition": req.condition,
        "demand_multiplier": factor,
        "impact_summary": impact
    }


@app.post("/ml/simulate/macro")
def macro_inflation_simulation(req: MacroShockRequest):
    """Simulates supply chain cost shocks on overall franchise net profit margin."""
    avg_gross_margin = 68.0
    cost_impact = (req.coffee_price_increase_pct * 0.18) + (req.dairy_price_increase_pct * 0.12)
    simulated_margin = max(10.0, avg_gross_margin - cost_impact)
    
    return {
        "coffee_inflation_pct": req.coffee_price_increase_pct,
        "dairy_inflation_pct": req.dairy_price_increase_pct,
        "baseline_margin_pct": avg_gross_margin,
        "simulated_margin_pct": round(simulated_margin, 2),
        "margin_drop_pct": round(cost_impact, 2),
        "recommendation": f"Raise beverage base prices by {round(cost_impact * 0.8, 1)}% to maintain net profitability."
    }


@app.get("/ml/metrics")
def get_metrics():
    """Reads MLOps performance and feature importance metrics from local metrics.json."""
    metrics_path = os.path.join(os.path.dirname(__file__), "models/saved/metrics.json")
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Metrics not generated. Please retrain models.")
    try:
        with open(metrics_path, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read metrics: {e}")


def _background_train_task():
    global _training_in_progress
    try:
        run_full_training()
    finally:
        with _training_lock:
            _training_in_progress = False


@app.post("/ml/train")
def trigger_retraining(background_tasks: BackgroundTasks):
    """Triggers asynchronous retraining of all machine learning models."""
    global _training_in_progress
    with _training_lock:
        if _training_in_progress:
            return {"status": "error", "message": "Training already in progress."}
        _training_in_progress = True
        
    background_tasks.add_task(_background_train_task)
    return {
        "status": "success",
        "message": "Model retraining triggered successfully in background."
    }

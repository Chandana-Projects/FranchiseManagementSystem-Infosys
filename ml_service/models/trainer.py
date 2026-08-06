import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, accuracy_score
import xgboost as xgb

from data.generate_dataset import generate_sales_dataset, generate_inventory_dataset

MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved")
os.makedirs(MODELS_DIR, exist_ok=True)

# Shared feature columns
SALES_FEATURES = [
    "outlet_id", "tier_encoded", "month",
    "avg_weekend", "avg_campaign",
    "avg_lag7", "avg_lag14", "avg_roll4w",
]
INV_FEATURES = ["outlet_id", "tier_encoded", "month", "consumption_rate", "lead_days"]


def train_revenue_model(df: pd.DataFrame):
    """XGBoost regression -> predict next_month_revenue."""
    X = df[SALES_FEATURES]
    y = df["next_month_revenue"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=0,
    )
    model.fit(X_train_s, y_train)

    preds = model.predict(X_test_s)
    mae   = mean_absolute_error(y_test, preds)

    # Get feature importances
    importances = model.feature_importances_.tolist()
    feature_importance = {feat: float(imp) for feat, imp in zip(SALES_FEATURES, importances)}

    joblib.dump(model,  os.path.join(MODELS_DIR, "revenue_model.joblib"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "revenue_scaler.joblib"))
    
    return float(mae), feature_importance


def train_demand_model(df: pd.DataFrame):
    """RandomForest classifier -> predict demand_label (0=Low,1=Med,2=High)."""
    X = df[SALES_FEATURES]
    y = df["demand_label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=6,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train_s, y_train)

    acc = accuracy_score(y_test, model.predict(X_test_s))

    # Feature importances
    importances = model.feature_importances_.tolist()
    feature_importance = {feat: float(imp) for feat, imp in zip(SALES_FEATURES, importances)}

    joblib.dump(model,  os.path.join(MODELS_DIR, "demand_model.joblib"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "demand_scaler.joblib"))
    
    return float(acc), feature_importance


def train_reorder_model(df: pd.DataFrame):
    """Ridge regression -> predict reorder_qty."""
    X = df[INV_FEATURES]
    y = df["reorder_qty"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    model = Ridge(alpha=1.0)
    model.fit(X_train_s, y_train)

    mae = mean_absolute_error(y_test, model.predict(X_test_s))

    # Ridge coefficients as proxy for importance
    coefs = np.abs(model.coef_).tolist()
    total_coef = sum(coefs) if sum(coefs) > 0 else 1
    feature_importance = {feat: float(c / total_coef) for feat, c in zip(INV_FEATURES, coefs)}

    joblib.dump(model,  os.path.join(MODELS_DIR, "reorder_model.joblib"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "reorder_scaler.joblib"))
    
    return float(mae), feature_importance


def run_full_training():
    """Generates datasets, trains models, outputs joblibs and metrics.json."""
    sales_df = generate_sales_dataset(n_months=24)
    inv_df   = generate_inventory_dataset(n_months=24)

    rev_mae, rev_importance = train_revenue_model(sales_df)
    dem_acc, dem_importance = train_demand_model(sales_df)
    inv_mae, inv_importance = train_reorder_model(inv_df)

    metrics = {
        "revenue_mae": rev_mae,
        "revenue_importance": rev_importance,
        "demand_accuracy": dem_acc,
        "demand_importance": dem_importance,
        "reorder_mae": inv_mae,
        "reorder_importance": inv_importance,
        "trained_at": pd.Timestamp.now().isoformat()
    }

    with open(os.path.join(MODELS_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=4)
        
    return metrics


def main():
    print("[*] Generating training datasets ...")
    try:
        metrics = run_full_training()
        print(f"  Revenue Model -> MAE: Rs. {metrics['revenue_mae']:,.0f}")
        print(f"  Demand Model  -> Accuracy: {metrics['demand_accuracy']:.1%}")
        print(f"  Reorder Model -> MAE: {metrics['reorder_mae']:.4f} units")
        print("\n[OK] All models saved to models/saved/ along with metrics.json")
    except Exception as e:
        print(f"Error in training pipeline: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

"""
generate_dataset.py
Generates a realistic franchise sales & inventory dataset.
Schema mirrors Kaggle "Store Sales - Time Series Forecasting" format.
Used to train ML models when no live DB data is available.
"""

import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta

OUTLETS = [
    {"id": 1, "name": "Pune",         "tier": "A", "base_revenue": 154000},
    {"id": 2, "name": "Nashik",       "tier": "A", "base_revenue": 128000},
    {"id": 3, "name": "Thane",        "tier": "A", "base_revenue": 130000},
    {"id": 4, "name": "Nagpur",       "tier": "B", "base_revenue": 105000},
    {"id": 5, "name": "Kolhapur",     "tier": "B", "base_revenue": 95000},
    {"id": 6, "name": "Mumbai Andheri","tier": "B", "base_revenue": 88000},
    {"id": 7, "name": "Solapur",      "tier": "C", "base_revenue": 72000},
    {"id": 8, "name": "Aurangabad",   "tier": "C", "base_revenue": 55000},
]

CATEGORIES = ["Food & Beverage", "Dairy", "Snacks", "Beverages", "Bakery", "Condiments"]

np.random.seed(42)
random.seed(42)


def generate_sales_dataset(n_months: int = 24) -> pd.DataFrame:
    """
    Generates daily sales records for all outlets over n_months.
    Features: outlet_id, day_of_week, week_of_year, month, is_weekend,
              is_campaign_week, tier_encoded, lag_revenue_7, lag_revenue_14,
              rolling_mean_4w → target: next_month_revenue
    """
    rows = []
    start_date = datetime(2023, 1, 1)
    end_date = start_date + timedelta(days=n_months * 30)

    for outlet in OUTLETS:
        current_date = start_date
        prev_revenues = []
        tier_enc = {"A": 3, "B": 2, "C": 1}[outlet["tier"]]

        while current_date < end_date:
            dow = current_date.weekday()
            is_weekend = 1 if dow >= 5 else 0
            week = current_date.isocalendar()[1]
            month = current_date.month
            is_campaign = 1 if (week % 4 == 0) else 0

            # Seasonal multipliers
            seasonal = 1.0 + 0.15 * np.sin(2 * np.pi * month / 12)
            weekend_boost = 1.15 if is_weekend else 1.0
            campaign_boost = 1.08 if is_campaign else 1.0
            noise = np.random.normal(1.0, 0.07)

            daily_revenue = (
                outlet["base_revenue"] / 30
                * seasonal * weekend_boost * campaign_boost * noise
            )
            daily_revenue = max(0, round(daily_revenue, 2))
            prev_revenues.append(daily_revenue)

            lag7  = np.mean(prev_revenues[-7:])  if len(prev_revenues) >= 7  else daily_revenue
            lag14 = np.mean(prev_revenues[-14:]) if len(prev_revenues) >= 14 else daily_revenue
            roll4 = np.mean(prev_revenues[-28:]) if len(prev_revenues) >= 28 else daily_revenue

            rows.append({
                "outlet_id":       outlet["id"],
                "outlet_name":     outlet["name"],
                "tier_encoded":    tier_enc,
                "date":            current_date.strftime("%Y-%m-%d"),
                "day_of_week":     dow,
                "week_of_year":    week,
                "month":           month,
                "is_weekend":      is_weekend,
                "is_campaign":     is_campaign,
                "lag_revenue_7":   round(lag7, 2),
                "lag_revenue_14":  round(lag14, 2),
                "rolling_mean_4w": round(roll4, 2),
                "daily_revenue":   daily_revenue,
            })
            current_date += timedelta(days=1)

    df = pd.DataFrame(rows)

    # Monthly aggregation for regression target
    df["year_month"] = df["date"].str[:7]
    monthly = (
        df.groupby(["outlet_id", "outlet_name", "tier_encoded", "year_month"])
        .agg(
            month=("month", "first"),
            avg_dow=("day_of_week", "mean"),
            avg_weekend=("is_weekend", "mean"),
            avg_campaign=("is_campaign", "mean"),
            avg_lag7=("lag_revenue_7", "mean"),
            avg_lag14=("lag_revenue_14", "mean"),
            avg_roll4w=("rolling_mean_4w", "mean"),
            monthly_revenue=("daily_revenue", "sum"),
        )
        .reset_index()
    )
    monthly["next_month_revenue"] = monthly.groupby("outlet_id")["monthly_revenue"].shift(-1)
    monthly = monthly.dropna(subset=["next_month_revenue"])

    # Demand label (High / Medium / Low)
    q33 = monthly["next_month_revenue"].quantile(0.33)
    q66 = monthly["next_month_revenue"].quantile(0.66)
    monthly["demand_label"] = monthly["next_month_revenue"].apply(
        lambda x: 2 if x >= q66 else (1 if x >= q33 else 0)
    )

    return monthly


def generate_inventory_dataset(n_months: int = 24) -> pd.DataFrame:
    """
    Generates inventory movement records to train reorder prediction.
    """
    rows = []
    for outlet in OUTLETS:
        for cat in CATEGORIES:
            for month in range(1, n_months + 1):
                tier_enc = {"A": 3, "B": 2, "C": 1}[outlet["tier"]]
                base_consumption = outlet["base_revenue"] / 30 / 500
                seasonal = 1.0 + 0.1 * np.sin(2 * np.pi * month / 12)
                consumption_rate = base_consumption * seasonal * np.random.normal(1.0, 0.1)
                lead_days = random.randint(3, 7)
                safety_buffer = round(consumption_rate * 3, 2)
                reorder_qty = round((consumption_rate * lead_days) + safety_buffer, 2)

                rows.append({
                    "outlet_id":        outlet["id"],
                    "tier_encoded":     tier_enc,
                    "category":         cat,
                    "month":            month,
                    "consumption_rate": round(consumption_rate, 4),
                    "lead_days":        lead_days,
                    "safety_buffer":    safety_buffer,
                    "reorder_qty":      reorder_qty,
                })

    return pd.DataFrame(rows)


if __name__ == "__main__":
    sales_df = generate_sales_dataset()
    inv_df   = generate_inventory_dataset()
    sales_df.to_csv("data/sales_dataset.csv", index=False)
    inv_df.to_csv("data/inventory_dataset.csv", index=False)
    print(f"✅ Sales dataset: {len(sales_df)} rows")
    print(f"✅ Inventory dataset: {len(inv_df)} rows")
    print(sales_df.head(3).to_string())

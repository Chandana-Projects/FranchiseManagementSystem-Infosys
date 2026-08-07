# FranchiseOpsAI ML Microservice

A Python FastAPI service providing real ML-powered predictions for the franchise system.

## 🚀 Quick Start (Windows)

```powershell
cd d:\info\FranchiseManagementSystem\ml_service
powershell -ExecutionPolicy Bypass -File start.ps1
```

The script will automatically:
1. Create a Python virtual environment
2. Install all dependencies
3. Train the ML models (first run ~30 seconds)
4. Start the server at **http://localhost:8000**

## 📡 Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/ml/health` | Health check & model status |
| `POST` | `/ml/predict/revenue` | Next month revenue (XGBoost) |
| `POST` | `/ml/predict/demand` | Demand level: High/Med/Low (RandomForest) |
| `POST` | `/ml/predict/reorder` | Reorder quantity (Ridge Regression) |
| `POST` | `/ml/predict/batch` | Batch revenue + demand for all outlets |

## 📖 API Docs

When running, visit: http://localhost:8000/docs

## 🧠 Models

| Model | Algorithm | Training Data | Purpose |
|-------|-----------|--------------|---------|
| `revenue_model.joblib` | XGBoost Regressor | 24 months synthetic sales | Predict next month revenue |
| `demand_model.joblib` | RandomForest Classifier | 24 months synthetic sales | High/Medium/Low demand |
| `reorder_model.joblib` | Ridge Regression | 24 months inventory data | Recommended reorder units |

## 🔒 Safety

- Express backend calls this with a **2-second timeout**
- If this service is down, Express returns the **original rule-based response unchanged**
- Frontend silently hides ML cards when predictions are unavailable

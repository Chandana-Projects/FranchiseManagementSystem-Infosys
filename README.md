# FranchiseOpsAI — High-Resilience AI Franchise Management Portal

FranchiseOpsAI is a robust, multi-service enterprise platform designed for monitoring franchise outlet performance, running predictive machine learning simulations, tracking live sales register events, and auditing compliance.

---

## 🛠️ Architecture & Services

The platform is structured as a decoupled microservice stack:

1. **Frontend (`/frontend`):** A Next.js Web App featuring a dashboard with real-time SSE data charts, custom styling accent controls, glassmorphic layout configurations, an interactive audit panel, and a sliding AI strategic copilot.
2. **Backend Orchestrator (`/backend`):** A Node.js Express service managing API routing, live POS register simulations, anomaly detection broadcasts via Server-Sent Events (SSE), and fallback mappings.
3. **ML Microservice (`/ml_service`):** A Python FastAPI server hosting scikit-learn and XGBoost pipelines for time-series forecasting, store category classification, and transaction anomaly scoring.
4. **Database Storage:** Prisma ORM connected to PostgreSQL, equipped with a static JSON data fallback in case the database server goes offline.

---

## 🚀 Key Features

* **🔬 What-If ML Simulation Sandbox:** Test discount rates and marketing spends to predict monthly revenue changes via machine learning regression models.
* **📡 Real-Time POS & Anomaly Ticker:** Express POS simulator continuously broadcasts register sales to clients. Active streams pass through an **Isolation Forest** anomaly model, instantly flashing alerts for irregular transaction spikes or drops.
* **⚙️ MLOps Console:** View gauges for Mean Absolute Error (MAE), feature importances, and trigger asynchronous training loops from the UI console.
* **🤖 Gemini AI Analyst Copilot:** Configure Gemini API keys to load context-aware Strategic SWOT recommendations inside the dashboard chat panel.
* **💾 Fault-Tolerant Resiliency:** Manually toggle mock database outages in settings to verify the system falls back onto local JSON file storage.

---

## 🐳 Docker Deployment

The entire stack can be launched via Docker Compose:

```bash
# Build and run the entire multi-service suite
docker-compose up --build
```

This starts:
* PostgreSQL on port `5432`
* Python ML microservice on port `8000`
* Express backend API on port `5000`
* Next.js web client on port `3000`

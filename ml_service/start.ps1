# FranchiseOpsAI ML Service — Windows PowerShell Launcher
# Run this script from: d:\info\FranchiseManagementSystem\ml_service\

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "🤖 FranchiseOpsAI ML Service Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# 1. Create virtual environment if not exists
if (-not (Test-Path "venv")) {
    Write-Host "`n📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "   ✅ venv created" -ForegroundColor Green
} else {
    Write-Host "`n📦 Using existing venv" -ForegroundColor Green
}

# 2. Activate venv
$activate = Join-Path $ScriptDir "venv\Scripts\Activate.ps1"
. $activate

# 3. Install dependencies
Write-Host "`n📥 Installing dependencies from requirements.txt..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet
Write-Host "   ✅ Dependencies installed" -ForegroundColor Green

# 4. Train models if not already trained
$modelFile = Join-Path $ScriptDir "models\saved\revenue_model.joblib"
if (-not (Test-Path $modelFile)) {
    Write-Host "`n[*] Training ML models (first time, takes ~30 seconds)..." -ForegroundColor Yellow
    $env:PYTHONIOENCODING = "utf-8"
    python models/trainer.py
    Write-Host "   [OK] Models trained and saved" -ForegroundColor Green
} else {
    Write-Host "`n[OK] ML models already trained -- skipping training" -ForegroundColor Green
}

# 5. Start FastAPI server
Write-Host "`n🚀 Starting ML microservice on http://localhost:8000 ..." -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Gray
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

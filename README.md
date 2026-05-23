<div align="center">

<br/>

```
██████╗ ██╗   ██╗██╗     ███████╗███████╗██╗  ██╗██╗███╗   ██╗
██╔══██╗██║   ██║██║     ██╔════╝██╔════╝██║ ██╔╝██║████╗  ██║
██████╔╝██║   ██║██║     ███████╗█████╗  █████╔╝ ██║██╔██╗ ██║
██╔═══╝ ██║   ██║██║     ╚════██║██╔══╝  ██╔═██╗ ██║██║╚██╗██║
██║     ╚██████╔╝███████╗███████║███████╗██║  ██╗██║██║ ╚████║
╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
```

### 🏥 Privacy-Preserving · Federated · AI-Powered Healthcare

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Flask](https://img.shields.io/badge/Flask-Backend-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-DNN-EE4C2C?style=for-the-badge&logo=pytorch)](https://pytorch.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-ML-189AB4?style=for-the-badge)](https://xgboost.readthedocs.io/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.1-F55036?style=for-the-badge)](https://groq.com/)

<br/>

[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![Railway](https://img.shields.io/badge/Backends_on-Railway-6441A4?style=flat-square&logo=railway)](https://railway.app/)
[![Docker](https://img.shields.io/badge/Containerized-Docker-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🌟 What is PulseKin?

**PulseKin** is a premium, privacy-first, federated AI healthcare platform that brings together **patients**, **doctors**, and **administrators** under one intelligent, beautiful interface. Powered by cutting-edge machine learning and real-time AI, PulseKin delivers explainable diagnoses, conversational intake assistance, and zero-compromise data privacy — all in one seamless experience.

> *"Healthcare intelligence that respects your privacy."*

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    🌐 Vercel Frontend                            │
│                    Next.js 16  ·  React 19  ·  TypeScript        │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌─────────────────────┐      ┌──────────────────────┐
│  🚀 FastAPI Backend  │      │  🧪 Flask Backend     │
│   Railway Service 1  │      │   Railway Service 2   │
│                     │      │                       │
│  ├─ XGBoost Models  │      │  ├─ Groq Llama 3.1    │
│  ├─ SHAP Explainer  │      │  ├─ PyTorch DNN       │
│  └─ Disease Risk    │      │  ├─ JWT Auth          │
│     Prediction      │      │  ├─ ReportLab PDF     │
└─────────────────────┘      │  └─ Vision OCR        │
                             └──────────────────────┘
```

The monorepo is split into three services:

| Service | Directory | Responsibility |
|---------|-----------|---------------|
| **Frontend** | `/` (root) | Next.js 16 dashboards for Patient, Doctor & Admin |
| **FastAPI Backend** | `/backend` | XGBoost ML models + SHAP explainability engine |
| **Flask Backend** | `/backend1` | AI intake chat, JWT auth, PDF generator, PyTorch DNN |

---

## ✨ Feature Highlights

### 🎨 Premium UI Experience
- Autoplaying background video with **glassmorphic layouts**
- Silky smooth **micro-animations** throughout all dashboards
- Three fully-featured portals: **Patient · Doctor · Admin**

### 🤖 AppointReady AI Intake Assistant
- Conversational terminal powered by **Groq `llama-3.1-8b-instant`**
- Collects chief complaints, symptom duration, severity & medications
- **Prescription Vision OCR** — uploads parsed into structured medicine arrays
- Auto-generates polished **clinical intake PDFs** via ReportLab
- Smart rule-based fallback if API rate limits are hit

### 🧠 Explainable Machine Learning
- **XGBoost classifiers** trained on 4 clinical datasets — Diabetes, Heart Disease, Kidney Disease, Liver Disease
- Training pipeline uses SMOTE balancing + stratified cross-validation + median imputation
- **True SHAP explanations** via `shap.TreeExplainer` — see exactly which biomarkers drive each prediction
- **PyTorch DNN** — 4-layer deep neural network predicting risk from 8 biomarkers with gradient-based attribution

### 🔐 Privacy-First by Design
- ✅ **Zero patient data leakage** — OCR uploads saved as random UUIDs, deleted immediately after analysis
- ✅ **PII Redaction** — raw OCR text never returned to the frontend
- ✅ **In-memory processing** — sensitive data never persists

### 🔔 Web Audio Notification System
- Native browser **Web Audio API** synthesizes dual-frequency alerts (D5 → A5 ramp)
- Zero external audio assets required — fully client-side

---

## 🛠️ Technology Stack

<div align="center">

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS 4.2 · Recharts · Lucide React |
| **FastAPI Backend** | FastAPI · Uvicorn · Scikit-Learn · XGBoost · SHAP · PyMuPDF · Pytesseract · Pillow |
| **Flask Backend** | Flask · Flask-CORS · PyJWT · Groq SDK · ReportLab · PyTorch · NumPy · Pdfplumber |
| **Infrastructure** | Vercel · Railway · Docker · GitHub CI/CD |

</div>

---

## 🚀 Getting Started Locally

### Prerequisites

Before you begin, make sure you have:

- **Node.js** v18+ and `npm` / `pnpm`
- **Python** 3.10+
- **Tesseract OCR** — for vision & prescription parsing
- **Poppler** — for PDF-to-image rendering

---

### Step 1 — Frontend

```bash
# From the repository root
npm install

# Configure environment
cp .env.example .env.local
```

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FLASK_API_URL=http://localhost:5000
```

```bash
npm run dev
# → http://localhost:3000
```

---

### Step 2 — FastAPI Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train ML models (Diabetes, Heart, Kidney, Liver)
python -m app.models.train_all_models

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000
# → http://localhost:8000
```

---

### Step 3 — Flask Backend

```bash
cd ../backend1

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create `.env` in `/backend1`:
```env
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=pulsekin_hackathon_secret
FLASK_PORT=5000
```

```bash
python api.py
# → http://localhost:5000
```

---

## 📦 Deployment Guide

### 🚂 Railway — Backend Microservices

Both backends ship with custom `Dockerfile`s that handle system-level installs (`tesseract-ocr`, `poppler-utils`, `libgomp1`).

**Deploy FastAPI Backend:**
1. Create a Railway service linked to this repo
2. Set root directory → `/backend`
3. Expose port `8000`

**Deploy Flask Backend:**
1. Create a second Railway service (same repo)
2. Set root directory → `/backend1`
3. Add environment variables:
   - `GROQ_API_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your Vercel URL)
   - `FLASK_PORT=5000`

---

### ▲ Vercel — Next.js Frontend

1. Import this repository in Vercel
2. Set root directory → `./`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` — Railway FastAPI URL
   - `NEXT_PUBLIC_FLASK_API_URL` — Railway Flask URL
4. Click **Deploy** 🚀

---

## 🔒 Security & CORS

- **FastAPI**: Wildcard origin setup by default (update `ALLOWED_ORIGINS` in `backend/app/main.py` for production)
- **Flask**: Automatically whitelists the `FRONTEND_URL` environment variable for secure cross-origin requests

---

## 👥 Team

<div align="center">

Built with ❤️ by

| | Name |
|--|------|
| 🧑‍💻 | **Nisha Sinha** |
| 🧑‍💻 | **Koushik Deb** |
| 🧑‍💻 | **Khushi Hatimuria** |

</div>

---

<div align="center">

**PulseKin** — *Where AI meets compassionate care.*

⭐ Star this repo if you find it useful!

</div>

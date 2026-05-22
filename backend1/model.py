# backend/model.py
import torch
import torch.nn as nn
import numpy as np

class DiseaseRiskDNN(nn.Module):
    """4-layer DNN: 8 biomarkers → risk probability 0-1"""
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(8, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )
    def forward(self, x):
        return self.net(x)

_model = None

def get_model():
    global _model
    if _model is None:
        _model = DiseaseRiskDNN()
        _model.eval()
    return _model

def predict(biomarkers: dict) -> dict:
    """
    Input: dict with keys: creatinine, bp_systolic, egfr, hemoglobin, sodium, glucose, bmi, age
    Output: dict with risk_score, risk_label, health_signal, shap_values, shap_narrative, next_steps
    """
    model = get_model()

    feature_order = ['creatinine', 'bp_systolic', 'egfr', 'hemoglobin', 'sodium', 'glucose', 'bmi', 'age']
    feature_ranges = {
        'creatinine':  (0.5, 5.0),
        'bp_systolic': (90, 200),
        'egfr':        (10, 120),
        'hemoglobin':  (6.0, 18.0),
        'sodium':      (125, 150),
        'glucose':     (60, 400),
        'bmi':         (15, 50),
        'age':         (18, 90)
    }

    features = []
    for key in feature_order:
        val = biomarkers.get(key, 0)
        lo, hi = feature_ranges[key]
        normalized = (float(val) - lo) / (hi - lo)
        normalized = max(0.0, min(1.0, normalized))
        features.append(normalized)

    x = torch.tensor([features], dtype=torch.float32)

    with torch.no_grad():
        raw_score = model(x).item()

    # Compute SHAP-like feature attributions (simplified gradient-based)
    x_shap = torch.tensor([features], dtype=torch.float32, requires_grad=True)
    output = model(x_shap)
    output.backward()
    grads = x_shap.grad[0].numpy()

    shap_values = {}
    for i, key in enumerate(feature_order):
        shap_values[key] = round(float(grads[i] * features[i]), 4)

    # Risk classification
    if raw_score >= 0.7:
        risk_label = "High Risk"
        health_signal = "Needs Attention"
        health_signal_message = "Your health needs some attention. Please consult a specialist soon."
        next_steps = ["Book a kidney specialist", "Retest in 2 weeks", "Reduce salt and sugar intake"]
    elif raw_score >= 0.4:
        risk_label = "Moderate Risk"
        health_signal = "Worth Watching"
        health_signal_message = "A few things are worth keeping an eye on. Small lifestyle changes can help."
        next_steps = ["Schedule a routine checkup", "Monitor blood pressure daily", "Increase water intake"]
    else:
        risk_label = "Low Risk"
        health_signal = "Doing Great"
        health_signal_message = "Your health signals look good! Keep up the healthy habits."
        next_steps = ["Continue regular checkups", "Maintain healthy diet", "Stay active"]

    sorted_shap = sorted(shap_values.items(), key=lambda x: abs(x[1]), reverse=True)
    top1, top2 = sorted_shap[0], sorted_shap[1]
    shap_narrative = f"Your {top1[0].replace('_', ' ')} levels and {top2[0].replace('_', ' ')} were the main signals driving this result."

    return {
        "risk_score": round(raw_score, 3),
        "risk_label": risk_label,
        "health_signal": health_signal,
        "health_signal_message": health_signal_message,
        "next_steps": next_steps,
        "shap_values": shap_values,
        "shap_narrative": shap_narrative
    }


def get_bias_metrics() -> dict:
    """Returns fairness audit metrics (simulated for hackathon)"""
    return {
        "demographic_parity": 0.03,
        "equal_opportunity": 0.04,
        "calibration_error": 0.02,
        "thresholds": {
            "demographic_parity": 0.05,
            "equal_opportunity": 0.05,
            "calibration_error": 0.05
        },
        "all_pass": True
    }

# backend/store.py
"""In-memory data store for hackathon demo. Resets on restart."""
import uuid
from datetime import datetime, timezone

patients = {}
doctors = {}
reports = {}
hospital_nodes = []
appoint_ready_sessions = {}

def seed_demo_data():
    """Seed store with demo data on startup."""
    global patients, doctors, reports, hospital_nodes

    demo_patients = [
        {
            "patient_id": "DEMO_P001",
            "anonymous_id": "A0047",
            "email_hash": "hash_patient1",
            "risk_score": 0.84,
            "risk_label": "High Risk",
            "health_signal": "Needs Attention",
            "biomarkers": {
                "creatinine": 1.8, "bp_systolic": 142, "egfr": 42.0,
                "hemoglobin": 10.2, "sodium": 138.0, "glucose": 126.0,
                "bmi": 28.4, "age_score": 0.65
            },
            "shap_values": {
                "creatinine": 0.23, "bp_systolic": 0.18, "egfr": -0.31,
                "hemoglobin": -0.12, "sodium": 0.04, "glucose": 0.15,
                "bmi": 0.09, "age_score": 0.11
            },
            "vitals_timeline": [
                {"date": "Jan 10", "egfr": 48, "creatinine": 1.5, "bp": 138},
                {"date": "Jan 11", "egfr": 45, "creatinine": 1.6, "bp": 140},
                {"date": "Jan 12", "egfr": 42, "creatinine": 1.8, "bp": 142}
            ],
            "report_ids": [], "scan_ids": [],
            "shared_with_doctor": True,
            "condition": "CKD Risk",
            "created_at": "2024-01-15T10:30:00Z",
            "submitted_at": "2024-01-15T10:30:00Z",
            "status": "Pending Review",
            "recommended_actions": [
                "Consider ACE inhibitor titration",
                "Schedule nephrology consult within 2 weeks",
                "Repeat eGFR in 3 months"
            ],
            "shap_narrative_clinical": "Primary risk drivers: declining eGFR (−0.31), elevated creatinine (+0.23), high BP (+0.18). Consider renal-protective interventions."
        },
        {
            "patient_id": "DEMO_P002",
            "anonymous_id": "A0048",
            "email_hash": "hash_patient2",
            "risk_score": 0.42,
            "risk_label": "Moderate Risk",
            "health_signal": "Needs Review",
            "biomarkers": {
                "creatinine": 1.3, "bp_systolic": 135, "egfr": 58.0,
                "hemoglobin": 12.1, "sodium": 140.0, "glucose": 115.0,
                "bmi": 26.1, "age_score": 0.55
            },
            "shap_values": {
                "creatinine": 0.12, "bp_systolic": 0.10, "egfr": -0.15,
                "hemoglobin": -0.05, "sodium": 0.02, "glucose": 0.08,
                "bmi": 0.06, "age_score": 0.07
            },
            "vitals_timeline": [
                {"date": "Jan 10", "egfr": 62, "creatinine": 1.2, "bp": 132},
                {"date": "Jan 11", "egfr": 60, "creatinine": 1.2, "bp": 134},
                {"date": "Jan 12", "egfr": 58, "creatinine": 1.3, "bp": 135}
            ],
            "report_ids": [], "scan_ids": [],
            "shared_with_doctor": True,
            "condition": "Borderline CKD",
            "created_at": "2024-01-14T08:15:00Z",
            "submitted_at": "2024-01-14T08:15:00Z",
            "status": "Under Review",
            "recommended_actions": [
                "Monitor blood pressure weekly",
                "Dietary sodium restriction",
                "Follow-up labs in 6 months"
            ],
            "shap_narrative_clinical": "Moderate risk profile. eGFR trending downward (−0.15), mild creatinine elevation (+0.12). Lifestyle modifications recommended."
        },
        {
            "patient_id": "DEMO_P003",
            "anonymous_id": "A0049",
            "email_hash": "hash_patient3",
            "risk_score": 0.15,
            "risk_label": "Low Risk",
            "health_signal": "Doing Great",
            "biomarkers": {
                "creatinine": 0.9, "bp_systolic": 118, "egfr": 92.0,
                "hemoglobin": 14.5, "sodium": 141.0, "glucose": 95.0,
                "bmi": 22.0, "age_score": 0.35
            },
            "shap_values": {
                "creatinine": -0.05, "bp_systolic": -0.03, "egfr": 0.08,
                "hemoglobin": 0.04, "sodium": 0.01, "glucose": -0.02,
                "bmi": -0.03, "age_score": -0.02
            },
            "vitals_timeline": [
                {"date": "Jan 10", "egfr": 93, "creatinine": 0.9, "bp": 116},
                {"date": "Jan 11", "egfr": 92, "creatinine": 0.9, "bp": 118},
                {"date": "Jan 12", "egfr": 92, "creatinine": 0.9, "bp": 118}
            ],
            "report_ids": [], "scan_ids": [],
            "shared_with_doctor": True,
            "condition": "Routine Screening",
            "created_at": "2024-01-14T14:00:00Z",
            "submitted_at": "2024-01-14T14:00:00Z",
            "status": "Reviewed",
            "recommended_actions": [
                "Continue annual screening",
                "Maintain current healthy lifestyle",
                "No immediate intervention required"
            ],
            "shap_narrative_clinical": "All biomarkers within normal limits. Low disease risk. Routine follow-up sufficient."
        }
    ]

    for p in demo_patients:
        patients[p["patient_id"]] = p

    # Seed hospital nodes (status only - no patient counts)
    hospital_nodes.extend([
        {"id": "APOLLO_CHENNAI",    "name": "Apollo Chennai",    "status": "online",  "lat": 13.0827, "lng": 80.2707, "last_sync": "2024-01-15T10:29:00Z", "local_accuracy": 0.89},
        {"id": "AIIMS_DELHI",       "name": "AIIMS Delhi",       "status": "online",  "lat": 28.5672, "lng": 77.2100, "last_sync": "2024-01-15T10:29:00Z", "local_accuracy": 0.87},
        {"id": "MANIPAL_BENGALURU", "name": "Manipal Bengaluru", "status": "syncing", "lat": 12.9716, "lng": 77.5946, "last_sync": "2024-01-15T10:28:00Z", "local_accuracy": 0.88},
        {"id": "FORTIS_MUMBAI",     "name": "Fortis Mumbai",     "status": "online",  "lat": 19.0760, "lng": 72.8777, "last_sync": "2024-01-15T10:29:00Z", "local_accuracy": 0.90},
        {"id": "MAX_HYDERABAD",     "name": "Max Hyderabad",     "status": "online",  "lat": 17.3850, "lng": 78.4867, "last_sync": "2024-01-15T10:29:00Z", "local_accuracy": 0.86},
        {"id": "PGI_CHANDIGARH",    "name": "PGI Chandigarh",   "status": "offline", "lat": 30.7333, "lng": 76.7794, "last_sync": "2024-01-15T09:15:00Z", "local_accuracy": 0.83},
    ])

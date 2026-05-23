# backend/api.py
import fitz
from groq import Groq
import os, uuid, hashlib, json, io, re, base64, traceback    
import pdfplumber
from datetime import datetime, timezone, timedelta
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
# pyrefly: ignore [missing-import]
import jwt
from dotenv import load_dotenv
from store import patients, doctors, reports, hospital_nodes, seed_demo_data, appoint_ready_sessions
from model import predict, get_bias_metrics
from groq_ai import process_appoint_ready_chat
from pdf_generator import generate_intake_pdf
import pytesseract  # OCR for images
from pdf2image import convert_from_path  # PDF to image

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
print("API FILE EXECUTING")

app = Flask(__name__)
# Enable CORS for Next.js local development and deployed frontend
frontend_origins = ["http://localhost:3000", "http://localhost:3001"]
prod_origin = os.getenv("FRONTEND_URL")
if prod_origin:
    frontend_origins.append(prod_origin)
    frontend_origins.append(prod_origin.rstrip("/"))
CORS(app, origins=frontend_origins)

JWT_SECRET = os.getenv("JWT_SECRET", "pulsekin_hackathon_secret")
JWT_EXPIRY_HOURS = 24

DEMO_CREDENTIALS = {
    "patient": {"email": "patient@demo.com", "password": "demo123"},
    "doctor":  {"hospital_id": "APOLLO_CHENNAI", "doctor_id": "DR_001", "password": "demo123"},
    "admin":   {"username": "tech_admin", "access_key": "PULSEKIN_2024"}
}

# ─── Helpers ──────────────────────────────────────────────────────────────────

def make_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        return None

def require_role(*allowed_roles):
    """Decorator: checks Bearer JWT and role."""
    def decorator(fn):
        def wrapper(*args, **kwargs):
            auth = request.headers.get("Authorization", "")
            token = auth.replace("Bearer ", "") if auth.startswith("Bearer ") else ""
            payload = decode_token(token)
            if not payload:
                return jsonify({"error": "Invalid or missing token", "code": "UNAUTHORIZED"}), 401
            if payload.get("role") not in allowed_roles:
                return jsonify({"error": "Access denied for this role", "code": "FORBIDDEN"}), 403
            request.jwt_payload = payload
            return fn(*args, **kwargs)
        wrapper.__name__ = fn.__name__
        return wrapper
    return decorator

def error(msg: str, code: str, status: int):
    return jsonify({"error": msg, "code": code}), status

# ─── Auth ─────────────────────────────────────────────────────────────────────

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    role = data.get("role")
    app.logger.error(f"[DEBUG LOGIN] role={role}, data={data}")

    if role == "patient":
        email = data.get("email") or "patient@demo.com"
        user_id = "DEMO_PATIENT_001" if email == "patient@demo.com" else email
        token = make_token(user_id, "patient")
        return jsonify({"token": token, "role": "patient", "redirect": "/patient-dashboard"})

    elif role == "doctor":
        hospital_id = data.get("hospital_id")
        doctor_id = data.get("doctor_id") or data.get("license_id")
        password = data.get("password")
        
        is_valid = False
        if hospital_id == "APOLLO_CHENNAI" and doctor_id == "DR_001" and password == "demo123":
            is_valid = True
        elif hospital_id == "APL-HOSP-2045" and doctor_id == "DOC-KAR-8821" and password == "doctor123":
            is_valid = True
        elif hospital_id == "MAN-HOSP-8831" and doctor_id == "DOC-MUM-5512" and password == "doctor123":
            is_valid = True
            
        if is_valid:
            token = make_token(doctor_id, "doctor")
            return jsonify({"token": token, "role": "doctor", "redirect": "/doctor-dashboard"})

    elif role == "admin":
        creds = DEMO_CREDENTIALS["admin"]
        if (data.get("username") == creds["username"] and
            data.get("access_key") == creds["access_key"]):
            token = make_token("DEMO_ADMIN_001", "admin")
            return jsonify({"token": token, "role": "admin", "redirect": "/admin-dashboard"})

    return error("Invalid credentials", "UNAUTHORIZED", 401)

# ─── Patient Endpoints ────────────────────────────────────────────────────────

@app.route("/api/predict", methods=["POST"])
@require_role("patient")
def predict_risk():
    data = request.get_json() or {}
    required = ["creatinine", "bp_systolic", "egfr", "hemoglobin", "sodium", "glucose", "bmi", "age"]
    missing = [f for f in required if f not in data]
    if missing:
        return error(f"Missing fields: {missing}", "VALIDATION_ERROR", 400)

    result = predict(data)

    user_id = request.jwt_payload.get("sub")
    # Store or update in memory patient data
    # Create the patient entry if not exists
    if user_id not in patients:
        patients[user_id] = {
            "patient_id": user_id,
            "anonymous_id": "A0048", # default patient ID generated
            "email_hash": hashlib.sha256(user_id.encode()).hexdigest()[:12],
            "vitals_timeline": [
                {"date": "Jan 10", "egfr": 60, "creatinine": 1.2, "bp": 130},
                {"date": "Jan 11", "egfr": 59, "creatinine": 1.2, "bp": 132},
                {"date": "Jan 12", "egfr": int(data.get("egfr", 60)), "creatinine": float(data.get("creatinine", 1.2)), "bp": int(data.get("bp_systolic", 130))}
            ],
            "report_ids": [], "scan_ids": [],
            "shared_with_doctor": False,
            "condition": "Patient Requested Scan",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "submitted_at": datetime.now(timezone.utc).isoformat(),
            "status": "Pending Review",
            "recommended_actions": result["next_steps"]
        }

    patients[user_id]["risk_score"] = result["risk_score"]
    patients[user_id]["risk_label"] = result["risk_label"]
    patients[user_id]["health_signal"] = result["health_signal"]
    patients[user_id]["biomarkers"] = {
        "creatinine": float(data.get("creatinine")),
        "bp_systolic": int(data.get("bp_systolic")),
        "egfr": float(data.get("egfr")),
        "hemoglobin": float(data.get("hemoglobin")),
        "sodium": float(data.get("sodium")),
        "glucose": float(data.get("glucose")),
        "bmi": float(data.get("bmi")),
        "age_score": float(data.get("age")) / 100.0
    }
    patients[user_id]["shap_values"] = result["shap_values"]
    patients[user_id]["shap_narrative_clinical"] = f"Main risk drivers: {result['shap_narrative']}"

    return jsonify(result)

# ── Prescription Parsing with Groq AI ─────────────────────────────────────────

def extract_text_from_image(image_bytes: bytes) -> str:
    """Use Groq vision model to extract text from prescription image"""
    try:
        # Convert image to base64 for Groq vision API
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",  # Vision-capable model
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extract all text from this prescription image. Return ONLY the raw text content, no explanations."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.1,
            max_tokens=2048
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[OCR Error] {e}")
        traceback.print_exc()  # ✅ Now works because traceback is imported at top
        return ""

def parse_medicines_with_groq(prescription_text: str) -> list:
    """Use Groq to parse medicines from prescription text"""
    try:
        prompt = f"""You are a medical prescription parser. Analyze this prescription text and extract all medicines.

For EACH medicine found, provide this exact JSON structure:
{{
"name": "Medicine Name with strength (e.g., Metformin 500mg)",
"type": "Form (Tablet/Capsule/Syrup/Injection/etc)",
"composition": "Active ingredient and strength",
"dosage": "When to take (e.g., 1-0-1 after food, 0-0-1 before bed)",
"uses": ["What this medicine treats - be specific"],
"how_to_use": "Clear instructions on how to take this medicine",
"side_effects": ["Common side effect 1", "Common side effect 2", "Common side effect 3"],
"warnings": "Important warnings, interactions, or precautions"
}}

If a field cannot be determined from the text, use "Not specified in prescription" or make reasonable medical inference.

Prescription text:
{prescription_text}

Return ONLY valid JSON in this exact format:
{{"medicines": [{{...}}, {{...}}]}}
"""

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Fast, good at JSON
            messages=[
                {"role": "system", "content": "You are a precise medical prescription parser. Always return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=4096,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        medicines = result.get("medicines", [])
        
        # Validate structure
        required_fields = ["name", "type", "composition", "dosage", "uses", "how_to_use", "side_effects"]
        validated_medicines = []
        for med in medicines:
            if all(field in med for field in required_fields):
                validated_medicines.append(med)
        
        return validated_medicines if validated_medicines else []
        
    except Exception as e:
        print(f"[Groq Parse Error] {e}")
        traceback.print_exc()  # ✅ Now works because traceback is imported at top
        return []

@app.route("/api/upload-report", methods=["POST"])
@require_role("patient")
def upload_report():
    print("\n" + "="*60)
    print("[UPLOAD-REPORT] Endpoint hit")
    print("="*60)
    
    if "file" not in request.files:
        print("[ERROR] No file in request.files")
        return error("No file provided", "VALIDATION_ERROR", 400)

    file = request.files["file"]
    print(f"[FILE] Name: {file.filename}")
    print(f"[FILE] Content-Type: {file.content_type}")
    
    # Get the actual file extension
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "unknown"
    print(f"[FILE] Extension: {ext}")
    
    # Categorize for response
    file_type = "pdf" if ext == "pdf" else "image" if ext in ["png", "jpg", "jpeg"] else "docx"
    print(f"[FILE] Type category: {file_type}")

    # Read file bytes ONCE
    file_bytes = file.read()
    print(f"[FILE] Size: {len(file_bytes)} bytes")

    report_id = str(uuid.uuid4())
    print(f"[REPORT] ID: {report_id}")

    # ── Step 1: Extract text from prescription ──────────────────────────────
    prescription_text = ""
    
    # ✅ FIXED: Check the actual extension, not the category
    if ext in ["png", "jpg", "jpeg"]:
        print("[STEP 1] Image detected — calling Groq Vision...")
        try:
            prescription_text = extract_text_from_image(file_bytes)
            print(f"[STEP 1] Extracted text length: {len(prescription_text)}")
            print(f"[STEP 1] Text preview: {prescription_text[:200]}...")
        except Exception as e:
            print(f"[STEP 1 ERROR] {str(e)}")
            traceback.print_exc()
    elif ext == "pdf":
        print("[STEP 1] PDF detected — would need PDF processing")
        # TODO: Add PDF processing (pdf2image + OCR or pdfplumber)
    else:
        print(f"[STEP 1] Skipping OCR — unsupported file type: {ext}")

    # ── Step 2: Parse medicines with Groq ─────────────────────────────────
    medicines = []
    if prescription_text.strip():
        print("[STEP 2] Calling Groq to parse medicines...")
        try:
            medicines = parse_medicines_with_groq(prescription_text)
            print(f"[STEP 2] Parsed {len(medicines)} medicines")
            for i, med in enumerate(medicines):
                print(f"  Medicine {i+1}: {med.get('name', 'NO NAME')}")
        except Exception as e:
            print(f"[STEP 2 ERROR] {str(e)}")
            traceback.print_exc()
    else:
        print("[STEP 2] Skipped — no text extracted")

    # ── Step 3: Store and return ──────────────────────────────────────────
    reports[report_id] = {
        "report_id": report_id,
        "patient_id": request.jwt_payload.get("sub"),
        "file_type": file_type,
        "raw_text": prescription_text,
        "medicines": medicines,
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }

    print(f"[RESPONSE] Returning {len(medicines)} medicines")
    print("="*60 + "\n")

    return jsonify({
        "report_id": report_id,
        "medicines": medicines,
        "file_type": file_type,
        "extracted_text_preview": prescription_text[:200] + "..." if len(prescription_text) > 200 else prescription_text
    }), 201
#------upload scan ------
@app.route("/api/upload-scan", methods=["POST"])
@require_role("patient")
def upload_scan():
    if "file" not in request.files:
        return error("No file provided", "VALIDATION_ERROR", 400)

    scan_id = str(uuid.uuid4())
    return jsonify({
        "scan_id": scan_id,
        "medgemma_output_patient": "The scan shows some mild changes in your kidney area. These are early-stage changes that your doctor will want to keep an eye on. There is no need to panic — catching this early is a good thing.",
        "medgemma_output_doctor": "Renal cortical thinning noted bilaterally. Corticomedullary differentiation reduced. Findings consistent with CKD Stage 2-3 progression. Recommend nephrology referral and repeat imaging in 6 months."
    }), 201

@app.route("/api/share-report", methods=["POST"])
@require_role("patient")
def share_report():
    user_id = request.jwt_payload.get("sub")

    if user_id in patients:
        patients[user_id]["shared_with_doctor"] = True
        return jsonify({"status": "shared", "anonymous_id": patients[user_id]["anonymous_id"]})

    # Default fallback seeding
    fallback_id = "DEMO_P001"
    patients[fallback_id]["shared_with_doctor"] = True
    return jsonify({"status": "shared", "anonymous_id": patients[fallback_id]["anonymous_id"]})

# ─── Doctor Endpoints ─────────────────────────────────────────────────────────

@app.route("/api/patient-queue", methods=["GET"])
@require_role("doctor")
def patient_queue():
    queue = []
    for pid, p in patients.items():
        if p.get("shared_with_doctor"):
            queue.append({
                "anonymous_id": p["anonymous_id"],
                "condition": p.get("condition", "General Review"),
                "risk_score": p["risk_score"],
                "risk_label": p["risk_label"],
                "submitted_at": p.get("submitted_at", p["created_at"]),
                "status": p.get("status", "Pending Review"),
                "is_intake": p.get("is_intake", False)
            })
    queue.sort(key=lambda x: x["risk_score"], reverse=True)
    return jsonify({"patients": queue})

@app.route("/api/patient/<anonymous_id>", methods=["GET"])
@require_role("doctor")
def get_patient(anonymous_id):
    for pid, p in patients.items():
        if p["anonymous_id"] == anonymous_id and p.get("shared_with_doctor"):
            return jsonify({
                "anonymous_id": p["anonymous_id"],
                "condition": p.get("condition", "General Review"),
                "risk_score": p["risk_score"],
                "risk_label": p["risk_label"],
                "biomarkers": p["biomarkers"],
                "shap_values": p["shap_values"],
                "shap_narrative_clinical": p.get("shap_narrative_clinical", ""),
                "vitals_timeline": p.get("vitals_timeline", []),
                "reports": [],
                "recommended_actions": p.get("recommended_actions", []),
                "is_intake": p.get("is_intake", False),
                "intake_data": p.get("intake_data", {})
            })
    return error("Patient not found", "NOT_FOUND", 404)

@app.route("/api/consult-request", methods=["POST"])
@require_role("doctor")
def consult_request():
    data = request.get_json() or {}
    required = ["from_hospital", "to_hospital", "specialty", "patient_anonymous_id"]
    missing = [f for f in required if f not in data]
    if missing:
        return error(f"Missing fields: {missing}", "VALIDATION_ERROR", 400)

    return jsonify({
        "request_id": str(uuid.uuid4()),
        "status": "sent",
        "estimated_response": "2h"
    })

# ─── Admin / Technician Endpoints ─────────────────────────────────────────────

@app.route("/api/hospitals", methods=["GET"])
@require_role("admin")
def get_hospitals():
    return jsonify({"hospitals": hospital_nodes})

@app.route("/api/model-metrics", methods=["GET"])
@require_role("admin")
def model_metrics():
    """Returns global AI model performance metrics."""
    return jsonify({
        "accuracy": 0.913,
        "f1_score": 0.89,
        "roc_auc": 0.94,
        "active_nodes": 5,
        "total_nodes": 6,
        "model_version": "v2.1.0",
        "last_updated": "2024-01-15T10:30:00Z"
    })

@app.route("/api/bias-audit", methods=["GET"])
@require_role("admin")
def bias_audit():
    metrics = get_bias_metrics()
    metrics["audit_timestamp"] = datetime.now(timezone.utc).isoformat()
    return jsonify(metrics)

# ─── AppointReady Helpers ─────────────────────────────────────────────────────

def extract_medical_context(message: str, context: dict) -> dict:
    """Lightweight regex-based extractor that fills empty medical_context fields
    from the user's message.  Only overwrites a field if it was previously empty
    so that earlier answers are preserved."""
    msg = message.lower()
    ctx = dict(context)  # shallow copy

    # ── primary_symptom ──
    if not ctx.get("primary_symptom"):
        symptom_patterns = [
            r"(?:i have|i'm having|i am having|experiencing|suffering from|feeling)\s+(?:a\s+)?(.+?)(?:\.|,|$)",
            r"(?:my)\s+(\w+(?:\s+\w+)?)\s+(?:hurts|aches|is\s+(?:sore|painful|swollen))",
        ]
        for pat in symptom_patterns:
            m = re.search(pat, msg)
            if m:
                ctx["primary_symptom"] = m.group(1).strip()[:80]
                break

    # ── duration ──
    if not ctx.get("duration"):
        dur = re.search(
            r"(\d+\s*(?:day|week|month|year|hour|minute)s?(?:\s+(?:ago|now|long))?)",
            msg,
        )
        if dur:
            ctx["duration"] = dur.group(1).strip()
        elif any(w in msg for w in ["since yesterday", "since last night", "since morning", "since today"]):
            for phrase in ["since yesterday", "since last night", "since morning", "since today"]:
                if phrase in msg:
                    ctx["duration"] = phrase
                    break

    # ── severity ──
    if not ctx.get("severity"):
        sev_map = {
            "mild": "mild", "slight": "mild", "minor": "mild", "a little": "mild",
            "moderate": "moderate", "medium": "moderate", "somewhat": "moderate",
            "severe": "severe", "intense": "severe", "extreme": "severe",
            "very bad": "severe", "unbearable": "severe", "terrible": "severe",
            "worst": "severe",
        }
        for keyword, level in sev_map.items():
            if keyword in msg:
                ctx["severity"] = level
                break
        # numeric scale  (e.g. "7 out of 10", "pain is 8")
        if not ctx.get("severity"):
            scale = re.search(r"(\d{1,2})\s*(?:/|out of)\s*10", msg)
            if scale:
                n = int(scale.group(1))
                ctx["severity"] = "mild" if n <= 3 else "moderate" if n <= 6 else "severe"

    # ── impact (how symptoms affect daily life) ──
    if not ctx.get("impact"):
        impact_kws = ["can't sleep", "cannot sleep", "hard to concentrate",
                    "affecting my work", "can't focus", "missing work",
                    "unable to eat", "lost appetite", "trouble walking"]
        found = [k for k in impact_kws if k in msg]
        if found:
            ctx["impact"] = ", ".join(found)

    # ── medications ──
    if not ctx.get("medications"):
        med = re.search(
            r"(?:taking|take|on|prescribed|using)\s+(.+?)(?:\.|,|for\s|and\s|$)", msg
        )
        if med and any(w in msg for w in ["medication", "medicine", "taking", "take", "prescribed", "drug", "pill", "tablet"]):
            ctx["medications"] = med.group(1).strip()[:120]
        elif "no medication" in msg or "not taking any" in msg or "no medicines" in msg:
            ctx["medications"] = "None reported"

    # ── hydration ──
    if not ctx.get("hydration"):
        hyd = re.search(r"(\d+)\s*(?:glass|cup|liter|litre|bottle)s?", msg)
        if hyd:
            ctx["hydration"] = hyd.group(0).strip()

    # ── existing_conditions ──
    if not ctx.get("existing_conditions"):
        conditions = ["diabetes", "hypertension", "asthma", "thyroid",
                    "heart disease", "kidney disease", "cancer", "arthritis",
                    "depression", "anxiety", "copd", "epilepsy"]
        found_conds = [c for c in conditions if c in msg]
        if found_conds:
            ctx["existing_conditions"] = ", ".join(found_conds)
        elif "no history" in msg or "no conditions" in msg or "no existing" in msg:
            ctx["existing_conditions"] = "None reported"

    # ── lifestyle_factors ──
    if not ctx.get("lifestyle_factors"):
        lifestyle_kws = ["smoke", "smoking", "alcohol", "drinking", "exercise",
                        "sedentary", "vegan", "vegetarian", "junk food",
                        "no exercise", "gym", "yoga", "running"]
        found_lf = [k for k in lifestyle_kws if k in msg]
        if found_lf:
            ctx["lifestyle_factors"] = ", ".join(found_lf)

    # ── previous_reports ──
    if not ctx.get("previous_reports"):
        if any(w in msg for w in ["blood test", "lab report", "scan", "x-ray",
                                "mri", "ct scan", "ultrasound", "ecg", "ekg"]):
            rep = re.search(r"(blood test|lab report|scan|x-ray|mri|ct scan|ultrasound|ecg|ekg).*?(?:\.|,|$)", msg)
            ctx["previous_reports"] = rep.group(0).strip()[:120] if rep else "Yes – details pending"
        elif "no report" in msg or "no test" in msg or "no scan" in msg:
            ctx["previous_reports"] = "None"

    return ctx

# ─── AppointReady Endpoints ───────────────────────────────────────────────────

@app.route("/api/appoint-ready/chat", methods=["POST"])
@require_role("patient")
def appoint_ready_chat():
    data = request.get_json() or {}
    session_id = data.get("session_id")
    message = data.get("message", "").strip()

    if not session_id:
        return error("session_id is required", "VALIDATION_ERROR", 400)
    if not message:
        return error("message cannot be empty", "VALIDATION_ERROR", 400)

    # Initialize session with answered question tracking
    if session_id not in appoint_ready_sessions:
        appoint_ready_sessions[session_id] = {
            "history": [],
            "structured_data": {
                "reply": "Hello! I am your AppointReady intake assistant. Let's gather your symptoms. What symptoms are you experiencing today?",
                "follow_up_question": "What symptoms are you experiencing today?",
                "summary": "",
                "specialist": "General Physician",
                "readiness_score": 10,
                "recommendations": [],
                "checklist": []
            },
            "shared": False,
            "answered_questions": [],
            "medical_context": {
                "primary_symptom": "",
                "duration": "",
                "severity": "",
                "impact": "",
                "medications": "",
                "hydration": "",
                "existing_conditions": "",
                "lifestyle_factors": "",
                "previous_reports": ""
            }
        }

    session = appoint_ready_sessions[session_id]

    # Extract and update medical context from the user's message
    session["medical_context"] = extract_medical_context(message, session["medical_context"])

    # Process using Groq service with context injection
    response_data = process_appoint_ready_chat(
        session_id, message, session["history"], session["medical_context"]
    )
    if response_data is None:
        response_data = {
            "reply": "I'm sorry, I had trouble processing that. Could you please rephrase?",
            "follow_up_question": "Can you describe your symptoms again?",
            "summary": session["structured_data"].get("summary", ""),
            "specialist": session["structured_data"].get("specialist", "General Physician"),
            "readiness_score": session["structured_data"].get("readiness_score", 10),
            "recommendations": session["structured_data"].get("recommendations", []),
            "checklist": session["structured_data"].get("checklist", [])
        }

    # ---------- Answered question tracking & deduplication ----------
    # Define question topics and default follow‑up questions
    QUESTION_TOPICS = {
        "stress": "stress",
        "sleep_quality": "sleep",
        "duration": "duration",
        "concentration": "concentration",
        "medications": "medication",
        "hydration": "water",
        "existing_conditions": "condition",
        "severity_progression": "severity",
        "lifestyle_factors": "lifestyle",
        "previous_reports": "report"
    }
    DEFAULT_QUESTIONS = {
        "stress": "Can you describe your current stress levels?",
        "sleep_quality": "How would you rate your sleep quality?",
        "duration": "How long have you been experiencing these symptoms?",
        "concentration": "Have you noticed any issues with concentration?",
        "medications": "Are you currently taking any medications?",
        "hydration": "How much water do you drink daily?",
        "existing_conditions": "Do you have any existing medical conditions?",
        "severity_progression": "Has the severity of your symptoms changed over time?",
        "lifestyle_factors": "Can you share any lifestyle factors that might affect your health?",
        "previous_reports": "Do you have any previous medical reports or lab results to share?"
    }

    # Update answered list based on user message keywords
    answered = set(session.get("answered_questions", []))
    msg_lower = message.lower()
    for topic, keyword in QUESTION_TOPICS.items():
        if keyword in msg_lower:
            answered.add(topic)

    # If the proposed follow‑up question matches an already answered topic, replace it
    follow_up = (response_data.get("follow_up_question") or "").lower()
    for topic in list(answered):
        if QUESTION_TOPICS[topic] in follow_up:
            # Find next unanswered topic
            next_topic = None
            for t in QUESTION_TOPICS:
                if t not in answered:
                    next_topic = t
                    break
            if next_topic:
                response_data["follow_up_question"] = DEFAULT_QUESTIONS[next_topic]
            break

    # Persist updated answered list
    session["answered_questions"] = list(answered)
    # --------------------------------------------------------------

    # Update history
    session["history"].append({"role": "user", "content": message})
    session["history"].append({"role": "assistant", "content": json.dumps(response_data)})
    session["structured_data"] = response_data

    if len(session["history"]) > 6:
        session["history"] = session["history"][-6:] 
    return jsonify({
        "success": True,
        "response": response_data
    })

@app.route("/api/appoint-ready/report", methods=["POST"])
@require_role("patient")
def appoint_ready_report():
    data = request.get_json() or {}
    session_id = data.get("session_id")

    if not session_id or session_id not in appoint_ready_sessions:
        return error("Invalid or missing session_id", "VALIDATION_ERROR", 400)

    session = appoint_ready_sessions[session_id]
    structured_data = session["structured_data"]

    # Generate PDF
    anonymous_id = f"A{hashlib.sha256(session_id.encode()).hexdigest()[:4].upper()}"
    pdf_bytes = generate_intake_pdf(structured_data, anonymous_id)

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"PulseKin_Intake_{anonymous_id}.pdf"
    )

@app.route("/api/appoint-ready/share", methods=["POST"])
@require_role("patient")
def appoint_ready_share():
    data = request.get_json() or {}
    session_id = data.get("session_id")

    if not session_id or session_id not in appoint_ready_sessions:
        return error("Invalid or missing session_id", "VALIDATION_ERROR", 400)

    session = appoint_ready_sessions[session_id]
    structured_data = session["structured_data"]
    
    # Anonymized ID
    anonymous_id = f"A{hashlib.sha256(session_id.encode()).hexdigest()[:4].upper()}"
    
    # Build comprehensive intake narrative for doctor view
    symptoms_text = structured_data.get("summary", "No summary available")
    
    # Extract key clinical info
    medical_context = session.get("medical_context", {})
    
    # Build the clinical narrative that doctors will see
    clinical_narrative = f"""AppointReady Clinical Intake Summary

Patient Code: {anonymous_id}
Date: {datetime.now(timezone.utc).isoformat()}

CHIEF COMPLAINT:
{symptoms_text}

SYMPTOM DURATION: {medical_context.get("duration", "Not specified")}
SEVERITY: {medical_context.get("severity", "Not specified")}
IMPACT ON DAILY LIFE: {medical_context.get("impact", "Not specified")}

CURRENT MEDICATIONS: {medical_context.get("medications", "None reported")}
EXISTING CONDITIONS: {medical_context.get("existing_conditions", "None reported")}
LIFESTYLE FACTORS: {medical_context.get("lifestyle_factors", "Not specified")}
PREVIOUS REPORTS: {medical_context.get("previous_reports", "None")}

SUGGESTED SPECIALIST: {structured_data.get("specialist", "General Physician")}
READINESS SCORE: {structured_data.get("readiness_score", 50)}%

RECOMMENDATIONS:
{chr(10).join(["• " + r for r in structured_data.get("recommendations", [])])}

CHECKLIST:
{chr(10).join(["□ " + c for c in structured_data.get("checklist", [])])}

AI Intake Disclaimer: This document is generated by PulseKin AppointReady based on self-reported patient information. It is NOT a clinical diagnosis. If emergency symptoms present, contact emergency services immediately."""

    # Create / overwrite patient case in store with INTAKE marker
    patients[session_id] = {
        "patient_id": session_id,
        "anonymous_id": anonymous_id,
        "email_hash": hashlib.sha256(session_id.encode()).hexdigest()[:12],
        "risk_score": float(structured_data.get("readiness_score", 50)) / 100.0,
        "risk_label": "Intake Info",
        "health_signal": "Needs Review" if structured_data.get("readiness_score", 50) > 60 else "Doing Great",
        "biomarkers": {
            "creatinine": 1.1, "bp_systolic": 130, "egfr": 75.0,
            "hemoglobin": 13.0, "sodium": 140.0, "glucose": 110.0,
            "bmi": 24.5, "age_score": 0.45
        },
        "shap_values": {
            "creatinine": 0.05, "bp_systolic": 0.08, "egfr": -0.1,
            "hemoglobin": -0.05, "sodium": 0.02, "glucose": 0.08,
            "bmi": 0.04, "age_score": 0.05
        },
        "vitals_timeline": [
            {"date": "Jan 10", "egfr": 78, "creatinine": 1.0, "bp": 128},
            {"date": "Jan 12", "egfr": 75, "creatinine": 1.1, "bp": 130}
        ],
        "report_ids": [], "scan_ids": [],
        "shared_with_doctor": True,
        "condition": f"Intake - {structured_data.get('specialist', 'General Physician')}",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "status": "Intake Pending",
        "recommended_actions": structured_data.get("recommendations", []),
        "shap_narrative_clinical": clinical_narrative,  # Full narrative for doctors
        "is_intake": True,  # Flag for doctor portal
        "intake_data": {
            "symptoms": structured_data.get("summary", ""),
            "specialist": structured_data.get("specialist", "General Physician"),
            "readiness_score": structured_data.get("readiness_score", 50),
            "recommendations": structured_data.get("recommendations", []),
            "checklist": structured_data.get("checklist", []),
            "medical_context": medical_context
        }
    }

    session["shared"] = True

    return jsonify({
        "success": True,
        "anonymous_id": anonymous_id
    })

# ─── Health Check ─────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "PulseKin API"})

# ─── Startup ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    seed_demo_data()
    print("[OK] PulseKin backend seeded with demo data")
    print("[OK] Patient login: patient@demo.com / demo123")
    print("[OK] Doctor login:  APOLLO_CHENNAI / DR_001 / demo123")
    print("[OK] Admin login:   tech_admin / PULSEKIN_2024")
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("FLASK_PORT", os.getenv("PORT", 5000))),
        debug=True,
        use_reloader=False
    )
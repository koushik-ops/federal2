# backend/groq_ai.py
import os
import json
from groq import Groq
from dotenv import load_dotenv

# Ensure dotenv is loaded
load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

def get_groq_client():
    if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_KEY_HERE":
        return None
    try:
        return Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Error initializing Groq client: {e}")
        return None

SYSTEM_PROMPT = """You are PulseKin AppointReady AI, a supportive, medically-intelligent healthcare intake assistant.
Your goal is to help patients prepare before they consult a doctor by gathering structured symptom information and building clinical context.

Follow these strict rules:
1. NEVER provide a definitive diagnosis or say things like "You have X". Instead, say "These symptoms can be related to..." or "Let's gather details about...".
2. Maintain a calm, professional, supportive, and non-alarming tone. Never create panic.
3. Ask EXACTLY ONE relevant follow-up question at a time to gather clinical context. Keep it conversational.
4. Focus on preparing the patient for their consultation (what they should bring, what questions they should ask, suggested specialist, readiness score).
5. If the patient describes a medical emergency (e.g., severe chest pain, stroke symptoms, uncontrolled bleeding, suicidal ideation), your primary instruction is to immediately advise them to seek emergency care (call 911 or visit the ER) and stop the intake process.
6. Always respond in valid JSON format.

You must output a JSON object matching this structure exactly, with no additional text or markdown formatting outside the JSON:
{
  "reply": "Your conversational reply to the patient, acknowledging their symptoms with supportive, non-alarming guidance.",
  "follow_up_question": "A single relevant medical intake follow-up question to clarify symptoms.",
  "summary": "A concise clinical summary of the patient's symptoms and history gathered so far.",
  "specialist": "Recommended specialist type (e.g. Cardiologist, Nephrologist, Endocrinologist, Neurologist, Pulmonologist, General Physician).",
  "readiness_score": 30,
  "recommendations": ["A list of 2-4 calm, actionable pre-appointment tips for the patient"],
  "checklist": ["A list of 2-4 checklist items of what to prepare/bring to the appointment"]
}"""

def get_fallback_response(user_message, turn_count):
    """Provides medically sound, dynamic fallback responses in case Groq is unavailable."""
    msg = user_message.lower()
    
    # Calculate readiness score based on turn count
    readiness_score = min(100, 20 + turn_count * 20)
    
    # Simple rule-based medical mapping
    if "chest" in msg or "heart" in msg or "cardiac" in msg or "palpitation" in msg:
        reply = "I understand you are experiencing symptoms related to your chest or heart. These symptoms warrant careful, supportive attention."
        follow_up = "Are you experiencing any shortness of breath, sweating, or pain radiating to your arm or jaw?"
        summary = "Patient reports chest-related discomfort or palpitations. Monitoring for potential cardiovascular indicators."
        specialist = "Cardiologist"
        recommendations = [
            "Sit or lie down in a comfortable position and rest.",
            "Avoid any physical exertion.",
            "If symptoms become severe or are accompanied by left arm pain, seek emergency medical care immediately."
        ]
        checklist = [
            "Note the exact duration and triggers of the chest sensations.",
            "Bring details of any blood pressure or heart medications.",
            "Prepare a list of family history regarding cardiovascular health."
        ]
    elif "kidney" in msg or "urinary" in msg or "egfr" in msg or "creatinine" in msg:
        reply = "Thank you for sharing. Biomarkers related to kidney function (like eGFR and creatinine) are very helpful indicators to review."
        follow_up = "Have you noticed any changes in urination frequency, swelling in your ankles or feet, or lower back discomfort?"
        summary = "Intake reports focused on kidney function biomarkers or urinary changes. Reviewing staging indicators."
        specialist = "Nephrologist"
        recommendations = [
            "Maintain moderate fluid intake; do not over-hydrate or restrict fluids severely.",
            "Limit high-sodium foods and processed items.",
            "Avoid taking NSAIDs (like ibuprofen) which can place stress on kidneys."
        ]
        checklist = [
            "Bring a printed copy of your latest metabolic or blood chemistry panel.",
            "Write down your daily average water intake.",
            "List any supplements or over-the-counter pills you take regularly."
        ]
    elif "sugar" in msg or "glucose" in msg or "diabetes" in msg or "diabetic" in msg:
        reply = "I see. Discussing glucose levels and metabolic indicators helps identify appropriate management routes."
        follow_up = "Have you experienced increased thirst, frequent urination, unexplained weight loss, or fatigue recently?"
        summary = "Patient notes concerns related to glucose levels or suspected diabetes. Documenting metabolic indicators."
        specialist = "Endocrinologist"
        recommendations = [
            "Monitor fasting and post-meal glucose levels if you have a glucometer.",
            "Avoid sugary beverages and high-carbohydrate snacks.",
            "Note the timing of your symptoms in relation to your meals."
        ]
        checklist = [
            "Bring your glucometer log or continuous glucose monitor report if available.",
            "Prepare a 3-day food and beverage diary.",
            "List any active prescriptions for diabetes or cholesterol."
        ]
    elif "breath" in msg or "cough" in msg or "respiratory" in msg or "lungs" in msg:
        reply = "I understand you are having some respiratory symptoms. Breathing comfort is very important to track."
        follow_up = "Is the cough dry or productive, and does the breathing difficulty worsen when lying flat?"
        summary = "Patient presents with cough or breathing issues. Evaluating potential respiratory patterns."
        specialist = "Pulmonologist"
        recommendations = [
            "Sit upright to support lung expansion.",
            "Avoid cold air, smoke, or allergen triggers.",
            "Rest and use a humidifier if helpful."
        ]
        checklist = [
            "Bring any inhalers or nebulizer details you currently use.",
            "Record how many times a day the cough or breathing difficulty peaks.",
            "Note any history of allergies or asthma."
        ]
    else:
        reply = "Thank you for describing your symptoms. Let's build a clear profile to help you get the most out of your doctor's visit."
        follow_up = "When did you first notice these symptoms, and has anything made them feel better or worse?"
        summary = "General symptoms reported. Building chronological overview of patient history."
        specialist = "General Physician"
        recommendations = [
            "Keep a daily log of when symptoms occur.",
            "Get adequate rest and stay hydrated.",
            "Avoid self-treating with unprescribed medications."
        ]
        checklist = [
            "Write down a timeline of your symptoms.",
            "Bring all current medication boxes or prescriptions.",
            "Prepare 2-3 key questions you want to ask the doctor."
        ]
        
    return {
        "reply": reply,
        "follow_up_question": follow_up,
        "summary": summary,
        "specialist": specialist,
        "readiness_score": readiness_score,
        "recommendations": recommendations,
        "checklist": checklist
    }

def process_appoint_ready_chat(session_id, user_message, history=None, medical_context=None):
    """
    Main function to process AppointReady multi-turn chats.
    Uses Groq llama-3.1-8b-instant. If not available, uses high-fidelity fallbacks.
    
    history: list of dicts: [{'role': 'user', 'content': '...'}, {'role': 'assistant', 'content': '...'}]
    medical_context: dict of structured fields already collected from the patient.
    """
    client = get_groq_client()
    turn_count = len(history) // 2 if history else 0
    
    if not client:
        print("Groq client not available. Using local fallback rules.")
        return get_fallback_response(user_message, turn_count + 1)
        
    # Prepare messages payload
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # ── Inject medical context as a second system message ──
    if medical_context:
        filled = {k: v for k, v in medical_context.items() if v}
        if filled:
            ctx_lines = ["PATIENT MEDICAL CONTEXT COLLECTED SO FAR (do NOT re-ask these):"]
            for field, value in filled.items():
                label = field.replace("_", " ").title()
                ctx_lines.append(f"  • {label}: {value}")
            ctx_lines.append("")
            ctx_lines.append("Focus your next question on an area NOT yet covered above.")
            messages.append({"role": "system", "content": "\n".join(ctx_lines)})

    if history:
        for item in history:
            messages.append(item)
    messages.append({"role": "user", "content": user_message})
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1000
        )
        
        raw_content = completion.choices[0].message.content
        data = json.loads(raw_content)
        
        # Validation and post-processing
        # Ensure correct keys exist
        keys = ["reply", "follow_up_question", "summary", "specialist", "readiness_score", "recommendations", "checklist"]
        for key in keys:
            if key not in data:
                if key == "readiness_score":
                    data[key] = min(100, 20 + (turn_count + 1) * 20)
                elif key in ["recommendations", "checklist"]:
                    data[key] = []
                else:
                    data[key] = ""
                    
        # Clamp readiness score
        try:
            score = int(data["readiness_score"])
            data["readiness_score"] = max(10, min(100, score))
        except Exception:
            data["readiness_score"] = min(100, 20 + (turn_count + 1) * 20)
            
        return data
        
    except Exception as e:
        print(f"Error during Groq API call or JSON parsing: {e}")
        return get_fallback_response(user_message, turn_count + 1)
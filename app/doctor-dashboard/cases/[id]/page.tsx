"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Brain, 
  Activity, 
  FileText, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Info,
  Download,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const getRiskColor = (score: number, label: string) => {
  if (label === "Intake Info") return "text-purple-600 dark:text-purple-400 bg-purple-500/15 border-purple-500/30"
  if (score > 0.7) return "text-red-600 dark:text-red-400 bg-red-500/15 border-red-500/30"
  if (score > 0.4) return "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30"
  return "text-green-600 dark:text-green-400 bg-green-500/15 border-green-500/30"
}

const getRiskLabel = (score: number, label: string) => {
  if (label === "Intake Info") return "Intake Info"
  if (score > 0.7) return "High Risk"
  if (score > 0.4) return "Medium Risk"
  return "Low Risk"
}

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "shap" | "reports">("overview")
  const [id, setId] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return

    async function fetchCaseDetails() {
      try {
        const token = localStorage.getItem("pulsekin_token")
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const res = await fetch(`${apiUrl}/api/patient/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        if (res.ok) {
          const fetched = await res.json()
          setData(fetched)
        } else if (res.status === 404) {
          // If not found in backend, fall back to mock data
          if (id === "A0047") {
            setData({
              anonymous_id: id,
              risk_score: 0.85,
              risk_label: "HIGH",
              condition: "Suspected Diabetes Type 2",
              biomarkers: {
                creatinine: 1.2,
                bp_systolic: 130,
                egfr: 60,
                hemoglobin: 14.1,
                sodium: 138,
                glucose: 142,
                bmi: 28.5,
                age_score: 0.58
              },
              shap_values: {
                "HbA1c Level": 0.28,
                "Fasting Glucose": 0.24,
                "Family History": 0.18,
                "Age Factor": 0.12,
                "Physical Activity": -0.08,
                "Diet Score": -0.05
              },
              shap_narrative_clinical: "High fasting blood glucose and elevated HbA1c are the primary drivers of diabetic risk label.",
              vitals_timeline: [
                {"date": "Jan 10", "egfr": 62, "creatinine": 1.1, "bp": 128},
                {"date": "Jan 12", "egfr": 60, "creatinine": 1.2, "bp": 130}
              ],
              reports: [
                { name: "Blood Test - Complete Panel", date: "May 18, 2026", type: "Lab" },
                { name: "Lipid Profile", date: "May 18, 2026", type: "Lab" }
              ],
              recommended_actions: [
                "Recommend oral glucose tolerance test (OGTT)",
                "Order C-peptide levels to assess insulin production",
                "Consider metformin initiation if diagnosis confirmed"
              ],
              is_intake: false
            })
          } else {
            setData({
              anonymous_id: id,
              risk_score: 0.72,
              risk_label: "MEDIUM",
              condition: "Hypertension Monitoring",
              biomarkers: {
                creatinine: 1.1,
                bp_systolic: 142,
                egfr: 75,
                hemoglobin: 13.5,
                sodium: 140,
                glucose: 98,
                bmi: 26.2,
                age_score: 0.62
              },
              shap_values: {
                "Systolic BP": 0.18,
                "Age Factor": 0.12,
                "Hemoglobin": -0.05,
                "BMI": 0.05
              },
              shap_narrative_clinical: "Elevated systolic BP is the primary driver of cardiovascular monitoring risk label.",
              vitals_timeline: [
                {"date": "Jan 10", "egfr": 78, "creatinine": 1.0, "bp": 138},
                {"date": "Jan 12", "egfr": 75, "creatinine": 1.1, "bp": 142}
              ],
              reports: [
                { name: "Blood Test - Complete Panel", date: "May 18, 2026", type: "Lab" }
              ],
              recommended_actions: [
                "Recommend regular BP tracking",
                "Order lipid profile follow-up"
              ],
              is_intake: false
            })
          }
        } else {
          setError("Failed to fetch case data")
        }
      } catch (err) {
        console.error("Error fetching case details:", err)
        setError("Network error fetching case data")
      } finally {
        setLoading(false)
      }
    }

    fetchCaseDetails()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto" />
          <p className="text-muted-foreground text-sm">Retrieving decentralized clinical case record...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Cases
        </button>
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold">{error || "Patient not found"}</p>
        </div>
      </div>
    )
  }

  const biomarkersList = data.biomarkers ? [
    { name: "Fasting Blood Glucose", value: `${data.biomarkers.glucose} mg/dL`, status: data.biomarkers.glucose > 125 ? "high" : data.biomarkers.glucose > 100 ? "elevated" : "normal", trend: data.biomarkers.glucose > 100 ? "up" : "stable", normal: "70-100" },
    { name: "eGFR Level", value: `${data.biomarkers.egfr} mL/min/1.73m²`, status: data.biomarkers.egfr < 60 ? "high" : data.biomarkers.egfr < 90 ? "elevated" : "normal", trend: data.biomarkers.egfr < 90 ? "down" : "stable", normal: ">= 90" },
    { name: "Serum Creatinine", value: `${data.biomarkers.creatinine} mg/dL`, status: data.biomarkers.creatinine > 1.2 ? "high" : "normal", trend: data.biomarkers.creatinine > 1.2 ? "up" : "stable", normal: "0.6-1.2" },
    { name: "Systolic Blood Pressure", value: `${data.biomarkers.bp_systolic} mmHg`, status: data.biomarkers.bp_systolic > 139 ? "high" : data.biomarkers.bp_systolic > 120 ? "elevated" : "normal", trend: data.biomarkers.bp_systolic > 120 ? "up" : "stable", normal: "< 120" },
    { name: "Hemoglobin", value: `${data.biomarkers.hemoglobin} g/dL`, status: data.biomarkers.hemoglobin < 12.0 ? "high" : "normal", trend: "stable", normal: "12.0-17.5" },
    { name: "Body Mass Index (BMI)", value: `${data.biomarkers.bmi}`, status: data.biomarkers.bmi > 29.9 ? "high" : data.biomarkers.bmi > 24.9 ? "elevated" : "normal", trend: "stable", normal: "18.5-24.9" }
  ] : []

  const shapExplanation = data.shap_values ? Object.entries(data.shap_values).map(([feature, val]: [string, any]) => {
    let featureName = feature
    if (feature === "bp_systolic") featureName = "Systolic BP"
    else if (feature === "egfr") featureName = "eGFR Level"
    else if (feature === "bmi") featureName = "BMI Factor"
    else if (feature === "age_score") featureName = "Age Factor"
    else if (feature === "glucose") featureName = "Blood Glucose"
    else if (feature === "creatinine") featureName = "Serum Creatinine"
    else if (feature === "hemoglobin") featureName = "Hemoglobin"
    else if (feature === "sodium") featureName = "Sodium Level"
    else featureName = feature.charAt(0).toUpperCase() + feature.slice(1)

    return {
      feature: featureName,
      contribution: val,
      direction: val >= 0 ? "positive" : "negative"
    }
  }).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)) : []

  const predictions = [
    { name: data.condition || "Kidney Disease Risk", probability: Math.round(data.risk_score * 100), severity: data.risk_score > 0.7 ? "high" : data.risk_score > 0.4 ? "medium" : "low" },
    { name: "Metabolic Syndrome", probability: Math.round((data.risk_score * 0.7) * 100), severity: "low" }
  ]

  const recommendationsMapped = (data.recommended_actions || []).map((text: string) => {
    let type = "diagnostic"
    const lower = text.toLowerCase()
    if (lower.includes("diet") || lower.includes("lifestyle") || lower.includes("walk") || lower.includes("water") || lower.includes("hydration")) {
      type = "lifestyle"
    } else if (lower.includes("medication") || lower.includes("prescribe") || lower.includes("dose") || lower.includes("metformin")) {
      type = "treatment"
    } else if (lower.includes("follow") || lower.includes("schedule") || lower.includes("visit")) {
      type = "followup"
    }
    return { type, text }
  })

  return (
    <div className="pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Cases
        </button>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between rounded-3xl border border-border bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-card p-6 shadow-sm">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">Patient #{data.anonymous_id}</h1>
              <span className={`rounded-full border px-4 py-1 text-sm font-medium ${getRiskColor(data.risk_score, data.risk_label)}`}>
                {getRiskLabel(data.risk_score, data.risk_label)}
              </span>
            </div>
            <p className="text-lg text-muted-foreground">{data.condition || "AI General Intake"}</p>
            <p className="mt-1 text-sm text-muted-foreground/80">
              {data.is_intake ? "PulseKin AppointReady Session" : "Federated Clinical Case Record"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              <Download className="mr-2 h-4 w-4" />
              Export Record
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Consultation
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border pb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "overview" 
                ? "bg-purple-600 text-white dark:bg-purple-500" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("shap")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "shap" 
                ? "bg-purple-600 text-white dark:bg-purple-500" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            SHAP Explainability
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "reports" 
                ? "bg-purple-600 text-white dark:bg-purple-500" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Reports
          </button>
        </div>

        {activeTab === "overview" && (
          data.is_intake ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Chief Complaint & Readiness */}
              <div className="lg:col-span-2 space-y-6">
                {/* Chief Complaint */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-xl font-semibold text-foreground">Chief Complaint & Clinical Narrative</h2>
                  </div>
                  <div className="rounded-2xl border border-purple-500/10 bg-purple-500/5 p-5 whitespace-pre-wrap text-sm text-foreground leading-relaxed font-mono">
                    {data.shap_narrative_clinical || data.intake_data?.symptoms || "No chief complaint summary available."}
                  </div>
                </div>

                {/* Checklist & Recommended Actions */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">AppointReady Intake Checklist</h2>
                  <p className="text-sm text-muted-foreground mb-4">Patient readiness actions to review during the consultation:</p>
                  <div className="space-y-3">
                    {data.intake_data?.checklist?.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3">
                        <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-foreground/90">{item}</span>
                      </div>
                    ))}
                    {(!data.intake_data?.checklist || data.intake_data.checklist.length === 0) && (
                      <p className="text-sm text-muted-foreground italic">No checklist items generated.</p>
                    )}
                  </div>
                </div>

                {/* Patient Recommendations */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">Patient Pre-Appointment Actions</h2>
                  <p className="text-sm text-muted-foreground mb-4">Recommendations shared with the patient prior to their visit:</p>
                  <div className="space-y-3">
                    {data.intake_data?.recommendations?.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 text-green-950 dark:text-green-100 p-3">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-foreground/90">{item}</span>
                      </div>
                    ))}
                    {(!data.intake_data?.recommendations || data.intake_data.recommendations.length === 0) && (
                      <p className="text-sm text-muted-foreground italic">No recommendations generated.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column: Specialist recommendation and medical context */}
              <div className="space-y-6">
                {/* Readiness Score Card */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Intake Summary</h2>
                  <div className="mb-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Suggested Specialist</div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                      {data.intake_data?.specialist || "General Physician"}
                    </div>
                    <hr className="border-border my-3" />
                    <div className="text-sm text-muted-foreground mb-1">Pre-Appointment Readiness</div>
                    <div className="text-4xl font-extrabold text-foreground mb-2">
                      {data.intake_data?.readiness_score || 50}%
                    </div>
                    <Progress value={data.intake_data?.readiness_score || 50} className="h-2 [&>div]:bg-purple-600" />
                  </div>
                </div>

                {/* Medical Context Grid */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Symptom Context
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Symptom Duration</span>
                      <p className="text-sm font-medium text-foreground">{data.intake_data?.medical_context?.duration || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Severity Level</span>
                      <p className="text-sm font-medium text-foreground capitalize">{data.intake_data?.medical_context?.severity || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Impact on Daily Life</span>
                      <p className="text-sm font-medium text-foreground">{data.intake_data?.medical_context?.impact || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Current Medications</span>
                      <p className="text-sm font-medium text-foreground">{data.intake_data?.medical_context?.medications || "None reported"}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Existing Conditions</span>
                      <p className="text-sm font-medium text-foreground">{data.intake_data?.medical_context?.existing_conditions || "None reported"}</p>
                    </div>
                    {data.intake_data?.medical_context?.lifestyle_factors && (
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Lifestyle Factors</span>
                        <p className="text-sm font-medium text-foreground">{data.intake_data.medical_context.lifestyle_factors}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Disease Predictions */}
              <div className="lg:col-span-2">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-xl font-semibold text-foreground">AI Disease Predictions</h2>
                    <span className="ml-auto rounded-lg bg-purple-500/10 px-3 py-1 text-sm text-purple-600 dark:text-purple-400">
                      {Math.round(data.risk_score * 100)}% Overall Confidence
                    </span>
                  </div>

                  <div className="space-y-4">
                    {predictions.map((pred, i) => (
                      <div key={i} className="rounded-2xl border border-border/50 bg-muted/20 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-foreground">{pred.name}</span>
                          <span className={`text-xl font-bold ${
                            pred.severity === "high" ? "text-red-600 dark:text-red-400" :
                            pred.severity === "medium" ? "text-amber-600 dark:text-amber-400" :
                            "text-green-600 dark:text-green-400"
                          }`}>
                            {pred.probability}%
                          </span>
                        </div>
                        <Progress 
                          value={pred.probability} 
                          className={`h-2 ${
                            pred.severity === "high" ? "[&>div]:bg-red-500" :
                            pred.severity === "medium" ? "[&>div]:bg-amber-500" :
                            "[&>div]:bg-green-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">AI Recommendations</h2>
                  <div className="space-y-3">
                    {recommendationsMapped.map((rec: any, i: number) => (
                      <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${
                        rec.type === "diagnostic" ? "border-blue-500/30 bg-blue-500/10 text-blue-950 dark:text-blue-100" :
                        rec.type === "treatment" ? "border-purple-500/30 bg-purple-500/10 text-purple-950 dark:text-purple-100" :
                        rec.type === "lifestyle" ? "border-green-500/30 bg-green-500/10 text-green-950 dark:text-green-100" :
                        "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100"
                      }`}>
                        <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${
                          rec.type === "diagnostic" ? "text-blue-600 dark:text-blue-400" :
                          rec.type === "treatment" ? "text-purple-600 dark:text-purple-400" :
                          rec.type === "lifestyle" ? "text-green-600 dark:text-green-400" :
                          "text-amber-600 dark:text-amber-400"
                        }`} />
                        <span className="text-sm text-foreground/90">{rec.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Biomarkers */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Key Biomarkers
                  </h2>
                  <div className="space-y-4">
                    {biomarkersList.map((marker, i) => (
                      <div key={i} className="rounded-xl border border-border/50 bg-muted/20 p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{marker.name}</span>
                          {marker.trend === "up" && <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />}
                          {marker.trend === "down" && <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />}
                          {marker.trend === "stable" && <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className={`text-lg font-semibold ${
                            marker.status === "high" ? "text-red-600 dark:text-red-400" :
                            marker.status === "elevated" || marker.status === "overweight" ? "text-amber-600 dark:text-amber-400" :
                            "text-green-600 dark:text-green-400"
                          }`}>
                            {marker.value}
                          </span>
                          <span className="text-xs text-muted-foreground">Normal: {marker.normal}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === "shap" && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-foreground">SHAP Feature Importance</h2>
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                How each feature contributed to the prediction
              </div>
            </div>

            <div className="space-y-4">
              {shapExplanation.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-40 text-sm text-muted-foreground">{item.feature}</span>
                  <div className="relative flex-1 h-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="h-0.5 w-full bg-border" />
                    </div>
                    <div 
                      className={`absolute top-1/2 h-6 -translate-y-1/2 rounded ${
                        item.direction === "positive" ? "bg-red-500/60 left-1/2" : "bg-green-500/60 right-1/2"
                      }`}
                      style={{ 
                        width: `${Math.min(50, Math.abs(item.contribution) * 100)}%`,
                        [item.direction === "positive" ? "left" : "right"]: "50%"
                      }}
                    />
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-muted-foreground/30" />
                  </div>
                  <span className={`w-16 text-right text-sm font-medium ${
                    item.direction === "positive" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                  }`}>
                    {item.direction === "positive" ? "+" : ""}{(item.contribution * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-500/60" />
                <span className="text-sm text-muted-foreground">Increases risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-500/60" />
                <span className="text-sm text-muted-foreground">Decreases risk</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-foreground">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Uploaded Reports
            </h2>
            <div className="space-y-3">
              {(data.reports || []).map((report: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-purple-500/20 p-3">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.date} - {report.type}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                    View
                  </Button>
                </div>
              ))}
              {(!data.reports || data.reports.length === 0) && (
                <p className="text-sm text-muted-foreground italic p-4 text-center">No reports uploaded for this case.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Brain, 
  Activity, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Info,
  Download,
  MessageSquare,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const caseData = {
  id: "A0047",
  risk: "high",
  condition: "Suspected Diabetes Type 2",
  aiConfidence: 85,
  date: "May 20, 2026",
  predictions: [
    { name: "Type 2 Diabetes", probability: 85, severity: "high" },
    { name: "Metabolic Syndrome", probability: 62, severity: "medium" },
    { name: "Cardiovascular Risk", probability: 45, severity: "medium" },
    { name: "Neuropathy Risk", probability: 28, severity: "low" },
  ],
  biomarkers: [
    { name: "Fasting Blood Glucose", value: "142 mg/dL", status: "high", trend: "up", normal: "70-100", weight: 0.35 },
    { name: "HbA1c", value: "7.2%", status: "high", trend: "up", normal: "< 5.7%", weight: 0.30 },
    { name: "Fasting Insulin", value: "28 µU/mL", status: "elevated", trend: "up", normal: "2-25", weight: 0.15 },
    { name: "Triglycerides", value: "165 mg/dL", status: "elevated", trend: "stable", normal: "< 150", weight: 0.10 },
    { name: "BMI", value: "28.5", status: "overweight", trend: "stable", normal: "18.5-24.9", weight: 0.10 },
  ],
  shapExplanation: [
    { feature: "HbA1c Level", contribution: 0.28, direction: "positive" },
    { feature: "Fasting Glucose", contribution: 0.24, direction: "positive" },
    { feature: "Family History", contribution: 0.18, direction: "positive" },
    { feature: "Age Factor", contribution: 0.12, direction: "positive" },
    { feature: "Physical Activity", contribution: -0.08, direction: "negative" },
    { feature: "Diet Score", contribution: -0.05, direction: "negative" },
  ],
  recommendations: [
    { type: "diagnostic", text: "Recommend oral glucose tolerance test (OGTT)" },
    { type: "diagnostic", text: "Order C-peptide levels to assess insulin production" },
    { type: "treatment", text: "Consider metformin initiation if diagnosis confirmed" },
    { type: "lifestyle", text: "Structured diabetes prevention program recommended" },
    { type: "followup", text: "Schedule follow-up in 2 weeks for test results" },
  ],
  reports: [
    { name: "Blood Test - Complete Panel", date: "May 18, 2026", type: "Lab" },
    { name: "Lipid Profile", date: "May 18, 2026", type: "Lab" },
    { name: "HbA1c Test", date: "May 15, 2026", type: "Lab" },
  ]
}

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "shap" | "reports">("overview")

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-400 bg-red-500/20 border-red-500/30"
      case "medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      default: return "text-green-400 bg-green-500/20 border-green-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Cases
        </button>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between rounded-3xl border border-white/10 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent p-6 backdrop-blur-xl">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">Patient #{caseData.id}</h1>
              <span className={`rounded-full border px-4 py-1 text-sm font-medium ${getRiskColor(caseData.risk)}`}>
                {caseData.risk.charAt(0).toUpperCase() + caseData.risk.slice(1)} Risk
              </span>
            </div>
            <p className="text-lg text-gray-400">{caseData.condition}</p>
            <p className="mt-1 text-sm text-gray-500">Case opened: {caseData.date}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/10">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-500">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Consultation
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "overview" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("shap")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "shap" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            SHAP Explainability
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "reports" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Reports
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Disease Predictions */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <h2 className="text-xl font-semibold text-white">AI Disease Predictions</h2>
                  <span className="ml-auto rounded-lg bg-purple-500/20 px-3 py-1 text-sm text-purple-400">
                    {caseData.aiConfidence}% Overall Confidence
                  </span>
                </div>

                <div className="space-y-4">
                  {caseData.predictions.map((pred, i) => (
                    <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-white">{pred.name}</span>
                        <span className={`text-xl font-bold ${
                          pred.severity === "high" ? "text-red-400" :
                          pred.severity === "medium" ? "text-yellow-400" :
                          "text-green-400"
                        }`}>
                          {pred.probability}%
                        </span>
                      </div>
                      <Progress 
                        value={pred.probability} 
                        className={`h-2 ${
                          pred.severity === "high" ? "[&>div]:bg-red-500" :
                          pred.severity === "medium" ? "[&>div]:bg-yellow-500" :
                          "[&>div]:bg-green-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
                <h2 className="mb-4 text-xl font-semibold text-white">AI Recommendations</h2>
                <div className="space-y-3">
                  {caseData.recommendations.map((rec, i) => (
                    <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${
                      rec.type === "diagnostic" ? "border-blue-500/30 bg-blue-500/10" :
                      rec.type === "treatment" ? "border-purple-500/30 bg-purple-500/10" :
                      rec.type === "lifestyle" ? "border-green-500/30 bg-green-500/10" :
                      "border-yellow-500/30 bg-yellow-500/10"
                    }`}>
                      <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${
                        rec.type === "diagnostic" ? "text-blue-400" :
                        rec.type === "treatment" ? "text-purple-400" :
                        rec.type === "lifestyle" ? "text-green-400" :
                        "text-yellow-400"
                      }`} />
                      <span className="text-sm text-gray-300">{rec.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Biomarkers */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Key Biomarkers
                </h2>
                <div className="space-y-4">
                  {caseData.biomarkers.map((marker, i) => (
                    <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm text-gray-400">{marker.name}</span>
                        {marker.trend === "up" && <TrendingUp className="h-4 w-4 text-red-400" />}
                        {marker.trend === "down" && <TrendingDown className="h-4 w-4 text-green-400" />}
                        {marker.trend === "stable" && <Activity className="h-4 w-4 text-yellow-400" />}
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className={`text-lg font-semibold ${
                          marker.status === "high" ? "text-red-400" :
                          marker.status === "elevated" || marker.status === "overweight" ? "text-yellow-400" :
                          "text-green-400"
                        }`}>
                          {marker.value}
                        </span>
                        <span className="text-xs text-gray-500">Normal: {marker.normal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "shap" && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">SHAP Feature Importance</h2>
              <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
                <Info className="h-4 w-4" />
                How each feature contributed to the prediction
              </div>
            </div>

            <div className="space-y-4">
              {caseData.shapExplanation.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-40 text-sm text-gray-400">{item.feature}</span>
                  <div className="relative flex-1 h-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="h-0.5 w-full bg-white/10" />
                    </div>
                    <div 
                      className={`absolute top-1/2 h-6 -translate-y-1/2 rounded ${
                        item.direction === "positive" ? "bg-red-500/60 left-1/2" : "bg-green-500/60 right-1/2"
                      }`}
                      style={{ 
                        width: `${Math.abs(item.contribution) * 200}%`,
                        [item.direction === "positive" ? "left" : "right"]: "50%"
                      }}
                    />
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30" />
                  </div>
                  <span className={`w-16 text-right text-sm font-medium ${
                    item.direction === "positive" ? "text-red-400" : "text-green-400"
                  }`}>
                    {item.direction === "positive" ? "+" : ""}{(item.contribution * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-500/60" />
                <span className="text-sm text-gray-400">Increases risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-500/60" />
                <span className="text-sm text-gray-400">Decreases risk</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
              <FileText className="h-5 w-5 text-purple-400" />
              Uploaded Reports
            </h2>
            <div className="space-y-3">
              {caseData.reports.map((report, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-purple-500/20 p-3">
                      <FileText className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{report.name}</p>
                      <p className="text-sm text-gray-500">{report.date} - {report.type}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

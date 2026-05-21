"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  TrendingDown,
  Heart,
  Brain,
  Droplets,
  Zap,
  Share2,
  Download,
  MapPin,
  Star,
  Phone,
  Clock,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const diseasePreductions = [
  { name: "Type 2 Diabetes Risk", probability: 72, severity: "high", icon: Droplets },
  { name: "Hypertension", probability: 45, severity: "medium", icon: Heart },
  { name: "Cardiovascular Risk", probability: 28, severity: "low", icon: Activity },
  { name: "Neurological Concern", probability: 15, severity: "low", icon: Brain },
]

const biomarkers = [
  { name: "Blood Glucose", value: "142 mg/dL", status: "high", trend: "up", normal: "70-100 mg/dL" },
  { name: "HbA1c", value: "7.2%", status: "high", trend: "up", normal: "< 5.7%" },
  { name: "Blood Pressure", value: "138/88", status: "elevated", trend: "stable", normal: "< 120/80" },
  { name: "Cholesterol", value: "210 mg/dL", status: "borderline", trend: "down", normal: "< 200 mg/dL" },
  { name: "Triglycerides", value: "165 mg/dL", status: "elevated", trend: "up", normal: "< 150 mg/dL" },
]

const recommendations = [
  { type: "test", text: "Fasting blood glucose test recommended" },
  { type: "test", text: "Complete lipid profile with LDL/HDL breakdown" },
  { type: "lifestyle", text: "Reduce refined carbohydrate intake" },
  { type: "lifestyle", text: "30 minutes moderate exercise daily" },
  { type: "medical", text: "Consult endocrinologist for diabetes management" },
]

const nearbyDoctors = [
  { name: "Dr. Sarah Mitchell", specialty: "Endocrinologist", distance: "1.2 km", rating: 4.8, available: true },
  { name: "Dr. James Chen", specialty: "Cardiologist", distance: "2.5 km", rating: 4.9, available: true },
  { name: "Dr. Priya Sharma", specialty: "General Physician", distance: "0.8 km", rating: 4.7, available: false },
]

export default function AnalysisPage() {
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 p-6 backdrop-blur-xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-white">AI Health Analysis</h1>
              <p className="text-gray-400">Generated on May 20, 2026 at 2:45 PM</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                <Share2 className="mr-2 h-4 w-4" />
                Share with Doctor
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Health Signal */}
        <div className="mb-8 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-yellow-500/20 p-4">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1 text-xl font-semibold text-yellow-400">Moderate Health Alert</h2>
              <p className="text-gray-300">
                Based on your reports, there are some health indicators that need attention. 
                We recommend consulting a specialist for proper evaluation.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Disease Predictions */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
              <h2 className="mb-6 text-xl font-semibold text-white">Disease Risk Predictions</h2>
              <div className="space-y-6">
                {diseasePreductions.map((disease, i) => (
                  <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl p-2.5 ${
                          disease.severity === "high" ? "bg-red-500/20 text-red-400" :
                          disease.severity === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-green-500/20 text-green-400"
                        }`}>
                          <disease.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-white">{disease.name}</span>
                      </div>
                      <span className={`text-2xl font-bold ${
                        disease.severity === "high" ? "text-red-400" :
                        disease.severity === "medium" ? "text-yellow-400" :
                        "text-green-400"
                      }`}>
                        {disease.probability}%
                      </span>
                    </div>
                    <Progress 
                      value={disease.probability} 
                      className={`h-3 ${
                        disease.severity === "high" ? "[&>div]:bg-red-500" :
                        disease.severity === "medium" ? "[&>div]:bg-yellow-500" :
                        "[&>div]:bg-green-500"
                      }`}
                    />
                    <p className="mt-3 text-sm text-gray-400">
                      {disease.severity === "high" && "High probability detected. Professional consultation recommended."}
                      {disease.severity === "medium" && "Moderate risk level. Monitor and take preventive measures."}
                      {disease.severity === "low" && "Low risk. Continue maintaining healthy habits."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Biomarkers */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
              <h2 className="mb-6 text-xl font-semibold text-white">Key Biomarkers</h2>
              <div className="space-y-4">
                {biomarkers.map((marker, i) => (
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
                        marker.status === "elevated" || marker.status === "borderline" ? "text-yellow-400" :
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

        {/* Recommendations */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-xl font-semibold text-white">Recommendations</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-blue-400">Confirmatory Tests</span>
              </div>
              <ul className="space-y-2">
                {recommendations.filter(r => r.type === "test").map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    {rec.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-400" />
                <span className="font-medium text-green-400">Lifestyle Changes</span>
              </div>
              <ul className="space-y-2">
                {recommendations.filter(r => r.type === "lifestyle").map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    {rec.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                <span className="font-medium text-purple-400">Medical Advice</span>
              </div>
              <ul className="space-y-2">
                {recommendations.filter(r => r.type === "medical").map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                    {rec.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Nearby Doctors */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recommended Specialists Nearby</h2>
            <Button 
              variant="ghost" 
              className="text-pink-400 hover:text-pink-300"
              onClick={() => router.push("/patient-dashboard/doctors")}
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {nearbyDoctors.map((doctor, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-pink-500/30 hover:bg-white/5">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-white">{doctor.name}</p>
                    <p className="text-sm text-pink-400">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-yellow-500/20 px-2 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-yellow-400">{doctor.rating}</span>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {doctor.distance}
                  </span>
                  <span className={`flex items-center gap-1 ${doctor.available ? "text-green-400" : "text-gray-500"}`}>
                    <Clock className="h-3 w-3" />
                    {doctor.available ? "Available" : "Busy"}
                  </span>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
                  disabled={!doctor.available}
                >
                  Book Appointment
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Users, 
  FileText, 
  Video, 
  Building2, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Eye,
  Calendar,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"

const stats = [
  { label: "Pending Cases", value: "12", change: "+3 today", icon: Users, color: "yellow" },
  { label: "Analyzed Reports", value: "48", change: "+8 this week", icon: FileText, color: "green" },
  { label: "Consultations", value: "24", change: "5 scheduled", icon: Video, color: "blue" },
  { label: "Federated Insights", value: "156", change: "from 8 hospitals", icon: Building2, color: "purple" },
]

const recentCases = [
  { id: "A0047", risk: "high", condition: "Suspected Diabetes Type 2", status: "unread", date: "2 hours ago" },
  { id: "A0046", risk: "medium", condition: "Hypertension Monitoring", status: "read", date: "4 hours ago" },
  { id: "A0045", risk: "low", condition: "Routine Checkup", status: "reviewed", date: "Yesterday" },
  { id: "A0044", risk: "high", condition: "Cardiac Irregularity", status: "unread", date: "Yesterday" },
  { id: "A0043", risk: "medium", condition: "Thyroid Panel Review", status: "read", date: "2 days ago" },
]

const upcomingConsultations = [
  { patient: "Patient #A0047", time: "Today, 4:30 PM", type: "Video Call", specialty: "Diabetes Management" },
  { patient: "Patient #A0039", time: "Today, 5:30 PM", type: "In-Person", specialty: "Follow-up" },
  { patient: "Patient #A0051", time: "Tomorrow, 10:00 AM", type: "Video Call", specialty: "Initial Consult" },
]

export default function DoctorDashboard() {
  const router = useRouter()
  const { user } = useUser()

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-400 bg-red-500/20"
      case "medium": return "text-yellow-400 bg-yellow-500/20"
      default: return "text-green-400 bg-green-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unread": return <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
      case "read": return <Eye className="h-4 w-4 text-blue-400" />
      default: return <CheckCircle className="h-4 w-4 text-green-400" />
    }
  }

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">Clinical Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name || "Doctor"}. You have 12 pending cases to review.</p>
        </div>

        {/* Privacy Notice */}
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-purple-500/30 bg-purple-500/10 px-5 py-3">
          <Building2 className="h-5 w-5 text-purple-400" />
          <span className="text-sm text-purple-400">
            Federated Learning Active - All patient data is anonymized. You are viewing Patient IDs only.
          </span>
          <div className="ml-auto h-2 w-2 animate-pulse rounded-full bg-green-500" />
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-xl p-3 ${
                  stat.color === "yellow" ? "bg-yellow-500/20" :
                  stat.color === "green" ? "bg-green-500/20" :
                  stat.color === "blue" ? "bg-blue-500/20" :
                  "bg-purple-500/20"
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.color === "yellow" ? "text-yellow-400" :
                    stat.color === "green" ? "text-green-400" :
                    stat.color === "blue" ? "text-blue-400" :
                    "text-purple-400"
                  }`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Recent Patient Cases</h2>
                <Button 
                  variant="ghost" 
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => router.push("/doctor-dashboard/cases")}
                >
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {recentCases.map((caseItem) => (
                  <button
                    key={caseItem.id}
                    onClick={() => router.push(`/doctor-dashboard/cases/${caseItem.id}`)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4 transition-all hover:border-purple-500/30 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                        <span className="text-sm font-bold text-purple-400">#{caseItem.id.slice(-2)}</span>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">Patient #{caseItem.id}</p>
                          {getStatusIcon(caseItem.status)}
                        </div>
                        <p className="text-sm text-gray-400">{caseItem.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getRiskColor(caseItem.risk)}`}>
                        {caseItem.risk.charAt(0).toUpperCase() + caseItem.risk.slice(1)} Risk
                      </span>
                      <span className="text-xs text-gray-500">{caseItem.date}</span>
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Consultations */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Upcoming Consultations</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => router.push("/doctor-dashboard/consultations")}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {upcomingConsultations.map((consult, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-white">{consult.patient}</span>
                      <span className={`rounded-lg px-2 py-0.5 text-xs ${
                        consult.type === "Video Call" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"
                      }`}>
                        {consult.type}
                      </span>
                    </div>
                    <p className="text-sm text-purple-400">{consult.specialty}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {consult.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
              <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 text-gray-300 hover:bg-white/10"
                  onClick={() => router.push("/doctor-dashboard/cases")}
                >
                  <Users className="mr-3 h-4 w-4 text-purple-400" />
                  Review Pending Cases
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 text-gray-300 hover:bg-white/10"
                  onClick={() => router.push("/doctor-dashboard/consultations")}
                >
                  <Video className="mr-3 h-4 w-4 text-blue-400" />
                  Start Consultation
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 text-gray-300 hover:bg-white/10"
                  onClick={() => router.push("/doctor-dashboard/federated")}
                >
                  <Building2 className="mr-3 h-4 w-4 text-orange-400" />
                  View Federated Insights
                </Button>
              </div>
            </div>

            {/* AI Alerts */}
            <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <h2 className="font-semibold text-yellow-400">AI Priority Alerts</h2>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p>2 cases require urgent attention based on AI analysis</p>
                <Button 
                  size="sm" 
                  className="mt-2 w-full bg-yellow-500 text-black hover:bg-yellow-400"
                  onClick={() => router.push("/doctor-dashboard/cases?priority=high")}
                >
                  Review Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

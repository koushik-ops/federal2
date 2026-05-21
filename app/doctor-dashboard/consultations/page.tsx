"use client"

import { useState } from "react"
import { 
  Video, 
  Phone, 
  MessageSquare, 
  Calendar,
  Clock,
  User,
  Building2,
  Plus,
  ChevronRight,
  Search,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/lib/user-context"

const consultations = [
  { 
    id: 1,
    patient: "Patient #A0047", 
    time: "Today, 4:30 PM", 
    type: "video",
    status: "upcoming",
    specialty: "Diabetes Management",
    duration: "30 min"
  },
  { 
    id: 2,
    patient: "Patient #A0039", 
    time: "Today, 5:30 PM", 
    type: "in-person",
    status: "upcoming",
    specialty: "Follow-up",
    duration: "15 min"
  },
  { 
    id: 3,
    patient: "Patient #A0051", 
    time: "Tomorrow, 10:00 AM", 
    type: "video",
    status: "scheduled",
    specialty: "Initial Consult",
    duration: "45 min"
  },
  { 
    id: 4,
    patient: "Patient #A0038", 
    time: "Tomorrow, 2:00 PM", 
    type: "chat",
    status: "scheduled",
    specialty: "Quick Query",
    duration: "10 min"
  },
  { 
    id: 5,
    patient: "Patient #A0044", 
    time: "May 22, 11:00 AM", 
    type: "video",
    status: "scheduled",
    specialty: "Cardiac Review",
    duration: "30 min"
  },
]

const specialistReferrals = [
  { 
    id: 1,
    patient: "Patient #A0047",
    fromDoctor: null,
    toDoctor: "Dr. Johnson (Endocrinologist)",
    reason: "Suspected Type 2 Diabetes - requires specialist evaluation",
    status: "pending"
  },
  { 
    id: 2,
    patient: "Patient #A0044",
    fromDoctor: null,
    toDoctor: "Dr. Williams (Cardiologist)",
    reason: "Cardiac irregularity detected in ECG",
    status: "accepted"
  },
]

const hospitalPartners = [
  { name: "City Medical Center", location: "Mumbai", patients: 234, status: "active" },
  { name: "Heart Care Institute", location: "Delhi", patients: 189, status: "active" },
  { name: "Community Health Clinic", location: "Bangalore", patients: 156, status: "active" },
  { name: "Regional Hospital", location: "Chennai", patients: 98, status: "syncing" },
]

export default function ConsultationsPage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "referrals" | "partners">("schedule")
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useUser()
  const doctorName = user?.name || "Doctor"

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4 text-blue-400" />
      case "in-person": return <User className="h-4 w-4 text-green-400" />
      default: return <MessageSquare className="h-4 w-4 text-purple-400" />
    }
  }

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Consultations</h1>
            <p className="text-gray-400">Manage appointments, referrals, and partner hospital communications</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-500">
            <Plus className="mr-2 h-4 w-4" />
            New Consultation
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "schedule" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab("referrals")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "referrals" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <User className="h-4 w-4" />
            Specialist Referrals
          </button>
          <button
            onClick={() => setActiveTab("partners")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "partners" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Partner Hospitals
          </button>
        </div>

        {activeTab === "schedule" && (
          <>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search consultations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Consultations List */}
            <div className="space-y-4">
              {consultations.map((consult) => (
                <div 
                  key={consult.id}
                  className={`rounded-3xl border bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:bg-white/5 ${
                    consult.status === "upcoming" ? "border-purple-500/30" : "border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        consult.type === "video" ? "bg-blue-500/20" :
                        consult.type === "in-person" ? "bg-green-500/20" :
                        "bg-purple-500/20"
                      }`}>
                        {getTypeIcon(consult.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">{consult.patient}</h3>
                          {consult.status === "upcoming" && (
                            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-purple-400">{consult.specialty}</p>
                        <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {consult.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {consult.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {consult.status === "upcoming" && (
                        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500">
                          {consult.type === "video" ? "Join Call" : "Start Session"}
                        </Button>
                      )}
                      <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "referrals" && (
          <div className="space-y-4">
            {specialistReferrals.map((referral) => (
              <div 
                key={referral.id}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-white">{referral.patient}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        referral.status === "pending" 
                          ? "bg-yellow-500/20 text-yellow-400" 
                          : "bg-green-500/20 text-green-400"
                      }`}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </div>
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                      <span>{referral.fromDoctor || `${doctorName} (General)`}</span>
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-purple-400">{referral.toDoctor}</span>
                    </div>
                    <p className="text-sm text-gray-500">{referral.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white">
                      View Case
                    </Button>
                    {referral.status === "pending" && (
                      <Button className="bg-gradient-to-r from-purple-500 to-indigo-500">
                        Accept Referral
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "partners" && (
          <>
            {/* Privacy Notice */}
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-3">
              <Building2 className="h-5 w-5 text-green-400" />
              <span className="text-sm text-green-400">
                Federated network - Only aggregated insights are shared. No patient data leaves hospital premises.
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {hospitalPartners.map((hospital, i) => (
                <div 
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                        <Building2 className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{hospital.name}</h3>
                        <p className="text-sm text-gray-400">{hospital.location}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
                      hospital.status === "active" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      <div className={`h-2 w-2 rounded-full ${
                        hospital.status === "active" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                      }`} />
                      {hospital.status === "active" ? "Connected" : "Syncing"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-2xl font-bold text-white">{hospital.patients}</p>
                      <p className="text-xs text-gray-500">Shared insights</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
                      View Insights
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

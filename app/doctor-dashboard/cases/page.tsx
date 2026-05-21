"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  ChevronRight,
  AlertTriangle,
  Clock,
  Brain,
  Activity,
  FileText
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const patientCases = [
  { 
    id: "A0047", 
    risk: "high", 
    condition: "Suspected Diabetes Type 2", 
    status: "unread", 
    date: "2 hours ago",
    aiConfidence: 85,
    biomarkers: ["Elevated Blood Glucose", "High HbA1c"],
    reports: 3
  },
  { 
    id: "A0046", 
    risk: "medium", 
    condition: "Hypertension Monitoring", 
    status: "read", 
    date: "4 hours ago",
    aiConfidence: 72,
    biomarkers: ["Elevated BP", "Borderline Cholesterol"],
    reports: 2
  },
  { 
    id: "A0045", 
    risk: "low", 
    condition: "Routine Checkup", 
    status: "reviewed", 
    date: "Yesterday",
    aiConfidence: 95,
    biomarkers: ["Normal Range"],
    reports: 1
  },
  { 
    id: "A0044", 
    risk: "high", 
    condition: "Cardiac Irregularity", 
    status: "unread", 
    date: "Yesterday",
    aiConfidence: 78,
    biomarkers: ["Abnormal ECG", "Elevated Troponin"],
    reports: 4
  },
  { 
    id: "A0043", 
    risk: "medium", 
    condition: "Thyroid Panel Review", 
    status: "read", 
    date: "2 days ago",
    aiConfidence: 81,
    biomarkers: ["TSH Fluctuation"],
    reports: 2
  },
  { 
    id: "A0042", 
    risk: "low", 
    condition: "Post-Treatment Follow-up", 
    status: "reviewed", 
    date: "2 days ago",
    aiConfidence: 92,
    biomarkers: ["Improving Markers"],
    reports: 2
  },
  { 
    id: "A0041", 
    risk: "high", 
    condition: "Renal Function Concern", 
    status: "unread", 
    date: "3 days ago",
    aiConfidence: 76,
    biomarkers: ["Elevated Creatinine", "Low GFR"],
    reports: 3
  },
  { 
    id: "A0040", 
    risk: "medium", 
    condition: "Lipid Profile Abnormality", 
    status: "read", 
    date: "3 days ago",
    aiConfidence: 83,
    biomarkers: ["High LDL", "Low HDL"],
    reports: 1
  },
]

const filterOptions = ["All", "Unread", "High Risk", "Medium Risk", "Low Risk"]

export default function PatientCasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All")
  const router = useRouter()

  const filteredCases = patientCases.filter(caseItem => {
    const matchesSearch = caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.condition.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesFilter = true
    if (selectedFilter === "Unread") matchesFilter = caseItem.status === "unread"
    else if (selectedFilter === "High Risk") matchesFilter = caseItem.risk === "high"
    else if (selectedFilter === "Medium Risk") matchesFilter = caseItem.risk === "medium"
    else if (selectedFilter === "Low Risk") matchesFilter = caseItem.risk === "low"
    
    return matchesSearch && matchesFilter
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-600 dark:text-red-400 bg-red-500/15 border-red-500/30"
      case "medium": return "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30"
      default: return "text-green-600 dark:text-green-400 bg-green-500/15 border-green-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unread": return <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
      case "read": return <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      default: return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
    }
  }

  return (
    <div className="pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Patient Cases</h1>
          <p className="text-muted-foreground">Review anonymized patient cases with AI-generated insights</p>
        </div>

        {/* Privacy Notice */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-purple-500/30 bg-purple-500/10 px-5 py-3">
          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span className="text-sm text-purple-600 dark:text-purple-400">
            All cases are anonymized. Patient identities are protected through our federated system.
          </span>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by patient ID or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl border-border bg-muted/50 pl-12 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedFilter(option)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  selectedFilter === option
                    ? "bg-purple-600 text-white dark:bg-purple-500"
                    : "border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-foreground">{patientCases.filter(c => c.status === "unread").length}</p>
            <p className="text-sm text-muted-foreground">Unread</p>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{patientCases.filter(c => c.risk === "high").length}</p>
            <p className="text-sm text-muted-foreground">High Risk</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{patientCases.filter(c => c.risk === "medium").length}</p>
            <p className="text-sm text-muted-foreground">Medium Risk</p>
          </div>
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{patientCases.filter(c => c.risk === "low").length}</p>
            <p className="text-sm text-muted-foreground">Low Risk</p>
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          {filteredCases.map((caseItem) => (
            <button
              key={caseItem.id}
              onClick={() => router.push(`/doctor-dashboard/cases/${caseItem.id}`)}
              className={`w-full rounded-3xl border bg-card p-6 text-left transition-all hover:bg-muted shadow-sm ${
                caseItem.status === "unread" ? "border-purple-500/30" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">#{caseItem.id.slice(-2)}</span>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">Patient #{caseItem.id}</h3>
                      {getStatusIcon(caseItem.status)}
                      <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${getRiskColor(caseItem.risk)}`}>
                        {caseItem.risk.charAt(0).toUpperCase() + caseItem.risk.slice(1)} Risk
                      </span>
                    </div>
                    <p className="mb-2 text-muted-foreground">{caseItem.condition}</p>
                    <div className="flex flex-wrap gap-2">
                      {caseItem.biomarkers.map((marker, i) => (
                        <span key={i} className="rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground">
                          {marker}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-purple-600 dark:text-purple-400">{caseItem.aiConfidence}% AI Confidence</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {caseItem.reports} reports
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {caseItem.date}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm">
            <p className="text-muted-foreground">No cases found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

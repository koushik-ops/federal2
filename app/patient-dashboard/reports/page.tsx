"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Clock, 
  ChevronRight,
  X,
  File
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const reports = [
  { id: 1, name: "Blood Test Report", date: "May 18, 2026", type: "Lab Test", status: "analyzed", risk: "low" },
  { id: 2, name: "Chest X-Ray", date: "May 15, 2026", type: "Imaging", status: "analyzed", risk: "medium" },
  { id: 3, name: "ECG Report", date: "May 10, 2026", type: "Cardiology", status: "pending", risk: null },
  { id: 4, name: "MRI Scan Results", date: "May 5, 2026", type: "Imaging", status: "analyzed", risk: "low" },
  { id: 5, name: "Lipid Profile", date: "May 1, 2026", type: "Lab Test", status: "analyzed", risk: "low" },
  { id: 6, name: "Thyroid Panel", date: "April 25, 2026", type: "Lab Test", status: "analyzed", risk: "low" },
  { id: 7, name: "CT Scan Abdomen", date: "April 20, 2026", type: "Imaging", status: "analyzed", risk: "medium" },
  { id: 8, name: "Complete Blood Count", date: "April 15, 2026", type: "Lab Test", status: "analyzed", risk: "low" },
]

const filterOptions = ["All", "Lab Test", "Imaging", "Cardiology"]

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All")
  const router = useRouter()

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "All" || report.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">My Reports</h1>
            <p className="text-muted-foreground">View and manage all your medical reports</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            onClick={() => router.push("/patient-dashboard")}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload New
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/80" />
            <Input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl border-border bg-muted/50 pl-12 text-foreground placeholder:text-muted-foreground/80"
            />
          </div>
          <div className="flex gap-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedFilter(option)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  selectedFilter === option
                    ? "bg-pink-500 text-white"
                    : "border border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <button
              key={report.id}
              onClick={() => router.push(`/patient-dashboard/reports/${report.id}`)}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-6 py-5 transition-all hover:border-pink-500/30 hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-pink-500/10 p-3">
                  <FileText className="h-6 w-6 text-pink-500 dark:text-pink-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{report.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {report.date}
                    </span>
                    <span className="rounded-lg bg-muted px-2 py-0.5 text-xs text-muted-foreground font-medium border border-border">{report.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {report.status === "analyzed" && report.risk && (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium border ${
                    report.risk === "low" ? "bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20" :
                    report.risk === "medium" ? "bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" :
                    "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/20"
                  }`}>
                    {report.risk.charAt(0).toUpperCase() + report.risk.slice(1)} Risk
                  </span>
                )}
                {report.status === "pending" && (
                  <span className="rounded-full bg-muted border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                    Pending Analysis
                  </span>
                )}
                <ChevronRight className="h-5 w-5 text-muted-foreground/80" />
              </div>
            </button>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="rounded-3xl border border-border bg-card p-12 text-center backdrop-blur-xl">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/80" />
            <p className="text-muted-foreground">No reports found</p>
          </div>
        )}
      </div>
    </div>
  )
}


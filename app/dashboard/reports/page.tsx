"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FileText, 
  Upload, 
  Calendar, 
  Eye, 
  Download, 
  Trash2,
  Filter,
  Search,
  Brain
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Report {
  id: number
  name: string
  type: string
  date: string
  status: "analyzed" | "pending" | "processing"
  diseases?: string[]
  confidence?: number
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  const reports: Report[] = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      type: "Blood Test",
      date: "May 15, 2026",
      status: "analyzed",
      diseases: ["Mild Anemia"],
      confidence: 87,
    },
    {
      id: 2,
      name: "Chest X-Ray Report",
      type: "Imaging",
      date: "May 10, 2026",
      status: "analyzed",
      diseases: ["Normal - No Issues"],
      confidence: 95,
    },
    {
      id: 3,
      name: "Lipid Profile Test",
      type: "Blood Test",
      date: "May 5, 2026",
      status: "analyzed",
      diseases: ["Borderline High Cholesterol"],
      confidence: 82,
    },
    {
      id: 4,
      name: "Thyroid Function Test",
      type: "Blood Test",
      date: "April 28, 2026",
      status: "pending",
    },
    {
      id: 5,
      name: "MRI Brain Scan",
      type: "Imaging",
      date: "April 20, 2026",
      status: "processing",
    },
    {
      id: 6,
      name: "Liver Function Test",
      type: "Blood Test",
      date: "April 15, 2026",
      status: "analyzed",
      diseases: ["Normal"],
      confidence: 96,
    },
  ]

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || report.type.toLowerCase().includes(filterType.toLowerCase())
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analyzed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "pending":
        return "bg-muted text-muted-foreground border-border"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Medical Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your uploaded medical reports
          </p>
        </div>
        <Button className="gradient-button text-black font-semibold w-fit">
          <Upload className="mr-2 h-4 w-4" />
          Upload New Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-0"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px] bg-input border-0">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blood">Blood Tests</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="pathology">Pathology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.map((report) => (
          <Card key={report.id} className="glass-card border-border/50 hover:border-primary/30 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <Badge className={getStatusColor(report.status)}>
                  {report.status === "processing" && (
                    <Brain className="mr-1 h-3 w-3 animate-pulse" />
                  )}
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3">{report.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {report.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground">{report.type}</span>
                </div>
                
                {report.status === "analyzed" && report.diseases && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Findings:</span>
                      <span className={`text-sm ${
                        report.diseases[0].includes("Normal") 
                          ? "text-green-400" 
                          : "text-yellow-400"
                      }`}>
                        {report.diseases[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Confidence:</span>
                      <span className="text-foreground">{report.confidence}%</span>
                    </div>
                  </>
                )}
                
                <div className="flex gap-2 pt-2">
                  {report.status === "analyzed" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border"
                      asChild
                    >
                      <Link href={`/dashboard/reports/${report.id}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        View Analysis
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border"
                      disabled={report.status === "processing"}
                    >
                      {report.status === "processing" ? (
                        <>
                          <Brain className="mr-1 h-3 w-3 animate-pulse" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-1 h-3 w-3" />
                          Analyze Now
                        </>
                      )}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card className="glass-card border-border/50">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "Try adjusting your search or filters"
                : "Upload your first medical report to get started"}
            </p>
            <Button className="gradient-button text-black font-semibold">
              <Upload className="mr-2 h-4 w-4" />
              Upload Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

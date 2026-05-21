"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
  Pill,
  Stethoscope,
  TrendingUp,
  Brain,
  Shield,
  Calendar,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportAnalysisPage() {
  const params = useParams()
  const reportId = params.id

  // Mock data for demonstration
  const reportData = {
    id: reportId,
    name: "Complete Blood Count (CBC)",
    type: "Blood Test",
    date: "May 15, 2026",
    analyzedAt: "May 15, 2026 at 2:30 PM",
    confidence: 87,
    diseases: [
      {
        name: "Mild Iron Deficiency Anemia",
        probability: 78,
        severity: "low",
        description: "Lower than normal hemoglobin levels detected, consistent with mild iron deficiency.",
      },
      {
        name: "Vitamin B12 Deficiency",
        probability: 45,
        severity: "low",
        description: "Slightly elevated MCV suggests possible B12 deficiency.",
      },
      {
        name: "Inflammation Marker",
        probability: 32,
        severity: "low",
        description: "Mild elevation in white blood cells may indicate minor inflammation.",
      },
    ],
    biomarkers: [
      { name: "Hemoglobin", value: "11.2", unit: "g/dL", normal: "12-16", status: "low" },
      { name: "RBC Count", value: "4.1", unit: "million/μL", normal: "4.5-5.5", status: "low" },
      { name: "WBC Count", value: "8.5", unit: "thousand/μL", normal: "4-11", status: "normal" },
      { name: "Platelets", value: "245", unit: "thousand/μL", normal: "150-400", status: "normal" },
      { name: "MCV", value: "98", unit: "fL", normal: "80-96", status: "high" },
      { name: "Hematocrit", value: "35", unit: "%", normal: "36-44", status: "low" },
    ],
    suggestions: [
      "Increase iron-rich foods in your diet (red meat, spinach, legumes)",
      "Consider iron supplementation after consulting with your doctor",
      "Get Vitamin B12 levels tested separately",
      "Follow up with a hematologist if symptoms persist",
      "Retest in 4-6 weeks to monitor improvement",
    ],
    recommendedTests: [
      { name: "Serum Iron", reason: "Confirm iron deficiency diagnosis" },
      { name: "Vitamin B12 Level", reason: "Rule out B12 deficiency" },
      { name: "Ferritin Test", reason: "Check iron stores" },
      { name: "Reticulocyte Count", reason: "Assess bone marrow response" },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "text-yellow-400 bg-yellow-500/20"
      case "high":
        return "text-orange-400 bg-orange-500/20"
      case "critical":
        return "text-red-400 bg-red-500/20"
      default:
        return "text-green-400 bg-green-500/20"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/reports">
          <Button variant="ghost" size="sm" className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {reportData.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {reportData.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    Analyzed: {reportData.analyzedAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="border-border">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy Badge */}
      <Badge className="w-fit bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-2 px-3 py-1.5">
        <Shield className="h-4 w-4" />
        Privacy Protected - Data analyzed using Federated AI
      </Badge>

      {/* AI Confidence Score */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-button">
                <Brain className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">MedGemma AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Confidence Score</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-foreground">{reportData.confidence}%</span>
              <p className="text-xs text-muted-foreground">High Confidence</p>
            </div>
          </div>
          <Progress value={reportData.confidence} className="h-2" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="predictions">Disease Predictions</TabsTrigger>
          <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            {reportData.diseases.map((disease, index) => (
              <Card key={index} className="glass-card border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        disease.probability > 70 
                          ? "bg-orange-500/20" 
                          : disease.probability > 40 
                            ? "bg-yellow-500/20" 
                            : "bg-green-500/20"
                      }`}>
                        {disease.probability > 70 ? (
                          <AlertTriangle className={`h-5 w-5 ${
                            disease.probability > 70 ? "text-orange-400" : "text-yellow-400"
                          }`} />
                        ) : (
                          <Info className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{disease.name}</CardTitle>
                        <CardDescription>{disease.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(disease.severity)}>
                      {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Probability</span>
                      <span className="font-semibold text-foreground">{disease.probability}%</span>
                    </div>
                    <Progress value={disease.probability} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Biomarkers Tab */}
        <TabsContent value="biomarkers" className="space-y-4">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Blood Test Results
              </CardTitle>
              <CardDescription>
                Detailed breakdown of your test parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.biomarkers.map((marker, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        marker.status === "normal" 
                          ? "bg-green-400" 
                          : marker.status === "low" 
                            ? "bg-yellow-400" 
                            : "bg-orange-400"
                      }`} />
                      <div>
                        <p className="font-medium text-foreground">{marker.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Normal: {marker.normal} {marker.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        marker.status === "normal" 
                          ? "text-green-400" 
                          : marker.status === "low" 
                            ? "text-yellow-400" 
                            : "text-orange-400"
                      }`}>
                        {marker.value} {marker.unit}
                      </p>
                      <Badge className={`text-xs ${getStatusColor(marker.status)}`}>
                        {marker.status.charAt(0).toUpperCase() + marker.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          {/* Health Suggestions */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Health Improvement Suggestions
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Tests */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Recommended Confirmatory Tests
              </CardTitle>
              <CardDescription>
                Additional tests to confirm diagnosis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {reportData.recommendedTests.map((test, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <p className="font-medium text-foreground mb-1">{test.name}</p>
                    <p className="text-sm text-muted-foreground">{test.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Doctor Consultation */}
          <Card className="glass-card border-primary/30">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Consult a Specialist
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get expert opinion from a hematologist
                    </p>
                  </div>
                </div>
                <Button className="gradient-button text-black font-semibold" asChild>
                  <Link href="/dashboard/doctors">
                    Find Doctors Nearby
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

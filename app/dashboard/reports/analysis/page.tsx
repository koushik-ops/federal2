"use client"

import { useRouter } from "next/navigation"
import { 
  Brain, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  Activity,
  TrendingUp,
  Stethoscope,
  FileText,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function AnalysisResultPage() {
  const router = useRouter()

  // Mock analysis results
  const analysisResults = {
    confidence: 89,
    analyzedAt: new Date().toLocaleString(),
    diseases: [
      {
        name: "Type 2 Diabetes Risk",
        probability: 72,
        severity: "medium",
        description: "Elevated fasting glucose levels indicate pre-diabetic condition.",
      },
      {
        name: "Hypertension Risk",
        probability: 58,
        severity: "low",
        description: "Slightly elevated blood pressure readings suggest early-stage hypertension.",
      },
      {
        name: "Vitamin D Deficiency",
        probability: 85,
        severity: "low",
        description: "Low vitamin D levels detected, common in many populations.",
      },
    ],
    suggestions: [
      "Reduce sugar and refined carbohydrate intake",
      "Increase physical activity to at least 30 minutes daily",
      "Consider vitamin D supplementation (consult doctor first)",
      "Monitor blood pressure regularly",
      "Schedule a follow-up test in 3 months",
    ],
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
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-full gradient-button mb-4">
          <Brain className="h-8 w-8 text-black" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Analysis Complete
        </h1>
        <p className="text-muted-foreground mt-2">
          MedGemma AI has analyzed your medical report
        </p>
      </div>

      {/* Privacy Badge */}
      <div className="flex justify-center">
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-2 px-4 py-2">
          <Shield className="h-4 w-4" />
          Data Protected with Federated AI - Your data never leaves your device
        </Badge>
      </div>

      {/* Confidence Score */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Confidence Score</h3>
                <p className="text-sm text-muted-foreground">
                  Analyzed at {analysisResults.analyzedAt}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold gradient-pink-purple">
                {analysisResults.confidence}%
              </span>
            </div>
          </div>
          <Progress value={analysisResults.confidence} className="h-3" />
        </CardContent>
      </Card>

      {/* Disease Predictions */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Disease Risk Predictions
          </CardTitle>
          <CardDescription>
            Potential health conditions identified from your report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisResults.diseases.map((disease, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-muted/30 border border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{disease.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {disease.description}
                  </p>
                </div>
                <Badge className={getSeverityColor(disease.severity)}>
                  {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)} Risk
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Probability</span>
                  <span className="font-semibold text-foreground">{disease.probability}%</span>
                </div>
                <Progress 
                  value={disease.probability} 
                  className={`h-2 ${
                    disease.probability > 70 
                      ? "[&>div]:bg-orange-400" 
                      : disease.probability > 50 
                        ? "[&>div]:bg-yellow-400" 
                        : "[&>div]:bg-green-400"
                  }`} 
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Health Improvement Suggestions
          </CardTitle>
          <CardDescription>
            Personalized recommendations from AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResults.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <Link href="/dashboard/doctors" className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Consult a Doctor</h3>
                <p className="text-sm text-muted-foreground">
                  Book appointment with specialists nearby
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:border-secondary/30 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <Link href="/dashboard/reports" className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/20">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">View All Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Access your complete medical history
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Save Report */}
      <div className="flex justify-center">
        <Button 
          className="gradient-button text-black font-semibold px-8"
          onClick={() => router.push("/dashboard/reports")}
        >
          Save to My Reports
        </Button>
      </div>
    </div>
  )
}

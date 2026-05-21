"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Upload, 
  MessageSquare, 
  FileText, 
  Activity, 
  Shield, 
  Brain,
  ArrowRight,
  Image as ImageIcon,
  File,
  X,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function DashboardHomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    
    setIsAnalyzing(true)
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
    router.push("/dashboard/reports/analysis")
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return
    router.push(`/dashboard/chat?q=${encodeURIComponent(chatMessage)}`)
  }

  const recentReports = [
    { id: 1, name: "Blood Test Report", date: "May 15, 2026", status: "Analyzed" },
    { id: 2, name: "X-Ray Scan", date: "May 10, 2026", status: "Pending" },
    { id: 3, name: "MRI Results", date: "May 5, 2026", status: "Analyzed" },
  ]

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, <span className="gradient-pink-purple">User</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Your AI-powered health companion is ready to assist you
          </p>
        </div>
        <Badge className="w-fit flex items-center gap-2 bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1.5">
          <Shield className="h-4 w-4" />
          Privacy Protected - Federated AI
        </Badge>
      </div>

      {/* Main Action Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Report Card */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Medical Report
            </CardTitle>
            <CardDescription>
              Upload your medical reports for AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? "border-primary bg-primary/10" 
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                onChange={handleFileChange}
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <File className="h-10 w-10 text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedFile(null)}
                      className="ml-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full gradient-button text-black font-semibold"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="mr-2 h-4 w-4 animate-pulse" />
                        Analyzing with MedGemma AI...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary/20">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="p-3 rounded-full bg-secondary/20">
                      <ImageIcon className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <p className="text-foreground font-medium mb-1">
                    Drag & drop your files here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports PDF, Images, DOCX
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-border"
                  >
                    Browse Files
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Chat Card */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-secondary" />
              Chat with AI Doctor
            </CardTitle>
            <CardDescription>
              Describe your symptoms and get instant AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChatSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Describe your symptoms..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="h-24 pt-3 pb-12 bg-input border-0 rounded-xl resize-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute bottom-3 right-3 gradient-button text-black"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border-border"
                  onClick={() => setChatMessage("I have a headache and fever")}
                >
                  Headache & Fever
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border-border"
                  onClick={() => setChatMessage("Feeling tired and weak")}
                >
                  Fatigue
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border-border"
                  onClick={() => setChatMessage("Stomach pain after eating")}
                >
                  Stomach Pain
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Analyses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <MessageSquare className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">AI Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Private</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="glass-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your latest medical report analyses</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href="/dashboard/reports">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <Badge 
                  variant={report.status === "Analyzed" ? "default" : "secondary"}
                  className={report.status === "Analyzed" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                >
                  {report.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useRef } from "react"
import { 
  Pill, 
  Upload, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Info,
  Brain,
  Shield,
  X,
  File,
  Clock,
  Droplet,
  Heart,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface Medicine {
  name: string
  genericName: string
  dosage: string
  frequency: string
  duration: string
  composition: string[]
  uses: string[]
  sideEffects: string[]
  precautions: string[]
  alternatives: { name: string; price: string }[]
}

export default function PrescriptionsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    await new Promise(resolve => setTimeout(resolve, 2500))
    setIsAnalyzing(false)
    setAnalyzed(true)
  }

  const medicines: Medicine[] = [
    {
      name: "Metformin 500mg",
      genericName: "Metformin Hydrochloride",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "30 days",
      composition: ["Metformin Hydrochloride 500mg"],
      uses: [
        "Controls blood sugar levels in Type 2 Diabetes",
        "Helps improve insulin sensitivity",
        "May aid in weight management",
      ],
      sideEffects: [
        "Nausea and vomiting (common initially)",
        "Diarrhea",
        "Stomach upset",
        "Metallic taste",
        "Vitamin B12 deficiency (long-term use)",
      ],
      precautions: [
        "Take with meals to reduce stomach upset",
        "Avoid alcohol consumption",
        "Stay hydrated",
        "Monitor kidney function regularly",
        "Inform doctor before any surgery",
      ],
      alternatives: [
        { name: "Glycomet 500mg", price: "Rs 45" },
        { name: "Glucophage 500mg", price: "Rs 85" },
        { name: "Obimet 500mg", price: "Rs 38" },
      ],
    },
    {
      name: "Amlodipine 5mg",
      genericName: "Amlodipine Besylate",
      dosage: "5mg",
      frequency: "Once daily",
      duration: "30 days",
      composition: ["Amlodipine Besylate 5mg"],
      uses: [
        "Controls high blood pressure",
        "Treats angina (chest pain)",
        "Reduces risk of stroke and heart attack",
      ],
      sideEffects: [
        "Swelling in ankles/feet",
        "Dizziness",
        "Flushing",
        "Fatigue",
        "Palpitations",
      ],
      precautions: [
        "Take at the same time each day",
        "Avoid grapefruit juice",
        "Rise slowly from sitting/lying position",
        "Do not stop suddenly without consulting doctor",
      ],
      alternatives: [
        { name: "Amlong 5mg", price: "Rs 32" },
        { name: "Norvasc 5mg", price: "Rs 120" },
        { name: "Amlopin 5mg", price: "Rs 28" },
      ],
    },
    {
      name: "Vitamin D3 60000 IU",
      genericName: "Cholecalciferol",
      dosage: "60000 IU",
      frequency: "Once weekly",
      duration: "8 weeks",
      composition: ["Cholecalciferol (Vitamin D3) 60000 IU"],
      uses: [
        "Treats Vitamin D deficiency",
        "Supports bone health",
        "Boosts immune function",
        "Helps calcium absorption",
      ],
      sideEffects: [
        "Generally well tolerated",
        "Rare: nausea, constipation",
        "Very rare: hypercalcemia with overdose",
      ],
      precautions: [
        "Take with a fatty meal for better absorption",
        "Do not exceed recommended dose",
        "Get sunlight exposure when possible",
        "Monitor calcium levels if taking long-term",
      ],
      alternatives: [
        { name: "Uprise D3 60K", price: "Rs 30" },
        { name: "Tayo 60K", price: "Rs 35" },
        { name: "D-Rise 60K", price: "Rs 28" },
      ],
    },
  ]

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const recentPrescriptions = [
    { id: 1, doctor: "Dr. Priya Sharma", date: "May 15, 2026", medicines: 3 },
    { id: 2, doctor: "Dr. Rajesh Kumar", date: "April 28, 2026", medicines: 2 },
    { id: 3, doctor: "Dr. Anita Patel", date: "April 10, 2026", medicines: 4 },
  ]

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Prescription Analysis
        </h1>
        <p className="text-muted-foreground mt-1">
          Upload prescriptions to understand your medicines better
        </p>
      </div>

      {/* Upload Section */}
      {!analyzed && (
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Prescription
            </CardTitle>
            <CardDescription>
              Upload your prescription image or PDF for AI-powered analysis
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
                        Analyzing Prescription...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Analyze Prescription
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/20">
                      <Pill className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-foreground font-medium mb-1">
                    Drag & drop your prescription here
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
            
            {/* Privacy Badge */}
            <div className="flex justify-center mt-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Your prescription data is encrypted and private
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analyzed && (
        <>
          {/* Analysis Header */}
          <Card className="glass-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg gradient-button">
                    <Brain className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">MedGemma AI Analysis</h3>
                    <p className="text-sm text-muted-foreground">3 medicines identified</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-border"
                  onClick={() => {
                    setAnalyzed(false)
                    setSelectedFile(null)
                  }}
                >
                  Upload New
                </Button>
              </div>
              <Progress value={100} className="h-2" />
            </CardContent>
          </Card>

          {/* Search Medicines */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-0"
            />
          </div>

          {/* Medicines List */}
          <div className="space-y-4">
            {filteredMedicines.map((medicine, index) => (
              <Card key={index} className="glass-card border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Pill className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{medicine.name}</CardTitle>
                        <CardDescription>{medicine.genericName}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        <Clock className="mr-1 h-3 w-3" />
                        {medicine.frequency}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{medicine.duration}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="uses" className="w-full">
                    <TabsList className="w-full bg-muted/50 p-1">
                      <TabsTrigger value="uses" className="flex-1 text-xs">Uses</TabsTrigger>
                      <TabsTrigger value="sideEffects" className="flex-1 text-xs">Side Effects</TabsTrigger>
                      <TabsTrigger value="precautions" className="flex-1 text-xs">Precautions</TabsTrigger>
                      <TabsTrigger value="alternatives" className="flex-1 text-xs">Alternatives</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="uses" className="mt-4">
                      <div className="space-y-2">
                        {medicine.uses.map((use, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-green-500/10">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground">{use}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sideEffects" className="mt-4">
                      <div className="space-y-2">
                        {medicine.sideEffects.map((effect, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/10">
                            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground">{effect}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="precautions" className="mt-4">
                      <div className="space-y-2">
                        {medicine.precautions.map((precaution, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/10">
                            <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground">{precaution}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="alternatives" className="mt-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Safer or more affordable alternatives (consult doctor before switching)
                      </p>
                      <div className="grid gap-2 md:grid-cols-3">
                        {medicine.alternatives.map((alt, i) => (
                          <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                            <p className="font-medium text-foreground">{alt.name}</p>
                            <p className="text-sm text-secondary">{alt.price}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Recent Prescriptions */}
      {!analyzed && (
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
            <CardDescription>Previously analyzed prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{prescription.doctor}</p>
                      <p className="text-xs text-muted-foreground">{prescription.date}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {prescription.medicines} medicines
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

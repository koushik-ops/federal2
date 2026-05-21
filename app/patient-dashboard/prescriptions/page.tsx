"use client"

import { useState, useRef } from "react"
import { 
  Upload, 
  Pill, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText,
  X,
  Sparkles,
  Shield,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Medicine {
  name: string
  composition: string
  uses: string[]
  dosage: string
  sideEffects: string[]
  precautions: string[]
  saferAlternatives: string[]
}

const analyzedMedicines: Medicine[] = [
  {
    name: "Metformin 500mg",
    composition: "Metformin Hydrochloride 500mg",
    uses: ["Controls blood sugar levels in Type 2 Diabetes", "Improves insulin sensitivity", "May help with weight management"],
    dosage: "Take 1 tablet twice daily with meals. Do not crush or chew.",
    sideEffects: ["Nausea", "Stomach upset", "Diarrhea", "Metallic taste in mouth"],
    precautions: ["Avoid alcohol consumption", "Stay hydrated", "Inform doctor if you have kidney issues", "Stop before any surgery or contrast imaging"],
    saferAlternatives: ["Extended-release Metformin (less GI side effects)", "Glimepiride (if metformin not tolerated)"]
  },
  {
    name: "Amlodipine 5mg",
    composition: "Amlodipine Besylate 5mg",
    uses: ["Lowers high blood pressure", "Prevents chest pain (angina)", "Reduces risk of heart attack and stroke"],
    dosage: "Take 1 tablet once daily. Can be taken with or without food.",
    sideEffects: ["Swelling in ankles/feet", "Dizziness", "Flushing", "Fatigue"],
    precautions: ["Rise slowly from sitting or lying position", "Avoid grapefruit juice", "Monitor blood pressure regularly"],
    saferAlternatives: ["Losartan (if swelling occurs)", "Lisinopril (alternative blood pressure medication)"]
  }
]

export default function PrescriptionsPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [expandedMedicine, setExpandedMedicine] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    if (files.length === 0) return
    setIsAnalyzing(true)
    setAnalyzeProgress(0)
    
    for (let i = 0; i <= 100; i += 5) {
      setAnalyzeProgress(i)
      await new Promise(r => setTimeout(r, 100))
    }
    
    setIsAnalyzing(false)
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">Prescription Analysis</h1>
          <p className="text-gray-400">
            Upload your prescription and let AI help you understand your medicines better
          </p>
        </div>

        {/* Privacy Badge */}
        <div className="mb-6 flex items-center gap-3 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 w-fit">
          <Shield className="h-4 w-4 text-green-400" />
          <span className="text-sm text-green-400">Your prescription data is encrypted and never shared</span>
        </div>

        {/* Upload Section */}
        {!showResults && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
                isDragging
                  ? "border-pink-500 bg-pink-500/10"
                  : "border-white/20 hover:border-pink-500/50 hover:bg-white/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="mb-4 flex justify-center">
                <div className={`rounded-2xl p-4 transition-all ${
                  isDragging ? "bg-pink-500/20" : "bg-white/5 group-hover:bg-pink-500/10"
                }`}>
                  <Pill className={`h-10 w-10 ${isDragging ? "text-pink-400" : "text-gray-400 group-hover:text-pink-400"}`} />
                </div>
              </div>
              <p className="mb-2 text-lg font-medium text-white">
                {isDragging ? "Drop prescription here" : "Upload your prescription"}
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOCX, and image formats
              </p>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-400">Selected Files ({files.length})</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-pink-500/20 p-2 text-pink-400">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress */}
            {isAnalyzing && (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-400">Analyzing prescription with MedGemma AI...</span>
                  <span className="text-pink-400">{analyzeProgress}%</span>
                </div>
                <Progress value={analyzeProgress} className="h-2" />
              </div>
            )}

            {/* Analyze Button */}
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={files.length === 0 || isAnalyzing}
                className="h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-8 text-lg font-semibold text-white"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Prescription
              </Button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Medicines Found ({analyzedMedicines.length})</h2>
              <Button
                variant="outline"
                onClick={() => { setShowResults(false); setFiles([]) }}
                className="border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                Upload New
              </Button>
            </div>

            {/* Medicine Cards */}
            {analyzedMedicines.map((medicine, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
              >
                {/* Medicine Header */}
                <button
                  onClick={() => setExpandedMedicine(expandedMedicine === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                      <Pill className="h-7 w-7 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{medicine.name}</h3>
                      <p className="text-sm text-gray-400">{medicine.composition}</p>
                    </div>
                  </div>
                  {expandedMedicine === index ? (
                    <ChevronUp className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  )}
                </button>

                {/* Expanded Content */}
                {expandedMedicine === index && (
                  <div className="border-t border-white/10 p-6 space-y-6">
                    {/* Uses */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        What it&apos;s used for
                      </h4>
                      <ul className="space-y-2">
                        {medicine.uses.map((use, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                            {use}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dosage */}
                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
                        <Clock className="h-4 w-4" />
                        Dosage Instructions
                      </h4>
                      <p className="text-sm text-gray-300">{medicine.dosage}</p>
                    </div>

                    {/* Side Effects */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-yellow-400">
                        <AlertCircle className="h-4 w-4" />
                        Possible Side Effects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {medicine.sideEffects.map((effect, i) => (
                          <span
                            key={i}
                            className="rounded-lg bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400"
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Precautions */}
                    <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-orange-400">
                        <AlertCircle className="h-4 w-4" />
                        Precautions
                      </h4>
                      <ul className="space-y-2">
                        {medicine.precautions.map((precaution, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                            {precaution}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Safer Alternatives */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-purple-400">
                        <Sparkles className="h-4 w-4" />
                        Safer Alternatives (discuss with doctor)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {medicine.saferAlternatives.map((alt, i) => (
                          <span
                            key={i}
                            className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-400"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Disclaimer */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <p className="text-sm text-gray-500">
                This analysis is for informational purposes only. Always consult your healthcare provider 
                before making any changes to your medication.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

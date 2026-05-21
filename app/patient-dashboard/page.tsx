"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Upload, 
  FileText, 
  MessageSquare, 
  Shield, 
  Sparkles, 
  Clock,
  ChevronRight,
  X,
  File,
  Image as ImageIcon,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const recentReports = [
  { id: 1, name: "Blood Test Report", date: "May 18, 2026", status: "analyzed", risk: "low" },
  { id: 2, name: "Chest X-Ray", date: "May 15, 2026", status: "analyzed", risk: "medium" },
  { id: 3, name: "ECG Report", date: "May 10, 2026", status: "pending", risk: null },
  { id: 4, name: "MRI Scan Results", date: "May 5, 2026", status: "analyzed", risk: "low" },
  { id: 5, name: "Lipid Profile", date: "May 1, 2026", status: "analyzed", risk: "low" },
]

export default function PatientHomePage() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<{role: "bot" | "user", text: string}[]>([
    { role: "bot", text: "Hey, this is PulseKin Doc. How can I help you today? You can tell me about your symptoms or upload your medical reports for analysis." }
  ])
  const [chatInput, setChatInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Show chatbot greeting after 1 second
    const timer = setTimeout(() => setShowChatbot(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

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

  const handleGenerateAnalysis = async () => {
    if (files.length === 0) return
    setIsUploading(true)
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise(r => setTimeout(r, 200))
    }
    router.push("/patient-dashboard/analysis")
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    
    setChatMessages(prev => [...prev, { role: "user", text: chatInput }])
    const userMessage = chatInput
    setChatInput("")
    
    // Simulate AI response
    setTimeout(() => {
      let response = "I understand. "
      if (userMessage.toLowerCase().includes("headache") || userMessage.toLowerCase().includes("pain")) {
        response += "Can you tell me more about when this started and how severe the pain is on a scale of 1-10?"
      } else if (userMessage.toLowerCase().includes("fever") || userMessage.toLowerCase().includes("temperature")) {
        response += "How high is your temperature? Have you experienced any other symptoms like chills or body aches?"
      } else if (userMessage.toLowerCase().includes("cough") || userMessage.toLowerCase().includes("cold")) {
        response += "Is the cough dry or productive? Have you noticed any difficulty breathing?"
      } else {
        response += "Could you describe your symptoms in more detail? When did they start and how have they progressed?"
      }
      setChatMessages(prev => [...prev, { role: "bot", text: response }])
    }, 1000)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Privacy Badge */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">Privacy Protected using Federated AI</span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          </div>
        </div>

        {/* Main Upload Section */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-transparent p-8 backdrop-blur-xl">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">Upload Your Medical Reports</h1>
            <p className="text-gray-400">Upload reports, scans, prescriptions for AI-powered health analysis</p>
          </div>

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
                <Upload className={`h-10 w-10 ${isDragging ? "text-pink-400" : "text-gray-400 group-hover:text-pink-400"}`} />
              </div>
            </div>
            <p className="mb-2 text-lg font-medium text-white">
              {isDragging ? "Drop files here" : "Drag & drop your files here"}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse - PDF, DOCX, Images supported
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
                        {getFileIcon(file)}
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

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-400">Processing files...</span>
                <span className="text-pink-400">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Generate Analysis Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleGenerateAnalysis}
              disabled={files.length === 0 || isUploading}
              className="h-14 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-12 text-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              <Sparkles className="mr-3 h-5 w-5" />
              Generate AI Analysis
            </Button>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Reports</h2>
            <Button variant="ghost" className="text-pink-400 hover:text-pink-300" onClick={() => router.push("/patient-dashboard/reports")}>
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <button
                key={report.id}
                onClick={() => router.push(`/patient-dashboard/reports/${report.id}`)}
                className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4 transition-all hover:border-pink-500/30 hover:bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-pink-500/10 p-3">
                    <FileText className="h-5 w-5 text-pink-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">{report.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {report.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.status === "analyzed" && report.risk && (
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      report.risk === "low" ? "bg-green-500/20 text-green-400" :
                      report.risk === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {report.risk.charAt(0).toUpperCase() + report.risk.slice(1)} Risk
                    </span>
                  )}
                  {report.status === "pending" && (
                    <span className="rounded-full bg-gray-500/20 px-3 py-1 text-xs font-medium text-gray-400">
                      Pending
                    </span>
                  )}
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Chatbot */}
      {showChatbot && (
        <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
          {/* Chat Window */}
          <div className="mb-4 hidden w-80 overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl peer-checked:block" id="chatWindow">
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black bg-green-500" />
                </div>
                <div>
                  <p className="font-medium text-white">PulseKin Doc</p>
                  <p className="text-xs text-green-400">Online</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const el = document.getElementById("chatWindow")
                  if (el) el.classList.toggle("hidden")
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-72 space-y-4 overflow-y-auto p-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" 
                      : "bg-white/10 text-gray-200"
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="border-t border-white/10 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe your symptoms..."
                  className="flex-1 rounded-xl border-0 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <Button type="submit" size="sm" className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Floating Button */}
          <button
            onClick={() => {
              const el = document.getElementById("chatWindow")
              if (el) el.classList.toggle("hidden")
            }}
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/30 transition-transform hover:scale-110"
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}

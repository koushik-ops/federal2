"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Send, 
  Shield, 
  Sparkles, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  Clock, 
  Stethoscope, 
  CheckSquare, 
  Info,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StructuredResponse {
  reply: string;
  follow_up_question: string;
  summary: string;
  specialist: string;
  readiness_score: number;
  recommendations: string[];
  checklist: string[];
}

interface Message {
  role: "bot" | "user";
  text: string;
}

export default function AppointReadyPage() {
  const [sessionId, setSessionId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [sharedId, setSharedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [structuredData, setStructuredData] = useState<StructuredResponse>({
    reply: "Hello! I am your AppointReady intake assistant. Let's gather your symptoms. What symptoms are you experiencing today?",
    follow_up_question: "What symptoms are you experiencing today?",
    summary: "Intake not started yet. Please describe your symptoms in the chat.",
    specialist: "General Physician",
    readiness_score: 10,
    recommendations: [],
    checklist: []
  })

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Initialize session ID and greeting
  useEffect(() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    setSessionId(id)
    setMessages([
      { 
        role: "bot", 
        text: "Hello! I am your AppointReady AI intake assistant. I will help prepare you for your next doctor appointment by gathering clinical context and generating a readiness summary. What symptoms are you experiencing today?" 
      }
    ])
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const getAuthToken = async () => {
    let token = localStorage.getItem("pulsekin_token")
    if (!token) {
      const storedUser = localStorage.getItem("pulsekin_user")
      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser)
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
          const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: userObj.role || "patient",
              email: userObj.email || "patient@demo.com",
              password: "demo123"
            })
          })
          if (loginRes.ok) {
            const loginData = await loginRes.json()
            if (loginData.token) {
              token = loginData.token
              localStorage.setItem("pulsekin_token", loginData.token)
            }
          }
        } catch (e) {
          console.error("Failed to auto-authenticate:", e)
        }
      }
    }
    return token
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || loading) return

    const userMsg = chatInput.trim()
    setMessages(prev => [...prev, { role: "user", text: userMsg }])
    setChatInput("")
    setLoading(true)
    setError(null)

    try {
      const token = await getAuthToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      const res = await fetch(`${apiUrl}/api/appoint-ready/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMsg
        })
      })

      if (!res.ok) {
        throw new Error("Failed to communicate with AI intake assistant")
      }

      const data = await res.json()
      if (data.success && data.response) {
        const response: StructuredResponse = data.response
        setStructuredData(response)
        setMessages(prev => [...prev, { role: "bot", text: response.reply }])
      } else {
        throw new Error("Invalid response format received")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An error occurred. Please try again.")
      setMessages(prev => [
        ...prev, 
        { role: "bot", text: "I apologize, but I encountered an error. Let's try again. Could you please rephrase your symptoms?" }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!sessionId || downloadingPdf) return
    setDownloadingPdf(true)
    try {
      const token = await getAuthToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const res = await fetch(`${apiUrl}/api/appoint-ready/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: sessionId })
      })

      if (!res.ok) {
        throw new Error("Failed to generate report PDF")
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `PulseKin_Intake_${sessionId.substring(8, 14).toUpperCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Failed to download PDF report.")
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleShareWithDoctor = async () => {
    if (!sessionId || sharing || sharedId) return
    setSharing(true)
    try {
      const token = await getAuthToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const res = await fetch(`${apiUrl}/api/appoint-ready/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: sessionId })
      })

      if (!res.ok) {
        throw new Error("Failed to share report with doctor queue")
      }

      const data = await res.json()
      if (data.success) {
        setSharedId(data.anonymous_id)
      } else {
        throw new Error("Failed to register shared case")
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Failed to share report anonymously.")
    } finally {
      setSharing(false)
    }
  }

  const handleReset = () => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    setSessionId(id)
    setMessages([
      { 
        role: "bot", 
        text: "Resetting intake checklist. What symptoms are we preparing for today?" 
      }
    ])
    setStructuredData({
      reply: "Resetting details...",
      follow_up_question: "What symptoms are you experiencing today?",
      summary: "Intake not started yet. Please describe your symptoms in the chat.",
      specialist: "General Physician",
      readiness_score: 10,
      recommendations: [],
      checklist: []
    })
    setSharedId(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-8">
        
        {/* Top privacy bar */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              AppointReady<span className="text-sm font-normal text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">AI Intake</span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Prepare clinical context, checklists, and summary reports prior to your consultation.</p>
          </div>
          
          <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/5 px-4 py-2 text-xs text-green-400">
            <Shield className="h-4 w-4" />
            <span>Absolute Anonymity Locked — No Patient Identity Transmitted</span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-500/30 bg-red-500/10 text-red-400">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle>Intake API Connection Issue</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Chat Conversation Column */}
          <div className="lg:col-span-7 flex flex-col h-[600px] rounded-3xl border border-white/10 bg-white/[0.01] overflow-hidden backdrop-blur-xl">
            <div className="border-b border-white/10 bg-white/[0.02] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-sm font-semibold text-white">Intake Chat Flow</span>
              </div>
              <button 
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Restart conversational workflow"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset Flow
              </button>
            </div>

            {/* Chat message area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-md shadow-pink-500/10" 
                      : "bg-white/5 border border-white/5 text-gray-200"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl px-5 py-3 flex items-center gap-2 text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    <span className="text-xs">Analyzing symptoms...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Submission */}
            <form onSubmit={handleChatSubmit} className="border-t border-white/10 p-4 bg-white/[0.01]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe how you are feeling (e.g. I have a dull lower back ache since yesterday)..."
                  className="flex-1 h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  disabled={loading || !chatInput.trim()}
                  className="h-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 font-semibold"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* RIGHT: Intake Telemetry Dashboard */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Context Readiness Score */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.01] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Clinical Context Readiness</h3>
                <span className={`text-sm font-bold ${
                  structuredData.readiness_score >= 70 ? "text-green-400" :
                  structuredData.readiness_score >= 40 ? "text-yellow-400" :
                  "text-red-400"
                }`}>
                  {structuredData.readiness_score}%
                </span>
              </div>
              <Progress 
                value={structuredData.readiness_score} 
                className="h-3.5 rounded-full mb-3" 
              />
              <p className="text-xs text-gray-500">
                {structuredData.readiness_score >= 70 
                  ? "✓ Highly prepared for specialist appointment. Ready to export." 
                  : "ⓘ Keep chatting. Answering more questions creates a more detailed physician report."
                }
              </p>
            </div>

            {/* Recommended Specialist Card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/5 to-transparent p-6 backdrop-blur-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Suggested Specialist</p>
                  <p className="text-lg font-bold text-white mt-0.5">{structuredData.specialist}</p>
                </div>
              </div>
              <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-medium">
                Matched Node
              </span>
            </div>

            {/* Preparation Summary Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.01] p-6 backdrop-blur-xl flex-1">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-purple-400" />
                Consolidated Intake Summary
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-4 min-h-[80px]">
                {structuredData.summary || "Start speaking to build symptoms context..."}
              </p>
              
              {/* Recommendations & Checklists */}
              {structuredData.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Clinical Recommendations</h4>
                  <ul className="space-y-2">
                    {structuredData.recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {structuredData.checklist.length > 0 && (
                <div className="mt-4 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="h-3.5 w-3.5" />
                    Appointment Preparation Checklist
                  </h4>
                  <ul className="space-y-2">
                    {structuredData.checklist.slice(0, 3).map((chk, idx) => (
                      <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                        <span className="text-purple-400 font-bold">☐</span>
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleDownloadPDF}
                disabled={downloadingPdf || structuredData.readiness_score < 20}
                className="h-12 rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                variant="outline"
              >
                {downloadingPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download PDF
              </Button>

              <Button
                onClick={handleShareWithDoctor}
                disabled={sharing || !!sharedId || structuredData.readiness_score < 20}
                className={`h-12 rounded-2xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  sharedId 
                    ? "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/20 cursor-default"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 shadow-lg shadow-pink-500/10"
                }`}
              >
                {sharing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : sharedId ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    Shared ({sharedId})
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share with Doctor
                  </>
                )}
              </Button>
            </div>
            
            {sharedId && (
              <p className="text-[10px] text-green-400/80 text-center -mt-2 bg-green-500/5 border border-green-500/10 py-1.5 px-3 rounded-xl">
                ✓ Shared anonymously as case code <b>{sharedId}</b>. Case is now registered on Doctor Portal specialist queue.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

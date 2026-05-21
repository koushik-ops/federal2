"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Shield, Mic, Paperclip, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  role: "bot" | "user"
  text: string
  timestamp: Date
}

const initialMessages: Message[] = [
  { 
    role: "bot", 
    text: "Hello! I'm PulseKin Doc, your AI health assistant powered by MedGemma. I'm here to help you understand your symptoms and provide preliminary health guidance. What brings you here today?", 
    timestamp: new Date() 
  }
]

const quickPrompts = [
  "I have a headache",
  "Feeling tired lately",
  "Stomach issues",
  "Skin problem",
  "Sleep difficulties",
  "Anxiety symptoms"
]

export default function ChatDoctorPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [symptomHistory, setSymptomHistory] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase()
    
    // Track symptoms
    const newSymptoms: string[] = []
    if (lowerMsg.includes("headache") || lowerMsg.includes("head pain")) newSymptoms.push("headache")
    if (lowerMsg.includes("fever") || lowerMsg.includes("temperature")) newSymptoms.push("fever")
    if (lowerMsg.includes("cough")) newSymptoms.push("cough")
    if (lowerMsg.includes("tired") || lowerMsg.includes("fatigue")) newSymptoms.push("fatigue")
    if (lowerMsg.includes("nausea") || lowerMsg.includes("vomit")) newSymptoms.push("nausea")
    if (lowerMsg.includes("stomach") || lowerMsg.includes("abdomen")) newSymptoms.push("abdominal discomfort")
    if (lowerMsg.includes("sleep") || lowerMsg.includes("insomnia")) newSymptoms.push("sleep issues")
    if (lowerMsg.includes("anxious") || lowerMsg.includes("anxiety") || lowerMsg.includes("stress")) newSymptoms.push("anxiety")
    
    if (newSymptoms.length > 0) {
      setSymptomHistory(prev => [...new Set([...prev, ...newSymptoms])])
    }

    // Generate contextual responses
    if (lowerMsg.includes("headache") || lowerMsg.includes("head pain")) {
      return "I understand you're experiencing headaches. To help assess this better, could you tell me:\n\n1. Where exactly is the pain located? (front, sides, or back of head)\n2. How would you rate the severity from 1-10?\n3. How long have you been experiencing this?\n4. Is it constant or does it come and go?\n5. Have you noticed any triggers like stress, light, or certain foods?"
    }
    
    if (lowerMsg.includes("fever") || lowerMsg.includes("temperature")) {
      return "A fever is your body's response to infection or illness. Let me gather more information:\n\n1. What is your current temperature reading?\n2. When did the fever start?\n3. Are you experiencing any other symptoms like chills, sweating, or body aches?\n4. Have you taken any medication for it?\n5. Have you been in contact with anyone who was sick recently?"
    }
    
    if (lowerMsg.includes("tired") || lowerMsg.includes("fatigue") || lowerMsg.includes("exhausted")) {
      return "Persistent fatigue can have many causes. To understand your situation better:\n\n1. How long have you been feeling this way?\n2. Are you getting 7-8 hours of sleep?\n3. Has there been any change in your diet or exercise routine?\n4. Are you under more stress than usual?\n5. Any other symptoms like weight changes, mood changes, or difficulty concentrating?"
    }
    
    if (lowerMsg.includes("stomach") || lowerMsg.includes("abdomen") || lowerMsg.includes("digestive")) {
      return "Let me help you with your digestive concerns:\n\n1. Can you describe the discomfort? (pain, bloating, cramping, etc.)\n2. When does it usually occur? (before/after meals, at night, etc.)\n3. Have you noticed any changes in your bowel movements?\n4. Any recent changes in your diet?\n5. Are you experiencing nausea or loss of appetite?"
    }
    
    if (lowerMsg.includes("anxiety") || lowerMsg.includes("anxious") || lowerMsg.includes("stress") || lowerMsg.includes("worried")) {
      return "I hear that you're dealing with anxiety or stress. This is quite common and manageable. Could you share:\n\n1. How long have you been feeling this way?\n2. Are there specific triggers or situations that worsen it?\n3. How is it affecting your daily life and sleep?\n4. Have you tried any coping strategies?\n5. Is this accompanied by physical symptoms like racing heart or shortness of breath?"
    }
    
    if (lowerMsg.includes("sleep") || lowerMsg.includes("insomnia") || lowerMsg.includes("can't sleep")) {
      return "Sleep problems can significantly impact your health. Let me understand your situation:\n\n1. Are you having trouble falling asleep, staying asleep, or both?\n2. What time do you usually go to bed and wake up?\n3. Do you consume caffeine or alcohol? If so, how much and when?\n4. Are you using electronic devices before bed?\n5. Is there anything on your mind that keeps you awake?"
    }
    
    if (lowerMsg.includes("skin") || lowerMsg.includes("rash") || lowerMsg.includes("itching")) {
      return "Skin issues can be caused by various factors. To help identify the cause:\n\n1. Where on your body is the issue located?\n2. Can you describe its appearance? (redness, bumps, dry patches, etc.)\n3. Is it itchy, painful, or both?\n4. When did you first notice it?\n5. Have you recently used any new products, detergents, or foods?"
    }

    // If symptoms are being tracked, provide summary-based response
    if (symptomHistory.length >= 3) {
      return `Based on our conversation, I've noted the following symptoms: ${symptomHistory.join(", ")}.\n\nWith multiple symptoms present, I recommend:\n\n1. Uploading any recent medical reports for AI analysis\n2. Consulting with a healthcare professional for proper evaluation\n3. Using the "Nearby Doctors" feature to find specialists\n\nWould you like me to help you with any of these steps?`
    }
    
    // Default follow-up
    return "Thank you for sharing that information. Could you provide more details about when this started and how it's affecting your daily activities? Also, are you experiencing any other symptoms along with this?"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", text: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const response = getAIResponse(input)
      const botMessage: Message = { role: "bot", text: response, timestamp: new Date() }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-black md:h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-black bg-green-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">PulseKin Doc</h1>
              <p className="text-sm text-green-400">Powered by MedGemma AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* Symptom History Bar */}
      {symptomHistory.length > 0 && (
        <div className="border-b border-white/10 bg-white/[0.02] px-4 py-2">
          <div className="mx-auto flex max-w-4xl items-center gap-2">
            <span className="text-xs text-gray-500">Tracking:</span>
            <div className="flex flex-wrap gap-2">
              {symptomHistory.map((symptom, i) => (
                <span key={i} className="rounded-full bg-pink-500/20 px-3 py-1 text-xs text-pink-400">
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message, i) => (
            <div key={i} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[85%] gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  message.role === "user" 
                    ? "bg-gradient-to-r from-orange-500 to-pink-500" 
                    : "bg-gradient-to-r from-pink-500 to-purple-500"
                }`}>
                  {message.role === "user" ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                </div>
                <div className={`rounded-2xl px-5 py-4 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-white/10 text-gray-200"
                }`}>
                  <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                  <p className={`mt-2 text-xs ${message.role === "user" ? "text-white/60" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="rounded-2xl bg-white/10 px-5 py-4">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-pink-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3">
        <div className="mx-auto max-w-4xl">
          <div className="mb-2 text-xs text-gray-500">Quick prompts:</div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleQuickPrompt(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-black px-4 py-4 pb-24 md:pb-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
            <button type="button" className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
            />
            <button type="button" className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
              <Mic className="h-5 w-5" />
            </button>
            <Button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            AI responses are for informational purposes only. Always consult a healthcare professional.
          </p>
        </form>
      </div>
    </div>
  )
}

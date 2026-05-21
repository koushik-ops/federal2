"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Send, Bot, User, Brain, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

function ChatContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI Health Assistant powered by Google MedGemma. I can help you understand your symptoms, explain medical conditions, and provide general health guidance. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState(initialQuery)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes("headache") || lowerMessage.includes("head pain")) {
      return `Based on your description of headache symptoms, here's my analysis:

**Possible Causes:**
- Tension headache (most common)
- Migraine
- Dehydration
- Eye strain
- Sinusitis

**Recommendations:**
1. Stay hydrated - drink at least 8 glasses of water daily
2. Rest in a quiet, dark room
3. Apply a cold or warm compress to your forehead
4. Consider over-the-counter pain relievers like acetaminophen or ibuprofen

**When to See a Doctor:**
- Headache is severe or sudden ("thunderclap")
- Accompanied by fever, stiff neck, confusion
- After a head injury
- Persistent for more than 72 hours

Would you like me to help you find doctors nearby who specialize in neurology?`
    }
    
    if (lowerMessage.includes("fever") || lowerMessage.includes("temperature")) {
      return `I understand you're experiencing fever. Here's my assessment:

**Common Causes of Fever:**
- Viral infections (flu, cold)
- Bacterial infections
- Inflammatory conditions
- Heat exhaustion

**Recommended Actions:**
1. Monitor your temperature regularly
2. Stay hydrated with water, clear broths, or electrolyte solutions
3. Rest adequately
4. Take fever-reducing medications as directed (paracetamol/acetaminophen)

**Seek Immediate Medical Care If:**
- Temperature exceeds 103°F (39.4°C)
- Fever persists beyond 3 days
- Accompanied by severe symptoms (difficulty breathing, chest pain)
- You're immunocompromised

Would you like me to analyze any recent blood tests or help schedule a consultation?`
    }
    
    if (lowerMessage.includes("tired") || lowerMessage.includes("fatigue") || lowerMessage.includes("weak")) {
      return `Fatigue and weakness can have many underlying causes. Let me help you understand:

**Potential Causes:**
- Sleep disorders or insufficient sleep
- Anemia or nutritional deficiencies
- Thyroid dysfunction
- Stress or depression
- Chronic conditions

**Lifestyle Recommendations:**
1. Ensure 7-9 hours of quality sleep
2. Maintain a balanced diet rich in iron and B vitamins
3. Regular moderate exercise
4. Manage stress through relaxation techniques
5. Limit caffeine and alcohol

**Tests to Consider:**
- Complete Blood Count (CBC)
- Thyroid Function Tests
- Vitamin D and B12 levels
- Iron studies

Would you like to upload your recent blood work for analysis, or shall I help you find a general physician?`
    }
    
    if (lowerMessage.includes("stomach") || lowerMessage.includes("digestion") || lowerMessage.includes("nausea")) {
      return `I'll help you with your digestive concerns:

**Common Digestive Issues:**
- Gastritis or acid reflux
- Food intolerance
- Gastroenteritis
- Irritable Bowel Syndrome (IBS)
- Stress-related symptoms

**Immediate Relief Measures:**
1. Eat smaller, frequent meals
2. Avoid spicy, fatty, or acidic foods
3. Stay upright after eating
4. Try ginger tea or peppermint for nausea
5. Consider antacids for acid-related symptoms

**Warning Signs Requiring Medical Attention:**
- Severe abdominal pain
- Blood in stool or vomit
- Unexplained weight loss
- Persistent symptoms beyond 2 weeks

Should I help you find a gastroenterologist nearby, or would you like to upload any test results for analysis?`
    }
    
    return `Thank you for sharing your health concerns. Based on your message, I recommend:

**General Health Tips:**
1. Maintain a balanced diet with plenty of fruits and vegetables
2. Exercise regularly (at least 150 minutes per week)
3. Get adequate sleep (7-9 hours)
4. Stay hydrated
5. Manage stress through relaxation techniques

**For More Specific Guidance:**
- Upload your medical reports for AI-powered analysis
- Describe your symptoms in more detail
- Consider consulting with a healthcare professional

I'm here to help you understand your health better. Feel free to ask me about specific symptoms, conditions, or any health-related questions.

Would you like to:
- Upload a medical report for analysis?
- Find doctors nearby?
- Learn more about a specific condition?`
  }

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue
    if (!text.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const aiResponse: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: generateResponse(text),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage()
  }

  const quickPrompts = [
    "I have a headache",
    "Feeling very tired lately",
    "Stomach discomfort",
    "What tests should I get annually?",
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] pb-16 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Doctor Chat</h1>
          <p className="text-sm text-muted-foreground">
            Powered by Google MedGemma AI
          </p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          End-to-End Encrypted
        </Badge>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 glass-card border-border/50 overflow-hidden">
        <ScrollArea className="h-full">
          <CardContent className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-primary/20"
                      : "gradient-button"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <Bot className="h-4 w-4 text-black" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-[10px] mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-button flex items-center justify-center">
                  <Bot className="h-4 w-4 text-black" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 animate-pulse text-primary" />
                    <span className="text-sm text-muted-foreground">
                      MedGemma is analyzing...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              className="text-xs border-border"
              onClick={() => handleSendMessage(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your symptoms or ask a health question..."
            className="flex-1 h-12 bg-input border-0 rounded-xl"
            disabled={isTyping}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isTyping || !inputValue.trim()}
            className="h-12 w-12 rounded-xl gradient-button text-black"
          >
            {isTyping ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}

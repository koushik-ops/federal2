"use client"

import { useState, useEffect, useRef } from "react"
import { useFederated, HospitalNode } from "@/lib/federated-context"
import { useUser } from "@/lib/user-context"
import { useTheme } from "next-themes"
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Database, 
  LineChart, 
  RefreshCw, 
  Lock, 
  Key, 
  FileSpreadsheet, 
  Activity, 
  Zap, 
  Info,
  Server,
  Network
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ResponsiveContainer, 
  LineChart as ReChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts"

const HOSPITAL_TEMPLATES = [
  { name: "Mayo Clinic Medical AI Center", size: 14250, loc: "Rochester, MN", type: "MRI Scan Volumetric Data" },
  { name: "Johns Hopkins Hospital Node", size: 16800, loc: "Baltimore, MD", type: "Chest X-Ray Imaging" },
  { name: "St. Jude Pediatric Research AI", size: 8450, loc: "Memphis, TN", type: "Genomic Expression Patterns" },
  { name: "Apollo Health Hub", size: 11200, loc: "New Delhi, IN", type: "ECG Waveform Sequences" },
  { name: "Massachusetts General AI Node", size: 18100, loc: "Boston, MA", type: "EHR Clinical History Logs" },
  { name: "Mount Sinai Genomics Lab", size: 13500, loc: "New York, NY", type: "WGS Variant Call Files" }
]

export default function HospitalDashboardPage() {
  const { user } = useUser()
  const { nodes, registerNode, runLocalTraining, syncNodeWeights, isTraining } = useFederated()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Connection Phase State
  const [connectionStep, setConnectionStep] = useState<"select" | "handshake" | "connected">("select")
  const [handshakeMessageIndex, setHandshakeMessageIndex] = useState(0)
  const [handshakeProgress, setHandshakeProgress] = useState(0)
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0)
  const [customDataSize, setCustomDataSize] = useState(12000)
  const [dataType, setDataType] = useState("MRI Scan Volumetric Data")

  // Node details once connected
  const [nodeId, setNodeId] = useState("")
  const [nodeToken, setNodeToken] = useState("")
  
  // Local simulator states
  const [localEpochs, setLocalEpochs] = useState<number>(0)
  const [trainingLocalProgress, setTrainingLocalProgress] = useState(0)
  const [isLocalTraining, setIsLocalTraining] = useState(false)
  const [localLogs, setLocalLogs] = useState<string[]>([])
  
  const selectedTemplate = HOSPITAL_TEMPLATES[selectedTemplateIndex]

  // Chart data for training accuracy
  const [accuracyHistory, setAccuracyHistory] = useState([
    { epoch: 0, accuracy: 0.725, loss: 0.54 },
    { epoch: 10, accuracy: 0.758, loss: 0.46 },
    { epoch: 20, accuracy: 0.782, loss: 0.39 },
    { epoch: 30, accuracy: 0.801, loss: 0.32 },
    { epoch: 40, accuracy: 0.824, loss: 0.27 }
  ])

  // Log append helper
  const addLocalLog = (msg: string) => {
    const time = new Date().toTimeString().split(" ")[0]
    setLocalLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 30))
  }

  // Find this registered node in global state
  const activeNode = nodes.find(n => n.id === nodeId)

  // Sync state if global training triggers
  useEffect(() => {
    if (activeNode) {
      if (activeNode.status === "training") {
        addLocalLog("ALERT: Central server initiated global training round. Starting local epochs...")
      } else if (activeNode.status === "uploading") {
        addLocalLog("Uploading secure gradients to Central AI Aggregation Server...")
      } else if (activeNode.status === "synced") {
        addLocalLog("Gradients aggregated successfully. Node weights updated to global model v" + (activeNode.localAccuracy * 100).toFixed(0))
      }
    }
  }, [activeNode?.status])

  // Handshake sequence messages
  const handshakeSteps = [
    "Establishing secure TLS connection with Central Aggregator...",
    "Generating local ECDSA cryptographic keypairs...",
    "Encrypting handshaking headers with Diffie-Hellman protocol...",
    "Registering hospital entity metrics (dataset size & data model type)...",
    "Deploying local MedGemma Sandbox v2.4 in isolated node partition...",
    "Applying Homomorphic Encryption wrapper to local model weights...",
    "Sync established! Handshake validated. Secure Token issued."
  ]

  // Establish link sequence
  const handleEstablishLink = () => {
    setConnectionStep("handshake")
    setHandshakeProgress(10)
    setHandshakeMessageIndex(0)

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= handshakeSteps.length) {
        clearInterval(interval)
        // Register in global context
        const newNode = registerNode(
          selectedTemplate.name,
          customDataSize,
          selectedTemplate.loc
        )
        
        setNodeId(newNode.id)
        // Create fake token
        const header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
        const payload = btoa(JSON.stringify({ id: newNode.id, name: newNode.name, size: customDataSize }))
        const signature = "x4A7b9_H9c2e-4rLp2W1z"
        setNodeToken(`${header}.${payload}.${signature}`)

        setAccuracyHistory([
          { epoch: 0, accuracy: 0.705, loss: 0.61 },
          { epoch: 10, accuracy: 0.742, loss: 0.49 },
          { epoch: 20, accuracy: 0.768, loss: 0.41 },
          { epoch: 30, accuracy: 0.793, loss: 0.35 },
          { epoch: 40, accuracy: newNode.localAccuracy, loss: 0.28 }
        ])

        setConnectionStep("connected")
        addLocalLog(`Secure link registered: ${newNode.name} initialized.`)
        addLocalLog(`Active local accuracy: ${(newNode.localAccuracy * 100).toFixed(2)}%`)
      } else {
        setHandshakeMessageIndex(currentStep)
        setHandshakeProgress(Math.floor(((currentStep + 1) / handshakeSteps.length) * 100))
      }
    }, 1200)
  }

  // Trigger manual local training
  const handleLocalTraining = () => {
    if (isLocalTraining || !activeNode) return
    setIsLocalTraining(true)
    setTrainingLocalProgress(5)
    runLocalTraining(activeNode.id)
    addLocalLog("Initiating local training on GPU pipeline...")

    let progress = 5
    const interval = setInterval(() => {
      progress += 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setIsLocalTraining(false)
        setLocalEpochs(prev => prev + 10)
        
        const accuracyGain = 0.005 + Math.random() * 0.015
        const newAcc = Math.min(0.985, activeNode.localAccuracy + accuracyGain)
        const nextEpoch = (localEpochs + 10) * 10
        
        setAccuracyHistory(prev => [
          ...prev,
          { epoch: nextEpoch, accuracy: newAcc, loss: Math.max(0.02, 0.28 - (newAcc - activeNode.localAccuracy)) }
        ])
        
        addLocalLog(`Local training complete. Epochs run: +10. Model accuracy: ${(newAcc * 100).toFixed(2)}%`)
      }
      setTrainingLocalProgress(progress)
    }, 300)
  }

  // Trigger manual weight upload/sync
  const handleUploadWeights = () => {
    if (!activeNode) return
    syncNodeWeights(activeNode.id)
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl pb-16 space-y-8 animate-pulse pt-4">
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[400px] bg-muted rounded-2xl" />
          <div className="h-[400px] bg-muted rounded-2xl" />
        </div>
      </div>
    )
  }

  if (connectionStep === "select") {
    return (
      <div className="mx-auto max-w-4xl py-12 px-4">
        {/* Glow Title */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 mb-4">
            <Lock className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">Federated Link Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Register Hospital <span className="text-cyan-500">AI Node</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Connect your clinical hospital database to the decentralized PulseKin network. Train advanced diagnostic models cooperatively without sharing sensitive patient records.
          </p>
        </div>

        {/* Setup Card */}
        <div className="grid gap-8 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="md:col-span-2">
            <Card className="border-cyan-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl">Node Credentials & Dataset Specs</CardTitle>
                <CardDescription>Configure local data settings to hook into the secure coordinator.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selector */}
                <div className="space-y-2.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Select Hospital Identity</label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {HOSPITAL_TEMPLATES.map((temp, i) => (
                      <button
                        key={temp.name}
                        onClick={() => {
                          setSelectedTemplateIndex(i)
                          setCustomDataSize(temp.size)
                          setDataType(temp.type)
                        }}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                          selectedTemplateIndex === i
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-border bg-background hover:bg-muted/15"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className={`h-5 w-5 ${selectedTemplateIndex === i ? "text-cyan-400" : "text-muted-foreground"}`} />
                          <div>
                            <p className="font-semibold text-sm text-foreground">{temp.name}</p>
                            <p className="text-xs text-muted-foreground">{temp.loc}</p>
                          </div>
                        </div>
                        <span className="text-xs bg-muted border rounded px-2.5 py-1 text-muted-foreground">{temp.size.toLocaleString()} records</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dataset adjustments */}
                <div className="grid gap-4 grid-cols-2 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Dataset Records Count</label>
                    <div className="flex items-center gap-3 bg-background border border-border px-4 py-2.5 rounded-xl">
                      <Database className="h-4 w-4 text-cyan-400" />
                      <input 
                        type="number"
                        value={customDataSize}
                        onChange={(e) => setCustomDataSize(Number(e.target.value))}
                        className="bg-transparent text-sm w-full outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Local Encryption Strategy</label>
                    <div className="flex items-center gap-3 bg-muted/40 border border-border px-4 py-2.5 rounded-xl">
                      <Lock className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-medium text-muted-foreground">Differential Privacy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Pillar */}
          <div className="space-y-6">
            <Card className="border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-cyan-400" />
                  Privacy Isolation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-4 text-muted-foreground leading-relaxed">
                <div className="flex gap-3">
                  <Key className="h-4 w-4 text-cyan-400 shrink-0" />
                  <p><span className="font-semibold text-foreground">Zero record leakage:</span> Patients' clinical logs, scans, and IDs reside strictly in the local sandboxed hardware partition.</p>
                </div>
                <div className="flex gap-3">
                  <Cpu className="h-4 w-4 text-purple-400 shrink-0" />
                  <p><span className="font-semibold text-foreground">Local GPU computing:</span> Gradients/weights are calculated locally. No raw imagery ever exits the hospital intranet.</p>
                </div>
                <div className="flex gap-3">
                  <Lock className="h-4 w-4 text-pink-400 shrink-0" />
                  <p><span className="font-semibold text-foreground">Secure Aggegation:</span> Gradient arrays are masked using cryptographically secure homomorphic additions.</p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleEstablishLink}
              className="shine-button w-full h-14 text-base font-bold text-black rounded-2xl"
              style={{
                background: "linear-gradient(90deg,#06b6d4 0%,#3b82f6 50%,#7c3aed 100%)"
              }}
            >
              Establish Federated Link
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // CONNECTION HANDSHAKE SCREEN
  if (connectionStep === "handshake") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md p-6 text-center">
          {/* Animated Spinner Core */}
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 animate-spin" />
            <div className="absolute inset-4 rounded-full border-4 border-purple-500/15" />
            <div className="absolute inset-4 rounded-full border-4 border-b-purple-400 animate-spin-reverse" />
            <div className="absolute inset-8 flex items-center justify-center">
              <Network className="h-6 w-6 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Cryptographic Handshake</h2>
          <p className="text-sm text-cyan-400 mb-6 font-mono">Progress: {handshakeProgress}%</p>

          <Card className="border-border/50 text-left mb-6">
            <CardContent className="pt-6">
              <div className="space-y-3 font-mono text-xs text-muted-foreground">
                {handshakeSteps.map((step, idx) => {
                  const isCurrent = idx === handshakeMessageIndex
                  const isPast = idx < handshakeMessageIndex
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-3 transition-opacity duration-300 ${
                        isCurrent ? "text-cyan-400 font-semibold" : isPast ? "text-muted-foreground/60" : "opacity-20"
                      }`}
                    >
                      <span>{isPast ? "✓" : isCurrent ? "⚡" : "·"}</span>
                      <p>{step}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          <Progress value={handshakeProgress} className="h-1.5" />
        </div>
      </div>
    )
  }

  // CONNECTED HOSPITAL DASHBOARD
  return (
    <div className="mx-auto max-w-7xl pb-16">
      {/* Top Banner Status */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Building2 className="h-8 w-8 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{activeNode?.name || selectedTemplate.name}</h1>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold">Active Federated Link</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Node ID: <span className="font-mono text-foreground font-semibold">{activeNode?.id || nodeId}</span> &bull; Location: <span className="text-foreground">{activeNode?.location || selectedTemplate.loc}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-card border rounded-xl px-4 py-2.5 text-center min-w-32">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Node Status</p>
            <p className="text-sm font-extrabold capitalize text-cyan-400 font-mono">
              {activeNode?.status === "idle" ? "Connected" : activeNode?.status}
            </p>
          </div>
          <div className="bg-card border rounded-xl px-4 py-2.5 text-center min-w-32">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Local Accuracy</p>
            <p className="text-sm font-extrabold text-foreground font-mono">
              {activeNode ? (activeNode.localAccuracy * 100).toFixed(2) : "82.40"}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Local AI Sandbox Controls */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-cyan-500/20 shadow-lg relative overflow-hidden">
            {/* Visual shine effect on training */}
            {activeNode?.status === "training" && (
              <div className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none" />
            )}
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                  Local AI Node Sandbox
                </CardTitle>
                <CardDescription>Train global model parameters on local dataset partition.</CardDescription>
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                Model: <span className="text-foreground font-semibold">MedGemma-7B-Dense</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Training progress view */}
              {isLocalTraining ? (
                <div className="bg-background border border-cyan-500/20 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-cyan-400 font-semibold">
                      <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                      Executing Local Epochs (GPU-0)...
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{trainingLocalProgress}%</span>
                  </div>
                  <Progress value={trainingLocalProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>Batch size: 32 | Learning Rate: 2e-5</span>
                    <span>Loss: {(0.28 - (trainingLocalProgress * 0.002)).toFixed(4)}</span>
                  </div>
                </div>
              ) : activeNode?.status === "training" ? (
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center space-y-3">
                  <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin mx-auto" />
                  <p className="font-semibold text-cyan-400">Central Federated Orchestration Running...</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    The central aggregator has requested a training round. The node is running calculations automatically.
                  </p>
                </div>
              ) : (
                <div className="bg-background border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Local Node is Idle & Sync Ready</p>
                    <p className="text-xs text-muted-foreground">Run local gradient descent steps manually, or wait for central trigger.</p>
                  </div>
                  <Button
                    onClick={handleLocalTraining}
                    disabled={isTraining || isLocalTraining}
                    className="gradient-button text-black font-semibold h-11 px-6 rounded-xl hover:opacity-90 w-full md:w-auto"
                  >
                    Run Local Epoch Step
                  </Button>
                </div>
              )}

              {/* Data isolation banner */}
              <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Privacy Guard Verified</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Local sandbox configured. Raw data access is bound to node virtualization loop. Zero packet exposure detected on outgoing connection lanes.
                  </p>
                </div>
              </div>

              {/* Node actions grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-background border-border/50">
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Local Epochs Run</p>
                    <p className="text-2xl font-extrabold text-foreground mt-1">{localEpochs}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">10 steps per training epoch</p>
                  </CardContent>
                </Card>
                <Card className="bg-background border-border/50">
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Encrypted Upload</p>
                    {activeNode?.status === "uploading" ? (
                      <Button disabled className="w-full mt-2 h-9 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        Uploading...
                      </Button>
                    ) : activeNode?.status === "synced" ? (
                      <Button disabled className="w-full mt-2 h-9 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Synced
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleUploadWeights}
                        disabled={isTraining || isLocalTraining}
                        className="w-full mt-2 h-9 border border-cyan-500/30 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/20 text-xs font-bold rounded-lg"
                      >
                        Encrypt & Upload Weights
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Local Accuracy Graph */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChart className="h-5 w-5 text-cyan-400" />
                Local Convergence & Loss History
              </CardTitle>
              <CardDescription>Accuracy and loss trends across local training sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChart data={accuracyHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                    <XAxis dataKey="epoch" stroke="#888" label={{ value: "Steps", position: "insideBottom", offset: -5 }} />
                    <YAxis yAxisId="left" stroke="#06b6d4" domain={[0.6, 1.0]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#ec4899" domain={[0.0, 0.8]} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--popover)", borderColor: "var(--border)", color: "var(--popover-foreground)", borderRadius: "12px", fontSize: "11px" }} />
                    <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#06b6d4" strokeWidth={3} name="Local Accuracy" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" name="Cross-Entropy Loss" />
                  </ReChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar stats and config */}
        <div className="space-y-6">
          {/* Security Credentials */}
          <Card className="border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Federated Node Token
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-background p-3 rounded-lg border border-border/50 text-xs font-mono break-all text-muted-foreground select-all h-24 overflow-y-auto">
                {nodeToken}
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                <span>Issued: Just now</span>
                <span>Type: Secure Node WebToken</span>
              </div>
            </CardContent>
          </Card>

          {/* Dataset details */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                Node Dataset Specs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2 text-sm">
                <span className="text-muted-foreground">Local Record Count</span>
                <span className="font-semibold text-foreground">{activeNode?.datasetSize?.toLocaleString() || customDataSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2 text-sm">
                <span className="text-muted-foreground">Primary Diagnosis Data</span>
                <span className="font-semibold text-cyan-400 text-xs truncate max-w-44 text-right">
                  {selectedTemplate.type}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2 text-sm">
                <span className="text-muted-foreground">HIPAA Status</span>
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/25 px-2 py-0.5 rounded-md font-bold">
                  Compliant
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Homomorphic Adder Key</span>
                <span className="font-mono text-xs text-muted-foreground truncate max-w-32">
                  0x7FB398D10A2B93FF...
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Local Node Activity Terminal */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Local Sandbox logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-950 rounded-xl p-3 h-52 overflow-y-auto font-mono text-[10px] text-zinc-300 space-y-1.5 scrollbar-thin">
                {localLogs.length === 0 ? (
                  <p className="text-zinc-650 italic">Waiting for node actions...</p>
                ) : (
                  localLogs.map((log, idx) => {
                    let color = "text-zinc-300"
                    if (log.includes("ALERT") || log.includes("Uploading")) color = "text-cyan-400"
                    if (log.includes("complete") || log.includes("success")) color = "text-emerald-400"
                    return (
                      <p key={idx} className={color}>{log}</p>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

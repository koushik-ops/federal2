"use client"

import { useState, useEffect } from "react"
import { useFederated, HospitalNode, LogEntry } from "@/lib/federated-context"
import { useTheme } from "next-themes"
import { 
  Shield, 
  ShieldCheck, 
  Cpu, 
  Database, 
  LineChart, 
  RefreshCw, 
  Lock, 
  Zap, 
  Activity, 
  Network,
  Server,
  AlertTriangle,
  Play,
  RotateCcw,
  Trash2,
  LockKeyhole
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

export default function AdminDashboardPage() {
  const { 
    globalRound, 
    globalAccuracy, 
    isTraining, 
    nodes, 
    logs, 
    startGlobalRound, 
    resetSimulation, 
    clearLogs 
  } = useFederated()

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"visualizer" | "nodes" | "logs">("visualizer")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate chart data based on globalAccuracy state
  const chartData = globalAccuracy.map((accuracy, idx) => ({
    round: `R${idx}`,
    accuracy: accuracy,
    loss: Math.max(0.04, 0.65 - (accuracy - 0.7) * 2.1)
  }))

  const totalRecords = nodes.reduce((sum, n) => sum + (n.connected ? n.datasetSize : 0), 0)
  const currentAccuracy = globalAccuracy[globalAccuracy.length - 1]

  // Calculate coordinates for nodes in a circle (viewBox size 700x700)
  const centerX = 350
  const centerY = 350
  const radius = 235

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl pb-16 space-y-8 animate-pulse pt-4">
        <div className="h-28 bg-muted rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[500px] bg-muted rounded-2xl" />
          <div className="h-[500px] bg-muted rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl pb-16 space-y-8">
      {/* Glow Title / Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-3">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">Federated Aggregator Console</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Central AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 dark:from-purple-400 dark:via-pink-400 dark:to-amber-500">Orchestrator</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Monitor and coordinate collaborative model training across secure hospital nodes. 
            Aggregates gradients via homomorphic FedAvg without decrypting patient-level data.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            onClick={resetSimulation}
            disabled={isTraining}
            variant="outline"
            className="border-border hover:bg-muted/50 rounded-xl h-12 px-4 flex items-center gap-2 font-semibold text-xs text-foreground bg-card"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Sim
          </Button>

          <Button
            onClick={startGlobalRound}
            disabled={isTraining || nodes.filter(n => n.connected).length === 0}
            className="shine-button h-12 px-6 rounded-xl font-bold text-xs text-black"
            style={{
              background: "linear-gradient(90deg,#a855f7 0%,#ec4899 50%,#f59e0b 100%)"
            }}
          >
            {isTraining ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Aggregating Round {globalRound + 1}...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-black mr-2" />
                Trigger Global Round {globalRound + 1}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Active Nodes */}
        <Card className="border-border bg-card shadow-md text-card-foreground">
          <CardContent className="pt-6 flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connected Nodes</p>
              <p className="text-3xl font-extrabold text-foreground">{nodes.filter(n => n.connected).length}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                All tunnels verified
              </p>
            </div>
            <div className="p-3 bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/10 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl">
              <Network className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Records */}
        <Card className="border-border bg-card shadow-md text-card-foreground">
          <CardContent className="pt-6 flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Private Dataset Size</p>
              <p className="text-3xl font-extrabold text-foreground">{totalRecords.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Zero patient files shared
              </p>
            </div>
            <div className="p-3 bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/10 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-xl">
              <Database className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Global Model Version */}
        <Card className="border-border bg-card shadow-md text-card-foreground">
          <CardContent className="pt-6 flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Global Version</p>
              <p className="text-3xl font-extrabold text-foreground">v2.{globalRound}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                MedGemma-7B-Dense core
              </p>
            </div>
            <div className="p-3 bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/10 dark:border-pink-500/20 text-pink-600 dark:text-pink-400 rounded-xl">
              <Cpu className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Global Accuracy */}
        <Card className="border-border bg-card shadow-md text-card-foreground">
          <CardContent className="pt-6 flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model Convergence</p>
              <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-500">{(currentAccuracy * 100).toFixed(2)}%</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Target threshold: 95.00%
              </p>
            </div>
            <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <LineChart className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TRAINING SIMULATION STATUS VIEW */}
      {isTraining && (
        <Card className="border-purple-500/20 dark:border-purple-500/30 bg-purple-500/5 shadow-lg overflow-hidden animate-in fade-in duration-300">
          <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-purple-600 dark:text-purple-400" />
                  Federated Averaging Aggregator Active
                </span>
                <span className="font-mono text-purple-600 dark:text-purple-400 text-xs">
                  {globalRound % 2 === 0 ? "FedAvg Homomorphic Encrypt Adders..." : "Synthesizing Gradients..."}
                </span>
              </div>
              <Progress 
                value={isTraining ? 100 : 0} 
                className="h-2 bg-purple-500/10" 
                style={{
                  animation: "shimmer 11s linear infinite"
                }}
              />
              <style>{`
                @keyframes shimmer {
                  0% { width: 0% }
                  36% { width: 36% }
                  72% { width: 72% }
                  100% { width: 100% }
                }
              `}</style>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed max-w-md">
              <span className="font-bold text-foreground block mb-0.5">Aggregator Safety Status:</span>
              Local weight updates remain cryptographically masked. Zero raw record ingestion. Decryption logs show 0 alerts.
            </div>
          </CardContent>
        </Card>
      )}

      {/* VISUALIZER LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main interactive panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Tabs */}
          <div className="flex border-b border-border gap-2">
            <button
              onClick={() => setActiveTab("visualizer")}
              className={`pb-3 text-sm font-bold border-b-2 px-3 transition-colors ${
                activeTab === "visualizer"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Network Visualizer
            </button>
            <button
              onClick={() => setActiveTab("nodes")}
              className={`pb-3 text-sm font-bold border-b-2 px-3 transition-colors ${
                activeTab === "nodes"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Participating Nodes ({nodes.length})
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`pb-3 text-sm font-bold border-b-2 px-3 transition-colors ${
                activeTab === "logs"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Central Logs
            </button>
          </div>

          {/* TAB CONTENT: VISUALIZER */}
          {activeTab === "visualizer" && (
            <Card className="border-border bg-card shadow-2xl relative overflow-hidden text-card-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Collaborative Topology Map
                </CardTitle>
                <CardDescription>
                  Watch real-time secure weight streaming. Encrypted packets bypass central raw storage.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-6">
                {/* SVG Visualizer */}
                <div className="relative w-full max-w-[550px] aspect-square">
                  <svg 
                    viewBox="0 0 700 700" 
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Glow Filter */}
                      <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>

                      {/* Line Gradients */}
                      <linearGradient id="streamGrad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="streamGrad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
                      </linearGradient>

                      {/* Brain Glow */}
                      <radialGradient id="brainPulse" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity={theme === "dark" ? "0.3" : "0.15"} />
                        <stop offset="70%" stopColor="#a855f7" stopOpacity={theme === "dark" ? "0.05" : "0.02"} />
                        <stop offset="100%" stopColor={theme === "dark" ? "#000" : "#fff"} stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Background Digital Grid (conceptual) */}
                    <circle cx={centerX} cy={centerY} r="310" stroke={theme === "dark" ? "#1f1832" : "#e2e8f0"} strokeWidth="1" strokeDasharray="5,5" fill="none" />
                    <circle cx={centerX} cy={centerY} r={radius} stroke={theme === "dark" ? "#2e214d" : "#cbd5e1"} strokeWidth="1.5" fill="none" opacity={theme === "dark" ? "0.3" : "0.5"} />

                    {/* Central Glow Field */}
                    <circle 
                      cx={centerX} 
                      cy={centerY} 
                      r="120" 
                      fill="url(#brainPulse)"
                      className={isTraining ? "animate-pulse" : ""}
                      style={{ animationDuration: isTraining ? "1.5s" : "4s" }}
                    />

                    {/* Node Connecting Tunnels and Particles */}
                    {nodes.map((node, idx) => {
                      if (!node.connected) return null
                      const angle = (idx * 2 * Math.PI) / nodes.length - Math.PI / 2
                      const x = centerX + radius * Math.cos(angle)
                      const y = centerY + radius * Math.sin(angle)

                      // Determine state-based line animation style
                      let strokeColor = theme === "dark" ? "#2a1c4a" : "#e2e8f0"
                      let strokeDash = "0"
                      let lineGlow = ""
                      
                      if (node.status === "training") {
                        strokeColor = "#06b6d4"
                        strokeDash = "3,3"
                      } else if (node.status === "uploading") {
                        strokeColor = "#ec4899"
                        lineGlow = "drop-shadow(0 0 4px #ec4899)"
                      } else if (node.status === "synced") {
                        strokeColor = "#10b981"
                      }

                      return (
                        <g key={node.id}>
                          {/* Secure tunnel paths */}
                          <line 
                            x1={centerX} 
                            y1={centerY} 
                            x2={x} 
                            y2={y} 
                            stroke={strokeColor} 
                            strokeWidth="2.5" 
                            strokeDasharray={strokeDash}
                            style={{ filter: lineGlow, transition: "stroke 0.5s ease" }}
                            opacity="0.65"
                          />

                          {/* Animated Packets */}
                          {/* Phase 1: Broadcast weights (Center -> Node) */}
                          {isTraining && node.status === "training" && (
                            <circle r="6" fill="#06b6d4" filter="url(#glow-cyan)">
                              <animateMotion 
                                dur="2s" 
                                repeatCount="indefinite" 
                                path={`M ${centerX} ${centerY} L ${x} ${y}`} 
                              />
                            </circle>
                          )}

                          {/* Phase 2: Upload Weights (Node -> Center) */}
                          {node.status === "uploading" && (
                            <g>
                              {/* Glowing encrypted gradient particle */}
                              <circle r="7" fill="#ec4899" filter="url(#glow-purple)">
                                <animateMotion 
                                  dur="1.8s" 
                                  repeatCount="indefinite" 
                                  path={`M ${x} ${y} L ${centerX} ${centerY}`} 
                                />
                              </circle>
                              {/* Accompanying shield encryption label */}
                              <circle r="3" fill="#ffffff">
                                <animateMotion 
                                  dur="1.8s" 
                                  repeatCount="indefinite" 
                                  path={`M ${x} ${y} L ${centerX} ${centerY}`} 
                                />
                              </circle>
                            </g>
                          )}
                        </g>
                      )
                    })}

                    {/* CENTRAL AGGREGATOR NODE BRAIN */}
                    <g transform={`translate(${centerX - 48}, ${centerY - 48})`}>
                      {/* Pulse Circle */}
                      <circle 
                        cx="48" 
                        cy="48" 
                        r={isTraining ? "56" : "48"} 
                        fill={theme === "dark" ? "#581c87" : "#f3e8ff"} 
                        opacity={isTraining ? "0.2" : "0.15"}
                        className="transition-all duration-500"
                      />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        fill="var(--card)" 
                        stroke={isTraining ? "#ec4899" : "#a855f7"} 
                        strokeWidth="3.5"
                        style={{ filter: isTraining ? "drop-shadow(0 0 10px #ec4899)" : "drop-shadow(0 0 8px #a855f7)" }}
                        className="transition-all duration-500"
                      />

                      {/* Server brain core icon */}
                      <g transform="translate(30, 30)">
                        <Server className={`h-9 w-9 ${isTraining ? "text-pink-400 animate-pulse" : "text-purple-400"}`} />
                      </g>

                      {/* Encryption shield overlays on central server */}
                      <g transform="translate(62, 54)">
                        <circle cx="8" cy="8" r="9" fill={theme === "dark" ? "black" : "var(--background)"} />
                        <g transform="translate(0, 0)">
                          <Lock className="h-4 w-4 text-amber-400" />
                        </g>
                      </g>
                    </g>

                    {/* Central Brain Metrics Labels */}
                    <foreignObject x={centerX - 80} y={centerY + 55} width="160" height="60">
                      <div className="text-center font-mono select-none">
                        <span className="text-[10px] text-muted-foreground uppercase block tracking-wider font-bold">Aggregator Core</span>
                        <span className="text-xs font-bold text-foreground block">Version 2.{globalRound}</span>
                        <span className="text-[10px] text-purple-400 font-semibold block">Acc: {(currentAccuracy * 100).toFixed(2)}%</span>
                      </div>
                    </foreignObject>

                    {/* HOSPITAL PORTAL NODES AROUND THE CORE */}
                    {nodes.map((node, idx) => {
                      if (!node.connected) return null
                      const angle = (idx * 2 * Math.PI) / nodes.length - Math.PI / 2
                      const x = centerX + radius * Math.cos(angle)
                      const y = centerY + radius * Math.sin(angle)

                      // Colors and visual states based on node status
                      let borderCol = "border-border/60"
                      let badgeBg = "bg-muted text-muted-foreground"
                      let badgeText = "Idle"
                      let pulseColor = ""
                      
                      if (node.status === "training") {
                        borderCol = "border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                        badgeBg = "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                        badgeText = "Training"
                        pulseColor = "bg-cyan-500"
                      } else if (node.status === "uploading") {
                        borderCol = "border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                        badgeBg = "bg-pink-500/20 text-pink-400 border-pink-500/30"
                        badgeText = "Streaming"
                        pulseColor = "bg-pink-500"
                      } else if (node.status === "synced") {
                        borderCol = "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        badgeBg = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        badgeText = "Synced"
                        pulseColor = "bg-emerald-500"
                      }

                      return (
                        <foreignObject 
                          key={node.id} 
                          x={x - 90} 
                          y={y - 50} 
                          width="180" 
                          height="100"
                          className="overflow-visible"
                        >
                          <div 
                            className={`flex flex-col justify-between p-2.5 rounded-xl border bg-card h-full transition-all duration-300 ${borderCol}`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <div className="truncate text-left">
                                <p className="font-bold text-[10px] text-foreground truncate max-w-[100px]">{node.name}</p>
                                <p className="text-[8px] text-muted-foreground truncate">{node.location}</p>
                              </div>
                              {/* Node status dot indicator */}
                              <div className={`flex items-center gap-1 border px-1.5 py-0.5 rounded text-[8px] font-extrabold capitalize ${badgeBg}`}>
                                {pulseColor && (
                                  <span className={`h-1 w-1 rounded-full animate-ping ${pulseColor}`} />
                                )}
                                {badgeText}
                              </div>
                            </div>

                            {/* Node Dataset Size / Local Accuracy */}
                            <div className="flex items-center justify-between border-t border-border/30 pt-1.5 mt-1 font-mono text-[9px]">
                              <span className="text-muted-foreground flex items-center gap-0.5">
                                <Database className="h-2.5 w-2.5 text-muted-foreground" />
                                {node.datasetSize.toLocaleString()}
                              </span>
                              <span className="text-foreground font-bold flex items-center gap-0.5">
                                <Zap className="h-2.5 w-2.5 text-amber-400" />
                                {(node.localAccuracy * 100).toFixed(1)}%
                              </span>
                            </div>

                            {/* Encrypted lock indicator */}
                            <div className="flex justify-between items-center text-[7px] text-muted-foreground uppercase pt-1 border-t border-border/10 mt-1">
                              <span className="flex items-center gap-0.5 text-emerald-400">
                                <Lock className="h-2 w-2" /> Homomorphic
                              </span>
                              <span>GPU-L0</span>
                            </div>
                          </div>
                        </foreignObject>
                      )
                    })}
                  </svg>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB CONTENT: NODES TABLE */}
          {activeTab === "nodes" && (
            <Card className="border-border bg-card shadow-lg text-card-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Participating Clinician Nodes</CardTitle>
                <CardDescription>Detailed telemetry profiles of connected hospitals.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Node Profile</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Local Set Size</th>
                      <th className="py-3 px-4">Local Accuracy</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Synced</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {nodes.map(node => (
                      <tr key={node.id} className="hover:bg-muted/15 transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-foreground text-xs">{node.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{node.id}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-muted-foreground">{node.location}</td>
                        <td className="py-3.5 px-4 text-xs font-semibold font-mono">{node.datasetSize.toLocaleString()} cases</td>
                        <td className="py-3.5 px-4 text-xs font-bold text-cyan-400 font-mono">{(node.localAccuracy * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            node.status === "training"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse"
                              : node.status === "uploading"
                              ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
                              : node.status === "synced"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-muted/20 text-muted-foreground border-border"
                          }`}>
                            {node.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-muted-foreground">{node.lastSync}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* TAB CONTENT: CENTRAL LOG FEED */}
          {activeTab === "logs" && (
            <Card className="border-border bg-card shadow-lg text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-lg">Decentralized Event Telemetry</CardTitle>
                  <CardDescription>Encryption key checks and node synchronizations.</CardDescription>
                </div>
                <Button 
                  onClick={clearLogs}
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-red-500/10 hover:text-red-500"
                  title="Clear Console Logs"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-950 rounded-2xl p-4 h-96 overflow-y-auto font-mono text-xs text-zinc-300 space-y-2 border border-border">
                  {logs.length === 0 ? (
                    <p className="text-zinc-650 italic text-center py-20">Console cleared. Waiting for event triggers...</p>
                  ) : (
                    logs.map((log) => {
                      let textCol = "text-zinc-300"
                      let badge = "ℹ️"
                      if (log.type === "success") {
                        textCol = "text-emerald-400"
                        badge = "✓"
                      } else if (log.type === "warning") {
                        textCol = "text-amber-400 font-bold"
                        badge = "⚠️"
                      } else if (log.type === "upload") {
                        textCol = "text-pink-400"
                        badge = "🔒"
                      }

                      return (
                        <div key={log.id} className={`flex gap-3 leading-relaxed border-b border-border/10 pb-1.5 ${textCol}`}>
                          <span className="text-zinc-500 font-bold shrink-0">{log.timestamp}</span>
                          <span className="shrink-0">{badge}</span>
                          <p>{log.message}</p>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right sidebar details, charts, metrics */}
        <div className="space-y-6">
          {/* Convergence Chart Card */}
          <Card className="border-border bg-card shadow-lg text-card-foreground">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <LineChart className="h-5 w-5 text-purple-400" />
                Global Accuracy Convergence
              </CardTitle>
              <CardDescription>Federated Averaging accuracy curve across global epochs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                    <XAxis dataKey="round" stroke="#888" style={{ fontSize: "10px" }} />
                    <YAxis yAxisId="left" stroke="#c084fc" domain={[0.65, 0.98]} style={{ fontSize: "10px" }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#ec4899" domain={[0.0, 0.7]} style={{ fontSize: "10px" }} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--popover)", borderColor: "var(--border)", color: "var(--popover-foreground)", borderRadius: "12px", fontSize: "11px" }} />
                    <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#a855f7" strokeWidth={3} name="Global Accuracy" activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" name="Aggregation Loss" />
                  </ReChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Protocol Badge Specs */}
          <Card className="border-border bg-card shadow-md text-card-foreground">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-purple-400" />
                Security Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground">Homomorphic Encryption</span>
                  <span className="text-emerald-400">Enforced</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Summation additions done in encrypted state. Weights are aggregated without unlocking the numerical parameter gradients.
                </p>
              </div>

              <div className="space-y-1 border-t border-border/30 pt-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground">Differential Privacy (&epsilon;, &delta;)</span>
                  <span className="text-cyan-400">DP-SGD Enabled</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Adds calibrated Gaussian noise layers locally during SGD epochs to limit reconstruction attacks by 99.99%.
                </p>
              </div>

              <div className="space-y-1 border-t border-border/30 pt-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground">HIPAA / GDPR Compliance</span>
                  <span className="text-emerald-400 flex items-center gap-0.5"><ShieldCheck className="h-3 w-3" /> Fully Compliant</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Patient Health Information (PHI) is zero-shared. Node servers strictly hold raw values inside on-premise firewalls.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Connected Tunnels Node List quick summary */}
          <Card className="border-border bg-card shadow-md text-card-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Tunnel Integrity</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-bold font-mono">SECURE</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {nodes.map(n => (
                <div key={n.id} className="flex justify-between items-center p-2 rounded-lg bg-background dark:bg-muted/20 border border-border text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${n.connected ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`} />
                    <span className="font-semibold text-foreground truncate max-w-36">{n.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono uppercase">{n.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

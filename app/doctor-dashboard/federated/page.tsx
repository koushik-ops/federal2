"use client"

import { useState } from "react"
import { useFederated } from "@/lib/federated-context"
import { 
  Building2, 
  Brain, 
  ShieldCheck, 
  Activity, 
  Database, 
  Sparkles, 
  LineChart, 
  TrendingUp, 
  Heart, 
  Stethoscope, 
  ArrowRight,
  Fingerprint,
  RefreshCw,
  Lock
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

const CLINICAL_MODELS = [
  {
    id: "cardio",
    name: "ECG Waveform Sequence Classifier",
    specialty: "Cardiology",
    accuracy: 0.942,
    loss: 0.12,
    records: 22400,
    findings: [
      "Identified sub-clinical localized QT-interval drifts across 12,000 global patient profiles.",
      "99.8% precision in detecting early-onset paroxysmal atrial fibrillation.",
      "Optimized myocardial infarction risk profiling via joint training parameters."
    ],
    biomarkers: "PR interval variance, ST segment elevations",
    icon: Heart,
    color: "text-red-400 border-red-500/25 bg-red-500/5",
    accent: "#ef4444"
  },
  {
    id: "pulmo",
    name: "Chest X-Ray Pathology Classifier",
    specialty: "Pulmonology",
    accuracy: 0.958,
    loss: 0.09,
    records: 33600,
    findings: [
      "Discovered shared radiological biomarkers for atypical interstitial pneumonia.",
      "High-sensitivity anomaly screening for micronodular pulmonary lesions.",
      "Federated parameters matched radiologist consensus panel with zero false negatives."
    ],
    biomarkers: "Infiltration density, opacity bounds, pleural effusion margins",
    icon: Stethoscope,
    color: "text-cyan-400 border-cyan-500/25 bg-cyan-500/5",
    accent: "#06b6d4"
  },
  {
    id: "onco",
    name: "MRI Volumetric Glioma Seg-Net",
    specialty: "Oncology",
    accuracy: 0.925,
    loss: 0.18,
    records: 27000,
    findings: [
      "Segmented multi-planar high-grade astrocytoma margins with 1.2mm voxel accuracy.",
      "Aggregated tumor expansion velocity profiles from 6 clinical centers.",
      "No demographic drift detected; parameters validated across global datasets."
    ],
    biomarkers: "T2 FLAIR signal hyperintensity, volumetric contrast enhancements",
    icon: Brain,
    color: "text-purple-400 border-purple-500/25 bg-purple-500/5",
    accent: "#a855f7"
  },
  {
    id: "peds",
    name: "Pediatric Genomic Expression Profiler",
    specialty: "Pediatrics",
    accuracy: 0.911,
    loss: 0.22,
    records: 16900,
    findings: [
      "Mapped differential expression profiles for rare neuromuscular disorders.",
      "Cross-institutional convergence identified 4 high-probability candidate loci.",
      "Enforced tight local differential privacy noise layers to protect pediatric profiles."
    ],
    biomarkers: "Chr-17 transcription markers, locus methylation quotients",
    icon: Sparkles,
    color: "text-pink-400 border-pink-500/25 bg-pink-500/5",
    accent: "#ec4899"
  }
]

export default function DoctorFederatedInsightsPage() {
  const { globalRound, globalAccuracy, nodes, isTraining } = useFederated()
  const [selectedModelIndex, setSelectedModelIndex] = useState(0)

  const activeModel = CLINICAL_MODELS[selectedModelIndex]
  const currentAccuracy = globalAccuracy[globalAccuracy.length - 1]
  const totalNodesCount = nodes.filter(n => n.connected).length
  const totalCasesCount = nodes.reduce((sum, n) => sum + (n.connected ? n.datasetSize : 0), 0)

  // Sync charts to current global context round
  const chartData = globalAccuracy.map((accuracy, idx) => ({
    round: `Round ${idx}`,
    accuracy: accuracy,
    loss: Math.max(0.04, 0.65 - (accuracy - 0.7) * 2.1)
  }))

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 mb-3 text-xs">
            <Brain className="h-3.5 w-3.5" />
            <span className="font-semibold tracking-wider uppercase">Federated Research Network</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Federated Insights <span className="text-purple-500">Hub</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            Query diagnostic models trained collaboratively on global hospital data. 
            All patient records remain secure and locked inside local hospital storage.
          </p>
        </div>

        {/* Global summary card */}
        <div className="flex gap-3 bg-background border p-3 rounded-xl max-w-sm lg:max-w-md shrink-0">
          <div className="space-y-0.5 text-center px-4 border-r border-border/60">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Version</span>
            <span className="text-sm font-extrabold text-foreground block">v2.{globalRound}</span>
          </div>
          <div className="space-y-0.5 text-center px-4 border-r border-border/60">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Accuracy</span>
            <span className="text-sm font-extrabold text-purple-400 block">{(currentAccuracy * 100).toFixed(1)}%</span>
          </div>
          <div className="space-y-0.5 text-center px-4">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Hospitals</span>
            <span className="text-sm font-extrabold text-foreground block">{totalNodesCount} Node{totalNodesCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* CORE INFO ALERTS */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Stat Card 1 */}
        <Card className="border-border bg-card shadow-sm text-card-foreground">
          <CardContent className="pt-5 flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Zero Record Leakage</p>
              <p className="text-xs text-muted-foreground mt-1">
                Patients' records are anonymized and retained locally. No clinical charts are transmitted outside the firewall.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat Card 2 */}
        <Card className="border-border bg-card shadow-sm text-card-foreground">
          <CardContent className="pt-5 flex items-start gap-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Combined Knowledge</p>
              <p className="text-xs text-muted-foreground mt-1">
                Models aggregate patterns from {totalCasesCount.toLocaleString()} clinical cases across the entire collaborative network.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat Card 3 */}
        <Card className="border-border bg-card shadow-sm text-card-foreground">
          <CardContent className="pt-5 flex items-start gap-4">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
              <Fingerprint className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Cryptographic Safeguard</p>
              <p className="text-xs text-muted-foreground mt-1">
                Trained gradients are locked under homomorphic encryption tunnels before aggregating at the central coordinator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DETAILED LAYOUT GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Model Query Hub (Interactive Tabs) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border bg-card shadow-lg text-card-foreground">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Query Global Clinical Models
              </CardTitle>
              <CardDescription>
                Select a diagnostic specialty model to examine verified clinical parameters and aggregated findings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tabs list */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CLINICAL_MODELS.map((model, idx) => {
                  const Icon = model.icon
                  const isSelected = selectedModelIndex === idx
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModelIndex(idx)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                            : "border-border bg-background hover:bg-muted/15"
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? "text-purple-400" : "text-muted-foreground"}`} />
                      <span className="text-xs font-bold text-foreground block">{model.specialty}</span>
                    </button>
                  )
                })}
              </div>

              {/* Active model overview details */}
              <div className={`border rounded-2xl p-5 space-y-4 ${activeModel.color}`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-extrabold text-base text-foreground">{activeModel.name}</h3>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      Target Area: <span className="text-foreground">{activeModel.specialty} Diagnostics</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="bg-background/80 border rounded-lg px-2.5 py-1 text-center font-mono">
                      <span className="text-[8px] text-muted-foreground uppercase block font-bold">Accuracy</span>
                      <span className="text-xs font-bold text-purple-400">{(activeModel.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-background/80 border rounded-lg px-2.5 py-1 text-center font-mono">
                      <span className="text-[8px] text-muted-foreground uppercase block font-bold">Aggregated Records</span>
                      <span className="text-xs font-bold text-foreground">{activeModel.records.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Key clinical findings */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                    Federated AI Diagnostics Insights
                  </p>
                  <ul className="space-y-2 text-xs text-muted-foreground list-none pl-1">
                    {activeModel.findings.map((f, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <span className="text-purple-400 mt-0.5">&bull;</span>
                        <p>{f}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Biomarkers detected */}
                <div className="pt-2 border-t border-white/10 text-xs">
                  <span className="font-semibold text-foreground">Tracked Biomarkers / Parameters: </span>
                  <span className="text-muted-foreground font-mono bg-background/50 border rounded px-2 py-0.5 text-[10px] ml-1.5">
                    {activeModel.biomarkers}
                  </span>
                </div>
              </div>

              {/* Research Application note */}
              <div className="bg-muted/10 border rounded-xl p-4 flex gap-3">
                <Brain className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-bold text-foreground">Clinical Research Integration:</span> These parameters are loaded directly into the diagnosis advisor templates. Doctors can query cardiovascular risks and chest scan assessments backed by this global weights set.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model Convergence Curve */}
          <Card className="border-border bg-card shadow-lg text-card-foreground">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <LineChart className="h-5 w-5 text-purple-400" />
                Aggregated Network Convergence
              </CardTitle>
              <CardDescription>
                Observe live accuracy progress as hospital nodes contribute weights across global epochs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                    <XAxis dataKey="round" stroke="#888" style={{ fontSize: "10px" }} />
                    <YAxis stroke="#a855f7" domain={[0.65, 0.98]} style={{ fontSize: "10px" }} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--popover)", borderColor: "var(--border)", color: "var(--popover-foreground)", borderRadius: "12px", fontSize: "11px" }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#a855f7" strokeWidth={3} name="Convergence Accuracy" activeDot={{ r: 6 }} />
                  </ReChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Active Node List + Privacy Explanation */}
        <div className="space-y-6">
          {/* Participating clinical nodes quick summary */}
          <Card className="border-border bg-card shadow-md text-card-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-purple-400 flex justify-between items-center">
                <span>Active Network Nodes</span>
                {isTraining && (
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                    <RefreshCw className="h-2 w-2 animate-spin" /> Training
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nodes.map(n => (
                <div key={n.id} className="p-3 bg-background border border-border rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-foreground truncate max-w-36">{n.name}</p>
                      <p className="text-[9px] text-muted-foreground font-mono">{n.location}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase ${
                      n.status === "training"
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        : n.status === "uploading"
                        ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
                        : n.status === "synced"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-muted/30 text-muted-foreground border-border"
                    }`}>
                      {n.status}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-[9px] border-t border-border/30 pt-1.5">
                    <span className="text-muted-foreground">Local Case Registry:</span>
                    <span className="font-bold text-foreground">{n.datasetSize.toLocaleString()} cases</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy Preservation explanation card */}
          <Card className="border-border bg-card bg-gradient-to-b from-purple-500/10 to-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-400" />
                Clinical Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                PulseKin implements a strict privacy-first infrastructure. Medical datasets never leave the participant clinics.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-[10px] text-purple-400 shrink-0">1</span>
                  <div>
                    <span className="font-bold text-foreground block">Isolated Sandbox Training</span>
                    Hospitals execute local training epochs behind their secure internal intranets.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-[10px] text-purple-400 shrink-0">2</span>
                  <div>
                    <span className="font-bold text-foreground block">Gradient Masking</span>
                    Instead of patient clinical files, only weight parameters are extracted and masked with Gaussian differential privacy noise.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-[10px] text-purple-400 shrink-0">3</span>
                  <div>
                    <span className="font-bold text-foreground block">Secure Homomorphic FedAvg</span>
                    The Central brain synthesizes weight sums in their encrypted state, producing an updated global intelligence model.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

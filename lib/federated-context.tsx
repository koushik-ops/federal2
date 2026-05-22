"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface HospitalNode {
  id: string
  name: string
  datasetSize: number
  localAccuracy: number
  status: "idle" | "training" | "uploading" | "synced" | "disconnected"
  connected: boolean
  lastSync: string
  location: string
  modelArchitecture: string
}

export interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: "info" | "success" | "warning" | "upload"
}

interface FederatedContextType {
  globalRound: number
  globalAccuracy: number[]
  isTraining: boolean
  nodes: HospitalNode[]
  logs: LogEntry[]
  startGlobalRound: () => void
  registerNode: (name: string, datasetSize: number, location: string) => HospitalNode
  runLocalTraining: (nodeId: string) => void
  syncNodeWeights: (nodeId: string) => void
  resetSimulation: () => void
  clearLogs: () => void
}

const FederatedContext = createContext<FederatedContextType | undefined>(undefined)

const DEFAULT_NODES: HospitalNode[] = [
  {
    id: "PULSE-NODE-NH",
    name: "Narayana Health",
    datasetSize: 14250,
    localAccuracy: 0.824,
    status: "idle",
    connected: true,
    lastSync: "2 hours ago",
    location: "Karnataka",
    modelArchitecture: "MedGemma-7B-Dense"
  },
  {
    id: "PULSE-NODE-ASTER",
    name: "Aster CMI Hospital",
    datasetSize: 16800,
    localAccuracy: 0.836,
    status: "idle",
    connected: true,
    lastSync: "3 hours ago",
    location: "Karnataka",
    modelArchitecture: "MedGemma-7B-Dense"
  },
  {
    id: "PULSE-NODE-KOKILABEN",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    datasetSize: 8450,
    localAccuracy: 0.812,
    status: "idle",
    connected: true,
    lastSync: "1 hour ago",
    location: "Maharashtra",
    modelArchitecture: "MedGemma-7B-Dense"
  },
  {
    id: "PULSE-NODE-MEDANTA",
    name: "Medanta – The Medicity",
    datasetSize: 11200,
    localAccuracy: 0.809,
    status: "idle",
    connected: true,
    lastSync: "4 hours ago",
    location: "Haryana",
    modelArchitecture: "MedGemma-7B-Dense"
  }
]

const DEFAULT_LOGS: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "15:40:12",
    message: "Federated Learning Aggregator Core v1.2 initialized successfully.",
    type: "info"
  },
  {
    id: "log-2",
    timestamp: "15:40:15",
    message: "Established secure homomorphic encryption tunnels for connected nodes.",
    type: "success"
  },
  {
    id: "log-3",
    timestamp: "15:41:00",
    message: "Central server synced with pre-trained global model weight set (MedGemma-7B-Dense v2.4).",
    type: "info"
  }
]

const DEFAULT_ACCURACY = [0.72, 0.74, 0.76, 0.78, 0.79, 0.815]

const STORAGE_KEY = "pulsekin_federated_state"

export function FederatedProvider({ children }: { children: ReactNode }) {
  const [globalRound, setGlobalRound] = useState<number>(6)
  const [globalAccuracy, setGlobalAccuracy] = useState<number[]>(DEFAULT_ACCURACY)
  const [isTraining, setIsTraining] = useState<boolean>(false)
  const [nodes, setNodes] = useState<HospitalNode[]>(DEFAULT_NODES)
  const [logs, setLogs] = useState<LogEntry[]>(DEFAULT_LOGS)

  // Write state to localStorage helper
  const saveState = (
    round: number,
    accuracy: number[],
    training: boolean,
    currentNodes: HospitalNode[],
    currentLogs: LogEntry[]
  ) => {
    if (typeof window !== "undefined") {
      const stateString = JSON.stringify({
        globalRound: round,
        globalAccuracy: accuracy,
        isTraining: training,
        nodes: currentNodes,
        logs: currentLogs
      })
      localStorage.setItem(STORAGE_KEY, stateString)
    }
  }

  // Load from localStorage on mount and register listeners for tab sync
  useEffect(() => {
    const loadState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          setGlobalRound(parsed.globalRound ?? 6)
          setGlobalAccuracy(parsed.globalAccuracy ?? DEFAULT_ACCURACY)
          setIsTraining(parsed.isTraining ?? false)
          setNodes(parsed.nodes ?? DEFAULT_NODES)
          setLogs(parsed.logs ?? DEFAULT_LOGS)
        } else {
          // Initialize localStorage
          saveState(6, DEFAULT_ACCURACY, false, DEFAULT_NODES, DEFAULT_LOGS)
        }
      } catch (err) {
        console.error("Error loading federated state", err)
      }
    }

    loadState()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          setGlobalRound(parsed.globalRound)
          setGlobalAccuracy(parsed.globalAccuracy)
          setIsTraining(parsed.isTraining)
          setNodes(parsed.nodes)
          setLogs(parsed.logs)
        } catch (err) {
          console.error("Error parsing storage change", err)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Helper to append a log
  const addLogMessage = (message: string, type: "info" | "success" | "warning" | "upload", currentLogs?: LogEntry[]): LogEntry[] => {
    const now = new Date()
    const timestamp = now.toTimeString().split(" ")[0]
    const newLog: LogEntry = {
      id: `log-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      message,
      type
    }
    const updated = [newLog, ...(currentLogs || logs)].slice(0, 100) // Keep last 100 logs
    return updated
  }

  // Register a new Node (triggered by Hospital portal)
  const registerNode = (name: string, datasetSize: number, location: string): HospitalNode => {
    const id = `PULSE-NODE-${name.replace(/\s+/g, "-").toUpperCase().slice(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`
    const newNode: HospitalNode = {
      id,
      name,
      datasetSize,
      localAccuracy: 0.78 + Math.random() * 0.05,
      status: "idle",
      connected: true,
      lastSync: "Just now",
      location,
      modelArchitecture: "MedGemma-7B-Dense"
    }

    const updatedNodes = [...nodes.filter(n => n.id !== id), newNode]
    const updatedLogs = addLogMessage(`New Node Connected: ${name} (ID: ${id}) registered.`, "success")
    
    setNodes(updatedNodes)
    setLogs(updatedLogs)
    saveState(globalRound, globalAccuracy, isTraining, updatedNodes, updatedLogs)

    return newNode
  }

  // Run local training step for a node
  const runLocalTraining = (nodeId: string) => {
    // Start training state
    let currentNodes = nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, status: "training" as const }
      }
      return n
    })
    let currentLogs = addLogMessage(`Local AI training started on Node: ${nodeId}`, "info")
    setNodes(currentNodes)
    setLogs(currentLogs)
    saveState(globalRound, globalAccuracy, isTraining, currentNodes, currentLogs)

    // Simulate completion of local training (2 seconds)
    setTimeout(() => {
      currentNodes = currentNodes.map(n => {
        if (n.id === nodeId) {
          const accuracyGained = 0.005 + Math.random() * 0.015
          return {
            ...n,
            status: "idle" as const,
            localAccuracy: Math.min(0.98, n.localAccuracy + accuracyGained),
            lastSync: "Just now"
          }
        }
        return n
      })
      currentLogs = addLogMessage(`Local training complete on Node ${nodeId}. Local accuracy increased.`, "success", currentLogs)
      setNodes(currentNodes)
      setLogs(currentLogs)
      saveState(globalRound, globalAccuracy, isTraining, currentNodes, currentLogs)
    }, 2000)
  }

  // Encrypt and Sync model weights from a node to central server
  const syncNodeWeights = (nodeId: string) => {
    let currentNodes = nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, status: "uploading" as const }
      }
      return n
    })
    const nodeName = nodes.find(n => n.id === nodeId)?.name || nodeId
    let currentLogs = addLogMessage(`Homomorphic encryption wrapper applied. Uploading model weights from ${nodeName}...`, "upload")
    setNodes(currentNodes)
    setLogs(currentLogs)
    saveState(globalRound, globalAccuracy, isTraining, currentNodes, currentLogs)

    // Simulate upload completion (2.5 seconds)
    setTimeout(() => {
      currentNodes = currentNodes.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            status: "synced" as const,
            lastSync: "Just now"
          }
        }
        return n
      })
      currentLogs = addLogMessage(`Secure Gradient Update verified and aggregated from node: ${nodeName}`, "success", currentLogs)
      
      setNodes(currentNodes)
      setLogs(currentLogs)
      saveState(globalRound, globalAccuracy, isTraining, currentNodes, currentLogs)
    }, 2500)
  }

  // Perform fully automated global training round (Central Orchestration)
  const startGlobalRound = () => {
    if (isTraining) return
    setIsTraining(true)
    
    // Step 1: Broadcast Round start
    let currentNodes = nodes.map(n => n.connected ? { ...n, status: "training" as const } : n)
    let currentLogs = addLogMessage(`Global Round ${globalRound + 1} initiated. Broadcasting request to active nodes...`, "info")
    setNodes(currentNodes)
    setLogs(currentLogs)
    saveState(globalRound, globalAccuracy, true, currentNodes, currentLogs)

    // Step 2: Nodes complete local training and start uploading weights (4 seconds in)
    setTimeout(() => {
      currentNodes = currentNodes.map(n => {
        if (n.connected && n.status === "training") {
          const accuracyGained = 0.003 + Math.random() * 0.012
          return {
            ...n,
            status: "uploading" as const,
            localAccuracy: Math.min(0.97, n.localAccuracy + accuracyGained)
          }
        }
        return n
      })
      currentLogs = addLogMessage(`Nodes finished local epochs. Encrypted weights/gradients streaming to central AI core...`, "upload", currentLogs)
      setNodes(currentNodes)
      setLogs(currentLogs)
      saveState(globalRound, globalAccuracy, true, currentNodes, currentLogs)
    }, 4000)

    // Step 3: Server aggregates updates and updates global model (8 seconds in)
    setTimeout(() => {
      currentNodes = currentNodes.map(n => {
        if (n.connected && n.status === "uploading") {
          return { ...n, status: "synced" as const }
        }
        return n
      })
      currentLogs = addLogMessage(`All node gradient updates received. Initiating FedAvg (Federated Averaging) calculations...`, "info", currentLogs)
      setNodes(currentNodes)
      setLogs(currentLogs)
      saveState(globalRound, globalAccuracy, true, currentNodes, currentLogs)
    }, 8000)

    // Step 4: Complete Round, update accuracy, and redistribute (11 seconds in)
    setTimeout(() => {
      const prevAccuracy = globalAccuracy[globalAccuracy.length - 1]
      const newAccuracyVal = Math.min(0.965, prevAccuracy + (0.008 + Math.random() * 0.012))
      const updatedAccuracyList = [...globalAccuracy, newAccuracyVal]
      const newRoundNum = globalRound + 1
      
      currentNodes = currentNodes.map(n => ({
        ...n,
        status: "idle" as const,
        lastSync: "Just now"
      }))
      
      currentLogs = addLogMessage(`Global Model aggregation complete. Convergence accuracy: ${(newAccuracyVal * 100).toFixed(2)}%.`, "success", currentLogs)
      currentLogs = addLogMessage(`Round ${newRoundNum} successfully closed. Updated global weights redistributed to nodes.`, "success", currentLogs)
      
      setGlobalRound(newRoundNum)
      setGlobalAccuracy(updatedAccuracyList)
      setIsTraining(false)
      setNodes(currentNodes)
      setLogs(currentLogs)
      saveState(newRoundNum, updatedAccuracyList, false, currentNodes, currentLogs)
    }, 11000)
  }

  // Reset the simulation to original state
  const resetSimulation = () => {
    setGlobalRound(6)
    setGlobalAccuracy(DEFAULT_ACCURACY)
    setIsTraining(false)
    setNodes(DEFAULT_NODES)
    setLogs(DEFAULT_LOGS)
    saveState(6, DEFAULT_ACCURACY, false, DEFAULT_NODES, DEFAULT_LOGS)
  }

  // Clear log console
  const clearLogs = () => {
    setLogs([])
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        parsed.logs = []
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
      }
    }
  }

  return (
    <FederatedContext.Provider
      value={{
        globalRound,
        globalAccuracy,
        isTraining,
        nodes,
        logs,
        startGlobalRound,
        registerNode,
        runLocalTraining,
        syncNodeWeights,
        resetSimulation,
        clearLogs
      }}
    >
      {children}
    </FederatedContext.Provider>
  )
}

export function useFederated() {
  const context = useContext(FederatedContext)
  if (context === undefined) {
    throw new Error("useFederated must be used within a FederatedProvider")
  }
  return context
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [phase, setPhase] = useState<"intro" | "portal-select">("intro")
  const [showYou, setShowYou] = useState(false)
  const [showMatter, setShowMatter] = useState(false)
  const [showTagline, setShowTagline] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Intro animation sequence
    const youTimer = setTimeout(() => setShowYou(true), 300)
    const matterTimer = setTimeout(() => setShowMatter(true), 800)
    const taglineTimer = setTimeout(() => setShowTagline(true), 1400)
    
    // Transition to portal select after 3 seconds
    const fadeTimer = setTimeout(() => setFadeOut(true), 2700)
    const transitionTimer = setTimeout(() => setPhase("portal-select"), 3000)
    
    return () => {
      clearTimeout(youTimer)
      clearTimeout(matterTimer)
      clearTimeout(taglineTimer)
      clearTimeout(fadeTimer)
      clearTimeout(transitionTimer)
    }
  }, [])

  if (phase === "intro") {
    return (
      <div className={`relative min-h-screen w-full overflow-hidden bg-black transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
        {/* Rotating DNA Backdrop Fallback */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <img
            src="/download.jpeg"
            alt="Rotating DNA Helix Background"
            className="rotating-bg absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>

        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/download.jpeg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/YOU.%20MATTER.-s7V0rJPQE4n9snDBHyjNxJcSznslWC.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/30" />

        {/* PulseKin Logo */}
        <div className="absolute left-8 top-8 z-20">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <svg viewBox="0 0 48 48" className="h-full w-full">
                <defs>
                  <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path
                  d="M24 4 L24 18 L18 24 L24 24 L24 44 M8 24 L18 24 M24 24 L40 24"
                  stroke="url(#pulseGrad)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="24" cy="24" r="20" stroke="url(#pulseGrad)" strokeWidth="2" fill="none" opacity="0.3" />
              </svg>
            </div>
            <span className="font-serif text-2xl font-bold italic text-white">PulseKin</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen flex-col justify-between px-8 py-24 md:px-16 lg:px-24">
          <div className="overflow-hidden">
            <h1
              className={`font-serif text-6xl font-bold italic tracking-tight md:text-8xl lg:text-9xl transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                showYou ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
              }`}
            >
              <span className="gradient-pink-purple">YOU.</span>
            </h1>
          </div>

          <div className={`flex justify-center transition-all duration-700 ${showTagline ? "opacity-100" : "opacity-0"}`}>
            <p className="text-center text-lg uppercase tracking-[0.3em] text-gray-300">
              AI Healthcare Platform
            </p>
          </div>

          <div className="flex justify-end overflow-hidden">
            <h1
              className={`font-serif text-6xl font-bold italic tracking-tight md:text-8xl lg:text-9xl transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                showMatter ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
              }`}
            >
              <span className="gradient-orange-yellow">MATTER.</span>
            </h1>
          </div>
        </div>

        {/* Loading Progress */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <div className="h-full animate-[progress_3s_ease-in-out_forwards] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500" 
                 style={{ width: "100%" }} />
          </div>
        </div>

        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    )
  }

  // Portal Selection Phase
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Rotating DNA Backdrop Fallback */}
      <div className="absolute inset-0 overflow-hidden opacity-25">
        <img
          src="/download.jpeg"
          alt="Rotating DNA Helix Background"
          className="rotating-bg absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 object-cover"
        />
      </div>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/download.jpeg"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      >
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/YOU.%20MATTER.-s7V0rJPQE4n9snDBHyjNxJcSznslWC.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20"
            style={{
              width: Math.random() * 10 + 5 + "px",
              height: Math.random() * 10 + 5 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `-${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Logo & Branding */}
        <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-4 flex justify-center">
            <div className="relative h-20 w-20">
              <svg viewBox="0 0 48 48" className="h-full w-full">
                <defs>
                  <linearGradient id="pulseGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path
                  d="M24 4 L24 18 L18 24 L24 24 L24 44 M8 24 L18 24 M24 24 L40 24"
                  stroke="url(#pulseGrad2)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="24" cy="24" r="20" stroke="url(#pulseGrad2)" strokeWidth="2" fill="none" opacity="0.3" />
              </svg>
            </div>
          </div>
          <h1 className="font-serif text-5xl font-bold italic md:text-6xl">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              PulseKin
            </span>
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-gray-400">
            AI Healthcare Platform
          </p>
        </div>

        {/* Portal Selection */}
        <div className="w-full max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-semibold text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Choose Your Portal
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Patient Portal */}
            <button
              onClick={() => router.push("/login?role=patient")}
              className="group relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-pink-500/60 hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-500/20">
                    <svg className="h-10 w-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-3 text-center text-xl font-semibold text-white">Patient Portal</h3>
                <p className="text-center text-sm text-gray-400">
                  Upload reports, chat with AI doctor, get health predictions and find nearby specialists
                </p>
              </div>
            </button>

            {/* Doctor Portal */}
            <button
              onClick={() => router.push("/login?role=doctor")}
              className="group relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-purple-500/60 hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-500/20">
                    <svg className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-3 text-center text-xl font-semibold text-white">Doctor Portal</h3>
                <p className="text-center text-sm text-gray-400">
                  Review anonymized cases, AI predictions, SHAP explainability and federated insights
                </p>
              </div>
            </button>

            {/* Admin/Technician Portal */}
            <button
              onClick={() => router.push("/login?role=admin")}
              className="group relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-orange-500/60 hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/20">
                    <svg className="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-3 text-center text-xl font-semibold text-white">Admin Portal</h3>
                <p className="text-center text-sm text-gray-400">
                  Monitor federated learning network, model metrics, hospital nodes and system health
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Privacy Badge */}
        <div className="mt-12 flex items-center gap-3 rounded-full border border-green-500/30 bg-green-500/10 px-6 py-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-sm text-green-400">Privacy-Preserving Federated AI</span>
          <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useUser } from "@/lib/user-context"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Shield,
  Stethoscope,
  HeartPulse,
} from "lucide-react"

function MultiRoleAuthContent() {
  const searchParams = useSearchParams()
  const roleFromUrl = searchParams.get("role") as "patient" | "doctor" | "admin" | null
  
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [selectedRole, setSelectedRole] = useState<
    "patient" | "doctor" | "admin"
  >(roleFromUrl || "patient")

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")

  const router = useRouter()
  const { login } = useUser()
  
  useEffect(() => {
    if (roleFromUrl) {
      setSelectedRole(roleFromUrl)
    }
  }, [roleFromUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Determine the display name
    const displayName = activeTab === "signup" && fullName
      ? fullName
      : email.split("@")[0] // fallback to email username for login

    // Store user info in context + localStorage
    login({
      name: selectedRole === "doctor" ? `Dr. ${displayName}` : displayName,
      email,
      role: selectedRole,
    })

    // Redirect based on role
    if (selectedRole === "doctor") {
      router.push("/doctor-dashboard")
    } else if (selectedRole === "admin") {
      router.push("/admin-dashboard")
    } else {
      router.push("/patient-dashboard")
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">

      {/* ANIMATIONS */}
      <style>{`
        @keyframes rotateBg {
          0% {
            transform: scale(1.1) rotate(0deg);
          }

          50% {
            transform: scale(1.18) rotate(180deg);
          }

          100% {
            transform: scale(1.1) rotate(360deg);
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }

          20% {
            left: 120%;
          }

          100% {
            left: 120%;
          }
        }

        .rotating-bg {
          animation: rotateBg 70s linear infinite;
          transform-origin: center;
        }

        .shine-button {
          position: relative;
          overflow: hidden;
        }

        .shine-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 40%;
          height: 100%;

          background: linear-gradient(
            120deg,
            transparent,
            rgba(255,255,255,0.4),
            transparent
          );

          transform: skewX(-20deg);

          animation: shine 3s infinite;
        }
      `}</style>

      {/* VIDEO BACKGROUND WITH ROTATING BACKDROP FALLBACK */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/download.jpeg"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        >
          <source src="/back.mp4" type="video/mp4" />
        </video>
        {/* Fallback rotating DNA in case video fails or is loading */}
        <div className="absolute inset-0 -z-10 bg-black">
          <img
            src="/download.jpeg"
            alt="Background Fallback"
            className="rotating-bg absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 object-cover opacity-40"
          />
        </div>
      </div>

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/40 to-orange-900/20" />

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">

        <div className="w-full max-w-md">

          {/* BRANDING */}
          <div className="mb-6 text-center">

            <h1 className="font-serif text-5xl font-bold italic tracking-tight md:text-6xl">
              <span
                style={{
                  background:
                    "linear-gradient(90deg,#9333ea 0%,#ec4899 50%,#f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PulseKin
              </span>
            </h1>

            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-300">
              AI Healthcare Platform
            </p>

          </div>

          {/* GLASS CARD */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)]">

            {/* LOGIN / SIGNUP TABS */}
            <div className="relative mb-6 flex border-b border-white/10">

              <button
                onClick={() => setActiveTab("login")}
                className={`relative flex-1 pb-3 text-sm font-medium transition ${
                  activeTab === "login"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
                {activeTab === "login" && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("signup")}
                className={`relative flex-1 pb-3 text-sm font-medium transition ${
                  activeTab === "signup"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Create Account
                {activeTab === "signup" && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500" />
                )}
              </button>

            </div>

            {/* ROLE SELECTOR */}
            <div className="mb-6 grid grid-cols-3 gap-3">

              {/* PATIENT */}
              <button
                onClick={() => setSelectedRole("patient")}
                className={`flex flex-col items-center rounded-2xl border p-4 transition-all ${
                  selectedRole === "patient"
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <HeartPulse className="mb-2 h-6 w-6 text-pink-400" />

                <span className="text-sm text-white">
                  Patient
                </span>
              </button>

              {/* DOCTOR */}
              <button
                onClick={() => setSelectedRole("doctor")}
                className={`flex flex-col items-center rounded-2xl border p-4 transition-all ${
                  selectedRole === "doctor"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Stethoscope className="mb-2 h-6 w-6 text-purple-400" />

                <span className="text-sm text-white">
                  Doctor
                </span>
              </button>

              {/* ADMIN */}
              <button
                onClick={() => setSelectedRole("admin")}
                className={`flex flex-col items-center rounded-2xl border p-4 transition-all ${
                  selectedRole === "admin"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Shield className="mb-2 h-6 w-6 text-orange-400" />

                <span className="text-sm text-white">
                  Admin
                </span>
              </button>

            </div>

            {/* HEADER */}
            <div className="mb-6 text-center">

              <h2 className="text-2xl font-semibold text-white">
                {activeTab === "login"
                  ? `Login as ${
                      selectedRole.charAt(0).toUpperCase() +
                      selectedRole.slice(1)
                    }`
                  : `Create ${selectedRole} Account`}
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Secure AI-powered healthcare access
              </p>

            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {activeTab === "signup" && (
                <div className="relative">

                  <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />

                  <Input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-xl border-0 bg-white/5 pl-12 text-white placeholder:text-gray-500"
                    required
                  />

                </div>
              )}

              {/* EMAIL */}
              <div className="relative">

                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />

                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-0 bg-white/5 pl-12 text-white placeholder:text-gray-500"
                  required
                />

              </div>

              {/* PASSWORD */}
              <div className="relative">

                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-12 rounded-xl border-0 bg-white/5 pl-12 pr-12 text-white placeholder:text-gray-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>

              {/* LOGIN OPTIONS */}
              {activeTab === "login" && (
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                    />

                    <span className="text-sm text-gray-400">
                      Remember me
                    </span>

                  </div>

                  <button
                    type="button"
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Forgot password?
                  </button>

                </div>
              )}

              {/* BUTTON */}
              <Button
                type="submit"
                className="shine-button h-12 w-full rounded-xl text-base font-bold text-black"
                style={{
                  background:
                    "linear-gradient(90deg,#7c3aed 0%,#ec4899 50%,#f59e0b 100%)",
                }}
              >
                {activeTab === "login"
                  ? `Login as ${
                      selectedRole.charAt(0).toUpperCase() +
                      selectedRole.slice(1)
                    }`
                  : `Create ${selectedRole} Account`}
              </Button>

            </form>

            {/* FOOTER */}
            <p className="mt-6 text-center text-sm text-gray-400">

              {activeTab === "login" ? (
                <>
                  Don’t have an account?{" "}

                  <button
                    onClick={() => setActiveTab("signup")}
                    className="font-medium text-orange-400 hover:underline"
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}

                  <button
                    onClick={() => setActiveTab("login")}
                    className="font-medium text-pink-400 hover:underline"
                  >
                    Login
                  </button>
                </>
              )}

            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function MultiRoleAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <MultiRoleAuthContent />
    </Suspense>
  )
}

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
  Building2,
  Key,
  Cpu,
  Network,
  ShieldAlert,
  Terminal,
  Activity,
  LockKeyhole,
} from "lucide-react"

function MultiRoleAuthContent() {
  const searchParams = useSearchParams()
  const roleFromUrl = searchParams.get("role") as "patient" | "doctor" | "admin" | "hospital" | null
  
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [selectedRole, setSelectedRole] = useState<
    "patient" | "doctor" | "admin" | "hospital"
  >(roleFromUrl || "patient")

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")

  // Hospital Portal States
  const [nodeId, setNodeId] = useState("")
  const [federationToken, setFederationToken] = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStep, setVerificationStep] = useState(0)

  // Admin Command Portal States
  const [adminId, setAdminId] = useState("")
  const [masterKey, setMasterKey] = useState("")
  const [adminPassphrase, setAdminPassphrase] = useState("")
  const [isAdminVerifying, setIsAdminVerifying] = useState(false)
  const [adminVerificationStep, setAdminVerificationStep] = useState(0)

  // Doctor Portal States
  const [licenseId, setLicenseId] = useState("")
  const [hospitalCode, setHospitalCode] = useState("")
  const [doctorPassword, setDoctorPassword] = useState("")

  const [authError, setAuthError] = useState("")

  const router = useRouter()
  const { login } = useUser()
  
  useEffect(() => {
    if (roleFromUrl) {
      setSelectedRole(roleFromUrl)
    }
  }, [roleFromUrl])

  // Clear verification states when role changes
  useEffect(() => {
    setAuthError("")
    setIsVerifying(false)
    setIsAdminVerifying(false)
  }, [selectedRole])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedRole === "hospital") {
      setAuthError("")
      
      let hospitalName = ""
      const cleanNodeId = nodeId.trim()
      const cleanToken = federationToken.trim()

      if (cleanNodeId === "HSP-NH-2045" && cleanToken === "PKFED-NH-9921") {
        hospitalName = "Narayana Health"
      } else if (cleanNodeId === "HSP-ASTER-8831" && cleanToken === "PKFED-ASTER-1128") {
        hospitalName = "Aster CMI Hospital"
      } else if (cleanNodeId === "HSP-KDAH-1192" && cleanToken === "PKFED-KDAH-6621") {
        hospitalName = "Kokilaben Dhirubhai Ambani Hospital"
      }

      if (!hospitalName) {
        setAuthError("Signature Verification Failed: Invalid Node ID or Federation Access Token")
        return
      }

      if (!passphrase.trim()) {
        setAuthError("Access Denied: Passphrase is required for decryption keys")
        return
      }

      // Start verification handshake simulation
      setIsVerifying(true)
      setVerificationStep(0)

      setTimeout(() => {
        setVerificationStep(1)
        setTimeout(() => {
          setVerificationStep(2)
          setTimeout(() => {
            setVerificationStep(3)
            setTimeout(() => {
              login({
                name: hospitalName,
                email: `${cleanNodeId.toLowerCase()}@federation.pulsekin.ai`,
                role: "hospital",
              })
              setIsVerifying(false)
              router.push("/hospital-dashboard")
            }, 800)
          }, 1000)
        }, 1000)
      }, 1000)
      return
    }

    if (selectedRole === "admin") {
      setAuthError("")
      
      const cleanAdminId = adminId.trim()
      const cleanMasterKey = masterKey.trim()

      if (cleanAdminId !== "CTRL-ADMIN-01" || cleanMasterKey !== "FED-MASTER-X992") {
        setAuthError("Security Exception: Invalid Central Authority Signature or Master Key Mismatch")
        return
      }

      if (!adminPassphrase.trim()) {
        setAuthError("Access Denied: Passphrase is required for decryption keys")
        return
      }

      // Start verification handshake simulation
      setIsAdminVerifying(true)
      setAdminVerificationStep(0)

      // Steps:
      // 0: “Verifying Central Authority...”
      // 1: “Federation Access Confirmed”
      // 2: “Secure AI Aggregator Connected”
      // 3: “Global Control Channel Established”
      // 4: “Federated System Initialized”
      setTimeout(() => {
        setAdminVerificationStep(1)
        setTimeout(() => {
          setAdminVerificationStep(2)
          setTimeout(() => {
            setAdminVerificationStep(3)
            setTimeout(() => {
              setAdminVerificationStep(4)
              setTimeout(() => {
                login({
                  name: "Central Authority (CTRL-ADMIN-01)",
                  email: "admin@federation.pulsekin.ai",
                  role: "admin",
                })
                setIsAdminVerifying(false)
                router.push("/admin-dashboard")
              }, 800)
            }, 800)
          }, 800)
        }, 800)
      }, 800)
      return
    }

    if (selectedRole === "doctor") {
      setAuthError("")
      
      const cleanLicenseId = licenseId.trim()
      const cleanHospitalCode = hospitalCode.trim()
      const cleanPassword = doctorPassword.trim()

      let docName = ""
      let docEmail = ""

      if (
        cleanLicenseId === "DOC-KAR-8821" &&
        cleanHospitalCode === "APL-HOSP-2045" &&
        cleanPassword === "doctor123"
      ) {
        docName = "Dr. Rajesh Kumar"
        docEmail = "rajesh.kumar@apollo.pulsekin.ai"
      } else if (
        cleanLicenseId === "DOC-MUM-5512" &&
        cleanHospitalCode === "MAN-HOSP-8831" &&
        cleanPassword === "doctor123"
      ) {
        docName = "Dr. Priya Sharma"
        docEmail = "priya.sharma@manipal.pulsekin.ai"
      }

      if (!docName) {
        setAuthError("Authentication Failed: Invalid License ID, Hospital Affiliation Code, or Password")
        return
      }

      // Redirect directly to dashboard without delay
      login({
        name: docName,
        email: docEmail,
        role: "doctor",
      })
      router.push("/doctor-dashboard")
      return
    }

    // Determine the display name
    const displayName = activeTab === "signup" && fullName
      ? fullName
      : email.split("@")[0] // fallback to email username for login

    // Store user info in context + localStorage
    login({
      name: displayName,
      email,
      role: selectedRole,
    })

    // Redirect based on role
    router.push("/patient-dashboard")
  }

  const autofillDemoNode = (node: "narayana" | "aster" | "kokilaben") => {
    if (node === "narayana") {
      setNodeId("HSP-NH-2045")
      setFederationToken("PKFED-NH-9921")
      setPassphrase("narayana-secure-node-key")
    } else if (node === "aster") {
      setNodeId("HSP-ASTER-8831")
      setFederationToken("PKFED-ASTER-1128")
      setPassphrase("aster-secure-node-key")
    } else if (node === "kokilaben") {
      setNodeId("HSP-KDAH-1192")
      setFederationToken("PKFED-KDAH-6621")
      setPassphrase("kokilaben-secure-node-key")
    }
  }

  const autofillDemoAdmin = () => {
    setAdminId("CTRL-ADMIN-01")
    setMasterKey("FED-MASTER-X992")
    setAdminPassphrase("admin-master-control-key")
  }

  const autofillDemoDoctor = (doctor: "rajesh" | "priya") => {
    if (doctor === "rajesh") {
      setLicenseId("DOC-KAR-8821")
      setHospitalCode("APL-HOSP-2045")
      setDoctorPassword("doctor123")
    } else if (doctor === "priya") {
      setLicenseId("DOC-MUM-5512")
      setHospitalCode("MAN-HOSP-8831")
      setDoctorPassword("doctor123")
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

        @keyframes scanline {
          0% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0%;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(6,182,212,0.15), 0 0 40px rgba(59,130,246,0.1);
          }
          50% {
            box-shadow: 0 0 35px rgba(6,182,212,0.4), 0 0 70px rgba(59,130,246,0.25);
          }
        }

        @keyframes admin-pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168,85,247,0.15), 0 0 40px rgba(239,68,68,0.1);
          }
          50% {
            box-shadow: 0 0 35px rgba(168,85,247,0.4), 0 0 70px rgba(239,68,68,0.25);
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

        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }

        .animate-admin-glow {
          animation: admin-pulse-glow 2s infinite;
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
          <source src="/back2.mp4" type="video/mp4" />
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
          <div className={`relative rounded-3xl border p-6 transition-all duration-700 overflow-hidden ${
            selectedRole === "hospital" && isVerifying
              ? "border-cyan-500/50 bg-cyan-950/10 shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-pulse-glow"
              : selectedRole === "admin" && isAdminVerifying
              ? "border-purple-500/50 bg-purple-950/10 shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-admin-glow"
              : selectedRole === "doctor"
              ? "border-teal-500/30 bg-teal-950/5 shadow-[0_4_30px_rgba(0,0,0,0.3)] backdrop-blur-md"
              : "border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)]"
          }`}>

            {/* Holographic Scanline for Hospital/Admin verification */}
            {selectedRole === "hospital" && isVerifying && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-85 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-[scanline_2s_ease-in-out_infinite]" />
            )}
            {selectedRole === "admin" && isAdminVerifying && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/80 to-transparent opacity-85 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-[scanline_2s_ease-in-out_infinite]" />
            )}

            {/* LOGIN / SIGNUP TABS */}
            {selectedRole !== "hospital" && selectedRole !== "admin" && selectedRole !== "doctor" && (
              <div className="relative mb-6 flex border-b border-white/10">

                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`relative flex-1 pb-3 text-sm font-medium transition cursor-pointer ${
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
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className={`relative flex-1 pb-3 text-sm font-medium transition cursor-pointer ${
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
            )}

            {/* ROLE SELECTOR */}
            <div className="mb-6 grid grid-cols-4 gap-2">

              {/* PATIENT */}
              <button
                type="button"
                onClick={() => setSelectedRole("patient")}
                className={`flex flex-col items-center justify-center rounded-2xl border p-2 transition-all cursor-pointer ${
                  selectedRole === "patient"
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <HeartPulse className="mb-1 h-5 w-5 text-pink-400" />
                <span className="text-[10px] md:text-xs text-white">
                  Patient
                </span>
              </button>

              {/* DOCTOR */}
              <button
                type="button"
                onClick={() => setSelectedRole("doctor")}
                className={`flex flex-col items-center justify-center rounded-2xl border p-2 transition-all cursor-pointer ${
                  selectedRole === "doctor"
                    ? "border-teal-500 bg-teal-500/15 shadow-[0_0_12px_rgba(20,184,166,0.15)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Stethoscope className="mb-1 h-5 w-5 text-teal-400" />
                <span className="text-[10px] md:text-xs text-white">
                  Doctor
                </span>
              </button>

              {/* ADMIN */}
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`flex flex-col items-center justify-center rounded-2xl border p-2 transition-all cursor-pointer ${
                  selectedRole === "admin"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Shield className="mb-1 h-5 w-5 text-purple-400" />
                <span className="text-[10px] md:text-xs text-white">
                  Admin
                </span>
              </button>

              {/* HOSPITAL */}
              <button
                type="button"
                onClick={() => setSelectedRole("hospital")}
                className={`flex flex-col items-center justify-center rounded-2xl border p-2 transition-all cursor-pointer ${
                  selectedRole === "hospital"
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Building2 className="mb-1 h-5 w-5 text-cyan-400" />
                <span className="text-[10px] md:text-xs text-white">
                  Hospital
                </span>
              </button>

            </div>

            {/* HEADER */}
            {selectedRole !== "hospital" && selectedRole !== "admin" && selectedRole !== "doctor" && (
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
            )}

            {/* FORM */}
            {selectedRole === "hospital" ? (
              <div className="space-y-5">
                {/* Header Subtitle */}
                <div className="text-center mb-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                    <Network className="h-3 w-3 animate-pulse" />
                    Federated AI Node
                  </div>
                  <h3 className="text-lg font-medium text-white">Secure Hospital Federation Access Portal</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Institutional authentication & encrypted model synchronization
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-400 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Form fields if not currently verifying */}
                {!isVerifying ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Node ID */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                        Hospital Node ID
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-cyan-500/70" />
                        <Input
                          type="text"
                          placeholder="e.g. HSP-APL-2045"
                          value={nodeId}
                          onChange={(e) => setNodeId(e.target.value)}
                          className="h-12 rounded-xl border border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 transition-all font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Access Token */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                        Federation Access Token
                      </label>
                      <div className="relative">
                        <Key className="absolute left-4 top-3.5 h-5 w-5 text-cyan-500/70" />
                        <Input
                          type="text"
                          placeholder="e.g. PKFED-APL-9921"
                          value={federationToken}
                          onChange={(e) => setFederationToken(e.target.value)}
                          className="h-12 rounded-xl border border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 transition-all font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Passphrase */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                        Secure Passphrase
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-cyan-500/70" />
                        <Input
                          type="password"
                          placeholder="••••••••••••••••"
                          value={passphrase}
                          onChange={(e) => setPassphrase(e.target.value)}
                          className="h-12 rounded-xl border border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Connect Button */}
                    <Button
                      type="submit"
                      className="shine-button h-12 w-full rounded-xl text-base font-bold text-black cursor-pointer"
                      style={{
                        background: "linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)",
                      }}
                    >
                      Connect to Federation
                    </Button>

                    {/* Auto-fill buttons */}
                    <div className="pt-3 border-t border-white/5">
                      <div className="text-center mb-2">
                        <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                          Authorized Demonstration Nodes
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => autofillDemoNode("narayana")}
                          className="text-[10px] py-1.5 px-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/40 transition text-center cursor-pointer font-medium"
                        >
                          Narayana
                        </button>
                        <button
                          type="button"
                          onClick={() => autofillDemoNode("aster")}
                          className="text-[10px] py-1.5 px-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/40 transition text-center cursor-pointer font-medium font-semibold"
                        >
                          Aster CMI
                        </button>
                        <button
                          type="button"
                          onClick={() => autofillDemoNode("kokilaben")}
                          className="text-[10px] py-1.5 px-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/40 transition text-center cursor-pointer font-medium font-semibold truncate"
                          title="Kokilaben Hospital"
                        >
                          Kokilaben
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* VERIFYING SIMULATION */
                  <div className="space-y-6 py-6 flex flex-col items-center">
                    {/* Visual scan indicator */}
                    <div className="relative w-28 h-28 rounded-full border-2 border-cyan-500/30 flex items-center justify-center bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden">
                      {/* Scanning sweep */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent animate-pulse" />
                      
                      {/* Rotating server rings */}
                      <div className="absolute inset-2 border border-dashed border-cyan-400/40 rounded-full animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-4 border border-dashed border-blue-500/30 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
                      
                      {/* Center icon based on step */}
                      {verificationStep < 2 ? (
                        <Cpu className="h-10 w-10 text-cyan-400 animate-pulse" />
                      ) : (
                        <Network className="h-10 w-10 text-emerald-400 animate-bounce" />
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full space-y-2">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                          style={{
                            width: `${(verificationStep + 1) * 25}%`,
                          }}
                        />
                      </div>
                      
                      {/* Terminal-like output */}
                      <div className="bg-black/80 rounded-lg p-3 border border-white/5 font-mono text-[10px] space-y-1 text-left min-h-[90px]">
                        <div className="text-cyan-500 flex items-center gap-1.5">
                          <span className="animate-ping h-1.5 w-1.5 rounded-full bg-cyan-400 inline-block" />
                          <span>Establishing Federation Uplink...</span>
                        </div>
                        
                        {verificationStep >= 0 && (
                          <div className="text-gray-400">
                            &gt; Verification signature: {nodeId} matching...
                          </div>
                        )}
                        
                        {verificationStep >= 1 && (
                          <div className="text-gray-300">
                            &gt; Decentralized token authorized. Handshake signed.
                          </div>
                        )}

                        {verificationStep >= 2 && (
                          <div className="text-emerald-400 flex items-center gap-1">
                            <span>[OK] Secure VPN tunnel established (TLS 1.3)</span>
                          </div>
                        )}

                        {verificationStep >= 3 && (
                          <div className="text-cyan-400 font-bold uppercase animate-pulse">
                            &gt;&gt; ACCESS GRANTED: Redirecting...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-semibold text-white animate-pulse">
                        {verificationStep === 0 && "Verifying Hospital Node..."}
                        {verificationStep === 1 && "Secure Token Matched"}
                        {verificationStep === 2 && "Encrypted Channel Established"}
                        {verificationStep === 3 && "Federated Access Granted"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Do not close the page during handshake
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : selectedRole === "admin" ? (
              <div className="space-y-5">
                {/* Header Subtitle */}
                <div className="text-center mb-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                    <Shield className="h-3 w-3 animate-pulse" />
                    Federation Command Access
                  </div>
                  <h3 className="text-lg font-medium text-white">Central Federation Command Access</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Central authority, secure oversight & network orchestration
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-400 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 animate-bounce" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Form fields if not currently verifying */}
                {!isAdminVerifying ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Central Admin ID */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                        Central Admin ID
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 h-5 w-5 text-purple-500/70" />
                        <Input
                          type="text"
                          placeholder="e.g. CTRL-ADMIN-01"
                          value={adminId}
                          onChange={(e) => setAdminId(e.target.value)}
                          className="h-12 rounded-xl border border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-600 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Master Federation Key */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                        Master Federation Key
                      </label>
                      <div className="relative">
                        <Key className="absolute left-4 top-3.5 h-5 w-5 text-purple-500/70" />
                        <Input
                          type="text"
                          placeholder="e.g. FED-MASTER-X992"
                          value={masterKey}
                          onChange={(e) => setMasterKey(e.target.value)}
                          className="h-12 rounded-xl border border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-600 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Passphrase */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                        Secure Control Passphrase
                      </label>
                      <div className="relative">
                        <LockKeyhole className="absolute left-4 top-3.5 h-5 w-5 text-purple-500/70" />
                        <Input
                          type="password"
                          placeholder="••••••••••••••••"
                          value={adminPassphrase}
                          onChange={(e) => setAdminPassphrase(e.target.value)}
                          className="h-12 rounded-xl border border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-600 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Initialize Control Access Button */}
                    <Button
                      type="submit"
                      className="shine-button h-12 w-full rounded-xl text-base font-bold text-black cursor-pointer animate-pulse"
                      style={{
                        background: "linear-gradient(90deg, #a855f7 0%, #3b82f6 100%)",
                      }}
                    >
                      Initialize Control Access
                    </Button>

                    {/* Auto-fill buttons */}
                    <div className="pt-3 border-t border-white/5">
                      <div className="text-center mb-2">
                        <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                          Authorized Command Credentials
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={autofillDemoAdmin}
                          className="text-[10px] w-full py-2 px-3 rounded-lg border border-purple-500/20 bg-purple-500/5 text-purple-400 hover:bg-purple-500/15 hover:border-purple-500/40 transition text-center cursor-pointer font-medium font-mono"
                        >
                          Load Master Admin Credentials
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* VERIFYING SIMULATION */
                  <div className="space-y-6 py-6 flex flex-col items-center">
                    {/* Visual scan indicator */}
                    <div className="relative w-32 h-32 rounded-full border-2 border-purple-500/30 flex items-center justify-center bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)] overflow-hidden">
                      {/* Scanning sweep */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/15 to-transparent animate-pulse" />
                      
                      {/* Rotating Concentric SVG Neural Rings */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        {/* Outer neural ring */}
                        <circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="1.5"
                          strokeDasharray="4 8 16 8"
                          className="animate-[spin_12s_linear_infinite]"
                          style={{ transformOrigin: "center" }}
                        />
                        {/* Middle ring with dots */}
                        <circle
                          cx="50" cy="50" r="32"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="1"
                          strokeDasharray="2 4"
                          className="animate-[spin_8s_linear_infinite_reverse]"
                          style={{ transformOrigin: "center" }}
                        />
                        {/* Inner status ring */}
                        <circle
                          cx="50" cy="50" r="22"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="1.5"
                          strokeDasharray="20 10"
                          className="animate-[spin_4s_linear_infinite]"
                          style={{ transformOrigin: "center" }}
                        />
                        {/* Connection lines */}
                        <line x1="50" y1="8" x2="50" y2="92" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.3" className="animate-pulse" />
                        <line x1="8" y1="50" x2="92" y2="50" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.3" className="animate-pulse" />
                      </svg>
                      
                      {/* Center icon based on step */}
                      {adminVerificationStep < 3 ? (
                        <Shield className="h-10 w-10 text-purple-400 animate-pulse relative z-10" />
                      ) : (
                        <Activity className="h-10 w-10 text-emerald-400 animate-pulse relative z-10" />
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full space-y-2">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-500 rounded-full"
                          style={{
                            width: `${(adminVerificationStep + 1) * 20}%`,
                          }}
                        />
                      </div>
                      
                      {/* Telemetry Console */}
                      <div className="bg-black/80 rounded-lg p-3 border border-white/5 font-mono text-[10px] space-y-1 text-left min-h-[110px] overflow-hidden">
                        <div className="text-purple-400 flex items-center gap-1.5">
                          <span className="animate-ping h-1.5 w-1.5 rounded-full bg-purple-400 inline-block" />
                          <span>Initializing Command Uplink...</span>
                        </div>
                        
                        {adminVerificationStep >= 0 && (
                          <div className="text-gray-400">
                            &gt; Central Authority ID: {adminId} verifying...
                          </div>
                        )}
                        
                        {adminVerificationStep >= 1 && (
                          <div className="text-gray-300">
                            &gt; Master Key signature valid. Decrypting control keys...
                          </div>
                        )}

                        {adminVerificationStep >= 2 && (
                          <div className="text-cyan-400">
                            &gt; Secure AI Aggregator active at central node.
                          </div>
                        )}

                        {adminVerificationStep >= 3 && (
                          <div className="text-purple-400">
                            &gt; Global Control Channel established. Broadcasting topology...
                          </div>
                        )}

                        {adminVerificationStep >= 4 && (
                          <div className="text-emerald-400 font-bold uppercase animate-pulse">
                            &gt;&gt; BROADCAST COMPLETE. CONTROL PORTAL ACTIVE.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-semibold text-white animate-pulse">
                        {adminVerificationStep === 0 && "Verifying Central Authority..."}
                        {adminVerificationStep === 1 && "Federation Access Confirmed"}
                        {adminVerificationStep === 2 && "Secure AI Aggregator Connected"}
                        {adminVerificationStep === 3 && "Global Control Channel Established"}
                        {adminVerificationStep === 4 && "Federated System Initialized"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Do not interrupt orchestration sequence
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : selectedRole === "doctor" ? (
              <div className="space-y-5">
                {/* Header Subtitle with Electrocardiogram Heartbeat ECG illustration */}
                <div className="text-center mb-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
                    <Stethoscope className="h-3 w-3" />
                    Medical Professional Access
                  </div>
                  
                  {/* Heartbeat ECG Line Drawing */}
                  <svg className="w-full h-8 text-teal-400/40 my-2" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M0,10 L30,10 L33,7 L37,13 L41,10 L48,10 L51,3 L55,17 L59,10 L63,10 L100,10" />
                  </svg>

                  <h3 className="text-lg font-medium text-white">Practitioner Access Portal</h3>
                  <p className="text-xs text-gray-400 mt-1 font-sans">
                    Secure clinical authentication & hospital database link
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl border border-red-500/25 bg-red-500/10 text-xs text-red-400 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Medical License ID */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                      Medical License ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-teal-500/60" />
                      <Input
                        type="text"
                        placeholder="e.g. DOC-KAR-8821"
                        value={licenseId}
                        onChange={(e) => setLicenseId(e.target.value)}
                        className="h-12 rounded-xl border border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-600 focus-visible:ring-teal-500 focus-visible:border-teal-500 transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Hospital Affiliation Code */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                      Hospital Affiliation Code
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-teal-500/60" />
                      <Input
                        type="text"
                        placeholder="e.g. APL-HOSP-2045"
                        value={hospitalCode}
                        onChange={(e) => setHospitalCode(e.target.value)}
                        className="h-12 rounded-xl border border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-600 focus-visible:ring-teal-500 focus-visible:border-teal-500 transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-teal-500/60" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={doctorPassword}
                        onChange={(e) => setDoctorPassword(e.target.value)}
                        className="h-12 rounded-xl border border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-600 focus-visible:ring-teal-500 focus-visible:border-teal-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Access Button */}
                  <Button
                    type="submit"
                    className="shine-button h-12 w-full rounded-xl text-base font-bold text-black cursor-pointer"
                    style={{
                      background: "linear-gradient(90deg, #0d9488 0%, #0284c7 100%)",
                    }}
                  >
                    Access Dashboard
                  </Button>

                  {/* Auto-fill Selector */}
                  <div className="pt-3 border-t border-white/5">
                    <div className="text-center mb-2">
                      <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                        Authorized Practitioner Accounts
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => autofillDemoDoctor("rajesh")}
                        className="text-[10px] py-1.5 px-2 rounded-lg border border-teal-500/20 bg-teal-500/5 text-teal-400 hover:bg-teal-500/15 hover:border-teal-500/40 transition text-center cursor-pointer font-medium"
                      >
                        Dr. Rajesh Kumar
                      </button>
                      <button
                        type="button"
                        onClick={() => autofillDemoDoctor("priya")}
                        className="text-[10px] py-1.5 px-2 rounded-lg border border-teal-500/20 bg-teal-500/5 text-teal-400 hover:bg-teal-500/15 hover:border-teal-500/40 transition text-center cursor-pointer font-medium"
                      >
                        Dr. Priya Sharma
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
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
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-white cursor-pointer"
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
                      className="text-sm text-gray-400 hover:text-white cursor-pointer"
                    >
                      Forgot password?
                    </button>

                  </div>
                )}

                {/* BUTTON */}
                <Button
                  type="submit"
                  className="shine-button h-12 w-full rounded-xl text-base font-bold text-black cursor-pointer"
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
            )}

            {/* FOOTER */}
            {selectedRole !== "hospital" && selectedRole !== "admin" && selectedRole !== "doctor" && (
              <p className="mt-6 text-center text-sm text-gray-400">

                {activeTab === "login" ? (
                  <>
                    Don’t have an account?{" "}

                    <button
                      onClick={() => setActiveTab("signup")}
                      className="font-medium text-orange-400 hover:underline cursor-pointer"
                    >
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}

                    <button
                      onClick={() => setActiveTab("login")}
                      className="font-medium text-pink-400 hover:underline cursor-pointer"
                    >
                      Login
                    </button>
                  </>
                )}

              </p>
            )}

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

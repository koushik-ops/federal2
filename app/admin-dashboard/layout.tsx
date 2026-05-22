"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Shield, 
  User, 
  LogOut,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Activity,
  Server,
  Network
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { useUser } from "@/lib/user-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useUser()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const themeInitialized = useRef(false)

  useEffect(() => {
    setMounted(true)
    if (!themeInitialized.current) {
      setTheme("dark")
      themeInitialized.current = true
    }
  }, [setTheme])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const adminNotifications = [
    { id: "a1", title: "New Node Connected", desc: "Apollo Health Hub established handshake.", time: "4m ago", read: false },
    { id: "a2", title: "Aggregation Complete", desc: "Round 6 calculations resolved successfully.", time: "2h ago", read: false },
    { id: "a3", title: "Low Accuracy Warning", desc: "Node PULSE-NODE-STJUDE reports local drift > 0.05.", time: "1d ago", read: true }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2.5">
            <Link href="/admin-dashboard" className="flex items-center gap-2">
              <div className="relative h-9 w-9 flex-shrink-0">
                <svg viewBox="0 0 48 48" className="h-full w-full">
                  <defs>
                    <linearGradient id="adminPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M24 4 L24 18 L18 24 L24 24 L24 44 M8 24 L18 24 M24 24 L40 24"
                    stroke="url(#adminPulseGrad)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                  <circle cx="24" cy="24" r="20" stroke="url(#adminPulseGrad)" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-lg font-bold italic text-foreground">PulseKin</span>
                <span className="rounded-md bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-500 dark:text-purple-400">
                  Federated Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )}
              </button>
            )}

            {/* Notifications */}
            <div ref={notificationsRef} className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-purple-500 text-[8px] font-bold text-white ring-2 ring-background">
                  2
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="border-b border-border px-4 py-3 bg-muted/30">
                    <span className="text-sm font-semibold">Admin Alerts</span>
                  </div>
                  <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
                    {adminNotifications.map(n => (
                      <div key={n.id} className="p-4 hover:bg-muted/40 cursor-pointer">
                        <div className="flex justify-between items-start gap-1">
                          <p className={`text-xs font-semibold ${!n.read ? "text-purple-500" : "text-muted-foreground"}`}>{n.title}</p>
                          <span className="text-[10px] text-muted-foreground">{n.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-accent"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold text-white shadow-sm">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="hidden max-w-[120px] truncate text-sm text-muted-foreground md:block">
                  {user?.name || "Aggregator Admin"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{user?.name || "PulseKin Admin"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "admin@pulsekin.ai"}</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { logout(); router.push("/") }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

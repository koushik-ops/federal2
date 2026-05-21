"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Home, 
  Users, 
  FileText, 
  Video, 
  Building2, 
  User, 
  LogOut,
  Menu,
  X,
  Bell,
  Stethoscope,
  ChevronDown,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Trash2
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { useUser } from "@/lib/user-context"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'alert'
}

const navItems = [
  { href: "/doctor-dashboard", label: "Dashboard", icon: Home },
  { href: "/doctor-dashboard/cases", label: "Cases", icon: Users },
  { href: "/doctor-dashboard/reports", label: "Reports", icon: FileText },
  { href: "/doctor-dashboard/consultations", label: "Consults", icon: Video },
  { href: "/doctor-dashboard/federated", label: "Insights", icon: Building2 },
]

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Lab Results Ready",
      description: "Emily Watson's full blood panel has been processed by AI analytics.",
      time: "10m ago",
      read: false,
      type: "success"
    },
    {
      id: "2",
      title: "Critical Level Alert",
      description: "Marcus Vance: Potassium level is critical (3.1 mmol/L).",
      time: "1h ago",
      read: false,
      type: "alert"
    },
    {
      id: "3",
      title: "Consultation Scheduled",
      description: "Video consult scheduled with Sarah Jenkins for today at 3:30 PM.",
      time: "3h ago",
      read: true,
      type: "info"
    },
    {
      id: "4",
      title: "Case Shared",
      description: "Dr. Alexander shared case notes on Patient #1024.",
      time: "1d ago",
      read: true,
      type: "info"
    }
  ])
  const { user, logout } = useUser()
  const router = useRouter()
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Simulate new notification after 10 seconds of mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => {
        if (prev.some(n => n.id === "simulated")) return prev
        
        
        return [
          {
            id: "simulated",
            title: "Urgent Case Alert",
            description: "Patient Marcus Vance reported chest tightness. Click to review logs.",
            time: "Just now",
            read: false,
            type: "alert"
          },
          ...prev
        ]
      })
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 lg:px-6">

          {/* Logo */}
          <Link href="/doctor-dashboard" className="flex shrink-0 items-center gap-2.5">
            <div className="relative h-9 w-9 flex-shrink-0">
              <svg viewBox="0 0 48 48" className="h-full w-full">
                <defs>
                  <linearGradient id="headerPulseGradDoc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path
                  d="M24 4 L24 18 L18 24 L24 24 L24 44 M8 24 L18 24 M24 24 L40 24"
                  stroke="url(#headerPulseGradDoc)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="hidden items-baseline gap-1.5 sm:flex">
              <span className="font-serif text-lg font-bold italic text-foreground">PulseKin</span>
              <span className="rounded-md bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-500 dark:text-purple-400">
                Doctor
              </span>
            </div>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-0.5 rounded-2xl border border-border bg-muted/50 p-1 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/doctor-dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-purple-500/15 text-purple-600 shadow-sm dark:bg-purple-500/20 dark:text-purple-300"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Theme toggle */}
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
                aria-label="View notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[9px] font-bold text-white ring-2 ring-background">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 overflow-hidden rounded-2xl border border-border bg-popover/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/50 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-medium text-purple-600 dark:text-purple-400 hover:underline transition-all"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-[350px] overflow-y-auto divide-y divide-border">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <div className="mb-3 rounded-full bg-muted p-3 text-muted-foreground">
                          <Bell className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium text-foreground">All caught up!</p>
                        <p className="text-xs text-muted-foreground mt-1">No new notifications at the moment.</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        let Icon = Bell
                        let iconColor = "text-blue-500 bg-blue-500/10"
                        if (n.type === 'success') {
                          Icon = CheckCircle2
                          iconColor = "text-emerald-500 bg-emerald-500/10"
                        } else if (n.type === 'warning') {
                          Icon = AlertCircle
                          iconColor = "text-amber-500 bg-amber-500/10"
                        } else if (n.type === 'alert') {
                          Icon = AlertCircle
                          iconColor = "text-rose-500 bg-rose-500/10"
                        }

                        return (
                          <div 
                            key={n.id} 
                            onClick={() => markAsRead(n.id)}
                            className={`group relative flex gap-3 p-4 text-left transition-colors hover:bg-muted/50 cursor-pointer ${
                              !n.read ? "bg-purple-500/[0.02] dark:bg-purple-500/[0.03]" : ""
                            }`}
                          >
                            {/* Unread dot */}
                            {!n.read && (
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-purple-500" />
                            )}
                            
                            {/* Icon */}
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
                              <Icon className="h-4 w-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-start justify-between gap-1">
                                <p className={`text-xs font-semibold truncate ${!n.read ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                                  {n.title}
                                </p>
                                <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                                {n.description}
                              </p>
                            </div>

                            {/* Dismiss Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                clearNotification(n.id)
                              }}
                              className="absolute right-2 top-3.5 rounded-lg p-1 text-muted-foreground opacity-0 hover:bg-accent hover:text-foreground group-hover:opacity-100 transition-opacity"
                              aria-label="Clear notification"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-accent"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-xs font-bold text-white shadow-sm">
                  {(user?.name || "D").charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[120px] truncate text-sm text-muted-foreground md:block">
                  {user?.name || "Doctor"}
                </span>
                <ChevronDown className={`hidden h-3.5 w-3.5 text-muted-foreground transition-transform md:block ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl shadow-black/10 dark:shadow-black/50">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{user?.name || "Doctor"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "doctor@pulsekin.com"}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/doctor-dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                    <button
                      onClick={() => { logout(); router.push("/") }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
            <nav className="mx-auto max-w-7xl space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/doctor-dashboard" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/doctor-dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); router.push("/") }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

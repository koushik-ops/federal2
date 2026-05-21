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
  Moon
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { useUser } from "@/lib/user-context"

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
  const { user, logout } = useUser()
  const router = useRouter()
  const profileRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 lg:px-6">

          {/* Logo */}
          <Link href="/doctor-dashboard" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
              <Stethoscope className="h-[18px] w-[18px] text-white" />
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
            <button className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-purple-500" />
            </button>

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
                      onClick={() => { logout(); router.push("/login") }}
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
                onClick={() => { logout(); setMobileMenuOpen(false); router.push("/login") }}
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

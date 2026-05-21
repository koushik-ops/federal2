"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  FileText, 
  MessageSquare, 
  MapPin, 
  Pill, 
  User, 
  LogOut,
  Menu,
  X,
  Bell
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"

const navItems = [
  { href: "/patient-dashboard", label: "Home", icon: Home },
  { href: "/patient-dashboard/reports", label: "Reports", icon: FileText },
  { href: "/patient-dashboard/chat", label: "AI Doctor", icon: MessageSquare },
  { href: "/patient-dashboard/doctors", label: "Nearby Doctors", icon: MapPin },
  { href: "/patient-dashboard/prescriptions", label: "Prescriptions", icon: Pill },
  { href: "/patient-dashboard/profile", label: "Profile", icon: User },
]

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout } = useUser()

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/patient-dashboard" className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <svg viewBox="0 0 48 48" className="h-full w-full">
                <defs>
                  <linearGradient id="headerPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path
                  d="M24 4 L24 18 L18 24 L24 24 L24 44 M8 24 L18 24 M24 24 L40 24"
                  stroke="url(#headerPulseGrad)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="24" cy="24" r="20" stroke="url(#headerPulseGrad)" strokeWidth="2" fill="none" opacity="0.3" />
              </svg>
            </div>
            <span className="font-serif text-xl font-bold italic text-white">PulseKin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/patient-dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-pink-500/20 text-pink-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <button className="relative rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-500" />
            </button>
            <Link href="/login" onClick={() => logout()}>
              <Button variant="ghost" size="sm" className="hidden text-gray-400 hover:text-white md:flex">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
            <button
              className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden">
            <nav className="mx-auto max-w-7xl space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/patient-dashboard" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-pink-500/20 text-pink-400"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/login"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/patient-dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all ${
                  isActive ? "text-pink-400" : "text-gray-500"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

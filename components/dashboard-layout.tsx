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
  Bell,
  Search,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/chat", label: "Chat Doctor AI", icon: MessageSquare },
  { href: "/dashboard/doctors", label: "Doctors Nearby", icon: MapPin },
  { href: "/dashboard/prescriptions", label: "Prescriptions", icon: Pill },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="font-serif text-xl font-bold italic">
                <span className="gradient-pink-purple">YOU.</span>{" "}
                <span className="gradient-orange-yellow">MATTER.</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold flex items-center justify-center text-white">
                3
              </span>
            </Button>
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden glass border-t border-border/50 z-50">
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

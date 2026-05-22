"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "patient" | "doctor" | "admin" | "hospital"

interface UserInfo {
  name: string
  email: string
  role: UserRole
}

interface UserContextType {
  user: UserInfo | null
  login: (user: UserInfo) => void
  logout: () => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulsekin_user")
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const login = (userInfo: UserInfo) => {
    setUser(userInfo)
    localStorage.setItem("pulsekin_user", JSON.stringify(userInfo))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pulsekin_user")
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type AuthState, authService } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: "student" | "staff") => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for existing user on mount
    const user = authService.getCurrentUser()
    setState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    })
  }, [])

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.login(email, password)
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const register = async (email: string, password: string, name: string, role: "student" | "staff") => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.register(email, password, name, role)
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    await authService.logout()
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return <AuthContext.Provider value={{ ...state, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

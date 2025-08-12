"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface NavigationGuardProps {
  children: React.ReactNode
}

export function NavigationGuard({ children }: NavigationGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Define role-based route access
      const roleRoutes = {
        student: ["/student", "/student/history", "/student/settings", "/student/courses"],
        staff: ["/staff", "/staff/courses", "/staff/history"],
        admin: ["/staff", "/staff/courses", "/staff/history", "/staff/timetable"],
      }

      const allowedRoutes = roleRoutes[user.role] || []
      const isPublicRoute = ["/", "/login", "/register"].includes(pathname)

      // If user is on a public route, redirect to their dashboard
      if (isPublicRoute) {
        const dashboardPath = user.role === "student" ? "/student" : "/staff"
        router.push(dashboardPath)
        return
      }

      // Check if current route is allowed for user's role
      const isAllowedRoute = allowedRoutes.some((route) => pathname.startsWith(route))

      if (!isAllowedRoute) {
        // Redirect to appropriate dashboard if accessing unauthorized route
        const dashboardPath = user.role === "student" ? "/student" : "/staff"
        router.push(dashboardPath)
      }
    }
  }, [user, isAuthenticated, isLoading, pathname, router])

  return <>{children}</>
}

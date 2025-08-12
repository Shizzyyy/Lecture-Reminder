"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Bell, BookOpen, History, LogOut, User, Upload, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
// Added notification center to staff header
import { NotificationCenter } from "@/components/notifications/notification-center"

interface StaffLayoutProps {
  children: React.ReactNode
}

export function StaffLayout({ children }: StaffLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/staff", icon: BookOpen, current: pathname === "/staff" },
    { name: "My Courses", href: "/staff/courses", icon: Settings, current: pathname === "/staff/courses" },
    { name: "Reminder History", href: "/staff/history", icon: History, current: pathname === "/staff/history" },
  ]

  // Add admin-only navigation
  if (user?.role === "admin") {
    navigation.splice(2, 0, {
      name: "Timetable Upload",
      href: "/staff/timetable",
      icon: Upload,
      current: pathname === "/staff/timetable",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-primary rounded-full p-2 mr-3">
                <Bell className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Lecture Reminder - {user?.role === "admin" ? "Admin" : "Staff"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Added notification center */}
              <NotificationCenter />
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-2" />
                {user?.name}
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={item.current ? "default" : "ghost"}
                    className={`flex items-center ${item.current ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}

"use client"

import React from "react"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function Breadcrumb() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const pathSegments = pathname.split("/").filter(Boolean)
  const isStudentPath = pathSegments[0] === "student"
  const isStaffPath = pathSegments[0] === "staff"

  if (!isStudentPath && !isStaffPath) return null

  const breadcrumbItems = [
    {
      label: "Dashboard",
      href: isStudentPath ? "/student" : "/staff",
      isActive: pathSegments.length === 1,
    },
  ]

  // Add specific page breadcrumbs
  if (pathSegments.length > 1) {
    const page = pathSegments[1]
    const pageLabels: Record<string, string> = {
      history: "Reminder History",
      courses: "My Courses",
      timetable: "Timetable Upload",
    }

    breadcrumbItems.push({
      label: pageLabels[page] || page,
      href: pathname,
      isActive: true,
    })
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.isActive ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { StaffLayout } from "@/components/staff/staff-layout"
import { StaffOverview } from "@/components/staff/staff-overview"
import { UpcomingClasses } from "@/components/staff/upcoming-classes"
import { SystemAlerts } from "@/components/student/system-alerts"

export default function StaffDashboard() {
  return (
    <ProtectedRoute allowedRoles={["staff", "admin"]}>
      <StaffLayout>
        <div className="space-y-8">
          {/* Overview Stats */}
          <StaffOverview />

          {/* Dashboard Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            <UpcomingClasses />
            <SystemAlerts />
          </div>
        </div>
      </StaffLayout>
    </ProtectedRoute>
  )
}

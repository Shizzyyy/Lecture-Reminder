"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { StudentLayout } from "@/components/student/student-layout"
import { UpcomingLectures } from "@/components/student/upcoming-lectures"
import { SystemAlerts } from "@/components/student/system-alerts"
import { LectureSchedule } from "@/components/student/lecture-schedule"

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <div className="space-y-8">
          {/* Dashboard Overview */}
          <div className="grid lg:grid-cols-2 gap-8">
            <UpcomingLectures />
            <SystemAlerts />
          </div>

          {/* Lecture Schedule Management */}
          <LectureSchedule />
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}

"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { StaffLayout } from "@/components/staff/staff-layout"
import { CourseManagement } from "@/components/staff/course-management"

export default function CoursesPage() {
  return (
    <ProtectedRoute allowedRoles={["staff", "admin"]}>
      <StaffLayout>
        <CourseManagement />
      </StaffLayout>
    </ProtectedRoute>
  )
}

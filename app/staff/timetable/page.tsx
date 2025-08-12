"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { StaffLayout } from "@/components/staff/staff-layout"
import { TimetableUpload } from "@/components/staff/timetable-upload"

export default function TimetablePage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <StaffLayout>
        <TimetableUpload />
      </StaffLayout>
    </ProtectedRoute>
  )
}

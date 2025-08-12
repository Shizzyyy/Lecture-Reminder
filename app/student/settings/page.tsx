"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { StudentLayout } from "@/components/student/student-layout"
import { ReminderSettings } from "@/components/notifications/reminder-settings"
import { PushNotificationSetup } from "@/components/notifications/push-notification-setup"

export default function StudentSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h1>
            <p className="text-muted-foreground">Configure how and when you want to receive lecture reminders.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <ReminderSettings />
            <PushNotificationSetup />
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  )
}

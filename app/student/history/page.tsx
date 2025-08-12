"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { StudentLayout } from "@/components/student/student-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Mail, Smartphone, CheckCircle, Clock, XCircle } from "lucide-react"
import { mockReminders } from "@/lib/mock-data"
import { formatDistanceToNow, parseISO } from "date-fns"
import { useEffect, useState } from "react"
import type { Reminder } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"

export default function ReminderHistoryPage() {
  const { user } = useAuth()
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders)

  useEffect(() => {
    const load = async () => {
      if (!user) return setReminders(mockReminders)
      const res = await apiClient.getReminders(user.id)
      if (res.success && res.data) setReminders(res.data.length ? res.data : mockReminders)
    }
    load()
  }, [user?.id])
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "sent":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "sent":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "email" ? (
      <Mail className="h-4 w-4 text-blue-500" />
    ) : (
      <Smartphone className="h-4 w-4 text-green-500" />
    )
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2 text-purple-600" />
              Reminder History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reminders sent yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(reminder.type)}
                        {getStatusIcon(reminder.status)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{reminder.lectureName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Sent {formatDistanceToNow(parseISO(reminder.sentAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {reminder.type}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(reminder.status)} className="text-xs">
                        {reminder.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </StudentLayout>
    </ProtectedRoute>
  )
}

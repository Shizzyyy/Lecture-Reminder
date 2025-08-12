"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { StaffLayout } from "@/components/staff/staff-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Mail, Smartphone, CheckCircle, Clock, XCircle } from "lucide-react"
import { mockStaffReminders } from "@/lib/mock-data"
import { formatDistanceToNow, parseISO } from "date-fns"

export default function StaffReminderHistoryPage() {
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

  // Group reminders by status for better overview
  const reminderStats = {
    delivered: mockStaffReminders.filter((r) => r.status === "delivered").length,
    sent: mockStaffReminders.filter((r) => r.status === "sent").length,
    failed: mockStaffReminders.filter((r) => r.status === "failed").length,
  }

  return (
    <ProtectedRoute allowedRoles={["staff", "admin"]}>
      <StaffLayout>
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="text-2xl font-bold text-green-600">{reminderStats.delivered}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{reminderStats.sent}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{reminderStats.failed}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reminder History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2 text-purple-600" />
                System Reminder History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockStaffReminders.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reminders sent yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockStaffReminders.map((reminder) => (
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
        </div>
      </StaffLayout>
    </ProtectedRoute>
  )
}

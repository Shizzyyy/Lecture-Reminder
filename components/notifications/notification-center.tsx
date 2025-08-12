"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, X, AlertCircle, Info, Clock } from "lucide-react"
import { mockNotifications } from "@/lib/mock-data"
import { formatDistanceToNow, parseISO } from "date-fns"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"

export function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const res = await apiClient.getReminders(user.id)
      if (res.success && res.data) {
        // Map reminders into notification-like objects
        const mapped = res.data.map((r: any) => ({
          id: r.id,
          title: r.type === "email" ? "Email Reminder" : "Lecture Reminder",
          message: r.lectureName,
          type: "reminder",
          priority: r.status === "failed" ? "high" : r.status === "sent" ? "medium" : "low",
          timestamp: r.sentAt,
          read: false,
        }))
        setNotifications(mapped.length ? mapped : mockNotifications)
      }
    }
    load()
  }, [user?.id])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: string, priority: string) => {
    if (type === "reminder") return <Clock className="h-4 w-4 text-blue-500" />
    if (type === "alert") return <AlertCircle className="h-4 w-4 text-orange-500" />
    return <Info className="h-4 w-4 text-gray-500" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      default:
        return "border-l-blue-500"
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-l-2 hover:bg-muted/50 cursor-pointer ${getPriorityColor(
                        notification.priority,
                      )} ${!notification.read ? "bg-blue-50" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2 flex-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(parseISO(notification.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

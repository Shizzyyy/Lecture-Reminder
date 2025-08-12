"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Smartphone, CheckCircle, AlertCircle, Bell } from "lucide-react"

export function PushNotificationSetup() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported("Notification" in window)
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return

    setIsRequesting(true)
    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === "granted") {
        // Show a test notification
        new Notification("Lecture Reminder", {
          body: "Push notifications are now enabled!",
          icon: "/favicon.ico",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
    } finally {
      setIsRequesting(false)
    }
  }

  const getStatusBadge = () => {
    switch (permission) {
      case "granted":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Enabled
          </Badge>
        )
      case "denied":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Blocked
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Bell className="h-3 w-3 mr-1" />
            Not Set
          </Badge>
        )
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-gray-500" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Push notifications are not supported in this browser.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
            Push Notifications
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enable push notifications to receive lecture reminders even when the app is closed.
        </p>

        {permission === "default" && (
          <div className="space-y-3">
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                Click the button below to enable push notifications. Your browser will ask for permission.
              </AlertDescription>
            </Alert>
            <Button onClick={requestPermission} disabled={isRequesting} className="w-full">
              {isRequesting ? "Requesting Permission..." : "Enable Push Notifications"}
            </Button>
          </div>
        )}

        {permission === "granted" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Push notifications are enabled! You'll receive lecture reminders based on your settings.
            </AlertDescription>
          </Alert>
        )}

        {permission === "denied" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Push notifications are blocked. To enable them, click the lock icon in your browser's address bar and
              allow notifications, then refresh the page.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

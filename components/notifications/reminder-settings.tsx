"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Settings, Mail, Smartphone, Clock, Moon } from "lucide-react"
import { mockReminderPreferences } from "@/lib/mock-data"
import type { ReminderPreferences } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"

export function ReminderSettings() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<ReminderPreferences>(mockReminderPreferences)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const res = await apiClient.getReminderPreferences(user.id)
      if (res.success && res.data) setPreferences(res.data)
    }
    load()
  }, [user?.id])

  const handleSave = async () => {
    setIsSaving(true)
    if (user) {
      await apiClient.saveReminderPreferences(user.id, preferences)
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    setIsSaving(false)
    // In real app, this would save to backend
  }

  const updatePreference = (key: keyof ReminderPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const updateQuietHours = (key: "enabled" | "start" | "end", value: any) => {
    setPreferences((prev) => ({
      ...prev,
      quietHours: { ...prev.quietHours, [key]: value },
    }))
  }

  const reminderTimingOptions = [
    { value: 5, label: "5 minutes before" },
    { value: 10, label: "10 minutes before" },
    { value: 15, label: "15 minutes before" },
    { value: 30, label: "30 minutes before" },
    { value: 60, label: "1 hour before" },
    { value: 120, label: "2 hours before" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          Reminder Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Methods */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Notification Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.emailEnabled}
                onCheckedChange={(checked) => updatePreference("emailEnabled", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-green-500" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
              <Switch
                id="push-notifications"
                checked={preferences.pushEnabled}
                onCheckedChange={(checked) => updatePreference("pushEnabled", checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Reminder Timing */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Reminder Timing</h3>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <Label htmlFor="reminder-timing">Send reminders</Label>
            <Select
              value={preferences.reminderTiming.toString()}
              onValueChange={(value) => updatePreference("reminderTiming", Number.parseInt(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reminderTimingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Quiet Hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-medium text-gray-900">Quiet Hours</h3>
            </div>
            <Switch
              checked={preferences.quietHours.enabled}
              onCheckedChange={(checked) => updateQuietHours("enabled", checked)}
            />
          </div>
          {preferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6">
              <div className="space-y-2">
                <Label htmlFor="quiet-start">Start Time</Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={preferences.quietHours.start}
                  onChange={(e) => updateQuietHours("start", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-end">End Time</Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={preferences.quietHours.end}
                  onChange={(e) => updateQuietHours("end", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Weekend Reminders */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="weekend-reminders">Weekend Reminders</Label>
            <p className="text-xs text-muted-foreground">Receive reminders for weekend lectures</p>
          </div>
          <Switch
            id="weekend-reminders"
            checked={preferences.weekendReminders}
            onCheckedChange={(checked) => updatePreference("weekendReminders", checked)}
          />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

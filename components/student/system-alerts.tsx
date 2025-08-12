"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { mockAlerts } from "@/lib/mock-data"
import { formatDistanceToNow, parseISO } from "date-fns"

export function SystemAlerts() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "success":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
            System Alerts
          </div>
          <Button variant="ghost" size="sm">
            Mark all as read
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mockAlerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No alerts at this time</p>
        ) : (
          <div className="space-y-3">
            {mockAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${
                  !alert.read ? "bg-blue-50 border-blue-200" : "bg-muted/30"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getAlertBadgeVariant(alert.type)} className="text-xs">
                        {alert.type}
                      </Badge>
                      {!alert.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(parseISO(alert.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

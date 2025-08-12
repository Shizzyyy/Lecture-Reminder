"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User } from "lucide-react"
import { mockLectures } from "@/lib/mock-data"
import { isToday, parseISO } from "date-fns"
import { useEffect, useState } from "react"
import type { Lecture } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"

export function UpcomingLectures() {
  const { user } = useAuth()
  const [lectures, setLectures] = useState<Lecture[]>(mockLectures)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const res = await apiClient.fetchUserLectures(user.id)
      if (res.success && res.data) {
        setLectures(res.data.length ? res.data : mockLectures)
      }
    }
    load()
  }, [user?.id])

  const todayLectures = lectures.filter((lecture) => isToday(parseISO(lecture.date)))
  const showFallback = todayLectures.length === 0
  const nextFew = showFallback
    ? [...lectures]
        .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
        .slice(0, 3)
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Today's Lectures
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showFallback ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="text-center py-2">No lectures scheduled for today</p>
            {nextFew.length > 0 && (
              <div>
                <p className="text-center mb-2">Upcoming:</p>
                <div className="space-y-2">
                  {nextFew.map((lecture) => (
                    <div key={lecture.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{lecture.courseName}</span>
                          {lecture.isFromDepartmental && (
                            <Badge variant="secondary" className="text-xs">Departmental</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-xs">
                          <Clock className="h-3 w-3 mr-1" /> {lecture.date} {lecture.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {todayLectures.map((lecture) => (
              <div
                key={lecture.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{lecture.courseName}</h3>
                    {lecture.isFromDepartmental && (
                      <Badge variant="secondary" className="text-xs">
                        Departmental
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {lecture.time}
                    </div>
                    {lecture.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {lecture.location}
                      </div>
                    )}
                    {lecture.instructor && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {lecture.instructor}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users } from "lucide-react"
import { mockCourses } from "@/lib/mock-data"

export function UpcomingClasses() {
  // Get today's day name
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })

  // Find today's classes
  const todayClasses = mockCourses.flatMap((course) =>
    course.schedule
      .filter((schedule) => schedule.day === today)
      .map((schedule) => ({
        ...schedule,
        courseName: course.name,
        courseCode: course.code,
        students: course.students,
      })),
  )

  // Sort by time
  todayClasses.sort((a, b) => a.time.localeCompare(b.time))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Today's Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todayClasses.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No classes scheduled for today</p>
        ) : (
          <div className="space-y-4">
            {todayClasses.map((classItem, index) => (
              <div key={index} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{classItem.courseName}</h3>
                    <Badge variant="outline" className="text-xs">
                      {classItem.courseCode}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {classItem.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {classItem.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {classItem.students} students
                    </div>
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

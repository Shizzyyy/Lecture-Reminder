"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { StudentLayout } from "@/components/student/student-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import type { Course } from "@/lib/types"
import { apiClient } from "@/lib/api-client"

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await apiClient.getCourses()
      if (res.success && res.data) setCourses(res.data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-green-600" />
              Department Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : courses.length === 0 ? (
              <p className="text-muted-foreground">No courses available</p>
            ) : (
              <div className="grid gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-6 hover:bg-muted/50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                          <Badge variant="outline">{course.code}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <span>{course.department}</span>
                          <span>{course.credits} credits</span>
                          <span>Instructor: {course.instructor}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {course.schedule.length} classes/week
                          </div>
                        </div>
                      </div>
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



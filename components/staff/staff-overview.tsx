"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Calendar, TrendingUp } from "lucide-react"
import { mockCourses } from "@/lib/mock-data"

export function StaffOverview() {
  const totalStudents = mockCourses.reduce((sum, course) => sum + course.students, 0)
  const totalClasses = mockCourses.reduce((sum, course) => sum + course.schedule.length, 0)

  const stats = [
    {
      title: "Active Courses",
      value: mockCourses.length,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Weekly Classes",
      value: totalClasses,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Avg. Class Size",
      value: Math.round(totalStudents / mockCourses.length),
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

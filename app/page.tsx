"use client"

import { useAuth } from "@/contexts/auth-context"
import { RoleRedirect } from "@/components/auth/role-redirect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Bell, Users, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    return <RoleRedirect />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-full p-4">
              <Bell className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lecture Reminder System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Never miss a lecture again. Stay organized with smart reminders and seamless schedule management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Smart Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage your lecture schedule with ease. Sync with departmental timetables automatically.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Bell className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Instant Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get push notifications and email reminders before your lectures start.</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Separate dashboards for students and staff with tailored features for each role.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => router.push("/login")} className="bg-primary hover:bg-primary/90">
            <BookOpen className="mr-2 h-5 w-5" />
            Sign In
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/register")}>
            Get Started
          </Button>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Demo credentials: student@example.com, staff@example.com, admin@example.com (any password)</p>
        </div>
      </div>
    </div>
  )
}

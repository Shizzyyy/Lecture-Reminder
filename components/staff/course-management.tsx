"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Edit, Trash2, Calendar, Loader2 } from "lucide-react"
import type { Course } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { AddCourseDialog } from "./add-course-dialog"
import { EditCourseDialog } from "./edit-course-dialog"
import { useToast } from "@/hooks/use-toast"

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getCourses()
      if (response.success && response.data) {
        setCourses(response.data)
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load courses",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourse = async (newCourse: Omit<Course, "id">) => {
    try {
      const response = await apiClient.createCourse(newCourse)
      if (response.success && response.data) {
        setCourses([...courses, response.data])
        setShowAddDialog(false)
        toast({
          title: "Success",
          description: "Course added successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add course",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add course",
        variant: "destructive",
      })
    }
  }

  const handleEditCourse = async (updatedCourse: Course) => {
    try {
      const response = await apiClient.updateCourse(updatedCourse.id, updatedCourse)
      if (response.success && response.data) {
        setCourses(courses.map((course) => (course.id === updatedCourse.id ? response.data : course)))
        setEditingCourse(null)
        toast({
          title: "Success",
          description: "Course updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update course",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await apiClient.deleteCourse(courseId)
      if (response.success) {
        setCourses(courses.filter((course) => course.id !== courseId))
        toast({
          title: "Success",
          description: "Course deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete course",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-green-600" />
            My Courses
          </CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No courses set up yet</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Course
            </Button>
          </div>
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
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingCourse(course)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Schedule:</h4>
                  <div className="grid gap-2">
                    {course.schedule.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                        <span className="font-medium">{schedule.day}</span>
                        <span>
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                        <span className="text-muted-foreground">{schedule.room}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AddCourseDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAddCourse={handleAddCourse} />

      {editingCourse && (
        <EditCourseDialog
          course={editingCourse}
          open={!!editingCourse}
          onOpenChange={(open) => !open && setEditingCourse(null)}
          onEditCourse={handleEditCourse}
        />
      )}
    </Card>
  )
}

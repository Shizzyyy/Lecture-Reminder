"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { Course } from "@/lib/types"

interface EditCourseDialogProps {
  course: Course
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditCourse: (course: Course) => void
}

export function EditCourseDialog({ course, open, onOpenChange, onEditCourse }: EditCourseDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    department: "",
    credits: "",
  })

  const [schedule, setSchedule] = useState([{ day: "", startTime: "", endTime: "", room: "" }])

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        code: course.code,
        instructor: course.instructor,
        department: course.department,
        credits: course.credits.toString(),
      })
      setSchedule(course.schedule.length > 0 ? course.schedule : [{ day: "", startTime: "", endTime: "", room: "" }])
    }
  }, [course])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.name &&
      formData.code &&
      formData.instructor &&
      formData.department &&
      formData.credits &&
      schedule.some((s) => s.day && s.startTime && s.endTime && s.room)
    ) {
      onEditCourse({
        ...course,
        ...formData,
        credits: Number.parseInt(formData.credits) || 0,
        schedule: schedule.filter((s) => s.day && s.startTime && s.endTime && s.room),
      })
      onOpenChange(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...schedule]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setSchedule(newSchedule)
  }

  const addScheduleSlot = () => {
    setSchedule([...schedule, { day: "", startTime: "", endTime: "", room: "" }])
  }

  const removeScheduleSlot = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Advanced Mathematics"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                placeholder="e.g., MATH301"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Input
                id="instructor"
                placeholder="e.g., Dr. Smith"
                value={formData.instructor}
                onChange={(e) => handleInputChange("instructor", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="e.g., Computer Science"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits">Credits *</Label>
            <Input
              id="credits"
              type="number"
              placeholder="e.g., 3"
              value={formData.credits}
              onChange={(e) => handleInputChange("credits", e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Class Schedule *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addScheduleSlot}>
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </div>
            {schedule.map((slot, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 items-end">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select value={slot.day} onValueChange={(value) => handleScheduleChange(index, "day", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Room</Label>
                  <Input
                    placeholder="Room 101"
                    value={slot.room}
                    onChange={(e) => handleScheduleChange(index, "room", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeScheduleSlot(index)}
                  disabled={schedule.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

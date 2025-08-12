"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Lecture } from "@/lib/types"

interface EditLectureDialogProps {
  lecture: Lecture
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditLecture: (lecture: Lecture) => void
}

export function EditLectureDialog({ lecture, open, onOpenChange, onEditLecture }: EditLectureDialogProps) {
  const [formData, setFormData] = useState({
    courseName: "",
    date: "",
    time: "",
    location: "",
    instructor: "",
  })

  useEffect(() => {
    if (lecture) {
      setFormData({
        courseName: lecture.courseName,
        date: lecture.date,
        time: lecture.time,
        location: lecture.location || "",
        instructor: lecture.instructor || "",
      })
    }
  }, [lecture])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.courseName && formData.date && formData.time) {
      onEditLecture({
        ...lecture,
        ...formData,
      })
      onOpenChange(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Lecture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name *</Label>
            <Input
              id="courseName"
              placeholder="e.g., Advanced Mathematics"
              value={formData.courseName}
              onChange={(e) => handleInputChange("courseName", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Room 101"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              placeholder="e.g., Dr. Smith"
              value={formData.instructor}
              onChange={(e) => handleInputChange("instructor", e.target.value)}
            />
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

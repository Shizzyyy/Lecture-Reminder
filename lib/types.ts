// Shared types for the application
export interface Lecture {
  id: string
  courseName: string
  date: string
  time: string
  location?: string
  instructor?: string
  createdBy: string
  isFromDepartmental?: boolean
}

export interface SystemAlert {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  timestamp: string
  read: boolean
}

export interface Reminder {
  id: string
  lectureId: string
  lectureName: string
  sentAt: string
  type: "email" | "push"
  status: "sent" | "delivered" | "failed"
}

export interface ReminderPreferences {
  id: string
  userId: string
  emailEnabled: boolean
  pushEnabled: boolean
  reminderTiming: number // minutes before lecture
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string // HH:MM format
  }
  weekendReminders: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "reminder" | "alert" | "system"
  priority: "low" | "medium" | "high"
  timestamp: string
  read: boolean
  actionUrl?: string
}

export interface Course {
  id: string
  name: string
  code: string
  instructor: string
  department: string
  credits: number
  schedule: {
    day: string
    startTime: string
    endTime: string
    room: string
  }[]
}

export interface DepartmentalTimetable {
  id: string
  courseCode: string
  courseName: string
  instructor: string
  day: string
  startTime: string
  endTime: string
  room: string
  department: string
  semester: string
}

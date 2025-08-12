import type { Lecture, SystemAlert, Reminder, ReminderPreferences, Notification } from "./types"

// Mock data for development
export const mockLectures: Lecture[] = [
  {
    id: "1",
    courseName: "Advanced Mathematics",
    date: "2024-12-09",
    time: "09:00",
    location: "Room 101",
    instructor: "Dr. Smith",
    createdBy: "1",
    isFromDepartmental: false,
  },
  {
    id: "2",
    courseName: "Computer Science Fundamentals",
    date: "2024-12-09",
    time: "14:00",
    location: "Lab 205",
    instructor: "Prof. Johnson",
    createdBy: "1",
    isFromDepartmental: true,
  },
  {
    id: "3",
    courseName: "Physics Laboratory",
    date: "2024-12-10",
    time: "10:30",
    location: "Physics Lab",
    instructor: "Dr. Wilson",
    createdBy: "1",
    isFromDepartmental: false,
  },
]

export const mockAlerts: SystemAlert[] = [
  {
    id: "1",
    title: "Schedule Update",
    message: "Your Computer Science lecture has been moved to Room 301",
    type: "info",
    timestamp: "2024-12-08T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    title: "New Departmental Timetable",
    message: "A new departmental timetable is available for sync",
    type: "success",
    timestamp: "2024-12-07T15:45:00Z",
    read: true,
  },
  {
    id: "3",
    title: "Reminder Settings",
    message: "Don't forget to enable push notifications for better experience",
    type: "warning",
    timestamp: "2024-12-06T09:15:00Z",
    read: true,
  },
]

export const mockReminders: Reminder[] = [
  {
    id: "1",
    lectureId: "1",
    lectureName: "Advanced Mathematics",
    sentAt: "2024-12-08T08:45:00Z",
    type: "push",
    status: "delivered",
  },
  {
    id: "2",
    lectureId: "2",
    lectureName: "Computer Science Fundamentals",
    sentAt: "2024-12-08T13:45:00Z",
    type: "email",
    status: "sent",
  },
  {
    id: "3",
    lectureId: "1",
    lectureName: "Advanced Mathematics",
    sentAt: "2024-12-07T08:45:00Z",
    type: "push",
    status: "delivered",
  },
]

// Staff-specific types and mock data
export interface Course {
  id: string
  name: string
  code: string
  description?: string
  staffId: string
  students: number
  schedule: {
    day: string
    time: string
    location: string
  }[]
}

export interface DepartmentalTimetable {
  id: string
  fileName: string
  uploadedBy: string
  uploadedAt: string
  status: "processing" | "active" | "failed"
  coursesCount: number
}

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Advanced Mathematics",
    code: "MATH301",
    description: "Advanced calculus and linear algebra",
    staffId: "2",
    students: 45,
    schedule: [
      { day: "Monday", time: "09:00", location: "Room 101" },
      { day: "Wednesday", time: "09:00", location: "Room 101" },
      { day: "Friday", time: "09:00", location: "Room 101" },
    ],
  },
  {
    id: "2",
    name: "Computer Science Fundamentals",
    code: "CS101",
    description: "Introduction to programming and algorithms",
    staffId: "2",
    students: 60,
    schedule: [
      { day: "Tuesday", time: "14:00", location: "Lab 205" },
      { day: "Thursday", time: "14:00", location: "Lab 205" },
    ],
  },
]

export const mockTimetables: DepartmentalTimetable[] = [
  {
    id: "1",
    fileName: "fall_2024_timetable.csv",
    uploadedBy: "Admin User",
    uploadedAt: "2024-12-01T10:00:00Z",
    status: "active",
    coursesCount: 45,
  },
  {
    id: "2",
    fileName: "spring_2024_timetable.xlsx",
    uploadedBy: "Admin User",
    uploadedAt: "2024-11-15T14:30:00Z",
    status: "processing",
    coursesCount: 38,
  },
]

export const mockStaffReminders: Reminder[] = [
  {
    id: "1",
    lectureId: "1",
    lectureName: "Advanced Mathematics - Section A",
    sentAt: "2024-12-08T08:45:00Z",
    type: "email",
    status: "delivered",
  },
  {
    id: "2",
    lectureId: "2",
    lectureName: "Computer Science Fundamentals",
    sentAt: "2024-12-08T13:45:00Z",
    type: "push",
    status: "delivered",
  },
  {
    id: "3",
    lectureId: "1",
    lectureName: "Advanced Mathematics - Section B",
    sentAt: "2024-12-07T08:45:00Z",
    type: "email",
    status: "sent",
  },
  {
    id: "4",
    lectureId: "2",
    lectureName: "Computer Science Lab Session",
    sentAt: "2024-12-07T13:30:00Z",
    type: "push",
    status: "failed",
  },
]

// Notification-specific mock data
export const mockReminderPreferences: ReminderPreferences = {
  id: "1",
  userId: "1",
  emailEnabled: true,
  pushEnabled: true,
  reminderTiming: 15, // 15 minutes before
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "08:00",
  },
  weekendReminders: false,
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Lecture Reminder",
    message: "Advanced Mathematics starts in 15 minutes in Room 101",
    type: "reminder",
    priority: "high",
    timestamp: "2024-12-09T08:45:00Z",
    read: false,
    actionUrl: "/student",
  },
  {
    id: "2",
    title: "Schedule Update",
    message: "Your Computer Science lecture has been moved to Room 301",
    type: "alert",
    priority: "medium",
    timestamp: "2024-12-08T14:30:00Z",
    read: false,
  },
  {
    id: "3",
    title: "New Timetable Available",
    message: "A new departmental timetable is ready for sync",
    type: "system",
    priority: "low",
    timestamp: "2024-12-07T10:00:00Z",
    read: true,
  },
]

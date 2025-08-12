import type { Course, DepartmentalTimetable, Lecture, Reminder, ReminderPreferences } from "@/lib/types"

// Centralized in-memory store for demo purposes
// NOTE: This is reset on server restart. Replace with a database in production.

export const store: {
  courses: Course[]
  departmentalTimetable: DepartmentalTimetable[]
  userLectures: Record<string, Lecture[]>
  reminderPreferences: Record<string, ReminderPreferences>
  reminders: Record<string, Reminder[]>
} = {
  courses: [
    {
      id: "1",
      name: "Computer Science 101",
      code: "CS101",
      instructor: "Dr. Smith",
      department: "Computer Science",
      credits: 3,
      schedule: [
        { day: "Monday", startTime: "09:00", endTime: "10:30", room: "Room A101" },
        { day: "Wednesday", startTime: "09:00", endTime: "10:30", room: "Room A101" },
      ],
    },
    {
      id: "2",
      name: "Data Structures",
      code: "CS201",
      instructor: "Prof. Johnson",
      department: "Computer Science",
      credits: 4,
      schedule: [
        { day: "Tuesday", startTime: "14:00", endTime: "15:30", room: "Room B205" },
        { day: "Thursday", startTime: "14:00", endTime: "15:30", room: "Room B205" },
      ],
    },
  ],
  departmentalTimetable: [
    {
      id: "1",
      courseCode: "CS101",
      courseName: "Computer Science 101",
      instructor: "Dr. Smith",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      room: "Room A101",
      department: "Computer Science",
      semester: "Fall 2024",
    },
    {
      id: "2",
      courseCode: "CS101",
      courseName: "Computer Science 101",
      instructor: "Dr. Smith",
      day: "Wednesday",
      startTime: "09:00",
      endTime: "10:30",
      room: "Room A101",
      department: "Computer Science",
      semester: "Fall 2024",
    },
  ],
  userLectures: {},
  reminderPreferences: {},
  reminders: {},
}



import { type NextRequest, NextResponse } from "next/server"
import type { Course, Reminder } from "@/lib/types"
import { readStore, writeStore } from "@/lib/store-service"

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const instructor = searchParams.get("instructor")
    const department = searchParams.get("department")

    const store = await readStore()
    let filteredCourses = store.courses

    // Filter by instructor if provided
    if (instructor) {
      filteredCourses = filteredCourses.filter((course) =>
        course.instructor.toLowerCase().includes(instructor.toLowerCase()),
      )
    }

    // Filter by department if provided
    if (department) {
      filteredCourses = filteredCourses.filter((course) =>
        course.department.toLowerCase().includes(department.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredCourses,
      total: filteredCourses.length,
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 })
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "code", "instructor", "department", "credits", "schedule"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if course code already exists
    const store = await readStore()
    const existingCourse = store.courses.find((course) => course.code === body.code)
    if (existingCourse) {
      return NextResponse.json({ success: false, error: "Course code already exists" }, { status: 409 })
    }

    // Create new course
    const newCourse: Course = {
      id: Date.now().toString(), // Simple ID generation for demo
      name: body.name,
      code: body.code,
      instructor: body.instructor,
      department: body.department,
      credits: Number.parseInt(body.credits),
      schedule: body.schedule,
    }

    store.courses.push(newCourse)
    // Broadcast a simple reminder to all students (demo)
    const reminder: Reminder = {
      id: Date.now().toString(),
      lectureId: newCourse.id,
      lectureName: `${newCourse.code} - ${newCourse.name}`,
      sentAt: new Date().toISOString(),
      type: "push",
      status: "sent",
    }
    for (const userId of Object.keys(store.userLectures)) {
      const list = store.reminders[userId] || []
      list.push(reminder)
      store.reminders[userId] = list
    }
    await writeStore(store)

    return NextResponse.json(
      {
        success: true,
        data: newCourse,
        message: "Course created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ success: false, error: "Failed to create course" }, { status: 500 })
  }
}

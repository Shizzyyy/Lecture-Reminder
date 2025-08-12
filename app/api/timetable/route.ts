import { type NextRequest, NextResponse } from "next/server"
import type { DepartmentalTimetable } from "@/lib/types"
import { readStore, writeStore } from "@/lib/store-service"

// GET /api/timetable - Get departmental timetable
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const semester = searchParams.get("semester")
    const instructor = searchParams.get("instructor")

    const store = await readStore()
    let filteredTimetable = store.departmentalTimetable

    // Apply filters
    if (department) {
      filteredTimetable = filteredTimetable.filter((entry) =>
        entry.department.toLowerCase().includes(department.toLowerCase()),
      )
    }

    if (semester) {
      filteredTimetable = filteredTimetable.filter((entry) =>
        entry.semester.toLowerCase().includes(semester.toLowerCase()),
      )
    }

    if (instructor) {
      filteredTimetable = filteredTimetable.filter((entry) =>
        entry.instructor.toLowerCase().includes(instructor.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredTimetable,
      total: filteredTimetable.length,
    })
  } catch (error) {
    console.error("Error fetching timetable:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch timetable" }, { status: 500 })
  }
}

// POST /api/timetable - Add individual timetable entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "courseCode",
      "courseName",
      "instructor",
      "day",
      "startTime",
      "endTime",
      "room",
      "department",
      "semester",
    ]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new timetable entry
    const newEntry: DepartmentalTimetable = {
      id: Date.now().toString(),
      courseCode: body.courseCode,
      courseName: body.courseName,
      instructor: body.instructor,
      day: body.day,
      startTime: body.startTime,
      endTime: body.endTime,
      room: body.room,
      department: body.department,
      semester: body.semester,
    }

    const store = await readStore()
    store.departmentalTimetable.push(newEntry)
    await writeStore(store)

    return NextResponse.json(
      {
        success: true,
        data: newEntry,
        message: "Timetable entry added successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding timetable entry:", error)
    return NextResponse.json({ success: false, error: "Failed to add timetable entry" }, { status: 500 })
  }
}

// DELETE /api/timetable - Clear all timetable entries
export async function DELETE() {
  try {
    const store = await readStore()
    const deletedCount = store.departmentalTimetable.length
    store.departmentalTimetable.length = 0
    await writeStore(store)

    return NextResponse.json({
      success: true,
      message: `Cleared ${deletedCount} timetable entries`,
      deletedCount,
    })
  } catch (error) {
    console.error("Error clearing timetable:", error)
    return NextResponse.json({ success: false, error: "Failed to clear timetable" }, { status: 500 })
  }
}

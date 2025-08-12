import { type NextRequest, NextResponse } from "next/server"
import type { Course } from "@/lib/types"
import { readStore, writeStore } from "@/lib/store-service"

// GET /api/courses/[id] - Get a specific course
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const store = await readStore()
    const course = store.courses.find((c) => c.id === params.id)

    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: course,
    })
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch course" }, { status: 500 })
  }
}

// PUT /api/courses/[id] - Update a specific course
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const store = await readStore()
    const courseIndex = store.courses.findIndex((c) => c.id === params.id)

    if (courseIndex === -1) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 })
    }

    // Check if course code is being changed and if it conflicts
    if (body.code && body.code !== store.courses[courseIndex].code) {
      const existingCourse = store.courses.find((course) => course.code === body.code)
      if (existingCourse) {
        return NextResponse.json({ success: false, error: "Course code already exists" }, { status: 409 })
      }
    }

    // Update course
    const updatedCourse: Course = {
      ...store.courses[courseIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
      credits: body.credits ? Number.parseInt(body.credits) : store.courses[courseIndex].credits,
    }

    store.courses[courseIndex] = updatedCourse
    await writeStore(store)

    return NextResponse.json({
      success: true,
      data: updatedCourse,
      message: "Course updated successfully",
    })
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ success: false, error: "Failed to update course" }, { status: 500 })
  }
}

// DELETE /api/courses/[id] - Delete a specific course
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const store = await readStore()
    const courseIndex = store.courses.findIndex((c) => c.id === params.id)

    if (courseIndex === -1) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 })
    }

    const deletedCourse = store.courses[courseIndex]
    store.courses.splice(courseIndex, 1)
    await writeStore(store)

    return NextResponse.json({
      success: true,
      data: deletedCourse,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ success: false, error: "Failed to delete course" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import type { DepartmentalTimetable } from "@/lib/types"
import { readStore, writeStore } from "@/lib/store-service"

// POST /api/timetable/upload - Upload and process timetable file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const department = formData.get("department") as string
    const semester = formData.get("semester") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    if (!department || !semester) {
      return NextResponse.json({ success: false, error: "Department and semester are required" }, { status: 400 })
    }

    // Validate file type (CSV common types)
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/csv",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Please upload CSV files only." },
        { status: 400 },
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "File size too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Read file content
    const fileContent = await file.text()

    // Process CSV content
    const processedData = await processTimetableFile(fileContent, department, semester)

    if (processedData.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid timetable entries found in the file" },
        { status: 400 },
      )
    }

    // Clear existing entries for this department and semester (in-place)
    const store = await readStore()
    const remaining = store.departmentalTimetable.filter(
      (entry) => !(entry.department === department && entry.semester === semester),
    )
    store.departmentalTimetable.length = 0
    store.departmentalTimetable.push(...remaining)

    // Add new entries
    store.departmentalTimetable.push(...processedData)
    await writeStore(store)

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${processedData.length} timetable entries`,
      data: {
        entriesAdded: processedData.length,
        department,
        semester,
        preview: processedData.slice(0, 5), // Show first 5 entries as preview
      },
    })
  } catch (error) {
    console.error("Error uploading timetable:", error)
    return NextResponse.json({ success: false, error: "Failed to process timetable file" }, { status: 500 })
  }
}

// Helper function to process timetable file content
async function processTimetableFile(
  content: string,
  department: string,
  semester: string,
): Promise<DepartmentalTimetable[]> {
  const lines = content.split("\n").filter((line) => line.trim())

  if (lines.length < 2) {
    throw new Error("File must contain at least a header row and one data row")
  }

  // Parse header row to determine column positions
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

  // Expected column mappings
  const columnMap = {
    courseCode: findColumnIndex(headers, ["course_code", "coursecode", "code"]),
    courseName: findColumnIndex(headers, ["course_name", "coursename", "name", "title"]),
    instructor: findColumnIndex(headers, ["instructor", "teacher", "faculty", "professor"]),
    day: findColumnIndex(headers, ["day", "weekday", "day_of_week"]),
    startTime: findColumnIndex(headers, ["start_time", "starttime", "start", "time_start"]),
    endTime: findColumnIndex(headers, ["end_time", "endtime", "end", "time_end"]),
    room: findColumnIndex(headers, ["room", "classroom", "location", "venue"]),
  }

  // Validate required columns
  const requiredColumns = ["courseCode", "courseName", "instructor", "day", "startTime", "endTime", "room"]
  for (const col of requiredColumns) {
    if (columnMap[col as keyof typeof columnMap] === -1) {
      throw new Error(`Required column not found: ${col}. Available columns: ${headers.join(", ")}`)
    }
  }

  const processedEntries: DepartmentalTimetable[] = []

  // Process data rows
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((cell) => cell.trim())

    if (row.length < Math.max(...Object.values(columnMap)) + 1) {
      console.warn(`Skipping row ${i + 1}: insufficient columns`)
      continue
    }

    try {
      const entry: DepartmentalTimetable = {
        id: `${Date.now()}-${i}`,
        courseCode: row[columnMap.courseCode] || "",
        courseName: row[columnMap.courseName] || "",
        instructor: row[columnMap.instructor] || "",
        day: normalizeDay(row[columnMap.day] || ""),
        startTime: normalizeTime(row[columnMap.startTime] || ""),
        endTime: normalizeTime(row[columnMap.endTime] || ""),
        room: row[columnMap.room] || "",
        department,
        semester,
      }

      // Validate entry
      if (
        entry.courseCode &&
        entry.courseName &&
        entry.instructor &&
        entry.day &&
        entry.startTime &&
        entry.endTime &&
        entry.room
      ) {
        processedEntries.push(entry)
      } else {
        console.warn(`Skipping row ${i + 1}: missing required data`)
      }
    } catch (error) {
      console.warn(`Error processing row ${i + 1}:`, error)
    }
  }

  return processedEntries
}

// Helper function to find column index by possible names
function findColumnIndex(headers: string[], possibleNames: string[]): number {
  for (const name of possibleNames) {
    const index = headers.findIndex((h) => h.includes(name))
    if (index !== -1) return index
  }
  return -1
}

// Helper function to normalize day names
function normalizeDay(day: string): string {
  const dayMap: { [key: string]: string } = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  }

  const normalized = day.toLowerCase().substring(0, 3)
  return dayMap[normalized] || day
}

// Helper function to normalize time format
function normalizeTime(time: string): string {
  // Convert various time formats to HH:MM
  const timeRegex = /(\d{1,2}):?(\d{2})?\s*(am|pm)?/i
  const match = time.match(timeRegex)

  if (!match) return time

  let hours = Number.parseInt(match[1])
  const minutes = match[2] || "00"
  const period = match[3]?.toLowerCase()

  if (period === "pm" && hours !== 12) {
    hours += 12
  } else if (period === "am" && hours === 12) {
    hours = 0
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`
}

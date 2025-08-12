import { NextRequest, NextResponse } from "next/server"
import { store as memoryStore } from "@/lib/data-store"
import { readStore, writeStore } from "@/lib/store-service"
import type { Lecture } from "@/lib/types"

// GET /api/student/lectures?userId=ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || ""
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 })
  const store = await readStore()
  return NextResponse.json({ success: true, data: store.userLectures[userId] || [] })
}

// PUT /api/student/lectures?userId=ID
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || ""
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 })
  const body = (await request.json()) as { lectures: Lecture[] }
  const store = await readStore()
  store.userLectures[userId] = body.lectures || []
  await writeStore(store)
  return NextResponse.json({ success: true, data: store.userLectures[userId] })
}

// POST /api/student/lectures/sync?userId=ID
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || ""
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 })
  const store = await readStore()
  const existing = store.userLectures[userId] || []
  const now = new Date()
  const dayToIdx: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }
  const nextDateForDay = (weekday: string) => {
    const target = dayToIdx[weekday] ?? now.getDay()
    const diff = (target - now.getDay() + 7) % 7 || 7
    const d = new Date(now)
    d.setDate(now.getDate() + diff)
    return d.toISOString().slice(0, 10)
  }
  const mapped: Lecture[] = store.departmentalTimetable.map((t, i) => ({
    id: `dept-${Date.now()}-${i}`,
    courseName: `${t.courseCode} - ${t.courseName}`,
    date: nextDateForDay(t.day),
    time: t.startTime,
    location: t.room,
    instructor: t.instructor,
    createdBy: "system",
    isFromDepartmental: true,
  }))
  // Deduplicate by courseName+date+time
  const key = (l: Lecture) => `${l.courseName}|${l.date}|${l.time}`
  const seen = new Set(existing.map(key))
  const toAdd = mapped.filter((l) => !seen.has(key(l)))
  const updated = [...existing, ...toAdd]
  store.userLectures[userId] = updated
  await writeStore(store)
  return NextResponse.json({ success: true, data: updated, added: toAdd.length })
}



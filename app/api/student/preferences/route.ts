import { NextRequest, NextResponse } from "next/server"
import { readStore, writeStore } from "@/lib/store-service"
import type { ReminderPreferences } from "@/lib/types"

// GET /api/student/preferences?userId=ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || ""
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 })
  const store = await readStore()
  return NextResponse.json({ success: true, data: store.reminderPreferences[userId] || null })
}

// PUT /api/student/preferences?userId=ID
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || ""
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 })
  const prefs = (await request.json()) as ReminderPreferences
  const store = await readStore()
  store.reminderPreferences[userId] = prefs
  await writeStore(store)
  return NextResponse.json({ success: true, data: prefs })
}



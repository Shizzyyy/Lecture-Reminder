import { NextRequest, NextResponse } from "next/server"
import { readStore, writeStore } from "@/lib/store-service"
import type { Reminder } from "@/lib/types"

// GET /api/student/reminders?userId=ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || ""
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 })
  const store = await readStore()
  return NextResponse.json({ success: true, data: store.reminders[userId] || [] })
}

// POST /api/student/reminders (append)
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || ""
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 })
  const body = (await request.json()) as Reminder
  const store = await readStore()
  const list = store.reminders[userId] || []
  list.push(body)
  store.reminders[userId] = list
  await writeStore(store)
  return NextResponse.json({ success: true, data: list })
}



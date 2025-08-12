import { promises as fs } from "fs"
import path from "path"
import { store as initialStore } from "@/lib/data-store"

const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "db.json")

export type AppStore = typeof initialStore

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {}
}

export async function readStore(): Promise<AppStore> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8")
    return JSON.parse(raw)
  } catch {
    // Initialize with defaults
    await ensureDir()
    await fs.writeFile(DB_PATH, JSON.stringify(initialStore, null, 2), "utf8")
    return JSON.parse(JSON.stringify(initialStore))
  }
}

export async function writeStore(next: AppStore): Promise<void> {
  await ensureDir()
  await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf8")
}



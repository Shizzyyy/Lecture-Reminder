# Lecture Reminder Web App

A role-based lecture reminder system built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Stack
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Radix UI + shadcn/ui components

## Features
- Authentication (mock) with roles: student, staff, admin
- Staff can create/edit/delete courses
- Admin can upload departmental timetables via CSV
- Students can:
  - Add personal lectures
  - Sync the departmental timetable (deduped)
  - View Today’s lectures (falls back to next upcoming)
  - Manage reminder preferences (email/push timing, quiet hours)
  - See reminder history and a notification center
- Persistence via file-backed store at `data/db.json`

## Quickstart
Prerequisites: Node 18+, pnpm (via corepack) recommended.

```bash
pnpm install
pnpm run dev
# open http://localhost:3000
```

Demo accounts (any password):
- student@example.com
- staff@example.com
- admin@example.com

## Production
```bash
pnpm run build
PORT=3001 pnpm run start
# open http://localhost:3001
```

## Data persistence
- Runtime data is stored at `data/db.json` (auto-created). It is .gitignored.
- The following are persisted:
  - Courses
  - Departmental timetable entries
  - Per-student lectures
  - Per-student reminder preferences
  - Per-student reminders

## API (App Router)
- Courses
  - `GET /api/courses` (filters: `instructor`, `department`)
  - `POST /api/courses` (creates; also appends a reminder to students)
  - `GET /api/courses/[id]`
  - `PUT /api/courses/[id]`
  - `DELETE /api/courses/[id]`
- Timetable
  - `GET /api/timetable` (filters: `department`, `semester`, `instructor`)
  - `POST /api/timetable` (create a single entry)
  - `DELETE /api/timetable` (clear all)
  - `POST /api/timetable/upload` (CSV upload)
    - Accepted MIME types: `text/csv`, `application/vnd.ms-excel`, `application/csv`, `text/plain`
    - Required columns (case-insensitive, flexible names): Course Code/Name, Instructor, Day, Start/End Time, Room
- Student
  - `GET /api/student/lectures?userId=...`
  - `PUT /api/student/lectures?userId=...` (replace list)
  - `POST /api/student/lectures?userId=...` (sync from departmental timetable with dedupe)
  - `GET /api/student/preferences?userId=...`
  - `PUT /api/student/preferences?userId=...`
  - `GET /api/student/reminders?userId=...`
  - `POST /api/student/reminders?userId=...` (append)

## Known limitations
- Push notifications are demo-only (uses Browser Notification permission). For real push, add a service worker + VAPID keys and a push backend.
- API routes are open (no auth middleware). Add header/token-based checks for production.
- Dev-only Fast Refresh can occasionally cause chunk 404s in Next dev; a hard refresh usually resolves it.

## CSV upload format
- Expected headers (flexible matching):
  - `course_code`, `course_name`, `instructor`, `day`, `start_time`, `end_time`, `room`
- Variants are accepted (e.g., `code`, `title`, `weekday`, `time_start`, etc.).
- File size <= 5 MB.

## Scripts
- `pnpm run dev` — start dev server (port 3000)
- `pnpm run build` — production build
- `pnpm run start` — start production server (respect `PORT`)

## License
MIT

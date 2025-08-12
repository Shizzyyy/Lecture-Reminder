"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, FolderSync as Sync, Edit, Trash2, MapPin, User, Clock } from "lucide-react"
import { mockLectures } from "@/lib/mock-data"
import { format, parseISO } from "date-fns"
import { AddLectureDialog } from "./add-lecture-dialog"
import { EditLectureDialog } from "./edit-lecture-dialog"
import type { Lecture } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"

export function LectureSchedule() {
  const { user } = useAuth()
  const [lectures, setLectures] = useState<Lecture[]>(mockLectures)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // Load persisted lectures
  useEffect(() => {
    const load = async () => {
      if (!user) return
      const res = await apiClient.fetchUserLectures(user.id)
      if (res.success && res.data) {
        setLectures(res.data.length ? res.data : mockLectures)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // Persist on change
  useEffect(() => {
    if (!user) return
    apiClient.saveUserLectures(user.id, lectures)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectures])

  const handleAddLecture = (newLecture: Omit<Lecture, "id" | "createdBy">) => {
    const lecture: Lecture = {
      ...newLecture,
      id: Date.now().toString(),
      createdBy: user?.id || "1",
      isFromDepartmental: false,
    }
    setLectures([...lectures, lecture])
  }

  const handleEditLecture = (updatedLecture: Lecture) => {
    setLectures(lectures.map((lecture) => (lecture.id === updatedLecture.id ? updatedLecture : lecture)))
  }

  const handleDeleteLecture = (lectureId: string) => {
    setLectures(lectures.filter((lecture) => lecture.id !== lectureId))
  }

  const handleSyncTimetable = async () => {
    setIsSyncing(true)
    if (user) {
      const res = await apiClient.syncUserTimetable(user.id)
      if (res.success && Array.isArray(res.data)) {
        setLectures(res.data)
      }
    }
    setIsSyncing(false)
  }

  // Sort lectures by date and time
  const sortedLectures = [...lectures].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`)
    const dateB = new Date(`${b.date} ${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Lecture Schedule
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleSyncTimetable} disabled={isSyncing}>
              <Sync className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing..." : "Sync Timetable"}
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lecture
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedLectures.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No lectures scheduled yet</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Lecture
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLectures.map((lecture) => (
              <div
                key={lecture.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{lecture.courseName}</h3>
                    <div className="flex items-center space-x-2">
                      {lecture.isFromDepartmental && (
                        <Badge variant="secondary" className="text-xs">
                          Departmental
                        </Badge>
                      )}
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingLecture(lecture)}
                          disabled={lecture.isFromDepartmental}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLecture(lecture.id)}
                          disabled={lecture.isFromDepartmental}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(parseISO(lecture.date), "MMM dd, yyyy")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {lecture.time}
                    </div>
                    {lecture.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {lecture.location}
                      </div>
                    )}
                    {lecture.instructor && (
                      <div className="flex items-center md:col-span-2">
                        <User className="h-4 w-4 mr-2" />
                        {lecture.instructor}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AddLectureDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAddLecture={handleAddLecture} />

      {editingLecture && (
        <EditLectureDialog
          lecture={editingLecture}
          open={!!editingLecture}
          onOpenChange={(open) => !open && setEditingLecture(null)}
          onEditLecture={handleEditLecture}
        />
      )}
    </Card>
  )
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Trash2, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface TimetableUpload {
  id: string
  fileName: string
  department: string
  semester: string
  uploadedAt: string
  entriesCount: number
  status: "active" | "processing" | "failed"
}

export function TimetableUpload() {
  const [uploads, setUploads] = useState<TimetableUpload[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [department, setDepartment] = useState("Computer Science")
  const [semester, setSemester] = useState("Fall 2024")
  const { toast } = useToast()

  useEffect(() => {
    loadTimetableData()
  }, [])

  const loadTimetableData = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getTimetable()
      if (response.success && response.data) {
        // Group timetable entries by department and semester to show as uploads
        const groupedData = response.data.reduce((acc: any, entry: any) => {
          const key = `${entry.department}-${entry.semester}`
          if (!acc[key]) {
            acc[key] = {
              id: key,
              fileName: `${entry.department}_${entry.semester.replace(" ", "_")}.csv`,
              department: entry.department,
              semester: entry.semester,
              uploadedAt: new Date().toISOString(),
              entriesCount: 0,
              status: "active" as const,
            }
          }
          acc[key].entriesCount++
          return acc
        }, {})

        setUploads(Object.values(groupedData))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load timetable data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!department || !semester) {
      toast({
        title: "Error",
        description: "Please specify department and semester",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const response = await apiClient.uploadTimetable(file, department, semester)

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Timetable uploaded successfully",
        })

        // Add new upload to the list
        const newUpload: TimetableUpload = {
          id: `${department}-${semester}`,
          fileName: file.name,
          department,
          semester,
          uploadedAt: new Date().toISOString(),
          entriesCount: response.data?.entriesAdded || 0,
          status: "active",
        }

        // Remove existing upload for same department/semester and add new one
        setUploads((prev) => [newUpload, ...prev.filter((upload) => upload.id !== newUpload.id)])
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to upload timetable",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload timetable",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      event.target.value = ""
    }
  }

  const handleDeleteTimetable = async (upload: TimetableUpload) => {
    try {
      const response = await apiClient.clearTimetable()
      if (response.success) {
        setUploads(uploads.filter((u) => u.id !== upload.id))
        toast({
          title: "Success",
          description: "Timetable deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete timetable",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete timetable",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "processing":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2 text-purple-600" />
            Departmental Timetable Upload
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Upload Instructions</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Supported format: CSV</li>
            <li>• Required columns: Course Code, Course Name, Instructor, Day, Start Time, End Time, Room</li>
            <li>• Students will be able to sync with the uploaded timetable</li>
            <li>• Uploading will replace existing timetable for the same department and semester</li>
          </ul>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Computer Science"
            />
          </div>
          <div>
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g., Fall 2024"
            />
          </div>
          <div className="flex items-end">
            <div className="relative w-full">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Button disabled={isUploading} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Timetable
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {uploads.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No timetables uploaded yet</p>
            <p className="text-sm text-muted-foreground">Upload your first departmental timetable to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    {getStatusIcon(upload.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{upload.fileName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{upload.department}</span>
                      <span>{upload.semester}</span>
                      <span>{upload.entriesCount} entries</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusBadgeVariant(upload.status)} className="text-xs">
                    {upload.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTimetable(upload)}
                    disabled={upload.status === "processing"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

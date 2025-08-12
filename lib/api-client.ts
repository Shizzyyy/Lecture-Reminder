export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}/api${endpoint}`
      const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData
      const headers: HeadersInit = isFormData
        ? { ...(options.headers || {}) }
        : { "Content-Type": "application/json", ...(options.headers || {}) }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        success: false,
        error: "Network error occurred",
      }
    }
  }

  // Course API methods
  async getCourses(filters?: { instructor?: string; department?: string }) {
    const params = new URLSearchParams()
    if (filters?.instructor) params.append("instructor", filters.instructor)
    if (filters?.department) params.append("department", filters.department)

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request(`/courses${query}`)
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`)
  }

  async createCourse(courseData: any) {
    return this.request("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    })
  }

  async updateCourse(id: string, courseData: any) {
    return this.request(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    })
  }

  async deleteCourse(id: string) {
    return this.request(`/courses/${id}`, {
      method: "DELETE",
    })
  }

  // Timetable API methods
  async uploadTimetable(file: File, department: string, semester: string) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("department", department)
    formData.append("semester", semester)

    return this.request("/timetable/upload", {
      method: "POST",
      body: formData,
      headers: {},
    })
  }

  async getTimetable(filters?: { department?: string; semester?: string; instructor?: string }) {
    const params = new URLSearchParams()
    if (filters?.department) params.append("department", filters.department)
    if (filters?.semester) params.append("semester", filters.semester)
    if (filters?.instructor) params.append("instructor", filters.instructor)

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request(`/timetable${query}`)
  }

  async addTimetableEntry(entryData: any) {
    return this.request("/timetable", {
      method: "POST",
      body: JSON.stringify(entryData),
    })
  }

  async clearTimetable() {
    return this.request("/timetable", {
      method: "DELETE",
    })
  }

  // Student data via server
  async fetchUserLectures(userId: string) {
    return this.request(`/student/lectures?userId=${encodeURIComponent(userId)}`)
  }

  async saveUserLectures(userId: string, lectures: any[]) {
    return this.request(`/student/lectures?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify({ lectures }),
    })
  }

  async syncUserTimetable(userId: string) {
    return this.request(`/student/lectures?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
    })
  }

  async getReminderPreferences(userId: string) {
    return this.request(`/student/preferences?userId=${encodeURIComponent(userId)}`)
  }

  async saveReminderPreferences(userId: string, prefs: any) {
    return this.request(`/student/preferences?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(prefs),
    })
  }

  async getReminders(userId: string) {
    return this.request(`/student/reminders?userId=${encodeURIComponent(userId)}`)
  }

  async addReminder(userId: string, reminder: any) {
    return this.request(`/student/reminders?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(reminder),
    })
  }
}

export const apiClient = new ApiClient()

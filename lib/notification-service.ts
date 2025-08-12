export class NotificationService {
  static async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      throw new Error("This browser does not support notifications")
    }

    return await Notification.requestPermission()
  }

  static async sendPushNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (Notification.permission !== "granted") {
      throw new Error("Notification permission not granted")
    }

    new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    })
  }

  static scheduleReminder(
    lecture: { courseName: string; date: string; time: string; location?: string },
    minutesBefore: number,
  ): void {
    const lectureDateTime = new Date(`${lecture.date} ${lecture.time}`)
    const reminderTime = new Date(lectureDateTime.getTime() - minutesBefore * 60 * 1000)
    const now = new Date()

    if (reminderTime > now) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime()

      setTimeout(() => {
        this.sendPushNotification(`Lecture Reminder: ${lecture.courseName}`, {
          body: `Your lecture starts in ${minutesBefore} minutes${lecture.location ? ` in ${lecture.location}` : ""}`,
          tag: `lecture-${lecture.courseName}-${lecture.date}`,
          requireInteraction: true,
        }).catch(console.error)
      }, timeUntilReminder)
    }
  }

  static async sendEmailReminder(
    email: string,
    lecture: { courseName: string; date: string; time: string; location?: string },
  ): Promise<void> {
    // In a real application, this would call your backend API
    console.log(`Sending email reminder to ${email} for ${lecture.courseName}`)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

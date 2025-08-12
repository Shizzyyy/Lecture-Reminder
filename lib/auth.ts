// Authentication types and utilities
export interface User {
  id: string
  email: string
  role: "student" | "staff" | "admin"
  name: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication functions (replace with real API calls)
export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Load registered users from localStorage (demo persistence)
    const usersJson = localStorage.getItem("users")
    const registeredUsers: User[] = usersJson ? JSON.parse(usersJson) : []

    // Accept any registered user
    const registered = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (registered) {
      localStorage.setItem("user", JSON.stringify(registered))
      return registered
    }

    // Fallback to demo accounts
    const demoUsers: Record<string, User> = {
      "student@example.com": {
        id: "1",
        email: "student@example.com",
        role: "student",
        name: "John Student",
      },
      "staff@example.com": {
        id: "2",
        email: "staff@example.com",
        role: "staff",
        name: "Jane Professor",
      },
      "admin@example.com": {
        id: "3",
        email: "admin@example.com",
        role: "admin",
        name: "Admin User",
      },
    }

    const demo = demoUsers[email]
    if (!demo) {
      throw new Error("Invalid credentials")
    }

    localStorage.setItem("user", JSON.stringify(demo))
    return demo
  },

  async register(email: string, password: string, name: string, role: "student" | "staff"): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      email,
      role,
      name,
    }

    // Append to users list
    const usersJson = localStorage.getItem("users")
    const registeredUsers: User[] = usersJson ? JSON.parse(usersJson) : []
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!exists) {
      registeredUsers.push(newUser)
      localStorage.setItem("users", JSON.stringify(registeredUsers))
    }

    // Auto-login newly registered user
    localStorage.setItem("user", JSON.stringify(newUser))
    return newUser
  },

  async logout(): Promise<void> {
    localStorage.removeItem("user")
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  },
}

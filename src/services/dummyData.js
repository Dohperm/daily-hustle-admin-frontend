// Dummy data for testing - replace with real API calls

export const dummyStats = {
  totalUsers: 1247,
  totalTasks: 89,
  pendingApprovals: 12,
  completedTasks: 3456
}

export const dummyActivity = [
  { message: "User John Doe completed task 'Morning Workout'", timestamp: new Date().toISOString() },
  { message: "New task 'Read 30 pages' submitted for approval", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { message: "Task 'Drink 8 glasses of water' approved", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { message: "User Jane Smith registered", timestamp: new Date(Date.now() - 10800000).toISOString() }
]

export const dummyUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1234567890", tasksCompleted: 45, points: 2250, isActive: true },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", tasksCompleted: 32, points: 1600, isActive: true },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1234567892", tasksCompleted: 18, points: 900, isActive: false },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com", phone: "+1234567893", tasksCompleted: 67, points: 3350, isActive: true },
  { id: 5, name: "David Brown", email: "david@example.com", phone: "+1234567894", tasksCompleted: 23, points: 1150, isActive: true }
]

export const dummyTasks = [
  { id: 1, title: "Morning Workout", description: "Complete 30 minutes of exercise", points: 50, userName: "John Doe", userId: 1, status: "completed", createdAt: "2024-01-15T08:00:00Z" },
  { id: 2, title: "Read 30 Pages", description: "Read at least 30 pages of any book", points: 30, userName: "Jane Smith", userId: 2, status: "approved", createdAt: "2024-01-14T10:00:00Z" },
  { id: 3, title: "Drink Water", description: "Drink 8 glasses of water throughout the day", points: 20, userName: "Mike Johnson", userId: 3, status: "pending", createdAt: "2024-01-13T09:00:00Z" },
  { id: 4, title: "Meditation", description: "Meditate for 15 minutes", points: 25, userName: "Sarah Wilson", userId: 4, status: "completed", createdAt: "2024-01-12T07:00:00Z" },
  { id: 5, title: "Learn New Skill", description: "Spend 1 hour learning something new", points: 40, userName: "David Brown", userId: 5, status: "rejected", createdAt: "2024-01-11T14:00:00Z" }
]

export const dummyPendingTasks = [
  { 
    id: 6, 
    title: "Cook Healthy Meal", 
    description: "Prepare a nutritious home-cooked meal", 
    points: 35, 
    userName: "Alice Cooper", 
    userId: 6, 
    status: "pending", 
    submittedAt: "2024-01-16T12:00:00Z",
    proofText: "Made grilled chicken with vegetables and quinoa",
    proofImage: "https://via.placeholder.com/100x100?text=Food"
  },
  { 
    id: 7, 
    title: "Walk 10,000 Steps", 
    description: "Walk at least 10,000 steps in a day", 
    points: 30, 
    userName: "Bob Wilson", 
    userId: 7, 
    status: "pending", 
    submittedAt: "2024-01-16T15:30:00Z",
    proofText: "Completed 12,500 steps according to my fitness tracker",
    proofImage: "https://via.placeholder.com/100x100?text=Steps"
  },
  { 
    id: 8, 
    title: "Practice Guitar", 
    description: "Practice guitar for 45 minutes", 
    points: 25, 
    userName: "Carol Davis", 
    userId: 8, 
    status: "pending", 
    submittedAt: "2024-01-16T18:00:00Z",
    proofText: "Practiced scales and learned a new song",
    proofImage: "https://via.placeholder.com/100x100?text=Guitar"
  }
]
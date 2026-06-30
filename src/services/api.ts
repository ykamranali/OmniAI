import axios from "axios"

// Create a central Axios client
export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add interceptors if needed (e.g., for auth tokens)
apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token')
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`
  // }
  return config
})

// Real services calling our Next.js API Routes
export const api = {
  dashboard: {
    getStats: async () => {
      const res = await apiClient.get('/dashboard')
      return res.data
    }
  },
  chats: {
    getAll: async () => {
      const res = await apiClient.get('/chats')
      return res.data
    },
    getMessages: async (chatId: string) => {
      const res = await apiClient.get(`/chats/${chatId}/messages`)
      return res.data
    },
    sendMessage: async (chatId: string, content: string, role = "user") => {
      const res = await apiClient.post(`/chats/${chatId}/messages`, { content, role })
      return res.data
    },
    create: async (title: string, agentId?: string) => {
      const res = await apiClient.post('/chats', { title, agentId })
      return res.data
    }
  },
  agents: {
    getAll: async () => {
      const res = await apiClient.get('/agents')
      return res.data
    }
  },
  documents: {
    getAll: async () => {
      const res = await apiClient.get('/documents')
      return res.data
    },
    create: async (name: string, type: string, size: string) => {
      const res = await apiClient.post('/documents', { name, type, size })
      return res.data
    }
  },
  memory: {
    getAll: async () => {
      const res = await apiClient.get('/memory')
      return res.data
    },
    create: async (section: string, content: string) => {
      const res = await apiClient.post('/memory', { section, content })
      return res.data
    }
  }
}

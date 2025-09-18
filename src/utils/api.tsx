import { projectId, publicAnonKey } from './supabase/info'

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-11376ee3`

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }

  // Chat sessions
  async saveChatSession(userId: string, message: string, severity: 'low' | 'medium' | 'high') {
    return this.request('/chat/session', {
      method: 'POST',
      body: JSON.stringify({ userId, message, severity })
    })
  }

  // Bookings
  async createBooking(booking: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking)
    })
  }

  async getUserBookings(userId: string) {
    return this.request(`/bookings/${userId}`)
  }

  // Community posts
  async createPost(post: any) {
    return this.request('/community/posts', {
      method: 'POST',
      body: JSON.stringify(post)
    })
  }

  async getPosts() {
    return this.request('/community/posts')
  }

  // Admin analytics
  async getAnalytics() {
    return this.request('/admin/analytics')
  }

  // Wellness tracking
  async saveWellnessAssessment(userId: string, assessment: any) {
    return this.request('/wellness/assessment', {
      method: 'POST',
      body: JSON.stringify({ userId, ...assessment })
    })
  }

  async getWellnessData(userId: string) {
    return this.request(`/wellness/${userId}`)
  }
}

export const api = new ApiClient()

// Demo user ID for this prototype
export const DEMO_USER_ID = 'demo_user_123'
import { User, MoodEntry, ScreeningRecord, WellnessResource, ChatMessage } from '../types';

const API_BASE = '/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('mindcare_token');
  }

  public setToken(token: string | null) {
    if (token) {
      localStorage.setItem('mindcare_token', token);
    } else {
      localStorage.removeItem('mindcare_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Health
  async checkHealth(): Promise<{ status: string; sdg: string; geminiConfigured: boolean }> {
    return this.request('/health');
  }

  // Auth
  async register(data: {
    name: string;
    email: string;
    password: string;
    studentStatus?: string;
    institution?: string;
  }): Promise<{ message: string; user: User; token: string }> {
    const res = await this.request<{ message: string; user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async login(credentials: { email: string; password: string }): Promise<{ message: string; user: User; token: string }> {
    const res = await this.request<{ message: string; user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(res.token);
    return res;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  // Profile
  async getProfile(): Promise<{ profile: User }> {
    return this.request<{ profile: User }>('/profile');
  }

  async updateProfile(updates: Partial<User>): Promise<{ message: string; profile: User }> {
    return this.request<{ message: string; profile: User }>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteAccount(): Promise<{ message: string }> {
    const res = await this.request<{ message: string }>('/profile', {
      method: 'DELETE',
    });
    this.setToken(null);
    return res;
  }

  // Moods
  async getMoods(limit = 50): Promise<{
    moods: MoodEntry[];
    summary: { totalCheckins: number; avgMood: number; avgStress: number };
  }> {
    return this.request(`/moods?limit=${limit}`);
  }

  async createMood(data: {
    moodScore: number;
    moodLabel?: string;
    stressLevel: number;
    emotions: string[];
    stressors: string[];
    note?: string;
  }): Promise<{ message: string; mood: MoodEntry }> {
    return this.request('/moods', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteMood(id: string): Promise<{ message: string }> {
    return this.request(`/moods/${id}`, {
      method: 'DELETE',
    });
  }

  // Screening
  async submitScreening(data: {
    questionnaireType: string;
    answers: Array<{ questionId: string; questionText: string; score: number }>;
    isDisclaimerAcknowledged: boolean;
  }): Promise<{ message: string; record: ScreeningRecord }> {
    return this.request('/screening', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getScreeningHistory(): Promise<{ history: ScreeningRecord[] }> {
    return this.request('/screening/history');
  }

  // Resources
  async getResources(category?: string): Promise<{ resources: WellnessResource[] }> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request(`/resources${query}`);
  }

  // AI Chat
  async sendChatMessage(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<ChatMessage> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  }

  // Reset Demo
  async resetDemoData(): Promise<{ message: string }> {
    return this.request('/demo/reset', { method: 'POST' });
  }
}

export const api = new ApiService();

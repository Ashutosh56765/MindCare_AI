export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  studentStatus?: 'undergraduate' | 'graduate' | 'high_school' | 'other';
  institution?: string;
  createdAt: string;
  preferences: {
    anonymousMode: boolean;
    dailyReminder: boolean;
    dataRetentionDays: number;
    preferredName?: string;
  };
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodScore: 1 | 2 | 3 | 4 | 5; // 1: Very Low, 2: Low, 3: Okay/Neutral, 4: Good, 5: Great
  moodLabel: string;
  stressLevel: number; // 1 to 10
  emotions: string[];
  stressors: string[];
  note?: string;
  aiReflection?: string;
  timestamp: string;
}

export interface ScreeningAnswer {
  questionId: string;
  questionText: string;
  score: number; // 0: Not at all, 1: Several days, 2: More than half the days, 3: Nearly every day
}

export interface ScreeningRecord {
  id: string;
  userId: string;
  questionnaireType: 'PHQ-4' | 'GAD-2' | 'PHQ-2';
  answers: ScreeningAnswer[];
  totalScore: number;
  anxietyScore: number;
  depressionScore: number;
  severity: 'None/Minimal' | 'Mild' | 'Moderate' | 'Severe';
  explanation: string;
  recommendations: string[];
  isDisclaimerAcknowledged: boolean;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isCrisisWarning?: boolean;
}

export interface WellnessResource {
  id: string;
  title: string;
  category: 'Crisis Lines' | 'Student & Campus' | 'Therapy & Counseling' | 'Self-Care & Mindfulness' | 'Community & Peer';
  description: string;
  url: string;
  phone?: string;
  sms?: string;
  availableHours: string;
  country: string;
  tags: string[];
  verified: boolean;
}

export interface SelfCareActivity {
  id: string;
  title: string;
  category: 'Breathing' | 'Grounding' | 'Journaling' | 'Study Break' | 'Sleep';
  durationMinutes: number;
  description: string;
  instructions: string[];
}

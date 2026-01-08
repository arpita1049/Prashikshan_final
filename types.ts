
export enum UserRole {
  STUDENT = 'student',
  EMPLOYER = 'employer',
  COLLEGE = 'college',
  GUEST = 'guest'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  college?: string;
  major?: string;
  score?: number;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  stipend: string;
  duration: string;
  tags: string[];
  description: string;
  matchScore?: number;
}

export interface Application {
  id: string;
  internshipId: string;
  status: 'pending' | 'interviewing' | 'accepted' | 'rejected';
  appliedDate: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
}

export interface EvaluationResult {
  score: number;
  totalQuestions: number;
  domain: string;
  completedAt: Date;
}

export interface AITutorPlan {
  level: string;
  feedback: string;
  weakAreas: string[];
  assignments: {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }[];
  recommendedSkills: string[];
}

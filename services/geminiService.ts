
import { GoogleGenAI, Type } from "@google/genai";

// ==================== CONFIGURATION ====================
const MODEL_NAME = 'gemini-2.0-flash';
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 30000;

// Check if API key exists and is not a placeholder/empty
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
               (typeof process !== 'undefined' ? (process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY) : undefined);

const hasApiKey = !!apiKey && apiKey !== 'undefined' && apiKey !== '';

if (typeof window !== 'undefined') {
  if (!hasApiKey) {
    console.warn("⚠️ Gemini API Key missing - running in Demo Mode");
  } else {
    console.log(`✅ Gemini API Key detected (Length: ${apiKey?.length}, Prefix: ${apiKey?.substring(0, 4)}...)`);
  }
}

// ==================== AI CLIENT ====================
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!hasApiKey) return null;
  if (!aiInstance) {
    // Don't specify apiVersion - let SDK use the correct default for the model
    aiInstance = new GoogleGenAI({ 
      apiKey: apiKey || ''
    });
  }
  return aiInstance;
};

// ==================== UTILITIES ====================

// Helper to safely extract JSON from markdown code blocks
const cleanJSON = (text: string) => {
  try {
    // Remove markdown code blocks and extra whitespace
    let cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();
    
    // Try to find JSON object/array in the response
    const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]}]/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("⚠️ JSON Parse warning:", e);
    return null;
  }
};

// Exponential backoff delay calculator
const getRetryDelay = (attempt: number): number => {
  const delay = BASE_DELAY_MS * Math.pow(2, attempt);
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 500;
  return delay + jitter;
};

// Sleep utility
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Timeout wrapper for promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), timeoutMs)
    )
  ]);
};

// ==================== ERROR HANDLING ====================
type APIErrorType = 'QUOTA_EXCEEDED' | 'INVALID_KEY' | 'NETWORK_ERROR' | 'TIMEOUT' | 'RATE_LIMITED' | 'UNKNOWN';

interface APIError {
  type: APIErrorType;
  message: string;
  retryable: boolean;
}

const parseError = (error: any): APIError => {
  const errorStr = error?.toString() || '';
  const message = error?.message || errorStr;
  
  if (errorStr.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
    return { 
      type: 'QUOTA_EXCEEDED', 
      message: '⏳ API quota exceeded. Please wait a few minutes or try again later.',
      retryable: false 
    };
  }
  if (errorStr.includes('401') || errorStr.includes('403') || message.includes('API key')) {
    return { 
      type: 'INVALID_KEY', 
      message: '🔑 Invalid API key. Please check your configuration.',
      retryable: false 
    };
  }
  if (errorStr.includes('404') || message.includes('Not Found')) {
    return { 
      type: 'INVALID_KEY', 
      message: '🔍 Model not found. The API may be temporarily unavailable.',
      retryable: true 
    };
  }
  if (message.includes('REQUEST_TIMEOUT')) {
    return { 
      type: 'TIMEOUT', 
      message: '⏰ Request timed out. Please try again.',
      retryable: true 
    };
  }
  if (errorStr.includes('fetch') || errorStr.includes('network') || errorStr.includes('ENOTFOUND')) {
    return { 
      type: 'NETWORK_ERROR', 
      message: '🌐 Network error. Please check your connection.',
      retryable: true 
    };
  }
  if (errorStr.includes('500') || errorStr.includes('503')) {
    return { 
      type: 'RATE_LIMITED', 
      message: '🔄 Server temporarily unavailable. Retrying...',
      retryable: true 
    };
  }
  
  return { 
    type: 'UNKNOWN', 
    message: '❌ An unexpected error occurred.',
    retryable: true 
  };
};

// ==================== RETRY LOGIC ====================
type SuccessResult<T> = { success: true; data: T };
type FailureResult = { success: false; error: APIError };
type Result<T> = SuccessResult<T> | FailureResult;

// Type guard for failed results
const isFailure = <T>(result: Result<T>): result is FailureResult => !result.success;

async function callWithRetry<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<Result<T>> {
  let lastError: APIError | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await withTimeout(operation(), REQUEST_TIMEOUT_MS);
      return { success: true, data: result };
    } catch (error: any) {
      lastError = parseError(error);
      console.warn(`⚠️ ${operationName} attempt ${attempt + 1}/${MAX_RETRIES} failed:`, lastError.message);
      
      if (!lastError.retryable) {
        break;
      }
      
      if (attempt < MAX_RETRIES - 1) {
        const delay = getRetryDelay(attempt);
        console.log(`🔄 Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
      }
    }
  }
  
  return { success: false, error: lastError! };
}

// ==================== CACHE ====================
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes (extended for reliability)

const getCached = (key: string) => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    console.log("📦 Using cached response");
    return entry.data;
  }
  return null;
};

const setCache = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
  // Cleanup old entries periodically
  if (cache.size > 50) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now - v.timestamp > CACHE_TTL) {
        cache.delete(k);
      }
    }
  }
};

// --- MOCK DATA GENERATORS (For Demo/Fallback Mode) ---
const getMockResumeAnalysis = () => ({
  score: 82,
  strengths: [
    "Strong action verbs used throughout experience section",
    "Clear quantification of achievements (e.g., 'increased efficiency by 20%')",
    "Skills section is well-categorized and relevant"
  ],
  improvements: [
    "Add a brief professional summary at the top",
    "Ensure consistent date formatting across all entries",
    "Include links to GitHub or portfolio projects"
  ]
});

const getMockInterviewFeedback = (question: string) => ({
  feedback: "Great start! You structured your answer using the STAR method which is excellent. However, try to focus more on the 'Result' aspect. Quantify the impact of your actions where possible.",
  betterAnswer: "In my previous role, I encountered a conflict where two team members disagreed on the API architecture. I facilitated a meeting to list pros and cons of each approach. We realized a hybrid solution was best. This decision reduced our technical debt by 15% and accelerated delivery by 2 weeks.",
  rating: 8.5
});

const getMockTutorPlan = (score: number, domain: string) => ({
  level: score > 3 ? "Intermediate" : "Beginner",
  feedback: `You have a solid grasp of ${domain} fundamentals, but could improve on advanced concepts.`,
  weakAreas: ["State Management Patterns", "Performance Optimization"],
  assignments: [
    {
      title: "Refactor Context API",
      description: "Take a prop-drilled component tree and refactor it to use React Context efficiently.",
      difficulty: "Medium"
    },
    {
      title: "Implement Memoization",
      description: "Use React.memo and useMemo to optimize a heavy rendering list.",
      difficulty: "Hard"
    },
    {
      title: "Custom Hooks 101",
      description: "Create a custom hook useFetch that handles loading, error, and data states.",
      difficulty: "Easy"
    }
  ],
  recommendedSkills: ["Redux Toolkit", "Next.js", "Jest Testing"]
});

export const geminiService = {
  // Get the current API status for UI display
  getStatus(): { hasKey: boolean; isReady: boolean } {
    return { hasKey: hasApiKey, isReady: hasApiKey };
  },

  async getChatbotResponse(userMessage: string, userData: any): Promise<string> {
    // Demo mode fallback
    if (!hasApiKey) {
      await sleep(500);
      return "👋 I'm running in Demo Mode (no API Key). Add your Gemini API key to .env to enable AI features!";
    }

    const ai = getAI();
    if (!ai) return "⚠️ AI Service Unavailable. Please check your configuration.";

    const systemPrompt = `You are "Prashikshan Assistant", a friendly and helpful AI career coach.
    Current User Profile: ${JSON.stringify(userData)}.
    Keep responses concise, helpful, and encouraging. Use emojis sparingly for warmth.`;

    const result = await callWithRetry(
      async () => {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `${systemPrompt}\n\nUser Message: ${userMessage}`
        });
        return response.text || "";
      },
      'Chatbot'
    );

    if (result.success && result.data) {
      return result.data;
    }

    // Return user-friendly error message
    if (isFailure(result)) {
      return result.error?.message || "I'm having trouble right now. Please try again in a moment.";
    }
    return "I'm having trouble right now. Please try again in a moment.";
  },

  async analyzeResume(resumeText: string) {
    // Check cache first
    const cacheKey = `resume:${resumeText.slice(0, 100)}`;
    const cached = getCached(cacheKey);
    if (cached) return { ...cached, fromCache: true };

    // Demo mode
    if (!hasApiKey) {
      await sleep(800);
      const mock = getMockResumeAnalysis();
      return { ...mock, isDemo: true };
    }

    const ai = getAI();
    if (!ai) return getMockResumeAnalysis();

    const result = await callWithRetry(
      async () => {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Analyze this resume and provide constructive feedback.

Return a JSON object with:
- score: number (0-100, overall resume quality)
- strengths: array of 3 specific strengths
- improvements: array of 3 specific areas to improve

Resume text (first 2000 chars):
${resumeText.slice(0, 2000)}`
        });
        return cleanJSON(response.text || '');
      },
      'ResumeAnalysis'
    );

    if (result.success && result.data) {
      setCache(cacheKey, result.data);
      return result.data;
    }

    // Graceful fallback to mock data
    console.log("📊 Using fallback resume analysis due to API issues");
    const fallback = getMockResumeAnalysis();
    const errorMsg = isFailure(result) ? result.error?.message : undefined;
    return { ...fallback, isFallback: true, errorMessage: errorMsg };
  },

  async getInterviewFeedback(question: string, answer: string) {
    // Check cache
    const cacheKey = `interview:${question.slice(0, 50)}:${answer.slice(0, 50)}`;
    const cached = getCached(cacheKey);
    if (cached) return { ...cached, fromCache: true };

    // Demo mode
    if (!hasApiKey) {
      await sleep(1000);
      const mock = getMockInterviewFeedback(question);
      return { ...mock, isDemo: true };
    }

    const ai = getAI();
    if (!ai) return getMockInterviewFeedback(question);

    const result = await callWithRetry(
      async () => {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `You are an interview coach. Evaluate this practice interview response.

Question: ${question}
User's Answer: ${answer}

Provide constructive feedback. Return a JSON object with:
- feedback: string (constructive evaluation, what was good, what could improve)
- betterAnswer: string (an example of a stronger response)
- rating: number (1-10 score)`
        });
        return cleanJSON(response.text || '');
      },
      'InterviewFeedback'
    );

    if (result.success && result.data) {
      setCache(cacheKey, result.data);
      return result.data;
    }

    // Graceful fallback
    console.log("🎤 Using fallback interview feedback due to API issues");
    const fallback = getMockInterviewFeedback(question);
    const errorMsg = isFailure(result) ? result.error?.message : undefined;
    return { ...fallback, isFallback: true, errorMessage: errorMsg };
  },

  async generateTutorPlan(score: number, total: number, domain: string) {
    // Check cache
    const cacheKey = `tutor:${domain}:${score}/${total}`;
    const cached = getCached(cacheKey);
    if (cached) return { ...cached, fromCache: true };

    // Demo mode
    if (!hasApiKey) {
      await sleep(1000);
      const mock = getMockTutorPlan(score, domain);
      return { ...mock, isDemo: true };
    }

    const ai = getAI();
    if (!ai) return getMockTutorPlan(score, domain);

    const percentage = Math.round((score / total) * 100);

    const result = await callWithRetry(
      async () => {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `You are a learning coach. A student scored ${score}/${total} (${percentage}%) in ${domain}.

Create a personalized learning plan. Return a JSON object with:
- level: string ("Beginner", "Intermediate", or "Advanced")
- feedback: string (personalized encouragement and assessment)
- weakAreas: array of 2-3 topic strings they should focus on
- assignments: array of 3 objects with {title, description, difficulty}
- recommendedSkills: array of 3 related skills to learn next`
        });
        return cleanJSON(response.text || '');
      },
      'TutorPlan'
    );

    if (result.success && result.data) {
      setCache(cacheKey, result.data);
      return result.data;
    }

    // Graceful fallback
    console.log("📚 Using fallback tutor plan due to API issues");
    const fallback = getMockTutorPlan(score, domain);
    const errorMsg = isFailure(result) ? result.error?.message : undefined;
    return { ...fallback, isFallback: true, errorMessage: errorMsg };
  }
};


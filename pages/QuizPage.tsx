
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, BrainCircuit, Loader2 } from 'lucide-react';
import { QuizQuestion, EvaluationResult } from '../types';
import { firebaseService } from '../services/firebase';

// Mock Questions - In a real app, generate these via AI based on selected domain
const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the primary function of React's 'useEffect' hook?",
    options: [
      "To manage global state",
      "To handle side effects in functional components",
      "To create a new DOM element",
      "To speed up rendering performance"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which CSS property is used to change the text color of an element?",
    options: [
      "font-color",
      "text-style",
      "color",
      "background-color"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "In JavaScript, what is the output of '2' + 2?",
    options: [
      "4",
      "22",
      "NaN",
      "TypeError"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Which HTTP method is typically used to update an existing resource?",
    options: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What does semantic HTML help with?",
    options: [
      "Making the site load faster",
      "Accessibility and SEO",
      "Adding animations",
      "Database connection"
    ],
    correctAnswer: 1
  }
];

interface QuizPageProps {
  onComplete: (result: EvaluationResult) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate Score
      let score = 0;
      newAnswers.forEach((ans, idx) => {
        if (ans === MOCK_QUESTIONS[idx].correctAnswer) score++;
      });

      const result: EvaluationResult = {
        score,
        totalQuestions: MOCK_QUESTIONS.length,
        domain: "Frontend Development",
        completedAt: new Date()
      };

      setIsSaving(true);
      const currentUser = firebaseService.getCurrentUser();
      
      if (currentUser) {
        try {
          await firebaseService.saveEvaluationResult(currentUser.uid, result);
        } catch (e) {
          console.error("Failed to save quiz result", e);
        }
      }
      
      onComplete(result);
      setIsSaving(false);
      navigate('/ai-tutor');
    }
  };

  const progress = ((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold dark:text-white mb-2">Skill Evaluation</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Let's assess your current level to personalize your learning path.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-all duration-300">
          <span className="absolute top-6 right-6 text-xs font-bold text-slate-400 tracking-widest uppercase">
            Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}
          </span>

          <h2 className="text-xl font-bold dark:text-white mb-8 mt-2 leading-relaxed">
            {MOCK_QUESTIONS[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {MOCK_QUESTIONS[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-200 text-left group ${
                  selectedOption === index 
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 bg-white dark:bg-slate-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  selectedOption === index
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-slate-300 dark:border-slate-600 text-transparent group-hover:border-indigo-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full bg-current transform transition-transform ${selectedOption === index ? 'scale-100' : 'scale-0'}`} />
                </div>
                <span className={`font-medium ${selectedOption === index ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleNext}
              disabled={selectedOption === null || isSaving}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
              {currentQuestion === MOCK_QUESTIONS.length - 1 ? 'Finish & Evaluate' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

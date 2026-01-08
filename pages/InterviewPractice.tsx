
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Mic, 
  Video, 
  RotateCcw, 
  Send,
  Sparkles,
  Award,
  BookOpen,
  Keyboard,
  StopCircle
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useToast } from '../components/Toast';
import { motion } from 'framer-motion';

const QUESTIONS = [
  "Tell me about a challenging project you've worked on.",
  "What is your greatest technical strength?",
  "How do you handle conflict in a team setting?",
  "Where do you see yourself in 5 years?",
  "Explain a complex concept to a non-technical person."
];

const InterviewPractice: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    // Simulate thinking delay for realism
    const result = await geminiService.getInterviewFeedback(QUESTIONS[currentQuestionIndex], answer);
    setFeedback(result);
    setIsSubmitting(false);
    addToast("Feedback generated successfully", "success");
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % QUESTIONS.length);
    setAnswer('');
    setFeedback(null);
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      addToast("Recording stopped. Analyzing...", "info");
      // Simulate speech-to-text
      setAnswer("I believe my greatest strength is my ability to break down complex problems into smaller, manageable components. For instance, in my last project...");
    } else {
      setIsRecording(true);
      setAnswer('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 dark:text-white">Interview Simulator</h1>
          <p className="text-slate-500 dark:text-slate-400">Refine your answers with real-time AI feedback.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-xl font-bold text-sm border border-indigo-100 dark:border-indigo-500/20">
          Session #14
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interaction Panel */}
        <div className="space-y-6">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg min-h-[500px] flex flex-col relative overflow-hidden transition-all duration-300">
            {/* Question Header */}
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></span>
              Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-8 dark:text-white leading-tight">"{QUESTIONS[currentQuestionIndex]}"</h2>
            
            {/* Input Mode Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit mb-6">
              <button 
                onClick={() => { setInputMode('text'); setIsRecording(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'text' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <Keyboard className="w-4 h-4" /> Text
              </button>
              <button 
                onClick={() => setInputMode('voice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'voice' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <Mic className="w-4 h-4" /> Voice
              </button>
            </div>

            {/* Input Area */}
            <div className="flex-1 relative">
              {inputMode === 'text' ? (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your structured response here..."
                  className="w-full h-full min-h-[200px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-700 dark:text-slate-200 resize-none font-medium leading-relaxed transition-all"
                />
              ) : (
                <div className="w-full h-full min-h-[200px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-slate-200 dark:border-slate-700">
                  {isRecording ? (
                    <>
                      <div className="flex items-center gap-1.5 h-12">
                        {[...Array(5)].map((_, i) => (
                           <motion.div 
                             key={i}
                             animate={{ height: [20, 40, 20] }}
                             transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                             className="w-1.5 bg-rose-500 rounded-full"
                           />
                        ))}
                      </div>
                      <p className="text-rose-500 font-bold animate-pulse">Recording... Click stop when done.</p>
                      <button 
                        onClick={toggleRecording}
                        className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 transition-all hover:scale-105"
                      >
                        <StopCircle className="w-8 h-8" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Mic className="w-8 h-8" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-center">
                        {answer ? "Recording captured. Ready to submit." : "Click to start recording your answer"}
                      </p>
                      <button 
                        onClick={toggleRecording}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
                      >
                        Start Recording
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button 
                onClick={handleSubmit}
                disabled={!answer.trim() || isSubmitting || isRecording}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                Submit Answer
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Panel */}
        <div className="space-y-6">
           {isSubmitting ? (
             <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
               <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/3 animate-pulse"></div>
               <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full animate-pulse"></div>
               <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl w-full animate-pulse"></div>
             </div>
           ) : feedback ? (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6"
             >
               <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
                 <div className="flex items-center justify-between mb-4">
                   <h4 className="font-bold flex items-center gap-2"><Award className="w-5 h-5" /> Performance Rating</h4>
                   <div className="px-4 py-1 bg-white/20 rounded-full font-black text-2xl backdrop-blur-sm border border-white/20">
                     {feedback.rating}/10
                   </div>
                 </div>
                 <p className="text-indigo-100 text-sm leading-relaxed border-t border-white/10 pt-4 mt-4">
                   {feedback.feedback}
                 </p>
               </div>

               <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                 <div className="absolute -left-1 top-8 bottom-8 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-r-full"></div>
                 <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                   <Sparkles className="w-5 h-5 text-emerald-500" /> Perfected Answer
                 </h4>
                 <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                   {feedback.betterAnswer}
                 </div>
                 <button 
                   onClick={handleNext}
                   className="mt-6 w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                 >
                   Try Next Question <RotateCcw className="w-4 h-4" />
                 </button>
               </div>
             </motion.div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h4 className="font-bold mb-2 text-slate-900 dark:text-white text-lg">AI Feedback Awaiting</h4>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  Submit your answer to receive detailed feedback, rating, and an improved response from our AI coach.
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPractice;

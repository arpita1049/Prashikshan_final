
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  FileCheck,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { firebaseService } from '../services/firebase';
import { useToast } from '../components/Toast';

const ResumeBuilder: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { addToast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeResume(resumeText);
      if (result) {
        setAnalysis(result);
        addToast("Resume analysis completed successfully!", "success");
        
        // Auto-save to history
        const user = firebaseService.getCurrentUser();
        if (user) {
          firebaseService.saveResumeAnalysis(user.uid, resumeText, result)
            .then(() => addToast("Analysis saved to history.", "info"))
            .catch(err => console.error("Save failed", err));
        }
      } else {
        addToast("Failed to analyze resume. Please try again.", "error");
      }
    } catch (error: any) {
      if (error.message === 'QUOTA_EXCEEDED') {
        addToast("⚠️ AI Quota Exceeded: You have reached the usage limit for the Free Tier. Please wait 24 hours before trying again.", "error");
      } else {
        addToast("An unexpected error occurred. Please check console.", "error");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold mb-2 dark:text-white">AI Resume Architect</h1>
        <p className="text-slate-500 dark:text-slate-400">Paste your resume content to get instant optimization feedback.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here (Skills, Experience, Education...)"
              className="w-full h-[500px] resize-none bg-transparent focus:outline-none dark:text-slate-200 leading-relaxed scrollbar-hide"
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {isAnalyzing ? 'Analyzing with AI...' : 'Analyze My Resume'}
          </button>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-5 space-y-6">
          {analysis ? (
            <div className="space-y-6 sticky top-24">
              {/* Score Card */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Resume Score</p>
                <div className={`text-6xl font-black mb-2 ${analysis.score > 80 ? 'text-emerald-500' : analysis.score > 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {analysis.score}
                </div>
                <p className="text-xs text-slate-400">Based on industry standards</p>
              </div>

              {/* Strengths */}
              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                <h4 className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 mb-4">
                  <CheckCircle className="w-5 h-5" /> Strengths
                </h4>
                <ul className="space-y-3">
                  {analysis.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                <h4 className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 mb-4">
                  <Lightbulb className="w-5 h-5" /> AI Suggestions
                </h4>
                <ul className="space-y-3">
                  {analysis.improvements.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
               <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                 <FileCheck className="w-8 h-8 text-slate-400" />
               </div>
               <h4 className="font-bold mb-2">Analysis Awaiting</h4>
               <p className="text-sm text-slate-500">Submit your resume content on the left to see AI-powered suggestions here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

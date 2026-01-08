
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Layers, 
  ArrowRight, 
  Sparkles,
  Briefcase
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { EvaluationResult, AITutorPlan } from '../types';

interface AITutorPageProps {
  evaluation: EvaluationResult | null;
}

const AITutorPage: React.FC<AITutorPageProps> = ({ evaluation }) => {
  const [plan, setPlan] = useState<AITutorPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (evaluation) {
        setLoading(true);
        const result = await geminiService.generateTutorPlan(
          evaluation.score, 
          evaluation.totalQuestions, 
          evaluation.domain
        );
        setPlan(result);
        setLoading(false);
      }
    };

    fetchPlan();
  }, [evaluation]);

  if (!evaluation) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold dark:text-white">No Evaluation Found</h2>
        <Link to="/quiz" className="text-indigo-600 hover:underline">Take the Quiz first</Link>
      </div>
    );
  }

  const percentage = Math.round((evaluation.score / evaluation.totalQuestions) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <BrainCircuit className="w-6 h-6" />
            <span className="font-bold tracking-wider uppercase text-sm">AI Evaluation Complete</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">You scored {percentage}%</h1>
          <p className="text-indigo-100 max-w-xl text-lg">
            {plan?.feedback || "Analyzing your performance to generate a personalized roadmap..."}
          </p>
        </div>
        <div className="flex-shrink-0 bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center border border-white/30">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Current Level</p>
          <p className="text-2xl font-black">{plan?.level || "..."}</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-bold dark:text-white">Generating your personalized curriculum...</h3>
          <p className="text-slate-500">Our AI tutor is crafting assignments just for you.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Focus Areas */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Areas for Improvement
              </h3>
              <ul className="space-y-4">
                {plan?.weakAreas?.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                    <span className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
                <Layers className="w-5 h-5 text-emerald-500" /> Recommended Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {plan?.recommendedSkills?.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 dark:text-white">
              <Code className="w-6 h-6 text-indigo-600" /> AI-Generated Assignments
            </h3>
            <div className="grid gap-4">
              {plan?.assignments?.map((task, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold dark:text-white group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      task.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                      task.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {task.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{task.description}</p>
                  <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
                    Start Assignment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action for Internships */}
          <div className="bg-slate-900 dark:bg-white rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-bold text-white dark:text-slate-900 mb-2">Ready to apply your skills?</h3>
               <p className="text-slate-300 dark:text-slate-600 mb-8 max-w-xl mx-auto">
                 Based on your evaluation, we've filtered relevant internships that match your current skill level.
               </p>
               <Link 
                 to="/internships"
                 className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/50"
               >
                 View Recommended Internships <Briefcase className="w-5 h-5" />
               </Link>
             </div>
             {/* Background glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/30 blur-[100px] rounded-full"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default AITutorPage;

import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Calendar, 
  Target,
  Clock,
  Briefcase,
  ChevronRight,
  BrainCircuit,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { MOCK_INTERNSHIPS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import DecryptedText from '../components/DecryptedText';
import { motion, Variants } from 'framer-motion';

interface StudentDashboardProps {
  hasAssessment?: boolean;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ hasAssessment = false }) => {
  const [textIndex, setTextIndex] = useState(0);
  const rotatingTexts = useMemo(() => [
    "Internship Decrypted",
    "Skills Verified",
    "Career Launched", 
    "Future Secured"
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [rotatingTexts]);

  const employabilityData = useMemo(() => [
    { name: 'Completed', value: 78 },
    { name: 'Remaining', value: 22 }
  ], []);

  const skillsData = useMemo(() => [
    { name: 'Frontend', score: 85 },
    { name: 'Backend', score: 60 },
    { name: 'UI/UX', score: 90 },
    { name: 'DevOps', score: 45 },
  ], []);

  // Stagger animation variants
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Welcome back! 👋</h1>
          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
            <DecryptedText
              key={textIndex}
              text={rotatingTexts[textIndex]}
              animateOn="view"
              speed={80}
              maxIterations={15}
              className="text-indigo-600 dark:text-indigo-400 font-bold"
              encryptedClassName="text-indigo-300 dark:text-indigo-700 font-bold"
            />
            <span className="opacity-60">— here's your career progress.</span>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="px-5 py-2.5 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Open to Work</span>
          </div>
        </div>
      </header>

      {/* CTA for missing assessment */}
      {!hasAssessment && (
        <motion.div variants={itemVars} className="relative overflow-hidden rounded-[32px] bg-indigo-600 shadow-2xl shadow-indigo-900/20">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                <BrainCircuit className="w-3 h-3" /> AI Analysis
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Unlock your complete potential.</h2>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Take our 5-minute AI-powered assessment to generate your Employability Score and unlock personalized internship matches.
              </p>
            </div>
            <Link 
              to="/quiz" 
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Start Assessment <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employability Score */}
        <motion.div variants={itemVars} className="lg:col-span-1 glass-card p-8 rounded-3xl flex flex-col items-center justify-between min-h-[400px]">
          <div className="w-full flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Readiness Score</h3>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <div className="relative w-56 h-56">
             {hasAssessment ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={employabilityData}
                     innerRadius={70}
                     outerRadius={90}
                     cornerRadius={10}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                   >
                     {employabilityData.map((entry, index) => (
                       <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? '#6366f1' : 'rgba(148, 163, 184, 0.2)'} 
                          className="dark:stroke-transparent"
                        />
                     ))}
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="w-full h-full rounded-full border-[10px] border-slate-100 dark:border-white/5 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-[10px] border-dashed border-slate-200 dark:border-white/10 rounded-full animate-spin-slow"></div>
                  <span className="text-4xl font-black text-slate-300 dark:text-slate-700">?</span>
               </div>
             )}
             
             {hasAssessment && (
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">78%</span>
                 <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2">Top 5%</span>
               </div>
             )}
          </div>
          
          <div className="w-full text-center space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-4">
              {hasAssessment 
                ? "Excellent progress! You're in the top percentile for your cohort."
                : "Complete tasks to visualize your industry readiness."
              }
            </p>
            <Link to={hasAssessment ? "/analytics" : "/quiz"} className="block w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all duration-300">
              {hasAssessment ? "View Detailed Analysis" : "Calculate Score"}
            </Link>
          </div>
        </motion.div>

        {/* Skill Matrix */}
        <motion.div variants={itemVars} className="lg:col-span-2 glass-card p-8 rounded-3xl flex flex-col">
           <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skill Proficiency</h3>
             <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
               <button className="px-4 py-1.5 bg-white dark:bg-white/10 shadow-sm rounded-lg text-xs font-bold text-slate-900 dark:text-white">Technical</button>
               <button className="px-4 py-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold hover:text-slate-900 dark:hover:text-white transition-colors">Soft Skills</button>
             </div>
           </div>
           
           <div className="flex-1 w-full relative min-h-[250px]">
             {hasAssessment ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={skillsData} barSize={40}>
                   <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                      dy={10}
                   />
                   <YAxis hide />
                   <Tooltip 
                      cursor={{fill: 'rgba(99, 102, 241, 0.1)', radius: 8}}
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                   />
                   <Bar dataKey="score" radius={[8, 8, 8, 8]}>
                      {skillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#6366f1' : '#cbd5e1'} className="dark:opacity-80 hover:opacity-100 transition-opacity" />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-[#0B1121]/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
                  <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-full mb-3">
                    <BrainCircuit className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No skill data available yet</p>
                </div>
             )}
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Internships */}
        <motion.div variants={itemVars} className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" /> Recommended For You
            </h2>
            <Link to="/internships" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {MOCK_INTERNSHIPS.slice(0, 3).map((internship, idx) => (
              <div key={internship.id} className="group relative p-6 glass-card rounded-2xl hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 group-hover:via-indigo-500/5 transition-all duration-500"></div>
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 border border-indigo-100 dark:border-indigo-500/20">
                      {internship.company[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{internship.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <span>{internship.company}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        <span>{internship.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-lg border border-emerald-500/20">
                    {internship.matchScore}% Match
                  </div>
                </div>
                <div className="relative z-10 mt-4 flex gap-2">
                   {internship.tags.slice(0,2).map(tag => (
                     <span key={tag} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-white/5">
                       {tag}
                     </span>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={itemVars} className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white px-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" /> Upcoming Schedule
          </h2>
          <div className="glass-card p-8 rounded-3xl min-h-[300px] flex flex-col justify-center">
            <div className="space-y-8 relative">
              {/* Timeline Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-white/10"></div>
              
              <EventItem 
                time="04:30 PM"
                title="Mock Interview"
                tag="System Design"
                isActive={true}
              />
              <EventItem 
                time="Tomorrow"
                title="Career Workshop"
                tag="Personal Branding"
              />
              <EventItem 
                time="12 Oct"
                title="Technical Round"
                tag="TechFlow Solutions"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const EventItem = ({ time, title, tag, isActive = false }: { time: string, title: string, tag: string, isActive?: boolean }) => (
  <div className="relative flex gap-6 group">
    <div className={`
      relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 
      ${isActive 
        ? 'bg-indigo-600 border-indigo-100 dark:border-indigo-900 shadow-lg shadow-indigo-500/40' 
        : 'bg-white dark:bg-[#0f172a] border-slate-100 dark:border-white/10 group-hover:border-indigo-500/50'
      } transition-colors duration-300
    `}>
      <Clock className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
    </div>
    <div className="flex-1 pt-1">
      <div className="flex justify-between items-start mb-1">
        <h4 className={`font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'} group-hover:text-indigo-500 transition-colors`}>{title}</h4>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">{time}</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{tag}</p>
    </div>
  </div>
);

export default StudentDashboard;
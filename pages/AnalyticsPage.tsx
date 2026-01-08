
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Award, CalendarCheck, Zap } from 'lucide-react';

const data = [
  { name: 'Week 1', score: 65, applications: 2 },
  { name: 'Week 2', score: 68, applications: 3 },
  { name: 'Week 3', score: 72, applications: 1 },
  { name: 'Week 4', score: 78, applications: 5 },
  { name: 'Week 5', score: 82, applications: 4 },
  { name: 'Week 6', score: 85, applications: 6 },
];

const skillData = [
  { name: 'React', level: 85 },
  { name: 'Node.js', level: 65 },
  { name: 'Python', level: 75 },
  { name: 'Design', level: 90 },
  { name: 'AWS', level: 40 },
];

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Performance Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your career preparation progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<TrendingUp />} label="Employability" value="85%" trend="+12%" color="bg-indigo-500" />
        <StatCard icon={<Award />} label="Skill Badges" value="12" trend="+3" color="bg-emerald-500" />
        <StatCard icon={<CalendarCheck />} label="Interview Prep" value="14 hrs" trend="+2.5 hrs" color="bg-amber-500" />
        <StatCard icon={<Zap />} label="Active Streak" value="8 Days" trend="Keep it up!" color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Employability Growth</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" opacity={0.3} />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Gap Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Skill Analysis</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} width={60} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="level" radius={[0, 4, 4, 0]} barSize={32}>
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.level > 80 ? '#10b981' : entry.level > 60 ? '#6366f1' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:translate-y-[-2px] transition-transform">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.replace('bg-', '')} dark:text-white dark:bg-opacity-20`}>
        {React.cloneElement(icon, { className: `w-6 h-6 ${color.includes('white') ? 'text-slate-900' : ''}` })}
      </div>
      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">{trend}</span>
    </div>
    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{value}</h3>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

export default AnalyticsPage;

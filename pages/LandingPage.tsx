
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Globe, Star, Shield, ArrowUpRight, PlayCircle, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1121] text-slate-900 dark:text-white overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 h-20 bg-white/50 dark:bg-[#0B1121]/50 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/5">
        <div className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
          Prashikshan
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-indigo-500 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-indigo-500 transition-colors">Stories</a>
          <a href="#pricing" className="hover:text-indigo-500 transition-colors">For Enterprise</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="hidden md:block text-sm font-semibold hover:text-indigo-500 transition-colors">Sign In</Link>
          <Link to="/auth" className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 container mx-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI-Powered Career Architect
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              Bridge the gap between <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Potential & Career.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg"
            >
              The intelligent ecosystem connecting ambitious students, top-tier colleges, and global employers through AI-verified assessments.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/auth" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-base shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all hover:-translate-y-1 flex items-center gap-2">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-2xl font-bold text-base backdrop-blur-sm transition-all flex items-center gap-2">
                <PlayCircle className="w-5 h-5" /> Watch Demo
              </button>
            </motion.div>

            <div className="pt-8 flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-500">
               <div className="flex items-center gap-2">
                 <Shield className="w-4 h-4 text-emerald-500" /> Verified Internships
               </div>
               <div className="flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-500" /> AI Resume Review
               </div>
            </div>
          </div>

          {/* Abstract UI Representation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
               {/* Floating Cards */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                 className="absolute top-10 right-0 z-20 bg-white/10 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 p-6 rounded-3xl w-64 shadow-2xl"
               >
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                     <Shield className="w-5 h-5" />
                   </div>
                   <div>
                     <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                     <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded opacity-60"></div>
                   </div>
                 </div>
                 <div className="h-20 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-xl border border-emerald-500/20"></div>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 20, 0] }}
                 transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-20 left-0 z-20 bg-white/10 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 p-6 rounded-3xl w-72 shadow-2xl"
               >
                 <div className="flex justify-between items-center mb-6">
                    <div className="h-3 w-24 bg-indigo-500 rounded-full"></div>
                    <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                 </div>
                 <div className="space-y-3">
                   <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                   <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-full opacity-70"></div>
                   <div className="h-2 w-4/6 bg-slate-200 dark:bg-slate-700 rounded-full opacity-50"></div>
                 </div>
               </motion.div>

               {/* Main Center Piece */}
               <div className="absolute inset-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[40px] rotate-3 opacity-20 blur-2xl"></div>
               <div className="absolute inset-8 bg-slate-900 rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
                  {/* Mock UI Header */}
                  <div className="h-16 border-b border-slate-800 flex items-center px-6 gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <div className="h-8 w-48 bg-white/10 rounded-lg mb-2"></div>
                        <div className="h-4 w-32 bg-white/5 rounded-lg"></div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                        <Zap className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-white/5 rounded-2xl border border-white/5"></div>
                      <div className="h-32 bg-white/5 rounded-2xl border border-white/5"></div>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-white dark:bg-[#0f172a] relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">Everything you need to <span className="text-indigo-500">excel</span>.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Prashikshan provides a 360-degree ecosystem for your career development.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <BentoCard 
              icon={<Layers className="w-6 h-6 text-indigo-400" />}
              title="Skill Matrix Analysis"
              description="Our AI breaks down your skillset into granular data points, identifying gaps and strengths instantly."
              delay={0}
            />
            <BentoCard 
              icon={<Globe className="w-6 h-6 text-violet-400" />}
              title="Global Opportunities"
              description="Connect with employers worldwide who are looking for exactly what you bring to the table."
              delay={0.1}
            />
            <BentoCard 
              icon={<Star className="w-6 h-6 text-amber-400" />}
              title="Smart Certifications"
              description="Earn badges that actually matter. Validated by industry experts and blockchain technology."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-[40px] overflow-hidden bg-indigo-600 px-6 py-20 text-center">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full blur-[100px] opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to launch your career?</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of students and top companies building the future workforce together.</p>
              <Link to="/auth" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-1">
                Get Started for Free <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0B1121]">
        <div className="container mx-auto px-6 text-center text-slate-500 dark:text-slate-400">
           <p>© 2024 Prashikshan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const BentoCard = ({ icon, title, description, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer"
  >
    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default LandingPage;

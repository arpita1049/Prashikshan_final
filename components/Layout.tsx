
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut, ChevronRight } from 'lucide-react';
import { UserRole } from '../types';
import { NAV_ITEMS } from '../constants';
import Chatbot from './Chatbot';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, userName, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize theme from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark if unknown
  });

  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen flex bg-transparent transition-colors duration-500">
      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 
        bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-xl 
        border-r border-slate-200 dark:border-white/5
        transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3">
            <img src="/logo.png" alt="Prashikshan" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Prashikshan
            </span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className="relative group block"
                >
                  <div className={`
                    relative z-10 flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                    ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}
                  `}>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-indigo-600 dark:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="relative z-10 font-medium tracking-wide text-sm">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 absolute right-4 z-10 opacity-50" />}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-200 dark:border-white/5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 mb-4 group cursor-pointer transition-colors hover:border-indigo-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
                  <img src={`https://picsum.photos/seed/${userName}/40/40`} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate dark:text-white group-hover:text-indigo-400 transition-colors">{userName}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{userRole}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all text-xs font-bold uppercase tracking-widest border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen relative z-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B1121]/70 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-20 flex items-center justify-between px-6 lg:px-10 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h2 className="hidden md:block text-sm font-medium text-slate-500 dark:text-slate-400">
              Pages / <span className="text-slate-900 dark:text-white font-bold">{NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'Dashboard'}</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10 flex-1 pb-24 lg:pb-10 overflow-x-hidden flex flex-col max-w-7xl mx-auto w-full">
          <div className="flex-1 w-full">
            {children}
          </div>
          
          <footer className="mt-20 pt-8 border-t border-slate-200 dark:border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-500">
              <p>
                &copy; {new Date().getFullYear()} Tech Titans. Crafted with precision.
              </p>
              <div className="flex gap-8">
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support</a>
              </div>
            </div>
          </footer>
        </div>

        {/* Bottom Nav - Mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 flex justify-around py-4 px-2 z-50 safe-area-pb">
          {filteredNavItems.slice(0, 4).map((item) => {
             const isActive = location.pathname === item.path;
             return (
               <Link 
                key={item.path} 
                to={item.path} 
                className={`flex flex-col items-center gap-1.5 transition-colors relative ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
               >
                 {isActive && <motion.span layoutId="mobileActive" className="absolute -top-4 w-12 h-1 bg-indigo-500 rounded-b-lg shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                 <item.icon className="w-6 h-6" />
                 {/* <span className="text-[10px] font-bold tracking-wide">{item.label}</span> */}
               </Link>
             );
          })}
        </nav>
      </main>

      <Chatbot />
    </div>
  );
};

export default Layout;

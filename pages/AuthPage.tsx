
import React, { useState } from 'react';
import { UserRole } from '../types';
import { firebaseService } from '../services/firebase';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthPageProps {
  onLoginSuccess: (role: UserRole, name: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { role: userRole, user, userData } = await firebaseService.signIn(email, password);
        onLoginSuccess(userRole, user.displayName || userData?.name || 'User');
      } else {
        const { role: userRole, user } = await firebaseService.signUp(email, password, name, role);
        onLoginSuccess(userRole, name);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(''); // Clear error when switching modes
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B1121]">
      {/* Left Column - Visual */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600 to-violet-900 opacity-90"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit border border-white/20">
            <Quote className="w-8 h-8 text-indigo-300" />
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            "Prashikshan helped me bridge the gap between my academic knowledge and industry expectations."
          </h2>
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?img=32" alt="Student" className="w-12 h-12 rounded-full border-2 border-indigo-300" />
            <div>
              <p className="font-bold">Sarah Jenkins</p>
              <p className="text-indigo-200 text-sm">Placed at Google, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h1 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-2">Prashikshan</h1>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start your professional journey today.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm rounded-xl flex items-start gap-3 border border-rose-100 dark:border-rose-500/20"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white transition-all font-medium"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white transition-all font-medium"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {!isLogin && (
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 dark:text-slate-300">I am a</label>
                 <div className="grid grid-cols-2 gap-4">
                   <button
                     type="button"
                     onClick={() => setRole(UserRole.STUDENT)}
                     className={`py-3.5 rounded-xl font-bold text-sm transition-all border ${role === UserRole.STUDENT ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                   >
                     Student
                   </button>
                   <button
                     type="button"
                     onClick={() => setRole(UserRole.EMPLOYER)}
                     className={`py-3.5 rounded-xl font-bold text-sm transition-all border ${role === UserRole.EMPLOYER ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                   >
                     Employer
                   </button>
                 </div>
               </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 mt-8 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isLogin ? "New to Prashikshan? " : "Already have an account? "}
              <button 
                onClick={toggleMode}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-colors"
              >
                {isLogin ? 'Create an account' : 'Sign in here'}
              </button>
            </p>
          </div>
          
          {isLogin && (
            <div className="mt-8 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 text-center">
              <p className="text-xs text-slate-500 font-mono">
                Demo: student@demo.com / password
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;


import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { firebaseService } from './services/firebase';
import { UserRole, EvaluationResult } from './types';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import InterviewPractice from './pages/InterviewPractice';
import InternshipsPage from './pages/InternshipsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import QuizPage from './pages/QuizPage';
import AITutorPage from './pages/AITutorPage';
import ClickSpark from './components/ClickSpark';
import { ToastProvider } from './components/Toast';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
  const [userName, setUserName] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the service wrapper which handles both Real Firebase and Mock Storage
    const unsubscribe = firebaseService.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserName(user.displayName || 'User');
        
        try {
          // Fetch Role and Evaluation from Firestore (or Mock)
          const profile = await firebaseService.getUserProfile(user.uid);
          if (profile) {
            setUserRole(profile.role as UserRole);
            if (profile.evaluation) {
              setEvaluationResult(profile.evaluation);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile", error);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(UserRole.STUDENT);
        setEvaluationResult(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (role: UserRole, name: string) => {
    // Immediate local state update for perceived performance
    // The auth listener will eventually sync this
    setUserRole(role);
    setUserName(name);
  };

  const handleLogout = async () => {
    await firebaseService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <ClickSpark sparkColor="#6366f1" sparkCount={8} sparkRadius={15} duration={400} className="min-h-screen">
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/landing" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/" replace />} />
            
            {/* Auth Route */}
            <Route path="/auth" element={
              !isAuthenticated ? (
                <AuthPage onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Navigate to="/" replace />
              )
            } />

            {/* Evaluation Route (Fullscreen, no layout) */}
            <Route path="/quiz" element={
              isAuthenticated && userRole === UserRole.STUDENT ? (
                <QuizPage onComplete={setEvaluationResult} />
              ) : (
                 <Navigate to="/auth" replace />
              )
            } />

            {/* Protected Routes */}
            <Route 
              path="/*" 
              element={
                isAuthenticated ? (
                  <Layout userRole={userRole} userName={userName} onLogout={handleLogout}>
                    <Routes>
                      {/* Pass hasAssessment status to Dashboard to conditionally show the CTA */}
                      <Route index element={<StudentDashboard hasAssessment={!!evaluationResult} />} />
                      <Route path="ai-tutor" element={<AITutorPage evaluation={evaluationResult} />} />
                      <Route path="resume" element={<ResumeBuilder />} />
                      <Route path="interview" element={<InterviewPractice />} />
                      <Route path="internships" element={<InternshipsPage />} />
                      <Route path="analytics" element={<AnalyticsPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="post-internship" element={<InternshipsPage />} />
                      <Route path="students-list" element={<div className="p-10 text-center opacity-50"><p className="text-2xl font-bold">Student Database Access Restricted</p></div>} />
                    </Routes>
                  </Layout>
                ) : (
                  <Navigate to="/landing" replace />
                )
              } 
            />
          </Routes>
        </HashRouter>
      </ClickSpark>
    </ToastProvider>
  );
};

export default App;

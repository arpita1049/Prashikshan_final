
import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquareText, 
  BarChart3, 
  Settings, 
  UserCircle,
  Users,
  Building2,
  GraduationCap,
  BrainCircuit
} from 'lucide-react';
import { UserRole, Internship } from './types';

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechFlow Solutions',
    location: 'Remote',
    stipend: '₹15,000/mo',
    duration: '3 Months',
    tags: ['React', 'Tailwind', 'TypeScript'],
    description: 'Looking for a passionate frontend developer to join our core product team.',
    matchScore: 92
  },
  {
    id: '2',
    title: 'Data Analyst Intern',
    company: 'FinEdge Analytics',
    location: 'Bangalore, IN',
    stipend: '₹25,000/mo',
    duration: '6 Months',
    tags: ['Python', 'SQL', 'Tableau'],
    description: 'Help us derive insights from large datasets in the fintech space.',
    matchScore: 78
  },
  {
    id: '3',
    title: 'Product Management Intern',
    company: 'Creative Labs',
    location: 'Mumbai, IN',
    stipend: '₹10,000/mo',
    duration: '2 Months',
    tags: ['Agile', 'Jira', 'User Research'],
    description: 'Work closely with designers and engineers to define the product roadmap.',
    matchScore: 65
  },
  {
    id: '4',
    title: 'AI/ML Research Intern',
    company: 'FutureBrain AI',
    location: 'Hyderabad, IN',
    stipend: '₹30,000/mo',
    duration: '6 Months',
    tags: ['Python', 'TensorFlow', 'PyTorch'],
    description: 'Research and implement state-of-the-art NLP models for our conversational AI platform.',
    matchScore: 88
  },
  {
    id: '5',
    title: 'UX Design Intern',
    company: 'DesignFirst',
    location: 'Remote',
    stipend: '₹12,000/mo',
    duration: '3 Months',
    tags: ['Figma', 'Prototyping', 'User Testing'],
    description: 'Assist in creating beautiful and intuitive user interfaces for our mobile applications.',
    matchScore: 85
  },
  {
    id: '6',
    title: 'Backend Engineer Intern',
    company: 'CloudScale',
    location: 'Pune, IN',
    stipend: '₹20,000/mo',
    duration: '4 Months',
    tags: ['Node.js', 'PostgreSQL', 'AWS'],
    description: 'Build robust APIs and microservices to support high-scale applications.',
    matchScore: 72
  }
];

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: [UserRole.STUDENT, UserRole.EMPLOYER, UserRole.COLLEGE] },
  { label: 'AI Tutor', path: '/ai-tutor', icon: BrainCircuit, roles: [UserRole.STUDENT] },
  { label: 'Internships', path: '/internships', icon: Briefcase, roles: [UserRole.STUDENT] },
  { label: 'Resume', path: '/resume', icon: FileText, roles: [UserRole.STUDENT] },
  { label: 'Interview Prep', path: '/interview', icon: MessageSquareText, roles: [UserRole.STUDENT] },
  { label: 'Post Internship', path: '/post-internship', icon: Building2, roles: [UserRole.EMPLOYER] },
  { label: 'Students', path: '/students-list', icon: Users, roles: [UserRole.EMPLOYER, UserRole.COLLEGE] },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, roles: [UserRole.STUDENT, UserRole.EMPLOYER, UserRole.COLLEGE] },
  { label: 'Settings', path: '/settings', icon: Settings, roles: [UserRole.STUDENT, UserRole.EMPLOYER, UserRole.COLLEGE] },
];

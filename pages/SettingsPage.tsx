
import React from 'react';
import { User, Mail, Lock, Bell, Shield, Save, Linkedin, Github, Link as LinkIcon } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold dark:text-white">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <NavButton active icon={<User />} label="Profile Info" />
          <NavButton icon={<LinkIcon />} label="Connected Accounts" />
          <NavButton icon={<Lock />} label="Security" />
          <NavButton icon={<Bell />} label="Notifications" />
          <NavButton icon={<Shield />} label="Privacy" />
        </div>

        {/* Form Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Personal Information</h3>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden relative group cursor-pointer">
                <img src="https://picsum.photos/seed/John%20Doe/200/200" alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                  Change
                </div>
              </div>
              <div>
                <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors">
                  Upload New Photo
                </button>
                <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="First Name" value="John" />
                <InputGroup label="Last Name" value="Doe" />
              </div>
              <InputGroup label="Email Address" value="john.doe@university.edu" icon={<Mail className="w-4 h-4" />} />
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Bio</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none dark:text-white transition-all h-32 resize-none"
                  defaultValue="Computer Science student passionate about AI and Web Development. Looking for opportunities to learn and grow."
                />
              </div>
            </div>

            <hr className="my-8 border-slate-100 dark:border-slate-800" />

            <h3 className="text-xl font-bold mb-6 dark:text-white">Connected Accounts</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                  label="LinkedIn Profile" 
                  value="linkedin.com/in/johndoe" 
                  icon={<Linkedin className="w-4 h-4 text-blue-600" />} 
                />
                <InputGroup 
                  label="GitHub Profile" 
                  value="github.com/johndoe" 
                  icon={<Github className="w-4 h-4 text-slate-900 dark:text-white" />} 
                />
              </div>
              <p className="text-xs text-slate-400">
                Linking your accounts helps employers verify your skills and professional background.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, icon, label }: any) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
    {React.cloneElement(icon, { className: 'w-4 h-4' })}
    {label}
  </button>
);

const InputGroup = ({ label, value, icon }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</label>
    <div className="relative">
      <input 
        type="text" 
        defaultValue={value} 
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none dark:text-white transition-all"
      />
      {icon && <div className="absolute right-4 top-3.5 text-slate-400">{icon}</div>}
    </div>
  </div>
);

export default SettingsPage;

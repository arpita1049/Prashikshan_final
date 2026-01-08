
import React, { useState } from 'react';
import { Search, MapPin, Clock, Banknote, Filter, Building2, X } from 'lucide-react';
import { MOCK_INTERNSHIPS } from '../constants';
import { useToast } from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const FILTER_TAGS = ['All', 'Remote', 'On-site', 'Bangalore', 'Pune', 'High Stipend'];

const InternshipsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const { addToast } = useToast();

  const handleApply = (id: string, title: string) => {
    const newApplied = new Set(appliedIds);
    newApplied.add(id);
    setAppliedIds(newApplied);
    addToast(`Applied to ${title} successfully!`, 'success');
  };

  const filteredInternships = MOCK_INTERNSHIPS.filter(internship => {
    const matchesSearch = 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    if (activeFilter === 'Remote') matchesFilter = internship.location.includes('Remote');
    if (activeFilter === 'On-site') matchesFilter = !internship.location.includes('Remote');
    if (activeFilter === 'Bangalore') matchesFilter = internship.location.includes('Bangalore');
    if (activeFilter === 'Pune') matchesFilter = internship.location.includes('Pune');
    if (activeFilter === 'High Stipend') {
      const amount = parseInt(internship.stipend.replace(/[^0-9]/g, ''));
      matchesFilter = amount >= 20000;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Find Internships</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Discover opportunities curated for your skill set.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by role, company, or skills..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 dark:text-white transition-all shadow-sm font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
             <Filter className="w-4 h-4 text-slate-500" />
          </div>
          {FILTER_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`
                px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border
                ${activeFilter === tag 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Internship List */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredInternships.map(internship => {
            const isApplied = appliedIds.has(internship.id);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={internship.id} 
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                    <Building2 className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                  </div>
                  {internship.matchScore && (
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-500/10">
                      {internship.matchScore}% Match
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{internship.title}</h3>
                  <p className="text-slate-500 font-medium text-sm">{internship.company}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 opacity-70" /> {internship.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Banknote className="w-4 h-4 opacity-70" /> {internship.stipend}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4 opacity-70" /> {internship.duration}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {internship.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700/50">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={() => !isApplied && handleApply(internship.id, internship.title)}
                    disabled={isApplied}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                      isApplied 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default border border-emerald-200 dark:border-emerald-900/30'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-slate-200 shadow-lg shadow-slate-200 dark:shadow-none hover:shadow-indigo-500/30 dark:hover:shadow-white/10 hover:-translate-y-0.5'
                    }`}
                  >
                    {isApplied ? 'Application Sent' : 'Apply Now'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {filteredInternships.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 font-medium">No internships found matching your criteria.</p>
          <button 
            onClick={() => {setSearchTerm(''); setActiveFilter('All');}}
            className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default InternshipsPage;

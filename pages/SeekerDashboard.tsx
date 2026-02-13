
import React, { useState } from 'react';
import { JobOpening } from '../types';
import JobCard from '../components/JobCard';

interface SeekerDashboardProps {
  jobPostings: JobOpening[];
  appliedJobIds: string[];
  savedJobIds: string[];
  onApply: (jobId: string) => void;
  onToggleSave: (jobId: string) => void;
}

const SeekerDashboard: React.FC<SeekerDashboardProps> = ({ 
  jobPostings,
  appliedJobIds, 
  savedJobIds, 
  onApply, 
  onToggleSave 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.position.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || job.employmentType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24 shadow-sm">
            <h2 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Filter Jobs
            </h2>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-4 tracking-tight">Job Type</label>
              <div className="space-y-4">
                {['All', 'Permanent', 'Part-time', 'Contract', 'Remote Only'].map(type => (
                  <label key={type} className="flex items-center group cursor-pointer">
                    <div className="relative flex items-center">
                      <input 
                        type="radio" 
                        name="jobType" 
                        checked={filterType === type}
                        onChange={() => setFilterType(type)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                        filterType === type 
                        ? 'bg-emerald-600 border-emerald-600' 
                        : 'border-slate-200 group-hover:border-slate-300 bg-white'
                      }`}>
                        <div className={`w-2 h-2 rounded-full bg-white transition-transform duration-200 ${
                          filterType === type ? 'scale-100' : 'scale-0'
                        }`}></div>
                      </div>
                    </div>
                    <span className={`text-base font-medium transition-colors ${
                      filterType === type ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                    }`}>
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {setSearchTerm(''); setFilterType('All');}}
              className="w-full py-3 text-emerald-600 text-sm font-bold hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Discover Opportunities</h1>
              <p className="text-slate-500 font-medium">Find the next big step in your career.</p>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
              <span className="text-emerald-700 text-sm font-bold">{filteredJobs.length}</span>
              <span className="text-emerald-600 text-sm font-medium">Jobs available now</span>
            </div>
          </div>

          <div className="relative mb-10 group">
            <input 
              type="text" 
              placeholder="Search by job title, company, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 shadow-sm transition-all text-lg font-medium"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid gap-6">
              {filteredJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onApply={onApply} 
                  onSave={onToggleSave}
                  isSaved={savedJobIds.includes(job.id)}
                  isApplied={appliedJobIds.includes(job.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No matching jobs found</h3>
              <p className="text-slate-500 max-w-sm px-6">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;

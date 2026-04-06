
import React, { useState } from 'react';
import { JobOpening } from '../types';

interface JobCardProps {
  job: JobOpening;
  onApply: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
  isApplied?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onSave, isSaved, isApplied }) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isApplied) return;
    setIsApplying(true);
    setTimeout(() => {
      onApply(job.id);
      setIsApplying(false);
    }, 800);
  };

  const goToDetail = () => {
    window.location.hash = `job-detail/${job.id}`;
  };

  return (
    <div 
      onClick={goToDetail}
      className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group relative cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm transform group-hover:scale-105 transition-transform">
            {job.organization.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              {job.position}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-slate-600 font-medium">{job.organization}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 text-sm">{job.createdAt}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onSave?.(job.id); }}
          className={`p-2.5 rounded-xl border transition-all duration-200 ${
            isSaved 
            ? 'bg-rose-50 border-rose-100 text-rose-500' 
            : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-400 hover:border-rose-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700">
          {job.employmentType}
        </div>
        <div className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700">
          {job.compensation}
        </div>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2 font-medium italic">
        {job.requirements}
      </p>

      <div className="flex justify-between items-center pt-5 border-t border-slate-100">
        <div className="flex items-center text-slate-400 text-xs font-black uppercase tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {job.officeLocation}
        </div>
        <button 
          onClick={handleApplyClick}
          disabled={isApplied || isApplying}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
            isApplied 
            ? 'bg-slate-100 text-slate-400' 
            : isApplying 
              ? 'bg-emerald-400 text-white cursor-wait' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
          }`}
        >
          {isApplied ? 'Applied' : 'Details'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;

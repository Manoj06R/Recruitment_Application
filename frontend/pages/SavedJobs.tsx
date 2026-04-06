
import React from 'react';
import { JobOpening } from '../types';
import JobCard from '../components/JobCard';

interface SavedJobsProps {
  // Added jobPostings prop to align with usage in App.tsx
  jobPostings: JobOpening[];
  appliedJobIds: string[];
  savedJobIds: string[];
  onApply: (jobId: string) => void;
  onToggleSave: (jobId: string) => void;
}

const SavedJobs: React.FC<SavedJobsProps> = ({ 
  jobPostings,
  appliedJobIds, 
  savedJobIds, 
  onApply, 
  onToggleSave 
}) => {
  // Filter jobs from the dynamic jobPostings list instead of initial constants
  const savedJobs = jobPostings.filter(job => savedJobIds.includes(job.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Saved Opportunities</h1>
        <p className="text-slate-500 font-medium">Jobs you've expressed interest in and want to revisit.</p>
      </div>

      {savedJobs.length > 0 ? (
        <div className="grid gap-6">
          {savedJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onApply={onApply} 
              onSave={onToggleSave}
              isSaved={true}
              isApplied={appliedJobIds.includes(job.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No saved jobs yet</h3>
          <p className="text-slate-500 max-w-sm px-6 mb-8">Click the heart icon on any job card to save it for later.</p>
          <button 
            onClick={() => window.location.hash = 'seeker-dashboard'}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Browse Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;

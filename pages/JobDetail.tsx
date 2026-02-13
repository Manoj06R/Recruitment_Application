
import React, { useState, useEffect } from 'react';
import { JobOpening } from '../types';
import { generateJobDescription } from '../services/geminiService';

interface JobDetailProps {
  jobId: string | null;
  // Added jobPostings prop to allow finding details for newly posted jobs
  jobPostings: JobOpening[];
  onApply: (id: string) => void;
  isApplied: boolean;
}

const JobDetail: React.FC<JobDetailProps> = ({ jobId, jobPostings, onApply, isApplied }) => {
  const [job, setJob] = useState<JobOpening | null>(null);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Correctly using the jobPostings prop for lookup to include dynamic data
    const foundJob = jobPostings.find(j => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
      // Only fetch AI content if there isn't a detailed description already, 
      // or as an "enrichment" step. For this demo, we'll fetch it to show the AI feature.
      const fetchAi = async () => {
        setIsLoading(true);
        const content = await generateJobDescription(foundJob.position, foundJob.organization, foundJob.techStack);
        setAiContent(content);
        setIsLoading(false);
      };
      fetchAi();
    }
  }, [jobId, jobPostings]);

  if (!job) return <div className="p-20 text-center font-bold text-slate-400">Job not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <button 
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to search
      </button>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 emerald-gradient rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black shadow-xl">
              {job.organization.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-tight">{job.position}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xl font-bold text-emerald-600">{job.organization}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">{job.officeLocation}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm leading-relaxed">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
               <h2 className="text-2xl font-bold text-slate-900">Role Overview</h2>
               {isLoading && <span className="text-xs font-black text-emerald-500 animate-pulse tracking-widest uppercase">AI Enriching...</span>}
            </div>
            
            <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-600 font-medium leading-relaxed">
                  {/* Prioritize AI content, then static description, then fallback requirements */}
                  {aiContent || job.description || job.requirements}
                </div>
            </div>

            {job.benefits && job.benefits.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Perks & Benefits</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm sticky top-28">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Job Summary</h3>
            <div className="space-y-6 mb-8">
              <SummaryItem label="Salary Range" value={job.compensation} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <SummaryItem label="Location" value={job.officeLocation} icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <SummaryItem label="Type" value={job.employmentType} icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              <SummaryItem label="Level" value={job.seniority} icon="M13 10V3L4 14h7v7l9-11h-7z" />
            </div>

            <button 
              onClick={() => onApply(job.id)}
              disabled={isApplied}
              className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-lg active:scale-95 ${
                isApplied ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
              }`}
            >
              {isApplied ? 'Application Submitted' : 'Apply to This Role'}
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
              Joined {job.applicantCount} other applicants
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
            <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {job.techStack.map(tech => (
                <span key={tech} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-600">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} /></svg>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default JobDetail;

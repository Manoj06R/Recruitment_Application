
import React, { useState } from 'react';
import { JobOpening, JobApplication } from '../types';
import { fetchSmartDescription } from '../services/ContentEngine';

interface RecruiterDashboardProps {
  jobPostings: JobOpening[];
  applicationRecords: JobApplication[];
  onPostJob: (job: JobOpening) => void;
  defaultTab?: string;
}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ jobPostings, applicationRecords, onPostJob, defaultTab = 'overview' }) => {
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusJobId, setFocusJobId] = useState<string | null>(null);

  const [jobForm, setJobForm] = useState({ title: '', loc: '', type: 'Permanent' as any, comp: '', stack: '', details: '' });

  const handleDownloadResume = (name: string) => {
    alert(`Downloading ${name}'s resume as PDF...`);
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      position: jobForm.title,
      organization: 'Our Company',
      officeLocation: jobForm.loc || 'Remote',
      compensation: jobForm.comp || 'Competitive',
      employmentType: jobForm.type,
      seniority: 'Mid-Senior',
      requirements: jobForm.details.substring(0, 100) + '...',
      description: jobForm.details,
      techStack: jobForm.stack.split(',').map(s => s.trim()),
      createdAt: 'Just now',
      applicantCount: 0
    };
    onPostJob(newJob);
    setCurrentTab('overview');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none">Manager Console</h1>
          <p className="text-slate-500 font-medium mt-3 italic">Hiring flow and candidate lifecycle management.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Hiring Credits</p>
              <p className="text-2xl font-black text-emerald-600 leading-none">14</p>
            </div>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-200/40 p-1.5 rounded-2xl w-fit mb-12 shadow-inner border border-slate-100">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'candidates', label: 'Candidates' },
          { id: 'create', label: 'New Role' },
          { id: 'billing', label: 'Payments' }
        ].map(t => (
          <button key={t.id} onClick={() => setCurrentTab(t.id)} className={`px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${currentTab === t.id ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>{t.label}</button>
        ))}
      </div>

      {currentTab === 'overview' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobPostings.map(job => (
            <div key={job.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-emerald-200 transition-all shadow-sm hover:shadow-xl group">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-bold text-xl">{job.organization.charAt(0)}</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full">{job.createdAt}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-2 group-hover:text-emerald-600 transition-colors leading-tight">{job.position}</h3>
              <p className="text-slate-500 text-sm font-semibold mb-8">{job.officeLocation}</p>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <p className="text-2xl font-black text-slate-950">{job.applicantCount} Apps</p>
                <button onClick={() => { setFocusJobId(job.id); setCurrentTab('candidates'); }} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 hover:bg-slate-950 hover:text-white transition-all shadow-sm">Manage</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentTab === 'candidates' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applicationRecords.filter(a => !focusJobId || a.jobId === focusJobId).map(app => (
                <tr key={app.id} className="hover:bg-slate-50 group transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900">{app.candidateName}</p>
                    <p className="text-xs text-slate-400 font-medium">{app.candidateEmail}</p>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-700 text-xs uppercase">{app.experienceYears}+ Years</td>
                  <td className="px-8 py-5 font-black text-emerald-600">{app.relevanceScore}%</td>
                  <td className="px-8 py-5 flex gap-4">
                    <button onClick={() => handleDownloadResume(app.candidateName)} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Download CV</button>
                    <button onClick={() => window.location.hash = `applicant/${app.id}`} className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline">Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {currentTab === 'billing' && (
        <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-black text-slate-950 mb-4">Hiring Solutions</h3>
          <p className="text-slate-500 font-medium mb-12">Upgrade your plan to unlock AI resume filtering and bulk emailing.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <p className="text-xs font-black uppercase text-slate-400 mb-4">Pro Plan</p>
              <p className="text-4xl font-black text-slate-950 mb-6">₹4,999<span className="text-sm font-bold text-slate-400">/mo</span></p>
              <button className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black shadow-xl">Upgrade Now</button>
            </div>
            <div className="p-10 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 ring-2 ring-emerald-500/10">
              <p className="text-xs font-black uppercase text-emerald-600 mb-4">Enterprise</p>
              <p className="text-4xl font-black text-slate-950 mb-6">Custom</p>
              <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl">Contact Sales</button>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'create' && (
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 animate-in slide-in-from-bottom-6">
          <form className="space-y-10" onSubmit={handlePost}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="label-style">Position Title</label>
                <input type="text" className="input-style" placeholder="e.g. Senior Software Architect" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required />
              </div>
              <div><label className="label-style">Location</label><input type="text" className="input-style" value={jobForm.loc} onChange={e => setJobForm({...jobForm, loc: e.target.value})} /></div>
              <div><label className="label-style">Salary Range</label><input type="text" className="input-style" value={jobForm.comp} onChange={e => setJobForm({...jobForm, comp: e.target.value})} /></div>
              <div className="col-span-2">
                <textarea rows={8} className="input-style h-auto" placeholder="Role description..." value={jobForm.details} onChange={e => setJobForm({...jobForm, details: e.target.value})}></textarea>
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl active:scale-95">Launch Opening</button>
          </form>
        </div>
      )}
      <style>{`
        .label-style { @apply block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3; }
        .input-style { @apply w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-900; }
      `}</style>
    </div>
  );
};

export default RecruiterDashboard;

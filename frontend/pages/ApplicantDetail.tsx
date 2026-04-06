
import React, { useState } from 'react';
import { JobApplication } from '../types';

interface ApplicantDetailProps {
  applicationId: string | null;
  applicationRecords: JobApplication[];
  onBack: () => void;
  onUpdate: (appId: string, updates: Partial<JobApplication>) => void;
}

const ApplicantDetail: React.FC<ApplicantDetailProps> = ({ applicationId, applicationRecords, onBack, onUpdate }) => {
  const app = applicationRecords.find(a => a.id === applicationId) || applicationRecords[0];
  const [status, setStatus] = useState(app?.reviewStatus || 'In Review');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({ date: '', time: '', mode: 'Offline', location: '' });

  const handleUpdateStatus = (newStatus: string) => {
    if (newStatus === 'Interview') {
      setIsModalOpen(true);
    } else {
      setStatus(newStatus as any);
      onUpdate(app.id, { reviewStatus: newStatus as any });
    }
  };

  if (!app) return <div className="p-20 text-center font-bold text-slate-400">Application not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-left-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 mb-10 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        Back to applicants
      </button>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Left Column: Candidate Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
            <div className="w-32 h-32 emerald-gradient rounded-[2rem] mx-auto mb-8 p-1 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center text-4xl font-black text-slate-900">
                {app.candidateName.charAt(0)}
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-950 mb-1 leading-tight">{app.candidateName}</h2>
            <p className="text-slate-500 font-bold italic mb-8">{app.candidateEmail}</p>
            
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl mb-10">
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Relevance Score</p>
              <div className="text-4xl font-black text-emerald-700">{app.relevanceScore}%</div>
            </div>

            <div className="space-y-3">
              <StatusBtn active={status === 'Shortlisted'} label="Shortlist" color="bg-emerald-600" onClick={() => handleUpdateStatus('Shortlisted')} />
              <StatusBtn active={status === 'Interview'} label="Schedule Interview" color="bg-blue-600" onClick={() => handleUpdateStatus('Interview')} />
              <StatusBtn active={status === 'Declined'} label="Decline" color="bg-rose-600" onClick={() => handleUpdateStatus('Declined')} />
            </div>
          </div>
        </div>

        {/* Right Column: Experience and Resume */}
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-slate-900 p-10 md:p-14 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                   <h3 className="text-3xl font-black tracking-tight">Candidate Profile Analysis</h3>
                   <div className="px-5 py-2 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest backdrop-blur-md">Powered by contentEngine</div>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                   <div>
                      <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Core Strengths</h4>
                      <ul className="space-y-3 text-slate-300 font-medium">
                         <li className="flex gap-2">✓ Expert Proficiency in React & TypeScript</li>
                         <li className="flex gap-2">✓ Advanced Architectural Thinking</li>
                         <li className="flex gap-2">✓ Strong UI/UX Collaboration History</li>
                      </ul>
                   </div>
                   <div>
                      <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Development Areas</h4>
                      <ul className="space-y-3 text-slate-300 font-medium">
                         <li className="flex gap-2">! Limited experience with Cloud Platforms</li>
                         <li className="flex gap-2">! Backend integration needs mentorship</li>
                      </ul>
                   </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[120px]"></div>
           </div>

           <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Professional Timeline</h3>
              <div className="space-y-12 relative before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                <TimelineItem title="Senior Software Engineer" org="Innovate Tech" date="2020 - Present" />
                <TimelineItem title="Full Stack Developer" org="Creative Solutions" date="2018 - 2020" />
                <TimelineItem title="Junior Developer" org="Startup Lab" date="2016 - 2018" />
              </div>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Schedule Interview</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setStatus('Interview');
              onUpdate(app.id, { reviewStatus: 'Interview', interviewDate: interviewForm.date, interviewTime: interviewForm.time, interviewMode: interviewForm.mode, interviewLocation: interviewForm.location });
              setIsModalOpen(false);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date</label><input type="date" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" value={interviewForm.date} onChange={e => setInterviewForm({...interviewForm, date: e.target.value})} /></div>
                <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Time</label><input type="time" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" value={interviewForm.time} onChange={e => setInterviewForm({...interviewForm, time: e.target.value})} /></div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mode</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" value={interviewForm.mode} onChange={e => setInterviewForm({...interviewForm, mode: e.target.value})}>
                  <option value="Offline">Offline (Office)</option>
                  <option value="Online">Online (Zoom/Meet)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{interviewForm.mode === 'Offline' ? 'Company Address' : 'Meeting Link'}</label>
                <input required type={interviewForm.mode === 'Offline' ? 'text' : 'url'} placeholder={interviewForm.mode === 'Offline' ? 'e.g. Chennai, Guindy...' : 'https://zoom.us/j/...'} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" value={interviewForm.location} onChange={e => setInterviewForm({...interviewForm, location: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-600 transition-all mt-4">Confirm Schedule</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBtn = ({ label, color, active, onClick }: { label: string, color: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full py-4 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 ${
      active ? `${color} text-white shadow-lg` : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-white hover:text-slate-900'
    }`}
  >
    {label}
  </button>
);

const TimelineItem = ({ title, org, date }: { title: string, org: string, date: string }) => (
  <div className="pl-12 relative group">
    <div className="absolute left-[3px] top-1.5 w-3.5 h-3.5 bg-white border-4 border-slate-200 rounded-full group-hover:border-emerald-500 transition-colors"></div>
    <h4 className="text-xl font-bold text-slate-900 leading-none mb-1">{title}</h4>
    <p className="text-emerald-600 font-bold text-sm">{org} <span className="text-slate-400 font-medium ml-2">• {date}</span></p>
    <p className="text-slate-500 text-sm mt-3 leading-relaxed">Managed end-to-end development of enterprise-scale applications and led a team of 5 junior engineers.</p>
  </div>
);

export default ApplicantDetail;

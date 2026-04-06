
import React, { useState, useEffect } from 'react';
import { JobOpening, Message, JobApplication } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ApplicationTrackerProps {
  jobPostings: JobOpening[];
  applications: JobApplication[];
  sentMessages: Message[];
  onSendMessage: (msg: Message) => void;
  onNavigate: (page: string) => void;
}

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ 
  jobPostings, 
  applications, 
  sentMessages,
  onSendMessage,
  onNavigate 
}) => {
  const [messagingJob, setMessagingJob] = useState<{id: string, org: string} | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // AI Interview Prep State
  const [prepContent, setPrepContent] = useState<string | null>(null);
  const [isPrepping, setIsPrepping] = useState(false);
  const [preppingJob, setPreppingJob] = useState<string | null>(null);

  const getJobById = (id: string) => jobPostings.find(j => j.id === id);

  const fetchInterviewTips = async (position: string) => {
    setIsPrepping(true);
    setPreppingJob(position);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as an expert interviewer for the position of "${position}". 
      Generate 5 critical interview questions (mix of technical and behavioral) that a candidate should prepare for. 
      Briefly explain why each question is important. Use clean Markdown formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setPrepContent(response.text || "Failed to generate tips.");
    } catch (error) {
      setPrepContent("Error connecting to AI Coach. Please try again later.");
    } finally {
      setIsPrepping(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !messagingJob) return;

    setIsSending(true);
    setTimeout(() => {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        jobId: messagingJob.id,
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onSendMessage(newMsg);
      setIsSending(false);
      setShowSuccess(true);
      setMessageText('');
      setTimeout(() => {
        setShowSuccess(false);
        setMessagingJob(null);
      }, 2000);
    }, 1000);
  };

  const jobMessages = messagingJob 
    ? sentMessages.filter(m => m.jobId === messagingJob.id) 
    : [];

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'In Review': return 1;
      case 'Shortlisted': return 2;
      case 'Interview': return 3;
      case 'Offered': return 4;
      default: return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Application Center</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time tracking and interview preparation tools.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-600">{applications.length} Active Tracks</span>
        </div>
      </div>

      {applications.length > 0 ? (
        <div className="grid gap-6">
          {applications.map((app) => {
            const job = getJobById(app.jobId);
            if (!job) return null;
            const currentStep = getStatusStep(app.reviewStatus);

            return (
              <div key={app.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all group">
                <div className="p-8 flex flex-col lg:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-6 w-full lg:w-1/3">
                    <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-3xl font-black group-hover:scale-110 transition-transform">
                      {job.organization.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-2xl font-black text-slate-950 truncate">{job.position}</h3>
                      <p className="text-emerald-600 font-bold">{job.organization}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Applied {app.submittedAt}</p>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 flex items-center gap-4 relative py-4">
                     {[
                       { label: 'Review', step: 1 },
                       { label: 'Screen', step: 2 },
                       { label: 'Interview', step: 3 },
                       { label: 'Offer', step: 4 }
                     ].map((s, i, arr) => (
                       <React.Fragment key={s.label}>
                         <div className="flex flex-col items-center z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                              currentStep >= s.step 
                              ? 'bg-emerald-600 border-emerald-50 text-white' 
                              : 'bg-white border-slate-100 text-slate-300'
                            }`}>
                               {currentStep > s.step ? (
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                               ) : <span className="text-[10px] font-black">{s.step}</span>}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter mt-2 ${currentStep >= s.step ? 'text-emerald-600' : 'text-slate-300'}`}>{s.label}</span>
                         </div>
                         {i < arr.length - 1 && (
                           <div className="flex-1 h-1 rounded-full bg-slate-100 relative top-[-10px]">
                              <div className={`h-full bg-emerald-500 transition-all duration-700 delay-300`} style={{ width: currentStep > s.step ? '100%' : '0%' }}></div>
                           </div>
                         )}
                       </React.Fragment>
                     ))}
                  </div>

                  <div className="flex gap-2 w-full lg:w-auto">
                    <button 
                      onClick={() => fetchInterviewTips(job.position)}
                      className="flex-1 lg:px-6 py-4 bg-slate-950 text-white rounded-2xl text-sm font-black hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg>
                      AI Coach
                    </button>
                    <button 
                      onClick={() => setMessagingJob({id: job.id, org: job.organization})}
                      className="flex-1 lg:px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-black hover:bg-emerald-100 transition-all"
                    >
                      Message
                    </button>
                  </div>
                </div>
                {app.reviewStatus === 'Interview' && app.interviewDate && (
                  <div className="bg-slate-50 border-t border-slate-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-6 items-center w-full md:w-auto">
                       <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-blue-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Interview Scheduled</p>
                          <h4 className="text-xl font-black text-slate-900 leading-none">{app.interviewDate} at {app.interviewTime}</h4>
                          <LiveCountdown date={app.interviewDate || ''} time={app.interviewTime || ''} mode={app.interviewMode || ''} />
                       </div>
                    </div>
                    <div className="w-full md:w-auto bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       </div>
                       <div className="flex-1 max-w-[200px] truncate">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{app.interviewMode === 'Offline' ? 'Location' : 'Link'}</p>
                          <p className="text-xs font-bold text-slate-900 truncate">{app.interviewLocation}</p>
                       </div>
                       {app.interviewMode === 'Offline' ? (
                         <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(app.interviewLocation || '')}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors whitespace-nowrap">Map</a>
                       ) : (
                         <a href={app.interviewLocation} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors whitespace-nowrap">Join Link</a>
                       )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
           <p className="text-slate-400 font-bold text-xl">You haven't applied to any roles yet.</p>
           <button onClick={() => onNavigate('seeker-dashboard')} className="mt-6 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg">Start Browsing</button>
        </div>
      )}

      {/* AI Prep Modal */}
      {prepContent && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-2xl font-black text-slate-950">AI Interview Prep</h3>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{preppingJob}</p>
              </div>
              <button onClick={() => setPrepContent(null)} className="p-3 hover:bg-slate-200 rounded-full transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-10 overflow-y-auto text-slate-700 prose prose-emerald max-w-none prose-sm leading-relaxed">
               <div className="whitespace-pre-wrap font-medium">{prepContent}</div>
            </div>
            <div className="p-8 bg-slate-50 text-center border-t border-slate-100">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Generated by Recruitment AI Engine</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {isPrepping && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
           <div className="bg-white p-12 rounded-[2.5rem] text-center shadow-2xl">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-black text-slate-900">Consulting AI Coach...</h3>
              <p className="text-slate-500 font-medium mt-2 italic">Generating custom questions for your role.</p>
           </div>
        </div>
      )}

      {/* Messaging Modal */}
      {messagingJob && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div><h3 className="text-2xl font-black text-slate-900">Message HR</h3><p className="text-sm font-bold text-emerald-600">{messagingJob.org}</p></div>
              <button onClick={() => setMessagingJob(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div className="p-8">
              {showSuccess ? (
                <div className="py-12 text-center animate-in zoom-in"><h4 className="text-2xl font-black text-slate-900">Message Sent!</h4></div>
              ) : (
                <>
                  {jobMessages.length > 0 && (
                    <div className="mb-6 space-y-3 max-h-40 overflow-y-auto pr-2">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sent History</p>
                       {jobMessages.map(m => (
                         <div key={m.id} className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-medium">
                            <span className="block font-black text-slate-400 mb-1">{m.timestamp}</span>
                            {m.text}
                         </div>
                       ))}
                    </div>
                  )}
                  <form onSubmit={handleSendMessage} className="space-y-6">
                    <textarea autoFocus required className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 h-40 resize-none" placeholder="Ask about your application status..." value={messageText} onChange={e => setMessageText(e.target.value)} />
                    <button type="submit" disabled={isSending || !messageText.trim()} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">{isSending ? 'Sending...' : 'Send Message'}</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LiveCountdown = ({ date, time, mode }: { date: string, time: string, mode: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [status, setStatus] = useState<string>('Upcoming');

  useEffect(() => {
    if (!date || !time) return;
    const updateCountdown = () => {
      const interviewDateTime = new Date(`${date}T${time}`).getTime();
      const now = new Date().getTime();
      const diff = interviewDateTime - now;
      
      if (diff > 0) {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60)
        });
        if (diff < 1000 * 60 * 60) setStatus('Starting Soon');
      } else if (diff > -1000 * 60 * 60) {
        setTimeLeft(null);
        setStatus('In Progress');
      } else {
        setTimeLeft(null);
        setStatus('Completed');
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [date, time]);

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{mode} • {mode === 'Offline' ? 'In-person' : 'Virtual'}</span>
      {timeLeft ? (
        <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${status === 'Starting Soon' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
           <div className={`w-2 h-2 rounded-full ${status === 'Starting Soon' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div>
           In: {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
        </span>
      ) : (
        <span className={`px-2 py-1 rounded text-xs font-bold ${status === 'In Progress' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
           {status}
        </span>
      )}
    </div>
  );
};

export default ApplicationTracker;


import React, { useState } from 'react';
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

export default ApplicationTracker;

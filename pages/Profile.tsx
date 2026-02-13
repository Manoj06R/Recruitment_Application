
import React, { useState, useRef } from 'react';
import { UserProfile, Experience, JobAlert, ResumeMetadata } from '../types';

interface ProfileProps {
  user: UserProfile | null;
  appliedJobIds: string[];
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, appliedJobIds, onUpdate }) => {
  if (!user) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({ fullName: user.fullName, contactEmail: user.contactEmail });
  const [newExp, setNewExp] = useState<Experience>({ role: '', company: '', period: '', desc: '' });
  const [newAlert, setNewAlert] = useState({ keyword: '', frequency: 'Daily' as any });
  
  const [mailingStatus, setMailingStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [uploading, setUploading] = useState(false);

  const handleMailResume = () => {
    setMailingStatus('sending');
    setTimeout(() => {
      setMailingStatus('sent');
      setTimeout(() => setMailingStatus('idle'), 2000);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const newResume: ResumeMetadata = {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          uploadDate: new Date().toLocaleDateString()
        };
        onUpdate({ resumes: [...(user.resumes || []), newResume] });
        setUploading(false);
      }, 1500);
    }
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAlert.keyword.trim()) {
      const alert: JobAlert = {
        id: `alert-${Date.now()}`,
        keyword: newAlert.keyword,
        frequency: newAlert.frequency,
        isActive: true
      };
      onUpdate({ jobAlerts: [...(user.jobAlerts || []), alert] });
      setNewAlert({ keyword: '', frequency: 'Daily' });
      setIsAlertModalOpen(false);
    }
  };

  const handleToggleAlert = (alertId: string) => {
    const updatedAlerts = user.jobAlerts?.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    );
    onUpdate({ jobAlerts: updatedAlerts });
  };

  const handleDeleteAlert = (alertId: string) => {
    const updatedAlerts = user.jobAlerts?.filter(alert => alert.id !== alertId);
    onUpdate({ jobAlerts: updatedAlerts });
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExp.role && newExp.company) {
      onUpdate({ experiences: [newExp, ...user.experiences] });
      setNewExp({ role: '', company: '', period: '', desc: '' });
      setIsExpModalOpen(false);
    }
  };

  const stats = [
    { label: 'Applied', value: appliedJobIds.length },
    { label: 'Interviews', value: 0 },
    { label: 'Offers', value: 0 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <div className="w-32 h-32 bg-emerald-50 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl text-emerald-600 font-bold border-4 border-emerald-50 ring-2 ring-emerald-100/30">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-black text-slate-950 mb-1 uppercase tracking-tight leading-none">{user.fullName}</h2>
            <p className="text-slate-500 font-medium mb-8 text-sm">{user.contactEmail}</p>
            <div className="space-y-3">
              <button onClick={() => setIsEditModalOpen(true)} className="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-600 transition-all shadow-sm">Edit Profile</button>
              <button 
                onClick={handleMailResume}
                disabled={mailingStatus !== 'idle'}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50"
              >
                {mailingStatus === 'idle' ? 'Mail Resume' : mailingStatus === 'sending' ? 'Sending...' : 'Resume Sent!'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Job Alerts</h3>
            <div className="space-y-3">
              {user.jobAlerts && user.jobAlerts.length > 0 ? (
                user.jobAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center group/alert">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{alert.keyword}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{alert.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => handleDeleteAlert(alert.id)} className="opacity-0 group-hover/alert:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-all">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                       <button 
                         onClick={() => handleToggleAlert(alert.id)}
                         className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${alert.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                       >
                         <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${alert.isActive ? 'right-0.5' : 'left-0.5'}`}></div>
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No active job alerts.</p>
              )}
              <button onClick={() => setIsAlertModalOpen(true)} className="w-full py-3 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:underline">Create Alert +</button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                <div className="text-3xl font-black text-emerald-600 mb-1">{stat.value}</div>
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Resumes Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Resumes & Documents</h3>
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload New +'}
                </button>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {user.resumes && user.resumes.length > 0 ? (
                user.resumes.map((resume, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 hover:border-emerald-200 transition-all">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 truncate text-sm">{resume.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{resume.size} • {resume.uploadDate}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                  <p className="text-slate-400 font-medium italic">No resumes uploaded yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Professional Experience</h3>
              <button onClick={() => setIsExpModalOpen(true)} className="text-emerald-600 font-bold text-sm hover:underline">Add Experience +</button>
            </div>
            <div className="space-y-8">
              {user.experiences.length > 0 ? (
                user.experiences.map((exp, idx) => (
                  <div key={idx} className="flex gap-4 group relative">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-emerald-600 rounded-full ring-4 ring-emerald-50 border-2 border-white"></div>
                      {idx !== user.experiences.length - 1 && <div className="w-0.5 flex-grow bg-slate-100 my-1"></div>}
                    </div>
                    <div className="pb-4 flex-grow">
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{exp.role}</h4>
                      <p className="text-sm font-bold text-emerald-500 mt-1">{exp.company} • <span className="text-slate-400 font-medium">{exp.period}</span></p>
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed whitespace-pre-line">{exp.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 font-medium italic">No experience added yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Experience Modal */}
      {isExpModalOpen && (
        <Modal title="Add Professional Experience" onClose={() => setIsExpModalOpen(false)}>
          <form onSubmit={handleAddExperience} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Job Title</label>
              <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" placeholder="e.g. Senior Product Designer" value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Company</label>
              <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" placeholder="e.g. Google" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Period</label>
              <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" placeholder="e.g. Jan 2020 - Present" value={newExp.period} onChange={e => setNewExp({...newExp, period: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <textarea rows={4} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium resize-none" placeholder="Describe your impact..." value={newExp.desc} onChange={e => setNewExp({...newExp, desc: e.target.value})} />
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-600 transition-all">Add to Profile</button>
          </form>
        </Modal>
      )}

      {/* Alert Modal */}
      {isAlertModalOpen && (
        <Modal title="Create Job Alert" onClose={() => setIsAlertModalOpen(false)}>
          <form onSubmit={handleAddAlert} className="space-y-6">
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
               <p className="text-xs font-bold text-emerald-700 leading-relaxed">Our AI will scan all new job postings and notify you immediately when a match is found for your criteria.</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keywords</label>
              <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" placeholder="Keyword (e.g. React Developer)" value={newAlert.keyword} onChange={e => setNewAlert({...newAlert, keyword: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Frequency</label>
              <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" value={newAlert.frequency} onChange={e => setNewAlert({...newAlert, frequency: e.target.value as any})}>
                <option value="Daily">Daily Notifications</option>
                <option value="Weekly">Weekly Digest</option>
              </select>
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-600 transition-all">Enable Job Alert</button>
          </form>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal title="Edit Profile Details" onClose={() => setIsEditModalOpen(false)}>
          <form onSubmit={(e) => { e.preventDefault(); onUpdate(editForm); setIsEditModalOpen(false); }} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <input className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <input className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium" value={editForm.contactEmail} onChange={e => setEditForm({...editForm, contactEmail: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl">Save Changes</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>
      </div>
      <div className="p-8 max-h-[70vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);

export default Profile;

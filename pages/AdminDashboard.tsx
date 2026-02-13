
import React, { useState } from 'react';
import { JobOpening, JobApplication, PlatformStat } from '../types';

interface AdminDashboardProps {
  jobPostings: JobOpening[];
  applicationRecords: JobApplication[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ jobPostings, applicationRecords }) => {
  const [activeTab, setActiveTab] = useState('analytics');

  const stats: PlatformStat[] = [
    { label: 'Total Placements', value: '1,284', trend: 'up' },
    { label: 'Active Recruiters', value: '412', trend: 'up' },
    { label: 'Candidate Pool', value: '12,042', trend: 'up' },
    { label: 'Monthly Revenue', value: '₹42.5L', trend: 'up' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight">Admin Control Center</h1>
          <p className="text-slate-500 font-medium mt-2">Platform-wide management and real-time governance.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {['analytics', 'cms', 'management', 'feedback'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-10">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                  <span className="text-xs font-bold text-emerald-500">+{Math.floor(Math.random() * 15)}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-950 rounded-[3rem] p-10 text-white min-h-[400px] relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-8">Platform Traffic Analysis</h3>
                  <div className="flex items-end gap-3 h-48 mb-8">
                    {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 transition-all rounded-t-lg" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Oct 01</span>
                    <span>Oct 15</span>
                    <span>Today</span>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
            </div>
            
            <div className="bg-white rounded-[3rem] p-10 border border-slate-200">
               <h3 className="text-xl font-bold text-slate-900 mb-6">Real-time Feed</h3>
               <div className="space-y-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-4 items-start pb-6 border-b border-slate-50 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">New Employer Registration</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">2 mins ago • TechFlow Ltd</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cms' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 p-10">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-950">Content Management</h3>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">Add Section +</button>
           </div>
           <div className="space-y-4">
              {['Hero Banner', 'Featured Roles', 'Testimonials', 'Partner Logos'].map(section => (
                <div key={section} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-800">{section}</span>
                  <div className="flex gap-3">
                    <button className="text-xs font-black text-emerald-600 uppercase tracking-widest">Edit</button>
                    <button className="text-xs font-black text-slate-400 uppercase tracking-widest">Hide</button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'management' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User Profile</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center font-bold">U</div>
                        <div>
                          <p className="font-bold text-slate-900">User_00{i}</p>
                          <p className="text-xs text-slate-400 font-medium">user{i}@platform.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${i % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                         {i % 2 === 0 ? 'Employer' : 'Candidate'}
                       </span>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                         <span className="text-xs font-black uppercase tracking-widest">Active</span>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <button className="text-xs font-black text-rose-600 uppercase tracking-widest hover:underline">Revoke Access</button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

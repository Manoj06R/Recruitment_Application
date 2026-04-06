
import React from 'react';
import { AccountType, UserProfile } from '../types';

interface NavProps {
  currentUser: UserProfile | null;
  onSignOut: () => void;
  navigate: (view: string) => void;
  activeView: string;
}
const Navbar: React.FC<NavProps> = ({ currentUser, onSignOut, navigate, activeView }) => {
  return (
    <nav className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button onClick={() => navigate('landing')} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 emerald-gradient rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Recruitment <span className="text-emerald-500">App</span></span>
          </button>

          {currentUser && (
            <div className="hidden md:flex items-center gap-1">
              {currentUser.accountType === AccountType.CANDIDATE ? (
                <>
                  <NavItem label="Explore" active={activeView === 'seeker-dashboard'} onClick={() => navigate('seeker-dashboard')} />
                  <NavItem label="Applications" active={activeView === 'seeker-applications'} onClick={() => navigate('seeker-applications')} />
                  <NavItem label="Saved" active={activeView === 'seeker-saved'} onClick={() => navigate('seeker-saved')} />
                  <NavItem label="Profile" active={activeView === 'seeker-profile'} onClick={() => navigate('seeker-profile')} />
                </>
              ) : currentUser.accountType === AccountType.EMPLOYER ? (
                <>
                  <NavItem label="Overview" active={activeView === 'recruiter-dashboard'} onClick={() => navigate('recruiter-dashboard')} />
                  <NavItem label="New Post" active={activeView === 'post-job'} onClick={() => navigate('post-job')} />
                  <NavItem label="Applicants" active={activeView === 'applicants'} onClick={() => navigate('applicants')} />
                </>
              ) : (
                <NavItem label="Admin Panel" active={activeView === 'admin-dashboard'} onClick={() => navigate('admin-dashboard')} />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                  {currentUser.accountType === AccountType.ADMIN ? 'Administrator' : currentUser.accountType === AccountType.EMPLOYER ? 'Hiring Manager' : 'Candidate'}
                </p>
              </div>
              <button onClick={onSignOut} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Sign Out</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('login')} className="text-sm font-bold text-slate-600 px-4 py-2">Sign In</button>
              <button onClick={() => navigate('signup')} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95">Join Now</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-all rounded-lg ${active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>{label}</button>
);

export default Navbar;

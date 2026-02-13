
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';
import JobDetail from './pages/JobDetail';
import ApplicationTracker from './pages/ApplicationTracker';
import ApplicantDetail from './pages/ApplicantDetail';
import AdminDashboard from './pages/AdminDashboard';
import { UserProfile, AccountType, JobOpening, Message, JobApplication } from './types';
import { initialJobPostings, applicationRecords as initialApps } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const [jobPostings, setJobPostings] = useState<JobOpening[]>(initialJobPostings);
  const [applications, setApplications] = useState<JobApplication[]>(initialApps);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('job-detail/')) {
        setSelectedJobId(hash.split('/')[1]);
        setCurrentPage('job-detail');
      } else if (hash.startsWith('applicant/')) {
        setSelectedAppId(hash.split('/')[1]);
        setCurrentPage('applicant-detail');
      } else if (hash) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (userData: Partial<UserProfile>) => {
    const fullUser: UserProfile = {
      uid: Math.random().toString(36).substr(2, 9),
      fullName: userData.fullName || 'Demo User',
      contactEmail: userData.contactEmail || '',
      accountType: userData.accountType || AccountType.CANDIDATE,
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      resumes: [],
      experiences: [
        { role: 'Frontend Developer', company: 'Digital Pulse', period: '2021 - Present', desc: 'Building responsive web applications.' }
      ],
      jobAlerts: [],
      ...userData
    } as UserProfile;
    
    setUser(fullUser);
    const destination = fullUser.accountType === AccountType.ADMIN 
      ? 'admin-dashboard' 
      : fullUser.accountType === AccountType.EMPLOYER 
        ? 'recruiter-dashboard' 
        : 'seeker-dashboard';
    handleNavigate(destination);
  };

  const handleLogout = () => {
    setUser(null);
    setSavedJobIds([]);
    handleNavigate('landing');
  };

  const handleApply = (jobId: string) => {
    if (!user) return;
    const isAlreadyApplied = applications.some(app => app.jobId === jobId && app.candidateId === user.uid);
    if (!isAlreadyApplied) {
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        jobId: jobId,
        candidateId: user.uid,
        candidateName: user.fullName,
        candidateEmail: user.contactEmail,
        submittedAt: new Date().toLocaleDateString(),
        reviewStatus: 'In Review',
        resumeLink: '#',
        relevanceScore: Math.floor(Math.random() * 20) + 80,
        experienceYears: 4,
      };
      setApplications(prev => [newApp, ...prev]);
      setJobPostings(prev => prev.map(j => j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j));
      handleNavigate('seeker-applications');
    }
  };

  const handleToggleSave = (jobId: string) => {
    setSavedJobIds(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (user) setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const handlePostJob = (newJob: JobOpening) => {
    setJobPostings([newJob, ...jobPostings]);
    handleNavigate('recruiter-dashboard');
  };

  const appliedJobIds = user ? applications.filter(a => a.candidateId === user.uid).map(a => a.jobId) : [];

  const renderPage = () => {
    if (!user && ['seeker-dashboard', 'recruiter-dashboard', 'seeker-saved', 'seeker-profile', 'post-job', 'applicants', 'seeker-applications', 'job-detail', 'applicant-detail', 'admin-dashboard'].includes(currentPage)) {
      return <Auth type="login" onAuthSuccess={handleAuthSuccess} onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'landing': return <Landing onNavigate={handleNavigate} />;
      case 'login': return <Auth type="login" onAuthSuccess={handleAuthSuccess} onNavigate={handleNavigate} />;
      case 'signup': return <Auth type="signup" onAuthSuccess={handleAuthSuccess} onNavigate={handleNavigate} />;
      case 'seeker-dashboard': return <SeekerDashboard jobPostings={jobPostings} appliedJobIds={appliedJobIds} savedJobIds={savedJobIds} onApply={handleApply} onToggleSave={handleToggleSave} />;
      case 'seeker-saved': return <SavedJobs jobPostings={jobPostings} appliedJobIds={appliedJobIds} savedJobIds={savedJobIds} onApply={handleApply} onToggleSave={handleToggleSave} />;
      case 'seeker-applications': return <ApplicationTracker jobPostings={jobPostings} applications={applications.filter(a => a.candidateId === user?.uid)} sentMessages={sentMessages} onSendMessage={(msg) => setSentMessages([msg, ...sentMessages])} onNavigate={handleNavigate} />;
      case 'job-detail': return <JobDetail jobId={selectedJobId} jobPostings={jobPostings} onApply={handleApply} isApplied={!!selectedJobId && appliedJobIds.includes(selectedJobId)} />;
      case 'applicant-detail': return <ApplicantDetail applicationId={selectedAppId} applicationRecords={applications} onBack={() => handleNavigate('applicants')} />;
      case 'seeker-profile': return <Profile user={user} appliedJobIds={appliedJobIds} onUpdate={handleUpdateProfile} />;
      case 'admin-dashboard': return <AdminDashboard jobPostings={jobPostings} applicationRecords={applications} />;
      case 'recruiter-dashboard':
      case 'post-job':
      case 'applicants':
        return <RecruiterDashboard jobPostings={jobPostings} applicationRecords={applications} onPostJob={handlePostJob} defaultTab={currentPage === 'post-job' ? 'create' : currentPage === 'applicants' ? 'candidates' : 'overview'} />;
      default: return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentUser={user} onSignOut={handleLogout} navigate={handleNavigate} activeView={currentPage} />
      <main className="flex-grow transition-all duration-300">{renderPage()}</main>
    </div>
  );
};

export default App;

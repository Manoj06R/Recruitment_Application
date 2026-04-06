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
import { api } from './services/api';
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [jobPostings, setJobPostings] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

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

    // Fetch initial jobs
    api.getJobs().then(setJobPostings).catch(console.error);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (user) {
      api.getApplications(user.accountType === AccountType.CANDIDATE ? { candidateId: user.uid } : undefined)
        .then(setApplications)
        .catch(console.error);
    } else {
      setApplications([]);
    }
  }, [user]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (userData: any) => {
    const fullUser: UserProfile = {
      ...userData,
      uid: userData._id || userData.uid || Math.random().toString(36).substr(2, 9),
    };

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

  const handleApply = async (jobId: string) => {
    if (!user) return;
    const isAlreadyApplied = applications.some(app => app.jobId === jobId && app.candidateId === user.uid);
    if (!isAlreadyApplied) {
      try {
        const newApp = await api.applyForJob({
          jobId,
          candidateId: user.uid,
          candidateName: user.fullName,
          candidateEmail: user.contactEmail
        });
        setApplications(prev => [newApp, ...prev]);
        setJobPostings(prev => prev.map(j => j.id === jobId ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j));
        handleNavigate('seeker-applications');
      } catch (err) {
        console.error('Application failed:', err);
        alert('Failed to apply. ' + (err as Error).message);
      }
    }
  };

  const handleToggleSave = (jobId: string) => {
    setSavedJobIds(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    // Optimistic update
    setUser(prev => prev ? { ...prev, ...updates } : null);
    
    try {
      await api.updateProfile(user.uid, updates);
    } catch (err) {
      console.error('Failed to update profile silently:', err);
    }
  };

  const handlePostJob = async (newJob: JobOpening) => {
    try {
      const created = await api.createJob(newJob);
      setJobPostings([created, ...jobPostings]);
      handleNavigate('recruiter-dashboard');
    } catch (err) {
      console.error('Failed to post job:', err);
      alert('Failed to post job.');
    }
  };

  const handleUpdateApplication = async (appId: string, updates: Partial<JobApplication>) => {
    try {
      const updatedApp = await api.updateApplication(appId, updates);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, ...updatedApp } : a));
    } catch (err) {
      console.error('Failed to update application:', err);
      alert('Failed to update application.');
    }
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
      case 'applicant-detail': return <ApplicantDetail applicationId={selectedAppId} applicationRecords={applications} onBack={() => handleNavigate('applicants')} onUpdate={handleUpdateApplication} />;
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

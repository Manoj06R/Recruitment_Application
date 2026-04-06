const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth
  async login(credentials: any) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
    return res.json();
  },
  async register(userData: any) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
    return res.json();
  },
  async updateProfile(userId: string, updates: any) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Jobs
  async getJobs() {
    const res = await fetch(`${API_URL}/jobs`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async createJob(jobData: any) {
    const res = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },

  // Applications
  async getApplications(params?: { candidateId?: string; jobId?: string }) {
    const url = new URL(`${API_URL}/applications`);
    if (params?.candidateId) url.searchParams.append('candidateId', params.candidateId);
    if (params?.jobId) url.searchParams.append('jobId', params.jobId);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  async applyForJob(applicationData: any) {
    const res = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Application failed');
    return res.json();
  },

  async updateApplication(id: string, updates: any) {
    const res = await fetch(`${API_URL}/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update application');
    return res.json();
  }
};

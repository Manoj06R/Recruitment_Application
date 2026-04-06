
export enum AccountType {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN'
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  desc: string;
}

export interface ResumeMetadata {
  name: string;
  size: string;
  uploadDate: string;
}

export interface JobAlert {
  id: string;
  keyword: string;
  frequency: 'Daily' | 'Weekly';
  isActive: boolean;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  contactEmail: string;
  accountType: AccountType;
  photoUrl?: string;
  summary?: string;
  skills: string[];
  experiences: Experience[];
  resumes: ResumeMetadata[];
  jobAlerts?: JobAlert[];
}

export interface JobOpening {
  id: string;
  position: string;
  organization: string;
  officeLocation: string;
  compensation: string;
  employmentType: 'Permanent' | 'Part-time' | 'Contract' | 'Remote Only';
  seniority: string;
  requirements: string;
  techStack: string[];
  createdAt: string;
  applicantCount: number;
  deadline?: string;
  description?: string;
  benefits?: string[];
}

export interface Message {
  id: string;
  jobId: string;
  text: string;
  timestamp: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  submittedAt: string;
  reviewStatus: 'In Review' | 'Shortlisted' | 'Declined' | 'Interview' | 'Offered';
  resumeLink: string;
  relevanceScore: number;
  experienceYears: number;
  notes?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewMode?: string;
}

export interface PlatformStat {
  label: string;
  value: string | number;
  trend: 'up' | 'down';
}

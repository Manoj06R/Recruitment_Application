
import { JobOpening, JobApplication } from './types';
export const initialJobPostings: JobOpening[] = [
  {
    id: 'job-v01',
    position: 'Lead Frontend Architect',
    organization: 'Nexus Systems',
    officeLocation: 'Bangalore, KA',
    compensation: '₹25L - ₹45L',
    employmentType: 'Remote Only',
    seniority: 'Senior/Lead',
    requirements: 'Leading the migration from legacy systems to a modern React architecture...',
    techStack: ['React', 'TypeScript', 'GraphQL', 'Tailwind'],
    createdAt: '2h ago',
    applicantCount: 12,
    description: `## About the Role
As a Lead Frontend Architect at Nexus Systems, you will be at the forefront of defining the future of our digital products. You will lead a talented team of engineers to build high-performance, scalable, and visually stunning web applications. This is a critical leadership role that combines hands-on coding with high-level architectural decision-making.

## Primary Responsibilities
- Architect and oversee the implementation of our core frontend platforms using React and TypeScript.
- Set standards for code quality, testing, and documentation across the engineering organization.
- Mentor senior and mid-level developers, fostering a culture of technical excellence.
- Collaborate closely with Product and Design leaders to translate ambitious roadmaps into robust technical solutions.

## What We're Looking For
- 8+ years of experience in frontend development, with at least 3 years in a lead or architectural capacity.
- Deep expertise in the React ecosystem (Hooks, Context, Performance Optimization).
- Strong command of TypeScript and modern CSS strategies (Tailwind, CSS-in-JS).
- Proven track record of delivering enterprise-scale applications with high availability.`,
    benefits: ['Comprehensive Health Insurance', 'Remote-first Culture', 'Annual Learning Stipend', 'Performance Bonuses']
  },
  {
    id: 'job-v02',
    position: 'UX/UI Designer',
    organization: 'Aura Design Lab',
    officeLocation: 'Chennai, TN',
    compensation: '₹12L - ₹22L',
    employmentType: 'Permanent',
    seniority: 'Mid-Senior',
    requirements: 'Crafting high-fidelity prototypes and maintaining our design system...',
    techStack: ['Figma', 'Adobe CC', 'Prototyping'],
    createdAt: '1d ago',
    applicantCount: 8,
    description: `## About the Role
Aura Design Lab is looking for a creative visionary to join our core product team. You will be responsible for creating intuitive, delightful user experiences that solve complex problems for our global user base. You'll have the opportunity to shape our design language and influence product strategy from the ground up.

## Primary Responsibilities
- Lead the end-to-end design process: from research and wireframing to high-fidelity prototyping.
- Maintain and expand our internal design system to ensure consistency across all platforms.
- Conduct user testing sessions and iterate designs based on qualitative and quantitative feedback.
- Work side-by-side with engineers to ensure design specifications are implemented with pixel-perfection.

## What We're Looking For
- A portfolio showcasing exceptional UI/UX skills and a clear design process.
- Proficiency in Figma and Adobe Creative Cloud.
- Strong understanding of user-centered design principles and accessibility standards.
- Excellent communication skills and the ability to articulate design decisions to stakeholders.`,
    benefits: ['Modern Studio Workspace', 'Generous Paid Time Off', 'Health & Wellness Perks', 'Weekly Creative Workshops']
  },
  {
    id: 'job-v03',
    position: 'Systems Engineer',
    organization: 'CoreCloud',
    officeLocation: 'Hyderabad, TS',
    compensation: '₹18L - ₹30L',
    employmentType: 'Remote Only',
    seniority: 'Intermediate',
    requirements: 'Optimizing high-throughput data pipelines and cloud infra...',
    techStack: ['Go', 'Kubernetes', 'AWS', 'Terraform'],
    createdAt: '4h ago',
    applicantCount: 4,
    description: `## About the Role
CoreCloud is looking for a Systems Engineer who is passionate about infrastructure-as-code and building resilient distributed systems. You will play a key role in managing our global cloud footprint and ensuring our services are fast, reliable, and secure.

## Primary Responsibilities
- Build and maintain automated infrastructure using Terraform and Kubernetes.
- Optimize the performance and reliability of our core data processing pipelines.
- Implement robust monitoring, alerting, and logging systems to ensure 99.9% uptime.
- Participate in an on-call rotation and lead root cause analysis for production incidents.

## What We're Looking For
- 4+ years of experience in SRE, DevOps, or Systems Engineering roles.
- Strong proficiency in Go or Python.
- Hands-on experience with AWS and container orchestration (Kubernetes).
- Deep understanding of networking, security, and Linux systems administration.`,
    benefits: ['Stock Options (ESOPs)', 'High-end Work Equipment', 'Flexible Work Hours', 'Relocation Assistance']
  },
  {
    id: 'job-v04',
    position: 'Senior Product Manager',
    organization: 'FinFlow',
    officeLocation: 'Mumbai, MH',
    compensation: '₹30L - ₹55L',
    employmentType: 'Permanent',
    seniority: 'Senior',
    requirements: 'Driving product strategy for a high-growth fintech platform...',
    techStack: ['Jira', 'Mixpanel', 'SQL', 'Product Strategy'],
    createdAt: '12h ago',
    applicantCount: 24,
    description: `## About the Role
As a Senior Product Manager at FinFlow, you will own the roadmap for our core payment infrastructure. You will work at the intersection of finance, technology, and user experience to build products that facilitate billions of transactions annually.

## Primary Responsibilities
- Define and execute the product vision for FinFlow's merchant services.
- Conduct deep market research to identify emerging trends in digital payments.
- Work with cross-functional teams including Engineering, Marketing, and Legal.
- Define KPIs and use data to measure product success and iterate rapidly.

## What We're Looking For
- 6+ years of Product Management experience, preferably in Fintech.
- Exceptional analytical skills and experience with data-driven decision making.
- Strong leadership skills with a track record of launching successful products.`,
    benefits: ['Executive Health Plan', 'Quarterly Profit Sharing', 'Flexible Travel Allowance', 'Mental Health Support']
  }
];

export const applicationRecords: JobApplication[] = [
  {
    id: 'app-991',
    jobId: 'job-v01',
    candidateId: 'user-001',
    candidateName: 'Alex Rivera',
    candidateEmail: 'alex.riv@devmail.io',
    submittedAt: 'Oct 28, 2023',
    reviewStatus: 'In Review',
    resumeLink: '#',
    relevanceScore: 94,
    experienceYears: 6
  },
  {
    id: 'app-992',
    jobId: 'job-v01',
    candidateId: 'user-002',
    candidateName: 'Jordan Smith',
    candidateEmail: 'jsmith@cloud.com',
    submittedAt: 'Oct 27, 2023',
    reviewStatus: 'Shortlisted',
    resumeLink: '#',
    relevanceScore: 89,
    experienceYears: 4
  },
  {
    id: 'app-993',
    jobId: 'job-v02',
    candidateId: 'user-003',
    candidateName: 'Sam Taylor',
    candidateEmail: 'sam.t@design.co',
    submittedAt: 'Oct 29, 2023',
    reviewStatus: 'Interview',
    resumeLink: '#',
    relevanceScore: 92,
    experienceYears: 7
  }
];

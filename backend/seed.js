const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Job = require('./models/Job');

dotenv.config();

const seedJobs = [
  {
    position: 'Lead Frontend Architect',
    organization: 'Nexus Systems',
    officeLocation: 'Bangalore, KA',
    compensation: '₹25L - ₹45L',
    employmentType: 'Remote Only',
    seniority: 'Senior/Lead',
    requirements: 'Leading the migration from legacy systems to a modern React architecture...',
    techStack: ['React', 'TypeScript', 'GraphQL', 'Tailwind'],
    applicantCount: 12,
    description: `## About the Role
As a Lead Frontend Architect at Nexus Systems, you will be at the forefront of defining the future of our digital products. You will lead a talented team of engineers to build high-performance, scalable, and visually stunning web applications.

## Primary Responsibilities
- Architect and oversee the implementation of our core frontend platforms using React and TypeScript.
- Set standards for code quality, testing, and documentation across the engineering organization.
- Mentor senior and mid-level developers, fostering a culture of technical excellence.

## What We're Looking For
- 8+ years of experience in frontend development, with at least 3 years in a lead or architectural capacity.
- Deep expertise in the React ecosystem (Hooks, Context, Performance Optimization).
- Strong command of TypeScript and modern CSS strategies (Tailwind, CSS-in-JS).`,
    benefits: ['Comprehensive Health Insurance', 'Remote-first Culture', 'Annual Learning Stipend', 'Performance Bonuses'],
  },
  {
    position: 'UX/UI Designer',
    organization: 'Aura Design Lab',
    officeLocation: 'Chennai, TN',
    compensation: '₹12L - ₹22L',
    employmentType: 'Permanent',
    seniority: 'Mid-Senior',
    requirements: 'Crafting high-fidelity prototypes and maintaining our design system...',
    techStack: ['Figma', 'Adobe CC', 'Prototyping'],
    applicantCount: 8,
    description: `## About the Role
Aura Design Lab is looking for a creative visionary to join our core product team. You will be responsible for creating intuitive, delightful user experiences.

## Primary Responsibilities
- Lead the end-to-end design process: from research and wireframing to high-fidelity prototyping.
- Maintain and expand our internal design system to ensure consistency across all platforms.
- Conduct user testing sessions and iterate designs based on feedback.`,
    benefits: ['Modern Studio Workspace', 'Generous Paid Time Off', 'Health & Wellness Perks', 'Weekly Creative Workshops'],
  },
  {
    position: 'Systems Engineer',
    organization: 'CoreCloud',
    officeLocation: 'Hyderabad, TS',
    compensation: '₹18L - ₹30L',
    employmentType: 'Remote Only',
    seniority: 'Intermediate',
    requirements: 'Optimizing high-throughput data pipelines and cloud infra...',
    techStack: ['Go', 'Kubernetes', 'AWS', 'Terraform'],
    applicantCount: 4,
    description: `## About the Role
CoreCloud is looking for a Systems Engineer who is passionate about infrastructure-as-code and building resilient distributed systems.

## Primary Responsibilities
- Build and maintain automated infrastructure using Terraform and Kubernetes.
- Optimize the performance and reliability of our core data processing pipelines.
- Implement robust monitoring, alerting, and logging systems.`,
    benefits: ['Stock Options (ESOPs)', 'High-end Work Equipment', 'Flexible Work Hours', 'Relocation Assistance'],
  },
  {
    position: 'Senior Product Manager',
    organization: 'FinFlow',
    officeLocation: 'Mumbai, MH',
    compensation: '₹30L - ₹55L',
    employmentType: 'Permanent',
    seniority: 'Senior',
    requirements: 'Driving product strategy for a high-growth fintech platform...',
    techStack: ['Jira', 'Mixpanel', 'SQL', 'Product Strategy'],
    applicantCount: 24,
    description: `## About the Role
As a Senior Product Manager at FinFlow, you will own the roadmap for our core payment infrastructure.

## Primary Responsibilities
- Define and execute the product vision for FinFlow's merchant services.
- Conduct deep market research to identify emerging trends in digital payments.
- Work with cross-functional teams including Engineering, Marketing, and Legal.`,
    benefits: ['Executive Health Plan', 'Quarterly Profit Sharing', 'Flexible Travel Allowance', 'Mental Health Support'],
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    // Insert seed data
    const inserted = await Job.insertMany(seedJobs);
    console.log(`🌱 Seeded ${inserted.length} jobs successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();

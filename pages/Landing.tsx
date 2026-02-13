import React from 'react';

const Landing: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold mb-6 border border-emerald-100 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Next-Gen Hiring Platform
              </div>

              <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.1] mb-8">
                The bridge between <span className="text-emerald-500">ambition</span> and <span className="text-slate-400 italic">excellence.</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg font-medium">
                Recruitment App leverages localized matching and advanced content assistance to streamline your recruitment lifecycle.
                Built by developers, for professionals.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('seeker-dashboard')}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 active:scale-95"
                >
                  Find New Role
                </button>

                <button
                  onClick={() => onNavigate('post-job')}
                  className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition active:scale-95"
                >
                  Hire Talent
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl rotate-2">
                <div className="bg-slate-800 rounded-[1.8rem] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                    className="opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
                    alt="Modern Workplace"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-slate-950 mb-6">
              Engineered for Velocity
            </h2>
            <p className="text-slate-500 font-medium">
              We've removed the friction from traditional hiring systems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <FeatureCard
              title="Smart Drafting"
              desc="Our integrated ContentEngine helps hiring managers draft world-class job descriptions in seconds."
              icon={
                <>
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7" />
                  <path d="M18.5 2.5a2.121 2.121 0 01..." />
                </>
              }
            />

            <FeatureCard
              title="Verified Matching"
              desc="Proprietary scoring ensures that candidates are only notified of roles that match their career trajectory."
              icon={<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            />

            <FeatureCard
              title="Career Mapping"
              desc="Detailed profiling tools for candidates to showcase their evolution, not just their current skills."
              icon={<path d="M9 20l-5.447-2.724A2 2 0 013 15.483V8.517a2 2 0 011.553-1.943L9 4m0 16V4" />}
            />

          </div>
        </div>
      </section>

    </div>
  );
};

const FeatureCard = ({
  title,
  desc,
  icon
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
    <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
    </div>

    <h3 className="text-xl font-extrabold text-slate-950 mb-4">
      {title}
    </h3>

    <p className="text-slate-500 leading-relaxed text-sm font-medium">
      {desc}
    </p>
  </div>
);

export default Landing;

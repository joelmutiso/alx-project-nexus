import { Search, ShieldCheck, Zap, BarChart, Users2, Globe } from 'lucide-react';

const features = [
  {
    title: "Smart Job Matching",
    description: "Our intelligent algorithm matches your skills and preferences with the most relevant opportunities, saving you hours of searching.",
    icon: <Search className="text-[#067a62]" size={24} />,
  },
  {
    title: "Verified Companies",
    description: "Every employer on TalentBridge is verified, ensuring you only connect with legitimate, quality organizations.",
    icon: <ShieldCheck className="text-[#067a62]" size={24} />,
  },
  {
    title: "One-Click Apply",
    description: "Submit applications instantly with your saved profile. No more filling out the same information repeatedly.",
    icon: <Zap className="text-[#067a62]" size={24} />,
  },
  {
    title: "Application Tracking",
    description: "Monitor every application status in real-time from your personal dashboard. Never miss an update.",
    icon: <BarChart className="text-[#067a62]" size={24} />,
  },
  {
    title: "Talent Pipeline",
    description: "Employers can build and manage a pipeline of qualified candidates, streamlining the hiring workflow.",
    icon: <Users2 className="text-[#067a62]" size={24} />,
  },
  {
    title: "Remote-First",
    description: "Access opportunities worldwide with advanced location and remote-work filters built right in.",
    icon: <Globe className="text-[#067a62]" size={24} />,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Everything you need to hire and get hired
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-16">
          A complete suite of tools designed for modern recruiting, from discovery to onboarding.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-2xl border border-gray-100 bg-[#f9fafb]/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 text-left"
            >
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
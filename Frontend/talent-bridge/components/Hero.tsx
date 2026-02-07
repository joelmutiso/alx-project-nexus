import { Search, Briefcase, ArrowRight, TrendingUp, Users, Building2, BarChart3 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-16 pb-20 px-4">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#e1f2ef,rgba(255,255,255,0))] -z-10" />

      <div className="max-w-7xl mx-auto text-center">
        {/* Jobs Badge */}
        <div className="inline-flex items-center gap-2 bg-[#eef6f4] text-[#067a62] px-4 py-1.5 rounded-full text-sm font-semibold mb-10 border border-[#d1e7e2]">
          <TrendingUp size={16} />
          12,000+ jobs posted this month
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#111827] mb-6 tracking-tight">
          Where Talent Meets <span className="text-[#067a62]">Opportunity</span>
        </h1>

        <p className="max-w-3xl mx-auto text-[#4b5563] text-lg md:text-xl mb-10 leading-relaxed font-medium">
          TalentBridge connects exceptional professionals with innovative companies. Whether you 
          are seeking your next role or building your dream team, this is where great careers begin.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#067a62] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-md active:scale-95">
            <Search size={20} />
            Find Work
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] px-8 py-4 rounded-xl font-bold hover:bg-[#f9fafb] transition-all active:scale-95">
            <Briefcase size={20} />
            Post a Job
            <ArrowRight size={18} />
          </button>
        </div>

        {/*  Stats Grid (Feature 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <StatCard 
            icon={<Users className="text-[#067a62]" size={24} />} 
            value="85K+" 
            label="Active Candidates" 
          />
          <StatCard 
            icon={<Building2 className="text-[#067a62]" size={24} />} 
            value="4,200+" 
            label="Companies Hiring" 
          />
          <StatCard 
            icon={<Briefcase className="text-[#067a62]" size={24} />} 
            value="32K+" 
            label="Jobs Available" 
          />
          <StatCard 
            icon={<BarChart3 className="text-[#067a62]" size={24} />} 
            value="94%" 
            label="Success Rate" 
          />
        </div>
      </div>
    </section>
  );
}

// Reusable StatCard Component (with TypeScript)
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center">
      <div className="bg-[#f0f9f7] p-3 rounded-xl mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}
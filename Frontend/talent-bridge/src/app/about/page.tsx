import React from 'react';
import Link from 'next/link';
import { Users, Globe, Award, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0f172a] py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">About TalentBridge</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          We are on a mission to connect the world's best talent with the companies building the future.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Bridging the Gap</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Founded in 2024, TalentBridge was born from a simple observation: great companies struggle to find talent, and great talent struggles to find the right opportunities. We built a platform that removes the friction from hiring.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Whether you are a startup looking for your first engineer or a candidate searching for your dream remote role, we provide the tools, transparency, and speed you need.
            </p>
            
          </div>
          
          {/* 🚀 ADDED: Real Images from Unsplash */}
          <div className="grid grid-cols-2 gap-4">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" 
               alt="Team collaboration" 
               className="h-64 rounded-2xl w-full object-cover shadow-lg"
             />
             <img 
               src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" 
               alt="Modern office meeting" 
               className="h-64 rounded-2xl w-full object-cover shadow-lg mt-8"
             />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <StatCard icon={<Users className="mx-auto mb-4 text-[#067a62]" size={32}/>} value="50k+" label="Active Candidates" />
            <StatCard icon={<Globe className="mx-auto mb-4 text-[#067a62]" size={32}/>} value="120+" label="Countries" />
            <StatCard icon={<Award className="mx-auto mb-4 text-[#067a62]" size={32}/>} value="98%" label="Success Rate" />
            <StatCard icon={<Heart className="mx-auto mb-4 text-[#067a62]" size={32}/>} value="10k+" label="Matches Made" />
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-[#0f172a] rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            {/* Decorative background blur */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 pointer-events-none"></div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif relative z-10">
                Ready to bridge the gap?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg relative z-10">
                Join thousands of professionals and companies already using TalentBridge to connect, grow, and succeed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                {/* Button 1: Get Started for Free -> /register */}
                <Link 
                    href="/register" 
                    className="px-8 py-3 bg-[#067a62] hover:bg-[#056350] text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                >
                    Get Started for Free
                    <ArrowRight size={18} />
                </Link>

                {/* Button 2: Browse Jobs -> /jobs */}
                <Link 
                    href="/jobs" 
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    Browse Jobs
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {icon}
      <div className="text-3xl font-bold text-gray-900 mb-1 font-serif">{value}</div>
      <div className="text-gray-500 font-medium">{label}</div>
    </div>
  );
}
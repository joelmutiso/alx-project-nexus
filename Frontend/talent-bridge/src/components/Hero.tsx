import React from 'react';
import Link from 'next/link';
import { Search, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative w-full min-h-screen flex items-center pt-20 overflow-hidden bg-[#0f172a]">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* 🚀 FIX: Using a reliable online image URL to guarantee it works for your demo. 
            This avoids all local file path/extension issues. */}
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" 
          alt="Office Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-300 font-medium text-sm mb-6 backdrop-blur-sm">
            #1 Job Board for Tech Talent
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
            Find your dream <br />
            <span className="text-[#067a62] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              career today.
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Connect with top employers and opportunities. Whether you're looking for your next role or the perfect candidate, we bridge the gap.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* 1. Browse Jobs -> /jobs */}
            <Link 
              href="/jobs" 
              className="px-8 py-4 bg-[#067a62] hover:bg-[#056350] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Browse Jobs
            </Link>
            
            {/* 2. Post a Job -> /post-job */}
            <Link 
              href="/post-job" 
              className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              Post a Job
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-gray-500 text-sm font-medium">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> 500+ New Jobs</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Trusted by Leaders</span>
          </div>
        </div>

        {/* Right Content (Floating Card) */}
        <div className="flex-1 hidden lg:block relative">
           <div className="relative w-full max-w-lg mx-auto bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              <div className="bg-white rounded-xl p-6 shadow-xl mb-4 transform -rotate-2">
                 <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">M</div>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-xs">Active</span>
                 </div>
                 <h3 className="font-bold text-gray-900 text-lg">Senior Product Designer</h3>
                 <p className="text-gray-500 text-sm">$120k - $160k • Remote</p>
                 <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                       <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                       <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                    </div>
                    {/* 3. Get Started Free -> /register */}
                    <Link href="/register" className="text-sm font-bold text-[#067a62] hover:underline">Get Started Free &rarr;</Link>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto bg-[#111827] rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#067a62] opacity-10 blur-[100px] -z-0" />
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to bridge the gap?
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of professionals and companies already using TalentBridge to connect, grow, and succeed.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* 1. Get Started for Free -> /register */}
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-[#067a62] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#056350] transition-all flex items-center justify-center gap-2"
            >
              Get Started for Free
              <ArrowRight size={20} />
            </Link>

            {/* 2. Browse Jobs -> /jobs */}
            <Link 
              href="/jobs" 
              className="w-full sm:w-auto bg-transparent text-white border border-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
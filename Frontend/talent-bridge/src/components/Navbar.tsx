'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, UserPlus, Briefcase } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // 🚀 UPDATED: Added '/about' to the list of pages hiding auth buttons
  const hideAuthButtons = ['/jobs', '/post-job', '/about'].includes(pathname);

  return (
    <nav 
      className={`w-full z-50 transition-all duration-300 ${
        isHomePage 
          ? 'absolute top-0 left-0 bg-transparent py-6' 
          : 'sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#067a62] p-1.5 rounded-lg">
              <Briefcase className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isHomePage ? 'text-white' : 'text-gray-900'}`}>
              TalentBridge
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {[
              { name: 'Find Work', href: '/jobs' },
              { name: 'Post a Job', href: '/post-job' },
              { name: 'Candidate', href: '/candidate' },
              { name: 'Employer', href: '/employer' },
            ].map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`text-[15px] font-medium transition-colors ${
                  isHomePage 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-gray-600 hover:text-[#067a62]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions - Hidden on /jobs, /post-job, and /about */}
          {!hideAuthButtons && (
            <div className="flex items-center gap-6">
              <Link 
                href="/login" 
                className={`flex items-center gap-2 text-[15px] font-semibold transition-colors ${
                  isHomePage 
                    ? 'text-white hover:text-emerald-300' 
                    : 'text-gray-700 hover:text-[#067a62]'
                }`}
              >
                <LogIn size={18} />
                Log In
              </Link>

              <Link 
                href="/register" 
                className="flex items-center gap-2 bg-[#067a62] text-white px-5 py-2.5 rounded-xl text-[15px] font-bold hover:bg-[#056350] transition-all shadow-md active:scale-95"
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
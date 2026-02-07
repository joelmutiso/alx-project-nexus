import Link from 'next/link';
import { LogIn, UserPlus, Briefcase } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#067a62] p-1.5 rounded-lg">
              <Briefcase className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">TalentBridge</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/jobs" className="text-[15px] font-medium text-gray-600 hover:text-[#067a62]">Find Work</Link>
            <Link href="/post-job" className="text-[15px] font-medium text-gray-600 hover:text-[#067a62]">Post a Job</Link>
            <Link href="/candidate" className="text-[15px] font-medium text-gray-600 hover:text-[#067a62]">Candidate</Link>
            <Link href="/employer" className="text-[15px] font-medium text-gray-600 hover:text-[#067a62]">Employer</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link href="/login" className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 hover:text-[#067a62]">
              <LogIn size={18} />
              Log In
            </Link>
            <Link 
              href="/register" 
              className="flex items-center gap-2 bg-[#067a62] text-white px-5 py-2.5 rounded-xl text-[15px] font-bold hover:bg-[#056350] transition-all shadow-sm"
            >
              <UserPlus size={18} />
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
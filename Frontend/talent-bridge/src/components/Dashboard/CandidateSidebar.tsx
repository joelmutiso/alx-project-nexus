'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Search, LogOut, Briefcase, User, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/candidate', icon: LayoutDashboard },
  { name: 'Applications', href: '/candidate/applications', icon: FileText },
  { name: 'Profile', href: '/candidate/profile', icon: User },
  { name: 'Find Work', href: '/jobs', icon: Search },
];

export default function CandidateSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  // Close sidebar when a link is clicked (mobile UX)
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* --- Mobile Header & Toggle Button --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3 flex justify-between items-center h-16 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#067a62] p-1.5 rounded-lg">
             <Briefcase className="text-white" size={20} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">TalentBridge</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Overlay (Mobile Only) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:top-0
          ${/* Add padding top on mobile to account for the header if needed, or just cover it */ ''}
        `}
      >
        <div>
          {/* Logo Section (Hidden on Mobile since we have the Mobile Header) */}
          <div className="hidden md:block p-6 border-b border-gray-100">
             <Link href="/" className="flex items-center gap-2">
               <div className="bg-[#067a62] p-1.5 rounded-lg">
                 <Briefcase className="text-white" size={20} strokeWidth={2.5} />
               </div>
               <span className="text-xl font-bold text-gray-900 tracking-tight">TalentBridge</span>
             </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 mt-16 md:mt-0"> {/* mt-16 on mobile pushes it down below header area if visible */}
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Candidate
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick} // Close menu on click
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[#067a62] text-white shadow-md shadow-emerald-900/10' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
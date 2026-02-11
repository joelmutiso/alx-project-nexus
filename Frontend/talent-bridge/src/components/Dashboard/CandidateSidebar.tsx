'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Search, LogOut, Briefcase, User } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/candidate', icon: LayoutDashboard },
  { name: 'Applications', href: '/candidate/applications', icon: FileText },
  { name: 'Profile', href: '/candidate/profile', icon: User }, // Added Profile Link
  { name: 'Find Work', href: '/jobs', icon: Search },
];

export default function CandidateSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 flex flex-col justify-between z-40">
      <div>
        <div className="p-6 border-b border-gray-100">
           <Link href="/" className="flex items-center gap-2">
             <div className="bg-[#067a62] p-1.5 rounded-lg">
               <Briefcase className="text-white" size={20} strokeWidth={2.5} />
             </div>
             <span className="text-xl font-bold text-gray-900 tracking-tight">TalentBridge</span>
           </Link>
        </div>

        <nav className="p-4 space-y-1">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Candidate
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
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
  );
}
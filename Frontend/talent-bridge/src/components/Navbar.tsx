'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, UserPlus, Briefcase, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check auth status on mount and when pathname changes
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_first_name');
    setIsLoggedIn(false);
    router.push('/');
  };

  const hideEntireNavbar = ['/login', '/register', '/onboarding', '/google-sync', '/forgot-password', '/reset-password-confirm'].includes(pathname);
  
  if (hideEntireNavbar) return null;

  const isHomePage = pathname === '/';

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

          {/* Dynamic Center Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link 
              href="/jobs" 
              className={`text-[15px] font-medium transition-colors ${isHomePage ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-[#067a62]'}`}
            >
              Find Work
            </Link>
            <Link 
              href="/employer/jobs/create" 
              className={`text-[15px] font-medium transition-colors ${isHomePage ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-[#067a62]'}`}
            >
              Post a Job
            </Link>
            
            {isLoggedIn && (
              <Link 
                href={userRole === 'employer' ? '/employer' : '/candidate'} 
                className={`text-[15px] font-medium transition-colors ${isHomePage ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-[#067a62]'}`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link 
                  href="/login" 
                  className={`flex items-center gap-2 text-[15px] font-semibold transition-colors ${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-[#067a62]'}`}
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Log In</span>
                </Link>

                <Link 
                  href="/register" 
                  className="flex items-center gap-2 bg-[#067a62] text-white px-5 py-2.5 rounded-xl text-[15px] font-bold hover:bg-[#056350] transition-all shadow-md active:scale-95"
                >
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className={`flex items-center gap-2 text-[15px] font-semibold transition-colors ${isHomePage ? 'text-white hover:text-red-300' : 'text-gray-700 hover:text-red-600'}`}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
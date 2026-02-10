'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 1. Pages where we hide the Navbar/Footer (Auth pages)
  const isAuthPage = pathname === '/register' || pathname === '/login';

  // 2. Pages where we hide the Navbar/Footer (Dashboard pages)
  // Check if path starts with /candidate or /employer
  const isDashboard = pathname.startsWith('/candidate') || pathname.startsWith('/employer');

  const showLayout = !isAuthPage && !isDashboard;

  return (
    <>
      {showLayout && <Navbar />}
      {children}
      {showLayout && <Footer />}
    </>
  );
}
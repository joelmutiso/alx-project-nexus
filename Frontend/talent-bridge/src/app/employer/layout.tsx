'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Get the token from storage (or cookies, depending on your setup)
    // MAKE SURE 'token' matches the key you used when they logged in!
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    
    // 2. You can also check for a user role if you save it
    // const userRole = localStorage.getItem('user_role');

    if (!token) {
      // 3. If not logged in, kick them to login
      // 'redirect' parameter helps send them back here after they login
      router.push('/login?redirect=/employer');
    } else {
      // 4. If logged in, allow them to see the page
      setIsAuthorized(true);
    }
  }, [router]);

  // 5. Show a loading spinner while we check their login status
  // This prevents the "flash" of protected content before redirecting
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
        <p className="text-gray-500 mt-4 font-medium">Verifying access...</p>
      </div>
    );
  }

  // 6. Render the actual page (Dashboard or Create Job)
  return <>{children}</>;
}
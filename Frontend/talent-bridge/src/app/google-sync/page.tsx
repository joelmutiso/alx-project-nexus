'use client';

import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import useSWR from 'swr';
import api from '@/lib/axios';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function GoogleSyncPage() {
  const [status, setStatus] = useState("Verifying Google account...");
  const [backendToken, setBackendToken] = useState<string | null>(null);

  const { data: employer, error: employerErr } = useSWR(
    backendToken ? 'auth/employer/profile/' : null, 
    fetcher, 
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  const { data: candidate, error: candidateErr } = useSWR(
    backendToken && employerErr ? 'auth/candidate/profile/' : null, 
    fetcher, 
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  useEffect(() => {
    const syncWithDjango = async () => {
      try {
        const session: any = await getSession();

        if (!session?.accessToken) {
          setStatus("Google login failed. Redirecting...");
          setTimeout(() => window.location.href = '/login', 2000);
          return;
        }

        setStatus("Syncing with TalentBridge...");
        const res = await api.post('auth/google/', {
          access_token: session.accessToken
        });

        const token = res.data.access || res.data.access_token || res.data.key || res.data.token;
        if (token) {
          localStorage.setItem('access_token', token);
          if (res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh);
          setBackendToken(token);
        }
      } catch (error) {
        console.error("Django Sync Error:", error);
        setStatus("Authentication failed. Redirecting...");
        setTimeout(() => window.location.href = '/login', 3000);
      }
    };

    syncWithDjango();
  }, []);

  useEffect(() => {
    if (employer) {
      localStorage.setItem('user_role', 'employer');
      window.location.href = '/employer';
    } else if (candidate) {
      localStorage.setItem('user_role', 'candidate');
      window.location.href = '/candidate';
    } else if (employerErr && candidateErr) {
      // Both profile requests failed - redirect to onboarding
      window.location.href = '/onboarding';
    }
  }, [employer, candidate, employerErr, candidateErr]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 w-full">
      <div className="text-center space-y-6">
        <div className="w-12 h-12 border-4 border-[#067a62] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2 className="text-xl font-bold text-gray-700">{status}</h2>
      </div>
    </div>
  );
}
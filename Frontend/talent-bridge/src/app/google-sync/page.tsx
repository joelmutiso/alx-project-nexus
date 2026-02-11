'use client';

import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import api from '@/lib/axios';

export default function GoogleSyncPage() {
  const [status, setStatus] = useState("Verifying Google account...");

  useEffect(() => {
    const syncWithDjango = async () => {
      try {
        const session: any = await getSession();

        if (!session || !session.accessToken) {
          setStatus("Google login failed. Redirecting...");
          setTimeout(() => window.location.href = '/login', 2000);
          return;
        }

        setStatus("Connecting to TalentBridge backend...");

        const res = await api.post('auth/google/', {
          access_token: session.accessToken
        });

        console.log("Google Auth Backend Response:", res.data);

        const accessToken = res.data.access || res.data.access_token || res.data.key || res.data.token;
        const refreshToken = res.data.refresh || res.data.refresh_token;

        if (!accessToken) {
          console.error("Backend did not return a recognizable token!");
          setStatus("Authentication failed. Redirecting...");
          setTimeout(() => window.location.href = '/login', 3000);
          return;
        }

        // Save the tokens safely!
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

        setStatus("Routing to your dashboard...");

        try {
          // Test 1: Are they an Employer?
          await api.get('auth/employer/profile/', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          localStorage.setItem('user_role', 'employer');
          window.location.href = '/employer';
        } catch (employerError) {
          
          try {
            // Test 2: Are they a Candidate?
            await api.get('auth/candidate/profile/', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            localStorage.setItem('user_role', 'candidate');
            window.location.href = '/candidate';
          } catch (candidateError) {
            // Test 3: Neither profile exists! They are brand new.
            window.location.href = '/onboarding';
          }
        }

      } catch (error) {
        console.error("Django Sync Error:", error);
        setStatus("Could not sync with backend. Redirecting...");
        setTimeout(() => window.location.href = '/login', 3000);
      }
    };

    syncWithDjango();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 w-full">
      <div className="text-center space-y-6">
        <div className="w-12 h-12 border-4 border-[#067a62] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2 className="text-xl font-bold text-gray-700 animate-pulse">{status}</h2>
      </div>
    </div>
  );
}
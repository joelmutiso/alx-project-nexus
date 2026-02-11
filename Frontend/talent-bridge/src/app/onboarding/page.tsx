'use client';

import React, { useState } from 'react';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'employer' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelection = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setError("Authentication error. Please log in again.");
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }

      await api.patch('dj-rest-auth/user/', {
        is_candidate: selectedRole === 'candidate',
        is_employer: selectedRole === 'employer'
      });

      localStorage.setItem('user_role', selectedRole);
      window.location.href = `/${selectedRole}`;

    } catch (err: any) {
      console.error("Failed to set role:", err);
      setError("Failed to save your choice. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8">
        
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome to TalentBridge!</h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            We are excited to have you on board. To give you the best experience, tell us what brings you here today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          
          <div 
            onClick={() => setSelectedRole('candidate')}
            className={`cursor-pointer bg-white p-8 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
              selectedRole === 'candidate' 
                ? 'border-[#067a62] shadow-emerald-900/10 shadow-lg scale-[1.02]' 
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
              selectedRole === 'candidate' ? 'bg-[#067a62] text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <User size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Candidate</h3>
            <p className="text-gray-500 leading-relaxed">
              I want to discover exciting job opportunities, build my professional profile, and connect with top companies.
            </p>
          </div>

          <div 
            onClick={() => setSelectedRole('employer')}
            className={`cursor-pointer bg-white p-8 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
              selectedRole === 'employer' 
                ? 'border-[#067a62] shadow-emerald-900/10 shadow-lg scale-[1.02]' 
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
              selectedRole === 'employer' ? 'bg-[#067a62] text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <Briefcase size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm an Employer</h3>
            <p className="text-gray-500 leading-relaxed">
              I want to post job openings, manage applications, and discover the best talent to grow my team.
            </p>
          </div>

        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center pt-6">
          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isSubmitting}
            className="bg-[#067a62] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? "Setting up your account..." : "Continue to Dashboard"}
            <ArrowRight size={22} />
          </button>
        </div>

      </div>
    </div>
  );
}
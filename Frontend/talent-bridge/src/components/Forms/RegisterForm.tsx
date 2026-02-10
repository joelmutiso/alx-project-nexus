'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/validations/authSchema';
import { Mail, Lock, User, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/axios'; 

export default function RegisterForm() {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError('');
    try {
      const payload = {
        email: data.email,
        username: data.email, 
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        is_candidate: role === 'candidate',
        is_employer: role === 'employer',
      };

      console.log("Sending Payload:", payload);

      await api.post('auth/register/', payload);
      
      // Redirect to login on success
      window.location.href = '/login?registered=true';

    } catch (err: any) {
      console.error("Registration Error", err);
      // Try to capture the specific error message from the backend
      const errorMessage = err.response?.data?.username?.[0] || 
                           err.response?.data?.email?.[0] || 
                           err.response?.data?.detail || 
                           "Registration failed. Please try again.";
      setServerError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* LEFT SIDE: Dark Branding Panel */}
      <div className="hidden lg:flex w-[40%] bg-[#0f172a] flex-col justify-between p-12 text-white">
        
        <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-90 transition-opacity">
           <div className="bg-[#067a62] p-2 rounded-lg text-white">
             <Briefcase size={22} strokeWidth={2.5} />
           </div>
           <span className="text-xl font-bold tracking-tight">TalentBridge</span>
        </Link>
        
        <div className="mb-20">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Start your journey today.</h1>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            Create your free account and unlock a world of career opportunities or find the perfect candidates for your team.
          </p>
        </div>

        <p className="text-gray-600 text-sm">2026 TalentBridge. All rights reserved.</p>
      </div>

      {/* RIGHT SIDE: Form Panel */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-500 mb-8 font-medium">
            Already have an account? <Link href="/login" className="text-[#067a62] font-semibold hover:underline">Log in</Link>
          </p>

          {/* CANDIDATE / EMPLOYER TOGGLE */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => setRole('candidate')} 
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                role === 'candidate' 
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User size={18}/> Candidate
            </button>
            <button 
              type="button"
              onClick={() => setRole('employer')} 
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                role === 'employer' 
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase size={18}/> Employer
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-semibold text-gray-700">First Name</label>
                <input {...register('first_name')} placeholder="Jane" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#067a62] focus:ring-1 focus:ring-[#067a62] transition-all bg-white" />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                <input {...register('last_name')} placeholder="Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#067a62] focus:ring-1 focus:ring-[#067a62] transition-all bg-white" />
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input {...register('email')} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#067a62] focus:ring-1 focus:ring-[#067a62] transition-all bg-white" />
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  {...register('password')} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a strong password" 
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#067a62] focus:ring-1 focus:ring-[#067a62] transition-all bg-white" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {serverError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100">
                {serverError}
              </div>
            )}

            <button 
              disabled={isSubmitting} 
              className="w-full bg-[#067a62] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : `Create ${role === 'candidate' ? 'Candidate' : 'Employer'} Account`}
              <ArrowRight size={20}/>
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-6">
              By creating an account, you agree to our <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
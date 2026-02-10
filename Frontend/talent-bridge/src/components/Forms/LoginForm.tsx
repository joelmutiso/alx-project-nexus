'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/authSchema';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Briefcase } from 'lucide-react';
import api from '@/lib/axios';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError('');
    try {
      // 🚀 FIXED: Changed key from 'username' to 'email' to match backend expectation
      const loginResponse = await api.post('auth/login/', {
        username: data.email,
        email: data.email, 
        password: data.password,
      });

      // 2. SAVE TOKENS
      // Check for 'access' or 'token' depending on what the backend returns
      const accessToken = loginResponse.data.access || loginResponse.data.token;
      const refreshToken = loginResponse.data.refresh;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        
        // 3. FETCH USER PROFILE (To get the Role)
        try {
          const userResponse = await api.get('auth/me/');
          const user = userResponse.data;

          // Determine Role & Redirect
          if (user.is_employer) {
            localStorage.setItem('user_role', 'employer');
            window.location.href = '/employer';
          } else {
            localStorage.setItem('user_role', 'candidate');
            window.location.href = '/candidate';
          }

        } catch (profileError) {
          console.error("Profile Fetch Error", profileError);
          // Fallback: If fetching profile fails, default to candidate dashboard
          window.location.href = '/candidate';
        }

      } else {
        setServerError("Login successful but no access token received.");
      }

    } catch (err: any) {
      console.error("Login Error", err);
      // Handle "401 Unauthorized" specifically
      if (err.response?.status === 401) {
        setServerError("Invalid email or password.");
      } else {
        setServerError(err.response?.data?.detail || "Something went wrong. Please check your connection.");
      }
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
          <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome back.</h1>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            Log in to access your dashboard, manage your applications, or post your next big opportunity.
          </p>
        </div>

        <p className="text-gray-600 text-sm">2026 TalentBridge. All rights reserved.</p>
      </div>

      {/* RIGHT SIDE: Form Panel */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Log in to your account</h2>
          <p className="text-gray-500 mb-8 font-medium">
            Don't have an account? <Link href="/register" className="text-[#067a62] font-semibold hover:underline">Sign up</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1 relative">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  {...register('email')} 
                  placeholder="you@example.com" 
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#067a62] focus:ring-1 focus:ring-[#067a62] transition-all bg-white" 
                />
              </div>
            </div>

            <div className="space-y-1 relative">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-sm text-[#067a62] hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  {...register('password')} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#067a62] focus:ring-1 focus:ring-[#067a62] transition-all bg-white" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {serverError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100 flex items-center gap-2">
                <span>⚠️</span> {serverError}
              </div>
            )}

            <button 
              disabled={isSubmitting} 
              className="w-full bg-[#067a62] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
              <ArrowRight size={20}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
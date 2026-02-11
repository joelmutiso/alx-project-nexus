'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/authSchema';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Briefcase } from 'lucide-react';
import api from '@/lib/axios';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError('');
    try {
      const loginResponse = await api.post('auth/login/', {
        username: data.email,
        email: data.email, 
        password: data.password,
      });

      const accessToken = loginResponse.data.access || loginResponse.data.token;
      const refreshToken = loginResponse.data.refresh;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        
        // Grab the redirect URL from the browser if it exists
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get('redirect');

        try {
          await api.get('auth/employer/profile/', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          
          localStorage.setItem('user_role', 'employer');
          window.location.href = redirectUrl || '/employer';

        } catch (profileError: any) {
          if (profileError.response?.status === 403 || profileError.response?.status === 404) {
            localStorage.setItem('user_role', 'candidate');
            window.location.href = redirectUrl || '/candidate';
          } else {
            console.error("Profile Fetch Error", profileError);
            setServerError("Failed to verify account type. Please try again.");
          }
        }

      } else {
        setServerError("Login successful but no access token received.");
      }

    } catch (err: any) {
      console.error("Login Error", err);
      if (err.response?.status === 401) {
        setServerError("Invalid email or password.");
      } else {
        setServerError(err.response?.data?.detail || "Something went wrong. Please check your connection.");
      }
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/google-sync' });
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
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

        <p className="text-gray-600 text-sm">© 2026 TalentBridge. All rights reserved.</p>
      </div>

      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome back! Log in to your account.</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1 relative">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  {...register('email')} 
                  placeholder="you@example.com" 
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#067a62] focus:ring-1 focus:ring-[#067a62] transition-all bg-white text-gray-900" 
                />
              </div>
            </div>

            <div className="space-y-1 relative">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-sm text-[#067a62] hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  {...register('password')} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#067a62] focus:ring-1 focus:ring-[#067a62] transition-all bg-white text-gray-900" 
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

          <p className="text-gray-500 text-center text-sm font-medium mt-6">
            Don't have an account? <Link href="/register" className="text-[#067a62] font-semibold hover:underline">Sign up</Link>
          </p>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
}
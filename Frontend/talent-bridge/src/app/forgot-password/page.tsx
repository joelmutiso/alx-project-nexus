'use client';

import React, { useState, useEffect } from 'react'; // <-- Add useEffect here
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  // 🚀 THE FIX: Clear any lingering/expired tokens when the page loads
  // This prevents the Axios interceptor from sending dead tokens to a public endpoint.
  useEffect(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('dj-rest-auth/password/reset/', { email });
      setIsSent(true);
    } catch (err: any) {
      console.error("Reset Request Error:", err);
      setError("We couldn't find an account with that email address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6 border border-gray-100">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-[#067a62]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-500 leading-relaxed">
            We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
          </p>
          <div className="pt-4">
            <Link href="/login" className="text-[#067a62] font-bold hover:underline">
              Back to Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#067a62] mb-8 transition-colors group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Log In
        </Link>

        <div className="space-y-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forgot password?</h1>
          <p className="text-gray-500">No worries, we'll send you reset instructions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] focus:border-transparent outline-none transition-all text-gray-900"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#067a62] text-white py-4 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Sending Link..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
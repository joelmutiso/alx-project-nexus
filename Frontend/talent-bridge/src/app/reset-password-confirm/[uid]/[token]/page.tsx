'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/axios';

export default function ResetPasswordConfirmPage() {
  const params = useParams();
  
  // Feature: URL Parameter Cleaning
  const rawUid = params.uid as string;
  const uid = rawUid ? rawUid.replace(/\/$/, '') : '';
  
  const rawToken = params.token as string;
  const token = rawToken ? rawToken.replace(/=+$/, '') : '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feature: Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    const payload = {
      uid: uid,
      token: token,
      new_password1: password,
      new_password2: confirmPassword,
    };

    // Feature: Outgoing Payload Debugging
    console.log("SENDING TO BACKEND:", payload);

    setStatus('loading');
    try {
      await api.post('dj-rest-auth/password/reset/confirm/', payload);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      
      console.log("RAW DJANGO ERROR:", JSON.stringify(err.response?.data, null, 2));

      const data = err.response?.data;
      if (data) {
        if (data.new_password1) setMessage(data.new_password1[0]);
        else if (data.non_field_errors) setMessage(data.non_field_errors[0]);
        else if (data.detail) setMessage(data.detail);
        else if (data.uid) setMessage(`UID Error: ${data.uid[0]}`);
        else setMessage('Link expired or invalid.');
      } else {
        setMessage('Network error. Please try again.');
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 space-y-6">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-[#067a62]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Password Updated</h2>
          <p className="text-gray-500">Your password has been reset successfully. You can now log in with your new credentials.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-[#067a62] text-white py-4 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/20"
          >
            Go to Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <div className="space-y-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Set new password</h1>
          <p className="text-gray-500">Please enter a strong password you haven't used before.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all text-black"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all text-black"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
              <AlertCircle size={18} className="shrink-0" />
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !uid || !token}
            className="w-full bg-[#067a62] text-white py-4 rounded-xl font-bold hover:bg-[#056350] transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/20"
          >
            {status === 'loading' ? 'Updating...' : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
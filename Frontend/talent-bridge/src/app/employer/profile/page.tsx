'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import EmployerSidebar from '@/components/Dashboard/EmployerSidebar';
import { User, Mail, Phone, MapPin, Building2, Save, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function EmployerProfilePage() {
  const [formData, setFormData] = useState({
    company_name: '',
    phone: '',
    address: '',
    website: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Use SWR to fetch profile data (Fixes 429 Error)
  const { data: profile, error, isLoading } = useSWR('auth/employer/profile/', fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false
  });

  // 2. Sync SWR data to local state for editing
  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        website: profile.website || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await api.patch('auth/employer/profile/', formData);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <EmployerSidebar />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-20 lg:pt-10 w-full">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Company Profile</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your company information and branding.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 font-medium">
              <AlertCircle size={20} className="shrink-0" />
              <p>Could not load profile. Please wait a moment.</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 font-medium">
              <CheckCircle size={20} className="shrink-0" />
              <p>{successMsg}</p>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-[#0f172a] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profile?.company_name?.charAt(0) || <Building2 size={32} />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.company_name || 'Your Company'}</h2>
                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    <Mail size={16} /> {profile?.user?.email || 'email@example.com'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400"/> Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all font-medium text-gray-900"
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400"/> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all font-medium text-gray-900"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400"/> Address / Location
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all font-medium text-gray-900"
                    placeholder="123 Business St, Tech City"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <User size={16} className="text-gray-400"/> Bio / Description
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all font-medium text-gray-900 resize-none"
                    placeholder="Tell us about your company culture and mission..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#067a62] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function CheckCircle({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  );
}
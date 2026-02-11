'use client';

import React, { useEffect, useState } from 'react';
import CandidateSidebar from '@/components/Dashboard/CandidateSidebar';
import { User, Mail, Briefcase, FileText, Link as LinkIcon, Save, Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import api from '@/lib/axios';

export default function CandidateProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    headline: '',
    bio: '',
    portfolio_url: '',
    github_url: '',
    linkedin_url: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/me/');
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          headline: data.profile?.headline || '',
          bio: data.profile?.bio || '',
          portfolio_url: data.profile?.portfolio_url || '',
          github_url: data.profile?.github_url || '',
          linkedin_url: data.profile?.linkedin_url || ''
        });
      } catch (error: any) {
        if (error.response?.status === 429) {
          setMessage({ type: 'error', text: 'Rate limit exceeded. Please wait a minute and refresh.' });
        } else {
          setMessage({ type: 'error', text: 'Failed to load profile data.' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Assuming your backend accepts profile updates via PATCH /auth/me/ or similar
      await api.patch('auth/me/', formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update local storage so the Sidebar and Dashboard instantly reflect the new name
      if (formData.first_name) {
        localStorage.setItem('user_first_name', formData.first_name);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
        <p className="text-gray-500 mt-4 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-20 lg:pt-10 w-full max-w-5xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-2 text-lg">Update your personal details and public profile.</p>
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 font-medium border ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
            <p>{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-[#067a62]" /> Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">First Name</label>
                <input 
                  type="text" name="first_name" value={formData.first_name} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Last Name</label>
                <input 
                  type="text" name="last_name" value={formData.last_name} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                  <input 
                    type="email" name="email" value={formData.email} disabled
                    className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Details */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase size={20} className="text-[#067a62]" /> Professional Details
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Professional Headline</label>
                <input 
                  type="text" name="headline" value={formData.headline} onChange={handleChange}
                  placeholder="e.g. Senior Full Stack Developer"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Bio / Summary</label>
                <textarea 
                  name="bio" value={formData.bio} onChange={handleChange} rows={4}
                  placeholder="Tell employers about your experience, skills, and goals..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Links */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <LinkIcon size={20} className="text-[#067a62]" /> Web & Social Links
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">LinkedIn Profile</label>
                <input 
                  type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">GitHub Profile</label>
                <input 
                  type="url" name="github_url" value={formData.github_url} onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Personal Portfolio</label>
                <input 
                  type="url" name="portfolio_url" value={formData.portfolio_url} onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-[#067a62] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#056350] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto min-w-[200px]"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
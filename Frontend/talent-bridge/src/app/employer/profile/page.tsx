'use client';

import React, { useEffect, useState } from 'react';
import EmployerSidebar from '@/components/Dashboard/EmployerSidebar';
import { Building2, Save, Loader2, Mail, Globe, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [profile, setProfile] = useState({
    company_name: '',
    phone: '',
    website: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/employer/profile/');
        setProfile({
          company_name: response.data.company_name || '',
          phone: response.data.phone || '',
          website: response.data.website || '',
          location: response.data.location || '',
          bio: response.data.bio || ''
        });
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error("Fetch failed", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await api.put('auth/employer/profile/', profile);
      setMessage({ type: 'success', text: "Profile saved successfully!" });
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Connection failed. Please check your data.";
      setMessage({ type: 'error', text: `Save Failed: ${errorMsg}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
        <p className="text-gray-500 mt-4 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <EmployerSidebar />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-20 lg:pt-10 w-full max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Company Profile</h1>
          <p className="text-gray-500 mt-2 text-lg">This information will be displayed on your job listings.</p>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 font-medium border ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
            <p>{message.text}</p>
          </div>
        )}

        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Building2 size={16} className="text-[#067a62]" /> Company Name *
                </label>
                <input 
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62] transition-all"
                  value={profile.company_name}
                  onChange={(e) => setProfile({...profile, company_name: e.target.value})}
                  placeholder="e.g. TechFlow Systems"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Mail size={16} className="text-[#067a62]" /> Phone / Contact
                </label>
                <input 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62] transition-all"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="+254..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Globe size={16} className="text-[#067a62]" /> Website
                </label>
                <input 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62] transition-all"
                  value={profile.website}
                  onChange={(e) => setProfile({...profile, website: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <MapPin size={16} className="text-[#067a62]" /> Location
                </label>
                <input 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62] transition-all"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="e.g. Nairobi, Kenya"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                About Company
              </label>
              <textarea 
                rows={5}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62] transition-all resize-none"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Tell us about your mission..."
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full md:w-auto bg-[#067a62] text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
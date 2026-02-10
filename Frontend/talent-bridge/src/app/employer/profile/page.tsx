'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Save, Loader2, Mail, Globe, MapPin } from 'lucide-react';
import axios from 'axios';

// 🛠️ CONFIG: The new endpoint we just built
const API_URL = 'https://talent-bridge-backend-detd.onrender.com/api/v1';
const PROFILE_ENDPOINT = `${API_URL}/auth/employer/profile/`; 

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

  const getAuthToken = () => {
    return localStorage.getItem('access') || localStorage.getItem('accessToken') || localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 1. Try to fetch existing profile
        const response = await axios.get(PROFILE_ENDPOINT, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("✅ Profile Loaded:", response.data);
        
        // 2. Populate form with existing data (if any)
        setProfile({
          company_name: response.data.company_name || '',
          phone: response.data.phone || '',
          website: response.data.website || '',
          location: response.data.location || '',
          bio: response.data.bio || ''
        });

      } catch (err: any) {
        // 404 is okay! It just means we haven't created it yet.
        if (err.response?.status === 404) {
             console.log("ℹ️ No profile found. Ready to create new one.");
        } else {
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
    const token = getAuthToken();

    try {
      // 🚀 MAGIC: We use PUT (or PATCH) to the endpoint.
      // Your new backend view handles "Create if missing" automatically!
      
      const payload = {
        company_name: profile.company_name,
        phone: profile.phone,
        website: profile.website,
        location: profile.location,
        bio: profile.bio
      };

      await axios.put(PROFILE_ENDPOINT, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setMessage({ type: 'success', text: "✅ Profile saved successfully!" });
      
    } catch (err: any) {
      console.error("Save failed", err);
      const errorMsg = err.response?.data?.detail || JSON.stringify(err.response?.data) || "Connection failed";
      setMessage({ type: 'error', text: `❌ Save Failed: ${errorMsg}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-[#067a62]" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Company Profile</h1>
      <p className="text-gray-500 mb-8">This information will be displayed on your job listings.</p>
      
      {message && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Building2 size={16} /> Company Name *
              </label>
              <input 
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62]"
                value={profile.company_name}
                onChange={(e) => setProfile({...profile, company_name: e.target.value})}
                placeholder="e.g. TechFlow Systems"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Mail size={16} /> Phone / Contact
              </label>
              <input 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62]"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                placeholder="+254..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Globe size={16} /> Website
              </label>
              <input 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62]"
                value={profile.website}
                onChange={(e) => setProfile({...profile, website: e.target.value})}
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <MapPin size={16} /> Location
              </label>
              <input 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62]"
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
              rows={4}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#067a62]"
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              placeholder="Tell us about your mission..."
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#067a62] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#056350] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
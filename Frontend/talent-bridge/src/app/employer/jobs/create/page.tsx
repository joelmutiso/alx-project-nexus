'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    job_type: 'Full-time', 
    salary_range: '',
    description: '',
    requirements: '',
    remote_status: 'Remote', // Default to the one we know works
    experience_level: 'Mid Level'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        job_type: formData.job_type === 'Full-time' ? 'FT' : 
                  formData.job_type === 'Part-time' ? 'PT' : 'CT',
        
  
        remote_status: 'ON', 
        experience_level: formData.experience_level === 'Entry Level' ? 'Entry' : 
                          formData.experience_level === 'Mid Level' ? 'Mid' : 'Senior'
      };

      console.log("Sending Safe Payload:", payload);
      await api.post('jobs/', payload);
      
      // If successful, go to dashboard
      router.push('/employer/jobs');
      
    } catch (err: any) {
      console.error("Backend Error:", err.response?.data);
      alert("Validation Error: " + JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-12 min-h-screen">
      <Link href="/employer/jobs" className="flex items-center gap-2 text-gray-500 mb-8 hover:text-[#067a62]">
        <ArrowLeft size={18} /> Back to Listings
      </Link>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Post New Job</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Job Title *</label>
              <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                placeholder="Software Engineer" onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Location *</label>
              <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                placeholder="Nairobi, Kenya" onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Job Type</label>
              <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                onChange={(e) => setFormData({...formData, job_type: e.target.value})}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Experience</label>
              <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                onChange={(e) => setFormData({...formData, experience_level: e.target.value})}>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Remote Status</label>
              <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                onChange={(e) => setFormData({...formData, remote_status: e.target.value})}>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Salary Range</label>
            <input className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
              placeholder="e.g. $50k - $70k" onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
          </div>

          <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
            placeholder="Description" onChange={(e) => setFormData({...formData, description: e.target.value})} />
          
          <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
            placeholder="Requirements" onChange={(e) => setFormData({...formData, requirements: e.target.value})} />

          <button type="submit" disabled={loading} className="w-full bg-[#067a62] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#056350] transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            Publish Job Listing
          </button>
        </form>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect here
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // New state to handle loading while checking auth
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    job_type: 'Full-Time', 
    salary: '',
    description: '',
    requirements: '',
    remote_status: 'Remote', 
    experience_level: 'Mid'
  });

  // 👇 ADDED: Authentication Check
  useEffect(() => {
    // Check for the token in local storage
    // MAKE SURE this matches the key you used in your Login page!
    const token = localStorage.getItem('token') || localStorage.getItem('access');
    
    if (!token) {
      // If no token, redirect to login immediately
      router.push('/login?redirect=/employer/jobs/create');
    } else {
      // If token exists, allow the page to show
      setIsAuthorized(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      // 🚀 Payload cleanup: Ensuring types match exactly what Postman showed
      const payload = {
        title: formData.title,
        company_name: formData.company_name,
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements,
        salary: formData.salary ? parseInt(formData.salary, 10) : 0,
        job_type: formData.job_type,
        remote_status: formData.remote_status,
        experience_level: formData.experience_level,
        is_active: true
      };

      await api.post('jobs/', payload);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/employer');
      }, 2000);
      
    } catch (err: any) {
      console.error("Submission Error Details:", err.response?.data);
      
      if (err.response?.status === 500) {
        setErrorMsg("Server Error (500): The database rejected this job. This usually happens if the backend is missing the 'employer' link during save.");
      } else {
        setErrorMsg(err.response?.data?.detail || JSON.stringify(err.response?.data) || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👇 ADDED: Loading screen while checking auth
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-gray-50">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-[#067a62]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Job Posted Successfully!</h2>
        <p className="text-gray-500 mt-2">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/employer" className="inline-flex items-center gap-2 text-gray-500 mb-8 hover:text-[#067a62] font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Post a New Job</h1>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-800 font-medium">
              <AlertCircle size={20} className="shrink-0" />
              <div className="text-sm break-words">{errorMsg}</div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Job Title *</label>
                <input required name="title" value={formData.title} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none"
                  placeholder="Software Engineer" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Company Name *</label>
                <input required name="company_name" value={formData.company_name} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none"
                  placeholder="Tesla" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Location *</label>
                <input required name="location" value={formData.location} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none"
                  placeholder="Nairobi or Remote" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Annual Salary (USD) *</label>
                <input required type="number" name="salary" value={formData.salary} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none"
                  placeholder="120000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Job Type</label>
                <select name="job_type" value={formData.job_type} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Experience</label>
                <select name="experience_level" value={formData.experience_level} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Setup</label>
                <select name="remote_status" value={formData.remote_status} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#067a62]"
                  placeholder="What does the role involve?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Requirements *</label>
                <textarea required name="requirements" value={formData.requirements} onChange={handleChange} rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#067a62]"
                  placeholder="What skills are needed?" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#067a62] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#056350] transition-all disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Publish Job Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
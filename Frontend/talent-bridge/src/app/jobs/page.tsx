'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Briefcase, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

// 🚀 THE FIX: Ensure "export default function" is used clearly
export default function FindJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicJobs = async () => {
      try {
        // Fetching from the TalentBridge API
        const response = await api.get('jobs/');
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        
        // Filter for active jobs
        setJobs(data.filter((j: any) => j.is_active !== false));
      } catch (err: any) {
        console.error("Could not fetch jobs", err);
        setError("Failed to load available jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-white">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
        <p className="text-gray-500 mt-4">Finding the latest opportunities...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Find Your Next Role</h1>
        <p className="text-gray-500">Explore the latest job openings on TalentBridge.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900">No jobs found</h3>
            <p className="text-gray-500 mt-1">Check back later for new openings.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#067a62] transition-colors">
                      {job.title}
                    </h2>
                    <p className="text-[#067a62] font-bold text-lg">{job.company_name}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <MapPin size={16} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Briefcase size={16} /> {job.job_type === 'FT' ? 'Full-time' : job.job_type}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-900 font-bold">
                      <DollarSign size={16} className="text-[#067a62]" /> {job.salary_range}
                    </span>
                  </div>
                </div>

                <Link 
                  href={`/jobs/${job.id}`} 
                  className="w-full md:w-auto text-center bg-[#067a62] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
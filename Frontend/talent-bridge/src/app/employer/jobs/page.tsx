'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, MapPin, Users, Plus, 
  Trash2, Eye, Loader2, AlertTriangle 
} from 'lucide-react';
import api from '@/lib/axios';

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // New error state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchJobs = async () => {
    setError(null); // Reset error on new fetch
    try {
      const response = await api.get('jobs/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setJobs(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      // 🚨 Handle the 429 Rate Limit specifically
      if (err.response && err.response.status === 429) {
        setError("You are refreshing too fast! The server asked us to wait a moment.");
      } else {
        // Only show generic error if it's NOT a rate limit
        console.error("Failed to fetch jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setDeletingId(jobId);
    try {
      await api.delete(`jobs/${jobId}/`);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20 min-h-screen">
      <Loader2 className="animate-spin text-[#067a62]" size={40} />
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 leading-tight">Your Listings</h1>
        <Link href="/employer/jobs/create" className="bg-[#067a62] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-[#056350] transition-all">
          <Plus size={20} /> Post New Job
        </Link>
      </div>

      {/* 🚨 ERROR MESSAGE UI */}
      {error && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-2xl mb-6 flex items-center gap-3">
          <AlertTriangle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="grid gap-6">
        {!error && jobs.length === 0 ? (
          <div className="text-center py-24 bg-white border-2 border-dashed border-gray-200 rounded-[2rem]">
            <Briefcase className="mx-auto text-gray-200 mb-4" size={60} />
            <p className="text-gray-500 font-medium text-lg">No active listings found.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md flex flex-col md:flex-row justify-between items-center gap-6 group transition-all">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#067a62] transition-colors">{job.title}</h2>
                <div className="flex gap-4 mt-3 text-sm font-medium text-gray-500">
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><Users size={16} /> {job.application_count || 0} Applicants</span>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link href={`/employer/jobs/${job.id}`} className="flex-1 md:flex-none bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-center hover:bg-black transition-colors">Review</Link>
                <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30">
                  {deletingId === job.id ? <Loader2 size={22} className="animate-spin" /> : <Trash2 size={22} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import { 
  Plus, MapPin, Users, Loader2, AlertCircle, 
  Trash2, ArrowLeft, Briefcase 
} from 'lucide-react';
import api from '@/lib/axios';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function EmployerJobsPage() {
  
  // 1. Use SWR to handle caching and prevent 429 errors
  const { data: jobsResponse, error, isLoading } = useSWR('jobs/my-jobs/', fetcher, {
     refreshInterval: 60000, 
     revalidateOnFocus: false,
     shouldRetryOnError: false // Stop retrying if we hit a limit
  });

  const jobs = jobsResponse ? (Array.isArray(jobsResponse) ? jobsResponse : jobsResponse.results || []) : [];

  const handleDelete = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`jobs/${jobId}/`);
      // Instantly update the list without a full reload
      mutate('jobs/my-jobs/'); 
    } catch (err) {
      alert("Failed to delete job.");
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/employer" className="flex items-center gap-2 text-gray-500 hover:text-[#067a62] font-medium transition-colors">
              <ArrowLeft size={18} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Listings</h1>
          
          <Link href="/employer/jobs/create" className="flex items-center justify-center gap-2 bg-[#067a62] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/10 whitespace-nowrap">
            <Plus size={20} /> Post New Job
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 font-medium">
            <AlertCircle size={20} className="shrink-0" />
            <p>Could not load jobs. Please wait a moment.</p>
          </div>
        )}

        <div className="space-y-6">
          {!error && jobs.length === 0 ? (
             <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Briefcase className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No jobs posted yet</h3>
                <p className="text-gray-500 mt-1">Post a new job to get started.</p>
             </div>
          ) : (
            jobs.map((job: any) => (
              <div key={job.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                <div className="flex-1">
                   <h3 className="text-xl font-bold text-gray-900 mb-2">
                     {job.title}
                   </h3>
                   
                   <div className="flex items-center gap-6 text-gray-500 font-medium text-sm">
                      <span className="flex items-center gap-2">
                        <MapPin size={18} className="text-gray-400"/> {job.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users size={18} className="text-gray-400"/> {job.applications_count || 0} Applicants
                      </span>
                   </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                   <Link 
                     href={`/employer/jobs/${job.id}`} 
                     className="bg-[#0f172a] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                   >
                     Review
                   </Link>
                   <button 
                     onClick={() => handleDelete(job.id)}
                     className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                     title="Delete Job"
                   >
                     <Trash2 size={20} />
                   </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
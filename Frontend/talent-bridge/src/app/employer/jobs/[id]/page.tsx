'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Briefcase, MapPin, ArrowLeft, 
  Users, Loader2, AlertCircle, FileText, Mail,
  CheckCircle, XCircle, DollarSign
} from 'lucide-react';
import api from '@/lib/axios';

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [jobRes, appRes] = await Promise.all([
        api.get(`jobs/${id}/`),
        api.get(`jobs/${id}/applications/`)
      ]);
      setJob(jobRes.data);
      setApplicants(appRes.data);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("Could not load data from TalentBridge.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
    setUpdatingId(applicationId);
    try {
      // 🚀 THE CONFIRMED PATH: Based on your Swagger discovery
      // PATCH /jobs/applications/{id}/
      await api.patch(`jobs/applications/${applicationId}/`, { 
        status: newStatus 
      });
      
      console.log(`✅ Success: Application ${applicationId} is now ${newStatus}`);
      await fetchData(); // Refresh UI
      
    } catch (err: any) {
      console.error("Update Error:", err.response?.data);
      
      // If the backend fails, this alert helps us see if it wants 
      // a number (Enum) instead of a string.
      const errorDetail = err.response?.data 
        ? JSON.stringify(err.response.data) 
        : "Check your connection to the TalentBridge server.";
        
      alert(`Backend rejected update: ${errorDetail}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
        <p className="text-gray-500 mt-4 font-medium">Loading TalentBridge Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <div className="mb-8">
        <Link href="/employer/jobs" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#067a62] transition-colors font-medium">
          <ArrowLeft size={18} /> Back to Job Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="border-b border-gray-100 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">{job?.title}</h1>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-600">
                  <Briefcase size={16} /> {job?.company_name}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-600">
                  <MapPin size={16} /> {job?.location}
                </span>
                <span className="bg-[#067a62]/10 text-[#067a62] px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider">
                  {job?.job_type}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                  {job?.description}
                </p>
              </section>
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                  {job?.requirements}
                </p>
              </section>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-[#067a62]" /> 
                Applicants ({applicants.length})
              </h3>
            </div>

            {applicants.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto text-gray-300 mb-4" size={24} />
                <p className="text-gray-500 font-medium">No one has applied for this position yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {applicants.map((app) => (
                  <div key={app.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 flex items-center gap-2 truncate">
                        <Mail size={14} className="text-gray-400" /> {app.candidate_email}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded-md font-black border ${
                          app.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-gray-400">Applied {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'Accepted')}
                        disabled={updatingId === app.id || app.status === 'Accepted'}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                      >
                        {updatingId === app.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} 
                        Accept
                      </button>
                      
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                        disabled={updatingId === app.id || app.status === 'Rejected'}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                      >
                        {updatingId === app.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} 
                        Reject
                      </button>

                      {app.resume && (
                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="p-2.5 text-gray-400 hover:text-[#067a62] hover:bg-[#067a62]/5 rounded-xl border border-gray-100">
                          <FileText size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#067a62] text-white p-6 rounded-2xl shadow-lg shadow-emerald-900/10">
            <h3 className="text-xl font-bold mb-2">Candidate Pool</h3>
            <p className="text-5xl font-black">{applicants.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-sm">
             <div className="flex justify-between mb-2">
                <span className="text-gray-500">Salary Range:</span>
                <span className="font-bold text-[#067a62]">{job?.salary_range}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Exp Level:</span>
                <span className="font-medium text-gray-900">{job?.experience_level}</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
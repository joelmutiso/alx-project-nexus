'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, MapPin, ArrowLeft, 
  Users, Loader2, FileText, Mail,
  CheckCircle, XCircle, DollarSign, TrendingUp // Imported correctly
} from 'lucide-react';
import api from '@/lib/axios';

export default function HiringManagementPage() {
  const params = useParams();
  const id = params?.id;
  
  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Moved fetchData inside useCallback to be used in useEffect and after updates
  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [jobRes, appRes] = await Promise.all([
        api.get(`jobs/${id}/`),
        api.get(`jobs/${id}/applications/`)
      ]);
      setJob(jobRes.data);
      const appData = Array.isArray(appRes.data) ? appRes.data : appRes.data.results || [];
      setApplicants(appData);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      // Optional: Set an error state here if needed
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
    setUpdatingId(applicationId);
    try {
      await api.patch(`jobs/applications/${applicationId}/`, { 
        status: newStatus 
      });
      // Refresh data to show new status
      await fetchData(); 
    } catch (err: any) {
      console.error("Update Error:", err.response?.data);
      alert(`Status update failed: ${JSON.stringify(err.response?.data)}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
        <p className="text-gray-500 mt-4 font-medium">Fetching candidate data...</p>
      </div>
    );
  }

  // If loading is done but no job found
  if (!job) {
     return (
        <div className="flex flex-col items-center justify-center py-20 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-700">Job Not Found</h2>
          <Link href="/employer" className="mt-4 text-[#067a62] hover:underline">Back to Dashboard</Link>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        
        <div className="mb-8">
          <Link href="/employer" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#067a62] transition-all font-semibold group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header Card */}
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <div className="border-b border-gray-50 pb-8 mb-8">
                <div className="flex justify-between items-start mb-4">
                   <h1 className="text-3xl font-black text-gray-900 leading-tight">{job?.title}</h1>
                   <span className="bg-emerald-50 text-[#067a62] px-4 py-1.5 rounded-full text-xs font-bold uppercase border border-emerald-100">
                    {job?.job_type}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl">
                    <Building2 size={16} className="text-gray-400" /> {job?.company_name}
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl">
                    <MapPin size={16} className="text-gray-400" /> {job?.location}
                  </span>
                  <span className="flex items-center gap-1.5 bg-emerald-50/50 text-[#067a62] px-3 py-2 rounded-xl font-bold">
                    <DollarSign size={16} /> ${job?.salary?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#067a62] rounded-full"></div>
                    Job Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                    {job?.description}
                  </p>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#067a62] rounded-full"></div>
                    Requirements
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                    {job?.requirements}
                  </p>
                </section>
              </div>
            </div>

            {/* Applicants List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users size={22} className="text-[#067a62]" /> 
                  Applicants ({applicants.length})
                </h3>
              </div>

              {applicants.length === 0 ? (
                <div className="py-20 text-center">
                  <Users className="mx-auto text-gray-200 mb-4" size={48} />
                  <p className="text-gray-500 font-medium">No one has applied for this position yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {applicants.map((app) => (
                    <div key={app.id} className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-emerald-50/10 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-lg flex items-center gap-2 truncate">
                          <Mail size={16} className="text-gray-400" /> {app.candidate_email}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-[10px] uppercase px-3 py-1 rounded-full font-black border ${
                            app.status.toLowerCase().includes('accept') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            app.status.toLowerCase().includes('reject') ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {app.status}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">Applied {new Date(app.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Accept Button */}
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'Accepted')}
                          disabled={updatingId === app.id || app.status.toLowerCase().includes('accept')}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#067a62] px-5 py-2.5 rounded-xl hover:bg-[#056350] disabled:opacity-30 disabled:bg-gray-300 transition-all shadow-md active:scale-95"
                        >
                          {updatingId === app.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} 
                          Accept
                        </button>
                        
                        {/* Reject Button */}
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                          disabled={updatingId === app.id || app.status.toLowerCase().includes('reject')}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-100 disabled:opacity-50 transition-all active:scale-95"
                        >
                          {updatingId === app.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} 
                          Reject
                        </button>

                        {/* Resume Link */}
                        {app.resume && (
                          <a href={app.resume} target="_blank" rel="noopener noreferrer" className="p-3 text-gray-400 hover:text-[#067a62] hover:bg-emerald-50 rounded-xl border border-gray-100 transition-colors" title="View Resume">
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
            <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-xl shadow-slate-900/10">
              <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-2">Total Applicants</h3>
              <p className="text-6xl font-black">{applicants.length}</p>
              <div className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <TrendingUp size={16} /> +{applicants.length} this week
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-900">Listing Statistics</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Experience:</span>
                  <span className="font-bold text-gray-900">{job?.experience_level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Setup:</span>
                  <span className="font-bold text-gray-900">{job?.remote_status}</span>
                </div>
                <div className="flex justify-between text-sm pt-4 border-t border-gray-50">
                  <span className="text-gray-500 font-medium">Status:</span>
                  <span className="text-[#067a62] font-black uppercase text-[10px] bg-emerald-50 px-2 py-1 rounded">Active</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CandidateSidebar from '@/components/Dashboard/CandidateSidebar';
import { Search, ExternalLink, Loader2, Briefcase, Filter } from 'lucide-react';
import api from '@/lib/axios';

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('jobs/applications/me/');
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filter logic
  const filteredApps = applications.filter(app => {
    // 🛑 SAFETY CHECK: Ensure we don't crash if app.job is null
    const jobTitle = app.job?.title || app.job_title || ''; 
    const companyName = app.job?.company_name || app.company_name || '';
    
    const role = jobTitle.toLowerCase();
    const company = companyName.toLowerCase();
    
    const matchesSearch = role.includes(searchQuery.toLowerCase()) || company.includes(searchQuery.toLowerCase());
    
    const status = (app.status || 'pending').toLowerCase();
    const matchesStatus = statusFilter === 'All' || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (s: string) => {
    if (!s) return 'bg-gray-50 text-gray-600 border-gray-200';
    const statusLower = s.toLowerCase();
    
    if (statusLower.includes('interview')) return 'bg-emerald-100 text-[#067a62] border-emerald-200';
    if (statusLower.includes('review') || statusLower.includes('pending')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (statusLower.includes('reject')) return 'bg-red-50 text-red-700 border-red-200';
    if (statusLower.includes('offer') || statusLower.includes('accept')) return 'bg-blue-50 text-blue-700 border-blue-200';
    
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-20 lg:pt-10 w-full">
        
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">My Applications</h1>
          <p className="text-gray-500 mt-2 text-lg">Track and manage all your job applications in one place.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by role or company..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all shadow-sm text-sm"
            />
          </div>
          <div className="relative min-w-[160px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none transition-all shadow-sm text-sm appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#067a62]" size={32} />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="text-gray-300" size={32} />
              </div>
              <h4 className="text-lg font-bold text-gray-900">No applications found</h4>
              <p className="text-gray-500 mt-1">We couldn't find any applications matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5">Position</th>
                    <th className="px-8 py-5">Company</th>
                    <th className="px-8 py-5">Applied Date</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-8 py-5 font-bold text-gray-900">
                        {app.job?.title || app.job_title || 'Position Unavailable'}
                      </td>
                      <td className="px-8 py-5 text-gray-600 font-medium">
                        {app.job?.company_name || app.company_name || 'Company Unavailable'}
                      </td>
                      <td className="px-8 py-5 text-gray-500">
                        {new Date(app.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(app.status || 'Pending')}`}>
                          {(app.status || 'Pending').charAt(0).toUpperCase() + (app.status || 'Pending').slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {(app.job?.id || app.job_id) ? (
                          <Link href={`/jobs/${app.job?.id || app.job_id}`} className="inline-flex text-gray-400 hover:text-[#067a62] transition-colors p-2 hover:bg-emerald-50 rounded-lg" title="View Job Details">
                            <ExternalLink size={18} />
                          </Link>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
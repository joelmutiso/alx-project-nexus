'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CandidateSidebar from '@/components/Dashboard/CandidateSidebar';
import { Search, FileText, Eye, MessageSquare, TrendingUp, ExternalLink, Loader2, Briefcase, AlertCircle, User } from 'lucide-react';
import api from '@/lib/axios';

export default function CandidateDashboard() {
  const [userName, setUserName] = useState('Candidate');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setErrorMsg('');
        
        // 1. Fetch User Profile
        const userRes = await api.get('auth/me/');
        const userData = Array.isArray(userRes.data) ? userRes.data[0] : userRes.data;
        if (userData?.first_name) {
          setUserName(userData.first_name);
        } else if (userData?.username) {
          setUserName(userData.username);
        }

        // 2. Fetch User's Applications
        const appRes = await api.get('jobs/applications/me/');
        const appData = Array.isArray(appRes.data) ? appRes.data : appRes.data.results || [];
        setApplications(appData);

      } catch (error: any) {
        console.error("Failed to load dashboard data", error);
        if (error.response?.status === 429) {
          setErrorMsg("You're refreshing a bit too fast! Please wait a minute for the rate limit to reset.");
        } else {
          setErrorMsg("We couldn't load your applications right now. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
        <p className="text-gray-500 mt-4 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-20 lg:pt-10 w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Welcome back, {userName}</h1>
            <p className="text-gray-500 mt-2 text-lg">Here is a summary of your job search activity.</p>
          </div>
          
          {/* 🚀 THE FIX: Action Buttons Grouped */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link 
              href="/jobs" 
              className="flex items-center justify-center gap-2 bg-[#067a62] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98] whitespace-nowrap"
            >
              <Search size={18} />
              Find Work
            </Link>
            <Link 
              href="/candidate/profile" 
              className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
            >
              <User size={18} />
              Edit Profile
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 font-medium">
            <AlertCircle size={20} className="shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Applications" value={applications.length.toString()} icon={<FileText size={22} className="text-[#067a62]"/>} />
          <StatCard title="Profile Views" value="0" icon={<Eye size={22} className="text-gray-400"/>} />
          <StatCard title="Interviews" value="0" icon={<MessageSquare size={22} className="text-gray-400"/>} />
          <StatCard title="Response Rate" value="0%" icon={<TrendingUp size={22} className="text-gray-400"/>} />
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-gray-50 flex justify-between items-center bg-white">
            <h3 className="font-bold text-xl text-gray-900">Recent Applications</h3>
          </div>
          
          <div className="overflow-x-auto">
            {!errorMsg && applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="text-gray-300" size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900">No applications yet</h4>
                <p className="text-gray-500 mt-1 max-w-sm">You haven't applied to any jobs yet. Start browsing to find your next great role!</p>
                <Link href="/jobs" className="mt-6 text-[#067a62] font-bold hover:underline">
                  Browse open roles →
                </Link>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 rounded-tl-xl">Position</th>
                    <th className="px-8 py-5">Company</th>
                    <th className="px-8 py-5">Applied</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.slice(0, 5).map((app) => (
                    <ApplicationRow 
                      key={app.id}
                      role={app.job?.title || app.job_title || 'Position'} 
                      company={app.job?.company_name || app.company_name || 'Company'} 
                      date={new Date(app.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                      status={app.status || 'Pending'} 
                      jobId={app.job?.id || app.job_id}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-36 hover:border-emerald-100 hover:shadow-md transition-all group cursor-default">
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">{title}</span>
        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
          {icon}
        </div>
      </div>
      <span className="text-4xl font-black text-gray-900 tracking-tight">{value}</span>
    </div>
  );
}

function ApplicationRow({ role, company, date, status, jobId }: { role: string, company: string, date: string, status: string, jobId?: number | string }) {
  const getStatusColor = (s: string) => {
    const statusLower = s.toLowerCase();
    if (statusLower.includes('interview')) return 'bg-emerald-100 text-[#067a62] border-emerald-200';
    if (statusLower.includes('review') || statusLower.includes('pending')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (statusLower.includes('reject')) return 'bg-red-50 text-red-700 border-red-200';
    if (statusLower.includes('offer') || statusLower.includes('accept')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <tr className="hover:bg-emerald-50/30 transition-colors group">
      <td className="px-8 py-5 font-bold text-gray-900">{role}</td>
      <td className="px-8 py-5 text-gray-600 font-medium">{company}</td>
      <td className="px-8 py-5 text-gray-500">{date}</td>
      <td className="px-8 py-5">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </span>
      </td>
      <td className="px-8 py-5 text-right">
        {jobId ? (
          <Link href={`/jobs/${jobId}`} className="inline-flex text-gray-400 hover:text-[#067a62] transition-colors p-2 hover:bg-emerald-50 rounded-lg">
            <ExternalLink size={18} />
          </Link>
        ) : (
          <span className="text-gray-300">-</span>
        )}
      </td>
    </tr>
  );
}
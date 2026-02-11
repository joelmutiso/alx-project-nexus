'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import EmployerSidebar from '@/components/Dashboard/EmployerSidebar';
import { Plus, Users, Briefcase, TrendingUp, ExternalLink, Loader2, AlertCircle, Building2, User } from 'lucide-react';
import api from '@/lib/axios';

export default function EmployerDashboard() {
  const [companyName, setCompanyName] = useState('Employer');
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        setErrorMsg('');
        
        try {
          const profileRes = await api.get('auth/employer/profile/');
          if (profileRes.data?.company_name) {
            setCompanyName(profileRes.data.company_name);
          }
        } catch (profileErr) {
          console.warn("Could not fetch company name, falling back to default.", profileErr);
        }

        const jobsRes = await api.get('jobs/my-jobs/');
        const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || [];
        setMyJobs(jobsData);

      } catch (error: any) {
        console.error("Failed to load employer dashboard data", error);
        if (error.response?.status === 429) {
          setErrorMsg("You're refreshing a bit too fast! Please wait a minute for the rate limit to reset.");
        } else {
          setErrorMsg("We couldn't load your job postings right now. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
        <p className="text-gray-500 mt-4 font-medium">Loading your workspace...</p>
      </div>
    );
  }

  const activeJobsCount = myJobs.filter(job => job.is_active !== false).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <EmployerSidebar />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-20 lg:pt-10 w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Welcome, {companyName}</h1>
            <p className="text-gray-500 mt-2 text-lg">Here is an overview of your hiring pipeline.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link 
              href="/employer/profile" 
              className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
            >
              <User size={18} />
              Company Profile
            </Link>
            <Link 
              href="/employer/jobs/create" 
              className="flex items-center justify-center gap-2 bg-[#067a62] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98] whitespace-nowrap"
            >
              <Plus size={20} />
              Post a New Job
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
          <StatCard title="Active Jobs" value={activeJobsCount.toString()} icon={<Briefcase size={22} className="text-[#067a62]"/>} />
          <StatCard title="Total Applicants" value="0" icon={<Users size={22} className="text-gray-400"/>} />
          <StatCard title="Interviews Scheduled" value="0" icon={<TrendingUp size={22} className="text-gray-400"/>} />
          <StatCard title="Hired Candidates" value="0" icon={<Users size={22} className="text-gray-400"/>} />
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-gray-50 flex justify-between items-center bg-white">
            <h3 className="font-bold text-xl text-gray-900">Your Recent Postings</h3>
            <Link href="/employer/jobs" className="text-sm font-bold text-[#067a62] hover:underline">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {!errorMsg && myJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="text-gray-300" size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900">No jobs posted yet</h4>
                <p className="text-gray-500 mt-1 max-w-sm">Post your first job to start receiving applications!</p>
                <Link href="/employer/jobs/create" className="mt-6 text-[#067a62] font-bold hover:underline flex items-center justify-center gap-1">
                  <Plus size={16}/> Create a Job Listing
                </Link>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5">Job Title</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Posted Date</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Applications</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myJobs.slice(0, 5).map((job) => (
                    <tr key={job.id} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-8 py-5 font-bold text-gray-900">{job.title}</td>
                      <td className="px-8 py-5 text-gray-600 font-medium">
                        {job.job_type}
                      </td>
                      <td className="px-8 py-5 text-gray-500">
                        {new Date(job.created_at || new Date()).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                        {job.is_active !== false ? (
                          <span className="px-4 py-1.5 rounded-full text-xs font-bold border bg-emerald-50 text-[#067a62] border-emerald-200">Active</span>
                        ) : (
                          <span className="px-4 py-1.5 rounded-full text-xs font-bold border bg-gray-50 text-gray-600 border-gray-200">Closed</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link 
                          href={`/employer/jobs/${job.id}`} 
                          className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-50 hover:text-[#067a62] transition-all border border-gray-100"
                        >
                          <Users size={14} />
                          Manage Apps
                        </Link>
                      </td>
                    </tr>
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
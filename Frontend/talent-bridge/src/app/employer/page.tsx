'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import EmployerSidebar from '@/components/Dashboard/EmployerSidebar';
import { Briefcase, Users, Eye, TrendingUp, ArrowRight, Plus } from 'lucide-react';

export default function EmployerDashboard() {
  const [companyName, setCompanyName] = useState('Welcome, Employer');
  const [jobs, setJobs] = useState([
    // Static Mock Data
    { role: "Senior Frontend Engineer", location: "San Francisco, CA / Full-time", status: "Active", applicants: "24", views: "1,430", posted: "Jan 15, 2026" },
    { role: "Backend Developer", location: "Austin, TX / Full-time", status: "Active", applicants: "18", views: "980", posted: "Jan 22, 2026" },
    { role: "Product Designer", location: "New York, NY / Full-time", status: "Paused", applicants: "31", views: "2,100", posted: "Dec 10, 2025" },
  ]);

  useEffect(() => {
    // 1. Get Company Name
    const storedCompany = localStorage.getItem('company_name');
    if (storedCompany) setCompanyName(storedCompany);

    // 2. 🚀 Check for a newly posted job from the Form
    const newJob = localStorage.getItem('latest_posted_job');
    if (newJob) {
      const parsedJob = JSON.parse(newJob);
      // Add the new job to the TOP of the list
      setJobs(prevJobs => [parsedJob, ...prevJobs]);
      
      // Optional: Clear it so it doesn't duplicate on refresh (or keep it for demo persistence)
      // localStorage.removeItem('latest_posted_job'); 
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployerSidebar />
      
      {/* Main Content Area */}
      <main className="ml-64 p-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">{companyName}</h1>
            <p className="text-gray-500 mt-1">Manage your job listings and review applicants.</p>
          </div>
          <Link 
            href="/post-job" 
            className="flex items-center gap-2 bg-[#067a62] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-md"
          >
            <Plus size={18} />
            Post a Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Dynamically count active listings including the new one */}
          <StatCard title="Active Listings" value={jobs.filter(j => j.status === 'Active').length.toString()} icon={<Briefcase size={20} className="text-gray-400"/>} />
          <StatCard title="Total Applicants" value="128" icon={<Users size={20} className="text-gray-400"/>} />
          <StatCard title="Total Views" value="5.3K" icon={<Eye size={20} className="text-gray-400"/>} />
          <StatCard title="Hire Rate" value="12%" icon={<TrendingUp size={20} className="text-gray-400"/>} />
        </div>

        {/* Job Listings Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 font-serif">Your Job Listings</h3>
            <span className="text-sm text-gray-500">Showing {jobs.length} jobs</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Posted</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job, index) => (
                  <JobRow key={index} {...job} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 hover:border-gray-200 transition-all">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {icon}
      </div>
      <span className="text-3xl font-bold text-gray-900 font-serif">{value}</span>
    </div>
  );
}

function JobRow({ role, location, status, applicants, views, posted }: any) {
  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'Active': return 'bg-emerald-100 text-emerald-700';
      case 'Paused': return 'bg-amber-100 text-amber-700';
      case 'Closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{role}</div>
        <div className="text-xs text-gray-500 mt-0.5">{location}</div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
           <Users size={16} className="text-gray-400"/>
           <span className="font-semibold text-gray-900">{applicants}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500">{views}</td>
      <td className="px-6 py-4 text-gray-500">{posted}</td>
      <td className="px-6 py-4 text-right">
        <button className="text-sm font-bold text-gray-900 hover:text-[#067a62] flex items-center justify-end gap-1 transition-colors">
          Manage <ArrowRight size={14} />
        </button>
      </td>
    </tr>
  );
}
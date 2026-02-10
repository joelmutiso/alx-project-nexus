'use client'; // Added so we can use hooks

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CandidateSidebar from '@/components/Dashboard/CandidateSidebar';
import { Search, FileText, Eye, MessageSquare, TrendingUp, ExternalLink } from 'lucide-react';

export default function CandidateDashboard() {
  const [userName, setUserName] = useState('Candidate');

  useEffect(() => {
    // 🚀 Logic: Try to get the real name from local storage
    // You can set this in your LoginForm.tsx upon success
    const storedName = localStorage.getItem('user_first_name');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <CandidateSidebar />
      
      {/* Main Content Area */}
      <main className="ml-64 p-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {/* 🚀 Dynamic Name Display */}
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Welcome back, {userName}</h1>
            <p className="text-gray-500 mt-1">Here is a summary of your job search activity.</p>
          </div>
          <Link 
            href="/jobs" 
            className="flex items-center gap-2 bg-[#067a62] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-md"
          >
            <Search size={18} />
            Find Work
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Applications" value="5" icon={<FileText size={20} className="text-gray-400"/>} />
          <StatCard title="Profile Views" value="142" icon={<Eye size={20} className="text-gray-400"/>} />
          <StatCard title="Interviews" value="2" icon={<MessageSquare size={20} className="text-gray-400"/>} />
          <StatCard title="Response Rate" value="80%" icon={<TrendingUp size={20} className="text-gray-400"/>} />
        </div>

        {/* Recent Applications Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 font-serif">Recent Applications</h3>
            <button className="text-sm font-medium text-[#067a62] hover:underline flex items-center gap-1">
              View All <ExternalLink size={14}/>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Applied</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <ApplicationRow role="Senior Frontend Engineer" company="Meridian Labs" date="Jan 28, 2026" status="Interview" />
                <ApplicationRow role="Backend Developer" company="DataForge" date="Jan 25, 2026" status="Reviewing" />
                <ApplicationRow role="Marketing Coordinator" company="BrightPath" date="Jan 20, 2026" status="Rejected" />
                <ApplicationRow role="Full Stack Developer" company="NexGen Solutions" date="Feb 1, 2026" status="Applied" />
                <ApplicationRow role="Data Scientist" company="InsightIQ" date="Feb 3, 2026" status="Offered" />
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

function ApplicationRow({ role, company, date, status }: { role: string, company: string, date: string, status: string }) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Interview': return 'bg-emerald-100 text-emerald-700';
      case 'Reviewing': return 'bg-amber-100 text-amber-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Offered': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-4 font-semibold text-gray-900">{role}</td>
      <td className="px-6 py-4 text-gray-600">{company}</td>
      <td className="px-6 py-4 text-gray-500">{date}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-gray-400 hover:text-[#067a62] transition-colors">
          <ExternalLink size={18} />
        </button>
      </td>
    </tr>
  );
}
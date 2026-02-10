'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function EmployerDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 12,
    totalApplicants: 48,
    views: 1240,
  });

  const [recentJob, setRecentJob] = useState<any>(null);

  useEffect(() => {
    // Check for a newly posted job in local storage (Simulating real backend data for now)
    const savedJob = localStorage.getItem('latest_posted_job');
    if (savedJob) {
      setRecentJob(JSON.parse(savedJob));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0f172a] text-white flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-[#067a62] p-2 rounded-lg">
              <Briefcase size={24} strokeWidth={2.5} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">TalentBridge</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem icon={<Briefcase size={20} />} label="Dashboard" active />
          <NavItem icon={<Users size={20} />} label="Candidates" />
          <NavItem icon={<Search size={20} />} label="Job Postings" />
          <NavItem icon={<Bell size={20} />} label="Notifications" badge="3" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => window.location.href = '/'} 
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            {/* 🚀 CHANGED: "Meridian Labs" -> "Welcome, Employer" */}
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Employer</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your job postings and find top talent.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/post-job" 
              className="bg-[#067a62] hover:bg-[#056350] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-900/10 transition-all flex items-center gap-2 active:scale-[0.98]"
            >
              <Plus size={18} strokeWidth={2.5} />
              Post New Job
            </Link>
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <span className="font-bold text-gray-600">E</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Active Jobs" 
              value={stats.activeJobs} 
              icon={<Briefcase className="text-[#067a62]" size={24} />} 
              trend="+2 this week"
            />
            <StatCard 
              title="Total Applicants" 
              value={stats.totalApplicants} 
              icon={<Users className="text-blue-600" size={24} />} 
              trend="+12% vs last month"
            />
            <StatCard 
              title="Total Views" 
              value={stats.views} 
              icon={<TrendingUp className="text-purple-600" size={24} />} 
              trend="+8% vs last month"
            />
          </div>

          {/* RECENT ACTIVITY / POSTED JOBS */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Job Postings</h2>
              <button className="text-[#067a62] font-semibold text-sm hover:underline flex items-center gap-1">
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {/* DYNAMIC JOB ITEM (If one exists in local storage) */}
              {recentJob && (
                <JobRow 
                  title={recentJob.role}
                  type={recentJob.location}
                  applicants={recentJob.applicants}
                  status={recentJob.status}
                  posted={recentJob.posted}
                />
              )}

              {/* STATIC PLACEHOLDER JOBS */}
              {!recentJob && (
                <>
                  <JobRow 
                    title="Senior Frontend Developer" 
                    type="Full-time • Remote" 
                    applicants="12" 
                    status="Active" 
                    posted="2 days ago" 
                  />
                  <JobRow 
                    title="Product Designer" 
                    type="Contract • Nairobi" 
                    applicants="8" 
                    status="Active" 
                    posted="5 days ago" 
                  />
                  <JobRow 
                    title="Backend Engineer (Python)" 
                    type="Full-time • Hybrid" 
                    applicants="24" 
                    status="Closed" 
                    posted="1 week ago" 
                  />
                </>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function NavItem({ icon, label, active, badge }: any) {
  return (
    <button 
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all group ${
        active ? 'bg-[#067a62] text-white shadow-lg shadow-emerald-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function JobRow({ title, type, applicants, status, posted }: any) {
  return (
    <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors gap-4">
      <div>
        <h3 className="font-bold text-gray-900 text-base">{title}</h3>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Briefcase size={14}/> {type}</span>
          <span className="flex items-center gap-1"><Clock size={14}/> {posted}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-center">
          <span className="block font-bold text-gray-900">{applicants}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Applicants</span>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          status === 'Active' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-gray-100 text-gray-600 border-gray-200'
        }`}>
          {status}
        </span>
        
        <button className="text-gray-400 hover:text-gray-600 p-2">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
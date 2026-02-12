'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, DollarSign, Loader2, AlertCircle, Clock, Bookmark, Wifi, Filter } from 'lucide-react';
import api from '@/lib/axios';

// 1. MAPPINGS: Match Frontend Labels to Backend Model Values exactly
const JOB_TYPE_MAP: { [key: string]: string } = {
  'Full-time': 'Full-Time',
  'Part-time': 'Part-Time',
  'Contract': 'Contract',
  'Freelance': 'Freelance',
  'Internship': 'Internship'
};

export default function FindJobsPage() {
  const router = useRouter();
  
  // Data State
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<number>>(new Set());
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(''); // Location State
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedWorkStyle, setSelectedWorkStyle] = useState<string[]>([]);

  // 2. THE SEARCH ENGINE
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Prepare comma-separated strings for backend (e.g. "Full-Time,Part-Time")
      const backendTypes = selectedTypes.map(t => JOB_TYPE_MAP[t]).filter(Boolean).join(',');
      const backendExperience = selectedExperience.join(','); 
      const backendWorkStyle = selectedWorkStyle.join(',');

      // Construct Query Params for Django
      const params: any = {
        is_active: true
      };
      
      // ✅ FIX: Connect all inputs to the Backend parameters
      if (searchQuery) params.search = searchQuery;
      if (selectedLocation) params.location = selectedLocation; // "Miami" now works!
      if (backendTypes) params.job_type = backendTypes;
      if (backendExperience) params.experience_level = backendExperience;
      if (backendWorkStyle) params.remote_status = backendWorkStyle;

      const response = await api.get('jobs/', { params });
      
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setJobs(data);

      // Restore bookmarks
      const initialBookmarks = new Set<number>();
      data.forEach((job: any) => {
         if (job.is_bookmarked) initialBookmarks.add(job.id);
      });
      setBookmarkedJobs(initialBookmarks);

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Connecting to TalentBridge server...");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedLocation, selectedTypes, selectedExperience, selectedWorkStyle]);

  // Debounce (Wait 500ms after typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500); 
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const handleApplyClick = (jobId: string | number) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push(`/jobs/${jobId}`);
    } else {
      router.push(`/login?redirect=/jobs/${jobId}`);
    }
  };

  const handleBookmark = async (jobId: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push(`/login?redirect=/jobs`);
      return;
    }
    try {
      await api.post(`jobs/${jobId}/bookmark/`);
      setBookmarkedJobs((prev) => {
        const newBookmarks = new Set(prev);
        if (newBookmarks.has(jobId)) newBookmarks.delete(jobId);
        else newBookmarks.add(jobId);
        return newBookmarks;
      });
    } catch (err: any) {
      console.error("Failed to bookmark job", err);
    }
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]);
  };

  // Filter Options (Must match Django Model values)
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const experienceLevels = ['Junior', 'Mid', 'Senior', 'Lead'];
  const workStyles = ['Remote', 'On-site', 'Hybrid'];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- HERO / SEARCH SECTION --- */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Find Your Next Role</h1>
          <p className="text-gray-500 text-sm">
            {loading ? 'Scanning opportunities...' : `${jobs.length} active jobs found`}
          </p>
          
          <div className="mt-6 flex flex-col md:flex-row gap-4 max-w-4xl">
            {/* 1. Keyword Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, keywords, or company" 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#067a62] outline-none shadow-sm"
              />
            </div>
            {/* 2. Location Search (Added back!) */}
            <div className="relative md:w-1/3">
               <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="text"
                 value={selectedLocation}
                 onChange={(e) => setSelectedLocation(e.target.value)}
                 placeholder="City, state, or zip"
                 className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#067a62] outline-none shadow-sm"
               />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-lg flex items-center gap-3 border border-amber-200 text-sm">
            <Loader2 className="animate-spin" size={18} />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR FILTERS --- */}
          <aside className="w-full lg:w-64 shrink-0 hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                 <Filter size={20} className="text-[#067a62]"/>
                 <h3 className="font-bold text-gray-900">Filters</h3>
              </div>
              
              <div className="space-y-8">
                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Job Type</label>
                  <div className="space-y-3">
                    {jobTypes.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedTypes.includes(type) ? 'border-[#067a62] bg-[#067a62]' : 'border-gray-300'}`}>
                          {selectedTypes.includes(type) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedTypes.includes(type)} onChange={() => handleFilterChange(setSelectedTypes, type)} />
                        <span className="text-gray-600 text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Experience</label>
                  <div className="space-y-3">
                    {experienceLevels.map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedExperience.includes(level) ? 'border-[#067a62] bg-[#067a62]' : 'border-gray-300'}`}>
                          {selectedExperience.includes(level) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedExperience.includes(level)} onChange={() => handleFilterChange(setSelectedExperience, level)} />
                        <span className="text-gray-600 text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Work Style Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Remote Status</label>
                  <div className="space-y-3">
                    {workStyles.map(style => (
                      <label key={style} className="flex items-center gap-3 cursor-pointer group">
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedWorkStyle.includes(style) ? 'border-[#067a62] bg-[#067a62]' : 'border-gray-300'}`}>
                          {selectedWorkStyle.includes(style) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedWorkStyle.includes(style)} onChange={() => handleFilterChange(setSelectedWorkStyle, style)} />
                        <span className="text-gray-600 text-sm">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* --- MAIN JOB LIST --- */}
          <main className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <Building2 className="mx-auto text-gray-300 mb-4" size={40} />
                <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
                <p className="text-gray-500 text-sm mt-1">
                  We couldn't find any jobs matching "{searchQuery || 'your criteria'}" 
                  {selectedLocation && ` in "${selectedLocation}"`}.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLocation('');
                    setSelectedTypes([]);
                    setSelectedExperience([]);
                    setSelectedWorkStyle([]);
                  }}
                  className="mt-4 text-[#067a62] font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow relative">
                     <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 border border-emerald-100">
                          <Building2 className="text-[#067a62]" size={24} />
                        </div>
                        <div>
                          <h2 
                            className="text-lg font-bold text-gray-900 hover:text-[#067a62] cursor-pointer" 
                            onClick={() => handleApplyClick(job.id)}
                          >
                            {job.title}
                          </h2>
                          <p className="text-gray-500 text-sm">{job.company_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 items-end shrink-0">
                        <button 
                          onClick={() => handleApplyClick(job.id)} 
                          className="bg-[#067a62] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#056350] transition-colors"
                        >
                          Apply Now
                        </button>
                        <button 
                          onClick={() => handleBookmark(job.id)}
                          className={`p-2 border rounded-lg transition-colors ${bookmarkedJobs.has(job.id) ? 'border-[#067a62] bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          <Bookmark 
                            size={18} 
                            className={bookmarkedJobs.has(job.id) ? "fill-[#067a62] text-[#067a62]" : "text-gray-500"} 
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-5">
                      <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><DollarSign size={16} /> {job.salary_range || job.salary}</span>
                      <span className="flex items-center gap-1.5 text-[#067a62]"><Wifi size={16} /> {job.remote_status}</span>
                    </div>

                    <p className="text-gray-600 text-sm mt-5 leading-relaxed line-clamp-2 pr-12">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {job.job_type}
                      </span>
                      {job.experience_level && (
                         <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                           {job.experience_level}
                         </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
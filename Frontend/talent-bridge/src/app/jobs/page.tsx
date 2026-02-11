'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, DollarSign, Loader2, AlertCircle, Clock, Bookmark, Wifi } from 'lucide-react';
import api from '@/lib/axios';

export default function FindJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<number>>(new Set());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedWorkStyle, setSelectedWorkStyle] = useState<string[]>([]);

  useEffect(() => {
    const fetchPublicJobs = async () => {
      try {
        const response = await api.get('jobs/');
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        const activeJobs = data.filter((j: any) => j.is_active !== false);
        setJobs(activeJobs);

        const initialBookmarks = new Set<number>();
        activeJobs.forEach((job: any) => {
          if (job.is_bookmarked) {
            initialBookmarks.add(job.id);
          }
        });
        setBookmarkedJobs(initialBookmarks);
      } catch (err: any) {
        console.error("Could not fetch jobs", err);
        setError("Failed to load available jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicJobs();
  }, []);

  const handleApplyClick = (jobId: string | number) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push(`/login?redirect=/jobs/${jobId}`);
    } else {
      router.push(`/jobs/${jobId}`);
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
        if (newBookmarks.has(jobId)) {
          newBookmarks.delete(jobId);
        } else {
          newBookmarks.add(jobId);
        }
        return newBookmarks;
      });
    } catch (err: any) {
      console.error("Failed to bookmark job", err);
    }
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]);
  };

  const filteredJobs = jobs.filter(job => {
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      (job.title && job.title.toLowerCase().includes(searchLower)) ||
      (job.company_name && job.company_name.toLowerCase().includes(searchLower)) ||
      (job.description && job.description.toLowerCase().includes(searchLower)) ||
      (job.requirements && job.requirements.toLowerCase().includes(searchLower));

    let typeLabel = job.job_type;
    if (job.job_type === 'FT') typeLabel = 'Full-time';
    else if (job.job_type === 'PT') typeLabel = 'Part-time';
    else if (job.job_type === 'CT') typeLabel = 'Contract';
    else if (job.job_type === 'FL') typeLabel = 'Freelance';

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(typeLabel);

    return matchesSearch && matchesType;
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
  const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];
  const workStyles = ['Remote only', 'On-site', 'Hybrid'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-[#067a62]" size={40} />
        <p className="text-gray-500 mt-4">Finding the latest opportunities...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Find Your Next Role</h1>
          <p className="text-gray-500 text-sm">{filteredJobs.length} opportunities waiting for you</p>
          
          <div className="mt-6 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, company, skills, or requirements..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#067a62] focus:border-[#067a62] outline-none transition-all shadow-sm text-sm text-gray-900"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-100 text-sm">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="w-full lg:w-64 shrink-0 hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Filters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Job Type</label>
                  <div className="space-y-3">
                    {jobTypes.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedTypes.includes(type) ? 'border-[#067a62] bg-[#067a62]' : 'border-gray-300 group-hover:border-[#067a62]'}`}>
                          {selectedTypes.includes(type) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedTypes.includes(type)} onChange={() => handleFilterChange(setSelectedTypes, type)} />
                        <span className="text-gray-600 text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Experience Level</label>
                  <div className="space-y-3">
                    {experienceLevels.map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedExperience.includes(level) ? 'border-[#067a62] bg-[#067a62]' : 'border-gray-300 group-hover:border-[#067a62]'}`}>
                          {selectedExperience.includes(level) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedExperience.includes(level)} onChange={() => handleFilterChange(setSelectedExperience, level)} />
                        <span className="text-gray-600 text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Work Style</label>
                  <div className="space-y-3">
                    {workStyles.map(style => (
                      <label key={style} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedWorkStyle.includes(style) ? 'border-[#067a62] bg-[#067a62]' : 'border-gray-300 group-hover:border-[#067a62]'}`}>
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

          <main className="flex-1">
            <p className="text-sm text-gray-500 mb-4">Showing {filteredJobs.length} results</p>
            
            <div className="space-y-4">
              {filteredJobs.length === 0 && !error ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                  <Building2 className="mx-auto text-gray-300 mb-4" size={40} />
                  <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
                  <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
                          <Building2 className="text-gray-400" size={24} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 hover:text-[#067a62] transition-colors cursor-pointer" onClick={() => handleApplyClick(job.id)}>
                            {job.title}
                          </h2>
                          <p className="text-gray-500 text-sm mt-0.5">{job.company_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 items-end shrink-0">
                        <button 
                          onClick={() => handleApplyClick(job.id)}
                          className="bg-[#067a62] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#056350] transition-colors shadow-sm"
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
                      <span className="flex items-center gap-1.5"><DollarSign size={16} /> {job.salary_range}</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} /> 2 days ago</span>
                      <span className="flex items-center gap-1.5 text-[#067a62]"><Wifi size={16} /> Remote</span>
                    </div>

                    <p className="text-gray-600 text-sm mt-5 leading-relaxed line-clamp-2 pr-12">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {job.job_type === 'FT' ? 'Full-time' : job.job_type === 'PT' ? 'Part-time' : job.job_type === 'CT' ? 'Contract' : job.job_type === 'FL' ? 'Freelance' : job.job_type}
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Wifi, Bookmark, CheckCircle } from 'lucide-react';
// import api from '@/lib/axios'; // We can comment this out for the purely visual demo

interface JobProps {
  id?: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAt: string;
  isRemote?: boolean;
  description: string;
  tags: string[];
}

export default function JobCard({ id, title, company, location, salary, postedAt, isRemote, description, tags }: JobProps) {
  const [applied, setApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    // 1. Start Loading ("Sending...")
    setLoading(true);

    // 2. Simulate a network delay (1.5 seconds) so the user sees "Sending..."
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 3. FORCE SUCCESS for the Demo Video
    // (We skip the API call here to ensure it doesn't fail on camera)
    setApplied(true);
    setLoading(false);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 mb-4 group">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            {/* Generic Company Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#067a62] transition-colors font-serif">{title}</h3>
            <p className="text-gray-600 font-medium">{company}</p>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
              <span className="flex items-center gap-1"><DollarSign size={14}/> {salary}</span>
              <span className="flex items-center gap-1"><Clock size={14}/> {postedAt}</span>
              {isRemote && (
                <span className="flex items-center gap-1 text-[#067a62] font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Wifi size={12}/> Remote
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-end">
          {/* APPLY BUTTON */}
          <button 
            onClick={handleApply}
            disabled={applied || loading}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2
              ${applied 
                ? 'bg-emerald-100 text-[#067a62] cursor-default ring-1 ring-[#067a62]' // Green State
                : 'bg-[#067a62] hover:bg-[#056350] text-white' // Normal State
              }`}
          >
            {loading ? (
              // Loading Spinner
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : applied ? (
              // Success State
              <>Applied <CheckCircle size={16}/></>
            ) : (
              // Default State
              'Apply Now'
            )}
          </button>

          <button 
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-all ${bookmarked ? 'text-[#067a62] bg-emerald-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-3xl">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag, index) => (
          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
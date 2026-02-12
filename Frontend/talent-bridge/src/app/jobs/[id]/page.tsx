'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, DollarSign, ArrowLeft, Loader2, Send, Upload, FileText } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function CandidateJobDetailPage() {
  const params = useParams(); // Unwrap params safely
  const id = params?.id; 
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [notFound, setNotFound] = useState(false);
  
  // Form State
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState(''); 

  useEffect(() => {
    // 1. Auth Check
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Redirect to login but remember to bring them back to this job page
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }

    if (!id) return;

    // 2. Fetch Job Data
    const fetchJob = async () => {
      try {
        const response = await api.get(`jobs/${id}/`);
        setJob(response.data);
      } catch (err: any) {
        console.error("Error fetching job:", err);
        if (err.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleApply = async () => {
    if (!resume || !coverLetter) {
      alert("Please upload a resume and write a cover letter.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('cover_letter', coverLetter); 
      
      await api.post(`jobs/${id}/apply/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setApplied(true);
      setTimeout(() => router.push('/candidate'), 2000); 
    } catch (err: any) {
      console.error("Apply error:", err);
      // Handle "You have already applied" errors gracefully
      if (err.response?.status === 400 && err.response?.data?.detail?.includes('already applied')) {
         alert("You have already applied for this job!");
         setApplied(true); // Treat as success state to stop them from retrying
      } else {
         const errorMsg = err.response?.data?.detail || "Application failed. Please check your inputs.";
         alert(`Error: ${errorMsg}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20 min-h-screen"><Loader2 className="animate-spin text-[#067a62]" size={40}/></div>;
  
  if (notFound) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700">Job Not Found</h2>
      <Link href="/jobs" className="mt-4 text-[#067a62] hover:underline">Return to Jobs</Link>
    </div>
  );

  if (applied) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-screen">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Send className="text-green-600" size={30} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Application Sent!</h2>
      <p className="text-gray-500 mt-2">Good luck! Redirecting you to dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/jobs" className="flex items-center gap-2 text-gray-500 mb-8 hover:text-[#067a62] font-medium w-fit">
          <ArrowLeft size={18} /> Back to Search
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8 border-b border-gray-100 pb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job?.title}</h1>
              <p className="text-[#067a62] text-xl font-bold mb-5">{job?.company_name}</p>
              <div className="flex flex-wrap gap-3 text-gray-600 text-sm">
                 <span className="flex items-center gap-1"><MapPin size={16}/> {job?.location}</span>
                 <span className="flex items-center gap-1"><DollarSign size={16}/> ${job?.salary?.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Application Form */}
            <div className="flex flex-col gap-4 min-w-[320px] bg-gray-50 p-6 rounded-2xl">
              <h3 className="font-bold text-gray-900">Apply Now</h3>
              
              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Cover Letter</label>
                <textarea 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a good fit..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#067a62] outline-none text-sm min-h-[120px]"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Resume / CV</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all bg-white ${
                    resume ? 'border-[#067a62] bg-emerald-50/30' : 'border-gray-200 hover:border-[#067a62]'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                  />
                  {resume ? (
                    <div className="flex flex-col items-center text-[#067a62]">
                      <FileText size={24} className="mb-2" />
                      <span className="text-sm font-bold truncate max-w-[200px]">{resume.name}</span>
                      <span className="text-xs text-gray-500 mt-1">Click to change</span>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Upload size={24} className="mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-600">Click to upload PDF</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleApply}
                disabled={submitting || !resume || !coverLetter}
                className="w-full bg-[#067a62] text-white py-3 rounded-xl font-bold hover:bg-[#056350] disabled:opacity-50 flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Submit Application
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8 max-w-2xl">
            <section>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <div className="w-1 h-6 bg-[#067a62] rounded-full"></div> Job Description
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job?.description}</p>
            </section>
            <section>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <div className="w-1 h-6 bg-[#067a62] rounded-full"></div> Requirements
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job?.requirements}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
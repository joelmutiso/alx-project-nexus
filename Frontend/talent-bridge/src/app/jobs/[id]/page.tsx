'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Briefcase, MapPin, DollarSign, ArrowLeft, Loader2, CheckCircle, Send, Upload, FileText } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function CandidateJobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }

    const fetchJob = async () => {
      try {
        const response = await api.get(`jobs/${id}/`);
        setJob(response.data);
      } catch (err) {
        console.error("Error fetching job:", err);
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
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (resume) {
        formData.append('resume', resume);
      }
      
      await api.post(`jobs/${id}/apply/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setApplied(true);
      setTimeout(() => router.push('/candidate'), 2000); // Redirects to Candidate Dashboard after success
    } catch (err: any) {
      console.error("Apply error:", err);
      const errorMsg = err.response?.data?.detail || "Make sure you've uploaded a valid PDF resume.";
      alert(`Application failed: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-gray-50">
      <Loader2 className="animate-spin text-[#067a62]" size={40} />
      <p className="text-gray-500 mt-4">Preparing application...</p>
    </div>
  );

  if (applied) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center min-h-screen bg-gray-50">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-[#067a62]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Application Submitted!</h2>
        <p className="text-gray-500 mt-2">The employer has been notified. Good luck on your application!</p>
        <p className="text-sm text-gray-400 mt-4">Redirecting you to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/jobs" className="flex items-center gap-2 text-gray-500 mb-8 hover:text-[#067a62] transition-colors w-fit font-medium">
          <ArrowLeft size={18} /> Back to Search
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8 border-b border-gray-100 pb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{job?.title}</h1>
              <p className="text-[#067a62] text-xl font-bold mb-5">{job?.company_name}</p>
              <div className="flex flex-wrap gap-3 text-gray-600 text-sm">
                <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                  <MapPin size={16} className="text-gray-400"/> {job?.location}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                  <Briefcase size={16} className="text-gray-400"/> 
                  {job?.job_type === 'FT' ? 'Full-time' : job?.job_type === 'PT' ? 'Part-time' : job?.job_type === 'CT' ? 'Contract' : job?.job_type === 'FL' ? 'Freelance' : job?.job_type}
                </span>
                <span className="flex items-center gap-1.5 text-[#067a62] font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                  <DollarSign size={16}/> {job?.salary_range}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[280px]">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  resume ? 'border-[#067a62] bg-emerald-50' : 'border-gray-200 hover:border-[#067a62] hover:bg-gray-50'
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
                  <div className="flex flex-col items-center justify-center gap-2 text-[#067a62]">
                    <FileText size={28} />
                    <span className="text-sm font-bold truncate max-w-[200px]">{resume.name}</span>
                    <span className="text-xs text-[#067a62]/70">Click to change file</span>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Upload size={28} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-bold text-gray-700">Upload Resume</p>
                    <p className="text-xs mt-1">PDF, DOC, DOCX up to 5MB</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleApply}
                disabled={submitting || !resume}
                className="w-full bg-[#067a62] text-white py-4 rounded-xl font-bold text-base hover:bg-[#056350] transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {resume ? 'Submit Application' : 'Upload Resume to Apply'}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-5 bg-[#067a62] rounded-full"></div>
                Job Description
              </h3>
              <p className="text-gray-600 text-sm leading-loose break-words whitespace-pre-wrap">
                {job?.description}
              </p>
            </section>
            
            {job?.requirements && (
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-[#067a62] rounded-full"></div>
                  Requirements
                </h3>
                <p className="text-gray-600 text-sm leading-loose break-words whitespace-pre-wrap">
                  {job?.requirements}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
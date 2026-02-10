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
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleApply = async () => {
    setSubmitting(true);
    try {
      // 🚀 THE FIX: Use FormData to avoid "Unsupported media type" JSON errors
      const formData = new FormData();
      if (resume) {
        formData.append('resume', resume);
      }
      
      // Sending as multipart/form-data to satisfy Django MultiPartParser
      await api.post(`jobs/${id}/apply/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setApplied(true);
      setTimeout(() => router.push('/jobs'), 2000);
    } catch (err: any) {
      console.error("Apply error:", err);
      const errorMsg = err.response?.data?.detail || "Make sure you've uploaded a valid PDF resume.";
      alert(`Application failed: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20 min-h-screen">
      <Loader2 className="animate-spin text-[#067a62]" size={40} />
    </div>
  );

  if (applied) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center min-h-screen">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Application Submitted!</h2>
        <p className="text-gray-500 mt-2">The employer has been notified. Good luck, Joel!</p>
        <p className="text-sm text-gray-400 mt-4">Redirecting you to job listings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <Link href="/jobs" className="flex items-center gap-2 text-gray-500 mb-8 hover:text-[#067a62] transition-colors">
        <ArrowLeft size={18} /> Back to Search
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8 border-b border-gray-50 pb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-black text-gray-900 mb-2 leading-tight">{job?.title}</h1>
            <p className="text-[#067a62] text-xl font-bold mb-4">{job?.company_name}</p>
            <div className="flex flex-wrap gap-4 text-gray-500">
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg text-sm">
                <MapPin size={18}/> {job?.location}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg text-sm">
                <Briefcase size={18}/> {job?.job_type}
              </span>
              <span className="flex items-center gap-1.5 text-[#067a62] font-bold bg-emerald-50 px-3 py-1.5 rounded-lg text-sm">
                <DollarSign size={18}/> {job?.salary_range}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 min-w-[280px]">
            {/* Resume Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                resume ? 'border-[#067a62] bg-emerald-50' : 'border-gray-200 hover:border-[#067a62]'
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
                <div className="flex items-center justify-center gap-2 text-[#067a62] font-bold">
                  <FileText size={20} />
                  <span className="text-sm truncate max-w-[180px]">{resume.name}</span>
                </div>
              ) : (
                <div className="text-gray-400">
                  <Upload size={24} className="mx-auto mb-1" />
                  <p className="text-xs font-bold uppercase">Upload Resume (PDF)</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleApply}
              disabled={submitting || !resume}
              className="w-full bg-[#067a62] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#056350] transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/10 disabled:opacity-50 disabled:grayscale cursor-pointer"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {resume ? 'Submit Application' : 'Upload Resume to Apply'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#067a62] rounded-full"></div>
              Job Description
            </h3>
            <p className="text-gray-600 leading-relaxed break-words whitespace-pre-wrap">
              {job?.description}
            </p>
          </section>
          
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#067a62] rounded-full"></div>
              Requirements
            </h3>
            <p className="text-gray-600 leading-relaxed break-words whitespace-pre-wrap">
              {job?.requirements}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
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
  
  // 1. ADDED COVER LETTER STATE
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState(''); 

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
    if (!resume || !coverLetter) {
      alert("Please upload a resume and write a cover letter.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      // 2. APPEND COVER LETTER TO PAYLOAD
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
      const errorMsg = err.response?.data?.detail || "Application failed. Please check your inputs.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ... (Loading and Applied states remain the same) ...
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin"/></div>;
  if (applied) return <div className="text-center py-20 text-green-600 font-bold text-2xl">Application Sent!</div>;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/jobs" className="flex items-center gap-2 text-gray-500 mb-8 hover:text-[#067a62]">
          <ArrowLeft size={18} /> Back to Search
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          {/* Header Section (Title, Company, etc.) */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8 border-b border-gray-100 pb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job?.title}</h1>
              <p className="text-[#067a62] text-xl font-bold mb-5">{job?.company_name}</p>
              <div className="flex flex-wrap gap-3 text-gray-600 text-sm">
                 <span className="flex items-center gap-1"><MapPin size={16}/> {job?.location}</span>
                 <span className="flex items-center gap-1"><DollarSign size={16}/> {job?.salary_range}</span>
              </div>
            </div>
            
            {/* 3. APPLICATION FORM SECTION */}
            <div className="flex flex-col gap-4 min-w-[320px]">
              
              {/* Cover Letter Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter</label>
                <textarea 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why are you a good fit?"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#067a62] outline-none text-sm min-h-[100px]"
                />
              </div>

              {/* Resume Upload */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
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
                  <div className="flex flex-col items-center text-[#067a62]">
                    <FileText size={24} />
                    <span className="text-sm font-bold truncate max-w-[200px]">{resume.name}</span>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Upload size={24} className="mx-auto mb-2" />
                    <p className="text-sm font-bold">Upload Resume</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleApply}
                disabled={submitting || !resume || !coverLetter}
                className="w-full bg-[#067a62] text-white py-3 rounded-xl font-bold hover:bg-[#056350] disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Submit Application
              </button>
            </div>
          </div>

          {/* Job Description & Requirements */}
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold mb-4">Job Description</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{job?.description}</p>
            </section>
            <section>
              <h3 className="text-lg font-bold mb-4">Requirements</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{job?.requirements}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
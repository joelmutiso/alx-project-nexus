'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema, JobInput } from '@/lib/validations/jobSchema';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

export default function PostJobForm() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobInput>({
    // 🚀 THE FIX: 'as any' tells TypeScript to stop complaining and trust us.
    resolver: zodResolver(jobSchema) as any, 
    defaultValues: {
      title: '',
      company: '',
      location: '',
      salary: '',
      jobType: 'FT', 
      isRemote: false, // This satisfies the boolean requirement
      description: '',
      requirements: ''
    }
  });

  const onSubmit = async (data: JobInput) => {
    setServerError('');
    try {
      await api.post('jobs/', {
        title: data.title,
        company_name: data.company, 
        location: data.location,
        salary_range: data.salary,
        job_type: data.jobType,
        is_remote: data.isRemote,
        description: data.description,
        requirements: data.requirements,
        is_active: true
      });
      
      setSuccess(true);
      // Redirect after 1.5 seconds
      setTimeout(() => window.location.href = '/employer/jobs', 1500);
      
    } catch (err: any) {
      console.error("Job Post Error", err);
      
      if (err.response?.status === 400) {
         const errorData = err.response?.data;
         setServerError(`Validation Error: ${JSON.stringify(errorData)}`);
      } else if (err.response?.status === 401) {
        setServerError("Session expired. Please log in again.");
      } else {
        setServerError("Failed to connect to server.");
      }
    }
  };

  if (success) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h3>
        <p className="text-gray-500">Redirecting you to your job listings...</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#067a62]/20 focus:border-[#067a62] outline-none transition-all";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-100">
      
      <div className="border-b border-gray-100 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>
        <p className="text-gray-500 text-sm mt-1">Reach thousands of developers and designers.</p>
      </div>
      
      {/* JOB DETAILS */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Job Title</label>
            <input {...register('title')} placeholder="e.g. Senior React Developer" className={inputClass} />
            {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Company Name</label>
            <input {...register('company')} placeholder="e.g. TechCorp Inc." className={inputClass} />
            {errors.company && <p className="text-xs text-red-500 font-medium">{errors.company.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Location</label>
            <input {...register('location')} placeholder="e.g. Nairobi, Kenya" className={inputClass} />
            {errors.location && <p className="text-xs text-red-500 font-medium">{errors.location.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Salary Range</label>
            <input {...register('salary')} placeholder="e.g. $80k - $120k" className={inputClass} />
            {errors.salary && <p className="text-xs text-red-500 font-medium">{errors.salary.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Job Type</label>
            <select {...register('jobType')} className={`${inputClass} bg-white`}>
              <option value="FT">Full-time</option>
              <option value="PT">Part-time</option>
              <option value="CT">Contract</option>
              <option value="FL">Freelance</option>
              <option value="IN">Internship</option>
            </select>
            {errors.jobType && <p className="text-xs text-red-500 font-medium">{errors.jobType.message}</p>}
          </div>

          <div className="flex items-center gap-3 mt-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <input type="checkbox" {...register('isRemote')} id="remote" className="w-5 h-5 text-[#067a62] rounded focus:ring-[#067a62]" />
            <label htmlFor="remote" className="text-sm font-bold text-gray-700 cursor-pointer">Fully Remote Position</label>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">Job Description</label>
          <textarea {...register('description')} rows={5} className={`${inputClass} resize-none`} placeholder="Describe the role..." />
          {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">Requirements</label>
          <textarea {...register('requirements')} rows={4} className={`${inputClass} resize-none`} placeholder="List key skills..." />
          {errors.requirements && <p className="text-xs text-red-500 font-medium">{errors.requirements.message}</p>}
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {serverError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-100">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium break-all">{serverError}</span>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-[#067a62] text-white py-4 rounded-xl font-bold hover:bg-[#056350] transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Posting Job...' : 'Publish Job Listing'}
          {!isSubmitting && <ArrowRight size={20}/>}
        </button>
      </div>
    </form>
  );
}
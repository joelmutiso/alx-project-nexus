import React from 'react';

export default function JobFilters() {
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-gray-100 h-fit sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 font-serif text-lg">Filters</h3>
        <button className="text-sm text-gray-400 hover:text-[#067a62]">Clear all</button>
      </div>

      {/* Job Type Section */}
      <div className="mb-8">
        <h4 className="font-bold text-gray-900 mb-3 text-sm">Job Type</h4>
        <div className="space-y-2.5">
          {["Full-time", "Part-time", "Contract", "Freelance"].map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer w-5 h-5 border-2 border-gray-300 rounded checked:bg-[#067a62] checked:border-[#067a62] transition-all appearance-none" />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-sm">Experience Level</h4>
        <div className="space-y-2.5">
          {["Entry Level", "Mid Level", "Senior", "Lead / Manager"].map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer w-5 h-5 border-2 border-gray-300 rounded checked:bg-[#067a62] checked:border-[#067a62] transition-all appearance-none" />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">{level}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
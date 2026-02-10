import { UserPlus, Search, Send, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    title: "Create Your Profile",
    description: "Sign up in seconds and build a comprehensive profile that showcases your skills, experience, and career goals.",
    icon: <UserPlus className="text-[#067a62]" size={24} />,
    step: "1"
  },
  {
    title: "Discover Opportunities",
    description: "Browse thousands of curated job listings or let our smart matching engine find the perfect fit for you.",
    icon: <Search className="text-[#067a62]" size={24} />,
    step: "2"
  },
  {
    title: "Apply with Confidence",
    description: "Submit tailored applications with one click. Attach work samples, portfolios, and custom cover letters.",
    icon: <Send className="text-[#067a62]" size={24} />,
    step: "3"
  },
  {
    title: "Land Your Dream Role",
    description: "Track your applications, communicate with employers, and accept offers all within the platform.",
    icon: <CheckCircle2 className="text-[#067a62]" size={24} />,
    step: "4"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#f9fafb]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How TalentBridge Works
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-20">
          Four simple steps to your next career milestone.
        </p>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((item, index) => (
              <div key={index} className="flex flex-col items-center group">
                {/* Icon Circle */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-50 group-hover:border-[#067a62] transition-colors duration-300">
                    {item.icon}
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#067a62] text-white rounded-full flex items-center justify-center text-sm font-bold border-4 border-[#f9fafb]">
                    {item.step}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed px-4">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
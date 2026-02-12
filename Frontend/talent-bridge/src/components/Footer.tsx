import Link from 'next/link';
import { Briefcase, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-[#067a62] p-1.5 rounded-lg">
                <Briefcase className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">TalentBridge</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Connecting the world's best talent with the world's best companies.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18}/>} />
              <SocialIcon icon={<Linkedin size={18}/>} />
              <SocialIcon icon={<Facebook size={18}/>} />
              <SocialIcon icon={<Instagram size={18}/>} />
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">For Candidates</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/jobs" className="hover:text-[#067a62] transition-colors">Find Work</Link></li>
              <li><Link href="/post-job" className="hover:text-[#067a62] transition-colors">Dashboard</Link></li>
              <li><Link href="/post-job" className="hover:text-[#067a62] transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">For Employers</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/post-job" className="hover:text-[#067a62] transition-colors">Post a Job</Link></li>
              <li><Link href="/post-job" className="hover:text-[#067a62] transition-colors">Dashboard</Link></li>
              <li><Link href="/post-job" className="hover:text-[#067a62] transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-[#067a62] transition-colors">About Us</Link></li>
              <li><Link href="/about" className="hover:text-[#067a62] transition-colors">Contact</Link></li>
              <li><Link href="/about" className="hover:text-[#067a62] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2026 TalentBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-[#067a62] hover:text-white transition-all">
      {icon}
    </a>
  );
}
'use client';

import { motion } from 'framer-motion';
import { Sparkles, Github, Twitter, Linkedin, Mail, Cpu, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-slate-950/50 backdrop-blur-md overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-ai-primary to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 group cursor-default">
              <Sparkles className="w-6 h-6 text-yellow-400 group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                AI CV Maker
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering professionals with advanced AI technology to craft high-impact career stories.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <SocialIcon icon={<Twitter size={18} />} href="https://twitter.com" />
              <SocialIcon icon={<Github size={18} />} href="https://github.com" />
              <SocialIcon icon={<Linkedin size={18} />} href="https://linkedin.com" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={() => router.push('/dashboard')} className="hover:text-white transition-colors duration-200">User Dashboard</button></li>
              <li><button onClick={() => router.push('/create-cv')} className="hover:text-white transition-colors duration-200">Create New CV</button></li>
              <li><button onClick={() => router.push('/stats')} className="hover:text-white transition-colors duration-200">Statistics</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={() => router.push('/pricing')} className="hover:text-white transition-colors duration-200">Pricing</button></li>
              <li><span className="text-slate-600 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-slate-600 cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>

          {/* AI Status Section */}
          <div className="glass-card p-6 rounded-2xl border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center gap-3 mb-3 text-ai-primary">
              <Cpu size={20} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-tighter">System Status</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white text-sm font-medium">AI System Online</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
              Instant CV Generation
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <p className="text-slate-500 text-xs font-medium text-center md:text-left">
              © 2025 CV Maker AI | All rights reserved | Developed by Mahmud Hasan Ratul
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Mail size={14} />
              <span>m.h.ratul18@gmail.com</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-[10px] text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: Online</span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-blue-400" />
              <span>Storage: Secure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-ai-primary transition-colors duration-300">
      {icon}
    </a>
  );
}
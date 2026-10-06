import React from 'react';
import { Sparkles, Phone, Mail, User } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-auto relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
              <Sparkles size={18} className="text-brand-500" />
              Yojana Saathi
            </h3>
            <p className="text-sm text-slate-500 mt-1">Empowering citizens with the right information.</p>
          </div>
          
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 shadow-sm">
            <div className="text-sm font-semibold text-slate-700 mb-2 sm:mb-0 w-full text-center sm:text-left sm:w-auto sm:border-r sm:border-slate-200 sm:pr-6">
              Technical Support
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <User size={16} className="text-brand-500" />
                <span>Harsh Agrawal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-brand-500" />
                <a href="tel:+919714246474" className="hover:text-brand-600 transition-colors">+91 9714246474</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-brand-500" />
                <a href="mailto:agrawalharsh6269@gmail.com" className="hover:text-brand-600 transition-colors">agrawalharsh6269@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { Instagram, Linkedin, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-[1400px] mx-auto px-6 md:px-12 mt-20 pb-16">
      {/* Divider */}
      <div className="w-full h-[1px] bg-slate-200/60 mb-10" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand Name & Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-1.5 font-display text-[15px] font-semibold text-[#0a1b33]">
            <span className="text-[#b8935a]">✦</span>
            <span>CASA Audit Group</span>
          </div>
          <span className="text-[12px] text-[#64748b]">
            © {currentYear} CASA Audit Group. All rights reserved.
          </span>
        </div>

        {/* Center: Email Contact */}
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-400" />
          <a
            href="mailto:info@casaauditgroup.com"
            className="text-[13px] text-[#64748b] hover:text-[#0a1b33] hover:underline underline-offset-4 transition-colors"
          >
            info@casaauditgroup.com
          </a>
        </div>

        {/* Right: Social Media Links */}
        <div className="flex items-center gap-5">
          <a
            href="https://www.instagram.com/ca_sagaragrawal/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-slate-400 hover:text-[#b8935a] transition-colors"
          >
            <Instagram className="w-[18px] h-[18px]" />
          </a>
          <a
            href="https://www.linkedin.com/company/casaauditgroup"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-slate-400 hover:text-[#b8935a] transition-colors"
          >
            <Linkedin className="w-[18px] h-[18px]" />
          </a>
          <a
            href="https://www.facebook.com/Cagar1094"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-slate-400 hover:text-[#b8935a] transition-colors"
          >
            <Facebook className="w-[18px] h-[18px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}

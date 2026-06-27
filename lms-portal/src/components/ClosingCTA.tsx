import { motion } from 'motion/react';
import { Mail } from 'lucide-react';

export default function ClosingCTA() {
  return (
    <section id="contact" className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-24">
      <div className="relative w-full rounded-[48px] bg-[#0a152d] overflow-hidden py-20 px-8 md:px-16 text-center border border-[#0a1b33]/60 shadow-[0_30px_70px_rgba(10,21,45,0.15)] flex flex-col items-center">
        
        {/* Soft background light effects */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-30">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[80%] rounded-full bg-[#b8935a]/10 blur-[130px]" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[80%] rounded-full bg-teal-800/10 blur-[130px]" />
        </div>

        {/* Pulsing star decoration */}
        <div className="relative z-10 text-[#b8935a] mb-6 flex items-center justify-center">
          <span className="text-3xl select-none">✦</span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="font-display text-3xl md:text-5xl text-white font-medium tracking-tight mb-4">
            Let's build your assurance partnership.
          </h2>
          <p className="font-sans text-[14px] md:text-[15px] text-slate-300 max-w-md mb-8 leading-relaxed">
            Partner with CASA Audit Group to secure a resilient, compliant, and growth-oriented future for your enterprise.
          </p>

          {/* Primary CTA Button */}
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="mailto:info@casaauditgroup.com"
            className="inline-flex items-center gap-2 bg-white text-[#0a152d] font-semibold text-[13px] px-8 py-3.5 rounded-full shadow-sm hover:shadow-md hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#0a152d]" />
            <span>Get in touch</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

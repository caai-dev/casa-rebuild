import { motion } from 'motion/react';

export default function Hero() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="px-4 md:px-8 pt-10">
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-gradient-to-br from-slate-50/50 via-white to-slate-50/50 border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col justify-center">
        
        {/* Background Mesh Layer */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Faint Grid Layer */}
          <div className="absolute inset-0 hero-grid opacity-80" />

          {/* Shifting radial blobs */}
          <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#0a1b33]/22 blur-[90px] animate-drift-1" />
          <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] rounded-full bg-[#b8935a]/20 blur-[95px] animate-drift-2" />
          <div className="absolute top-[20%] left-[30%] w-[55%] h-[55%] rounded-full bg-[#0f766e]/18 blur-[90px] animate-drift-3" />
          
          {/* Light Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/70" />
        </div>

        {/* Hero Content Wrapper */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start justify-center"
        >
          {/* Headline */}
          <h1 className="font-display text-[42px] md:text-[56px] text-navy font-medium tracking-tight leading-[1.1] text-left">
            Your audit partner for<br />
            the modern enterprise
          </h1>

          {/* Subheadline */}
          <p className="font-sans text-[14px] md:text-[15px] text-muted max-w-xl mt-5 leading-relaxed text-left">
            Through a truly collaborative, firm-wide approach, we help enterprises, founders and institutions overcome challenges and seize opportunities — audit, assurance and advisory, delivered with precision.
          </p>

          {/* Buttons Row */}
          <div className="flex items-center gap-6 mt-8">
            {/* Primary Contact Us Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleScroll('contact')}
              className="bg-navy-dark text-white font-semibold text-[13px] px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-navy"
            >
              Contact Us
            </motion.button>

            {/* Secondary Explore Services Link */}
            <button
              onClick={() => handleScroll('services')}
              className="relative font-semibold text-[13px] text-navy py-1 cursor-pointer transition-colors duration-300 hover:text-gold group"
            >
              <span>Explore our services →</span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

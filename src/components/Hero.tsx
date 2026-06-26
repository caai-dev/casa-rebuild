import { motion, useReducedMotion } from 'motion/react';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="px-4 md:px-8 pt-10">
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-gradient-to-br from-slate-50/50 via-white to-slate-50/50 border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden min-h-[600px] lg:h-[650px] flex flex-col justify-center">
        
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

        {/* Hero Grid Wrapper */}
        <div className="z-10 flex-1 w-full grid lg:grid-cols-12 gap-10 items-center px-6 md:px-16 py-16 lg:py-0">
          
          {/* Left Column: Text & CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start justify-center"
          >
            {/* Headline */}
            <h1 className="font-display text-[42px] md:text-[56px] text-[#0a1b33] font-medium tracking-tight leading-[1.1] text-left">
              Your audit partner for<br />
              the modern enterprise
            </h1>

            {/* Subheadline */}
            <p className="font-sans text-[14px] md:text-[15px] text-slate-500 max-w-xl mt-5 leading-relaxed text-left">
              Through a truly collaborative, firm-wide approach, we help enterprises, founders and institutions overcome challenges and seize opportunities — audit, assurance and advisory, delivered with precision.
            </p>

            {/* Buttons Row */}
            <div className="flex items-center gap-6 mt-8">
              {/* Primary Contact Us Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleScroll('contact')}
                className="bg-[#0a1b33] text-white font-semibold text-[13px] px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-[#0a1b33]"
              >
                Contact Us
              </motion.button>

              {/* Secondary Explore Services Link */}
              <button
                onClick={() => handleScroll('services')}
                className="relative font-semibold text-[13px] text-[#0a1b33] py-1 cursor-pointer transition-colors duration-300 hover:text-[#b8935a] group"
              >
                <span>Explore our services →</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#b8935a] transition-all duration-300 group-hover:w-full" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Premium Refined Animated Logo Visual */}
          <div className="lg:col-span-5 flex items-center justify-center relative w-full h-[360px] lg:h-[500px]">
            {/* Entrance Scale and Fade container */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-80 h-80 lg:w-[440px] lg:h-[440px] flex items-center justify-center"
            >
              
              {/* Vibrant Gold & Navy Glow Background Blobs */}
              <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-gradient-to-tr from-[#b8935a]/10 via-[#0a1b33]/5 to-[#b8935a]/3 blur-[80px] pointer-events-none" />

              {/* Continuous Floating Container */}
              <motion.div
                animate={shouldReduceMotion ? { y: 0 } : { y: [-5, 5, -5] }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative w-52 h-52 lg:w-64 lg:h-64 rounded-[40px] bg-gradient-to-b from-[#0a1b33]/95 to-[#112440]/95 border-2 border-[#b8935a]/60 shadow-[0_30px_70px_-15px_rgba(10,27,51,0.65),0_0_40px_rgba(184,147,90,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center z-10 overflow-hidden"
              >
                {/* Gold Crest Backing Graphic Pattern */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#b8935a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Slow Breathing Inner Glow */}
                <motion.div
                  animate={shouldReduceMotion ? { opacity: 0.25 } : { opacity: [0.15, 0.45, 0.15] }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 rounded-[38px] pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 25px rgba(184, 147, 90, 0.6)'
                  }}
                />

                {/* New CASA SVG Logo: Globe + Checkmark + CA Monogram */}
                <div className="w-28 h-28 lg:w-32 lg:h-32 flex items-center justify-center relative z-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_20px_rgba(184,147,90,0.4)]">
                    <defs>
                      <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                        <stop offset="15%" stopColor="#fdf0d5" />
                        <stop offset="50%" stopColor="#b8935a" />
                        <stop offset="85%" stopColor="#8d6e3c" />
                        <stop offset="100%" stopColor="#5c4520" />
                      </linearGradient>
                    </defs>

                    {/* Globe Outer Circle (White) */}
                    <motion.path
                      d="M 50 15 A 35 35 0 1 1 49.9 15 Z"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.85"
                      initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
                    />

                    {/* Globe Longitudinal Ellipse (White) */}
                    <motion.path
                      d="M 50 15 A 15 35 0 1 1 49.9 15 Z"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.45"
                      initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
                    />

                    {/* Monogram 'C' (Gold) */}
                    <motion.path
                      d="M 44 32 C 26 32, 22 42, 22 50 C 22 58, 26 68, 44 68"
                      fill="none"
                      stroke="url(#premiumGold)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
                    />

                    {/* Monogram 'A' Left Leg (Gold) */}
                    <motion.path
                      d="M 60 22 L 44 76"
                      fill="none"
                      stroke="url(#premiumGold)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.7, ease: "easeInOut" }}
                    />

                    {/* Monogram 'A' Right Leg (Gold) */}
                    <motion.path
                      d="M 60 22 L 76 76"
                      fill="none"
                      stroke="url(#premiumGold)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
                    />

                    {/* Checkmark Crossbar (White) */}
                    <motion.path
                      d="M 32 46 L 50 64 L 78 22"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.9, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
                
                {/* Refined Premium Identity Typography */}
                <div className="mt-1 text-center select-none pointer-events-none z-10">
                  <div className="font-serif text-[20px] lg:text-[24px] font-black tracking-[0.3em] bg-gradient-to-r from-[#ebd2aa] via-[#b8935a] to-[#ebd2aa] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    CASA
                  </div>
                  <div className="font-sans text-[8.5px] lg:text-[9.5px] text-slate-300 font-bold tracking-[0.4em] uppercase mt-1">
                    AUDIT GROUP
                  </div>
                </div>

              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

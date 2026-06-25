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

          {/* Right Column: Premium Animated Logo Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex items-center justify-center relative w-full h-[320px] lg:h-[450px]"
          >
            <div className="relative w-72 h-72 lg:w-80 lg:h-80 flex items-center justify-center" style={{ perspective: 1000 }}>
              {/* Soft Golden Glow Background */}
              <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-[#b8935a]/10 to-[#0a1b33]/5 blur-3xl pointer-events-none" />

              {/* Outer Slow Rotating Orbital Ring 1 */}
              <motion.div
                animate={{ rotateX: 360, rotateY: 180 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute w-72 h-72 border border-[#b8935a]/20 rounded-full pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              />

              {/* Inner Slow Rotating Orbital Ring 2 */}
              <motion.div
                animate={{ rotateY: 360, rotateZ: 180 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute w-60 h-60 border border-[#0a1b33]/15 rounded-full pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              />

              {/* Dotted Quick Rotating Orbital Ring 3 */}
              <motion.div
                animate={{ rotateX: 180, rotateZ: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 border-dashed border border-[#b8935a]/30 rounded-full pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              />

              {/* Central Floating Glassmorphic Badge with Logo */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-40 h-40 rounded-[32px] bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center z-10"
              >
                {/* Golden SVG Monogram */}
                <div className="w-16 h-16 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(184,147,90,0.25)]">
                    <defs>
                      <linearGradient id="goldLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ebd2aa" />
                        <stop offset="50%" stopColor="#b8935a" />
                        <stop offset="100%" stopColor="#8d6e3c" />
                      </linearGradient>
                    </defs>
                    {/* Outlined Shield Geometry */}
                    <path
                      d="M 50 12 L 82 34 L 82 72 L 50 88 L 18 72 L 18 34 Z"
                      fill="none"
                      stroke="url(#goldLogo)"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Stylized interlocking C and A in center */}
                    <path
                      d="M 40 43 C 35 46, 35 54, 40 57 C 44 60, 48 60, 51 57"
                      fill="none"
                      stroke="url(#goldLogo)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 47 61 L 55 39 L 63 61 M 49 53 L 61 53"
                      fill="none"
                      stroke="url(#goldLogo)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                
                {/* Identity Brand Text */}
                <div className="mt-2 text-center select-none pointer-events-none">
                  <div className="font-display text-[14px] font-bold text-[#0a1b33] tracking-[0.25em] uppercase">CASA</div>
                  <div className="font-sans text-[7.5px] text-slate-400 font-semibold tracking-[0.3em] uppercase mt-0.5">Audit Group</div>
                </div>
              </motion.div>

              {/* Orbiting Golden Particle Stars */}
              {[...Array(6)].map((_, i) => {
                const angles = [0, 60, 120, 180, 240, 300];
                const angle = angles[i];
                const radius = 110;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <motion.div
                    key={i}
                    animate={{
                      x: [x, Math.cos(((angle + 360) * Math.PI) / 180) * radius],
                      y: [y, Math.sin(((angle + 360) * Math.PI) / 180) * radius],
                    }}
                    transition={{
                      duration: 16 + i * 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute w-2 h-2 rounded-full bg-[#b8935a]/60 shadow-[0_0_8px_#b8935a] pointer-events-none"
                    style={{ left: '50%', top: '50%', marginLeft: '-4px', marginTop: '-4px' }}
                  />
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

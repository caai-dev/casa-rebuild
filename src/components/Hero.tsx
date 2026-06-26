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

          {/* Right Column: Premium Refined Animated Logo Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex items-center justify-center relative w-full h-[360px] lg:h-[500px]"
          >
            <div className="relative w-80 h-80 lg:w-[440px] lg:h-[440px] flex items-center justify-center" style={{ perspective: 1200 }}>
              
              {/* Vibrant Gold & Navy Glow Background Blobs */}
              <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-gradient-to-tr from-[#b8935a]/20 via-[#0a1b33]/10 to-[#b8935a]/5 blur-[80px] pointer-events-none" />
              <div className="absolute w-48 h-48 rounded-full bg-[#ebd2aa]/15 blur-[50px] animate-pulse pointer-events-none" />

              {/* Outer Slow Rotating Orbital Ring 1 (Gold Audit Ring) */}
              <motion.div
                animate={{ rotateX: 360, rotateY: 180 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-80 h-80 lg:w-[400px] lg:h-[400px] border-2 border-[#b8935a]/25 rounded-full pointer-events-none shadow-[0_0_20px_rgba(184,147,90,0.05)]"
                style={{ transformStyle: 'preserve-3d' }}
              />

              {/* Middle Slow Rotating Orbital Ring 2 (Navy Compass Ring) */}
              <motion.div
                animate={{ rotateY: 360, rotateZ: 180 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-72 h-72 lg:w-[340px] lg:h-[340px] border border-dashed border-[#0a1b33]/25 rounded-full pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              />

              {/* Inner Fast Rotating Orbital Ring 3 (Gold Accent Ring) */}
              <motion.div
                animate={{ rotateX: 180, rotateZ: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute w-60 h-60 lg:w-[280px] lg:h-[280px] border border-[#ebd2aa]/35 rounded-full pointer-events-none shadow-[inset_0_0_10px_rgba(235,210,170,0.1)]"
                style={{ transformStyle: 'preserve-3d' }}
              />

              {/* Central Floating Gold/Glass Crest Shield */}
              <motion.div
                animate={{ 
                  y: [-12, 12, -12],
                  rotateZ: [-2, 2, -2]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute w-52 h-52 lg:w-64 lg:h-64 rounded-[40px] bg-gradient-to-b from-[#0a1b33]/95 to-[#112440]/95 backdrop-blur-2xl border-2 border-[#b8935a]/60 shadow-[0_30px_70px_-15px_rgba(10,27,51,0.65),0_0_40px_rgba(184,147,90,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center z-10 overflow-hidden"
              >
                {/* Gold Crest Backing Graphic Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#b8935a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Golden SVG Monogram Crest */}
                <div className="w-24 h-24 lg:w-28 lg:h-28 flex items-center justify-center relative">
                  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_8px_20px_rgba(184,147,90,0.4)]">
                    <defs>
                      <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                        <stop offset="15%" stopColor="#fdf0d5" />
                        <stop offset="50%" stopColor="#b8935a" />
                        <stop offset="85%" stopColor="#8d6e3c" />
                        <stop offset="100%" stopColor="#5c4520" />
                      </linearGradient>
                    </defs>
                    
                    {/* Double-Line Premium Shield crest */}
                    <path
                      d="M 60 10 L 102 34 L 102 78 L 60 105 L 18 78 L 18 34 Z"
                      fill="none"
                      stroke="url(#premiumGold)"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 60 17 L 95 38 L 95 74 L 60 97 L 25 74 L 25 38 Z"
                      fill="none"
                      stroke="url(#premiumGold)"
                      strokeWidth="1"
                      strokeLinejoin="round"
                      strokeDasharray="4 2"
                      opacity="0.7"
                    />

                    {/* Highly Refined Interlocking C & A */}
                    {/* Stylized 'C' with elegant slab terminal endings */}
                    <path
                      d="M 46 45 C 38 48, 38 62, 46 65 C 52 68, 58 68, 62 64"
                      fill="none"
                      stroke="url(#premiumGold)"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    {/* Stylized 'A' interlocking with the 'C' */}
                    <path
                      d="M 54 70 L 66 38 L 78 70 M 56 60 L 76 60"
                      fill="none"
                      stroke="url(#premiumGold)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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

              {/* Orbiting Golden Star Particles (Bigger radius & count) */}
              {[...Array(8)].map((_, i) => {
                const angles = [0, 45, 90, 135, 180, 225, 270, 315];
                const angle = angles[i];
                const radius = 150; // Bigger radius
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
                      duration: 18 + i * 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#ebd2aa] to-[#b8935a] shadow-[0_0_12px_#b8935a] pointer-events-none"
                    style={{ left: '50%', top: '50%', marginLeft: '-5px', marginTop: '-5px' }}
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

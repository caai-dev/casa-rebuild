import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Menu, X } from 'lucide-react';

interface FloatingNavProps {
  currentView: string;
  setView: (view: string) => void;
}

const navItems = [
  { label: 'Services', view: 'services' },
  { label: 'About', view: 'about' },
  { label: 'Gallery', view: 'gallery' },
  { label: 'Quick Links', view: 'quick-links' },
  { label: 'Clients', view: 'our-clients' },
];

export default function FloatingNav({ currentView, setView }: FloatingNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed bottom-10 left-1/2 z-30 -translate-x-1/2 select-none">
      
      {/* Mobile Slide-Up Bubble Menu (Absolute above the nav bar) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-16 left-1/2 bg-white/95 backdrop-blur-2xl p-6 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-200/50 w-[280px] flex flex-col gap-3 z-40"
          >
            <h4 className="font-display text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-1">
              Menu Navigation
            </h4>
            
            {/* Home Link */}
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left font-display text-[14px] font-semibold py-1.5 transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-[#b8935a]' : 'text-slate-500 hover:text-[#0a1b33]'
              }`}
            >
              Home Landing
            </button>

            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`text-left font-display text-[14px] font-semibold py-1.5 transition-colors cursor-pointer ${
                  currentView === item.view ? 'text-[#b8935a]' : 'text-slate-500 hover:text-[#0a1b33]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Bottom Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center bg-white/90 backdrop-blur-2xl px-2.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40 w-max max-w-[95vw] md:max-w-none"
      >
        {/* Monogram Logo / Home Button */}
        <button
          onClick={() => handleNavClick('home')}
          className={`w-9 h-9 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center select-none cursor-pointer transition-all duration-300 ${
            currentView === 'home' ? 'border-[#b8935a]/50 scale-105 bg-slate-50/50' : 'hover:bg-slate-50'
          }`}
          aria-label="Home"
        >
          <span className={`text-lg font-semibold transition-colors ${
            currentView === 'home' ? 'text-[#b8935a]' : 'text-slate-400 hover:text-[#b8935a]'
          }`}>✦</span>
        </button>

        {/* Desktop Text Buttons: Visible on MD and up */}
        <div className="hidden md:flex items-center space-x-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`text-[12px] font-semibold transition-colors px-3 py-1 cursor-pointer ${
                currentView === item.view 
                  ? 'text-[#b8935a]' 
                  : 'text-slate-500 hover:text-[#0a1b33]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger Button: Visible on Mobile Only */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 active:scale-95 cursor-pointer mr-2 transition-all"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Get in Touch / Contact CTA */}
        <button
          onClick={() => handleNavClick('contact-us')}
          className={`flex items-center gap-1 px-5 py-2 rounded-full text-[12px] font-semibold border transition-all cursor-pointer active:scale-95 ${
            currentView === 'contact-us'
              ? 'bg-[#0a1b33] text-white border-transparent'
              : 'bg-white text-[#0a1b33] border-slate-200/60 shadow-sm hover:border-slate-300 hover:bg-slate-50/55'
          }`}
        >
          <span className="hidden sm:inline">Get in touch</span>
          <span className="sm:hidden">Contact</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </motion.nav>
    </div>
  );
}

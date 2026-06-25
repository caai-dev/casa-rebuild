import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import FloatingNav from './components/FloatingNav';
import IndustryMarquee from './components/IndustryMarquee';
import Pillars from './components/Pillars';
import ClosingCTA from './components/ClosingCTA';
import Footer from './components/Footer';

// New Views
import ServicesView from './components/ServicesView';
import AboutView from './components/AboutView';
import GalleryView from './components/GalleryView';
import QuickLinksView from './components/QuickLinksView';
import ClientsView from './components/ClientsView';
import ContactView from './components/ContactView';
import MembersView from './components/MembersView';

export default function App() {
  const [currentView, setView] = useState('home');

  // Scroll to top on page view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentView]);

  return (
    <div className="relative min-h-screen bg-[#f9fafb] text-[#0a1b33] selection:bg-[#b8935a]/25 selection:text-[#0a1b33]">
      {/* Floating Bottom Navigation */}
      <FloatingNav currentView={currentView} setView={setView} />

      {/* Main Layout Content */}
      <main className="relative flex flex-col w-full z-10 pb-20 pt-4">
        {currentView === 'home' && (
          <>
            <Hero />
            <IndustryMarquee />
            <Pillars />
            <ClosingCTA />
          </>
        )}

        {currentView === 'services' && <ServicesView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'gallery' && <GalleryView />}
        {currentView === 'quick-links' && <QuickLinksView />}
        {currentView === 'our-clients' && <ClientsView />}
        {currentView === 'contact-us' && <ContactView />}
        {currentView === 'portal' && <MembersView />}
      </main>

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
}

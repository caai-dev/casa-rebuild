import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  Key, 
  LogOut, 
  Search, 
  Play, 
  FileText, 
  Download, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  ShieldAlert,
  User
} from 'lucide-react';

// Mock credentials
const MOCK_EMAIL = 'member@casaauditgroup.com';
const MOCK_PASSWORD = 'casa-portal-2026';

// Mock video training catalog
// Standard public educational/accounting video IDs as high-quality placeholders
const videos = [
  {
    id: "active-1",
    youtubeId: "yK7nC1E8u4g", // Public introduction to financial auditing
    title: "CASA Auditing Standards & Checklist Walkthrough",
    category: "Audit & Assurance",
    duration: "14:22",
    description: "Detailed internal training detailing the compliance checklists, field audit standards, and working paper templates required for Q3 client audits."
  },
  {
    id: "active-2",
    youtubeId: "P_o22QzO1qg", // Public corporate tax tutorial
    title: "Corporate Tax Schedules & Compliance Guidance",
    category: "Tax & Legal",
    duration: "18:45",
    description: "A walkthrough of filing procedures, local compliance schedules, and advisory templates for corporate enterprise reviews."
  },
  {
    id: "active-3",
    youtubeId: "z1S_Cy9zdjQ", // Public data security tutorial
    title: "Client Information Security & GDPR Compliance",
    category: "Security",
    duration: "10:15",
    description: "Protocols for managing confidential client database access, cloud vault security compliance, and staff encryption guidelines."
  },
  {
    id: "active-4",
    youtubeId: "9g2967_4kqc", // Public CRM tutorial
    title: "Intranet CRM Systems & Timesheet Submission Guides",
    category: "Systems",
    duration: "08:30",
    description: "Training guide for our internal CRM, client record updates, and submitting weekly project hours via the staff portal."
  }
];

// Mock internal documents for download
const documents = [
  { name: "CASA Audit Audit Working Papers Template", type: "Word (DOCX)", size: "2.4 MB", date: "Jan 12, 2026" },
  { name: "Corporate Compliance Calendar Q3-Q4", type: "PDF Document", size: "1.8 MB", date: "May 25, 2026" },
  { name: "Client Onboarding & Intake Checklist", type: "PDF Document", size: "850 KB", date: "Jun 02, 2026" },
  { name: "Staff Travel Reimbursement Form", type: "Excel (XLSX)", size: "1.2 MB", date: "Mar 10, 2026" }
];

export default function MembersView() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(videos[0]);
  const [submitting, setSubmitting] = useState(false);

  // Check login state from sessionStorage on load
  useEffect(() => {
    const loggedInState = sessionStorage.getItem('casa_member_logged_in');
    if (loggedInState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Mock authentication delay for high-end look
    setTimeout(() => {
      if (
        (email.toLowerCase() === MOCK_EMAIL.toLowerCase() && password === MOCK_PASSWORD) ||
        (email.toLowerCase() === 'admin' && password === 'admin')
      ) {
        setIsLoggedIn(true);
        sessionStorage.setItem('casa_member_logged_in', 'true');
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setSubmitting(false);
    }, 1200);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('casa_member_logged_in');
    setEmail('');
    setPassword('');
  };

  // Filter videos based on search
  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-[80vh] flex flex-col justify-start items-center">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          // LOGIN PAGE
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[500px] mx-auto px-4 py-16 flex flex-col items-center"
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-[#b8935a]/10 border border-[#b8935a]/25 flex items-center justify-center mb-4 text-[#b8935a]">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="font-display text-3xl font-medium text-[#0a1b33] tracking-tight">
                CASA Member Portal
              </h1>
              <p className="font-sans text-[13px] text-slate-400 mt-2 max-w-sm">
                Restricted area. Please sign in with your firm credentials to access confidential videos and resources.
              </p>
            </div>

            {/* Login Card */}
            <div className="w-full bg-white rounded-[32px] border border-slate-200/50 p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.015)] relative overflow-hidden">
              {/* Gold Accent Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#b8935a]/10 to-transparent rounded-bl-full pointer-events-none" />

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="member@casaauditgroup.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full font-sans text-[14px] bg-slate-50/50 border border-slate-200/60 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Key className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full font-sans text-[14px] bg-slate-50/50 border border-slate-200/60 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-2.5 text-rose-600 text-[13px] leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0a1b33] text-white font-display text-[14px] font-semibold py-4 rounded-2xl shadow-md transition-all hover:bg-[#b8935a] active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            </div>

            {/* Helper Info (Testing credentials) */}
            <div className="mt-8 bg-slate-100/50 border border-slate-200/40 rounded-2xl p-5 w-full flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-slate-500 font-display text-[11px] font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-[#b8935a]" />
                <span>Sandbox Testing Credentials</span>
              </div>
              <div className="font-sans text-[12px] text-slate-500 leading-relaxed">
                <div className="flex justify-between py-0.5">
                  <span className="font-medium text-slate-400">Username/Email:</span>
                  <code className="bg-slate-200/60 px-1.5 py-0.5 rounded text-[#0a1b33] font-mono select-all">member@casaauditgroup.com</code>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="font-medium text-slate-400">Password:</span>
                  <code className="bg-slate-200/60 px-1.5 py-0.5 rounded text-[#0a1b33] font-mono select-all">casa-portal-2026</code>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // MEMBERS PORTAL HUB
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-10 flex flex-col gap-8"
          >
            {/* Header Dashboard Nav */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-[18px] text-[#0a1b33] font-semibold tracking-tight">
                      CASA Employee Portal
                    </h2>
                    <span className="bg-[#b8935a]/10 text-[#b8935a] border border-[#b8935a]/10 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Intranet Active
                    </span>
                  </div>
                  <span className="font-sans text-[12px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3 h-3 text-[#b8935a]" /> Logged in as: {MOCK_EMAIL}
                  </span>
                </div>
              </div>

              {/* Log Out */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 hover:border-slate-300 text-slate-600 font-display text-[12px] font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Video Player & Sidebar Section */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cinema Player Section */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-slate-950 rounded-[32px] overflow-hidden shadow-lg border border-slate-900 aspect-video relative group">
                  {/* YouTube Embed Player */}
                  {/* Use activeVideo's youtubeId dynamically */}
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 absolute inset-0"
                  />
                </div>

                {/* Active Video Details Card */}
                <div className="bg-white border border-slate-200/50 p-8 rounded-[32px] shadow-sm flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#b8935a]/10 text-[#b8935a] border border-[#b8935a]/10 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {activeVideo.category}
                    </span>
                    <span className="font-sans text-[12px] text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-300" /> Playback: {activeVideo.duration} mins
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-[#0a1b33] font-semibold tracking-tight">
                    {activeVideo.title}
                  </h3>
                  <p className="font-sans text-[14px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                    {activeVideo.description}
                  </p>
                  
                  {/* Privacy Notice Box */}
                  <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 flex items-start gap-3 mt-4 text-[12px] text-slate-400">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-[#b8935a] mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-600 uppercase tracking-wide">CONFIDENTIALITY WARNING</span>
                      <p>This video represents internal firm operations and is unlisted. Please do not share this URL or distribute video material to external entities.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Videos Directory */}
              <div className="flex flex-col gap-6">
                {/* Search Header */}
                <div className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
                  <h4 className="font-display text-[12px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Training Library
                  </h4>
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search training topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full font-sans text-[13px] bg-slate-50 border border-slate-200/60 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                    />
                  </div>
                </div>

                {/* Videos Selection List */}
                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredVideos.length > 0 ? (
                    filteredVideos.map((video) => {
                      const isActive = video.id === activeVideo.id;
                      return (
                        <button
                          key={video.id}
                          onClick={() => setActiveVideo(video)}
                          className={`w-full text-left p-5 rounded-[24px] border transition-all cursor-pointer flex gap-4 ${
                            isActive
                              ? 'bg-white border-[#b8935a] shadow-md'
                              : 'bg-white/80 border-slate-200/40 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            isActive
                              ? 'bg-[#b8935a]/10 border-[#b8935a]/25 text-[#b8935a]'
                              : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}>
                            <Play className="w-4 h-4 fill-current" />
                          </div>
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              {video.category} • {video.duration} mins
                            </span>
                            <h5 className={`font-display text-[13.5px] font-semibold tracking-tight truncate ${
                              isActive ? 'text-[#b8935a]' : 'text-[#0a1b33]'
                            }`}>
                              {video.title}
                            </h5>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="bg-slate-50 rounded-[24px] p-6 text-center text-slate-400 font-sans text-[13px] italic">
                      No training topics found matching search query.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Library Section */}
            <div className="bg-white border border-slate-200/50 p-8 rounded-[32px] shadow-sm flex flex-col gap-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-display text-xl text-[#0a1b33] font-semibold tracking-tight">
                  Intranet Document Repository
                </h3>
                <p className="font-sans text-[13px] text-slate-400 mt-1">
                  Confidential document templates, audit schedules, and spreadsheets for employee operations.
                </p>
              </div>

              {/* Document List Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left font-sans text-[13.5px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="pb-4 pl-2">Resource Name</th>
                      <th className="pb-4">Format</th>
                      <th className="pb-4">Size</th>
                      <th className="pb-4">Revision Date</th>
                      <th className="pb-4 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pl-2 font-display text-[14px] font-semibold text-[#0a1b33] flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                            <FileText className="w-4 h-4" />
                          </div>
                          {doc.name}
                        </td>
                        <td className="py-4 text-slate-500 font-medium">{doc.type}</td>
                        <td className="py-4 text-slate-400">{doc.size}</td>
                        <td className="py-4 text-slate-400">{doc.date}</td>
                        <td className="py-4 text-right pr-2">
                          <button
                            onClick={() => alert(`Initiating mock download: ${doc.name}`)}
                            className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-[#b8935a]/10 hover:text-[#b8935a] border border-slate-200/60 hover:border-[#b8935a]/25 text-slate-600 font-display text-[11px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

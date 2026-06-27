import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
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
  User,
  Plus,
  Trash2,
  Edit3,
  X,
  Save
} from 'lucide-react';

// Default video training catalog (used if localStorage is empty)
const defaultVideos = [
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

// Default internal documents (used if localStorage is empty)
const defaultDocuments = [
  { name: "CASA Audit Audit Working Papers Template", type: "Word (DOCX)", size: "2.4 MB", date: "Jan 12, 2026" },
  { name: "Corporate Compliance Calendar Q3-Q4", type: "PDF Document", size: "1.8 MB", date: "May 25, 2026" },
  { name: "Client Onboarding & Intake Checklist", type: "PDF Document", size: "850 KB", date: "Jun 02, 2026" },
  { name: "Staff Travel Reimbursement Form", type: "Excel (XLSX)", size: "1.2 MB", date: "Mar 10, 2026" }
];

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return trimmed;
}

export default function MembersView() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeUsername, setActiveUsername] = useState('');

  // Intranet resource list states loaded from localStorage
  const [videosList, setVideosList] = useState<typeof defaultVideos>([]);
  const [documentsList, setDocumentsList] = useState<typeof defaultDocuments>([]);
  const [activeVideo, setActiveVideo] = useState<typeof defaultVideos[0] | null>(null);

  // Modals and Forms states for Super Admin actions
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  
  // Video Form inputs
  const [videoTitle, setVideoTitle] = useState('');
  const [videoYtId, setVideoYtId] = useState('');
  const [videoCategory, setVideoCategory] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // Document Form inputs
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('');
  const [docSize, setDocSize] = useState('');

  // 1. Initial load effect (Fetches centralized database from PHP API)
  useEffect(() => {
    // Auth state retrieval
    const loggedInState = sessionStorage.getItem('casa_member_logged_in');
    const storedUser = sessionStorage.getItem('casa_logged_username');
    const storedAdmin = sessionStorage.getItem('casa_is_admin');
    if (loggedInState === 'true') {
      setIsLoggedIn(true);
      if (storedUser) setActiveUsername(storedUser);
      if (storedAdmin === 'true') setIsAdmin(true);
    }

    // Load data from Hostinger shared database API
    fetch('/api.php')
      .then(res => res.json())
      .then(data => {
        if (data.videos) {
          setVideosList(data.videos);
          if (data.videos.length > 0) {
            setActiveVideo(data.videos[0]);
          }
        }
        if (data.documents) {
          setDocumentsList(data.documents);
        }
      })
      .catch(err => {
        console.error('Error loading centralized database, falling back to local copies:', err);
        
        // Local storage / defaults fallback
        const storedVideos = localStorage.getItem('casa_intranet_videos');
        const loadedVideos = storedVideos ? JSON.parse(storedVideos) : defaultVideos;
        setVideosList(loadedVideos);
        if (loadedVideos.length > 0) setActiveVideo(loadedVideos[0]);

        const storedDocs = localStorage.getItem('casa_intranet_documents');
        setDocumentsList(storedDocs ? JSON.parse(storedDocs) : defaultDocuments);
      });
  }, []);

  // 2. Auth submission logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formattedUsername = username.trim();
    const cleanAccessKey = accessKey.trim();

    try {
      const response = await fetch('/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username: formattedUsername,
          access_key: cleanAccessKey
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsLoggedIn(true);
          const isUserAdmin = data.role === 'admin';
          setIsAdmin(isUserAdmin);
          setActiveUsername(formattedUsername);
          
          sessionStorage.setItem('casa_member_logged_in', 'true');
          sessionStorage.setItem('casa_logged_username', formattedUsername);
          sessionStorage.setItem('casa_is_admin', isUserAdmin ? 'true' : 'false');
          sessionStorage.setItem('casa_admin_key', cleanAccessKey);
          setSubmitting(false);
          return;
        } else {
          setError(data.error || 'Invalid Username or Access Key.');
          setSubmitting(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Authentication API offline, using client-side fallback:', err);
    }

    // Fallback logic (local dev or backend offline)
    const commonKey = import.meta.env.VITE_COMMON_ACCESS_KEY || '443357';
    const superAdminKey = import.meta.env.VITE_SUPER_ADMIN_KEY || 'CASA57';

    const isAdminUser = (
      formattedUsername.toLowerCase() === 'sagar' || 
      formattedUsername.toLowerCase() === 'dev' || 
      formattedUsername.toLowerCase() === 'admin'
    );
    const isSuperAdminLogin = isAdminUser && cleanAccessKey === superAdminKey;
    const match = formattedUsername.match(/^CASA\d+$/);
    const isStandardLogin = match && cleanAccessKey === commonKey;

    setTimeout(() => {
      if (isSuperAdminLogin) {
        setIsLoggedIn(true);
        setIsAdmin(true);
        setActiveUsername(formattedUsername);
        sessionStorage.setItem('casa_member_logged_in', 'true');
        sessionStorage.setItem('casa_logged_username', formattedUsername);
        sessionStorage.setItem('casa_is_admin', 'true');
        sessionStorage.setItem('casa_admin_key', cleanAccessKey);
      } else if (isStandardLogin) {
        setIsLoggedIn(true);
        setIsAdmin(false);
        setActiveUsername(formattedUsername);
        sessionStorage.setItem('casa_member_logged_in', 'true');
        sessionStorage.setItem('casa_logged_username', formattedUsername);
        sessionStorage.setItem('casa_is_admin', 'false');
        sessionStorage.setItem('casa_admin_key', cleanAccessKey);
      } else {
        if (isAdminUser && cleanAccessKey !== superAdminKey) {
          setError('Incorrect Super Admin Key.');
        } else if (match && cleanAccessKey !== commonKey) {
          setError('Incorrect Common Access Key.');
        } else {
          setError('Invalid Username or Credentials. standard accounts must be CASA followed by numbers (e.g. CASA241) and admins must be sagar/dev.');
        }
      }
      setSubmitting(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setActiveUsername('');
    sessionStorage.removeItem('casa_member_logged_in');
    sessionStorage.removeItem('casa_logged_username');
    sessionStorage.removeItem('casa_is_admin');
    sessionStorage.removeItem('casa_admin_key');
    setUsername('');
    setAccessKey('');
  };

  // 3. Super Admin Content Management Operations
  
  // Videos Operations
  const openAddVideo = () => {
    setEditingVideoId(null);
    setVideoTitle('');
    setVideoYtId('');
    setVideoCategory('');
    setVideoDuration('');
    setVideoDescription('');
    setShowVideoModal(true);
  };

  const openEditVideo = (video: typeof defaultVideos[0]) => {
    setEditingVideoId(video.id);
    setVideoTitle(video.title);
    setVideoYtId(video.youtubeId);
    setVideoCategory(video.category);
    setVideoDuration(video.duration);
    setVideoDescription(video.description);
    setShowVideoModal(true);
  };

  const saveVideo = () => {
    if (!videoTitle || !videoYtId || !videoCategory || !videoDuration || !videoDescription) {
      alert('Please fill in all fields before saving.');
      return;
    }

    const parsedId = extractYoutubeId(videoYtId);
    const superAdminKey = sessionStorage.getItem('casa_admin_key') || import.meta.env.VITE_SUPER_ADMIN_KEY || 'CASA57';

    const newVideo = {
      id: editingVideoId || `custom-${Date.now()}`,
      youtubeId: parsedId,
      title: videoTitle,
      category: videoCategory,
      duration: videoDuration,
      description: videoDescription
    };

    // Save to centralized server database
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_video',
        video: newVideo,
        admin_key: superAdminKey
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.videos) {
        setVideosList(data.videos);
        // Sync local storage copy
        localStorage.setItem('casa_intranet_videos', JSON.stringify(data.videos));
        
        if (editingVideoId && activeVideo && activeVideo.id === editingVideoId) {
          const match = data.videos.find((v: any) => v.id === editingVideoId);
          if (match) setActiveVideo(match);
        } else if (!editingVideoId && data.videos.length === 1) {
          setActiveVideo(data.videos[0]);
        }
        setShowVideoModal(false);
      } else {
        alert('Failed to save to server: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(err => {
      console.error('Error saving video to server:', err);
      alert('Error connecting to database server. Video details were not saved.');
    });
  };

  const deleteVideo = (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    const superAdminKey = sessionStorage.getItem('casa_admin_key') || import.meta.env.VITE_SUPER_ADMIN_KEY || 'CASA57';

    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_video',
        id: id,
        admin_key: superAdminKey
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.videos) {
        setVideosList(data.videos);
        localStorage.setItem('casa_intranet_videos', JSON.stringify(data.videos));
        if (activeVideo && activeVideo.id === id) {
          setActiveVideo(data.videos.length > 0 ? data.videos[0] : null);
        }
      } else {
        alert('Failed to delete: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(err => {
      console.error('Error deleting video:', err);
      alert('Database error. Unable to delete video.');
    });
  };

  // Documents Operations
  const openAddDoc = () => {
    setDocName('');
    setDocType('');
    setDocSize('');
    setShowDocModal(true);
  };

  const saveDocument = () => {
    if (!docName || !docType || !docSize) {
      alert('Please fill in all fields before saving.');
      return;
    }

    const today = new Date();
    const dateFormatted = today.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    const newDoc = {
      name: docName,
      type: docType,
      size: docSize,
      date: dateFormatted
    };
    
    const superAdminKey = sessionStorage.getItem('casa_admin_key') || import.meta.env.VITE_SUPER_ADMIN_KEY || 'CASA57';

    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_doc',
        document: newDoc,
        admin_key: superAdminKey
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.documents) {
        setDocumentsList(data.documents);
        localStorage.setItem('casa_intranet_documents', JSON.stringify(data.documents));
        setShowDocModal(false);
      } else {
        alert('Failed to save document: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(err => {
      console.error('Error saving document:', err);
      alert('Database error. Unable to save document template.');
    });
  };

  const deleteDocument = (index: number) => {
    if (!confirm('Are you sure you want to delete this document template?')) return;
    const superAdminKey = sessionStorage.getItem('casa_admin_key') || import.meta.env.VITE_SUPER_ADMIN_KEY || 'CASA57';

    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_doc',
        index: index,
        admin_key: superAdminKey
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.documents) {
        setDocumentsList(data.documents);
        localStorage.setItem('casa_intranet_documents', JSON.stringify(data.documents));
      } else {
        alert('Failed to delete document: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(err => {
      console.error('Error deleting document:', err);
      alert('Database error. Unable to delete document.');
    });
  };

  // Filter videos based on search
  const filteredVideos = videosList.filter(v => 
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
                Restricted area. Please sign in with your credentials to access confidential videos and resources.
              </p>
            </div>

            {/* Login Card */}
            <div className="w-full bg-white rounded-[32px] border border-slate-200/50 p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.015)] relative overflow-hidden">
              {/* Gold Accent Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#b8935a]/10 to-transparent rounded-bl-full pointer-events-none" />

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {/* Username Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full font-sans text-[14px] bg-slate-50/50 border border-slate-200/60 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                    />
                  </div>
                </div>

                {/* Access Key Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Access Key
                  </label>
                  <div className="relative flex items-center">
                    <Key className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
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
                  className="w-full bg-[#0a1b33] text-white font-display text-[14px] font-semibold py-4 rounded-2xl shadow-md transition-all hover:bg-[#b8935a] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-2"
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
                      {isAdmin ? 'Super Admin Mode' : 'Intranet Active'}
                    </span>
                  </div>
                  <span className="font-sans text-[12px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3 h-3 text-[#b8935a]" /> Logged in as: {activeUsername}
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
                {activeVideo ? (
                  <>
                    <div className="bg-slate-950 rounded-[32px] overflow-hidden shadow-lg border border-slate-900 aspect-video relative group">
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
                  </>
                ) : (
                  <div className="bg-white border border-slate-200/50 p-16 rounded-[32px] shadow-sm flex flex-col items-center justify-center text-center text-slate-400 font-sans italic">
                    <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                    No training videos uploaded.
                    {isAdmin && (
                      <button onClick={openAddVideo} className="mt-4 bg-[#0a1b33] hover:bg-[#b8935a] text-white text-[12px] font-semibold px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Add First Video
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Videos Directory */}
              <div className="flex flex-col gap-6">
                {/* Search & Add Header */}
                <div className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="font-display text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                      Training Library
                    </h4>
                    {isAdmin && (
                      <button
                        onClick={openAddVideo}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                        title="Upload New Video"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
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
                      const isActive = activeVideo && video.id === activeVideo.id;
                      return (
                        <div
                          key={video.id}
                          className={`w-full p-4 rounded-[24px] border transition-all flex items-center gap-4 ${
                            isActive
                              ? 'bg-white border-[#b8935a] shadow-md'
                              : 'bg-white/80 border-slate-200/40 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                          }`}
                        >
                          <button
                            onClick={() => setActiveVideo(video)}
                            className="flex-1 text-left flex gap-4 min-w-0 cursor-pointer"
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
                          
                          {/* Super Admin Manage Controls */}
                          {isAdmin && (
                            <div className="flex gap-1 border-l border-slate-100 pl-2 shrink-0">
                              <button 
                                onClick={() => openEditVideo(video)} 
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#b8935a] transition-all cursor-pointer"
                                title="Edit Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => deleteVideo(video.id)} 
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
                                title="Delete Video"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
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
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-display text-xl text-[#0a1b33] font-semibold tracking-tight">
                    Intranet Document Repository
                  </h3>
                  <p className="font-sans text-[13px] text-slate-400 mt-1">
                    Confidential document templates, audit schedules, and spreadsheets for employee operations.
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={openAddDoc}
                    className="bg-[#0a1b33] hover:bg-[#b8935a] text-white font-display text-[12px] font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Document
                  </button>
                )}
              </div>

              {/* Document List Table */}
              <div className="overflow-x-auto w-full">
                {documentsList.length > 0 ? (
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
                      {documentsList.map((doc, idx) => (
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
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => alert(`Initiating mock download: ${doc.name}`)}
                                className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-[#b8935a]/10 hover:text-[#b8935a] border border-slate-200/60 hover:border-[#b8935a]/25 text-slate-600 font-display text-[11px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                              
                              {/* Super Admin Delete Document Control */}
                              {isAdmin && (
                                <button
                                  onClick={() => deleteDocument(idx)}
                                  className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all cursor-pointer border border-transparent hover:border-rose-100"
                                  title="Delete Document"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-slate-400 font-sans italic py-10">
                    No documents uploaded in the intranet repository.
                  </div>
                )}
              </div>
            </div>

            {/* MODALS SECTION */}

            {/* ADD/EDIT VIDEO MODAL */}
            {showVideoModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl w-full max-w-[500px] p-6 md:p-8 flex flex-col gap-4 relative"
                >
                  <button 
                    onClick={() => setShowVideoModal(false)} 
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="font-display text-xl font-bold text-[#0a1b33]">
                    {editingVideoId ? 'Edit Intranet Video' : 'Add New Intranet Video'}
                  </h3>
                  
                  <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Video Title</label>
                      <input 
                        type="text" 
                        value={videoTitle} 
                        onChange={e => setVideoTitle(e.target.value)} 
                        placeholder="e.g. Q3 Auditing Guidelines" 
                        className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">YouTube Video ID</label>
                      <input 
                        type="text" 
                        value={videoYtId} 
                        onChange={e => setVideoYtId(e.target.value)} 
                        placeholder="e.g. yK7nC1E8u4g" 
                        className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Category</label>
                        <input 
                          type="text" 
                          value={videoCategory} 
                          onChange={e => setVideoCategory(e.target.value)} 
                          placeholder="e.g. Audit & Assurance" 
                          className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Duration (e.g. 15:30)</label>
                        <input 
                          type="text" 
                          value={videoDuration} 
                          onChange={e => setVideoDuration(e.target.value)} 
                          placeholder="e.g. 14:22" 
                          className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Description</label>
                      <textarea 
                        value={videoDescription} 
                        onChange={e => setVideoDescription(e.target.value)} 
                        rows={3} 
                        placeholder="Detailed video training description..." 
                        className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33] resize-none" 
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={saveVideo} 
                    className="w-full bg-[#0a1b33] hover:bg-[#b8935a] text-white text-[14px] font-semibold py-3.5 rounded-2xl transition-all cursor-pointer mt-4 flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> 
                    <span>Save Video Details</span>
                  </button>
                </motion.div>
              </div>
            )}

            {/* ADD DOCUMENT MODAL */}
            {showDocModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl w-full max-w-[450px] p-6 md:p-8 flex flex-col gap-4 relative"
                >
                  <button 
                    onClick={() => setShowDocModal(false)} 
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="font-display text-xl font-bold text-[#0a1b33]">Add New Document</h3>
                  
                  <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Document Name</label>
                      <input 
                        type="text" 
                        value={docName} 
                        onChange={e => setDocName(e.target.value)} 
                        placeholder="e.g. Audit Intakes Checklist" 
                        className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Format</label>
                        <input 
                          type="text" 
                          value={docType} 
                          onChange={e => setDocType(e.target.value)} 
                          placeholder="e.g. PDF Document" 
                          className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Size (e.g. 1.2 MB)</label>
                        <input 
                          type="text" 
                          value={docSize} 
                          onChange={e => setDocSize(e.target.value)} 
                          placeholder="e.g. 850 KB" 
                          className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={saveDocument} 
                    className="w-full bg-[#0a1b33] hover:bg-[#b8935a] text-white text-[14px] font-semibold py-3.5 rounded-2xl transition-all cursor-pointer mt-4 flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> 
                    <span>Save Document template</span>
                  </button>
                </motion.div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Key, 
  Search, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  AlertCircle,
  Receipt,
  Building,
  Users,
  Globe,
  FileText,
  Shield,
  Sparkles
} from 'lucide-react';

// Dynamic Icon Loader
const iconMap: Record<string, any> = {
  Receipt,
  Building,
  Users,
  Globe,
  FileText,
  Shield,
  Sparkles
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = iconMap[name] || Globe;
  return <IconComponent className={className} />;
}

interface QuickLink {
  id: string;
  name: string;
  desc: string;
  url: string;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
  links: QuickLink[];
}

// Available color presets
const COLOR_PRESETS = [
  { name: 'Rose Red', value: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  { name: 'Sky Blue', value: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
  { name: 'Emerald Green', value: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Amber Gold', value: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { name: 'Indigo Purple', value: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  { name: 'Gold Premium', value: 'text-[#b8935a] bg-[#b8935a]/10 border-[#b8935a]/20' }
];

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin Authentication
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Modals & CRUD Form States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catTitle, setCatTitle] = useState('');
  const [catIcon, setCatIcon] = useState('Globe');
  const [catColor, setCatColor] = useState('text-sky-500 bg-sky-500/10 border-sky-500/20');

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState('');
  const [linkName, setLinkName] = useState('');
  const [linkDesc, setLinkDesc] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Fetch all links on load
  useEffect(() => {
    fetch('/api.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(err => console.error('Error fetching links:', err));

    // Restore admin session if saved
    const savedKey = sessionStorage.getItem('casa_links_admin_key');
    if (savedKey === 'CASA57') {
      setIsAdmin(true);
    }
  }, []);

  // Admin Authentication handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKeyInput.trim() === 'CASA57') {
      setIsAdmin(true);
      sessionStorage.setItem('casa_links_admin_key', 'CASA57');
      setShowLoginModal(false);
      setAdminKeyInput('');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Key.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('casa_links_admin_key');
  };

  // CRUD Category
  const openAddCategory = () => {
    setEditingCategory(null);
    setCatTitle('');
    setCatIcon('Globe');
    setCatColor(COLOR_PRESETS[1].value);
    setShowCategoryModal(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatTitle(cat.title);
    setCatIcon(cat.icon);
    setCatColor(cat.color);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim()) return;

    const key = sessionStorage.getItem('casa_links_admin_key') || '';
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_category',
        admin_key: key,
        id: editingCategory?.id || '',
        title: catTitle.trim(),
        icon: catIcon,
        color: catColor
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.categories) {
        setCategories(data.categories);
        setShowCategoryModal(false);
      } else {
        alert('Error: ' + (data.error || 'Failed to save'));
      }
    });
  };

  const handleDeleteCategory = (catId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete category "${title}" and all its links?`)) return;
    
    const key = sessionStorage.getItem('casa_links_admin_key') || '';
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_category',
        admin_key: key,
        id: catId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    });
  };

  // CRUD Link
  const openAddLink = (catId: string) => {
    setTargetCategoryId(catId);
    setEditingLink(null);
    setLinkName('');
    setLinkDesc('');
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const openEditLink = (catId: string, link: QuickLink) => {
    setTargetCategoryId(catId);
    setEditingLink(link);
    setLinkName(link.name);
    setLinkDesc(link.desc);
    setLinkUrl(link.url);
    setShowLinkModal(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkName.trim() || !linkUrl.trim()) return;

    const key = sessionStorage.getItem('casa_links_admin_key') || '';
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_link',
        admin_key: key,
        category_id: targetCategoryId,
        id: editingLink?.id || '',
        name: linkName.trim(),
        desc: linkDesc.trim(),
        url: linkUrl.trim()
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.categories) {
        setCategories(data.categories);
        setShowLinkModal(false);
      } else {
        alert('Error: ' + (data.error || 'Failed to save link'));
      }
    });
  };

  const handleDeleteLink = (catId: string, linkId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const key = sessionStorage.getItem('casa_links_admin_key') || '';
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_link',
        admin_key: key,
        category_id: catId,
        id: linkId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    });
  };

  // Filter Categories & Links based on Search Query
  const filteredCategories = categories.map(cat => {
    const matchedLinks = cat.links.filter(link => 
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      link.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { ...cat, links: matchedLinks };
  }).filter(cat => cat.links.length > 0 || cat.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0a1b33] flex flex-col justify-between pb-12">
      {/* Top Banner / Navigation */}
      <header className="w-full bg-white/75 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40 transition-all">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a1b33] flex items-center justify-center text-white">
              <span className="font-display font-bold text-lg text-[#b8935a]">C</span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-display font-bold text-[16px] md:text-[17px] text-[#0a1b33] leading-none">
                CASA Quick Links Hub
              </h1>
              <span className="text-[10px] text-[#b8935a] font-semibold uppercase tracking-wider mt-1">
                Chandra Amit & Associates
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-[#b8935a]/10 border border-[#b8935a]/20 px-3 py-1.5 rounded-full">
                <span className="text-[10.5px] font-bold text-[#b8935a] uppercase tracking-wide">
                  Admin Session Active
                </span>
                <button
                  onClick={handleAdminLogout}
                  className="bg-white/95 hover:bg-[#rose-500] hover:text-rose-600 border border-slate-200 text-[#0a1b33] font-display text-[10px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-1.5 bg-[#0a1b33] hover:bg-[#b8935a] text-white font-display text-[12px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Access</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto w-full px-4 md:px-8 flex-1 py-10 flex flex-col gap-10">
        
        {/* Hub Header & Search Bar */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
          <span className="text-[#b8935a] font-display text-[12px] font-bold uppercase tracking-widest">
            Compliance & Regulatory Directory
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#0a1b33] leading-tight">
            Client Utilities & Public Portals
          </h2>
          <p className="font-sans text-[13.5px] md:text-[14.5px] text-slate-500 leading-relaxed font-light">
            Quickly navigate to income tax, GST, labor compliance, corporate registries, and standard utility portals from our verified regulatory lookup.
          </p>

          {/* Search Input */}
          <div className="w-full max-w-md relative flex items-center mt-4">
            <Search className="absolute left-4.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search links, portals, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full font-sans text-[13.5px] bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#b8935a] focus:shadow-md transition-all text-[#0a1b33]"
            />
          </div>

          {/* Admin Create Category Trigger */}
          {isAdmin && (
            <button
              onClick={openAddCategory}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-display text-[12.5px] font-semibold px-5 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Category</span>
            </button>
          )}
        </div>

        {/* Categories & Links Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-white rounded-[32px] border border-slate-200/50 p-6 md:p-8 shadow-sm flex flex-col justify-between relative group/cat"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-2xl border ${cat.color} flex items-center justify-center`}>
                        <DynamicIcon name={cat.icon} className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-[17px] md:text-[18px] text-[#0a1b33] font-bold tracking-tight">
                        {cat.title}
                      </h3>
                    </div>

                    {/* Admin Category Actions */}
                    {isAdmin && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditCategory(cat)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#b8935a] transition-all cursor-pointer"
                          title="Edit Category Properties"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.title)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Links List */}
                  <div className="flex flex-col gap-3">
                    {cat.links.length > 0 ? (
                      cat.links.map((link) => (
                        <div
                          key={link.id}
                          className="group/link flex items-center justify-between p-3 rounded-2xl border border-transparent hover:border-slate-150 hover:bg-slate-50/50 transition-all duration-300 relative"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex flex-col pr-4 min-w-0"
                          >
                            <span className="font-sans text-[13.5px] font-bold text-[#0a1b33] group-hover/link:text-[#b8935a] transition-colors duration-200 truncate">
                              {link.name}
                            </span>
                            <span className="font-sans text-[11.5px] text-slate-400 mt-0.5 leading-relaxed truncate">
                              {link.desc || 'No description provided.'}
                            </span>
                          </a>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Admin edit/delete buttons */}
                            {isAdmin && (
                              <div className="flex gap-0.5">
                                <button
                                  onClick={() => openEditLink(cat.id, link)}
                                  className="p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-[#b8935a] transition-colors cursor-pointer"
                                  title="Edit Link"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLink(cat.id, link.id, link.name)}
                                  className="p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                  title="Delete Link"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover/link:text-[#0a1b33] group-hover/link:border-slate-300 group-hover/link:bg-white transition-all duration-300"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-[12.5px] font-sans text-slate-450 italic text-center py-4">
                        No links in this category.
                      </span>
                    )}
                  </div>
                </div>

                {/* Add Link button inside category (Admin only) */}
                {isAdmin && (
                  <button
                    onClick={() => openAddLink(cat.id)}
                    className="w-full mt-5 bg-slate-50 hover:bg-slate-100/80 text-slate-650 hover:text-[#b8935a] font-display text-[12px] font-semibold py-2.5 rounded-xl border border-dashed border-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Link</span>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-[32px] border border-slate-200/50 p-12 text-center text-slate-400 font-sans italic text-[14px]">
              No regulatory categories or links match your query.
            </div>
          )}
        </div>
      </main>

      {/* Corporate Footer info */}
      <footer className="w-full max-w-[1400px] mx-auto px-4 md:px-8 border-t border-slate-200/40 pt-6 mt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[11px] font-sans">
        <span>© {new Date().getFullYear()} Chandra Amit & Associates. Authorized Chartered Accountants.</span>
        <div className="flex gap-4">
          <a href="https://pink-dinosaur-183129.hostingersite.com/" className="hover:text-[#b8935a] transition-colors">CASA LMS Portal</a>
          <span>•</span>
          <span>Fiduciary Precision</span>
        </div>
      </footer>

      {/* ==========================================
          MODAL 1: ADMIN LOGIN OVERLAY
      ========================================== */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] border border-slate-200/80 shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 relative"
            >
              <button 
                onClick={() => { setShowLoginModal(false); setAdminKeyInput(''); setLoginError(''); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 rounded-full bg-[#b8935a]/10 flex items-center justify-center text-[#b8935a] mb-2">
                  <Key className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-[16px] text-[#0a1b33]">
                  Quick Links Editor
                </h4>
                <p className="text-[11.5px] text-slate-450 font-sans">
                  Enter your firm-wide admin key to customize portals
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <input
                    type="password"
                    placeholder="Enter Admin Key (e.g. CASA57)"
                    value={adminKeyInput}
                    onChange={(e) => setAdminKeyInput(e.target.value)}
                    required
                    className="w-full font-mono text-[14.5px] tracking-widest text-center bg-slate-50 border border-slate-200 rounded-xl py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                  />
                </div>

                {loginError && (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2 text-rose-600 text-[11.5px] leading-relaxed">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#0a1b33] hover:bg-[#b8935a] text-white font-display text-[13px] font-bold py-3 rounded-xl shadow transition-all cursor-pointer"
                >
                  Verify Admin Access
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL 2: CATEGORY CREATE/EDIT FORM
      ========================================== */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] border border-slate-200/80 shadow-2xl p-6 w-full max-w-md flex flex-col gap-4 relative"
            >
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="font-display font-bold text-[17px] text-[#0a1b33] border-b border-slate-100 pb-2">
                {editingCategory ? 'Edit Link Category' : 'Create New Category'}
              </h4>

              <form onSubmit={handleSaveCategory} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] font-bold text-slate-450 uppercase tracking-widest pl-0.5">
                    Category Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Taxation Portals"
                    value={catTitle}
                    onChange={(e) => setCatTitle(e.target.value)}
                    required
                    className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] font-bold text-slate-450 uppercase tracking-widest pl-0.5">
                    Icon Symbol
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {Object.keys(iconMap).map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setCatIcon(iconName)}
                        className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          catIcon === iconName 
                            ? 'bg-[#0a1b33] border-[#0a1b33] text-white shadow-sm' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                        title={iconName}
                      >
                        <DynamicIcon name={iconName} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] font-bold text-slate-450 uppercase tracking-widest pl-0.5">
                    Theme Color Preset
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setCatColor(preset.value)}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between text-[11.5px] font-medium transition-all cursor-pointer ${
                          catColor === preset.value 
                            ? 'border-[#0a1b33] bg-slate-50 font-bold' 
                            : 'border-slate-250 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span>{preset.name}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border ${preset.value}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0a1b33] hover:bg-[#b8935a] text-white font-display text-[13px] font-bold py-3 rounded-xl shadow transition-all cursor-pointer mt-2"
                >
                  Save Category
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL 3: LINK CREATE/EDIT FORM
      ========================================== */}
      <AnimatePresence>
        {showLinkModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] border border-slate-200/80 shadow-2xl p-6 w-full max-w-md flex flex-col gap-4 relative"
            >
              <button 
                onClick={() => setShowLinkModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="font-display font-bold text-[17px] text-[#0a1b33] border-b border-slate-100 pb-2">
                {editingLink ? 'Edit Portal Link' : 'Add Portal Link'}
              </h4>

              <form onSubmit={handleSaveLink} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] font-bold text-slate-450 uppercase tracking-widest pl-0.5">
                    Link Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GST Search"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    required
                    className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] font-bold text-slate-450 uppercase tracking-widest pl-0.5">
                    Direct Web URL (Address)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. www.gst.gov.in"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    required
                    className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] font-bold text-slate-450 uppercase tracking-widest pl-0.5">
                    Short Description
                  </label>
                  <textarea
                    placeholder="e.g. Verify tax identity and filing records of any GSTIN."
                    value={linkDesc}
                    onChange={(e) => setLinkDesc(e.target.value)}
                    rows={3}
                    className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0a1b33] hover:bg-[#b8935a] text-white font-display text-[13px] font-bold py-3 rounded-xl shadow transition-all cursor-pointer mt-2"
                >
                  Save Link
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

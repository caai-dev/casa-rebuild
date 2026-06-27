import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Key, 
  LogOut, 
  Search, 
  FileText, 
  Download, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  User, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Activity
} from 'lucide-react';

interface Resource {
  id: string;
  type: 'video' | 'doc' | 'link';
  title?: string;
  name?: string; // used for doc and link
  youtubeId?: string;
  category?: string;
  duration?: string;
  description?: string;
  format?: string; // doc format
  size?: string; // doc size
  date?: string; // doc revision date
  url?: string; // link url
  fileName?: string; // doc persistent filename on server
}

interface Library {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
}

interface UserProgress {
  completed_videos: string[];
  last_active: string;
}

interface MemberAccount {
  username: string;
  name: string;
  password?: string;
  role: string;
  status: 'active' | 'pending' | 'revoked';
}

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
  // Authentication & Mode states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState('');
  
  // Login / Signup Form fields
  const [username, setUsername] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupUser, setSignupUser] = useState('');
  const [signupPass, setSignupPass] = useState('');
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeUsername, setActiveUsername] = useState('');

  // LMS Data States
  const [librariesList, setLibrariesList] = useState<Library[]>([]);
  const [activeLibrary, setActiveLibrary] = useState<Library | null>(null);
  const [activeVideo, setActiveVideo] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Progress & Admin User Directory States
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [usersProgressLogs, setUsersProgressLogs] = useState<Record<string, UserProgress>>({});
  const [employeesList, setEmployeesList] = useState<MemberAccount[]>([]);

  // Navigation tabs for Admins: 'content' manages libraries, 'tracking' shows logs & members
  const [adminTab, setAdminTab] = useState<'content' | 'tracking'>('content');

  // Direct Employee Onboarding Inputs (Admin Panel)
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpUser, setNewEmpUser] = useState('');
  const [newEmpPass, setNewEmpPass] = useState('');

  // Modals & Library Form States
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingLibId, setEditingLibId] = useState<string | null>(null);
  const [libName, setLibName] = useState('');
  const [libDesc, setLibDesc] = useState('');

  // Resource Form Inputs
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceType, setResourceType] = useState<'video' | 'doc' | 'link'>('video');
  const [resTitle, setResTitle] = useState(''); // Shared Name/Title
  const [resYtId, setResYtId] = useState(''); // Video specific
  const [resCategory, setResCategory] = useState(''); // Video specific
  const [resDuration, setResDuration] = useState(''); // Video specific
  const [resDesc, setResDesc] = useState(''); // Video specific
  const [resUrl, setResUrl] = useState(''); // Link specific

  // File Upload Specific States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  // 1. Initial Load effect
  useEffect(() => {
    // Auth Session retrieval
    const loggedInState = sessionStorage.getItem('casa_member_logged_in');
    const storedUser = sessionStorage.getItem('casa_logged_username');
    const storedAdmin = sessionStorage.getItem('casa_is_admin');
    const savedAdminKey = sessionStorage.getItem('casa_admin_key');

    if (loggedInState === 'true') {
      setIsLoggedIn(true);
      if (storedUser) {
        setActiveUsername(storedUser);
        const localProg = localStorage.getItem(`casa_progress_${storedUser}`);
        if (localProg) setCompletedVideos(JSON.parse(localProg));
      }
      if (storedAdmin === 'true') {
        setIsAdmin(true);
        if (savedAdminKey) {
          fetchUsersProgress(savedAdminKey);
          fetchEmployeesList(savedAdminKey);
        }
      }
    }

    // Load libraries from Hostinger Shared DB API
    fetch('/api.php')
      .then(res => res.json())
      .then(data => {
        if (data.libraries) {
          setLibrariesList(data.libraries);
          if (data.libraries.length > 0) {
            setActiveLibrary(data.libraries[0]);
            const firstVideo = data.libraries[0].resources?.find((r: any) => r.type === 'video');
            if (firstVideo) setActiveVideo(firstVideo);
          }
        }
      })
      .catch(err => {
        console.error('Error loading library database, falling back to local defaults:', err);
        const storedLibs = localStorage.getItem('casa_libraries_db');
        if (storedLibs) {
          const parsed = JSON.parse(storedLibs);
          setLibrariesList(parsed);
          if (parsed.length > 0) {
            setActiveLibrary(parsed[0]);
            const firstVideo = parsed[0].resources?.find((r: any) => r.type === 'video');
            if (firstVideo) setActiveVideo(firstVideo);
          }
        }
      });
  }, []);

  // Sync state to local storage fallback
  useEffect(() => {
    if (librariesList.length > 0) {
      localStorage.setItem('casa_libraries_db', JSON.stringify(librariesList));
    }
  }, [librariesList]);

  // Fetch all user progress entries (Admin only)
  const fetchUsersProgress = (key: string) => {
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_users_progress',
        admin_key: key
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.progress) {
        setUsersProgressLogs(data.progress);
      }
    })
    .catch(err => console.error('Error fetching user tracking logs:', err));
  };

  // Fetch registered user list (Admin only)
  const fetchEmployeesList = (key: string) => {
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_users',
        admin_key: key
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.users) {
        setEmployeesList(data.users);
      }
    })
    .catch(err => console.error('Error loading employee list:', err));
  };

  // 2. Login Flow
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
          const finalUser = data.username || formattedUsername;
          setActiveUsername(finalUser);
          
          sessionStorage.setItem('casa_member_logged_in', 'true');
          sessionStorage.setItem('casa_logged_username', finalUser);
          sessionStorage.setItem('casa_is_admin', isUserAdmin ? 'true' : 'false');
          sessionStorage.setItem('casa_admin_key', cleanAccessKey);

          if (data.progress && data.progress.completed_videos) {
            setCompletedVideos(data.progress.completed_videos);
            localStorage.setItem(`casa_progress_${finalUser}`, JSON.stringify(data.progress.completed_videos));
          }

          if (isUserAdmin) {
            fetchUsersProgress(cleanAccessKey);
            fetchEmployeesList(cleanAccessKey);
          }

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
      setError('Connection error. Authentication failed.');
      setSubmitting(false);
    }
  };

  // 2A. Signup Flow
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSignupSuccessMsg('');
    setSubmitting(true);

    const formattedName = signupName.trim();
    const formattedUser = signupUser.trim();
    const formattedPass = signupPass.trim();

    if (!formattedName || !formattedUser || !formattedPass) {
      setError('Please fill in all signup fields.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: formattedName,
          username: formattedUser,
          password: formattedPass
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSignupSuccessMsg(data.message || 'Sign up requested successfully!');
        setSignupName('');
        setSignupUser('');
        setSignupPass('');
        setIsSignupMode(false);
      } else {
        setError(data.error || 'Failed to submit registration request.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Unable to register at this time. Check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setActiveUsername('');
    sessionStorage.clear();
    setCompletedVideos([]);
    setUsername('');
    setAccessKey('');
    setSignupSuccessMsg('');
  };

  // 3. Progress Tracking Actions (Standard Users check/uncheck videos)
  const toggleVideoComplete = (videoId: string) => {
    let updated: string[];
    if (completedVideos.includes(videoId)) {
      updated = completedVideos.filter(id => id !== videoId);
    } else {
      updated = [...completedVideos, videoId];
    }
    
    setCompletedVideos(updated);
    localStorage.setItem(`casa_progress_${activeUsername}`, JSON.stringify(updated));

    // Send update request to server
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_progress',
        username: activeUsername,
        completed_videos: updated
      })
    })
    .catch(err => console.error('Error saving progress to server:', err));
  };

  // Calculate overall video completion for a specific library
  const getLibraryProgress = (lib: Library) => {
    const videos = lib.resources?.filter(r => r.type === 'video') || [];
    if (videos.length === 0) return { percent: 0, completed: 0, total: 0 };
    
    const completedCount = videos.filter(v => completedVideos.includes(v.id)).length;
    return {
      percent: Math.round((completedCount / videos.length) * 100),
      completed: completedCount,
      total: videos.length
    };
  };

  // File selection change and validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size exceeds the 15 MB limit. Please select a smaller file.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    
    if (!resTitle) {
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setResTitle(baseName.replace(/_/g, ' ').replace(/-/g, ' '));
    }
  };

  // Document downloading action (Streams from proxy endpoint or mock alert)
  const handleDownload = (doc: Resource) => {
    if (doc.fileName) {
      window.open(`/api.php?action=download&file=${encodeURIComponent(doc.fileName)}&name=${encodeURIComponent(doc.name || '')}`, '_blank');
    } else {
      alert(`Initiating mock download of default template: ${doc.name}`);
    }
  };

  // 4. Admin Content Operations (Libraries & Resources)

  // Libraries CRUD
  const openAddLibrary = () => {
    setEditingLibId(null);
    setLibName('');
    setLibDesc('');
    setShowLibraryModal(true);
  };

  const openEditLibrary = (lib: Library) => {
    setEditingLibId(lib.id);
    setLibName(lib.name);
    setLibDesc(lib.description);
    setShowLibraryModal(true);
  };

  const saveLibrary = () => {
    if (!libName || !libDesc) {
      alert('Please enter a library name and description.');
      return;
    }

    const adminKey = sessionStorage.getItem('casa_admin_key') || '';
    const slugId = editingLibId || libName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newLib = {
      id: slugId,
      name: libName,
      description: libDesc
    };

    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_library',
        admin_key: adminKey,
        library: newLib
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.libraries) {
        setLibrariesList(data.libraries);
        const match = data.libraries.find((l: any) => l.id === slugId);
        if (match) setActiveLibrary(match);
        setShowLibraryModal(false);
      } else {
        alert('Error saving library: ' + (data.error || 'Unknown error'));
      }
    });
  };

  const deleteLibrary = (id: string) => {
    if (!confirm('Are you sure you want to delete this library and all of its resources?')) return;
    const adminKey = sessionStorage.getItem('casa_admin_key') || '';

    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_library',
        admin_key: adminKey,
        id
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.libraries) {
        setLibrariesList(data.libraries);
        if (data.libraries.length > 0) {
          setActiveLibrary(data.libraries[0]);
        } else {
          setActiveLibrary(null);
          setActiveVideo(null);
        }
      }
    });
  };

  // Resources CRUD
  const openAddResource = (type: 'video' | 'doc' | 'link') => {
    setResourceType(type);
    setEditingResource(null);
    setSelectedFile(null);
    setFileError('');
    setResTitle('');
    setResYtId('');
    setResCategory('');
    setResDuration('');
    setResDesc('');
    setResUrl('');
    setShowResourceModal(true);
  };

  const openEditResource = (resource: Resource) => {
    setResourceType(resource.type);
    setEditingResource(resource);
    setSelectedFile(null);
    setFileError('');
    setResTitle(resource.title || resource.name || '');
    setResYtId(resource.youtubeId || '');
    setResCategory(resource.category || '');
    setResDuration(resource.duration || '');
    setResDesc(resource.description || '');
    setResUrl(resource.url || '');
    setShowResourceModal(true);
  };

  const saveResource = () => {
    if (!activeLibrary) return;
    if (!resTitle) {
      alert('Please enter a title or name for the resource.');
      return;
    }

    const adminKey = sessionStorage.getItem('casa_admin_key') || '';
    const resId = editingResource?.id || `res-${Date.now()}`;

    // A. DOCUMENT UPLOAD FLOW (Multipart Form-Data)
    if (resourceType === 'doc') {
      if (!editingResource && !selectedFile) {
        alert('Please select a file to upload.');
        return;
      }

      if (editingResource && !selectedFile) {
        const updatedDoc = {
          ...editingResource,
          name: resTitle
        };
        fetch('/api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_resource',
            admin_key: adminKey,
            library_id: activeLibrary.id,
            resource: updatedDoc
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.libraries) {
            setLibrariesList(data.libraries);
            const match = data.libraries.find((l: any) => l.id === activeLibrary.id);
            if (match) setActiveLibrary(match);
            setShowResourceModal(false);
          }
        });
        return;
      }

      const formData = new FormData();
      formData.append('action', 'upload_doc');
      formData.append('admin_key', adminKey);
      formData.append('library_id', activeLibrary.id);
      formData.append('doc_name', resTitle);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      setSubmitting(true);
      fetch('/api.php', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.success && data.libraries) {
          setLibrariesList(data.libraries);
          const match = data.libraries.find((l: any) => l.id === activeLibrary.id);
          if (match) setActiveLibrary(match);
          setShowResourceModal(false);
          setSelectedFile(null);
        } else {
          alert('Failed to upload document: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(err => {
        setSubmitting(false);
        console.error('Error uploading document:', err);
        alert('Failed to upload file to the server.');
      });
      return;
    }

    // B. VIDEO AND EXTERNAL LINK FLOW (Standard JSON)
    let newResource: Resource = {
      id: resId,
      type: resourceType
    };

    if (resourceType === 'video') {
      if (!resYtId || !resCategory || !resDuration || !resDesc) {
        alert('Please fill in all video fields.');
        return;
      }
      newResource = {
        ...newResource,
        title: resTitle,
        youtubeId: extractYoutubeId(resYtId),
        category: resCategory,
        duration: resDuration,
        description: resDesc
      };
    } else if (resourceType === 'link') {
      if (!resUrl) {
        alert('Please enter a valid URL.');
        return;
      }
      newResource = {
        ...newResource,
        name: resTitle,
        url: resUrl.startsWith('http') ? resUrl : `https://${resUrl}`
      };
    }

    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_resource',
        admin_key: adminKey,
        library_id: activeLibrary.id,
        resource: newResource
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.libraries) {
        setLibrariesList(data.libraries);
        const match = data.libraries.find((l: any) => l.id === activeLibrary.id);
        if (match) {
          setActiveLibrary(match);
          if (resourceType === 'video') {
            if (activeVideo && activeVideo.id === resId) {
              setActiveVideo(newResource);
            } else if (!activeVideo) {
              setActiveVideo(newResource);
            }
          }
        }
        setShowResourceModal(false);
      } else {
        alert('Failed to save resource: ' + (data.error || 'Unknown error'));
      }
    });
  };

  const deleteResource = (resId: string) => {
    if (!activeLibrary) return;
    if (!confirm('Are you sure you want to delete this resource?')) return;
    const adminKey = sessionStorage.getItem('casa_admin_key') || '';

    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_resource',
        admin_key: adminKey,
        library_id: activeLibrary.id,
        resource_id: resId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.libraries) {
        setLibrariesList(data.libraries);
        const match = data.libraries.find((l: any) => l.id === activeLibrary.id);
        if (match) {
          setActiveLibrary(match);
          if (activeVideo && activeVideo.id === resId) {
            const firstVideo = match.resources?.find((r: any) => r.type === 'video');
            setActiveVideo(firstVideo || null);
          }
        }
      }
    });
  };

  // 5. Admin Employee Account Actions (Direct Onboard, Suspend, Resume, Approve, Delete)
  
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newEmpName.trim();
    const cleanUser = newEmpUser.trim();
    const cleanPass = newEmpPass.trim();

    if (!cleanName || !cleanUser || !cleanPass) {
      alert('Please fill in Name, Username, and Password to add employee.');
      return;
    }

    const adminKey = sessionStorage.getItem('casa_admin_key') || '';
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_user',
        admin_key: adminKey,
        name: cleanName,
        username: cleanUser,
        password: cleanPass
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.users) {
        setEmployeesList(data.users);
        setNewEmpName('');
        setNewEmpUser('');
        setNewEmpPass('');
        alert(`Account created successfully for ${cleanName}!`);
      } else {
        alert('Failed to create account: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(err => {
      console.error('Error adding employee:', err);
      alert('Server communication error.');
    });
  };

  const handleUpdateUserStatus = (targetUsername: string, newStatus: 'active' | 'revoked') => {
    const adminKey = sessionStorage.getItem('casa_admin_key') || '';
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_user_status',
        admin_key: adminKey,
        username: targetUsername,
        status: newStatus
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.users) {
        setEmployeesList(data.users);
      }
    })
    .catch(err => console.error('Status toggle error:', err));
  };

  const handleDeleteUser = (targetUsername: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${targetUsername}" and all their training progress logs?`)) return;
    const adminKey = sessionStorage.getItem('casa_admin_key') || '';
    
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_user',
        admin_key: adminKey,
        username: targetUsername
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.users) {
        setEmployeesList(data.users);
      }
    })
    .catch(err => console.error('Delete user error:', err));
  };

  // Search filtering
  const getFilteredResources = () => {
    if (!activeLibrary) return { videos: [], docs: [], links: [] };
    const resources = activeLibrary.resources || [];
    
    const filtered = resources.filter(r => {
      const q = searchQuery.toLowerCase();
      const titleMatch = (r.title || r.name || '').toLowerCase().includes(q);
      const descMatch = (r.description || '').toLowerCase().includes(q);
      const catMatch = (r.category || '').toLowerCase().includes(q);
      return titleMatch || descMatch || catMatch;
    });

    return {
      videos: filtered.filter(r => r.type === 'video'),
      docs: filtered.filter(r => r.type === 'doc'),
      links: filtered.filter(r => r.type === 'link')
    };
  };

  const { videos: activeVideos, docs: activeDocs, links: activeLinks } = getFilteredResources();

  // Separate pending requests from active members
  const pendingRequests = employeesList.filter(e => e.status === 'pending');
  const activeMembers = employeesList.filter(e => e.status === 'active' || e.status === 'revoked');

  return (
    <div className="w-full min-h-[85vh] flex flex-col justify-start items-center">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          // ==========================================
          // 1. LOGIN / SIGNUP INTERFACES
          // ==========================================
          <motion.div
            key={isSignupMode ? 'signup' : 'login'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[480px] mx-auto px-4 py-12 flex flex-col items-center"
          >
            {/* Monogram Logo Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-[24px] bg-[#b8935a]/10 border border-[#b8935a]/25 flex items-center justify-center mb-4 text-[#b8935a] shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="font-display text-3xl font-bold text-[#0a1b33] tracking-tight">
                {isSignupMode ? 'Request LMS Profile' : 'CASA Training LMS'}
              </h1>
              <p className="font-sans text-[13px] text-slate-400 mt-2 max-w-sm">
                {isSignupMode 
                  ? 'Request employee access. Your profile requires administrator approval before logging in.'
                  : 'Secure employee and administrator training dashboard. Please sign in.'}
              </p>
            </div>

            {/* Main Form Box Container */}
            <div className="w-full bg-white rounded-[32px] border border-slate-200/50 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#b8935a]/10 to-transparent rounded-bl-full pointer-events-none" />

              {signupSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[13px] leading-relaxed rounded-2xl p-4 mb-4 flex items-start gap-2.5">
                  <CheckSquare className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 fill-emerald-100" />
                  <span>{signupSuccessMsg}</span>
                </div>
              )}

              {isSignupMode ? (
                // ==========================================
                // 1A. SIGNUP REQUEST FORM
                // ==========================================
                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-display text-[10.5px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amit Sharma"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-display text-[10.5px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                      Choose Username
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CASA789"
                      value={signupUser}
                      onChange={(e) => setSignupUser(e.target.value)}
                      required
                      className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-display text-[10.5px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                      Account Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signupPass}
                      onChange={(e) => setSignupPass(e.target.value)}
                      required
                      className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                    />
                  </div>

                  {error && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2 text-rose-600 text-[12px] leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0a1b33] text-white font-display text-[13.5px] font-semibold py-3.5 rounded-2xl shadow-md transition-all hover:bg-[#b8935a] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? 'Submitting Registration...' : 'Submit Signup Request'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsSignupMode(false); setError(''); }}
                    className="w-full text-slate-400 hover:text-[#0a1b33] font-display text-[12px] font-semibold mt-1 transition-colors cursor-pointer"
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                // ==========================================
                // 1B. SIGN IN FORM
                // ==========================================
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                      Username
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Username (e.g. CASA241)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full font-sans text-[14px] bg-slate-50 border border-slate-200/60 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                      Access Password
                    </label>
                    <div className="relative flex items-center">
                      <Key className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        required
                        className="w-full font-sans text-[14px] bg-slate-50 border border-slate-200/60 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-2.5 text-rose-600 text-[13px] leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0a1b33] text-white font-display text-[14px] font-semibold py-4 rounded-2xl shadow-md transition-all hover:bg-[#b8935a] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Portal Access...</span>
                      </>
                    ) : (
                      <span>Enter Portal</span>
                    )}
                  </button>

                  <div className="flex flex-col items-center mt-2 border-t border-slate-100 pt-4">
                    <span className="text-[11px] text-slate-400 font-sans">New Employee?</span>
                    <button
                      type="button"
                      onClick={() => { setIsSignupMode(true); setError(''); setSignupSuccessMsg(''); }}
                      className="text-[#b8935a] hover:text-[#0a1b33] font-display text-[13px] font-bold mt-1 transition-colors cursor-pointer"
                    >
                      Sign Up & Request LMS Access
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        ) : (
          // ==========================================
          // 2. MAIN LMS INTERFACE
          // ==========================================
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 flex flex-col gap-6"
          >
            {/* Top Dashboard Banner */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0a1b33]/5 border border-slate-100 flex items-center justify-center text-[#b8935a]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display text-[18px] text-[#0a1b33] font-semibold tracking-tight">
                      CASA Auditing & Training LMS
                    </h2>
                    <span className="bg-[#b8935a]/10 text-[#b8935a] border border-[#b8935a]/10 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {isAdmin ? 'Super Admin' : 'Training Portal Active'}
                    </span>
                  </div>
                  <span className="font-sans text-[12px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-[#b8935a]" /> User Session: <strong>{activeUsername}</strong>
                  </span>
                </div>
              </div>

              {/* Admin Panel Tabs & Logout */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                {isAdmin && (
                  <div className="flex bg-slate-50 border border-slate-200/60 p-1 rounded-full">
                    <button
                      onClick={() => setAdminTab('content')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-display text-[12px] font-semibold transition-all cursor-pointer ${
                        adminTab === 'content' ? 'bg-[#0a1b33] text-white' : 'text-slate-500 hover:text-[#0a1b33]'
                      }`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Manage Libraries</span>
                    </button>
                    <button
                      onClick={() => setAdminTab('tracking')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-display text-[12px] font-semibold transition-all cursor-pointer ${
                        adminTab === 'tracking' ? 'bg-[#0a1b33] text-white' : 'text-slate-500 hover:text-[#0a1b33]'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Employees & Progress</span>
                    </button>
                  </div>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 hover:border-slate-300 text-slate-500 font-display text-[12px] font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {isAdmin && adminTab === 'tracking' ? (
              // ==========================================
              // 2A. ADMIN PANEL: EMPLOYEES & PROGRESS MANAGEMENT
              // ==========================================
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Left Column: Direct Account Creation */}
                <div className="lg:col-span-1 bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-4 self-start">
                  <div>
                    <h4 className="font-display text-[15px] font-bold text-[#0a1b33] tracking-tight">
                      Onboard New Employee
                    </h4>
                    <p className="font-sans text-[11px] text-slate-400 mt-0.5">
                      Directly create an active account for team members.
                    </p>
                  </div>

                  <form onSubmit={handleAddEmployee} className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Verma"
                        value={newEmpName}
                        onChange={(e) => setNewEmpName(e.target.value)}
                        className="w-full font-sans text-[13px] bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">LMS Username</label>
                      <input
                        type="text"
                        placeholder="e.g. CASA102"
                        value={newEmpUser}
                        onChange={(e) => setNewEmpUser(e.target.value)}
                        className="w-full font-sans text-[13px] bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Access Password</label>
                      <input
                        type="text"
                        placeholder="e.g. Pass102"
                        value={newEmpPass}
                        onChange={(e) => setNewEmpPass(e.target.value)}
                        className="w-full font-sans text-[13px] bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0a1b33] hover:bg-[#b8935a] text-white text-[12.5px] font-semibold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm mt-1"
                    >
                      <Plus className="w-4 h-4" /> Create Account
                    </button>
                  </form>
                </div>

                {/* Right Column: Approvals and User Directories */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Approval requests list */}
                  {pendingRequests.length > 0 && (
                    <div className="bg-emerald-50/40 border border-emerald-100/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
                      <div>
                        <h4 className="font-display text-[15px] font-bold text-emerald-800 tracking-tight flex items-center gap-1.5">
                          <CheckSquare className="w-4.5 h-4.5 text-emerald-600 fill-emerald-100" />
                          Pending Registration Requests ({pendingRequests.length})
                        </h4>
                        <p className="font-sans text-[11px] text-emerald-600/80 mt-0.5">
                          Review self-registration submissions waiting for approval.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {pendingRequests.map((req) => (
                          <div
                            key={req.username}
                            className="bg-white border border-emerald-100/40 p-4 rounded-2xl flex items-center justify-between gap-4"
                          >
                            <div className="flex flex-col">
                              <span className="font-display text-[13.5px] font-bold text-emerald-950">{req.name}</span>
                              <span className="font-sans text-[11px] text-emerald-600/80 mt-0.5">
                                Requested User ID: <strong>{req.username}</strong> • Password: <code>{req.password}</code>
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateUserStatus(req.username, 'active')}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-display text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeleteUser(req.username)}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-display text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Team Members Database List */}
                  <div className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
                    <div>
                      <h4 className="font-display text-[16px] font-bold text-[#0a1b33] tracking-tight">
                        Registered Team Members Directory ({activeMembers.length})
                      </h4>
                      <p className="font-sans text-[12px] text-slate-400 mt-0.5">
                        Manage passwords, access statuses, and track individual training progress stats.
                      </p>
                    </div>

                    <div className="overflow-x-auto w-full">
                      {activeMembers.length > 0 ? (
                        <table className="w-full text-left font-sans text-[12.5px]">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                              <th className="pb-3 pl-2">Name & ID</th>
                              <th className="pb-3">Access Password</th>
                              <th className="pb-3">LMS Completion Stats</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {activeMembers.map((member) => {
                              const prog = usersProgressLogs[member.username];
                              const finishedCount = prog?.completed_videos?.length || 0;
                              
                              let statusBadge = (
                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Active
                                </span>
                              );
                              if (member.status === 'revoked') {
                                statusBadge = (
                                  <span className="bg-rose-50 text-rose-600 border border-rose-100/50 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Suspended
                                  </span>
                                );
                              }

                              return (
                                <tr key={member.username} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3.5 pl-2">
                                    <div className="flex flex-col">
                                      <span className="font-display text-[13px] font-bold text-[#0a1b33]">{member.name}</span>
                                      <span className="text-[10px] text-slate-400 mt-0.5">Username: {member.username}</span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 font-mono text-[12px] text-slate-500">{member.password || 'N/A'}</td>
                                  <td className="py-3.5">
                                    <div className="flex flex-col">
                                      <span className="font-bold text-[#b8935a]">{finishedCount} lessons</span>
                                      {prog?.last_active && (
                                        <span className="text-[9.5px] text-slate-400 mt-0.5">
                                          Active: {new Date(prog.last_active).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3.5">{statusBadge}</td>
                                  <td className="py-3.5 text-right">
                                    <div className="flex gap-1 justify-end">
                                      {member.status === 'active' ? (
                                        <button
                                          onClick={() => handleUpdateUserStatus(member.username, 'revoked')}
                                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-amber-500"
                                          title="Suspend account access"
                                        >
                                          <AlertCircle className="w-4 h-4" />
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleUpdateUserStatus(member.username, 'active')}
                                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-500"
                                          title="Resume account access"
                                        >
                                          <CheckSquare className="w-4 h-4" />
                                        </button>
                                      )}
                                      
                                      <button
                                        onClick={() => handleDeleteUser(member.username)}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-500"
                                        title="Delete user profile"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center text-slate-400 font-sans italic py-10">
                          No team members registered.
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              // ==========================================
              // 2B. TOPIC LIBRARIES WORKSPACE
              // ==========================================
              <div className="grid lg:grid-cols-4 gap-6">
                
                {/* Left Sidebar: Libraries List */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  
                  {/* Library Navigation Card */}
                  <div className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h4 className="font-display text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Topic Libraries
                      </h4>
                      {isAdmin && (
                        <button
                          onClick={openAddLibrary}
                          className="bg-emerald-50 hover:bg-emerald-600 text-white p-1 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                          title="Add New Library Section"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Search Field */}
                    <div className="relative flex items-center">
                      <Search className="absolute left-4.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full font-sans text-[13px] bg-slate-50 border border-slate-200/60 rounded-2xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all text-[#0a1b33]"
                      />
                    </div>
                  </div>

                  {/* Sidebar Library Buttons */}
                  <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                    {librariesList.length > 0 ? (
                      librariesList.map((lib) => {
                        const isActive = activeLibrary && lib.id === activeLibrary.id;
                        const progress = getLibraryProgress(lib);
                        
                        return (
                          <div
                            key={lib.id}
                            onClick={() => {
                              setActiveLibrary(lib);
                              const videos = lib.resources?.filter(r => r.type === 'video') || [];
                              setActiveVideo(videos.length > 0 ? videos[0] : null);
                            }}
                            className={`w-full p-4 rounded-[22px] border transition-all flex flex-col gap-2 group cursor-pointer ${
                              isActive
                                ? 'bg-white border-[#b8935a] shadow-md'
                                : 'bg-white/80 border-slate-200/40 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 text-left min-w-0">
                                <h5 className={`font-display text-[14px] font-bold tracking-tight truncate ${
                                  isActive ? 'text-[#b8935a]' : 'text-[#0a1b33]'
                                }`}>
                                  {lib.name}
                                </h5>
                              </div>

                              {/* Manage Library (Edit/Delete) */}
                              {isAdmin && (
                                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditLibrary(lib);
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#b8935a]"
                                    title="Rename Library"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteLibrary(lib.id);
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-500"
                                    title="Delete Library"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Progress bar inside sidebar item */}
                            {lib.resources?.some(r => r.type === 'video') ? (
                              <div className="flex items-center justify-between gap-3 mt-1 text-[11px] text-slate-400 font-sans">
                                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-[#b8935a] h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${progress.percent}%` }}
                                  />
                                </div>
                                <span className="shrink-0 font-medium font-display text-[10px] tracking-wide text-[#b8935a]">
                                  {progress.completed}/{progress.total} videos
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10.5px] font-sans text-slate-400 italic">
                                No video lectures
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-slate-50 rounded-[22px] p-6 text-center text-slate-400 font-sans text-[13px] italic">
                        No libraries created.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Area: Dynamic Cinema Player & Resources Grid */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                  
                  {activeLibrary ? (
                    <>
                      {/* Library Cover Card */}
                      <div className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#b8935a]/5 to-transparent rounded-bl-full pointer-events-none" />
                        <h2 className="font-display text-2xl font-bold text-[#0a1b33] tracking-tight">
                          {activeLibrary.name} Library
                        </h2>
                        <p className="font-sans text-[13.5px] text-slate-400 max-w-2xl leading-relaxed">
                          {activeLibrary.description}
                        </p>
                      </div>

                      {/* Standalone YouTube Player */}
                      {activeVideo && (
                        <div className="flex flex-col gap-4">
                          <div className="bg-slate-950 rounded-[32px] overflow-hidden shadow-lg border border-slate-900 aspect-video relative">
                            <iframe
                              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                              title={activeVideo.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full border-0 absolute inset-0"
                            />
                          </div>

                          <div className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-4 flex-wrap">
                              <div className="flex flex-col gap-1">
                                <span className="bg-[#b8935a]/10 text-[#b8935a] border border-[#b8935a]/10 text-[9.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider w-max">
                                  {activeVideo.category || 'Lecture'}
                                </span>
                                <h3 className="font-display text-lg text-[#0a1b33] font-bold tracking-tight mt-1">
                                  {activeVideo.title}
                                </h3>
                              </div>

                              {/* Progress watch state checkbox next to player details */}
                              <button
                                onClick={() => toggleVideoComplete(activeVideo.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer active:scale-95 ${
                                  completedVideos.includes(activeVideo.id)
                                    ? 'bg-[#b8935a]/10 border-[#b8935a]/25 text-[#b8935a]'
                                    : 'bg-slate-50 border-slate-200/60 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                {completedVideos.includes(activeVideo.id) ? (
                                  <>
                                    <CheckSquare className="w-4.5 h-4.5 fill-current text-[#b8935a]" />
                                    <span>Completed Lesson</span>
                                  </>
                                ) : (
                                  <>
                                    <Square className="w-4.5 h-4.5 text-slate-300" />
                                    <span>Mark as Completed</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="font-sans text-[13.5px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3 mt-1">
                              {activeVideo.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Resources Column Grid (Videos, Docs, Links) */}
                      <div className="grid md:grid-cols-3 gap-6">
                        
                        {/* 1st COLUMN: VIDEO LECTURES */}
                        <div className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 className="font-display text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              Videos Playlist ({activeVideos.length})
                            </h4>
                            {isAdmin && (
                              <button
                                onClick={() => openAddResource('video')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/30 p-1 rounded-full cursor-pointer transition-all"
                                title="Add Video Lecture"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                            {activeVideos.length > 0 ? (
                              activeVideos.map((video) => {
                                const isActive = activeVideo && video.id === activeVideo.id;
                                const isCompleted = completedVideos.includes(video.id);
                                return (
                                  <div
                                    key={video.id}
                                    className={`p-3 rounded-2xl border transition-all flex items-center gap-3 group relative ${
                                      isActive
                                        ? 'bg-slate-50 border-slate-200'
                                        : 'bg-white border-slate-100 hover:border-slate-200'
                                    }`}
                                  >
                                    {/* Completion Checkbox */}
                                    <button
                                      onClick={() => toggleVideoComplete(video.id)}
                                      className="text-slate-400 hover:text-[#b8935a] shrink-0 cursor-pointer"
                                      title={isCompleted ? "Completed (Click to undo)" : "Mark complete"}
                                    >
                                      {isCompleted ? (
                                        <CheckSquare className="w-4.5 h-4.5 text-[#b8935a] fill-[#b8935a]/10" />
                                      ) : (
                                        <Square className="w-4.5 h-4.5 text-slate-300" />
                                      )}
                                    </button>

                                    {/* Video Link */}
                                    <button
                                      onClick={() => setActiveVideo(video)}
                                      className="flex-1 text-left min-w-0 cursor-pointer"
                                    >
                                      <div className="flex flex-col gap-0.5">
                                        <h5 className={`font-display text-[13px] font-bold truncate ${
                                          isActive ? 'text-[#b8935a]' : 'text-[#0a1b33]'
                                        }`}>
                                          {video.title}
                                        </h5>
                                        <span className="font-sans text-[10.5px] text-slate-400 flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5 text-slate-300" /> {video.duration} mins
                                        </span>
                                      </div>
                                    </button>

                                    {/* Admin Controls */}
                                    {isAdmin && (
                                      <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                        <button
                                          onClick={() => openEditResource(video)}
                                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#b8935a]"
                                          title="Edit details"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => deleteResource(video.id)}
                                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-500"
                                          title="Delete video"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center text-slate-400 font-sans text-[12.5px] italic py-6">
                                No videos uploaded in this section.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2nd COLUMN: FILES & DOCUMENTS */}
                        <div className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 className="font-display text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              Files & Templates ({activeDocs.length})
                            </h4>
                            {isAdmin && (
                              <button
                                onClick={() => openAddResource('doc')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/30 p-1 rounded-full cursor-pointer transition-all"
                                title="Add Document Template"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                            {activeDocs.length > 0 ? (
                              activeDocs.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex items-center gap-3 group relative"
                                >
                                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-display text-[13px] font-bold text-[#0a1b33] truncate" title={doc.name}>
                                      {doc.name}
                                    </h5>
                                    <span className="font-sans text-[10px] text-slate-400 block mt-0.5 font-medium">
                                      {doc.format} • {doc.size}
                                    </span>
                                  </div>

                                  {/* Download button */}
                                  <button
                                    onClick={() => handleDownload(doc)}
                                    className="p-1.5 hover:bg-[#b8935a]/10 hover:text-[#b8935a] border border-slate-200/60 rounded-lg text-slate-500 cursor-pointer shrink-0"
                                    title="Download File"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Admin Controls */}
                                  {isAdmin && (
                                    <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                      <button
                                        onClick={() => openEditResource(doc)}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#b8935a]"
                                        title="Edit details"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => deleteResource(doc.id)}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-500"
                                        title="Delete Document"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-center text-slate-400 font-sans text-[12.5px] italic py-6">
                                No documents uploaded in this section.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 3rd COLUMN: LINKS & REFERENCES */}
                        <div className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 className="font-display text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              Reference Links ({activeLinks.length})
                            </h4>
                            {isAdmin && (
                              <button
                                onClick={() => openAddResource('link')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/30 p-1 rounded-full cursor-pointer transition-all"
                                title="Add Reference Link"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                            {activeLinks.length > 0 ? (
                              activeLinks.map((link) => (
                                <div
                                  key={link.id}
                                  className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex items-center gap-3 group relative"
                                >
                                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                                    <ExternalLink className="w-4 h-4" />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-display text-[13px] font-bold text-[#0a1b33] truncate" title={link.name}>
                                      {link.name}
                                    </h5>
                                    <span className="font-sans text-[10px] text-slate-400 block mt-0.5 truncate font-medium">
                                      {link.url}
                                    </span>
                                  </div>

                                  {/* Link navigation */}
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 hover:bg-[#b8935a]/10 hover:text-[#b8935a] border border-slate-200/60 rounded-lg text-slate-500 cursor-pointer shrink-0"
                                    title="Open reference source"
                                  >
                                    <ChevronRightIcon className="w-3.5 h-3.5" />
                                  </a>

                                  {/* Admin Controls */}
                                  {isAdmin && (
                                    <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                      <button
                                        onClick={() => openEditResource(link)}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#b8935a]"
                                        title="Edit details"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => deleteResource(link.id)}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-500"
                                        title="Delete Link"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-center text-slate-400 font-sans text-[12.5px] italic py-6">
                                No links uploaded in this section.
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </>
                  ) : (
                    <div className="bg-white border border-slate-200/50 p-16 rounded-[32px] shadow-sm flex flex-col items-center justify-center text-center text-slate-400 font-sans italic">
                      <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                      No active training libraries loaded.
                      {isAdmin && (
                        <button onClick={openAddLibrary} className="mt-4 bg-[#0a1b33] hover:bg-[#b8935a] text-white text-[12px] font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer flex items-center gap-1 shadow-sm">
                          <Plus className="w-3.5 h-3.5" /> Add First Library
                        </button>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}
            
            {/* ==========================================
            // 3. DIALOG MODALS SECTION
            // ========================================== */}

            {/* LIBRARY MODAL (Add/Edit Section) */}
            {showLibraryModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl w-full max-w-[450px] p-6 md:p-8 flex flex-col gap-4 relative"
                >
                  <button 
                    onClick={() => setShowLibraryModal(false)} 
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="font-display text-xl font-bold text-[#0a1b33]">
                    {editingLibId ? 'Rename Library Section' : 'Add New Library Section'}
                  </h3>
                  
                  <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Library Name</label>
                      <input 
                        type="text" 
                        value={libName} 
                        onChange={e => setLibName(e.target.value)} 
                        placeholder="e.g. GST basics" 
                        className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Description</label>
                      <textarea 
                        value={libDesc} 
                        onChange={e => setLibDesc(e.target.value)} 
                        rows={3}
                        placeholder="Short description detailing topic coverage..." 
                        className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33] resize-none" 
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={saveLibrary} 
                    className="w-full bg-[#0a1b33] hover:bg-[#b8935a] text-white text-[14px] font-semibold py-3.5 rounded-2xl transition-all cursor-pointer mt-4 flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> 
                    <span>Save Library Settings</span>
                  </button>
                </motion.div>
              </div>
            )}

            {/* RESOURCE MODAL (Add/Edit Resource inside active Library) */}
            {showResourceModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl w-full max-w-[500px] p-6 md:p-8 flex flex-col gap-4 relative"
                >
                  <button 
                    onClick={() => setShowResourceModal(false)} 
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="font-display text-xl font-bold text-[#0a1b33]">
                    {editingResource ? 'Edit Resource Details' : 'Add Library Resource'}
                  </h3>

                  {/* Resource Type Tabs (Locked when editing) */}
                  {!editingResource && (
                    <div className="grid grid-cols-3 bg-slate-50 border border-slate-200/60 p-1 rounded-xl mt-1">
                      <button
                        onClick={() => { setResourceType('video'); setSelectedFile(null); setFileError(''); }}
                        className={`py-2 rounded-lg font-display text-[11px] font-semibold transition-all cursor-pointer ${
                          resourceType === 'video' ? 'bg-white shadow-sm text-[#b8935a]' : 'text-slate-500'
                        }`}
                      >
                        Video Lecture
                      </button>
                      <button
                        onClick={() => { setResourceType('doc'); setSelectedFile(null); setFileError(''); }}
                        className={`py-2 rounded-lg font-display text-[11px] font-semibold transition-all cursor-pointer ${
                          resourceType === 'doc' ? 'bg-white shadow-sm text-[#b8935a]' : 'text-slate-500'
                        }`}
                      >
                        Document
                      </button>
                      <button
                        onClick={() => { setResourceType('link'); setSelectedFile(null); setFileError(''); }}
                        className={`py-2 rounded-lg font-display text-[11px] font-semibold transition-all cursor-pointer ${
                          resourceType === 'link' ? 'bg-white shadow-sm text-[#b8935a]' : 'text-slate-500'
                        }`}
                      >
                        Link / Sheet
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 mt-2">
                    {/* Resource Name/Title input (Shared) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                        {resourceType === 'video' ? 'Video Lecture Title' : resourceType === 'doc' ? 'Document Template Name' : 'Reference Name'}
                      </label>
                      <input 
                        type="text" 
                        value={resTitle} 
                        onChange={e => setResTitle(e.target.value)} 
                        placeholder={resourceType === 'video' ? 'e.g. GST Filing Steps' : resourceType === 'doc' ? 'e.g. Working Papers Template' : 'e.g. Excel Shortcut Sheet'} 
                        className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                      />
                    </div>

                    {/* VIDEO SPECIAL FIELDS */}
                    {resourceType === 'video' && (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">YouTube URL or ID</label>
                          <input 
                            type="text" 
                            value={resYtId} 
                            onChange={e => setResYtId(e.target.value)} 
                            placeholder="e.g. yK7nC1E8u4g" 
                            className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Category</label>
                            <input 
                              type="text" 
                              value={resCategory} 
                              onChange={e => setResCategory(e.target.value)} 
                              placeholder="e.g. Audit Basics" 
                              className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Duration (e.g. 15:30)</label>
                            <input 
                              type="text" 
                              value={resDuration} 
                              onChange={e => setResDuration(e.target.value)} 
                              placeholder="e.g. 14:22" 
                              className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Description</label>
                          <textarea 
                            value={resDesc} 
                            onChange={e => setResDesc(e.target.value)} 
                            rows={3} 
                            placeholder="Detailed description of the lecture topic..." 
                            className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33] resize-none" 
                          />
                        </div>
                      </>
                    )}

                    {/* DOCUMENT SPECIAL FIELDS (REAL FILE UPLOADS) */}
                    {resourceType === 'doc' && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                            Upload Document File (Max 15 MB)
                          </label>
                          
                          <div className="relative border-2 border-dashed border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-all cursor-pointer group min-h-[120px]">
                            <input 
                              type="file" 
                              onChange={handleFileChange}
                              accept=".pdf,.xlsx,.xls,.docx,.doc,.csv,.png,.jpg,.jpeg"
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                            />
                            <Download className="w-8 h-8 text-slate-400 group-hover:text-[#b8935a] transition-colors mb-2" />
                            <span className="font-sans text-[12.5px] font-semibold text-slate-600 text-center px-4 truncate max-w-full">
                              {selectedFile ? selectedFile.name : 'Choose file or drag here'}
                            </span>
                            <span className="font-sans text-[10px] text-slate-400 mt-1">
                              {selectedFile 
                                ? `Calculated size: ${selectedFile.size >= 1024 * 1024 ? (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB' : Math.round(selectedFile.size / 1024) + ' KB'}` 
                                : 'PDF, Word, Excel, CSV up to 15 MB limit'}
                            </span>
                          </div>
                        </div>

                        {fileError && (
                          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-rose-600 text-[12px] flex items-start gap-2.5 leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{fileError}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* LINK SPECIAL FIELDS */}
                    {resourceType === 'link' && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">URL Reference Address</label>
                        <input 
                          type="text" 
                          value={resUrl} 
                          onChange={e => setResUrl(e.target.value)} 
                          placeholder="e.g. https://gst.gov.in" 
                          className="w-full font-sans text-[13.5px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8935a] focus:bg-white text-[#0a1b33]" 
                        />
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={saveResource} 
                    disabled={submitting}
                    className="w-full bg-[#0a1b33] hover:bg-[#b8935a] text-white text-[14px] font-semibold py-3.5 rounded-2xl transition-all cursor-pointer mt-4 flex items-center justify-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving resource...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> 
                        <span>Save Resource Item</span>
                      </>
                    )}
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

// Small helper component for Chevron icon
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2} 
      stroke="currentColor" 
      className={className || "w-4 h-4"}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

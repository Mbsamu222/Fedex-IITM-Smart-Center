import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import {
  LayoutDashboard, Image, Users, FileText, Calendar, PenLine, BookOpen,
  Briefcase, BarChart3, Settings, LogOut, MessageSquare, ChevronRight,
  TrendingUp, Monitor, Menu, X, PlusCircle, User, Bell
} from 'lucide-react';

const sections = [
  { key: 'hero', label: 'Hero Section', description: 'Manage homepage sliders & key call-to-actions.', icon: Monitor, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { key: 'research-areas', label: 'Research Areas', description: 'Modify the center\'s key research verticals.', icon: TrendingUp, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { key: 'projects', label: 'Projects', description: 'Add/edit active and featured research projects.', icon: Briefcase, color: 'bg-orange-50 text-fedex-orange border-orange-100' },
  { key: 'events', label: 'Events & News', description: 'Publish announcements, seminars and hackathons.', icon: Calendar, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { key: 'news', label: 'News & Updates', description: 'Publish the latest news shown in the homepage popup.', icon: Bell, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
  { key: 'blogs', label: 'Blogs & Insights', description: 'Draft field notes and stories from researchers.', icon: PenLine, color: 'bg-pink-50 text-pink-600 border-pink-100' },
  { key: 'publications', label: 'Publications', description: 'List journal papers and academic publications.', icon: BookOpen, color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { key: 'team', label: 'Team Members', description: 'Configure advisory board, faculty & scholars.', icon: Users, color: 'bg-sky-50 text-sky-600 border-sky-100' },
  { key: 'gallery', label: 'Gallery', description: 'Add photos showing the center’s environment.', icon: Image, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { key: 'stats', label: 'Key Statistics', description: 'Edit metrics and counts displayed on the homepage.', icon: BarChart3, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { key: 'messages', label: 'Inbox Messages', description: 'View contact form submissions from website visitors.', icon: MessageSquare, color: 'bg-teal-50 text-teal-600 border-teal-100' },
  { key: 'settings', label: 'Site Settings', description: 'Configure contact details, footer text and general website metadata.', icon: Settings, color: 'bg-slate-50 text-slate-600 border-slate-100' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good morning');
    else if (hrs < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const fetchCounts = async () => {
      try {
        const results = await Promise.allSettled([
          adminApi.getResearchAreas(),
          adminApi.getProjects(),
          adminApi.getEvents(),
          adminApi.getNews(),
          adminApi.getBlogs(),
          adminApi.getPublications(),
          adminApi.getTeam(),
          adminApi.getGallery(),
          adminApi.getStats(),
          adminApi.getMessages(),
        ]);
        const keys = ['research-areas', 'projects', 'events', 'news', 'blogs', 'publications', 'team', 'gallery', 'stats', 'messages'];
        const c = {};
        results.forEach((r, i) => {
          c[keys[i]] = r.status === 'fulfilled' ? (r.value.data?.length || 0) : 0;
        });
        c['settings'] = 7;
        setCounts(c);
      } catch {}
    };
    fetchCounts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans w-full max-w-full overflow-hidden">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/80 shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img 
              src="/smart-logo.png" 
              alt="IIT Madras FedEx SMART Center Logo" 
              className="h-9 w-auto" 
            />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</div>
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-fedex-purple text-white font-medium shadow-lg shadow-fedex-purple/15 transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <div className="pt-4 border-t border-slate-100 my-4"></div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Links</div>
          <div className="space-y-1">
            {sections.map(section => (
              <Link 
                key={section.key} 
                to={`/admin/${section.key}`} 
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <section.icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <span>{section.label}</span>
                </div>
                {counts[section.key] !== undefined && (
                  <span className="text-[11px] font-semibold bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 group-hover:bg-slate-200 transition-colors">{counts[section.key]}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative flex flex-col w-80 max-w-[85vw] bg-white h-full border-r border-slate-200 animate-slide-in-left">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <img 
                src="/smart-logo.png" 
                alt="IIT Madras FedEx SMART Center Logo" 
                className="h-9 w-auto" 
              />
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              <Link to="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-fedex-purple text-white font-medium shadow-lg transition-all">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <div className="pt-4 border-t border-slate-100 my-4"></div>
              <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Links</div>
              <div className="space-y-1">
                {sections.map(section => (
                  <Link 
                    key={section.key} 
                    to={`/admin/${section.key}`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <section.icon className="w-4 h-4 text-slate-400" />
                      <span>{section.label}</span>
                    </div>
                    {counts[section.key] !== undefined && (
                      <span className="text-[11px] font-semibold bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{counts[section.key]}</span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* TOP NAVBAR */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 h-16 flex items-center">
          <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2 lg:hidden">
                <img 
                  src="/smart-logo.png" 
                  alt="IIT Madras FedEx SMART Center Logo" 
                  className="h-6 w-auto" 
                />
              </div>
              <span className="text-slate-600 text-sm hidden lg:inline-flex items-center gap-2">
                Welcome, {user?.name || 'Administrator'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 flex-grow">
          
          {/* WELCOME BANNER */}
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 mb-8 shadow-sm">
            <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-fedex-purple/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">SMART Center Portal</span>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2 text-slate-900">{greeting}, {user?.name || 'Admin'}!</h1>
            </div>
          </div>

          {/* QUICK START / ACTIONS */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quick Operations</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/blogs?action=add" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all text-center">
                <PlusCircle className="w-6 h-6 text-pink-500 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Draft New Blog</span>
              </Link>
              <Link to="/admin/events?action=add" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all text-center">
                <PlusCircle className="w-6 h-6 text-emerald-500 mb-2" />
                <span className="text-xs font-semibold text-slate-700">New Announcement</span>
              </Link>
              <Link to="/admin/projects?action=add" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all text-center">
                <PlusCircle className="w-6 h-6 text-orange-500 mb-2" />
                <span className="text-xs font-semibold text-slate-700">New Project</span>
              </Link>
              <Link to="/admin/messages" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all text-center">
                <MessageSquare className="w-6 h-6 text-teal-500 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Read Inbox</span>
              </Link>
            </div>
          </div>

          {/* MAIN MODULES GRID */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Website Management Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <Link
                  key={section.key}
                  to={`/admin/${section.key}`}
                  className="group flex flex-col bg-white border border-slate-200/80 p-5 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`p-3 rounded-xl border ${section.color} flex items-center justify-center`}>
                      <section.icon className="w-5 h-5" />
                    </div>
                    {counts[section.key] !== undefined ? (
                      <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-full">
                        {counts[section.key]} item{counts[section.key] !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 animate-pulse">Loading...</span>
                    )}
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-slate-800 group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {section.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed flex-grow">
                    {section.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-primary uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-all">
                    Configure <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

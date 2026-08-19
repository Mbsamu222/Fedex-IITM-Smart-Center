import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const location = useLocation();
  const { pathname } = location;

  const closeMenu = () => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileSubmenu = (menu) => {
    setMobileSubmenu((prev) => (prev === menu ? null : menu));
  };

  const isHomeActive = pathname === '/';
  const isResearchActive = pathname.startsWith('/research');
  const isTeamActive = pathname.startsWith('/team/');
  const isResourcesActive = pathname.startsWith('/publications') || pathname.startsWith('/blogs');
  const isEventsActive = pathname.startsWith('/events') || pathname.startsWith('/activities');
  const isGalleryActive = pathname.startsWith('/gallery');
  const isContactActive = pathname.startsWith('/contact');

  const getLinkClass = (isActive) => {
    return `whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
    }`;
  };

  const getDropdownBtnClass = (isActive, isOpen) => {
    return `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
      isActive || isOpen ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 flex h-20 items-center gap-6 justify-between lg:justify-start">
        <Link className="flex shrink-0 items-center gap-3 lg:mr-12 xl:mr-20 2xl:mr-24 3xl:mr-32" to="/" onClick={closeMenu}>
          <img src="/smart-logo.png" alt="IIT Madras FedEx SMART Center" className="h-10 w-auto" />
        </Link>
        
        <nav className="hidden flex-1 items-center justify-end gap-1 lg:flex xl:gap-2 2xl:gap-4 3xl:gap-6">
          <Link className={getLinkClass(isHomeActive)} to="/" onClick={closeMenu}>Home</Link>
          <Link to="/research" className={getLinkClass(isResearchActive)} onClick={closeMenu}>Research</Link>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu('team')}
            onMouseLeave={() => setOpenMenu((prev) => (prev === 'team' ? null : prev))}
          >
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => (prev === 'team' ? null : 'team'))}
              className={getDropdownBtnClass(isTeamActive, openMenu === 'team')}
            >
              Team
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down size-3.5 transition-transform ${openMenu === 'team' ? 'rotate-180' : ''}`} aria-hidden="true">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            <div className={`absolute left-1/2 top-full z-20 mt-2 w-80 -translate-x-1/2 rounded-2xl border border-border/80 bg-white p-3 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12),0_8px_24px_-8px_rgba(77,20,140,0.16)] transition-all duration-200 ${openMenu === 'team' ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'}`}>
              <div className="space-y-1">
                <Link to="/team/advisory-board" onClick={closeMenu} className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-primary-soft group/item text-left">
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Advisory Board &amp; Committee</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Strategic oversight &amp; leadership</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                </Link>
                <Link to="/team/center-team" onClick={closeMenu} className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-primary-soft group/item text-left">
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Center Team</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Core researchers &amp; administration</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                </Link>
                <Link to="/team/faculty" onClick={closeMenu} className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-primary-soft group/item text-left">
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Faculty Team</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Collaborating professors from IIT Madras</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                </Link>
                <Link to="/team/research-scholars" onClick={closeMenu} className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-primary-soft group/item text-left">
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Research Team</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Scholars &amp; engineers driving innovation</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu('resources')}
            onMouseLeave={() => setOpenMenu((prev) => (prev === 'resources' ? null : prev))}
          >
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => (prev === 'resources' ? null : 'resources'))}
              className={getDropdownBtnClass(isResourcesActive, openMenu === 'resources')}
            >
              Resources
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down size-3.5 transition-transform ${openMenu === 'resources' ? 'rotate-180' : ''}`} aria-hidden="true">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            <div className={`absolute left-1/2 top-full z-20 mt-2 w-80 -translate-x-1/2 rounded-2xl border border-border/80 bg-white p-3 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12),0_8px_24px_-8px_rgba(77,20,140,0.16)] transition-all duration-200 ${openMenu === 'resources' ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'}`}>
              <div className="space-y-1">
                <Link to="/publications" onClick={closeMenu} className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-primary-soft group/item text-left">
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Publications</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Academic research papers &amp; books</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                </Link>
                <Link to="/blogs" onClick={closeMenu} className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-primary-soft group/item text-left">
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Blogs</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Latest insights, updates &amp; studies</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu('events')}
            onMouseLeave={() => setOpenMenu((prev) => (prev === 'events' ? null : prev))}
          >
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => (prev === 'events' ? null : 'events'))}
              className={getDropdownBtnClass(isEventsActive, openMenu === 'events')}
            >
              Events &amp; Announcements
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down size-3.5 transition-transform ${openMenu === 'events' ? 'rotate-180' : ''}`} aria-hidden="true">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            <div className={`absolute left-1/2 top-full z-20 mt-2 w-80 -translate-x-1/2 rounded-2xl border border-border/80 bg-white p-3 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12),0_8px_24px_-8px_rgba(77,20,140,0.16)] transition-all duration-200 ${openMenu === 'events' ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'}`}>
              <div className="space-y-1">
                <Link to="/events" onClick={closeMenu} className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-primary-soft group/item text-left">
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Events</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Upcoming and past center events</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                </Link>
                <Link to="/activities" onClick={closeMenu} className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-primary-soft group/item text-left">
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Announcements</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Latest announcements &amp; activities</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                </Link>
              </div>
            </div>
          </div>
          <Link to="/gallery" className={getLinkClass(isGalleryActive)} onClick={closeMenu}>Gallery</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/contact" className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 lg:ml-6 lg:inline-flex">
            Get in touch 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4" aria-hidden="true">
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </Link>

          {/* Mobile Hamburger toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-xl border border-border hover:bg-surface text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x size-6">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu size-6">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu drawer */}
      <div
        className={`fixed inset-x-0 top-20 z-40 border-b border-border bg-background shadow-[var(--shadow-lift)] transition-all duration-300 lg:hidden overflow-y-auto max-h-[calc(100vh-5rem)] ${
          isMobileMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <div className="px-6 py-6 space-y-4">
          <Link
            to="/"
            onClick={closeMenu}
            className={`flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              isHomeActive ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-surface'
            }`}
          >
            Home
          </Link>
          <Link
            to="/research"
            onClick={closeMenu}
            className={`flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              isResearchActive ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-surface'
            }`}
          >
            Research
          </Link>

          {/* Team Accordion */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleMobileSubmenu('team')}
              className={`flex w-full items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                isTeamActive ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-surface'
              }`}
            >
              <span>Team</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-chevron-down size-4 transition-transform ${
                  mobileSubmenu === 'team' ? 'rotate-180' : ''
                }`}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            <div
              className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${
                mobileSubmenu === 'team' ? 'max-h-80 opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <Link
                to="/team/advisory-board"
                onClick={closeMenu}
                className={`flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname === '/team/advisory-board' ? 'text-primary font-semibold bg-primary-soft/50' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Advisory Board &amp; Committee
              </Link>
              <Link
                to="/team/center-team"
                onClick={closeMenu}
                className={`flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname === '/team/center-team' ? 'text-primary font-semibold bg-primary-soft/50' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Center Team
              </Link>
              <Link
                to="/team/faculty"
                onClick={closeMenu}
                className={`flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname === '/team/faculty' ? 'text-primary font-semibold bg-primary-soft/50' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Faculty Team
              </Link>
              <Link
                to="/team/research-scholars"
                onClick={closeMenu}
                className={`flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname === '/team/research-scholars' ? 'text-primary font-semibold bg-primary-soft/50' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Research Team
              </Link>
            </div>
          </div>

          {/* Resources Accordion */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleMobileSubmenu('resources')}
              className={`flex w-full items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                isResourcesActive ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-surface'
              }`}
            >
              <span>Resources</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-chevron-down size-4 transition-transform ${
                  mobileSubmenu === 'resources' ? 'rotate-180' : ''
                }`}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            <div
              className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${
                mobileSubmenu === 'resources' ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <Link
                to="/publications"
                onClick={closeMenu}
                className={`flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname === '/publications' ? 'text-primary font-semibold bg-primary-soft/50' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Publications
              </Link>
              <Link
                to="/blogs"
                onClick={closeMenu}
                className={`flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname === '/blogs' ? 'text-primary font-semibold bg-primary-soft/50' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Blogs
              </Link>
            </div>
          </div>

          {/* Events Accordion */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleMobileSubmenu('events')}
              className={`flex w-full items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                isEventsActive ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-surface'
              }`}
            >
              <span>Events &amp; Announcements</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-chevron-down size-4 transition-transform ${
                  mobileSubmenu === 'events' ? 'rotate-180' : ''
                }`}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            <div
              className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${
                mobileSubmenu === 'events' ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <Link
                to="/events"
                onClick={closeMenu}
                className={`flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname.startsWith('/events') ? 'text-primary font-semibold bg-primary-soft/50' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Events
              </Link>
              <Link
                to="/activities"
                onClick={closeMenu}
                className={`flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  pathname === '/activities' ? 'text-primary font-semibold bg-primary-soft/50' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Announcements
              </Link>
            </div>
          </div>

          <Link
            to="/gallery"
            onClick={closeMenu}
            className={`flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              isGalleryActive ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-surface'
            }`}
          >
            Gallery
          </Link>

          <Link
            to="/contact"
            onClick={closeMenu}
            className={`flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:bg-primary/95 mt-4`}
          >
            Get in touch 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4" aria-hidden="true">
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

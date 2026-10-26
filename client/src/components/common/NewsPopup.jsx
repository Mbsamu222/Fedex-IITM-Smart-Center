import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  Share2,
  Check
} from 'lucide-react';
import { publicApi, resolveImageUrl } from '../../services/api';

const STORAGE_DISMISSED_KEY = 'smart_announcements_dismissed_v2';
const STORAGE_MINIMIZED_KEY = 'smart_announcements_minimized_v2';

// Rich fallback announcements based on FedEx SMART Center's active programs
const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'def-1',
    title: 'Call for Applications: FedEx SMART GDC I-NCUBATE Startup Bootcamp',
    category: 'Startup Bootcamp',
    description:
      'The IIT Madras FedEx SMART Center and GDC have launched an intensive 8-week immersive incubation program for early-stage logistics and supply chain startups (TRL 3-5). Selected startups receive mentorship from global supply chain leaders, access to IIT Madras labs, and industry pilots.',
    published_date: '2026-03-21',
    start_date: '2026-03-21',
    end_date: '2026-07-30',
    location: 'IIT Madras Research Park, Chennai',
    link: '/events/slug/call-for-applications',
    image_url: '/uploads/hero_supply_chain.png',
    is_featured: true,
  },
  {
    id: 'def-2',
    title: 'Batch 2 Launch: AI Agents & GenAI for Enterprise Transformation',
    category: 'Certificate Program',
    description:
      'Applications are now open for Batch 2 of our flagship 3-month online executive program offered jointly by CODE IIT Madras and the FedEx SMART Center. Featuring 10 modules, live weekend sessions, hands-on experience with 10+ GenAI tools, and real-world supply chain case studies.',
    published_date: '2026-04-01',
    start_date: '2026-04-15',
    end_date: '2026-07-15',
    location: 'Online Live Weekend Sessions',
    link: '/events',
    image_url: '/uploads/hero_predictive_intelligence.png',
    is_featured: true,
  },
  {
    id: 'def-3',
    title: 'National Logistics Digital Twin Research Fellowship 2026',
    category: 'Research Fellowship',
    description:
      'Applications invited for Doctoral Scholars and Postdoctoral Researchers to join the National-scale Logistics Digital Twin project. Work alongside IIT Madras faculty and FedEx research scientists modelling multi-modal freight networks across India.',
    published_date: '2026-04-10',
    start_date: '2026-05-01',
    location: 'SMART Center, NAC 1 Building, IIT Madras',
    link: '/activities',
    image_url: '/uploads/hero_freight_network.png',
    is_featured: true,
  },
];

export default function NewsPopup({ showBackToTop = false }) {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef(null);

  // Fetch announcements from both /api/news and /api/activities
  useEffect(() => {
    let isMounted = true;

    const loadAnnouncements = async () => {
      try {
        const [newsRes, activitiesRes] = await Promise.allSettled([
          publicApi.getNews({ active: true }),
          publicApi.getActivities(),
        ]);

        const fetchedNews =
          newsRes.status === 'fulfilled' && Array.isArray(newsRes.value?.data)
            ? newsRes.value.data
                .filter((item) => item.is_active !== false)
                .map((item) => ({
                  ...item,
                  id: `news-${item.id}`,
                  category: item.category || 'Announcement',
                  published_date: item.published_date,
                  image_url: resolveImageUrl(item.image_url),
                }))
            : [];

        const fetchedActivities =
          activitiesRes.status === 'fulfilled' && Array.isArray(activitiesRes.value?.data)
            ? activitiesRes.value.data
                .filter((item) => item.status !== 'Archived')
                .map((item) => ({
                  ...item,
                  id: `act-${item.id}`,
                  rawId: item.id,
                  isActivity: true,
                  category: item.activity_type || 'Announcement',
                  link: `/activities#activity-${item.id}`,
                  activitiesPageLink: `/activities#activity-${item.id}`,
                  external_url: item.external_url || item.link,
                  published_date: item.start_date || item.activity_date || item.created_at,
                  image_url: resolveImageUrl(item.image_url),
                }))
            : [];

        // Active activities created by admin in the Activities section are prioritized
        const activeActivities = fetchedActivities.filter((a) => a.status === 'Active');
        const otherActivities = fetchedActivities.filter((a) => a.status !== 'Active');

        // Order: Active Activities created in Admin -> News -> Other Activities
        const combined = [...activeActivities, ...fetchedNews, ...otherActivities];

        // Fallback to defaults only if no activities or news exist
        const finalItems = combined.length > 0 ? combined : DEFAULT_ANNOUNCEMENTS;

        if (isMounted) {
          setAnnouncements(finalItems);

          // Check previous user preference
          const wasDismissed = sessionStorage.getItem(STORAGE_DISMISSED_KEY);
          const wasMinimized = localStorage.getItem(STORAGE_MINIMIZED_KEY);

          // Graceful entrance: Open after 900ms delay if not dismissed in this session
          const timer = setTimeout(() => {
            if (isMounted) {
              if (wasDismissed) {
                // If user dismissed before, show floating trigger button without expanding
                setIsMinimized(true);
                setIsOpen(false);
              } else if (wasMinimized === 'true') {
                setIsMinimized(true);
                setIsOpen(false);
              } else {
                setIsOpen(true);
                setIsMinimized(false);
              }
            }
          }, 900);

          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error('Failed to load announcements:', err);
        if (isMounted) {
          setAnnouncements(DEFAULT_ANNOUNCEMENTS);
          setIsOpen(true);
        }
      }
    };

    loadAnnouncements();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-play carousel every 6 seconds when not hovered
  useEffect(() => {
    if (!isOpen || isMinimized || !autoPlay || announcements.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isMinimized, autoPlay, announcements.length]);

  if (announcements.length === 0) return null;

  const current = announcements[currentIndex] || announcements[0];

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleMinimize = () => {
    setIsOpen(false);
    setIsMinimized(true);
    localStorage.setItem(STORAGE_MINIMIZED_KEY, 'true');
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setIsMinimized(true);
    sessionStorage.setItem(STORAGE_DISMISSED_KEY, 'true');
  };

  const handleExpand = () => {
    setIsMinimized(false);
    setIsOpen(true);
    localStorage.removeItem(STORAGE_MINIMIZED_KEY);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyLink = (item) => {
    const url = item.link?.startsWith('http')
      ? item.link
      : `${window.location.origin}${item.link || '/activities'}`;
    navigator.clipboard?.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Determine bottom positioning depending on whether Back-to-Top button is visible
  const bottomPositionClass = showBackToTop
    ? 'bottom-20 right-4 sm:bottom-24 sm:right-8'
    : 'bottom-6 right-4 sm:bottom-8 sm:right-8';

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (When Minimized) */}
      <div
        className={`fixed z-40 transition-all duration-300 ${bottomPositionClass} ${
          isMinimized && !isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none hidden'
        }`}
      >
        <button
          type="button"
          onClick={handleExpand}
          aria-label="Open Announcements"
          className="group relative flex items-center gap-2.5 rounded-full border border-purple-300/40 bg-white/95 dark:bg-slate-900/95 px-4 py-2.5 shadow-[0_12px_30px_-6px_rgba(77,20,140,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-fedex-purple hover:shadow-[0_16px_36px_-6px_rgba(77,20,140,0.4)] active:scale-95"
        >
          {/* Pulsing beacon */}
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-fedex-orange opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-fedex-orange"></span>
          </span>

          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-fedex-purple dark:text-purple-300">
            <Megaphone className="size-3.5 transition-transform group-hover:rotate-12" />
            Announcements
          </span>

          <span className="inline-flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-fedex-purple to-purple-600 text-[10px] font-extrabold text-white shadow-sm">
            {announcements.length}
          </span>
        </button>
      </div>

      {/* EXPANDED ANNOUNCEMENT CARD */}
      <div
        className={`fixed z-50 transition-all duration-500 ease-out ${bottomPositionClass} ${
          isOpen && !isMinimized
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
        }`}
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <div
          role="dialog"
          aria-label="Center Announcements"
          className="w-[calc(100vw-2rem)] max-w-[390px] sm:w-[420px] rounded-3xl border border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_24px_60px_-12px_rgba(77,20,140,0.25),0_0_0_1px_rgba(77,20,140,0.06)] overflow-hidden transition-all duration-300"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-purple-100/60 dark:border-purple-900/40 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-fedex-purple to-purple-800 text-white shadow-md shadow-purple-900/20">
                <Megaphone className="size-3.5" />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-fedex-orange ring-2 ring-white dark:ring-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
                    Center Announcements
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="mr-1 size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">
                  Official updates from IITM FedEx SMART Center
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleMinimize}
                title="Minimize widget"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-fedex-purple"
              >
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                title="Dismiss announcements"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Card Body - Current Announcement */}
          <div className="relative px-4 py-3.5 sm:px-5 sm:py-4">
            {/* Meta Row: Tag & Date */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-950/50 dark:to-orange-950/50 border border-purple-200/50 dark:border-purple-800/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fedex-purple dark:text-purple-300">
                <Sparkles className="size-2.5 text-fedex-orange" />
                {current.category || 'Announcement'}
              </span>

              {current.published_date && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Calendar className="size-3 text-fedex-purple" />
                  {formatDate(current.published_date)}
                </span>
              )}
            </div>

            {/* Announcement Image Preview (if present) - Supports all types and sizes */}
            {current.image_url && (
              <div 
                onClick={() => setActiveModalItem(current)}
                className="mt-3 relative h-36 sm:h-40 w-full overflow-hidden rounded-xl border border-border bg-slate-900/5 dark:bg-slate-950/40 p-2 flex items-center justify-center cursor-pointer group/cardimg"
              >
                {/* Ambient blur for full-bleed feel */}
                <img
                  src={current.image_url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 size-full object-cover blur-xl opacity-25 scale-125 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none"></div>

                {/* Uncropped full image */}
                <img
                  src={current.image_url}
                  alt={current.title}
                  className="relative z-10 max-h-full w-auto max-w-full object-contain rounded-lg shadow-sm transition-transform duration-300 group-hover/cardimg:scale-[1.02]"
                  onError={(e) => {
                    e.currentTarget.parentElement.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Title */}
            <h4
              onClick={() => setActiveModalItem(current)}
              className="mt-2.5 text-sm sm:text-base font-bold leading-snug tracking-tight text-foreground transition-colors hover:text-fedex-purple cursor-pointer line-clamp-2"
            >
              {current.title}
            </h4>

            {/* Location (if provided) */}
            {current.location && (
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3 text-fedex-orange shrink-0" />
                <span className="truncate">{current.location}</span>
              </div>
            )}

            {/* Description snippet */}
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
              {current.description}
            </p>

            {/* Actions Bar */}
            <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-purple-100/60 dark:border-purple-900/40 pt-3">
              <button
                type="button"
                onClick={() => setActiveModalItem(current)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-fedex-purple dark:text-purple-300 hover:underline"
              >
                Full Details
                <ArrowRight className="size-3.5" />
              </button>

              <div className="flex items-center gap-2">
                {current.isActivity ? (
                  <>
                    <Link
                      to={`/activities#activity-${current.rawId || current.id}`}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 rounded-full bg-fedex-purple px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-purple-800 hover:shadow hover:-translate-y-0.5 active:translate-y-0"
                    >
                      View in Activities
                      <ArrowRight className="size-3" />
                    </Link>
                    {current.external_url && (
                      <a
                        href={current.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1.5 text-xs font-semibold text-fedex-purple dark:text-purple-300 hover:bg-purple-100 transition-colors"
                      >
                        Apply
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </>
                ) : (
                  current.link && (
                    current.link.startsWith('http') ? (
                      <a
                        href={current.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-fedex-purple px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-purple-800 hover:shadow hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Apply / Open
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <Link
                        to={current.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 rounded-full bg-fedex-purple px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-purple-800 hover:shadow hover:-translate-y-0.5 active:translate-y-0"
                      >
                        View Notice
                        <ArrowRight className="size-3" />
                      </Link>
                    )
                  )
                )}

                <Link
                  to="/activities"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-border bg-surface px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-fedex-purple hover:text-fedex-purple"
                >
                  All
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Carousel Controls */}
          {announcements.length > 1 && (
            <div className="flex items-center justify-between border-t border-purple-100/60 dark:border-purple-900/40 bg-purple-50/40 dark:bg-slate-950/40 px-4 py-2 sm:px-5">
              <div className="flex items-center gap-1.5">
                {announcements.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to announcement ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-6 bg-fedex-purple dark:bg-purple-400'
                        : 'w-1.5 bg-purple-200 dark:bg-purple-800 hover:bg-purple-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {currentIndex + 1} of {announcements.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous announcement"
                    className="flex size-6 items-center justify-center rounded-full border border-border bg-white dark:bg-slate-800 text-foreground transition-colors hover:border-fedex-purple hover:text-fedex-purple"
                  >
                    <ChevronLeft className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next announcement"
                    className="flex size-6 items-center justify-center rounded-full border border-border bg-white dark:bg-slate-800 text-foreground transition-colors hover:border-fedex-purple hover:text-fedex-purple"
                  >
                    <ChevronRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL INFORMATIVE DETAILS MODAL */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-3xl border border-purple-200/80 dark:border-purple-800/80 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-950/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-fedex-purple dark:text-purple-300">
                  <Sparkles className="size-3 text-fedex-orange" />
                  {activeModalItem.category || 'Official Announcement'}
                </span>
                <h3 className="mt-3 text-xl sm:text-2xl font-bold leading-snug tracking-tight text-foreground">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                aria-label="Close details"
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Key Information Badges */}
            <div className="mt-4 flex flex-wrap gap-2.5 border-y border-border py-3 text-xs text-muted-foreground font-medium">
              {activeModalItem.published_date && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1">
                  <Calendar className="size-3.5 text-fedex-purple" />
                  {formatDate(activeModalItem.published_date)}
                </span>
              )}
              {activeModalItem.start_date && activeModalItem.end_date && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1">
                  <Clock className="size-3.5 text-fedex-purple" />
                  {formatDate(activeModalItem.start_date)} – {formatDate(activeModalItem.end_date)}
                </span>
              )}
              {activeModalItem.location && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1">
                  <MapPin className="size-3.5 text-fedex-orange" />
                  {activeModalItem.location}
                </span>
              )}
            </div>

            {/* Optional Banner/Poster Image - Supports all sizes & aspect ratios */}
            {activeModalItem.image_url && (
              <div className="mt-4 relative overflow-hidden rounded-2xl border border-border bg-slate-900/5 dark:bg-slate-950/40 p-2.5 flex items-center justify-center max-h-[380px]">
                <img
                  src={activeModalItem.image_url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 size-full object-cover blur-2xl opacity-20 scale-125 pointer-events-none select-none"
                />
                <img
                  src={activeModalItem.image_url}
                  alt={activeModalItem.title}
                  className="relative z-10 max-h-[350px] w-auto max-w-full object-contain rounded-xl shadow-md"
                />
              </div>
            )}

            {/* Full Informative Description */}
            <div className="mt-5 space-y-3 text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {activeModalItem.description}
            </div>

            {/* Modal Footer CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <button
                type="button"
                onClick={() => handleCopyLink(activeModalItem)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" /> Link Copied
                  </>
                ) : (
                  <>
                    <Share2 className="size-3.5" /> Share Notice
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <Link
                  to="/activities"
                  onClick={() => setActiveModalItem(null)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-fedex-purple hover:text-fedex-purple transition-colors"
                >
                  View All Announcements
                </Link>

                {activeModalItem.isActivity ? (
                  <>
                    <Link
                      to={`/activities#activity-${activeModalItem.rawId || activeModalItem.id}`}
                      onClick={() => setActiveModalItem(null)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-fedex-purple px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-purple-900/20 hover:bg-purple-800 transition-all hover:-translate-y-0.5"
                    >
                      View on Activities Page
                      <ArrowRight className="size-3.5" />
                    </Link>
                    {activeModalItem.external_url && (
                      <a
                        href={activeModalItem.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/60 px-4 py-2 text-xs sm:text-sm font-semibold text-fedex-purple dark:text-purple-300 hover:bg-purple-100 transition-all"
                      >
                        Official Link / Apply
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </>
                ) : (
                  activeModalItem.link && (
                    activeModalItem.link.startsWith('http') ? (
                      <a
                        href={activeModalItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-fedex-purple px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-purple-900/20 hover:bg-purple-800 transition-all hover:-translate-y-0.5"
                      >
                        Official Page / Apply
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      <Link
                        to={activeModalItem.link}
                        onClick={() => setActiveModalItem(null)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-fedex-purple px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-purple-900/20 hover:bg-purple-800 transition-all hover:-translate-y-0.5"
                      >
                        Visit Page
                        <ArrowRight className="size-3.5" />
                      </Link>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

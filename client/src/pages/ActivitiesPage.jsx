import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../services/api';
import Pagination from '../components/common/Pagination';
import { ExternalLink, Eye, X } from 'lucide-react';

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar size-3.5 text-primary" aria-hidden="true">
    <path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin size-3.5 text-primary" aria-hidden="true">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const filterTabs = ['All', 'Announcements', 'Job Postings', 'Seminars', 'Workshops', 'Others'];

function formatActivityDate(activity) {
  let dateStr = '';
  
  if (activity.start_date || activity.activity_date) {
    const start = new Date(activity.start_date || activity.activity_date);
    dateStr += start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (activity.end_date) {
    const end = new Date(activity.end_date);
    dateStr += (dateStr ? ' — ' : '') + end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return dateStr;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const location = useLocation();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await publicApi.getActivities();
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Filter out archived ones if necessary
          const activeActivities = res.data.filter(a => a.status !== 'Archived');
          setActivities(activeActivities.map(activity => ({ ...activity, image_url: resolveImageUrl(activity.image_url) })));
        }
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Smooth scroll and highlight card if navigated from an announcement link with hash
  useEffect(() => {
    if (!loading && location.hash) {
      const timer = setTimeout(() => {
        const targetId = location.hash.replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.add('ring-4', 'ring-primary', 'shadow-2xl');
          setTimeout(() => {
            targetEl.classList.remove('ring-4', 'ring-primary', 'shadow-2xl');
          }, 4000);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, location.hash]);

  const filteredActivities = activeFilter === 'All' ? activities : activities.filter(a => {
    const type = (a.activity_type || '').toLowerCase();
    const filter = activeFilter.toLowerCase();
    if (filter === 'announcements') return type.includes('announcement');
    if (filter === 'job postings') return type.includes('job posting');
    if (filter === 'seminars') return type.includes('seminar');
    if (filter === 'workshops') return type.includes('workshop');
    if (filter === 'others') return !['announcement', 'job posting', 'seminar', 'workshop'].some(t => type.includes(t));
    return type.includes(filter);
  });

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE) || 1;
  const paginatedActivities = filteredActivities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground pb-20">
        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 right-1/4 size-[500px] rounded-full bg-[var(--primary-soft)] opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-32 left-10 size-80 rounded-full bg-[var(--accent-soft)] opacity-60 blur-3xl"></div>
          </div>
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 py-20 lg:py-28 2xl:py-36">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="size-2 rounded-full bg-accent"></span>Announcements
            </div>
            <h1 className="mt-5 max-w-3xl 2xl:max-w-4xl text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl 2xl:text-6xl">Stay informed with the latest updates.</h1>
            <p className="mt-4 max-w-2xl 2xl:max-w-3xl text-base 2xl:text-lg leading-relaxed text-muted-foreground">Explore current and past announcements, job postings, seminars, workshops, and other key activities from the IITM FedEx SMART Center.</p>
          </div>
        </section>

        <section className="py-16 2xl:py-24">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="flex flex-wrap gap-2">
              {filterTabs.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilter === tab
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-3xl border border-border bg-card p-6 animate-pulse">
                    <div className="h-5 w-24 rounded-full bg-muted"></div>
                    <div className="mt-5 h-6 w-3/4 rounded bg-muted"></div>
                    <div className="mt-4 h-16 w-full rounded bg-muted"></div>
                    <div className="mt-6 h-4 w-48 rounded bg-muted border-t border-border pt-4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredActivities.length === 0 ? (
                  <div className="mt-12 text-center py-20 text-muted-foreground border border-border rounded-3xl bg-card">
                    No announcements found for this category.
                  </div>
                ) : (
                  <>
                    <div className="mt-12 flex flex-col gap-6">
                      {paginatedActivities.map((activity, idx) => {
                        const hasImage = Boolean(activity.image_url);
                        const CardWrapper = activity.external_url ? 'a' : 'div';
                        const wrapperProps = activity.external_url ? { 
                          href: activity.external_url, 
                          target: "_blank", 
                          rel: "noreferrer" 
                        } : {};

                        return (
                          <CardWrapper 
                            key={activity.id || idx} 
                            id={`activity-${activity.id}`} 
                            {...wrapperProps} 
                            className={`group flex flex-col ${hasImage ? 'md:flex-row' : ''} rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[var(--shadow-lift)] ${activity.external_url ? 'cursor-pointer hover:-translate-y-1' : ''}`}
                          >
                            {/* Image Poster / Banner - Handles all types and sizes (portrait, landscape, square) */}
                            {hasImage && (
                              <div 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setPreviewImage({ url: activity.image_url, title: activity.title });
                                }}
                                className="relative w-full md:w-[320px] lg:w-[380px] xl:w-[420px] shrink-0 bg-slate-900/5 dark:bg-slate-950/40 p-3 sm:p-4 border-b md:border-b-0 md:border-r border-border flex items-center justify-center overflow-hidden min-h-[260px] md:min-h-[340px] cursor-zoom-in group/img"
                              >
                                {/* Ambient blurred backdrop to seamlessly frame any size & aspect ratio */}
                                <img 
                                  src={activity.image_url} 
                                  alt="" 
                                  aria-hidden="true"
                                  className="absolute inset-0 size-full object-cover blur-2xl opacity-25 scale-125 pointer-events-none select-none"
                                />
                                <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none"></div>

                                {/* Full, uncropped poster/banner image */}
                                <img 
                                  src={activity.image_url} 
                                  alt={activity.title} 
                                  className="relative z-10 max-h-[340px] md:max-h-[380px] w-auto max-w-full object-contain rounded-2xl shadow-md transition-transform duration-300 group-hover/img:scale-[1.02]"
                                  onError={(e) => {
                                    e.currentTarget.parentElement.style.display = 'none';
                                  }}
                                />

                                <span className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs px-3 py-1.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg">
                                  <Eye className="size-3.5" />
                                  <span>Expand Poster</span>
                                </span>
                              </div>
                            )}

                            {/* Activity Information */}
                            <div className="p-6 md:p-8 flex flex-col flex-1 justify-between">
                              <div>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <span className="inline-flex w-fit rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                                    {activity.activity_type || 'Announcement'}
                                  </span>

                                  {activity.status && (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                      activity.status === 'Active' 
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                    }`}>
                                      <span className={`mr-1.5 size-1.5 rounded-full ${activity.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                      {activity.status}
                                    </span>
                                  )}
                                </div>

                                <h3 className="mt-4 text-xl md:text-2xl font-bold leading-snug tracking-tight group-hover:text-primary transition-colors">
                                  {activity.title}
                                </h3>

                                <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                  {activity.description}
                                </p>
                              </div>
                              
                              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-sm text-muted-foreground font-medium">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                  {(activity.start_date || activity.end_date || activity.activity_date) && (
                                    <span className="inline-flex items-center gap-2">
                                      <CalendarIcon /> {formatActivityDate(activity)}
                                    </span>
                                  )}
                                  {activity.location && (
                                    <span className="inline-flex items-center gap-2">
                                      <MapPinIcon /> {activity.location}
                                    </span>
                                  )}
                                </div>

                                {activity.external_url && (
                                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground text-primary px-4 py-1.5 text-xs font-semibold transition-all">
                                    <span>View Notice / Apply</span>
                                    <ExternalLink className="size-3.5" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardWrapper>
                        );
                      })}
                    </div>
                    {filteredActivities.length > ITEMS_PER_PAGE && (
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* Lightbox / Zoom Modal for Full Image Poster Preview */}
        {previewImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setPreviewImage(null)}
          >
            <div 
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black border border-white/20 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="rounded-full bg-black/60 hover:bg-black text-white p-2 backdrop-blur-md transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              <img 
                src={previewImage.url} 
                alt={previewImage.title || 'Announcement Poster'} 
                className="max-h-[80vh] w-auto max-w-full object-contain mx-auto"
              />
              {previewImage.title && (
                <div className="p-3 bg-black/90 text-white text-xs sm:text-sm font-medium text-center truncate">
                  {previewImage.title}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

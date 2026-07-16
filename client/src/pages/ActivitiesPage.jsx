import React, { useState, useEffect } from 'react';
import { publicApi, resolveImageUrl } from '../services/api';
import Pagination from '../components/common/Pagination';

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
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

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
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Announcements
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Stay informed with the latest updates.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Explore current and past announcements, job postings, seminars, workshops, and other key activities from the IIT Madras-led FedEx SMART Center.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
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
                        const CardWrapper = activity.external_url ? 'a' : 'div';
                        const wrapperProps = activity.external_url ? { 
                          href: activity.external_url, 
                          target: "_blank", 
                          rel: "noreferrer" 
                        } : {};

                        return (
                          <CardWrapper key={activity.id || idx} {...wrapperProps} className={`group flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 ${activity.external_url ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]' : ''}`}>
                            <div className="p-6 md:p-8 flex flex-col flex-1">
                              <span className="inline-flex w-fit rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                                {activity.activity_type || 'Announcement'}
                              </span>
                              <h3 className="mt-4 text-xl md:text-2xl font-bold leading-snug tracking-tight group-hover:text-primary transition-colors">{activity.title}</h3>
                              <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">{activity.description}</p>
                              
                              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-sm text-muted-foreground font-medium">
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
      </div>
    </>
  );
}

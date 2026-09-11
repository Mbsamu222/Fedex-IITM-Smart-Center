import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4" aria-hidden="true">
    <path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>
  </svg>
);

// Static fallback data matching the original scraped design
const staticEvents = [
  { id: 1, title: 'AI Agents & GenAI for Enterprise Transformation — Certificate Program', description: 'A three-month online program offered jointly by CODE IIT Madras and the IIT Madras FedEx SMART Center. Ten modules including optimization engines, agentic AI, demand intelligence, and ESG sustainability, with live Saturday sessions and hands-on experience with 10+ GenAI tools. Applications open for Batch 2.', event_type: 'Industry Focused Learning', event_date: 'May 1, 2026 — Aug 31, 2026' },
  { id: 2, title: 'Call for Applications — FedEx SMART GDC I-NCUBATE', description: 'The FedEx SMART GDC I-NCUBATE startup bootcamp is now open for applications.', event_type: 'Startup Bootcamp', event_date: 'Mar 23, 2026 — Aug 1, 2026' },
  { id: 3, title: 'Navigating Disrupting Times: How Leaders Navigate Disruptive, Unpredictable, Fast-Changing Environments', description: 'Mr. Deepak Puligadda, Global Chief Technology Officer at Redington Limited, speaks as part of the IIT Madras FedEx SMART Center Seminar Series.', event_type: 'Seminar', speaker_name: 'Mr. Deepak Puligadda', speaker_designation: 'Global Chief Technology Officer, Redington Limited', event_date: 'Mar 19, 2026 · 3:00 PM', location: 'Room 101, DoMS, IIT Madras' },
  { id: 4, title: "What's brewing at IIT Madras FedEx SMART Center? Batch 2 launch", description: 'On popular demand — launching Batch 2 of our flagship industry-focused learning program.', event_type: 'Industry Focused Learning', event_date: 'Mar 19, 2026 — May 1, 2026' },
  { id: 5, title: 'Cross-Border Logistics: Sustainability and Intelligent Decision-Making', description: 'Online seminar by Mr. Raghunandanan, P&L Head — South, Rohlig Logistics, aligned with our vision of knowledge-dissemination for researchers, faculty, interns, and industry professionals.', event_type: 'Seminar', speaker_name: 'Mr. Raghunandanan', speaker_designation: 'P&L Head — South, Rohlig Logistics', event_date: 'Feb 27, 2026 · 3:00 PM (Online)' },
  { id: 6, title: 'FedEx SMART Hackathon', description: "PAN-India theme-based competition organised with Shaasthra on 'Reimagining Debt Collection Agency Management through Digital & AI Solutions'. 2,500+ registrations, 400 project submissions, 15 finalists.", event_type: 'Hackathon', event_date: 'Feb 6, 2026' },
  { id: 7, title: 'Decentralised Multi-Agent Reinforcement Learning of Stochastic Shortest Paths', description: 'Prof. N. Hemachandra, Industrial Engineering and Operations Research, IIT Bombay, presents at the IIT Madras-led FedEx SMART Seminar Series.', event_type: 'Seminar', speaker_name: 'Prof. N. Hemachandra', speaker_designation: 'Industrial Engineering & Operations Research, IIT Bombay', event_date: 'Jan 23, 2026' },
];

const filterTabs = ['All', 'Hackathon', 'Seminars', 'Industry Focused Learning', 'Others'];

function formatEventDate(event) {
  if (event.event_date && typeof event.event_date === 'string' && event.event_date.includes(',')) {
    return event.event_date;
  }
  
  let dateStr = '';
  
  if (event.start_date) {
    const start = new Date(event.start_date);
    dateStr += start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } else if (event.event_date) {
    const d = new Date(event.event_date);
    dateStr += d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (event.end_date) {
    const end = new Date(event.end_date);
    dateStr += ' — ' + end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (event.time) {
    dateStr += ` · ${event.time}`;
  }

  return dateStr;
}

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState(staticEvents);
  const [loading, setLoading] = useState(true);

  // Initialize from searchParams so returning back to this page preserves state
  const initialTab = searchParams.get('tab') || 'All';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [activeFilter, setActiveFilter] = useState(filterTabs.includes(initialTab) ? initialTab : 'All');
  const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1);
  const ITEMS_PER_PAGE = 8;

  // Sync state if user uses browser Back/Forward buttons
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'All';
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    if (tabFromUrl !== activeFilter && filterTabs.includes(tabFromUrl)) {
      setActiveFilter(tabFromUrl);
    }
    if (pageFromUrl !== currentPage && pageFromUrl > 0) {
      setCurrentPage(pageFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await publicApi.getEvents();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setEvents(res.data.map(event => ({
            ...event,
            image_url: resolveImageUrl(event.image_url),
            speaker_image: resolveImageUrl(event.speaker_image)
          })));
        }
      } catch (err) {
        console.error('Failed to load events from API:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleFilterChange = (tab) => {
    setActiveFilter(tab);
    setCurrentPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (tab === 'All') {
      nextParams.delete('tab');
    } else {
      nextParams.set('tab', tab);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams, { replace: false });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', page.toString());
    if (activeFilter !== 'All') {
      nextParams.set('tab', activeFilter);
    }
    setSearchParams(nextParams, { replace: false });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const filteredEvents = activeFilter === 'All' ? events : events.filter(e => {
    const type = (e.event_type || '').toLowerCase();
    const filter = activeFilter.toLowerCase();
    if (filter === 'seminars') return type.includes('seminar');
    if (filter === 'others') return !['hackathon', 'seminar', 'industry focused learning'].some(t => type.includes(t));
    return type.includes(filter);
  });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 right-1/4 size-[500px] rounded-full bg-[var(--primary-soft)] opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-32 left-10 size-80 rounded-full bg-[var(--accent-soft)] opacity-60 blur-3xl"></div>
          </div>
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 py-20 lg:py-28 2xl:py-36">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
              <span className="size-2 rounded-full bg-accent"></span>Events
            </div>
            <h1 className="mt-6 max-w-3xl 2xl:max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl 2xl:text-7xl">Where research meets community.</h1>
            <p className="mt-6 max-w-2xl 2xl:max-w-3xl text-lg 2xl:text-xl leading-relaxed text-muted-foreground">Explore past and upcoming seminars, workshops, hackathons, and other engaging initiatives hosted by or involving the IIT Madras-led FedEx SMART Center.</p>
          </div>
        </section>

        <section className="py-16 2xl:py-24">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="flex flex-wrap gap-2">
              {filterTabs.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleFilterChange(tab)}
                  className={`rounded-full border px-4 py-2 text-sm 2xl:text-base font-medium transition-colors cursor-pointer ${
                    activeFilter === tab
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
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
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
                  {paginatedEvents.map((event, idx) => {
                    const hasSpeaker = Boolean(event.speaker_name || event.speaker_image || event.speaker_designation);
                    const eventSlugOrId = event.slug || event.id;

                    return (
                      <Link 
                        key={event.id || idx} 
                        to={`/events/${eventSlugOrId}`} 
                        state={{ from: `/events?${searchParams.toString()}` }}
                        className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[var(--shadow-lift)]"
                      >
                        {/* Top Box Container: Speaker Profile or Event Flyer Image */}
                        <div className={`relative w-full ${hasSpeaker ? 'min-h-[185px]' : 'aspect-[16/10]'} shrink-0 overflow-hidden bg-gradient-to-br from-[#180733] via-[#2c1356] to-[#0a0318] flex flex-col justify-end p-4 sm:p-5 border-b border-border`}>
                          {/* Background Event Image with transparency */}
                          {event.image_url && (
                            <img 
                              src={resolveImageUrl(event.image_url)} 
                              alt={event.title} 
                              className={`absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                                hasSpeaker ? 'opacity-40 filter brightness-90 contrast-110' : 'opacity-100'
                              }`} 
                            />
                          )}

                          {/* Gradient protection overlay */}
                          <div className={`absolute inset-0 pointer-events-none ${
                            hasSpeaker 
                              ? 'bg-gradient-to-t from-black/95 via-black/70 to-black/35' 
                              : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'
                          }`}></div>

                          {/* Important Person / Speaker Front-of-Box Layout */}
                          {hasSpeaker ? (
                            <div className="relative z-10 flex items-center gap-3.5 sm:gap-4 w-full">
                              <div className="size-20 sm:size-22 rounded-2xl border-2 border-accent/80 shadow-2xl overflow-hidden bg-black/50 shrink-0 backdrop-blur-md">
                                {event.speaker_image ? (
                                  <img
                                    src={resolveImageUrl(event.speaker_image)}
                                    alt={event.speaker_name || 'Speaker'}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <div className="size-full flex items-center justify-center font-bold text-base text-accent bg-primary/40">
                                    {event.speaker_name ? event.speaker_name.slice(0, 2).toUpperCase() : 'VIP'}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 text-white flex-1 flex flex-col justify-center">
                                <span className="inline-block w-fit text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-accent bg-accent/25 border border-accent/30 px-2.5 py-0.5 rounded-md backdrop-blur-md mb-1.5 shadow-sm">
                                  Key Speaker
                                </span>
                                <div className="font-bold text-base sm:text-lg leading-snug text-white drop-shadow-md break-words">
                                  {event.speaker_name}
                                </div>
                                {event.speaker_designation && (
                                  <div className="text-xs sm:text-[13px] text-white/95 leading-snug mt-1 drop-shadow-md font-normal break-words">
                                    {event.speaker_designation}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : !event.image_url ? (
                            <div className="relative z-10 flex flex-col items-center justify-center size-full py-4 text-center">
                              <span className="text-xl sm:text-2xl font-display font-bold tracking-tight text-white/90">
                                IITM SMART
                              </span>
                              <span className="text-xs uppercase tracking-widest text-accent font-semibold mt-1">
                                Event Series
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {/* Card Content */}
                        <div className="p-6 flex flex-col flex-1 justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                                {event.event_type || 'Event'}
                              </span>
                              <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                <ArrowIcon />
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.25rem]">
                              {event.title}
                            </h3>
                            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-3 min-h-[3.75rem]">
                              {event.description}
                            </p>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-[11px] text-muted-foreground font-medium">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground/80">
                              <CalendarIcon /> {formatEventDate(event)}
                            </span>
                            {event.location && (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPinIcon /> {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}


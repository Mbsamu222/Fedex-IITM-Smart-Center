import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

// Static fallback data matching the original scraped design
const staticEvents = [
  { id: 1, title: 'AI Agents & GenAI for Enterprise Transformation — Certificate Program', description: 'A three-month online program offered jointly by CODE IIT Madras and the IIT Madras FedEx SMART Center. Ten modules including optimization engines, agentic AI, demand intelligence, and ESG sustainability, with live Saturday sessions and hands-on experience with 10+ GenAI tools. Applications open for Batch 2.', event_type: 'Industry Focused Learning', event_date: 'May 1, 2026 — Aug 31, 2026' },
  { id: 2, title: 'Call for Applications — FedEx SMART GDC I-NCUBATE', description: 'The FedEx SMART GDC I-NCUBATE startup bootcamp is now open for applications.', event_type: 'Startup Bootcamp', event_date: 'Mar 23, 2026 — Aug 1, 2026' },
  { id: 3, title: 'Navigating Disrupting Times: How Leaders Navigate Disruptive, Unpredictable, Fast-Changing Environments', description: 'Mr. Deepak Puligadda, Global Chief Technology Officer at Redington Limited, speaks as part of the IIT Madras FedEx SMART Center Seminar Series.', event_type: 'Seminar', event_date: 'Mar 19, 2026 · 3:00 PM', location: 'Room 101, DoMS, IIT Madras' },
  { id: 4, title: "What's brewing at IIT Madras FedEx SMART Center? Batch 2 launch", description: 'On popular demand — launching Batch 2 of our flagship industry-focused learning program.', event_type: 'Industry Focused Learning', event_date: 'Mar 19, 2026 — May 1, 2026' },
  { id: 5, title: 'Cross-Border Logistics: Sustainability and Intelligent Decision-Making', description: 'Online seminar by Mr. Raghunandanan, P&L Head — South, Rohlig Logistics, aligned with our vision of knowledge-dissemination for researchers, faculty, interns, and industry professionals.', event_type: 'Seminar', event_date: 'Feb 27, 2026 · 3:00 PM (Online)' },
  { id: 6, title: 'FedEx SMART Hackathon', description: "PAN-India theme-based competition organised with Shaasthra on 'Reimagining Debt Collection Agency Management through Digital & AI Solutions'. 2,500+ registrations, 400 project submissions, 15 finalists.", event_type: 'Hackathon', event_date: 'Feb 6, 2026' },
  { id: 7, title: 'Decentralised Multi-Agent Reinforcement Learning of Stochastic Shortest Paths', description: 'Prof. N. Hemachandra, Industrial Engineering and Operations Research, IIT Bombay, presents at the IIT Madras-led FedEx SMART Seminar Series.', event_type: 'Seminar', event_date: 'Jan 23, 2026' },
];

const filterTabs = ['All', 'Hackathon', 'Seminars', 'Industry Focused Learning', 'Others'];

function formatEventDate(event) {
  if (event.event_date && typeof event.event_date === 'string' && event.event_date.includes(',')) {
    // Already formatted string from static data
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
  const [events, setEvents] = useState(staticEvents);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await publicApi.getEvents();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setEvents(res.data.map(event => ({ ...event, image_url: resolveImageUrl(event.image_url) })));
        }
      } catch {
        // API unavailable — keep static fallback
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Events
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Where research meets community.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Explore past and upcoming seminars, workshops, hackathons, and other engaging initiatives hosted by or involving the IIT Madras-led FedEx SMART Center.</p>
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
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedEvents.map((event, idx) => (
                    <Link key={event.id || idx} to={`/events/${event.slug || event.id}`} className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                      {event.image_url && (
                        <div className="w-full aspect-[16/9] overflow-hidden bg-muted relative">
                          <img 
                            src={resolveImageUrl(event.image_url)} 
                            alt={event.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <span className="inline-flex w-fit rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                          {event.event_type || 'Event'}
                        </span>
                        <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{event.description}</p>
                        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-[11px] text-muted-foreground font-medium">
                          <span className="inline-flex items-center gap-1.5">
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
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

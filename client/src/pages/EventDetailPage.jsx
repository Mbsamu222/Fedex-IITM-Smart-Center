import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../services/api';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';

export default function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await publicApi.getEvent(slug);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        setError('Event not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-6">
        <div className="inline-flex size-16 items-center justify-center rounded-3xl bg-muted text-muted-foreground mb-6">
          <ArrowLeft className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">Event Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">{error}</p>
        <Link to="/events" className="bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 transition-all font-medium shadow-lg hover:-translate-y-1">
          Return to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Header Section */}
      <section className="w-full pt-32 pb-12 px-6 lg:px-10 max-w-7xl mx-auto">
        <Link to="/events" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 text-sm font-semibold w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent shadow-sm">
            {event.event_type || 'Event'}
          </span>
          {event.is_featured && (
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-500 shadow-sm">
              Featured
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1] text-foreground mb-8 max-w-4xl drop-shadow-sm">
          {event.title}
        </h1>
      </section>

      {/* Premium Event Flyer Display */}
      {event.image_url && (
        <section className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24 flex justify-center">
          <div className="relative inline-block max-w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-muted/50 group border border-border bg-card">
            <img
              src={resolveImageUrl(event.image_url)}
              alt={event.title}
              className="max-w-full max-h-[300px] sm:max-h-[420px] lg:max-h-[480px] w-auto h-auto object-contain transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] pointer-events-none rounded-[2rem]"></div>
          </div>
        </section>
      )}

      {/* Main Content Area — matches ResearchDetailPage's 8/4 grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Left Column: Summary & Content */}
        <div className="lg:col-span-8 space-y-16 min-w-0">

          {/* Summary Card */}
          {event.description && (
            <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-5 sm:p-10 shadow-xl shadow-muted/50">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-accent"></div>

              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                <span className="inline-flex size-2 rounded-full bg-accent shrink-0"></span>
                <span className="leading-none">Summary</span>
              </h3>

              <p className="text-lg md:text-xl text-card-foreground leading-relaxed font-medium">
                {event.description}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="relative bg-card rounded-3xl border border-border p-5 md:p-12 shadow-xl shadow-muted/30 overflow-hidden break-words">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8 flex items-center gap-2 pb-6 border-b border-border">
              <span className="inline-flex size-2 rounded-full bg-primary shrink-0"></span>
              <span className="leading-none">Event Details</span>
            </h3>

            {event.content ? (
              <div
                className="prose prose-sm md:prose-base max-w-none break-words w-full overflow-x-auto
                [&_*]:break-words [&_*]:whitespace-pre-wrap
                prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary hover:prose-a:text-primary/80 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-border
                prose-li:text-muted-foreground prose-li:leading-relaxed prose-li:marker:text-primary
                prose-strong:text-foreground
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-card-foreground prose-blockquote:font-medium"
                dangerouslySetInnerHTML={{ __html: event.content }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed border-border bg-muted/30 text-center">
                <p className="text-xl font-semibold text-foreground mb-2">No detailed content provided.</p>
              </div>
            )}
          </div>

          {/* Action Callout */}
          {event.link && (
            <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-inner">
              <div>
                <h4 className="text-2xl font-display font-bold text-foreground mb-3">Register or Learn More</h4>
                <p className="text-muted-foreground font-medium">Click the button to view external details or register for this event.</p>
              </div>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 whitespace-nowrap"
              >
                Go to Event Link
                <div className="size-8 rounded-full bg-background/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowLeft className="w-4 h-4 rotate-[135deg]" />
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar — matches Research page's sticky sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">

            {/* Event Info Widget */}
            {(event.start_date || event.end_date || event.time || event.location) && (
              <div className="bg-card border border-border rounded-3xl p-6 space-y-5 shadow-xl shadow-muted/50">
                <h3 className="text-xl font-display font-bold text-foreground tracking-tight mb-1">Event Info</h3>

                {(event.start_date || event.end_date) && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-12 rounded-2xl bg-background border border-border shadow-sm text-primary shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Date</span>
                      <span className="text-sm md:text-base text-foreground font-semibold">
                        {event.start_date ? new Date(event.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                        {event.end_date && event.start_date !== event.end_date ? ` — ${new Date(event.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
                      </span>
                    </div>
                  </div>
                )}

                {event.time && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-12 rounded-2xl bg-background border border-border shadow-sm text-primary shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Time</span>
                      <span className="text-sm md:text-base text-foreground font-semibold">{event.time}</span>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-12 rounded-2xl bg-background border border-border shadow-sm text-primary shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Location</span>
                      <span className="text-sm md:text-base text-foreground font-semibold">{event.location}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
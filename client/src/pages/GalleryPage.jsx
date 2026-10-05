import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, X, ZoomIn, Eye, Image as ImageIcon, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { publicApi, resolveImageUrl } from '../services/api';

const gradientPairs = [
  'from-primary/30 to-accent/20',
  'from-accent/30 to-primary/20',
  'from-primary/20 to-accent/30',
  'from-accent/20 to-primary/30',
  'from-primary/30 to-primary/10',
  'from-accent/30 to-accent/10',
  'from-primary/25 to-accent/25',
  'from-accent/25 to-primary/25',
  'from-primary/30 to-accent/30',
  'from-accent/30 to-primary/30',
  'from-primary/20 to-accent/20',
];

const ImagePlaceholder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image size-10 text-foreground/30" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <circle cx="9" cy="9" r="2"></circle>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
  </svg>
);

const formatDate = (dateVal) => {
  if (!dateVal) return null;
  const str = String(dateVal).trim();
  if (!str) return null;

  // If already a human formatted string like "February 2025", "Feb 2025", "15 Feb 2025", "2025", etc.
  if (!str.includes('T') && !/^\d{4}-\d{2}-\d{2}$/.test(str) && !/^\d{4}-\d{2}$/.test(str)) {
    return str;
  }

  // If YYYY-MM format (e.g. 2025-02)
  if (/^\d{4}-\d{2}$/.test(str)) {
    const [year, month] = str.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${year}`;
    }
  }

  // If ISO date like 2025-02-15 or 2025-02-15T00:00:00.000Z
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return str;
};

// Static fallback data matching the original scraped design
const staticGallery = [
  { id: 1, caption: 'FedEx SMART Grand Challenge 2025', category: 'Highlights', date: '2025-02-28', images: [] },
  { id: 2, caption: 'Winners of FedEx SMART Grand Challenge 2025', category: 'Event Gallery', date: '2025-02-28', images: [] },
  { id: 3, caption: 'Second place winners — FedEx SMART Grand Challenge 2025', category: 'Event Gallery', date: '2025-02-28', images: [] },
  { id: 4, caption: 'Third place winners — FedEx SMART Grand Challenge 2025', category: 'Event Gallery', date: '2025-02-28', images: [] },
  { id: 5, caption: 'Interactions with Mr. Gautam Bose at the IITM FedEx SMART Center', category: 'Highlights', date: '2025-01-20', images: [] },
  { id: 6, caption: 'Team pic — Everyday GenAI Logistics Operations, Analytics & Management course', category: 'Research', date: '2025-01-15', images: [] },
  { id: 7, caption: 'Team Picture with Prof. N Hemachandra', category: 'Highlights', date: '2024-12-10', images: [] },
  { id: 8, caption: 'A group of people in front of the FedEx facility', category: 'Highlights', date: '2024-11-18', images: [] },
  { id: 9, caption: 'Team picture of IITM FedEx SMART Center', category: 'Highlights', date: '2024-10-05', images: [] },
  { id: 10, caption: 'Ms. Kami Viswanathan at the inauguration of the Center', category: 'Event Gallery', date: '2024-09-22', images: [] },
  { id: 11, caption: 'Group pic post project sharing sessions', category: 'Event Gallery', date: '2024-09-15', images: [] },
];

export default function GalleryPage() {
  const [events, setEvents] = useState(staticGallery);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Modal state for active event and current photo index in that event
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Touch swipe state for mobile lightbox
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const categories = ['All', 'Highlights', 'Event Gallery', 'Research'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await publicApi.getGallery();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setEvents(res.data.map(item => {
            const rawImages = Array.isArray(item.images) 
              ? item.images 
              : (typeof item.images === 'string' ? JSON.parse(item.images || '[]') : []);
            
            const normalizedImages = rawImages.map(resolveImageUrl).filter(Boolean);
            const mainImg = resolveImageUrl(item.image_url);

            // Ensure cover image is in the images list
            const finalImages = normalizedImages.length > 0 
              ? normalizedImages 
              : (mainImg ? [mainImg] : []);

            return {
              ...item,
              image_url: mainImg || finalImages[0] || '',
              images: finalImages
            };
          }));
        }
      } catch (err) {
        console.error('Failed to load gallery from API:', err);
        // API unavailable — keep static fallback
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredEvents = activeCategory === 'All' 
    ? events 
    : events.filter(item => item.category === activeCategory);

  // Images for the currently selected event in lightbox
  const eventPhotos = selectedEvent
    ? ((Array.isArray(selectedEvent.images) && selectedEvent.images.length > 0)
        ? selectedEvent.images
        : (selectedEvent.image_url ? [selectedEvent.image_url] : []))
    : [];

  const currentPhotoUrl = eventPhotos[currentImageIndex] || eventPhotos[0] || '';

  const goToPrevPhoto = (e) => {
    if (e) e.stopPropagation();
    if (eventPhotos.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? eventPhotos.length - 1 : prev - 1));
  };

  const goToNextPhoto = (e) => {
    if (e) e.stopPropagation();
    if (eventPhotos.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === eventPhotos.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation handler for event photos
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedEvent) return;
      if (e.key === 'Escape') setSelectedEvent(null);
      if (e.key === 'ArrowLeft') goToPrevPhoto();
      if (e.key === 'ArrowRight') goToNextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent, eventPhotos.length]);

  // Touch gesture handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50) {
      goToNextPhoto();
    } else if (distance < -50) {
      goToPrevPhoto();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const openEventGallery = (eventItem) => {
    setSelectedEvent(eventItem);
    setCurrentImageIndex(0);
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 right-1/4 size-[500px] rounded-full bg-[var(--primary-soft)] opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-32 left-10 size-80 rounded-full bg-[var(--accent-soft)] opacity-60 blur-3xl"></div>
          </div>
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 py-20 lg:py-28 2xl:py-36">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="size-2 rounded-full bg-accent"></span>Gallery
            </div>
            <h1 className="mt-5 max-w-3xl 2xl:max-w-4xl text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl 2xl:text-6xl">Our Gallery Showcase</h1>
            <p className="mt-4 max-w-2xl 2xl:max-w-3xl text-base 2xl:text-lg leading-relaxed text-muted-foreground">Take a visual journey through the IITM FedEx SMART Center, where research, collaboration, and technology converge to create real-world impact and innovation.</p>
          </div>
        </section>

        <section className="py-20 2xl:py-28">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            
            <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSelectedEvent(null);
                  }}
                  className={`rounded-full px-5 py-2 text-sm 2xl:text-base font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                      : 'bg-surface text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-3xl border border-border bg-card animate-pulse">
                    <div className="aspect-[4/3] bg-muted"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 w-3/4 rounded bg-muted"></div>
                      <div className="h-3 w-1/3 rounded bg-muted pt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-16 bg-surface border border-border rounded-3xl p-8 max-w-md mx-auto">
                <ImageIcon className="size-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No events found in this category.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
                {filteredEvents.map((eventItem, idx) => {
                  const displayDate = formatDate(eventItem.date || eventItem.created_at);
                  const photosCount = Array.isArray(eventItem.images) && eventItem.images.length > 0 ? eventItem.images.length : (eventItem.image_url ? 1 : 0);
                  const displayCover = eventItem.image_url || (eventItem.images && eventItem.images[0]) || '';

                  return (
                    <figure
                      key={eventItem.id || idx}
                      onClick={() => openEventGallery(eventItem)}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] hover:border-primary/40 cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        {displayCover ? (
                          <img
                            src={displayCover}
                            alt={eventItem.caption || 'Gallery event'}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`flex size-full items-center justify-center bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]}`}>
                            <ImagePlaceholder />
                          </div>
                        )}
                        
                        {/* Multiple photos badge indicator */}
                        {photosCount > 1 && (
                          <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold shadow-lg border border-white/10">
                            <Layers className="size-3.5 text-primary-soft" />
                            <span>{photosCount} photos</span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="size-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                            <Eye className="size-5" />
                          </div>
                        </div>
                      </div>

                      {/* Card Caption & Date Footer */}
                      <figcaption className="flex flex-1 flex-col justify-between p-5">
                        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {eventItem.caption || 'IITM FedEx SMART Center'}
                        </p>

                        {/* Date info with precise alignment */}
                        <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                          <div className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                            <Calendar className="size-3.5 text-primary shrink-0" />
                            <span>{displayDate || 'Recent'}</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/70 group-hover:text-primary transition-colors">
                            View {photosCount > 1 ? `(${photosCount})` : ''} <ZoomIn className="size-3" />
                          </span>
                        </div>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* LIGHTBOX MODAL: MULTI-IMAGE VIEWER FOR SINGLE EVENT */}
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-card border border-border rounded-3xl overflow-hidden shadow-2xl animate-scale-in flex flex-col"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-30 size-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 shadow-md"
                title="Close (Esc)"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>

              {/* Main Image Container with Left & Right Side Navigation Buttons */}
              <div className="relative w-full max-h-[70vh] min-h-[320px] sm:min-h-[420px] bg-black/95 flex items-center justify-center overflow-hidden select-none">
                
                {/* Left Side Arrow Button (for previous image in this event) */}
                {eventPhotos.length > 1 && (
                  <button
                    onClick={goToPrevPhoto}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-xl group"
                    title="Previous Photo (Left Arrow)"
                    aria-label="Previous photo in this event"
                  >
                    <ChevronLeft className="size-6 sm:size-7 transition-transform group-hover:-translate-x-0.5" />
                  </button>
                )}

                {/* Right Side Arrow Button (for next image in this event) */}
                {eventPhotos.length > 1 && (
                  <button
                    onClick={goToNextPhoto}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-xl group"
                    title="Next Photo (Right Arrow)"
                    aria-label="Next photo in this event"
                  >
                    <ChevronRight className="size-6 sm:size-7 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}

                {/* Active Image */}
                {currentPhotoUrl ? (
                  <img
                    key={currentPhotoUrl + currentImageIndex}
                    src={currentPhotoUrl}
                    alt={selectedEvent.caption || 'Event preview'}
                    className="max-h-[70vh] w-auto max-w-full object-contain transition-opacity duration-300"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center bg-gradient-to-br from-primary/30 to-accent/20">
                    <ImagePlaceholder />
                  </div>
                )}
              </div>

              {/* Event Photos Thumbnail Navigation Bar (when this event has multiple photos) */}
              {eventPhotos.length > 1 && (
                <div className="bg-black/40 border-t border-border/40 px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-thin">
                  {eventPhotos.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative shrink-0 h-12 w-16 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx
                          ? 'border-primary ring-2 ring-primary/40 scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      title={`Photo ${idx + 1}`}
                    >
                      <img
                        src={photoUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Info Details Footer Card matching sample screenshot */}
              <div className="p-5 sm:p-6 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border">
                <div className="space-y-1 max-w-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug">
                    {selectedEvent.caption || 'IITM FedEx SMART Center'}
                  </h3>
                  {eventPhotos.length > 1 && (
                    <p className="text-xs text-muted-foreground font-medium">
                      Photo {currentImageIndex + 1} of {eventPhotos.length}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2 text-sm text-muted-foreground bg-surface px-4 py-2 rounded-2xl border border-border self-start sm:self-center">
                  <Calendar className="size-4 text-primary shrink-0" />
                  <span className="font-medium">
                    {formatDate(selectedEvent.date || selectedEvent.created_at) || 'Recent'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

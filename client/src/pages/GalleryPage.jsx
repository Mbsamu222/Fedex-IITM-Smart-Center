import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  X, 
  ZoomIn, 
  Eye, 
  Image as ImageIcon, 
  ArrowUpDown, 
  Search, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
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
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Static fallback data matching the original scraped design
const staticGallery = [
  { id: 1, caption: 'Group pic of participants of FedEx SMART Grand Challenge', category: 'Highlights', date: '2025-02-28', sort_order: 1 },
  { id: 2, caption: 'Winners of FedEx SMART Grand Challenge 2025', category: 'Event Gallery', date: '2025-02-28', sort_order: 2 },
  { id: 3, caption: 'Second place winners — FedEx SMART Grand Challenge 2025', category: 'Event Gallery', date: '2025-02-28', sort_order: 3 },
  { id: 4, caption: 'Third place winners — FedEx SMART Grand Challenge 2025', category: 'Event Gallery', date: '2025-02-28', sort_order: 4 },
  { id: 5, caption: 'Interactions with Mr. Gautam Bose at the IIT Madras FedEx SMART Center', category: 'Highlights', date: '2025-01-20', sort_order: 5 },
  { id: 6, caption: 'Team pic — Everyday GenAI Logistics Operations, Analytics & Management course', category: 'Research', date: '2025-01-15', sort_order: 6 },
  { id: 7, caption: 'Team Picture with Prof. N Hemachandra', category: 'Highlights', date: '2024-12-10', sort_order: 7 },
  { id: 8, caption: 'A group of people in front of the FedEx facility', category: 'Highlights', date: '2024-11-18', sort_order: 8 },
  { id: 9, caption: 'Team picture of IIT Madras FedEx SMART Center', category: 'Highlights', date: '2024-10-05', sort_order: 9 },
  { id: 10, caption: 'Ms. Kami Viswanathan at the inauguration of the Center', category: 'Event Gallery', date: '2024-09-22', sort_order: 10 },
  { id: 11, caption: 'Group pic post project sharing sessions', category: 'Event Gallery', date: '2024-09-15', sort_order: 11 },
];

const sortOptions = [
  { id: 'newest', label: 'Newest First (Latest Date)' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'title_asc', label: 'Title (A → Z)' },
  { id: 'title_desc', label: 'Title (Z → A)' },
  { id: 'order', label: 'Featured / Default' },
];

export default function GalleryPage() {
  const [images, setImages] = useState(staticGallery);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Highlights', 'Event Gallery', 'Research'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await publicApi.getGallery();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setImages(res.data.map(img => ({ ...img, image_url: resolveImageUrl(img.image_url) })));
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

  // Keyboard escape handler for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter and modern sort logic
  const filteredAndSortedImages = useMemo(() => {
    let result = images.filter((img) => {
      const matchCategory = activeCategory === 'All' || img.category === activeCategory;
      const matchSearch = !searchQuery.trim() || 
        (img.caption && img.caption.toLowerCase().includes(searchQuery.trim().toLowerCase()));
      return matchCategory && matchSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        if (dateB !== dateA) return dateB - dateA;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      }
      if (sortBy === 'oldest') {
        const dateA = a.date ? new Date(a.date).getTime() : Infinity;
        const dateB = b.date ? new Date(b.date).getTime() : Infinity;
        if (dateA !== dateB) return dateA - dateB;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      }
      if (sortBy === 'title_asc') {
        return (a.caption || '').localeCompare(b.caption || '');
      }
      if (sortBy === 'title_desc') {
        return (b.caption || '').localeCompare(a.caption || '');
      }
      if (sortBy === 'order') {
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      }
      return 0;
    });
  }, [images, activeCategory, sortBy, searchQuery]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSortBy('newest');
    setSearchQuery('');
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header section */}
        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 right-1/4 size-[500px] rounded-full bg-[var(--primary-soft)] opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-32 left-10 size-80 rounded-full bg-[var(--accent-soft)] opacity-60 blur-3xl"></div>
          </div>
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 py-20 lg:py-28 2xl:py-36">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Gallery
            </div>
            <h1 className="mt-6 max-w-3xl 2xl:max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl 2xl:text-7xl">Our Gallery Showcase</h1>
            <p className="mt-6 max-w-2xl 2xl:max-w-3xl text-lg 2xl:text-xl leading-relaxed text-muted-foreground">Take a visual journey through the IIT Madras-led FedEx SMART Center, where research, collaboration, and technology converge to create real-world impact and innovation.</p>
          </div>
        </section>

        {/* Gallery Content Section */}
        <section className="py-16 2xl:py-24">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            
            {/* Modern Filter & Sort Control Bar */}
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-border/60 pb-8">
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                      activeCategory === category
                        ? 'bg-primary text-primary-foreground shadow-[var(--shadow-soft)] scale-100'
                        : 'bg-surface text-muted-foreground hover:bg-card hover:text-foreground border border-border/60'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search & Modern Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative min-w-[220px] sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search photos..."
                    className="w-full pl-9 pr-8 py-2 bg-surface border border-border/80 rounded-full text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Modern Sort Selector */}
                <div className="flex items-center gap-2 bg-surface border border-border/80 rounded-full px-3 py-1.5 shadow-xs">
                  <ArrowUpDown className="size-3.5 text-primary shrink-0" />
                  <label htmlFor="gallery-sort" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline">
                    Sort:
                  </label>
                  <select
                    id="gallery-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-medium text-foreground focus:outline-none cursor-pointer pr-1"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-card text-foreground">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Count Badge */}
                <div className="hidden xl:flex items-center text-xs font-medium text-muted-foreground bg-surface border border-border/60 rounded-full px-3 py-2">
                  {filteredAndSortedImages.length} {filteredAndSortedImages.length === 1 ? 'photo' : 'photos'}
                </div>
              </div>
            </div>

            {/* Photos Grid */}
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
            ) : filteredAndSortedImages.length === 0 ? (
              <div className="text-center py-20 bg-surface border border-border rounded-3xl p-8 max-w-lg mx-auto shadow-xs">
                <ImageIcon className="size-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No photos found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No gallery images matching "${searchQuery}".` 
                    : 'No images found for the selected filter.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-all shadow-xs"
                >
                  <RotateCcw className="size-3.5" />
                  Reset Filters & Search
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
                {filteredAndSortedImages.map((img, idx) => {
                  const displayDate = formatDate(img.date || img.created_at);
                  return (
                    <figure
                      key={img.id || idx}
                      onClick={() => setSelectedImage(img)}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] hover:border-primary/40 cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        {img.image_url ? (
                          <img
                            src={img.image_url}
                            alt={img.caption || 'Gallery image'}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`flex size-full items-center justify-center bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]}`}>
                            <ImagePlaceholder />
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
                          {img.caption || 'IIT Madras FedEx SMART Center'}
                        </p>

                        {/* Date info with clean alignment */}
                        <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                          <div className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                            <Calendar className="size-3.5 text-primary shrink-0" />
                            <span>{displayDate || 'Recent'}</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/70 group-hover:text-primary transition-colors">
                            View <ZoomIn className="size-3" />
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

        {/* LIGHTBOX / IMAGE PREVIEW MODAL */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-card border border-border rounded-3xl overflow-hidden shadow-2xl animate-scale-in flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 size-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                title="Close"
              >
                <X className="size-5" />
              </button>

              {/* Main Image in Modal */}
              <div className="relative w-full max-h-[70vh] bg-black/90 flex items-center justify-center overflow-hidden">
                {selectedImage.image_url ? (
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.caption || 'Gallery preview'}
                    className="max-h-[70vh] w-auto max-w-full object-contain"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center bg-gradient-to-br from-primary/30 to-accent/20">
                    <ImagePlaceholder />
                  </div>
                )}
              </div>

              {/* Info Details Footer */}
              <div className="p-6 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border">
                <div className="space-y-1 max-w-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug">
                    {selectedImage.caption || 'Gallery Image'}
                  </h3>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-sm text-muted-foreground bg-surface px-4 py-2 rounded-2xl border border-border self-start sm:self-center">
                  <Calendar className="size-4 text-primary shrink-0" />
                  <span className="font-medium">
                    {formatDate(selectedImage.date || selectedImage.created_at) || 'Recent'}
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

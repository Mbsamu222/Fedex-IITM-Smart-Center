import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

// Static fallback data matching the original scraped design
const staticGallery = [
  { id: 1, caption: 'Group pic of participants of FedEx SMART Grand Challenge', category: 'Main Gallery' },
  { id: 2, caption: 'Winners of FedEx SMART Grand Challenge 2025', category: 'Event Gallery' },
  { id: 3, caption: 'Second place winners — FedEx SMART Grand Challenge 2025', category: 'Event Gallery' },
  { id: 4, caption: 'Third place winners — FedEx SMART Grand Challenge 2025', category: 'Event Gallery' },
  { id: 5, caption: 'Interactions with Mr. Gautam Bose at the IIT Madras FedEx SMART Center', category: 'Main Gallery' },
  { id: 6, caption: 'Team pic — Everyday GenAI Logistics Operations, Analytics & Management course', category: 'Research' },
  { id: 7, caption: 'Team Picture with Prof. N Hemachandra', category: 'Main Gallery' },
  { id: 8, caption: 'A group of people in front of the FedEx facility', category: 'Main Gallery' },
  { id: 9, caption: 'Team picture of IIT Madras FedEx SMART Center', category: 'Main Gallery' },
  { id: 10, caption: 'Ms. Kami Viswanathan at the inauguration of the Center', category: 'Event Gallery' },
  { id: 11, caption: 'Group pic post project sharing sessions', category: 'Event Gallery' },
];

export default function GalleryPage() {
  const [images, setImages] = useState(staticGallery);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Main Gallery', 'Event Gallery', 'Research'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await publicApi.getGallery();
        if (res.data && res.data.length > 0) {
          setImages(res.data.map(img => ({ ...img, image_url: resolveImageUrl(img.image_url) })));
        }
      } catch {
        // API unavailable — keep static fallback
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

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
              <span className="size-1.5 rounded-full bg-accent"></span>Gallery
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Our Gallery Showcase</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Take a visual journey through the IIT Madras-led FedEx SMART Center, where research, collaboration, and technology converge to create real-world impact and innovation.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            
            <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
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
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-3xl border border-border bg-card animate-pulse">
                    <div className="aspect-[4/3] bg-muted"></div>
                    <div className="p-5"><div className="h-4 w-3/4 rounded bg-muted"></div></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredImages.map((img, idx) => (
                  <figure key={img.id || idx} className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                    {img.image_url ? (
                      <img src={img.image_url} alt={img.caption || ''} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                    ) : (
                      <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]}`}>
                        <ImagePlaceholder />
                      </div>
                    )}
                    <figcaption className="p-5 text-sm text-muted-foreground">{img.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../services/api';
import Pagination from '../components/common/Pagination';


const gradientPairs = [
  'from-primary/30 to-accent/20',
  'from-accent/30 to-primary/20',
  'from-primary/25 to-accent/30',
  'from-accent/25 to-primary/25',
  'from-primary/30 to-primary/10',
  'from-accent/30 to-accent/10',
];

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar size-3.5" aria-hidden="true">
    <path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right absolute right-4 top-4 size-5 text-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
    <path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>
  </svg>
);

// Static fallback data matching the original scraped design
const staticBlogs = [
  { id: 1, title: 'Decarbonising last-mile logistics in Indian cities', excerpt: 'How modelling EV charging networks at city scale changes the math on emissions.', category: 'Sustainability', published_date: '2026-05-01' },
  { id: 2, title: 'Agentic AI for warehouse tech simplification', excerpt: 'From SOPs to copilots — bringing LLM agents to the warehouse floor.', category: 'AI & ML', published_date: '2026-04-01' },
  { id: 3, title: 'Worker wellness, instrumented', excerpt: 'Wearables, vision and ergonomics research informing safer warehouse operations.', category: 'Worker Wellness', published_date: '2026-03-01' },
  { id: 4, title: 'Making India a global transshipment hub', excerpt: 'Network design choices that could position India at the centre of global air cargo.', category: 'Infrastructure', published_date: '2026-02-01' },
  { id: 5, title: '3D bin packing meets real-world ULDs', excerpt: 'Why textbook bin-packing breaks down in air-freight loading — and what works.', category: 'Algorithms', published_date: '2026-01-01' },
  { id: 6, title: 'Inside the SMART Grand Challenge', excerpt: 'Behind the scenes of our flagship student innovation contest.', category: 'Community', published_date: '2025-12-01' },
];

function formatDate(dateStr) {

  if (!dateStr) return '';
  const d = new Date(dateStr);

  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState(staticBlogs);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await publicApi.getBlogs();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBlogs(res.data.map(blog => ({ ...blog, image_url: resolveImageUrl(blog.image_url) })));
        }
      } catch (err) {
        console.error('Failed to load blogs from API:', err);
        // API unavailable — keep static fallback
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = blogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
              <span className="size-1.5 rounded-full bg-accent"></span>Resources
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Blogs</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Field notes, perspectives and stories from researchers at the SMART Center.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Latest Posts
            </div>

            {loading ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-3xl border border-border bg-card animate-pulse">
                    <div className="aspect-[16/10] bg-muted"></div>
                    <div className="p-6">
                      <div className="h-3 w-20 rounded bg-muted"></div>
                      <div className="mt-3 h-5 w-3/4 rounded bg-muted"></div>
                      <div className="mt-3 h-10 w-full rounded bg-muted"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedBlogs.map((blog, idx) => (
                    <article key={blog.id || idx} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                      <div className={`relative flex aspect-[16/10] items-end bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]} p-5`}>
                        {blog.image_url ? (
                          <img src={blog.image_url} alt={blog.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                        ) : null}
                        <span className="rounded-full bg-card/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-primary backdrop-blur">{blog.category}</span>
                        <ArrowIcon />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarIcon /> {formatDate(blog.published_date)}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">{blog.title}</h3>
                        <p className="mt-3 text-sm text-muted-foreground">{blog.excerpt}</p>
                      </div>
                    </article>
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

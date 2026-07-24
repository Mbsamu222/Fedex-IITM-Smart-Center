import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import Pagination from '../components/common/Pagination';

// Static fallback data matching the original scraped design
const staticPublications = [
  {
    id: 1,
    title: 'Cost-Aware Soft-Constrained Optimization for Scenario-Driven Urban Logistics Resilience',
    authors: 'Dr. Anish Monseley, Pranesh Kannan, Snazal Singh, Prof. Balasubramaniam Natarajan, Prof. Babji Srinivasan',
    venue: 'IFAC/INSTICC IN4PL 2025',
    year: 2025,
    abstract: 'A scenario-based optimization framework supporting resilient urban-logistics fulfillment under disruption. Combines Linear Programming and Unbalanced Optimal Transport to balance cost efficiency with service equity across Chennai case studies.',
    category: 'Journal Articles',
    featured: true,
  },
];

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text size-3.5" aria-hidden="true">
    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
    <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
    <path d="M10 9H8"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star size-3.5" aria-hidden="true">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
  </svg>
);

export default function PublicationsPage() {
  const [publications, setPublications] = useState(staticPublications);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const res = await publicApi.getPublications();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPublications(res.data);
        }
      } catch (err) {
        console.error('Failed to load publications from API:', err);
        // API unavailable — keep static fallback
      } finally {
        setLoading(false);
      }
    };
    fetchPubs();
  }, []);

  const totalPages = Math.ceil(publications.length / ITEMS_PER_PAGE);
  const paginatedPubs = publications.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Group publications by category
  const grouped = paginatedPubs.reduce((acc, pub) => {
    const cat = pub.category || 'Journal Articles';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pub);
    return acc;
  }, {});

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 right-1/4 size-[500px] rounded-full bg-[var(--primary-soft)] opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-32 left-10 size-80 rounded-full bg-[var(--accent-soft)] opacity-60 blur-3xl"></div>
          </div>
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 py-20 lg:py-28 2xl:py-36">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Resources
            </div>
            <h1 className="mt-6 max-w-3xl 2xl:max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl 2xl:text-7xl">Publications</h1>
            <p className="mt-6 max-w-2xl 2xl:max-w-3xl text-lg 2xl:text-xl leading-relaxed text-muted-foreground">Research outputs from the SMART Center — journal articles and conference papers advancing the science of supply chains.</p>
          </div>
        </section>

        <section className="py-20 2xl:py-28">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            {loading ? (
              <div className="space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-3xl border border-border bg-card p-8 animate-pulse">
                    <div className="flex gap-2"><div className="h-6 w-28 rounded-full bg-muted"></div><div className="h-6 w-20 rounded-full bg-muted"></div></div>
                    <div className="mt-5 h-8 w-3/4 rounded bg-muted"></div>
                    <div className="mt-3 h-4 w-1/2 rounded bg-muted"></div>
                    <div className="mt-5 h-16 w-full rounded bg-muted"></div>
                  </div>
                ))}
              </div>
            ) : (
              Object.entries(grouped).map(([category, pubs]) => (
                <div key={category}>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                      <span className="size-1.5 rounded-full bg-accent"></span>{category}
                    </div>
                    <span className="text-sm text-muted-foreground">{pubs.length} publication{pubs.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="mt-10 space-y-6">
                    {pubs.map((pub) => (
                      <article key={pub.id} className="group rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-medium text-primary">
                              <FileTextIcon /> {pub.category || 'Journal Articles'}
                            </span>
                            {(pub.featured || pub.is_featured) && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-accent">
                                <StarIcon /> Featured
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">{pub.year}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-medium leading-snug tracking-tight text-foreground">{pub.title}</h3>
                        <div className="mt-4 space-y-1">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{pub.authors}</p>
                          <p className="text-sm text-muted-foreground italic">{pub.venue}</p>
                        </div>
                        {pub.abstract && (
                          <div className="mt-5 pt-5 border-t border-border/50">
                            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 hover:line-clamp-none transition-all duration-300">{pub.abstract}</p>
                          </div>
                        )}
                        
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          {pub.pdf_link && (
                            <a href={pub.pdf_link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 px-4 py-2 text-xs font-semibold transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                              PDF
                            </a>
                          )}
                          {pub.doi_link && (
                            <>
                              <a href={pub.doi_link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-xs font-semibold transition-colors shadow-sm">
                                View Publication →
                              </a>
                              <a href={pub.doi_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
                                {pub.doi_link.replace('https://doi.org/', 'DOI: ')}
                              </a>
                            </>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))
            )}
            {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
          </div>
        </section>
      </div>
    </>
  );
}

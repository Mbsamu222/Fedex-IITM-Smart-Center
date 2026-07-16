import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../services/api';
import Pagination from '../components/common/Pagination';

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf size-6" aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse size-6" aria-hidden="true">
    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
    <path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path>
  </svg>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain size-6" aria-hidden="true">
    <path d="M12 18V5"></path><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"></path>
    <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"></path>
    <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"></path><path d="M18 18a4 4 0 0 0 2-7.464"></path>
    <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"></path><path d="M6 18a4 4 0 0 1-2-7.464"></path>
    <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"></path>
  </svg>
);

const WarehouseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-warehouse size-6" aria-hidden="true">
    <path d="M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11"></path>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z"></path>
    <path d="M6 13h12"></path><path d="M6 17h12"></path>
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles size-10 text-card/80" aria-hidden="true">
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
    <path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle>
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right absolute right-4 top-4 size-4 text-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
    <path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>
  </svg>
);

const gradientPairs = [
  'from-primary/30 to-accent/20',
  'from-accent/30 to-primary/20',
  'from-primary/25 to-accent/30',
  'from-accent/25 to-primary/25',
  'from-primary/30 to-primary/10',
  'from-accent/30 to-accent/10',
];

const defaultAreas = [
  { id: 1, title: 'Supply Chain Sustainability and Modelling', description: 'Decarbonising and optimising supply chain operations through data-driven models and circular-economy approaches.', icon: 'Leaf' },
  { id: 2, title: 'Logistics Worker Wellness', description: 'Human-centred research on ergonomics, safety, and frontline workforce wellbeing across warehouses and last-mile operations.', icon: 'Heart' },
  { id: 3, title: 'Algorithms and Machine Learning', description: 'Foundational algorithms and learning systems powering predictive and prescriptive supply chain intelligence.', icon: 'Brain' },
  { id: 4, title: 'Logistics Infrastructure', description: 'Network design, EV charging, intermodal optimisation, and digital systems at national scale.', icon: 'Warehouse' },
];

const defaultProjects = [
  { id: 1, research_area_name: 'Logistics Infrastructure', title: 'Optimal EV Charging Networks and EV Fleet Size' },
  { id: 2, research_area_name: 'Logistics Infrastructure', title: 'AMP-LOGIC: Advanced Mobility Planning for Logistics & Charging' },
  { id: 3, research_area_name: 'Supply Chain Sustainability and Modelling', title: 'Customer Email Analysis' },
  { id: 4, research_area_name: 'Supply Chain Sustainability and Modelling', title: 'Demand Analysis, Capacity Planning and Forecasting Models' },
  { id: 5, research_area_name: 'Logistics Infrastructure', title: 'Modules for Autonomous Delivery Agents on Advanced Delivery Vehicles' },
  { id: 6, research_area_name: 'Algorithms and Machine Learning', title: 'Tech Simplification using Agentic AI' },
  { id: 7, research_area_name: 'Algorithms and Machine Learning', title: '3D Bin Packing & ULD Optimization' },
  { id: 8, research_area_name: 'Supply Chain Sustainability and Modelling', title: 'Making India a Global Transshipment Hub' },
  { id: 9, research_area_name: 'Logistics Worker Wellness', title: 'Vision-based Monitoring of Warehouse Worker Safety & Performance' },
  { id: 10, research_area_name: 'Supply Chain Sustainability and Modelling', title: 'Customizable Granularity in Demand and Capacity Planning' },
  { id: 11, research_area_name: 'Logistics Infrastructure', title: 'Virtual Simulation of Warehouse Operations' },
  { id: 12, research_area_name: 'Supply Chain Sustainability and Modelling', title: 'Feedstock-Biomass Aviation Turbine Fuel Supply Chain' },
];

export default function ResearchPage() {
  const [areas, setAreas] = useState(defaultAreas);
  const [projects, setProjects] = useState(defaultProjects);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        const [areasRes, projectsRes] = await Promise.all([
          publicApi.getResearchAreas(),
          publicApi.getProjects()
        ]);
        if (areasRes.data && areasRes.data.length > 0) {
          setAreas(areasRes.data.map(area => ({ ...area, image_url: resolveImageUrl(area.image_url) })));
        }
        if (projectsRes.data && projectsRes.data.length > 0) {
          setProjects(projectsRes.data.map(p => ({ ...p, image_url: resolveImageUrl(p.image_url) })));
        }
      } catch (err) {
        // API failed or database is empty: fall back to default design details
      } finally {
        setLoading(false);
      }
    };
    fetchResearchData();
  }, []);

  const renderIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'leaf':
      case 'sustainability':
        return <LeafIcon />;
      case 'heart':
      case 'worker wellness':
      case 'wellness':
        return <HeartIcon />;
      case 'brain':
      case 'ai':
      case 'ml':
      case 'algorithms':
        return <BrainIcon />;
      case 'warehouse':
      case 'infrastructure':
      case 'building':
        return <WarehouseIcon />;
      default:
        return <BrainIcon />;
    }
  };

  const getAreaBgClass = (idx) => {
    const bgs = [
      'bg-gradient-to-br from-primary/25 to-accent/15',
      'bg-gradient-to-br from-accent/25 to-primary/15',
      'bg-gradient-to-br from-primary/30 to-primary/10',
      'bg-gradient-to-br from-accent/30 to-accent/10',
    ];
    return bgs[idx % bgs.length];
  };

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginatedProjects = projects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
              <span className="size-1.5 rounded-full bg-accent"></span>Research
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Our Research Landscape</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Discover the ongoing research projects and technological explorations at the IIT Madras-led FedEx SMART Center, driving innovation across the logistics spectrum. Explore our featured projects under each vertical to understand what we are doing.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Research Verticals
            </div>
            <h2 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">Four interconnected verticals.</h2>
            {loading ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-44 rounded-3xl border border-border bg-card p-8 animate-pulse">
                    <div className="size-12 rounded-2xl bg-muted"></div>
                    <div className="mt-4 h-6 w-1/2 bg-muted rounded"></div>
                    <div className="mt-3 h-4 w-3/4 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {areas.map((area, idx) => (
                  <div key={area.id || idx} className={`group relative overflow-hidden rounded-3xl border border-border ${getAreaBgClass(idx)} p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]`}>
                    <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-card/80 text-accent shadow-[var(--shadow-soft)] backdrop-blur">
                      {renderIcon(area.icon || area.title)}
                    </div>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight">{area.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Featured Projects
            </div>
            <h2 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">Projects in motion.</h2>
            {loading ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 rounded-3xl border border-border bg-card p-6 animate-pulse">
                    <div className="aspect-[16/9] w-full bg-muted rounded-2xl"></div>
                    <div className="mt-4 h-4 w-1/3 bg-muted rounded"></div>
                    <div className="mt-2 h-5 w-3/4 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedProjects.map((project, idx) => (
                    <Link to={`/research/${project.slug || project.id}`} key={project.id || idx} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                      <div className={`relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]}`}>
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                          <SparklesIcon />
                        )}
                        <ArrowIcon />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="w-fit rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                            {project.research_area_name || 'Featured Project'}
                          </span>
                          {project.status && (
                            <span className={`w-fit rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wider ${project.status === 'Ongoing' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                              {project.status}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold leading-snug tracking-tight">{project.title}</h3>
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

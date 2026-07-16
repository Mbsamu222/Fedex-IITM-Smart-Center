import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../services/api';

// Icons mapping for research areas
const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain size-6" aria-hidden="true">
    <path d="M12 18V5"></path><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"></path>
    <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"></path>
    <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"></path><path d="M18 18a4 4 0 0 0 2-7.464"></path>
    <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"></path><path d="M6 18a4 4 0 0 1-2-7.464"></path>
    <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"></path>
  </svg>
);

const PlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plane size-6" aria-hidden="true">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-line size-6" aria-hidden="true">
    <path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="m19 9-5 5-4-4-3 3"></path>
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-warehouse size-6" aria-hidden="true">
    <path d="M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11"></path>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z"></path>
    <path d="M6 13h12"></path><path d="M6 17h12"></path>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse size-6" aria-hidden="true">
    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
    <path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path>
  </svg>
);

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf size-6" aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
);

const MonitorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu size-6" aria-hidden="true">
    <path d="M12 20v2"></path><path d="M12 2v2"></path><path d="M17 20v2"></path><path d="M17 2v2"></path>
    <path d="M2 12h2"></path><path d="M2 17h2"></path><path d="M2 7h2"></path>
    <path d="M20 12h2"></path><path d="M20 17h2"></path><path d="M20 7h2"></path>
    <path d="M7 20v2"></path><path d="M7 2v2"></path>
    <rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="8" y="8" width="8" height="8" rx="1"></rect>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar size-3.5" aria-hidden="true">
    <path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4" aria-hidden="true">
    <path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>
  </svg>
);

const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up size-5" aria-hidden="true">
    <path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path>
  </svg>
);

const defaultSlides = [
  {
    tag: "A joint initiative of IIT Madras & FedEx",
    title: "Engineering the future of supply chains.",
    titleHighlight: "supply chains.",
    description: "The SMART Center advances Supply Chain Modelling, Algorithms, Research and Technology — uniting world-class academic research with global logistics expertise to solve problems at planetary scale.",
    ctaPrimaryText: "Explore Research",
    ctaPrimaryLink: "#research",
    ctaSecondaryText: "View Projects",
    ctaSecondaryLink: "#projects",
    image: "https://smart-redesign-essence.lovable.app/assets/hero-network-D4naFa_1.jpg",
    floatingTag: "Live research",
    floatingText: "National Logistics Digital Twin — modelling freight flows across India."
  },
  {
    tag: "Logistics Optimization & Operations",
    title: "Optimizing multi-modal freight networks.",
    titleHighlight: "freight networks.",
    description: "Pioneering mathematical programming and optimization algorithms to streamline freight transport across road, rail, and sea lanes.",
    ctaPrimaryText: "Our Research",
    ctaPrimaryLink: "#research",
    ctaSecondaryText: "View Case Studies",
    ctaSecondaryLink: "/publications",
    image: "https://smart-redesign-essence.lovable.app/assets/hero-2-CdyypM83.jpg",
    floatingTag: "Network Design",
    floatingText: "Multi-modal routing algorithms for large-scale operations."
  },
  {
    tag: "AI Technology & Neural Networks",
    title: "Predictive intelligence for global logistics.",
    titleHighlight: "global logistics.",
    description: "Deploying time-series transformers and foundation models to achieve SKU-level demand forecasting and real-time operational adaptability.",
    ctaPrimaryText: "AI Research",
    ctaPrimaryLink: "#research",
    ctaSecondaryText: "See Publications",
    ctaSecondaryLink: "/publications",
    image: "https://smart-redesign-essence.lovable.app/assets/hero-3-BWnU1bBK.jpg",
    floatingTag: "AI Models",
    floatingText: "SKU-level forecasting models powered by deep learning."
  },
  {
    tag: "Autonomous Last-Mile Delivery",
    title: "Autonomous aerial last-mile logistics.",
    titleHighlight: "last-mile logistics.",
    description: "Developing path-planning algorithms and drone platform optimization for fast, last-mile package distribution in urban and remote areas.",
    ctaPrimaryText: "Drone Research",
    ctaPrimaryLink: "#research",
    ctaSecondaryText: "Watch Demo",
    ctaSecondaryLink: "/gallery",
    image: "https://smart-redesign-essence.lovable.app/assets/hero-4-O8KFGH54.jpg",
    floatingTag: "Drone Tech",
    floatingText: "Path-planning algorithms for last-mile autonomous deliveries."
  }
];

const defaultStats = [
  { label: 'Faculty Mentors', value: '30', suffix: '+' },
  { label: 'Research Team', value: '50', suffix: '+' },
  { label: 'R&D Projects', value: '50', suffix: '+' },
  { label: 'Knowledge Dissemination', value: '35', suffix: '+' },
  { label: 'Talent Outreach', value: '3,500', suffix: '+' },
  { label: 'Internship Applications', value: '1,500', suffix: '+' },
];

const defaultResearchAreas = [
  { title: 'AI & Machine Learning', description: 'Foundational models powering predictive and prescriptive supply chain intelligence.', icon: 'Brain' },
  { title: 'Drone Logistics', description: 'Autonomous aerial delivery research for last-mile and remote distribution.', icon: 'Plane' },
  { title: 'Demand Forecasting', description: 'Statistical and deep-learning approaches for resilient, high-accuracy forecasts.', icon: 'TrendingUp' },
  { title: 'Logistics Infrastructure', description: 'Network design, warehousing, and intermodal optimisation at national scale.', icon: 'Building' },
  { title: 'Worker Wellness', description: 'Human-centred research on ergonomics, safety, and frontline workforce wellbeing.', icon: 'Heart' },
  { title: 'Sustainability', description: 'Decarbonising supply chains through circularity, routing, and green logistics.', icon: 'Leaf' },
  { title: 'Digital Twin Systems', description: 'Live digital replicas of physical operations for simulation and control.', icon: 'Monitor' },
];

const defaultFeaturedProjects = [
  { title: 'National-scale Logistics Digital Twin', description: 'A high-fidelity simulation platform modelling India’s freight network across road, rail, air, and inland waterways.', label: 'Featured' },
  { title: 'Foundation Models for Forecasting', description: 'Pretrained time-series transformers tailored for SKU-level demand across retail and industrial categories.', label: 'AI' },
  { title: 'Green Last-Mile Routing', description: 'Joint vehicle-and-route optimisation reducing CO₂ intensity for urban delivery fleets.', label: 'Sustainability' },
  { title: 'Autonomous Warehouse Orchestration', description: 'Multi-agent coordination for AMRs in high-throughput sortation environments.', label: 'Robotics' },
];

const defaultEvents = [
  { date: 'Oct 2025', title: 'SMART Annual Research Symposium', desc: 'A two-day convening of academia, industry, and policy on the future of supply chains.' },
  { date: 'Aug 2025', title: 'Industry Roundtable — Resilient Logistics', desc: 'Closed-door dialogue with global supply chain leaders and IIT Madras researchers.' },
  { date: 'Jun 2025', title: 'SMART Summer School', desc: 'Intensive programme for graduate students on optimisation, ML, and operations research.' },
  { date: 'Mar 2025', title: 'FedEx × IIT Madras Innovation Day', desc: 'Showcase of student innovation, demos, and pitches from across the centre.' },
];

const renderTitle = (title, highlight) => {
  if (!highlight) return title;
  const parts = title.split(highlight);
  return (
    <>
      {parts[0]}
      <em className="not-italic text-primary">{highlight}</em>
      {parts[1]}
    </>
  );
};

export default function HomePage() {
  const [slides, setSlides] = useState(defaultSlides);
  const [activeSlide, setActiveSlide] = useState(0);
  const [stats, setStats] = useState(defaultStats);
  const [researchAreas, setResearchAreas] = useState(defaultResearchAreas);
  const [projects, setProjects] = useState(defaultFeaturedProjects);
  const [events, setEvents] = useState(defaultEvents);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [heroRes, statsRes, areasRes, projectsRes, eventsRes] = await Promise.all([
          publicApi.getHero(),
          publicApi.getStats(),
          publicApi.getResearchAreas(),
          publicApi.getProjects(true), // featured only
          publicApi.getEvents({ featured: true })
        ]);

        if (heroRes.data && (Array.isArray(heroRes.data) ? heroRes.data.length > 0 : Object.keys(heroRes.data).length > 0)) {
          const dataArray = Array.isArray(heroRes.data) ? heroRes.data : [heroRes.data];
          const apiSlides = dataArray.map(h => ({
            tag: h.subtitle || "A joint initiative of IIT Madras & FedEx",
            title: h.title,
            titleHighlight: h.title_highlight || "supply chains.",
            description: h.description,
            ctaPrimaryText: h.cta_primary_text || "Explore Research",
            ctaPrimaryLink: h.cta_primary_link || "#research",
            ctaSecondaryText: h.cta_secondary_text || "View Projects",
            ctaSecondaryLink: h.cta_secondary_link || "#projects",
            image: resolveImageUrl(h.image_url) || "https://smart-redesign-essence.lovable.app/assets/hero-network-D4naFa_1.jpg",
            floatingTag: h.floating_tag || "Live research",
            floatingText: h.floating_text || "National Logistics Digital Twin — modelling freight flows across India."
          }));
          setSlides(apiSlides);
        }

        if (statsRes.data && statsRes.data.length > 0) {
          setStats(statsRes.data);
        }

        if (areasRes.data && areasRes.data.length > 0) {
          setResearchAreas(areasRes.data);
        }

        if (projectsRes.data && projectsRes.data.length > 0) {
          setProjects(projectsRes.data.map(p => ({
            title: p.title,
            description: p.description,
            label: p.research_area_name || 'Featured',
            image_url: resolveImageUrl(p.image_url)
          })));
        }

        if (eventsRes.data && eventsRes.data.length > 0) {
          setEvents(eventsRes.data.map(e => {
            const dateObj = new Date(e.start_date);
            const dateString = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            return {
              date: dateString,
              title: e.title,
              desc: e.description,
              image_url: resolveImageUrl(e.image_url)
            };
          }));
        }
      } catch (err) {
        // Fall back to default arrays
      }
    };
    fetchHomeData();
  }, []);

  const currentSlide = slides[activeSlide] || defaultSlides[0];

  const renderAreaIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'brain': return <BrainIcon />;
      case 'plane': return <PlaneIcon />;
      case 'trendingup': return <TrendingUpIcon />;
      case 'building': return <BuildingIcon />;
      case 'heart': return <HeartIcon />;
      case 'leaf': return <LeafIcon />;
      case 'monitor': return <MonitorIcon />;
      default: return <BrainIcon />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 left-1/2 size-[700px] -translate-x-1/2 rounded-full bg-[var(--primary-soft)] opacity-60 blur-3xl"></div>
          </div>
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
            <div key={activeSlide} className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                <span className="size-1.5 rounded-full bg-accent"></span>
                {currentSlide.tag}
              </div>
              <h1 className="mt-6 text-5xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                {renderTitle(currentSlide.title, currentSlide.titleHighlight)}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {currentSlide.description}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                {currentSlide.ctaPrimaryLink?.startsWith('#') ? (
                  <a href={currentSlide.ctaPrimaryLink} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5">
                    {currentSlide.ctaPrimaryText}
                    <ArrowIcon />
                  </a>
                ) : (
                  <Link to={currentSlide.ctaPrimaryLink || '/'} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5">
                    {currentSlide.ctaPrimaryText}
                    <ArrowIcon />
                  </Link>
                )}

                {currentSlide.ctaSecondaryLink?.startsWith('#') ? (
                  <a href={currentSlide.ctaSecondaryLink} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                    {currentSlide.ctaSecondaryText}
                  </a>
                ) : (
                  <Link to={currentSlide.ctaSecondaryLink || '/'} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                    {currentSlide.ctaSecondaryText}
                  </Link>
                )}
              </div>

              <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
                <div>
                  <div className="font-display text-3xl font-semibold text-primary">30+</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Faculty</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold text-primary">50+</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Projects</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold text-primary">3.5K+</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Talent</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-[var(--primary-soft)] via-transparent to-[var(--accent-soft)] blur-2xl"></div>
              <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-lift)]">
                {slides.map((slide, idx) => (
                  <img
                    key={idx}
                    src={slide.image}
                    alt=""
                    width="1600"
                    height="1280"
                    className={"absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 " + (activeSlide === idx ? "opacity-100" : "opacity-0")}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-4">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={"Go to slide " + (idx + 1)}
                      className={"h-1.5 rounded-full transition-all " + (activeSlide === idx ? "w-8 bg-white" : "w-2 bg-white/50")}
                    ></button>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden w-64 rounded-2xl border border-border bg-card/95 p-5 shadow-[var(--shadow-lift)] backdrop-blur-md md:block">
                <div key={activeSlide} className="animate-fade-in-up">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles size-3.5" aria-hidden="true">
                      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                      <path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle>
                    </svg>
                    {currentSlide.floatingTag}
                  </div>
                  <p className="mt-2 text-sm font-medium leading-snug text-foreground">
                    {currentSlide.floatingText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section id="mission" className="border-t border-border bg-surface py-24">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  <span className="size-1.5 rounded-full bg-accent"></span>Our Mission
                </div>
                <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">A centre built for the problems that matter.</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical size-5" aria-hidden="true">
                      <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path>
                      <path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path>
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">World-class research</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Publish frontier research in supply chain science, optimisation, AI, and operations.</p>
                </div>
                <div className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 size-5" aria-hidden="true">
                      <path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">Industry impact</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Translate research into deployable systems that move goods, people, and economies.</p>
                </div>
                <div className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap size-5" aria-hidden="true">
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                      <path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">Talent for the world</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Train the next generation of engineers, scientists, and supply chain leaders.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section id="vision" className="relative overflow-hidden py-24">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-primary text-primary-foreground">
              <img src="https://smart-redesign-essence.lovable.app/assets/vision-lab-DhvVcMX0.jpg" alt="Researchers at the SMART Center lab" width="1920" height="1080" loading="lazy" className="absolute inset-0 size-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/85 to-primary/40"></div>
              <div className="relative grid gap-10 p-6 sm:p-16 lg:grid-cols-[1.2fr_1fr] lg:p-20">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]">
                    <span className="size-1.5 rounded-full bg-accent"></span> Our Vision
                  </div>
                  <h2 className="mt-6 text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">To be the world’s most trusted research centre for supply chain intelligence.</h2>
                </div>
                <p className="self-end text-lg leading-relaxed text-white/80">We bring together engineers, data scientists, behavioural researchers, and industry practitioners to design supply chains that are faster, fairer, and more sustainable — and to share what we learn openly with the world.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Milestones */}
        <section className="border-y border-border bg-surface py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  <span className="size-1.5 rounded-full bg-accent"></span>Milestones
                </div>
                <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">Built in the open. Measured in impact.</h2>
              </div>
              <p className="max-w-md text-muted-foreground">A snapshot of what the SMART Center community has accomplished together.</p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3 lg:grid-cols-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-card p-6 sm:p-8">
                  <div className="font-display text-4xl sm:text-5xl font-semibold text-primary">{stat.value}{stat.suffix}</div>
                  <div className="mt-3 text-sm leading-snug text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Research Areas */}
        <section id="research" className="py-28">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                <span className="size-1.5 rounded-full bg-accent"></span>Research Areas
              </div>
              <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">Research that moves industry forward.</h2>
              <p className="mt-5 text-lg text-muted-foreground">Each area pairs rigorous methodology with deployment-grade engineering, in partnership with FedEx and industry collaborators.</p>
            </div>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {researchAreas.map((area, idx) => (
                <div
                  key={idx}
                  className={"group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)] " +
                    (idx === 0 ? "lg:row-span-2 lg:bg-gradient-to-br lg:from-[var(--primary-soft)] lg:to-card" : "")}
                >
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-accent">
                    {renderAreaIcon(area.icon)}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{area.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.description}</p>
                  <ArrowIcon />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="bg-surface py-28">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  <span className="size-1.5 rounded-full bg-accent"></span>Research Projects
                </div>
                <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">From theory to deployed systems.</h2>
              </div>
              <Link to="/research" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                View all projects <ArrowIcon />
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Primary Featured project */}
              {projects[0] && (
                <article className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 transition-shadow hover:shadow-[var(--shadow-lift)]">
                  <div className="absolute inset-x-0 top-0 h-1 bg-[var(--gradient-brand)]"></div>
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                    {projects[0].label}
                  </span>
                  <h3 className="mt-5 text-3xl font-medium tracking-tight">{projects[0].title}</h3>
                  <p className="mt-4 max-w-md text-muted-foreground">{projects[0].description}</p>
                  <Link to="/research" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Read case study <ArrowIcon />
                  </Link>
                </article>
              )}

              <div className="grid gap-6">
                {projects.slice(1, 4).map((project, idx) => (
                  <article key={idx} className="group rounded-3xl border border-border bg-card p-6 sm:p-8 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
                        {project.label}
                      </span>
                      <ArrowIcon />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight">{project.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Events */}
        <section id="events" className="py-28">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  <span className="size-1.5 rounded-full bg-accent"></span>Events &amp; Activities
                </div>
                <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">Where research meets practice.</h2>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2"></div>
              <div className="space-y-10">
                {events.map((event, idx) => (
                  <div
                    key={idx}
                    className={`relative grid items-start gap-6 md:grid-cols-2 ${idx % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
                  >
                    <div className="absolute left-4 top-3 size-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background md:left-1/2"></div>
                    <div className={`pl-10 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                      <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent">
                        <CalendarIcon /> {event.date}
                      </div>
                      <h3 className="mt-2 text-2xl font-medium tracking-tight">{event.title}</h3>
                    </div>
                    <div className={`pl-10 md:pl-0 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                      <p className="text-muted-foreground">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Internships */}
        <section id="talent" className="bg-surface py-28">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                <span className="size-1.5 rounded-full bg-accent"></span>Internship &amp; Talent
              </div>
              <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">Train where the work happens.</h2>
              <p className="mt-5 text-lg text-muted-foreground">Students and early-career researchers join SMART for hands-on projects with faculty mentors and FedEx partners — building real systems that ship to the world.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)]">Apply for internship</a>
                <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium">Programme details</Link>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-7">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users size-6 text-accent" aria-hidden="true">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle>
                </svg>
                <div className="mt-6 font-display text-4xl font-semibold text-primary">1,500+</div>
                <div className="mt-1 text-sm text-muted-foreground">Internship applications</div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-7">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap size-6 text-accent" aria-hidden="true">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                  <path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                </svg>
                <div className="mt-6 font-display text-4xl font-semibold text-primary">3,500+</div>
                <div className="mt-1 text-sm text-muted-foreground">Talent outreach</div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-7">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical size-6 text-accent" aria-hidden="true">
                  <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path>
                  <path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path>
                </svg>
                <div className="mt-6 font-display text-4xl font-semibold text-primary">50+</div>
                <div className="mt-1 text-sm text-muted-foreground">Active researchers</div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-7">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 size-6 text-accent" aria-hidden="true">
                  <path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                  <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                  <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                </svg>
                <div className="mt-6 font-display text-4xl font-semibold text-primary">30+</div>
                <div className="mt-1 text-sm text-muted-foreground">Faculty mentors</div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section id="partners" className="py-24">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                <span className="size-1.5 rounded-full bg-accent"></span>Industry Collaborations
              </div>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">In partnership with the institutions building the future.</h2>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-4">
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">FedEx</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">IIT Madras</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">Govt. of India</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">DST</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">NITI Aayog</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">CII</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">NASSCOM</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">World Bank</div>
            </div>
          </div>
        </section>

        {/* Startups */}
        <section className="py-28">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 sm:p-16">
              <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[var(--accent-soft)] blur-3xl"></div>
              <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-[var(--primary-soft)] blur-3xl"></div>
              <div className="relative grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    <span className="size-1.5 rounded-full bg-accent"></span>Startup &amp; Innovation Ecosystem
                  </div>
                  <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">An incubator for the next generation of supply chain companies.</h2>
                  <p className="mt-5 max-w-xl text-lg text-muted-foreground">Through IIT Madras’ deep-tech incubation network, SMART supports founders building category-defining ventures in logistics, AI, robotics, and sustainability.</p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur">
                    <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket size-5" aria-hidden="true">
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"></path>
                        <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"></path>
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"></path>
                      </svg>
                    </div>
                    <h3 className="mt-4 font-semibold tracking-tight">Incubation</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Funding, mentorship, and infrastructure to take research to market.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur">
                    <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles size-5" aria-hidden="true">
                        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                        <path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle>
                      </svg>
                    </div>
                    <h3 className="mt-4 font-semibold tracking-tight">Open innovation</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Industry challenges, hackathons, and pilots with global partners.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="border-t border-border bg-surface py-24">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                <span className="size-1.5 rounded-full bg-accent"></span>Get in Touch
              </div>
              <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">Let’s build the next decade of supply chain research, together.</h2>
              <p className="mt-5 max-w-xl text-muted-foreground">Whether you are a researcher, student, industry partner, or policymaker — we’d love to hear from you.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5">
                Contact the Center <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={
          "fixed bottom-8 right-8 z-50 inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-all hover:-translate-y-0.5 " +
          (showBackToTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none")
        }
      >
        <ArrowUpIcon />
      </button>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../services/api';
import NewsPopup from '../components/common/NewsPopup';

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
    image: resolveImageUrl("/uploads/hero_supply_chain.png") || "/uploads/hero_supply_chain.png",
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
    image: resolveImageUrl("/uploads/hero_freight_network.png") || "/uploads/hero_freight_network.png",
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
    image: resolveImageUrl("/uploads/hero_predictive_intelligence.png") || "/uploads/hero_predictive_intelligence.png",
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
    image: resolveImageUrl("/uploads/hero_autonomous_delivery.png") || "/uploads/hero_autonomous_delivery.png",
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
  { title: 'Worker Wellness', description: 'Human-centered research on ergonomics, safety, and frontline workforce wellbeing.', icon: 'Heart' },
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
  { id: 1, slug: 'annual-symposium', date: 'Oct 2026', title: 'SMART Annual Research Symposium', desc: 'A two-day convening of academia, industry, and policy on the future of supply chains.', event_type: 'Seminar', location: 'IIT Madras' },
  { id: 2, slug: 'industry-roundtable', date: 'Aug 2026', title: 'Industry Roundtable — Resilient Logistics', desc: 'Closed-door dialogue with global supply chain leaders and IIT Madras researchers.', event_type: 'Roundtable', location: 'Online' },
  { id: 3, slug: 'summer-school', date: 'Jun 2026', title: 'SMART Summer School', desc: 'Intensive programme for graduate students on optimisation, ML, and operations research.', event_type: 'Workshop', location: 'IIT Madras' },
  { id: 4, slug: 'innovation-day', date: 'Mar 2026', title: 'FedEx × IIT Madras Innovation Day', desc: 'Showcase of student innovation, demos, and pitches from across the center.', event_type: 'Hackathon', location: 'NAC Hall, IIT Madras' },
];

const renderTitle = (title, highlight) => {
  if (!title || !highlight) return title;
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
            image: resolveImageUrl(h.image_url) || resolveImageUrl("/uploads/hero_supply_chain.png"),
            floatingTag: h.floating_tag || "Live research",
            floatingText: h.floating_text || "National Logistics Digital Twin — modelling freight flows across India."
          }));
          setSlides(apiSlides);
        }

        if (Array.isArray(statsRes.data) && statsRes.data.length > 0) {
          setStats(statsRes.data);
        }

        if (Array.isArray(areasRes.data) && areasRes.data.length > 0) {
          setResearchAreas(areasRes.data);
        }

        if (Array.isArray(projectsRes.data) && projectsRes.data.length > 0) {
          setProjects(projectsRes.data.map(p => ({
            title: p.title,
            description: p.description,
            label: p.research_area_name || 'Featured',
            image_url: resolveImageUrl(p.image_url)
          })));
        }

        if (Array.isArray(eventsRes.data) && eventsRes.data.length > 0) {
          setEvents(eventsRes.data.map(e => {
            const dateObj = e.start_date ? new Date(e.start_date) : (e.event_date ? new Date(e.event_date) : null);
            let dateString = '';
            if (dateObj && !isNaN(dateObj.getTime())) {
              dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
            return {
              id: e.id,
              slug: e.slug || `event-${e.id}`,
              date: dateString || e.event_date || '',
              title: e.title,
              desc: e.description,
              image_url: resolveImageUrl(e.image_url),
              event_type: e.event_type || 'Event',
              location: e.location,
              time: e.time,
              speaker_name: e.speaker_name,
              speaker_designation: e.speaker_designation,
              speaker_image: resolveImageUrl(e.speaker_image)
            };
          }));
        }
      } catch (err) {
        // Fall back to default arrays
        console.error('Failed to load homepage data from API:', err);
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
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 2xl:gap-24 lg:py-28 3xl:py-36">
            <div key={activeSlide} className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                <span className="size-1.5 rounded-full bg-accent"></span>
                {currentSlide.tag}
              </div>
              <h1 className="mt-6 text-5xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-6xl lg:text-7xl 2xl:text-8xl">
                {renderTitle(currentSlide.title, currentSlide.titleHighlight)}
              </h1>
              <p className="mt-6 max-w-xl 2xl:max-w-2xl text-lg 2xl:text-xl leading-relaxed text-muted-foreground">
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
        <section id="mission" className="border-t border-border bg-surface py-24 2xl:py-32">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
              <div>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                  <span className="size-2 rounded-full bg-accent"></span>Our Mission
                </div>
                <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl 2xl:text-6xl">A center built for the problems that matter.</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="group rounded-2xl border border-border bg-card p-7 2xl:p-9 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical size-5" aria-hidden="true">
                      <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path>
                      <path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path>
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg 2xl:text-xl font-semibold tracking-tight">World-class research</h3>
                  <p className="mt-2 text-sm 2xl:text-base leading-relaxed text-muted-foreground">Publish frontier research in supply chain science, optimisation, AI, and operations.</p>
                </div>
                <div className="group rounded-2xl border border-border bg-card p-7 2xl:p-9 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 size-5" aria-hidden="true">
                      <path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg 2xl:text-xl font-semibold tracking-tight">Industry impact</h3>
                  <p className="mt-2 text-sm 2xl:text-base leading-relaxed text-muted-foreground">Translate research into deployable systems that move goods, people, and economies.</p>
                </div>
                <div className="group rounded-2xl border border-border bg-card p-7 2xl:p-9 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap size-5" aria-hidden="true">
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                      <path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg 2xl:text-xl font-semibold tracking-tight">Talent for the world</h3>
                  <p className="mt-2 text-sm 2xl:text-base leading-relaxed text-muted-foreground">Train the next generation of engineers, scientists, and supply chain leaders.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section id="vision" className="relative overflow-hidden py-24 2xl:py-32">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-primary text-primary-foreground">
              <img src="/vision-bg.png" alt="Supply Chain Intelligence Network Vision" width="1920" height="1080" loading="lazy" className="absolute inset-0 size-full object-cover opacity-45 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3b1275]/90 via-[#4a1d96]/80 to-[#2e0a6b]/70"></div>
              <div className="relative grid gap-10 p-6 sm:p-16 lg:grid-cols-[1.2fr_1fr] lg:p-20 2xl:p-24">
                <div>
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-white shadow-sm">
                    <span className="size-2 rounded-full bg-accent"></span>Our Vision
                  </div>
                  <h2 className="mt-6 text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl 2xl:text-7xl">To be the world’s most trusted research center for supply chain intelligence.</h2>
                </div>
                <p className="self-end text-lg 2xl:text-xl leading-relaxed text-white/80">We bring together engineers, data scientists, behavioural researchers, and industry practitioners to design supply chains that are faster, fairer, and more sustainable — and to share what we learn openly with the world.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Milestones */}
        <section className="border-y border-border bg-surface py-20 2xl:py-28">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                  <span className="size-2 rounded-full bg-accent"></span>Milestones
                </div>
                <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl 2xl:text-6xl">Built in the open. Measured in impact.</h2>
              </div>
              <p className="max-w-md 2xl:max-w-lg text-muted-foreground 2xl:text-lg">A snapshot of what the SMART Center community has accomplished together.</p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3 lg:grid-cols-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-card p-6 sm:p-8 2xl:p-10">
                  <div className="font-display text-4xl sm:text-5xl 2xl:text-6xl font-semibold text-primary">{stat.value}{stat.suffix}</div>
                  <div className="mt-3 text-sm 2xl:text-base leading-snug text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Research Areas */}
        <section id="research" className="py-28 2xl:py-36">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="mx-auto max-w-3xl 2xl:max-w-4xl text-center">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                <span className="size-2 rounded-full bg-accent"></span>Research Areas
              </div>
              <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl 2xl:text-6xl">Research that moves industry forward.</h2>
              <p className="mt-5 text-lg 2xl:text-xl text-muted-foreground">Each area pairs rigorous methodology with deployment-grade engineering, in partnership with FedEx and industry collaborators.</p>
            </div>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {researchAreas.map((area, idx) => (
                <div
                  key={idx}
                  className={"group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)] " +
                    (idx === 0 ? "lg:row-span-2 2xl:row-span-1 lg:bg-gradient-to-br lg:from-[var(--primary-soft)] lg:to-card" : "")}
                >
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-accent">
                    {renderAreaIcon(area.icon)}
                  </div>
                  <h3 className="mt-6 text-xl 2xl:text-2xl font-semibold tracking-tight">{area.title}</h3>
                  <p className="mt-3 text-sm 2xl:text-base leading-relaxed text-muted-foreground">{area.description}</p>
                  <ArrowIcon />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="bg-surface py-28 2xl:py-36">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                  <span className="size-2 rounded-full bg-accent"></span>Research Projects
                </div>
                <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl 2xl:text-6xl">From theory to deployed systems.</h2>
              </div>
              <Link to="/research" className="inline-flex items-center gap-2 text-sm 2xl:text-base font-medium text-primary hover:underline">
                View all projects <ArrowIcon />
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Primary Featured project */}
              {projects[0] && (
                <article className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 2xl:p-12 transition-shadow hover:shadow-[var(--shadow-lift)]">
                  <div className="absolute inset-x-0 top-0 h-1 bg-[var(--gradient-brand)]"></div>
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                    {projects[0].label}
                  </span>
                  <h3 className="mt-5 text-3xl 2xl:text-4xl font-medium tracking-tight">{projects[0].title}</h3>
                  <p className="mt-4 max-w-md 2xl:max-w-xl text-muted-foreground 2xl:text-lg">{projects[0].description}</p>
                  <Link to="/research" className="mt-8 inline-flex items-center gap-2 text-sm 2xl:text-base font-medium text-primary">
                    Read case study <ArrowIcon />
                  </Link>
                </article>
              )}

              <div className="grid gap-6">
                {projects.slice(1, 4).map((project, idx) => (
                  <article key={idx} className="group rounded-3xl border border-border bg-card p-6 sm:p-8 2xl:p-10 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
                        {project.label}
                      </span>
                      <ArrowIcon />
                    </div>
                    <h3 className="mt-4 text-xl 2xl:text-2xl font-semibold tracking-tight">{project.title}</h3>
                    <p className="mt-2 text-sm 2xl:text-base leading-relaxed text-muted-foreground">{project.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events & Activities */}
        <section id="events" className="py-24 2xl:py-32 bg-surface/50 border-y border-border/60">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                  <span className="size-2 rounded-full bg-accent"></span>Events &amp; Activities
                </div>
                <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl 2xl:text-6xl">Where research meets practice.</h2>
                <p className="mt-3 text-base 2xl:text-lg text-muted-foreground max-w-2xl">
                  Engaging seminars, industry bootcamps, workshops, and innovation summits hosted by the IIT Madras FedEx SMART Center.
                </p>
              </div>
              <Link to="/events" className="inline-flex items-center gap-2 text-sm 2xl:text-base font-semibold text-primary hover:underline shrink-0 group">
                View all events <ArrowIcon />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
              {events.slice(0, 4).map((event, idx) => {
                const hasSpeaker = Boolean(event.speaker_name || event.speaker_image || event.speaker_designation);
                return (
                  <Link
                    key={event.id || idx}
                    to={`/events/${event.slug || event.id}`}
                    className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[var(--shadow-lift)]"
                  >
                    {/* Top Container: Speaker Profile or Event Image */}
                    <div className={`relative w-full ${hasSpeaker ? 'min-h-[185px]' : 'aspect-[16/11]'} shrink-0 overflow-hidden bg-gradient-to-br from-[#180733] via-[#2c1356] to-[#0a0318] flex flex-col justify-end p-4 sm:p-5 border-b border-border`}>
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

                    {/* Card Body */}
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
                        <h3 className="text-lg 2xl:text-xl font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.25rem]">
                          {event.title}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                          {event.desc}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-5 pt-4 border-t border-border flex flex-col gap-1.5 text-xs text-muted-foreground font-medium">
                        {event.date && (
                          <div className="inline-flex items-center gap-1.5 truncate text-foreground/80 font-semibold">
                            <CalendarIcon /> {event.date}
                          </div>
                        )}
                        {event.location && (
                          <div className="inline-flex items-center gap-1.5 truncate">
                            <MapPinIcon /> {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Internships */}
        <section id="talent" className="bg-surface py-28 2xl:py-36">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                <span className="size-2 rounded-full bg-accent"></span>Internship &amp; Talent
              </div>
              <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl 2xl:text-6xl">Train where the work happens.</h2>
              <p className="mt-5 text-lg 2xl:text-xl text-muted-foreground">Students and early-career researchers join SMART for hands-on projects with faculty mentors and FedEx partners — building real systems that ship to the world.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm 2xl:text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)]">Apply for internship</a>
                <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm 2xl:text-base font-medium">Programme details</Link>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-7 2xl:p-9">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users size-6 text-accent" aria-hidden="true">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle>
                </svg>
                <div className="mt-6 font-display text-4xl 2xl:text-5xl font-semibold text-primary">1,500+</div>
                <div className="mt-1 text-sm 2xl:text-base text-muted-foreground">Internship applications</div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-7 2xl:p-9">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap size-6 text-accent" aria-hidden="true">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                  <path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                </svg>
                <div className="mt-6 font-display text-4xl 2xl:text-5xl font-semibold text-primary">3,500+</div>
                <div className="mt-1 text-sm 2xl:text-base text-muted-foreground">Talent outreach</div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-7 2xl:p-9">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical size-6 text-accent" aria-hidden="true">
                  <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path>
                  <path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path>
                </svg>
                <div className="mt-6 font-display text-4xl 2xl:text-5xl font-semibold text-primary">50+</div>
                <div className="mt-1 text-sm 2xl:text-base text-muted-foreground">Active researchers</div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-7 2xl:p-9">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 size-6 text-accent" aria-hidden="true">
                  <path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                  <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                  <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                </svg>
                <div className="mt-6 font-display text-4xl 2xl:text-5xl font-semibold text-primary">30+</div>
                <div className="mt-1 text-sm 2xl:text-base text-muted-foreground">Faculty mentors</div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section id="partners" className="py-24 2xl:py-32">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                <span className="size-2 rounded-full bg-accent"></span>Industry Collaborations
              </div>
              <h2 className="mx-auto mt-5 max-w-2xl 2xl:max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl 2xl:text-5xl">In partnership with the institutions building the future.</h2>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-4 2xl:grid-cols-8">
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg 2xl:text-xl font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">FedEx</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg 2xl:text-xl font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">IIT Madras</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg 2xl:text-xl font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">Govt. of India</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg 2xl:text-xl font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">DST</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg 2xl:text-xl font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">NITI Aayog</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg 2xl:text-xl font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">CII</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg 2xl:text-xl font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">NASSCOM</div>
              <div className="flex h-24 items-center justify-center bg-card font-display text-lg 2xl:text-xl font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary">World Bank</div>
            </div>
          </div>
        </section>

        {/* Startups */}
        <section className="py-28 2xl:py-36">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 sm:p-16 2xl:p-20">
              <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[var(--accent-soft)] blur-3xl"></div>
              <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-[var(--primary-soft)] blur-3xl"></div>
              <div className="relative grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                    <span className="size-2 rounded-full bg-accent"></span>Startup &amp; Innovation Ecosystem
                  </div>
                  <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl 2xl:text-6xl">An incubator for the next generation of supply chain companies.</h2>
                  <p className="mt-5 max-w-xl 2xl:max-w-2xl text-lg 2xl:text-xl text-muted-foreground">Through IIT Madras’ deep-tech incubation network, SMART supports founders building category-defining ventures in logistics, AI, robotics, and sustainability.</p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-border bg-card/80 p-6 2xl:p-8 backdrop-blur">
                    <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket size-5" aria-hidden="true">
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"></path>
                        <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"></path>
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"></path>
                      </svg>
                    </div>
                    <h3 className="mt-4 font-semibold tracking-tight 2xl:text-lg">Incubation</h3>
                    <p className="mt-1 text-sm 2xl:text-base text-muted-foreground">Funding, mentorship, and infrastructure to take research to market.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card/80 p-6 2xl:p-8 backdrop-blur">
                    <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles size-5" aria-hidden="true">
                        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                        <path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle>
                      </svg>
                    </div>
                    <h3 className="mt-4 font-semibold tracking-tight 2xl:text-lg">Open innovation</h3>
                    <p className="mt-1 text-sm 2xl:text-base text-muted-foreground">Industry challenges, hackathons, and pilots with global partners.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="border-t border-border bg-surface py-24 2xl:py-32">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                <span className="size-2 rounded-full bg-accent"></span>Get in Touch
              </div>
              <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl 2xl:text-6xl">Let’s build the next decade of supply chain research, together.</h2>
              <p className="mt-5 max-w-xl 2xl:max-w-2xl text-muted-foreground 2xl:text-lg">Whether you are a researcher, student, industry partner, or policymaker — we’d love to hear from you.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm 2xl:text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5">
                Contact the Center <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <NewsPopup />

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

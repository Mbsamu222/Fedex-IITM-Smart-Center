import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../../services/api';

const FlaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical absolute right-4 top-4 size-5 text-foreground/40" aria-hidden="true">
    <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path>
    <path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail size-4" aria-hidden="true">
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
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

const defaultScholars = [
  { name: 'Dr. Anish Monsley', area: 'Tech Simplification using Agentic AI', initials: 'AM' },
  { name: 'Dr. Datta Prasad M R', area: 'Worker Wellness', initials: 'DP' },
  { name: 'Akash Kale', area: '3D Bin Packing & ULD Optimization', initials: 'AK' },
  { name: 'Dr. Deepak Bajhaiya', area: 'Worker Wellness', initials: 'DB' },
  { name: 'Dr. Wilfred Kisku', area: 'Worker Wellness', initials: 'WK' },
  { name: 'Deepthi Ramesh', area: 'Making India a Global Transshipment Hub', initials: 'DR' },
  { name: 'Manojshyaam CJ', area: 'Vision-based Monitoring of Warehouse Worker Safety & Performance', initials: 'MC' },
  { name: 'Omkar Nishad', area: 'Customizable Granularity in Demand and Capacity Planning', initials: 'ON' },
  { name: 'Utsav Bharadwaj', area: 'Customer Email Analysis', initials: 'UB' },
  { name: 'Pranesh Kannan', area: 'Tech Simplification using Agentic AI', initials: 'PK' },
  { name: 'Alan Alex Mathew', area: 'Customer Email Analysis', initials: 'AA' },
  { name: 'Rakesh Madampath', area: 'Worker Wellness', initials: 'RM' },
  { name: 'Kabilan AR', area: 'Virtual Simulation of Warehouse Operations', initials: 'KA' },
  { name: 'Abulaman S', area: 'FedEx Daily Media Monitoring', initials: 'AS' },
  { name: 'S Manish', area: 'FedEx Daily Media Monitoring', initials: 'SM' },
];

const defaultPostdocs = [
  { name: 'Dr. Brintha R', area: 'Closing the sustainability credibility gap in Indian agri-food supply chain', initials: 'BR' },
  { name: 'Dr. Adnan Pasha', area: 'Making India a Global Transshipment Hub', initials: 'AP' },
  { name: 'Dr. Bhumika', area: 'Feedstock-Biomass Aviation Turbine Fuel Supply Chain', initials: 'B' },
];

function getInitials(name) {
  if (!name) return 'TM';
  return name.replace('Dr. ', '').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

export default function TeamResearchersPage() {
  const [scholars, setScholars] = useState(defaultScholars);
  const [postdocs, setPostdocs] = useState(defaultPostdocs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const [scholarsRes, postdocsRes] = await Promise.all([
          publicApi.getTeam('research'), // mapped as category = 'research'
          publicApi.getTeam('postdoc') // mapped as category = 'postdoc'
        ]);
        if (Array.isArray(scholarsRes.data) && scholarsRes.data.length > 0) {
          setScholars(scholarsRes.data.map(m => ({ ...m, image_url: resolveImageUrl(m.image_url), initials: getInitials(m.name), area: m.bio || m.title })));
        }
        if (Array.isArray(postdocsRes.data) && postdocsRes.data.length > 0) {
          setPostdocs(postdocsRes.data.map(m => ({ ...m, image_url: resolveImageUrl(m.image_url), initials: getInitials(m.name), area: m.bio || m.title })));
        }
      } catch (err) {
        console.error('Failed to load team data from API:', err);
        // Fall back to default
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

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
              <span className="size-1.5 rounded-full bg-accent"></span>Our Team
            </div>
            <h1 className="mt-6 max-w-3xl 2xl:max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl 2xl:text-7xl">Research Team</h1>
            <p className="mt-6 max-w-2xl 2xl:max-w-3xl text-lg 2xl:text-xl leading-relaxed text-muted-foreground">Researchers and postdoctoral fellows turning ideas into deployable systems.</p>
          </div>
        </section>

        <section className="py-20 2xl:py-28">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <h2 className="text-2xl 2xl:text-3xl font-medium tracking-tight">Research Scholars</h2>
            {loading ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 rounded-3xl border border-border bg-card animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {scholars.map((member, idx) => (
                  <article key={member.id || idx} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                    <div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]}`}>
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="absolute inset-0 h-full w-full object-cover object-center" />
                      ) : (
                        <div className="flex size-24 items-center justify-center rounded-full bg-card/80 font-display text-3xl font-semibold text-accent shadow-[var(--shadow-soft)] backdrop-blur">
                          {member.initials}
                        </div>
                      )}
                      <FlaskIcon />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
                      <p className="mt-3 text-sm text-muted-foreground">{member.area}</p>
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-medium text-primary hover:underline">
                          <MailIcon /> {member.email}
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <h2 className="mt-20 text-2xl font-medium tracking-tight">Postdoctoral Researchers</h2>
            {loading ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 rounded-3xl border border-border bg-card animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {postdocs.map((member, idx) => (
                  <article key={member.id || idx} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                    <div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${gradientPairs[(idx + 4) % gradientPairs.length]}`}>
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="absolute inset-0 h-full w-full object-cover object-center" />
                      ) : (
                        <div className="flex size-24 items-center justify-center rounded-full bg-card/80 font-display text-3xl font-semibold text-accent shadow-[var(--shadow-soft)] backdrop-blur">
                          {member.initials}
                        </div>
                      )}
                      <FlaskIcon />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
                      <p className="mt-3 text-sm text-muted-foreground">{member.area}</p>
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-medium text-primary hover:underline">
                          <MailIcon /> {member.email}
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

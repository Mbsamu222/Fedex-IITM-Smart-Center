import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../../services/api';

const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown absolute right-4 top-4 size-5 text-foreground/40" aria-hidden="true">
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
    <path d="M5 21h14"></path>
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 absolute right-4 top-4 size-5 text-foreground/40" aria-hidden="true">
    <path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
    <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
    <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
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

const defaultAdvisory = [
  { name: 'Prof. V. Kamakoti', title: 'Director, IIT Madras', dept: 'IIT Madras', initials: 'VK' },
  { name: 'Kami Viswanathan', title: 'President, FedEx MEISA', dept: 'FedEx', initials: 'KV' },
  { name: 'Prof. R. Nagarajan', title: 'Dean, ICSR, IIT Madras', dept: 'IIT Madras', initials: 'RN' },
  { name: 'Prof. Devendra Jalihal', title: 'Dean, Planning, IIT Madras', dept: 'IIT Madras', initials: 'DJ' },
  { name: 'Suvendu Choudhury', title: 'VP Operations, FedEx India', dept: 'FedEx', initials: 'SC' },
  { name: 'Mohammed Sayeed', title: 'MD, FedEx Express TSCS India', dept: 'FedEx', initials: 'MS' },
];

const defaultExecutive = [
  { name: 'Prof. Arshinder Kaur', title: 'Center Head, IIT Madras', initials: 'AK' },
  { name: 'Prof. B. Ravindran', title: 'Co-Head, IIT Madras', initials: 'BR' },
  { name: 'Prof. Gitakrishnan Ramadurai', title: 'Co-Head, IIT Madras', initials: 'GR' },
  { name: 'Prof. Rajagopalan Srinivasan', title: 'Co-Head, IIT Madras', initials: 'RS' },
  { name: 'Mohammed Sayeed', title: 'Executive Sponsor, FedEx', initials: 'MS' },
  { name: 'Suvendu Choudhury', title: 'Executive Sponsor, FedEx', initials: 'SC' },
];

function getInitials(name) {
  if (!name) return 'TM';
  return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

export default function TeamAdvisoryPage() {
  const [advisory, setAdvisory] = useState(defaultAdvisory);
  const [executive, setExecutive] = useState(defaultExecutive);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const [advisoryRes, execRes] = await Promise.all([
          publicApi.getTeam('advisory'),
          publicApi.getTeam('executive')
        ]);
        if (advisoryRes.data && advisoryRes.data.length > 0) {
          setAdvisory(advisoryRes.data.map(m => ({ ...m, image_url: resolveImageUrl(m.image_url), initials: getInitials(m.name), dept: m.department })));
        }
        if (execRes.data && execRes.data.length > 0) {
          setExecutive(execRes.data.map(m => ({ ...m, image_url: resolveImageUrl(m.image_url), initials: getInitials(m.name), dept: m.department })));
        }
      } catch (err) {
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
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Our Team
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Advisory Board &amp; Executive Committee</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Strategic leadership from IIT Madras and FedEx steering the direction of the SMART Center.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            <h2 className="text-2xl font-medium tracking-tight">Advisory Board</h2>
            {loading ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 rounded-3xl border border-border bg-card animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {advisory.map((member, idx) => (
                  <article key={member.id || idx} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                    <div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]}`}>
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="absolute inset-0 h-full w-full object-cover object-center" />
                      ) : (
                        <div className="flex size-24 items-center justify-center rounded-full bg-card/80 font-display text-3xl font-semibold text-primary shadow-[var(--shadow-soft)] backdrop-blur">
                          {member.initials}
                        </div>
                      )}
                      <CrownIcon />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{member.title}</p>
                      {member.dept && <p className="mt-1 text-xs text-muted-foreground/80">{member.dept}</p>}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <h2 className="mt-20 text-2xl font-medium tracking-tight">Executive Committee</h2>
            {loading ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 rounded-3xl border border-border bg-card animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {executive.map((member, idx) => (
                  <article key={member.id || idx} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                    <div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${gradientPairs[(idx + 3) % gradientPairs.length]}`}>
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="absolute inset-0 h-full w-full object-cover object-center" />
                      ) : (
                        <div className="flex size-24 items-center justify-center rounded-full bg-card/80 font-display text-3xl font-semibold text-primary shadow-[var(--shadow-soft)] backdrop-blur">
                          {member.initials}
                        </div>
                      )}
                      <BuildingIcon />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{member.title}</p>
                      {member.dept && <p className="mt-1 text-xs text-muted-foreground/80">{member.dept}</p>}
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

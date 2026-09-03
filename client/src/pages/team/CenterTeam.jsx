import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../../services/api';

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

const defaultCenterTeam = [
  { name: 'Sangeetha Kumar', title: 'Center Manager', initials: 'SK' },
  { name: 'Dhivya R', title: 'Program Manager', initials: 'DR' },
  { name: 'Karthik Subramanian', title: 'Industry Engagement Lead', initials: 'KS' },
  { name: 'Priya Nair', title: 'Research Operations', initials: 'PN' },
  { name: 'Vignesh M', title: 'Communications & Outreach', initials: 'VM' },
  { name: 'Ananya Iyer', title: 'Administrative Officer', initials: 'AI' },
  { name: 'Rohan Mehta', title: 'Events & Partnerships', initials: 'RM' },
  { name: 'Lakshmi Narayanan', title: 'Finance & Compliance', initials: 'LN' },
];

function formatName(name) {
  if (!name) return '';
  return name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)(?=[^\s])/i, '$1 ');
}

function getInitials(name) {
  if (!name) return 'TM';
  const clean = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'TM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TeamCenterPage() {
  const [team, setTeam] = useState(defaultCenterTeam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await publicApi.getTeam('center');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setTeam(res.data.map(m => ({ ...m, image_url: resolveImageUrl(m.image_url), initials: getInitials(m.name) })));
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
            <h1 className="mt-6 max-w-3xl 2xl:max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl 2xl:text-7xl">Center Team</h1>
            <p className="mt-6 max-w-2xl 2xl:max-w-3xl text-lg 2xl:text-xl leading-relaxed text-muted-foreground">The operations team that keeps the SMART Center running every day.</p>
          </div>
        </section>

        <section className="py-20 2xl:py-28">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 rounded-3xl border border-border bg-card animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 items-stretch">
                {team.map((member, idx) => (
                  <article key={member.id || idx} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                    <div className={`relative flex aspect-[4/5] items-center justify-center bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]} overflow-hidden`}>
                      <div className="flex size-24 items-center justify-center rounded-full bg-card/80 font-display text-3xl font-semibold text-primary shadow-[var(--shadow-soft)] backdrop-blur">
                        {member.initials}
                      </div>
                      {member.image_url && (
                        <img 
                          src={member.image_url} 
                          alt={member.name} 
                          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">{formatName(member.name)}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-snug">{member.title}</p>
                      {member.email && (
                        <div className="mt-auto pt-4">
                          <a href={`mailto:${member.email}`} className="inline-flex w-fit items-center gap-2 text-xs font-medium text-primary hover:underline">
                            <MailIcon /> {member.email}
                          </a>
                        </div>
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

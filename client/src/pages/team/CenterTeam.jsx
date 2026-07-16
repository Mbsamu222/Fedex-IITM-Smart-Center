import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../../services/api';

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users absolute right-4 top-4 size-5 text-foreground/40" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle>
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

function getInitials(name) {
  if (!name) return 'TM';
  return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

export default function TeamCenterPage() {
  const [team, setTeam] = useState(defaultCenterTeam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await publicApi.getTeam('center');
        if (res.data && res.data.length > 0) {
          setTeam(res.data.map(m => ({ ...m, image_url: resolveImageUrl(m.image_url), initials: getInitials(m.name) })));
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
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Center Team</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">The operations team that keeps the SMART Center running every day.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 rounded-3xl border border-border bg-card animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {team.map((member, idx) => (
                  <article key={member.id || idx} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                    <div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]}`}>
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="absolute inset-0 h-full w-full object-cover object-center" />
                      ) : (
                        <div className="flex size-24 items-center justify-center rounded-full bg-card/80 font-display text-3xl font-semibold text-primary shadow-[var(--shadow-soft)] backdrop-blur">
                          {member.initials}
                        </div>
                      )}
                      <UsersIcon />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{member.title}</p>
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

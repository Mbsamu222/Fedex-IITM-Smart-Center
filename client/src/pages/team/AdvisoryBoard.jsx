import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../../services/api';

const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown absolute right-4 top-4 size-5 text-foreground/40" aria-hidden="true">
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
    <path d="M5 21h14"></path>
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

const defaultMembers = [
  { name: 'Ms. Kami Viswanathan', title: 'President MEISA, Advisory Board', dept: 'FedEx', initials: 'KV' },
  { name: 'Mr. Nitin Tatiwala', title: 'VP Marketing, Customer Experience & Air Network MEISA, Advisory Board, Executive Committee', dept: 'FedEx', initials: 'NT' },
  { name: 'Dr. Manu Santhanam', title: 'Dean for Industrial Consultancy and Sponsored Research (ICSR), Advisory Board', dept: 'Dept. of Civil Engineering IIT Madras', initials: 'MS' },
  { name: 'Dr. Ashwin Mahalingam', title: 'Dean for Alumni and Corporate Relations, Advisory Board', dept: 'Dept. of Civil Engineering, IIT Madras', initials: 'AM' },
  { name: 'Dr. Arshinder Kaur', title: 'Head, FedEx SMART Center, Advisory Board, Executive Committee', dept: 'Dept. of Management Studies IIT Madras', initials: 'AK' },
  { name: 'Dr. Gitakrishnan Ramadurai', title: 'Co-Head, FedEx SMART Center, Executive Committee', dept: 'Wadhwani School of Data Science and Artificial Intelligence', initials: 'GR' },
  { name: 'Dr. Babji Srinivasan', title: 'Co-Head, FedEx SMART Center, Executive Committee', dept: 'Dept. of Applied Mechanics IIT Madras', initials: 'BS' },
  { name: 'Dr. N S Narayanaswamy', title: 'Co-Head, FedEx SMART Center, Advisory Board, Executive Committee', dept: 'Dept. of Computer Science & Engineering', initials: 'NN' },
  { name: 'Dr. Ashutosh Mahajan', title: 'Professor-in- Charge,FedEx ALFA, Advisory Board, Executive Committee', dept: 'Dept. of Industrial Engineering and Operations Research IIT Bombay', initials: 'AM' },
  { name: 'Mr. Varun Sood', title: 'Lead Government Affairs AMEA, Executive Committee', dept: 'FedEx', initials: 'VS' },
  { name: 'Mr. Digvijay Kharote', title: 'Strategic Development Advisor, Marketing & Air Network MEISA, Executive Committee', dept: 'FedEx', initials: 'DK' },
];

function getInitials(name) {
  if (!name) return 'TM';
  return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

export default function TeamAdvisoryPage() {
  const [members, setMembers] = useState(defaultMembers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const [advisoryRes, execRes] = await Promise.all([
          publicApi.getTeam('advisory'),
          publicApi.getTeam('executive')
        ]);

        const advisoryList = Array.isArray(advisoryRes.data) ? advisoryRes.data : [];
        const execList = Array.isArray(execRes.data) ? execRes.data : [];
        const combinedRaw = [...advisoryList, ...execList];

        if (combinedRaw.length > 0) {
          const seen = new Set();
          const combined = [];
          for (const m of combinedRaw) {
            const key = m.id || m.name;
            if (!seen.has(key)) {
              seen.add(key);
              combined.push({
                ...m,
                image_url: resolveImageUrl(m.image_url),
                initials: getInitials(m.name),
                dept: m.department
              });
            }
          }
          setMembers(combined);
        }
      } catch (err) {
        console.error('Failed to load team data from API:', err);
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
            <h1 className="mt-6 max-w-3xl 2xl:max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl 2xl:text-7xl">Advisory Board &amp; Executive Committee</h1>
            <p className="mt-6 max-w-2xl 2xl:max-w-3xl text-lg 2xl:text-xl leading-relaxed text-muted-foreground">Strategic leadership from IIT Madras and FedEx steering the direction of the SMART Center.</p>
          </div>
        </section>

        <section className="py-16 lg:py-20 2xl:py-28">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-72 rounded-3xl border border-border bg-card animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {members.map((member, idx) => (
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
          </div>
        </section>
      </div>
    </>
  );
}


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../../services/api';

const GradCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap absolute right-4 top-4 size-5 text-foreground/40" aria-hidden="true">
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
    <path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
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

const defaultFaculty = [
  { name: 'Dr. Arshinder Kaur', dept: 'Dept. of Management Studies', category: 'Supply Chain Sustainability and Modelling', initials: 'AK', affiliation: 'IIT Madras' },
  { name: 'Dr. Babji Srinivasan', dept: 'Dept. of Applied Mechanics', category: 'Logistics Worker Wellness', initials: 'BS', affiliation: 'IIT Madras' },
  { name: 'Dr. Gitakrishnan Ramadurai', dept: 'Wadhwani School of Data Science and AI', category: 'Logistics Infrastructure', initials: 'GR', affiliation: 'IIT Madras' },
  { name: 'Dr. S R Chakravarthy', dept: 'Dept. of Aerospace Engineering', category: 'Logistics Infrastructure', initials: 'SR', affiliation: 'IIT Madras' },
  { name: 'Dr. B Ravindran', dept: 'Dept. of Computer Science & Engineering', category: 'Algorithms and Machine Learning', initials: 'BR', affiliation: 'IIT Madras' },
  { name: 'Dr. Rajagopalan Srinivasan', dept: 'Dept. of Chemical Engineering', category: 'Logistics Worker Wellness', initials: 'RS', affiliation: 'IIT Madras' },
  { name: 'Dr. Chandrashekar Lakshminarayanan', dept: 'Dept. of Computer Science & Engineering', category: 'Algorithms & Machine Learning', initials: 'CL', affiliation: 'IIT Madras' },
  { name: 'Dr. R P Sundarraj', dept: 'Dept. of Management Studies', category: 'Supply Chain Sustainability and Modelling', initials: 'RP', affiliation: 'IIT Madras' },
  { name: 'Dr. Nargis Pervin', dept: 'Dept. of Computer Science', category: 'Supply Chain Sustainability and Modelling', initials: 'NP', affiliation: 'IIT Madras' },
  { name: 'Dr. Vaibhav Chawla', dept: 'Dept. of Management Studies', category: 'Supply Chain Sustainability and Modelling', initials: 'VC', affiliation: 'IIT Madras' },
  { name: 'Dr. Usha Mohan', dept: 'Dept. of Civil Engineering', category: 'Supply Chain Sustainability and Modelling', initials: 'UM', affiliation: 'IIT Madras' },
  { name: 'Dr. Rupesh Nasre', dept: 'Dept. of Computer Science & Engineering', category: 'Algorithms & Machine Learning', initials: 'RN', affiliation: 'IIT Madras' },
  { name: 'Dr. Rahul Marathe', dept: 'Dept. of Mechanical Engineering', category: 'Algorithms & Machine Learning', initials: 'RM', affiliation: 'IIT Madras' },
  { name: 'Dr. Anil Prabhakar', dept: 'Dept. of Electrical Engineering', category: 'Algorithms & Machine Learning', initials: 'AP', affiliation: 'IIT Madras' },
  { name: 'Dr. Ayon Chakraborty', dept: 'Dept. of Computer Science and Engineering', category: 'Logistics Infrastructure', initials: 'AC', affiliation: 'IIT Madras' },
  { name: 'Dr. Vipin B', dept: 'Dept. of Management Studies', category: 'Supply Chain Sustainability and Modelling', initials: 'VB', affiliation: 'IIT Madras' },
  { name: 'Dr. Anmol Pahwa', dept: 'Dept. of Civil Engineering', category: 'Logistics Infrastructure', initials: 'AP', affiliation: 'IIT Madras' },
  { name: 'Dr. Neelesh S Upadhye', dept: 'Dept. of Mathematics', category: 'Supply Chain Sustainability and Modelling', initials: 'NS', affiliation: 'IIT Madras' },
  { name: 'Dr. C Rajendran', dept: 'Consultant, IIT Madras', category: 'Supply Chain Sustainability and Modelling', initials: 'CR', affiliation: 'IIT Madras' },
  { name: 'Dr. Prathamesh Vivek Kittur', dept: 'Dept. of Management Studies', category: 'Supply Chain Sustainability and Modelling', initials: 'PV', affiliation: 'IIT Madras' },
];

function getInitials(name) {
  if (!name) return 'TM';
  return name.replace('Dr. ', '').replace('Prof. ', '').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

export default function TeamFacultyPage() {
  const [faculty, setFaculty] = useState(defaultFaculty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await publicApi.getTeam('faculty');
        if (res.data && res.data.length > 0) {
          setFaculty(res.data.map(m => ({ 
            ...m, 
            image_url: resolveImageUrl(m.image_url),
            initials: getInitials(m.name), 
            dept: m.department, 
            affiliation: 'IIT Madras',
            category: m.bio // Note: Schema uses 'bio' or we can map description details
          })));
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
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Faculty Team</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Faculty mentors from across IIT Madras guiding research at the SMART Center.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 ">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-56 rounded-3xl border border-border bg-card animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {faculty.map((member, idx) => (
                  <article key={member.id || idx} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                    <div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${gradientPairs[idx % gradientPairs.length]}`}>
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="absolute inset-0 h-full w-full object-cover object-center" />
                      ) : (
                        <div className="flex size-24 items-center justify-center rounded-full bg-card/80 font-display text-3xl font-semibold text-primary shadow-[var(--shadow-soft)] backdrop-blur">
                          {member.initials}
                        </div>
                      )}
                      <GradCapIcon />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
                      {member.title && (
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                          {member.title}
                        </p>
                      )}
                      {member.role && (
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                          {member.role}
                        </p>
                      )}
                      {member.affiliation && (
                        <p className="mt-2 text-xs text-muted-foreground">{member.affiliation}</p>
                      )}
                      {member.category && (
                        <div className="mt-4 inline-flex w-fit rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-accent">
                          {member.category}
                        </div>
                      )}
                      <p className="mt-auto pt-4 text-sm text-muted-foreground">{member.dept}</p>
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="mt-2 inline-flex w-fit items-center gap-2 text-xs font-medium text-primary hover:underline">
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

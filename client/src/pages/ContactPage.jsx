import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import toast from 'react-hot-toast';

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone size-5" aria-hidden="true">
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
  </svg>
);

const MailIcon = ({ className = "size-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-mail ${className}`} aria-hidden="true">
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin size-5" aria-hidden="true">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link size-3.5" aria-hidden="true">
    <path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
  </svg>
);

// Static fallback contact info
const defaultContactInfo = {
  contact_phone: '044 2257 9668',
  contact_email: 'fedexiitm.admin@imail.iitm.ac.in',
  contact_address: 'NAC 1, Stilt floor, IIT Madras, Chennai, Tamil Nadu 600036',
};

const defaultCenterManagement = [
  { name: 'Ms. Geetha UdayaKumar', role: 'Center Coordinator', email: 'fedexiitm.admin@imail.iitm.ac.in' },
  { name: 'Vara Kalyani Naidu', role: 'Senior Project Manager', email: 'fedexiitm.pm@imail.iitm.ac.in' },
  { name: 'Preethi P Ramaswamy', role: 'Project Manager', email: 'smartcenter.fedexiitm@gmail.com' },
];

const defaultCenterHeads = [
  { name: 'Dr. Arshinder Kaur', dept: 'Dept. of Management Studies', email: 'arshinder@iitm.ac.in' },
  { name: 'Dr. Babji Srinivasan', dept: 'Dept. of Applied Mechanics', email: 'babji.srinivasan.iitm@gmail.com' },
  { name: 'Dr. Gitakrishnan Ramadurai', dept: 'Wadhwani School of Data Science and AI', email: 'gitakrishnan@iitm.ac.in' },
];

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [centerManagement, setCenterManagement] = useState(defaultCenterManagement);
  // Center Heads is a fixed list of 3 and intentionally not sourced from the
  // shared 'faculty' team category (that category also feeds the full Faculty
  // page and can contain many more people).
  const centerHeads = defaultCenterHeads;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchContactAndTeam = async () => {
      try {
        const [contactRes, centerTeamRes] = await Promise.all([
          publicApi.getContact(),
          publicApi.getTeam('center')
        ]);

        if (contactRes.data && Object.keys(contactRes.data).length > 0) {
          setContactInfo(prev => ({ ...prev, ...contactRes.data }));
        }

        if (Array.isArray(centerTeamRes.data) && centerTeamRes.data.length > 0) {
          const excludedNames = ['grason', 'shifa'];
          const filtered = centerTeamRes.data.filter(
            m => !excludedNames.includes((m.name || '').trim().toLowerCase())
          );
          if (filtered.length > 0) {
            setCenterManagement(filtered.map(m => ({
              name: m.name,
              role: m.title || m.role,
              email: m.email
            })));
          }
        }
      } catch (err) {
        console.error('Failed to load contact page data from API:', err);
        // keep defaults
      }
    };
    fetchContactAndTeam();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await publicApi.submitContact(formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 right-1/4 size-[500px] rounded-full bg-[var(--primary-soft)] opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-32 left-10 size-80 rounded-full bg-[var(--accent-soft)] opacity-60 blur-3xl"></div>
          </div>
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 py-20 lg:py-28 2xl:py-36">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Get in Touch
            </div>
            <h1 className="mt-6 max-w-3xl 2xl:max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl 2xl:text-7xl">We're here to help.</h1>
            <p className="mt-6 max-w-2xl 2xl:max-w-3xl text-lg 2xl:text-xl leading-relaxed text-muted-foreground">Have questions about our research, collaborations, student opportunities, or any general inquiries regarding the IIT Madras-led FedEx SMART Center? We're here to assist you.</p>
          </div>
        </section>
        {/* Contact Info */}
        <section className="py-20 2xl:py-28">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Contact Information
            </div>
            <h2 className="mt-5 max-w-2xl 2xl:max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl 2xl:text-5xl">For primary inquiries and official correspondence.</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <a href={`tel:+91${contactInfo.contact_phone?.replace(/\s/g, '')}`}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 2xl:p-8 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary"><PhoneIcon /></div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</div>
                    <div className="mt-2 text-base 2xl:text-lg font-medium leading-snug text-foreground">{contactInfo.contact_phone}</div>
                  </div>
                </div>
              </a>
              <a href={`mailto:${contactInfo.contact_email}`}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 2xl:p-8 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary"><MailIcon /></div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</div>
                    <div className="mt-2 text-base 2xl:text-lg font-medium leading-snug text-foreground">{contactInfo.contact_email}</div>
                  </div>
                </div>
              </a>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 2xl:p-8 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary"><MapPinIcon /></div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Address</div>
                  <div className="mt-2 text-base 2xl:text-lg font-medium leading-snug text-foreground">{contactInfo.contact_address}</div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
              <iframe title="IIT Madras campus map" src="https://www.google.com/maps?q=IIT+Madras+NAC+1,+Chennai&output=embed" className="block h-[260px] w-full border-0 sm:h-[340px] md:h-[420px] 2xl:h-[500px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
              <div className="flex items-center justify-between border-t border-border bg-surface px-5 py-3 text-sm 2xl:text-base">
                <span className="text-muted-foreground">IIT Madras Campus, Chennai</span>
                <a href="https://maps.google.com/?q=IIT+Madras+NAC+1" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">Open in Google Maps <ExternalLinkIcon /></a>
              </div>
            </div>
          </div>
        </section>

        {/* Center Management */}
        <section className="border-t border-border bg-surface py-20 2xl:py-28">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 rounded-full bg-accent"></span>Center Management
            </div>
            <h2 className="mt-5 text-3xl font-medium tracking-tight">Center Coordinator &amp; Project Managers</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {centerManagement.map((person) => (
                <article key={person.email} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                  <h3 className="text-base font-semibold tracking-tight">{person.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{person.role}</p>
                  <a href={`mailto:${person.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    <MailIcon className="size-4" /> {person.email}
                  </a>
                </article>
              ))}
            </div>

            <h2 className="mt-20 text-3xl font-medium tracking-tight">Center Heads</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {centerHeads.map((person) => (
                <article key={person.email} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                  <h3 className="text-base font-semibold tracking-tight">{person.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{person.dept}</p>
                  <a href={`mailto:${person.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    <MailIcon className="size-4" /> {person.email}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

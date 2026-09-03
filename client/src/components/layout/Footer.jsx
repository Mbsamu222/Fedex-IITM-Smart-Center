import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/api';

const defaultSettings = {
  contact_phone: '044 2257 9668',
  contact_email: 'fedexiitm.admin@imail.iitm.ac.in',
  contact_address: 'NAC 1, Stilt floor, Indian Institute of Technology Madras, Chennai, Tamil Nadu 600036',
  footer_disclaimer: 'Official page of the IIT Madras-led FedEx SMART Center. All expressions/posts/opinions are solely handled by IIT Madras.',
  copyright_text: '© 2026 Indian Institute of Technology Madras. All Rights Reserved.'
};

export default function Footer() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await publicApi.getSettings();
        if (res.data && Object.keys(res.data).length > 0) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        // keep defaults
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="border-t border-border bg-background py-14">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 grid gap-10 md:grid-cols-4 2xl:grid-cols-5">
        <div className="md:col-span-2 2xl:col-span-2">
          <img 
            src="/smart-logo.png" 
            alt="SMART" 
            className="h-10 w-auto" 
          />
          <p className="mt-5 max-w-md 2xl:max-w-lg text-sm 2xl:text-base leading-relaxed text-muted-foreground">
            A research hub advancing sustainable logistics.
          </p>
          <div className="mt-5 flex gap-3">
            <a 
              href="https://www.linkedin.com/company/iitmfedexsmartcenter/posts/?feedView=all" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin size-4" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/smartcenteriitmfedex/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram size-4" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://www.youtube.com/@smartcenteriitmfedex" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="YouTube"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube size-4" aria-hidden="true">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                <path d="m10 15 5-3-5-3z"></path>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="2xl:col-span-2">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick Links</div>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm 2xl:text-base">
            <li><Link className="text-foreground hover:text-primary" to="/">Home</Link></li>
            <li><Link to="/research" className="text-foreground hover:text-primary">Research</Link></li>
            <li><Link to="/team/advisory-board" className="text-foreground hover:text-primary">Advisory Board &amp; Exec</Link></li>
            <li><Link to="/team/center-team" className="text-foreground hover:text-primary">Center Team</Link></li>
            <li><Link to="/team/faculty" className="text-foreground hover:text-primary">Faculty Team</Link></li>
            <li><Link to="/team/research-scholars" className="text-foreground hover:text-primary">Research Team</Link></li>
            <li><Link to="/publications" className="text-foreground hover:text-primary">Publications</Link></li>
            <li><Link to="/blogs" className="text-foreground hover:text-primary">Blogs</Link></li>
            <li><Link to="/events" className="text-foreground hover:text-primary">Events &amp; Announcements</Link></li>
            <li><Link to="/gallery" className="text-foreground hover:text-primary">Gallery</Link></li>
            <li><Link to="/contact" className="text-foreground hover:text-primary">Get in Touch</Link></li>
          </ul>
        </div>
        
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Contact Us</div>
          <ul className="mt-4 space-y-3 text-sm 2xl:text-base text-foreground">
            <li className="flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin size-4 shrink-0 text-primary mt-1" aria-hidden="true">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg> 
              {settings.contact_address}
            </li>
            <li className="flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail size-4 shrink-0 text-primary mt-1" aria-hidden="true">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              </svg> 
              <a href={`mailto:${settings.contact_email}`} className="hover:text-primary">{settings.contact_email}</a>
            </li>
            <li className="flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone size-4 shrink-0 text-primary mt-1" aria-hidden="true">
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
              </svg> 
              <a href={`tel:${settings.contact_phone?.replace(/\s/g, '')}`} className="hover:text-primary">{settings.contact_phone}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] px-6 lg:px-10 2xl:px-12 3xl:px-16 mt-10 border-t border-border pt-6 text-xs 2xl:text-sm text-muted-foreground">
        <p>{settings.footer_disclaimer}</p>
        <p className="mt-2">{settings.copyright_text}</p>
      </div>
    </footer>
  );
}
import { useState, useEffect } from 'react';
import { Megaphone, X } from 'lucide-react';
import { publicApi } from '../../services/api';

const DISMISSED_KEY = 'smart_news_popup_dismissed_id';

export default function NewsPopup() {
  const [news, setNews] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await publicApi.getNews({ active: true });
        const items = Array.isArray(res.data) ? res.data : [];
        if (items.length === 0) return;

        const latest = items[0];
        const dismissedId = localStorage.getItem(DISMISSED_KEY);
        if (String(dismissedId) === String(latest.id)) return;

        setNews(latest);
        setVisible(true);
      } catch (err) {
        console.error('Failed to load latest news:', err);
      }
    };
    fetchLatestNews();
  }, []);

  const handleDismiss = () => {
    if (news) localStorage.setItem(DISMISSED_KEY, news.id);
    setVisible(false);
  };

  if (!news) return null;

  const formattedDate = news.published_date
    ? new Date(news.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div
      className={
        "fixed bottom-24 right-4 sm:bottom-28 sm:right-8 z-40 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)] transition-all duration-300 " +
        (visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none")
      }
      role="dialog"
      aria-label="Latest news and updates"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Megaphone className="size-4" />
          Latest News &amp; Updates
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="px-4 py-4">
        <h3 className="text-sm font-semibold leading-snug text-foreground">{news.title}</h3>
        {formattedDate && <p className="mt-1 text-xs text-muted-foreground">{formattedDate}</p>}
        {news.description && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">{news.description}</p>
        )}
        {news.link && (
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7"></path><path d="M7 7h10v10"></path>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

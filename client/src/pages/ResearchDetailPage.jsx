import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi, resolveImageUrl } from '../services/api';
import { ArrowLeft, Calendar, User, Users, ChevronRight } from 'lucide-react';

export default function ResearchDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await publicApi.getProject(slug);
        setProject(res.data);
      } catch (err) {
        console.error(err);
        setError('Research project not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-6">
        <div className="inline-flex size-16 items-center justify-center rounded-3xl bg-muted text-muted-foreground mb-6">
          <ArrowLeft className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">Project Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">{error}</p>
        <Link to="/research" className="bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 transition-all font-medium shadow-lg hover:-translate-y-1">
          Return to Research
        </Link>
      </div>
    );
  }

  const headerImage = project.header_image_url || project.image_url;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Header Section */}
      <section className="w-full pt-32 pb-12 px-6 lg:px-10 2xl:px-12 3xl:px-16 max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] mx-auto">
        <Link to="/research" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 text-sm font-semibold w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Research</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm">
            {project.research_area_name || 'Featured Project'}
          </span>
          {project.status && (
            <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest border shadow-sm ${project.status === 'Ongoing'
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
              {project.status}
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-4xl font-display font-bold tracking-tight leading-snug text-foreground mb-6 max-w-4xl 2xl:max-w-5xl">
          {project.title}
        </h1>

        {/* Date Details */}
        {(project.start_date || project.end_date) && (
          <div className="flex items-center gap-4 text-muted-foreground font-medium mb-4">
            <div className="flex items-center justify-center size-12 rounded-2xl bg-card border border-border shadow-sm text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Timeline</span>
              <span className="text-sm md:text-base 2xl:text-lg text-foreground font-semibold">
                {project.start_date ? new Date(project.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : 'Started'}
                {' — '}
                {project.end_date ? new Date(project.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : 'Present'}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Full Width Image Display */}
      {headerImage && (
        <section className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 3xl:px-16 mb-16 md:mb-24 flex justify-center">
          <div className="relative inline-block max-w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-muted/50 group border border-border bg-card">
            <img
              src={resolveImageUrl(headerImage)}
              alt={project.title}
              className="max-w-full max-h-[300px] sm:max-h-[420px] lg:max-h-[480px] 2xl:max-h-[600px] w-auto h-auto object-contain transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Very subtle inner shadow for depth, no dark overlays */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] pointer-events-none rounded-[2rem]"></div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] mx-auto px-6 lg:px-10 2xl:px-12 3xl:px-16 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Left Column: Abstract & Content */}
        <div className="lg:col-span-8 space-y-16 min-w-0">

          {/* Abstract / Description Card */}
          {project.description && (
            <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-5 sm:p-10 shadow-xl shadow-muted/50">
              {/* Decorative side accent */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-accent"></div>

              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                <span className="inline-flex size-2 rounded-full bg-accent shrink-0"></span>
                <span className="leading-none">Abstract</span>
              </h3>

              <p className="text-base md:text-lg text-card-foreground leading-relaxed font-medium">
                {project.description}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="relative bg-card rounded-3xl border border-border p-5 md:p-12 shadow-xl shadow-muted/30 overflow-hidden break-words">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8 flex items-center gap-2 pb-6 border-b border-border">
              <span className="inline-flex size-2 rounded-full bg-primary shrink-0"></span>
              <span className="leading-none">Project Details</span>
            </h3>

            {project.content ? (
              <div
                className="prose prose-sm md:prose-base max-w-none break-words w-full overflow-x-auto
                [&_*]:break-words [&_*]:whitespace-pre-wrap
                prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary hover:prose-a:text-primary/80 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-border
                prose-li:text-muted-foreground prose-li:leading-relaxed prose-li:marker:text-primary
                prose-strong:text-foreground
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-card-foreground prose-blockquote:font-medium"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed border-border bg-muted/30 text-center">
                <div className="size-16 rounded-full bg-card shadow-sm flex items-center justify-center mb-5 border border-border">
                  <ArrowLeft className="w-6 h-6 text-muted-foreground rotate-180" />
                </div>
                <p className="text-xl font-semibold text-foreground mb-2">Detailed content is being compiled.</p>
                <p className="text-muted-foreground font-medium">Check back later for full project details and findings.</p>
              </div>
            )}
          </div>

          {/* Action Callout */}
          {project.case_study_link && (
            <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-inner">
              <div>
                <h4 className="text-2xl font-display font-bold text-foreground mb-3">Want to dive deeper?</h4>
                <p className="text-muted-foreground font-medium">Read the comprehensive case study detailing our methodology and full results.</p>
              </div>
              <a
                href={project.case_study_link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 whitespace-nowrap"
              >
                View Case Study
                <div className="size-8 rounded-full bg-background/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowLeft className="w-4 h-4 rotate-[135deg]" />
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">

            {/* Team Members Widget */}
            {project.associated_people && project.associated_people.length > 0 && (
              <div className="bg-card border border-border rounded-3xl p-1 overflow-hidden shadow-xl shadow-muted/50">
                <div className="p-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground tracking-tight">Research Team</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">The brilliant minds driving this exploration.</p>
                </div>

                <div className="px-3 py-3 space-y-1 bg-muted/50">
                  {project.associated_people.map((person) => (
                    <div key={person.id} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-card hover:shadow-md transition-all border border-transparent hover:border-border">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-card shadow-sm group-hover:border-primary/20 transition-colors">
                        {person.image_url ? (
                          <img
                            src={resolveImageUrl(person.image_url)}
                            alt={person.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                            <User className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground truncate text-base">
                          {person.category ? (
                            <Link to={`/team/${person.category}`} className="hover:text-primary transition-colors">
                              {person.name}
                            </Link>
                          ) : (
                            person.name
                          )}
                        </h4>
                        <p className="text-sm text-primary font-semibold truncate mt-0.5">
                          {person.role || person.title}
                        </p>
                      </div>
                      {person.category && (
                        <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}

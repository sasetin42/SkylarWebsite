import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, Clock, User, ArrowLeft, ArrowRight, 
  Check, Copy, Sparkles, BookOpen, AlertTriangle, 
  Lightbulb, TrendingUp, BarChart3, Award, Compass,
  Facebook, Twitter, Linkedin
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { getBlogPostBySlugOrId, getBlogPosts, getCourses } from '../services/storageService';
import { BlogPost, Course } from '../types';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const posts = getBlogPosts();
    setAllPosts(posts);
    if (slug) {
      const found = getBlogPostBySlugOrId(slug);
      setPost(found);
    }
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleOpenCourseInquiry = (courseId?: string, courseTitle?: string) => {
    window.dispatchEvent(
      new CustomEvent('openInquireModal', {
        detail: {
          courseId,
          courseTitle
        }
      })
    );
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-24">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100 animate-fade-in">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-accent">
            <BookOpen size={32} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-secondary mb-3">Article Not Found</h2>
          <p className="text-gray-600 mb-6 text-sm">
            The article you are looking for might have been moved or updated.
          </p>
          <Link to="/news">
            <Button className="w-full">Back to Industry Insights</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Find currentIndex, previous and next articles
  const currentIndex = allPosts.findIndex(p => p.id === post.id || p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;
  const relatedPosts = allPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);
  const otherPosts = relatedPosts.length > 0 ? relatedPosts : allPosts.filter(p => p.id !== post.id).slice(0, 3);

  // Find related courses if any
  const allCourses = getCourses();
  const relatedCourses: Course[] = (post.relatedCourseIds || [])
    .map(cId => allCourses.find(c => c.id === cId))
    .filter((c): c is Course => Boolean(c));

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div className="bg-gray-50 min-h-screen pb-24 text-gray-900 font-sans">
      <Breadcrumbs />

      {/* ─── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-secondary border-b-4 border-accent text-white">
        {/* Background Image with Dark Gradient & Multiply */}
        <div className="absolute inset-0 z-0">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041024] via-[#0b1e36]/95 to-[#041024]/90" />
        </div>

        <div className="relative z-10 pt-[110px] pb-14">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            {/* Back link & Category Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-fade-in">
              <Link 
                to="/news" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-accent transition-colors group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                Back to All Articles
              </Link>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  {post.category}
                </span>
                {post.readTime && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 text-gray-200 text-xs font-medium border border-white/15 backdrop-blur-sm">
                    <Clock size={12} className="text-accent" /> {post.readTime}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-heading font-extrabold text-white leading-tight md:leading-[1.15] mb-6 drop-shadow-md">
              {post.title}
            </h1>

            {/* Author & Publication Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3.5">
                {post.author?.avatar ? (
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent text-accent flex items-center justify-center font-bold text-lg">
                    <User size={22} />
                  </div>
                )}
                <div>
                  <div className="font-bold text-white text-base leading-tight">
                    {post.author?.name || 'SKYLAR Technical Team'}
                  </div>
                  <div className="text-xs text-gray-300 flex items-center gap-2 mt-0.5">
                    <span>{post.author?.role || 'Safety Instructor'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar size={12} /> {post.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-400 mr-1 hidden sm:inline">
                  Share:
                </span>
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-accent hover:text-secondary text-white transition-all text-xs flex items-center gap-1.5 border border-white/15"
                  title="Copy link"
                >
                  {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  <span className="text-xs font-semibold">{copiedLink ? 'Copied!' : 'Link'}</span>
                </button>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-[#0077b5] text-white transition-colors border border-white/15"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-[#1da1f2] text-white transition-colors border border-white/15"
                  title="Share on Twitter/X"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-[#4267B2] text-white transition-colors border border-white/15"
                  title="Share on Facebook"
                >
                  <Facebook size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT CONTAINER ─────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-8 max-w-5xl pt-10 md:pt-14">
        
        {/* KEY TAKEAWAYS CALLOUT BOX */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent rounded-3xl p-6 md:p-8 border border-amber-400/30 shadow-md mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/15 rounded-full filter blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2.5 text-secondary font-heading font-bold text-lg md:text-xl mb-4">
              <span className="p-2 bg-accent/20 rounded-xl text-amber-700">
                <Sparkles size={20} />
              </span>
              Executive Summary &amp; Key Takeaways
            </div>
            <ul className="grid sm:grid-cols-2 gap-3.5 text-sm md:text-base text-gray-700">
              {post.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/30 text-amber-900 font-bold text-xs flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* HIGH-IMPACT STATS STRIP */}
        {post.stats && post.stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
            {post.stats.map((st, sIdx) => (
              <div key={sIdx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center text-center group hover:shadow-md transition-shadow">
                <div className="text-3xl md:text-4xl font-heading font-extrabold text-secondary group-hover:text-primary transition-colors">
                  {st.label}
                </div>
                <div className="text-sm font-bold text-gray-800 mt-1">{st.value}</div>
                {st.sublabel && <div className="text-xs text-gray-500 mt-1">{st.sublabel}</div>}
              </div>
            ))}
          </div>
        )}

        {/* HERO IMAGE CONTAINER */}
        <div className="rounded-3xl overflow-hidden shadow-xl mb-12 border border-gray-100 bg-gray-900 max-h-[500px]">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover max-h-[500px]" 
          />
        </div>

        {/* TWO COLUMN ARTICLE BODY */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Main Article Content (8 cols) */}
          <main className="lg:col-span-8 space-y-10 text-gray-800 leading-relaxed text-base md:text-lg">
            
            {/* Excerpt Lead Paragraph */}
            <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed pb-6 border-b border-gray-200">
              {post.excerpt}
            </p>

            {/* SECTIONS */}
            {post.contentSections?.map((sec, secIdx) => (
              <article key={secIdx} className="space-y-5">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary tracking-tight">
                  {sec.heading}
                </h2>

                {sec.paragraphs.map((pText, pIdx) => (
                  <p key={pIdx} className="text-gray-700 leading-relaxed">
                    {pText}
                  </p>
                ))}

                {/* Callout Box */}
                {sec.callout && (
                  <div className={`rounded-2xl p-5 md:p-6 my-6 border ${
                    sec.callout.type === 'warning' 
                      ? 'bg-red-50 border-red-200 text-red-950' 
                      : sec.callout.type === 'stat'
                      ? 'bg-blue-50 border-blue-200 text-blue-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-base mb-2">
                      {sec.callout.type === 'warning' && <AlertTriangle className="text-red-600" size={20} />}
                      {sec.callout.type === 'stat' && <TrendingUp className="text-blue-600" size={20} />}
                      {sec.callout.type === 'tip' && <Lightbulb className="text-amber-600" size={20} />}
                      <span>{sec.callout.title}</span>
                    </div>
                    <p className="text-sm md:text-base leading-relaxed opacity-90">
                      {sec.callout.text}
                    </p>
                  </div>
                )}

                {/* Bullet List Items */}
                {sec.listItems && sec.listItems.length > 0 && (
                  <ul className="space-y-2.5 my-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    {sec.listItems.map((li, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-3 text-sm md:text-base text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Section Image */}
                {sec.image && (
                  <div className="my-6 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={sec.image} alt={sec.heading} className="w-full h-auto object-cover" />
                    {sec.caption && (
                      <div className="p-3 text-xs text-center text-gray-500 bg-gray-50 border-t border-gray-100">
                        {sec.caption}
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}

            {/* INTERACTIVE DATA CHARTS & GRAPHS */}
            {post.charts && post.charts.length > 0 && (
              <section className="space-y-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xl font-heading font-bold text-secondary">
                  <BarChart3 className="text-accent" />
                  <span>Industry Data &amp; Visual Analytics</span>
                </div>

                {post.charts.map((chart, cIdx) => {
                  const maxVal = Math.max(...chart.data.map(d => d.value), 1);
                  return (
                    <div key={cIdx} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-secondary">{chart.title}</h3>
                        {chart.subtitle && <p className="text-xs text-gray-500 mt-1">{chart.subtitle}</p>}
                      </div>

                      {/* Bar / Metric Chart Rendering */}
                      <div className="space-y-4 pt-2">
                        {chart.data.map((dp, dpIdx) => {
                          const pct = Math.round((dp.value / maxVal) * 100);
                          return (
                            <div key={dpIdx} className="space-y-1.5">
                              <div className="flex justify-between items-center text-sm font-semibold text-gray-800">
                                <span>{dp.label}</span>
                                <span className="font-bold" style={{ color: dp.color || '#2563EB' }}>
                                  {dp.formattedValue}
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden flex">
                                <div 
                                  className="h-full rounded-full transition-all duration-1000"
                                  style={{ 
                                    width: `${pct}%`,
                                    backgroundColor: dp.color || '#2563EB'
                                  }}
                                />
                              </div>
                              {dp.description && (
                                <p className="text-xs text-gray-500">{dp.description}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* TAGS */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Tags:</span>
                {post.tags.map((tg, tIdx) => (
                  <span key={tIdx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">
                    #{tg}
                  </span>
                ))}
              </div>
            )}

            {/* AUTHOR BIO CARD */}
            {post.author && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-amber-100 shadow-md flex-shrink-0"
                />
                <div className="text-center sm:text-left space-y-1.5">
                  <div className="text-xs uppercase font-bold text-accent tracking-wider">About the Author</div>
                  <h4 className="text-xl font-heading font-bold text-secondary">{post.author.name}</h4>
                  <p className="text-sm font-semibold text-gray-600">{post.author.role}</p>
                  {post.author.bio && <p className="text-sm text-gray-500 leading-relaxed pt-1">{post.author.bio}</p>}
                </div>
              </div>
            )}

          </main>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-28">
            
            {/* RELATED COURSES CTA BOX */}
            {relatedCourses.length > 0 && (
              <div className="bg-gradient-to-br from-secondary via-[#0b1e36] to-[#041024] text-white rounded-3xl p-6 md:p-7 shadow-xl border border-white/10 space-y-5">
                <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
                  <Award size={16} /> Certified Training
                </div>
                <h3 className="text-xl font-heading font-bold text-white leading-snug">
                  Get Certified for This Role
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Fast-track your qualification with GWO accredited programs at our Angeles City, Pampanga facility.
                </p>

                <div className="space-y-3">
                  {relatedCourses.map((c) => (
                    <div key={c.id} className="bg-white/10 hover:bg-white/15 transition-colors p-3.5 rounded-xl border border-white/10 space-y-2">
                      <div className="font-bold text-sm text-white">{c.title}</div>
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span>Duration: {c.duration}</span>
                        <span className="font-bold text-accent">₱{c.price.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Link to={`/courses/${c.id}`} className="flex-1">
                          <button className="w-full py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                            Details
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleOpenCourseInquiry(c.id, c.title)}
                          className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-accent text-secondary hover:bg-yellow-400 transition-colors shadow-sm"
                        >
                          Inquire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QUICK CONTACT SUPPORT BOX */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Compass size={24} />
              </div>
              <h4 className="font-heading font-bold text-secondary text-lg">Need Guidance on GWO Modules?</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Speak directly with our training coordinators to map out your certification pathway.
              </p>
              <Link to="/contact">
                <Button variant="outline" className="w-full text-xs font-bold">
                  Contact Training Team
                </Button>
              </Link>
            </div>

            {/* MORE INSIGHTS MINI WIDGET */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h4 className="font-heading font-bold text-secondary text-base">More Industry Insights</h4>
              <div className="space-y-4">
                {otherPosts.map((op) => (
                  <Link 
                    key={op.id} 
                    to={`/news/${op.slug || op.id}`}
                    className="flex gap-3.5 group items-start"
                  >
                    <img 
                      src={op.image} 
                      alt={op.title} 
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        {op.category}
                      </span>
                      <h5 className="text-xs font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {op.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>

        {/* ─── BOTTOM PREVIOUS / NEXT ARTICLE NAVIGATION ─────────────── */}
        <div className="mt-16 pt-10 border-t border-gray-200 grid sm:grid-cols-2 gap-6">
          {prevPost ? (
            <Link 
              to={`/news/${prevPost.slug || prevPost.id}`}
              className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col text-left"
            >
              <div className="text-xs font-bold text-gray-400 flex items-center gap-1 mb-2 group-hover:text-primary">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Previous Article
              </div>
              <div className="text-sm font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2">
                {prevPost.title}
              </div>
            </Link>
          ) : <div />}

          {nextPost ? (
            <Link 
              to={`/news/${nextPost.slug || nextPost.id}`}
              className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col text-right sm:text-right"
            >
              <div className="text-xs font-bold text-gray-400 flex items-center gap-1 justify-end mb-2 group-hover:text-primary">
                Next Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2">
                {nextPost.title}
              </div>
            </Link>
          ) : <div />}
        </div>

      </div>
    </div>
  );
};

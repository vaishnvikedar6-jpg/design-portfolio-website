import React, { useEffect, useRef, useState, useId } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Check,
  Code2,
  Compass,
  Copy,
  Lightbulb,
  Mail,
  PencilRuler,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react';

// 3D Components
import HeroScene3D from './components/3d/HeroScene3D';
import AboutScene3D from './components/3d/AboutScene3D';
import ContactScene3D from './components/3d/ContactScene3D';
import CustomCursor from './components/3d/CustomCursor';
import GlassNav from './components/3d/GlassNav';
import CinematicDoors3D from './components/3d/CinematicDoors3D';
import ProjectShowcase3D from './components/3d/ProjectShowcase3D';
import Skills3D from './components/3d/Skills3D';
import Timeline3D from './components/3d/Timeline3D';
import InteractiveCard3D from './components/3d/InteractiveCard3D';
import ButterflyGuide from './components/3d/ButterflyGuide';

// Base-aware asset path: works on GitHub Pages sub-paths, Netlify, Vercel and Replit.
const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

// Real contact and project links matching resume
const EMAIL = 'vaishnavikedar459@gmail.com';
const AVIRA_PROTOTYPE =
  'https://www.figma.com/proto/4z78d3naEOI0XzCR0oc4J7/AVIRA?node-id=18-5970&p=f&t=HTtdusOLcz7s1fXC-1&scaling=scale-down&content-scaling=fixed&page-id=12%3A790&starting-point-node-id=18%3A5970';
const MISS_BEAUTIFUL_PROTOTYPE =
  'https://www.figma.com/proto/Ampa8dUqHSzoXFItj7pm28/Untitled?node-id=1-3&starting-point-node-id=1%3A3&t=egCvDO26mciPSxTV-1';

const LINKS = {
  avira: 'https://www.figma.com/design/4z78d3naEOI0XzCR0oc4J7/AVIRA?node-id=12-790&t=FlMtIR4sxAwxxGSA-1',
  aviraPrototype: AVIRA_PROTOTYPE,
  civicFix: 'https://www.figma.com/proto/7ua1fjJwYSe9NK58SMV0k3/civic_fix?node-id=29-104',
  aura: 'https://www.figma.com/proto/Ampa8dUqHSzoXFItj7pm28/Untitled?node-id=1-3&starting-point-node-id=1%3A3',
  missBeautiful: MISS_BEAUTIFUL_PROTOTYPE,
  anuvaad: 'https://vaishnvikedar6-jpg.github.io/Anuvaad-chatbot/',
  ayushlink: 'https://github.com/vaishnvikedar6-jpg/Ayushlink-Final',
  courseRegistration: 'https://course-registration-dashboard.onrender.com/',
  cyberGuard: 'https://vaishnvikedar6-jpg.github.io/OIBSIP/Level1_Task1/',
  linkedin: 'https://www.linkedin.com/in/vaishnavi-kedar-5a306039b/',
  github: 'https://github.com/vaishnvikedar6-jpg',
  behance: 'https://www.behance.net/vaishnavikedar_31',
};

const externalProps = { target: '_blank', rel: 'noopener noreferrer' };

type CaseStudy = {
  id: 'avira' | 'civic-fix';
  eyebrow: string;
  title: string;
  meta: [string, string][];
  problem: string;
  features: string[];
  decisions: { title: string; text: string }[];
  result: string;
  images: { file: string; alt: string }[];
  link: string;
  linkLabel: string;
};

const caseStudies: Record<CaseStudy['id'], CaseStudy> = {
  avira: {
    id: 'avira',
    eyebrow: 'Case study · Drishti UI/UX Designathon',
    title: 'AVIRA',
    meta: [
      ['Event', 'Drishti, CESA VIT Mumbai (Friends of Figma Mumbai and .xyz)'],
      ['Team', 'Team of two'],
      ['Focus', 'Mobile app · UX research · Colour psychology'],
      ['Result', 'Top 6 of 193+ registrations'],
    ],
    problem:
      'Travelling alone as a woman carries a constant, quiet anxiety: is this route safe, did I get home, and how do I ask for help fast? AVIRA tackles that vulnerability with non-intrusive safety scores, automated check-ins and a rapid, zero-friction emergency pipeline, so nobody has to keep texting “reached?”.',
    features: [
      'Real-time, safety-rated route planning',
      'Proactive “Avira Pulse” check-ins',
      'Automated arrival confirmations',
      'Instant SOS response workflow',
    ],
    decisions: [
      {
        title: 'Colour psychology',
        text: 'Coral red is reserved for SOS and emergency alerts only, so it never loses its meaning. Mint green marks verified safe routes and successful arrivals, on a minimal neutral canvas so route scores stay scannable on the go.',
      },
      {
        title: 'A silent, one-tap pulse',
        text: 'A gentle “Are you safe?” prompt replaces anxious manual texting. One quiet tap confirms you are fine; if nobody responds before the timer ends, the trusted circle is alerted.',
      },
      {
        title: 'Arrival without effort',
        text: 'When the journey ends inside a safe zone, parents or roommates are told automatically. Safety information flows to the people who need it without the commuter lifting a finger.',
      },
    ],
    result: 'Top 6 finalist out of 193+ registrations at the Drishti UI/UX Designathon.',
    images: [
      { file: 'avira-1.png', alt: 'AVIRA trip-planning and safety home screen' },
      { file: 'avira-2.png', alt: 'AVIRA route guidance and assistance screen' },
    ],
    link: LINKS.aviraPrototype,
    linkLabel: 'View in Figma',
  },
  'civic-fix': {
    id: 'civic-fix',
    eyebrow: 'Case study · PixelVerse UI/UX Hackathon',
    title: 'Civic Fix',
    meta: [
      ['Event', 'PixelVerse UI/UX Hackathon, GDG on Campus SIES GST (Mar 2026)'],
      ['Team', 'Team project, built under hackathon time limits'],
      ['Focus', 'Mobile prototype · Flows · Accessibility'],
      ['Output', 'Interactive Figma prototype'],
    ],
    problem:
      'Reporting a pothole or a broken streetlight is slow and opaque, so residents give up and nobody knows what happened to their report. Civic Fix is a civic issue-reporting app that makes reporting quick and the outcome visible.',
    features: [
      'Quick reporting flow with photo proof and location',
      'Clear status tracking from submitted to resolved',
      'Community upvoting to surface urgent issues',
      'Quick and voice report actions on the home screen',
    ],
    decisions: [
      {
        title: 'Intuitive reporting flows',
        text: 'The primary action sits on the home screen, with quick and voice options, so reporting takes only a few taps.',
      },
      {
        title: 'Visual hierarchy',
        text: 'One clear action per screen, strong headings and calm colour keep the interface readable at a glance.',
      },
      {
        title: 'Accessible by default',
        text: 'Accessible interface design was a stated goal from the start: readable type, clear contrast and comfortable tap targets, even under the hackathon’s tight time limit.',
      },
    ],
    result: 'Delivered a complete, clickable prototype within the hackathon time limit.',
    images: [{ file: 'civic-fix-1.png', alt: 'Civic Fix Smart Civic Reporter home screen' }],
    link: LINKS.civicFix,
    linkLabel: 'View prototype',
  },
};

function Blossom({ className }: { className: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        {/* Elegant Plum-Pink Petal Gradient with Dewy Apex Gloss */}
        <radialGradient id={`${id}-petal`} cx="50%" cy="82%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="18%" stopColor="#fce4ee" />
          <stop offset="48%" stopColor="#de5d95" />
          <stop offset="82%" stopColor="#a82e63" />
          <stop offset="100%" stopColor="#5c1737" />
        </radialGradient>

        {/* Gloss Specular Sheen */}
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`${id}-stamen`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#5c1737" />
          <stop offset="100%" stopColor="#fff4b8" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#a82e63" floodOpacity="0.35" />
          <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#5c1737" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter={`url(#${id}-shadow)`}>
        {/* 5 Elegant Plum-Pink Petals */}
        {[0, 72, 144, 216, 288].map((deg) => (
          <path
            key={deg}
            transform={`rotate(${deg} 50 50)`}
            d="M 50 50 C 42 38, 32 26, 36 12 C 38 6, 44 4, 48 8 C 49 9, 50 11, 50 11 C 50 11, 51 9, 52 8 C 56 4, 62 6, 64 12 C 68 26, 58 38, 50 50 Z"
            fill={`url(#${id}-petal)`}
            opacity="0.98"
          />
        ))}
        {/* Shiny Gloss Streak on Petals */}
        {[0, 72, 144, 216, 288].map((deg) => (
          <path
            key={`gloss-${deg}`}
            transform={`rotate(${deg} 50 50)`}
            d="M 50 48 C 46 38, 38 26, 42 16 C 44 12, 48 10, 50 14 C 47 18, 46 32, 50 48 Z"
            fill={`url(#${id}-gloss)`}
            opacity="0.65"
          />
        ))}
        {/* Inner Luster Highlight */}
        {[36, 108, 180, 252, 324].map((deg) => (
          <path
            key={`inner-${deg}`}
            transform={`rotate(${deg} 50 50) scale(0.68) translate(23.5, 23.5)`}
            d="M 50 50 C 44 40, 36 28, 40 16 C 42 10, 48 8, 50 12 C 52 8, 58 10, 60 16 C 64 28, 56 40, 50 50 Z"
            fill="#ffffff"
            opacity="0.5"
          />
        ))}
        {/* Deep Plum & Wild Berry Core */}
        <circle cx="50" cy="50" r="7" fill="#5c1737" />
        <circle cx="50" cy="50" r="5" fill="#de5d95" />
        <circle cx="50" cy="50" r="3" fill="#ffd166" />
        {/* Glistening Golden Stamens */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const x1 = 50 + Math.cos(angle) * 3.5;
          const y1 = 50 + Math.sin(angle) * 3.5;
          const x2 = 50 + Math.cos(angle) * 12.5;
          const y2 = 50 + Math.sin(angle) * 12.5;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${id}-stamen)`} strokeWidth="1.2" strokeLinecap="round" />
              <circle cx={x2} cy={y2} r="1.4" fill="#ffd166" />
              <circle cx={x2} cy={y2} r="0.7" fill="#ffffff" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function App() {
  const [active, setActive] = useState('home');
  const [progress, setProgress] = useState(0);
  const [openCase, setOpenCase] = useState<CaseStudy['id'] | null>(null);
  const dialogOpen = openCase !== null;
  const [toast, setToast] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // Scroll listener for top progress bar and active section detection
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    const sections = document.querySelectorAll<HTMLElement>('main section[id], footer[id]');
    let sectionObserver: IntersectionObserver | undefined;
    try {
      if ('IntersectionObserver' in window) {
        sectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) setActive(entry.target.id);
            });
          },
          { rootMargin: '-25% 0px -55% 0px' }
        );
        sections.forEach((section) => sectionObserver?.observe(section));
      }
    } catch {
      sectionObserver?.disconnect();
    }

    return () => {
      window.removeEventListener('scroll', update);
      window.cancelAnimationFrame(frame);
      sectionObserver?.disconnect();
    };
  }, []);

  // Animated stat number count up
  useEffect(() => {
    const stats = document.querySelectorAll<HTMLElement>('.stat-3d-card strong');
    if (
      !stats.length ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    )
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          const finalValue = node.textContent ?? '';
          const target = Number(finalValue);
          if (!Number.isFinite(target)) {
            observer.unobserve(node);
            return;
          }
          const start = performance.now();
          const duration = 900;
          const decimals = finalValue.includes('.') ? finalValue.split('.')[1].length : 0;
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = (target * eased).toFixed(decimals);
            if (progress < 1) window.requestAnimationFrame(tick);
            else observer.unobserve(node);
          };
          node.textContent = (0).toFixed(decimals);
          window.requestAnimationFrame(tick);
        });
      },
      { threshold: 0.45 }
    );

    stats.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Accessible Modal Trap and Escape handling
  useEffect(() => {
    if (!dialogOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('button,a[href]')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDialog();
      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button,a[href]');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
  }, [dialogOpen]);

  const closeDialog = () => setOpenCase(null);
  const openCaseStudy = (id: CaseStudy['id'], el?: HTMLElement | null) => {
    if (el) lastTrigger.current = el;
    setOpenCase(id);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setToast('Copied to clipboard!');
    } catch {
      setToast(EMAIL);
    }
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="site">
      <CustomCursor />
      <ButterflyGuide />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Floating 3D Glass Navigation */}
      <GlassNav active={active} progress={progress} />

      <main id="main">
        {/* =================================================================
            HERO SECTION: 3D WebGL Orbital Installation & Dimensional Portrait
            ================================================================= */}
        <section className="container hero hero-wrapper-relative" id="home">
          {/* Real-time 3D Three.js / R3F Canvas */}
          <HeroScene3D />

          <div className="hero-text">
            <div className="eyebrow">UI/UX Designer · Full-Stack Developer</div>
            <h1 className="serif">
              <span className="hero-headline-piece">I</span>{' '}
              <span className="hero-headline-piece">design</span>{' '}
              <span className="pink-italic hero-headline-piece">how</span>{' '}
              <span className="pink-italic hero-headline-piece">it</span>{' '}
              <span className="pink-italic hero-headline-piece">feels.</span>
            </h1>
            <p className="hero-copy">
              Thoughtful digital experiences shaped by creativity, technology, and human connection. Open to remote internships and creative collaborations.
            </p>
            <div className="hero-actions">
              <a className="pill pill-primary" href="#work" data-testid="link-explore-work">
                Explore My Work <ArrowRight className="arrow" size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href={asset('resume.pdf')} download data-testid="link-download-resume">
                Download resume <ArrowDown size={15} style={{ marginLeft: 4 }} />
              </a>
            </div>

            {/* Elegant 3D Scroll Cue */}
            <a href="#work" className="hero-scroll-cue" aria-label="Scroll to projects">
              <div className="scroll-mouse-icon">
                <div className="scroll-wheel" />
              </div>
              <span>Explore 3D Work</span>
            </a>
          </div>

          <div className="hero-art-3d-stage">
            <Blossom className="flower f1" />
            <Blossom className="flower f2" />
            <Blossom className="flower f3" />

            {/* Dimensional Layered Portrait Card - Ultra Sharp & Crystal Clear */}
            <InteractiveCard3D className="portrait-3d-glass-card" depth={16}>
              <img
                src={asset('hero-photo.png')}
                alt="Vaishnavi Kedar smiling in a portrait with pink flowers"
                width="580"
                height="412"
                fetchPriority="high"
                decoding="sync"
              />
              {/* 3D Hackathon Award Badge */}
              <div className="hero-3d-badge">
                <div className="badge-trophy-icon">
                  <Trophy size={18} />
                </div>
                <div>
                  <strong>Top 6 of 193+</strong>
                  <span>Drishti UI/UX Designathon Finalist</span>
                </div>
              </div>
            </InteractiveCard3D>
          </div>
        </section>

        {/* =================================================================
            CINEMATIC 3D ARCHED DOORS SECTION: "Magic happens behind the doors"
            ================================================================= */}
        <section className="section doors-section" id="doors" style={{ paddingTop: '20px', paddingBottom: '10px' }}>
          <div className="container">
            <CinematicDoors3D openCaseStudy={openCaseStudy} LINKS={LINKS} />
          </div>
        </section>

        {/* =================================================================
            WORK SECTION: Dimensional Project Showcases (AVIRA, AyushLink, Anuvaad, Civic Fix, etc.)
            ================================================================= */}
        <section className="section work-section" id="work">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Featured Work</div>
              <h2 className="serif">Designs that make an impact.</h2>
            </div>

            <ProjectShowcase3D openCaseStudy={openCaseStudy} LINKS={LINKS} />
          </div>
        </section>

        {/* =================================================================
            SKILLS SECTION: 3D Glass Tiles & Interactive Extruded Capabilities
            ================================================================= */}
        <section className="section skills-section" id="skills" style={{ background: '#fff9fa' }}>
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Skills & Capabilities</div>
              <h2 className="serif">Where design meets engineering.</h2>
            </div>

            <Skills3D />
          </div>
        </section>

        {/* =================================================================
            ABOUT SECTION: Dimensional Composition, Layered Portrait & 3D Gyroscope
            ================================================================= */}
        <section className="section about-section" id="about">
          <div className="container">
            <div className="about-3d-layout">
              <div className="about-visual-column">
                <AboutScene3D />
                <div className="about-photo-glass-frame">
                  <img
                    src={asset('about-photo.png')}
                    alt="Vaishnavi Kedar in a circular portrait, wearing a light pink top"
                    width="214"
                    height="217"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="about-copy">
                <div className="eyebrow">A little about me</div>
                <h2 className="serif">An engineer by education. A designer by curiosity.</h2>
                <p>
                  I'm a Computer Engineering undergraduate at SIES Graduate School of Technology who loves turning ideas into interfaces people genuinely enjoy using. I design in Figma, engineer with code, and build solutions across healthcare, civic-tech and AI.
                </p>

                {/* 3D Interactive Stats Cards */}
                <div className="stats-3d-row">
                  <InteractiveCard3D className="stat-3d-card" depth={12}>
                    <strong>9.86</strong>
                    <span>CGPA · 2nd year</span>
                  </InteractiveCard3D>
                  <InteractiveCard3D className="stat-3d-card" depth={12}>
                    <strong>Top 6</strong>
                    <span>Drishti UI/UX Finalist</span>
                  </InteractiveCard3D>
                  <InteractiveCard3D className="stat-3d-card" depth={12}>
                    <strong>8</strong>
                    <span>Verified Certifications</span>
                  </InteractiveCard3D>
                </div>

                <a className="pill pill-primary" href={asset('resume.pdf')} download data-testid="link-about-resume">
                  Download resume <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            JOURNEY & MILESTONES: The Moonlit Path & Verified Credentials Badges
            ================================================================= */}
        <section className="section milestones" id="milestones">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Journey & Milestones</div>
              <h2 className="serif">A little of what shaped me.</h2>
            </div>

            <Timeline3D />
          </div>
        </section>
      </main>

      {/* =================================================================
          CONTACT SECTION & 3D FOOTER
          ================================================================= */}
      <footer className="contact" id="contact">
        <div className="container">
          <div className="contact-3d-layout">
            <div className="contact-card-3d">
              <div className="eyebrow">Get in touch</div>
              <h2 className="serif">
                Let's design something that moves <span className="pink-italic">people.</span>
              </h2>
              <p className="contact-lead">
                I'm actively seeking remote UI/UX Design and Frontend Engineering internships. Whether you have a question or an exciting opportunity, my inbox is open!
              </p>

              <div className="contact-actions-row">
                <a className="pill pill-primary" href={`mailto:${EMAIL}`} data-testid="link-contact-email">
                  <Mail size={18} aria-hidden="true" /> {EMAIL} <ArrowUpRight size={16} />
                </a>
                <button className="copy-email-btn" onClick={copyEmail} data-testid="button-copy-email">
                  <Copy size={16} /> Copy email
                </button>
              </div>

              <div className="social-links-3d" aria-label="Social and portfolio links">
                <a href={LINKS.linkedin} {...externalProps} className="social-3d-link" data-testid="link-linkedin">
                  LinkedIn <ArrowUpRight size={13} />
                </a>
                <a href={LINKS.behance} {...externalProps} className="social-3d-link" data-testid="link-behance">
                  Behance <ArrowUpRight size={13} />
                </a>
                <a href={LINKS.github} {...externalProps} className="social-3d-link" data-testid="link-github">
                  <Code2 size={15} /> GitHub
                </a>
                <a href={asset('resume.pdf')} download className="social-3d-link" data-testid="link-resume-footer">
                  Resume (PDF) <ArrowDown size={13} />
                </a>
              </div>
            </div>

            {/* 3D Floating Glass Envelope & Rose-Gold Orbital Scene */}
            <ContactScene3D />
          </div>

          <div className="site-footer-bar">
            <span>© 2026 Vaishnavi Kedar · Designed & Engineered with Three.js & React · Mumbai, India</span>
            <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Scroll back to top">
              <span>Back to Top</span>
              <ChevronUp size={16} />
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="toast" role="status" aria-live="polite" data-testid="status-copy-toast">
          <Check size={16} style={{ verticalAlign: 'middle', marginRight: 8, color: '#0ca678' }} />
          {toast}
        </div>
      )}

      {/* Accessible Case Study Dialog Modal */}
      {openCase && (() => {
        const study = caseStudies[openCase];
        return (
          <div
            className="dialog-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeDialog();
            }}
            data-testid="overlay-case-dialog"
          >
            <section
              className="dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-dialog-title"
              tabIndex={-1}
              ref={dialogRef}
              data-testid={`dialog-${study.id}-case-study`}
            >
              <button
                className="dialog-close"
                aria-label={`Close ${study.title} case study`}
                onClick={closeDialog}
                data-testid="button-close-case"
              >
                <X size={20} />
              </button>
              <div className="eyebrow">{study.eyebrow}</div>
              <h2 id="case-dialog-title">{study.title}</h2>
              <dl className="case-meta">
                {study.meta.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <h3>The problem</h3>
              <p>{study.problem}</p>
              <h3>What it does</h3>
              <ul className="case-list">
                {study.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3>Design decisions</h3>
              <div className="case-decisions">
                {study.decisions.map((item, i) => (
                  <article key={item.title}>
                    <span>0{i + 1}</span>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
              <div className={`dialog-phones ${study.images.length === 1 ? 'single' : ''}`}>
                {study.images.map((image) => (
                  <img
                    key={image.file}
                    src={asset(image.file)}
                    alt={image.alt}
                    width="407"
                    height="820"
                    loading="lazy"
                  />
                ))}
              </div>
              <p className="dialog-note">{study.title} screen previews</p>
              <h3>Result</h3>
              <p>{study.result}</p>
              <a
                className="pill pill-primary"
                href={study.link}
                {...externalProps}
                data-testid={`link-dialog-${study.id}-figma`}
              >
                {study.linkLabel} <ArrowUpRight size={16} />
              </a>
            </section>
          </div>
        );
      })()}
      <span className="sr-only" aria-live="polite">
        {active ? `Current section: ${active}` : ''}
      </span>
    </div>
  );
}

export default App;

import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BellRing, Check, Code2,
  Compass, Copy, Lightbulb, Mail, PencilRuler, RotateCcw, Search, ShieldCheck, Sparkles,
  X, type LucideIcon,
} from 'lucide-react';

// Base-aware asset path: works on GitHub Pages sub-paths, Netlify, Vercel and Replit.
const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;
// Email/LinkedIn below match the resume PDF.
const EMAIL = 'vaishnavikedar459@gmail.com';
const AVIRA_PROTOTYPE = 'https://www.figma.com/proto/4z78d3naEOI0XzCR0oc4J7/AVIRA?node-id=18-5970&p=f&t=HTtdusOLcz7s1fXC-1&scaling=scale-down&content-scaling=fixed&page-id=12%3A790&starting-point-node-id=18%3A5970';
const MISS_BEAUTIFUL_PROTOTYPE = 'https://www.figma.com/proto/Ampa8dUqHSzoXFItj7pm28/Untitled?node-id=1-3&starting-point-node-id=1%3A3&t=egCvDO26mciPSxTV-1';
const LINKS = {
  avira: 'https://www.figma.com/design/4z78d3naEOI0XzCR0oc4J7/AVIRA?node-id=12-790&t=FlMtIR4sxAwxxGSA-1',
  aviraPrototype: AVIRA_PROTOTYPE,
  civicFix: 'https://www.figma.com/proto/7ua1fjJwYSe9NK58SMV0k3/civic_fix?node-id=29-104',
  aura: 'https://www.figma.com/proto/Ampa8dUqHSzoXFItj7pm28/Untitled?node-id=1-3&starting-point-node-id=1%3A3',
  missBeautiful: MISS_BEAUTIFUL_PROTOTYPE,
  anuvaad: 'https://vaishnvikedar6-jpg.github.io/Anuvaad-chatbot/',
  cyberGuard: 'https://vaishnvikedar6-jpg.github.io/OIBSIP/Level1_Task1/',
  linkedin: 'https://www.linkedin.com/in/vaishnavi-kedar-5a306039b/',
  github: 'https://github.com/vaishnvikedar6-jpg',
  behance: 'https://www.behance.net/vaishnavikedar_31',
};
const steps: { label: string; description: string; Icon: LucideIcon }[] = [
  { label: 'DISCOVER', description: 'Listen closely and learn what matters.', Icon: Search },
  { label: 'DEFINE', description: 'Frame the challenge with clarity.', Icon: Compass },
  { label: 'DESIGN', description: 'Explore useful, thoughtful solutions.', Icon: PencilRuler },
  { label: 'PROTOTYPE', description: 'Make ideas tangible and testable.', Icon: Lightbulb },
  { label: 'REFINE', description: 'Polish details through iteration.', Icon: Sparkles },
];
const certifications = [
  'Figma Web Design (Simplilearn)',
  'Foundations of Prompt Engineering (AWS)',
  'SQL and Relational Databases 101 (IBM)',
  'AWS Solutions Architecture Job Simulation',
  'Web Development HTML/CSS/JS (Udemy)',
  'Generative AI Career Essentials (Microsoft and LinkedIn)',
  'Canva Design Certification',
  'Introduction to Cloud Computing (Infosys Springboard)',
];
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
    problem: 'Travelling alone as a woman carries a constant, quiet anxiety: is this route safe, did I get home, and how do I ask for help fast? AVIRA tackles that vulnerability with non-intrusive safety scores, automated check-ins and a rapid, zero-friction emergency pipeline, so nobody has to keep texting “reached?”.',
    features: [
      'Real-time, safety-rated route planning',
      'Proactive “Avira Pulse” check-ins',
      'Automated arrival confirmations',
      'Instant SOS response workflow',
    ],
    decisions: [
      { title: 'Colour psychology', text: 'Coral red is reserved for SOS and emergency alerts only, so it never loses its meaning. Mint green marks verified safe routes and successful arrivals, on a minimal neutral canvas so route scores stay scannable on the go.' },
      { title: 'A silent, one-tap pulse', text: 'A gentle “Are you safe?” prompt replaces anxious manual texting. One quiet tap confirms you are fine; if nobody responds before the timer ends, the trusted circle is alerted.' },
      { title: 'Arrival without effort', text: 'When the journey ends inside a safe zone, parents or roommates are told automatically. Safety information flows to the people who need it without the commuter lifting a finger.' },
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
    problem: 'Reporting a pothole or a broken streetlight is slow and opaque, so residents give up and nobody knows what happened to their report. Civic Fix is a civic issue-reporting app that makes reporting quick and the outcome visible.',
    features: [
      'Quick reporting flow with photo proof and location',
      'Clear status tracking from submitted to resolved',
      'Community upvoting to surface urgent issues',
      'Quick and voice report actions on the home screen',
    ],
    decisions: [
      { title: 'Intuitive reporting flows', text: 'The primary action sits on the home screen, with quick and voice options, so reporting takes only a few taps.' },
      { title: 'Visual hierarchy', text: 'One clear action per screen, strong headings and calm colour keep the interface readable at a glance.' },
      { title: 'Accessible by default', text: 'Accessible interface design was a stated goal from the start: readable type, clear contrast and comfortable tap targets, even under the hackathon’s tight time limit.' },
    ],
    result: 'Delivered a complete, clickable prototype within the hackathon time limit.',
    images: [{ file: 'civic-fix-1.png', alt: 'Civic Fix Smart Civic Reporter home screen' }],
    link: LINKS.civicFix,
    linkLabel: 'View prototype',
  },
};

/** Small, safe demo of the "Avira Pulse" idea from the case study (nothing is sent anywhere). */
function PulseDemo() {
  const START = 10;
  const [left, setLeft] = useState(START);
  const [state, setState] = useState<'waiting' | 'safe' | 'alert'>('waiting');

  useEffect(() => {
    if (state !== 'waiting') return;
    if (left <= 0) { setState('alert'); return; }
    const timer = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [left, state]);

  const reset = () => { setLeft(START); setState('waiting'); };
  const message = state === 'safe'
    ? 'Reassured with one tap. Your circle stays quiet.'
    : state === 'alert'
      ? 'No response, so the trusted circle would be alerted now.'
      : 'Are you feeling safe? Tap before the timer ends.';

  return (
    <div className={`pulse-demo ${state}`} data-testid="demo-avira-pulse">
      <div className="pulse-head"><BellRing size={18} aria-hidden="true" /><strong>Try the Avira Pulse</strong><span>10-second demo</span></div>
      <div className="pulse-body">
        <span className="pulse-time" aria-hidden="true">00:{String(Math.max(left, 0)).padStart(2, '0')}</span>
        <p aria-live="polite">{message}</p>
      </div>
      <div className="pulse-actions">
        {state === 'waiting'
          ? <button className="pill" onClick={() => setState('safe')} data-testid="button-pulse-safe"><ShieldCheck size={17} aria-hidden="true" /> I’m safe</button>
          : <button className="pill outline" onClick={reset} data-testid="button-pulse-replay"><RotateCcw size={16} aria-hidden="true" /> Replay</button>}
      </div>
    </div>
  );
}

function Blossom({ className }: { className: string }) {
  const id = useId().replace(/:/g, '');
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-petals`} cx="0" cy="0" r="1" gradientTransform="matrix(0 24 -23 0 17 11)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff7f8" />
        <stop offset=".58" stopColor="#f2b2c2" />
        <stop offset="1" stopColor="#d6336c" />
      </radialGradient>
      <radialGradient id={`${id}-center`} cx="0" cy="0" r="1" gradientTransform="matrix(0 5 -5 0 22 21)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff0b9" />
        <stop offset="1" stopColor="#d98f49" />
      </radialGradient>
    </defs>
    <g fill={`url(#${id}-petals)`} opacity=".9">
      <ellipse cx="24" cy="11" rx="5.2" ry="10" />
      <ellipse cx="24" cy="11" rx="5.2" ry="10" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="11" rx="5.2" ry="10" transform="rotate(120 24 24)" />
      <ellipse cx="24" cy="11" rx="5.2" ry="10" transform="rotate(180 24 24)" />
      <ellipse cx="24" cy="11" rx="5.2" ry="10" transform="rotate(240 24 24)" />
      <ellipse cx="24" cy="11" rx="5.2" ry="10" transform="rotate(300 24 24)" />
    </g>
    <circle cx="24" cy="24" r="4.3" fill={`url(#${id}-center)`} />
  </svg>;
}

function setPointerTilt(event: ReactPointerEvent<HTMLElement>) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const element = event.currentTarget;
  const bounds = element.getBoundingClientRect();
  const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
  const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
  element.style.setProperty('--tilt-x', `${(-y * 6).toFixed(2)}deg`);
  element.style.setProperty('--tilt-y', `${(x * 6).toFixed(2)}deg`);
  element.style.setProperty('--pointer-x', `${((x + 1) * 50).toFixed(1)}%`);
  element.style.setProperty('--pointer-y', `${((y + 1) * 50).toFixed(1)}%`);
}

function resetPointerTilt(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg');
  event.currentTarget.style.setProperty('--tilt-y', '0deg');
  event.currentTarget.style.setProperty('--pointer-x', '50%');
  event.currentTarget.style.setProperty('--pointer-y', '40%');
}

function App() {
  const [active, setActive] = useState('home');
  const [progress, setProgress] = useState(0);
  const [openCase, setOpenCase] = useState<CaseStudy['id'] | null>(null);
  const dialogOpen = openCase !== null;
  const [stepSelected, setStepSelected] = useState(-1);
  const [toast, setToast] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let frame = 0;
    const blobs = Array.from(document.querySelectorAll<HTMLElement>('.parallax-blob'));
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          blobs.forEach((blob) => {
            const distance = window.innerHeight / 2 - blob.getBoundingClientRect().top;
            const shift = Math.max(-32, Math.min(32, distance * 0.035));
            blob.style.setProperty('--parallax-y', `${shift.toFixed(1)}px`);
          });
        }
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const sections = document.querySelectorAll<HTMLElement>('main section[id], footer[id]');
    let revealObserver: IntersectionObserver | undefined;
    let sectionObserver: IntersectionObserver | undefined;
    try {
      if ('IntersectionObserver' in window) {
        revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver?.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        targets.forEach((target, i) => {
          target.style.transitionDelay = `${(i % 4) * 75}ms`;
          revealObserver?.observe(target);
        });
        sectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        }, { rootMargin: '-30% 0px -60% 0px' });
        sections.forEach((section) => sectionObserver?.observe(section));
        document.documentElement.classList.add('reveal-active');
      }
    } catch {
      revealObserver?.disconnect();
      sectionObserver?.disconnect();
      document.documentElement.classList.remove('reveal-active');
    }
    return () => {
      window.removeEventListener('scroll', update);
      window.cancelAnimationFrame(frame);
      revealObserver?.disconnect();
      sectionObserver?.disconnect();
      document.documentElement.classList.remove('reveal-active');
    };
  }, []);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const stats = document.querySelectorAll<HTMLElement>('.stat strong');
    if (!stats.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
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
        const duration = 850;
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
    }, { threshold: 0.45 });
    stats.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

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
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
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
  const openCaseStudy = (id: CaseStudy['id'], el: HTMLElement) => { lastTrigger.current = el; setOpenCase(id); };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setToast('Copied!');
    } catch {
      setToast(EMAIL);
    }
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <div className="site">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="nav-wrap">
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="Vaishnavi Kedar, home" data-testid="link-home">
            <span className="brand-mark">VK</span><span>Vaishnavi Kedar</span>
          </a>
          <div className="nav-links">
            {['Home', 'About', 'Work', 'Process', 'Experience', 'Contact'].map((item) => {
              const id = item === 'Experience' ? 'milestones' : item.toLowerCase();
              return <a key={item} className={active === id ? 'active' : ''} aria-current={active === id ? 'true' : undefined} href={`#${id}`} data-testid={`link-nav-${id}`}>{item}</a>;
            })}
          </div>
          <a className="nav-resume" href={asset('resume.pdf')} download data-testid="link-resume-nav">Resume <ArrowDown size={14} aria-hidden="true" /></a>
        </nav>
        <div className="top-progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
      </header>

      <main id="main">
        <section className="container hero" id="home">
          <span className="parallax-blob blob-hero" aria-hidden="true" />
          <div className="hero-text reveal" data-reveal>
            <div className="eyebrow">UI/UX Designer · Full-Stack Developer</div>
            <h1 className="serif">
              <span className="hero-headline-piece">I</span>{' '}
              <span className="hero-headline-piece">design</span>{' '}
              <span className="pink-italic hero-headline-piece">how</span>{' '}
              <span className="pink-italic hero-headline-piece">it</span>{' '}
              <span className="pink-italic hero-headline-piece">feels.</span>
            </h1>
            <p className="hero-copy">Thoughtful digital experiences shaped by creativity, technology, and human connection. Open to remote internships.</p>
            <div className="hero-actions">
              <a className="pill" href="#work" data-testid="link-explore-work">Explore My Work <ArrowRight className="arrow" size={18} aria-hidden="true" /></a>
              <a className="text-link" href={asset('resume.pdf')} download data-testid="link-download-resume">Download resume</a>
            </div>
          </div>
          <div className="hero-art reveal" data-reveal>
            <Blossom className="flower f1" /><Blossom className="flower f2" /><Blossom className="flower f3" />
            <span className="petal p1" aria-hidden="true" /><span className="petal p2" aria-hidden="true" /><span className="petal p3" aria-hidden="true" />
            <img className="hero-photo" src={asset('hero-photo.png')} alt="Vaishnavi Kedar smiling in a portrait with pink flowers" width="580" height="412" fetchPriority="high" />
            <div className="award"><strong>Top 6 of 193+</strong>Drishti UI/UX Designathon</div>
          </div>
        </section>

        <section className="section work-section" id="work">
          <span className="parallax-blob blob-work" aria-hidden="true" />
          <div className="container">
            <span className="berry-blob blob-berry-avira" aria-hidden="true" />
            <span className="berry-blob blob-berry-smoothie" aria-hidden="true" />
            <div className="section-head reveal" data-reveal>
              <div className="eyebrow">Selected work</div>
              <h2 className="serif">Designs that make an impact.</h2>
            </div>
            <article className="featured reveal" data-reveal>
              <div>
                <span className="feature-tag">Top 6 of 193+ · Drishti, CESA VIT Mumbai</span>
                <h3>AVIRA</h3>
                <p>A safety-first transit companion for women commuters: safety-rated route planning, proactive “Avira Pulse” check-ins, automated arrival confirmations and an instant SOS workflow. Designed with a team of two.</p>
                <div className="tags"><span className="tag">Mobile App</span><span className="tag">UX Research</span><span className="tag">Color Psychology</span></div>
                <div className="featured-actions">
                  <button className="pill" onClick={(event) => openCaseStudy('avira', event.currentTarget)} data-testid="button-avira-case-study">Read case study <ArrowRight className="arrow" size={17} aria-hidden="true" /></button>
                  <a className="pill outline" href={LINKS.aviraPrototype} {...externalProps} data-testid="link-avira-prototype">View prototype <ArrowUpRight size={16} aria-hidden="true" /></a>
                  <a className="design-file-link" href={LINKS.avira} {...externalProps} data-testid="link-avira-design-file">View design file <ArrowUpRight size={14} aria-hidden="true" /></a>
                </div>
              </div>
              <div className="phones" aria-label="AVIRA mobile app screen previews" onPointerMove={setPointerTilt} onPointerLeave={resetPointerTilt}>
                 <img src={asset('avira-1.png')} alt="AVIRA home screen showing trip planning, SOS, pulse and trusted circle" width="407" height="820" loading="lazy" />
                 <img src={asset('avira-2.png')} alt="AVIRA route screen showing transit guidance and safety assistance" width="401" height="815" loading="lazy" />
              </div>
            </article>
            <div className="project-grid">
              <article className="project-card reveal" data-reveal onPointerMove={setPointerTilt} onPointerLeave={resetPointerTilt}>
                <div className="project-image"><img src={asset('civic-fix-1.png')} alt="Civic Fix Smart Civic Reporter app home screen with quick and voice report actions" width="401" height="819" loading="lazy" /></div>
                <div className="project-content"><h3>Civic Fix</h3><p>Civic issue-reporting prototype with clear flows and accessible design. PixelVerse UI/UX Hackathon, GDG on Campus SIES GST.</p><div className="card-links"><button className="card-case-btn" onClick={(event) => openCaseStudy('civic-fix', event.currentTarget)} data-testid="button-civic-case-study">Read case study <ArrowRight size={14} aria-hidden="true" /></button><a href={LINKS.civicFix} {...externalProps} data-testid="link-project-civic-fix">View prototype <ArrowUpRight size={14} aria-hidden="true" /></a></div></div>
              </article>
              <article className="project-card reveal" data-reveal onPointerMove={setPointerTilt} onPointerLeave={resetPointerTilt}>
                <div className="project-image"><img src={asset('aura-1.png')} alt="Aura women's wellness app concept screen with a calm, plum-toned design" width="404" height="316" loading="lazy" /></div>
                <div className="project-content"><h3>Aura</h3><p>A women's wellness app with an empathetic, calm interface.</p><a href={LINKS.aura} {...externalProps} data-testid="link-project-aura">View project <ArrowRight size={14} /></a></div>
              </article>
              <article className="project-card reveal" data-reveal onPointerMove={setPointerTilt} onPointerLeave={resetPointerTilt}>
                <div className="project-image project-image-pair" aria-label="Miss Beautiful design screens">
                  <a className="miss-main" href={asset('miss-beautiful-1.png')} target="_blank" rel="noopener noreferrer" aria-label="Open Miss Beautiful screen one">
                    <img src={asset('miss-beautiful-1.png')} alt="Miss Beautiful landing screen with the words Precision in Every Touch" width="1141" height="777" loading="lazy" />
                  </a>
                  <a className="miss-secondary" href={asset('miss-beautiful-2.png')} target="_blank" rel="noopener noreferrer" aria-label="Open Miss Beautiful screen two">
                    <img src={asset('miss-beautiful-2.png')} alt="Miss Beautiful website screen showing navigation, products, and beauty imagery" width="1161" height="768" loading="lazy" />
                  </a>
                </div>
                <div className="project-content"><h3>Miss Beautiful</h3><p>“Precision in Every Touch”</p><a href={LINKS.missBeautiful} {...externalProps} data-testid="link-project-miss-beautiful">View project <ArrowRight size={14} /></a></div>
              </article>
              <article className="project-card reveal" data-reveal onPointerMove={setPointerTilt} onPointerLeave={resetPointerTilt}>
                <div className="project-image project-image-berry project-image-trio" role="group" aria-label="Smoothiefy app screens">
                  <img className="berry-left" src={asset('smoothiefy-2.png')} alt="Smoothiefy login screen with email, password and a Login button" width="218" height="470" loading="lazy" />
                  <img className="berry-right" src={asset('smoothiefy-3.png')} alt="Smoothiefy product selection screen: what is your choice, with ice-cream options" width="218" height="470" loading="lazy" />
                  <img className="berry-main" src={asset('smoothiefy-1.png')} alt="Smoothiefy splash screen with a strawberry smoothie and strawberries" width="219" height="470" loading="lazy" />
                </div>
                <div className="project-content"><h3>Smoothiefy</h3><p>A smoothie and ice-cream ordering app concept: splash, login and product selection screens.</p><div className="card-links"><span className="card-note">Concept · Mobile UI</span></div></div>
              </article>
            </div>
            <div className="also reveal" data-reveal>
              <strong>Also built</strong>
              <ul>
                <li><span>AyushLink</span> offline-first healthcare app · Frontend and Deployment</li>
                <li><a href={LINKS.anuvaad} {...externalProps} data-testid="link-also-anuvaad">Anuvaad <ArrowUpRight size={13} aria-hidden="true" /></a> multilingual AI translation chatbot</li>
                <li><span>Smart City Planning Dashboard</span> React, Recharts, data</li>
                <li><a href={LINKS.cyberGuard} {...externalProps} data-testid="link-also-cyberguard">CyberGuard Suite <ArrowUpRight size={13} aria-hidden="true" /></a> responsive landing page · Oasis Infobyte</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <span className="parallax-blob blob-process" aria-hidden="true" />
          <div className="container">
            <div className="section-head reveal" data-reveal><div className="eyebrow">My process</div><h2 className="serif">From idea to impact.</h2></div>
            <div className="process-row">
              {steps.map(({ label, description, Icon }, i) => <button key={label} className={`process-step reveal ${stepSelected === i ? 'selected' : ''}`} data-reveal onMouseEnter={() => setStepSelected(i)} onFocus={() => setStepSelected(i)} onClick={() => setStepSelected(i)} aria-pressed={stepSelected === i} data-testid={`button-process-${label.toLowerCase()}`}>
                <span className="step-circle"><Icon size={29} strokeWidth={1.7} aria-hidden="true" /></span><span className="step-name">{label}</span><span className="step-description">{description}</span>
              </button>)}
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <span className="parallax-blob blob-about" aria-hidden="true" />
          <div className="container about">
            <div className="about-image-wrap reveal" data-reveal>
              <img className="about-image" src={asset('about-photo.png')} alt="Vaishnavi Kedar in a circular portrait, wearing a light pink top" width="214" height="217" loading="lazy" />
            </div>
            <div className="about-copy reveal" data-reveal>
              <div className="eyebrow">A little about me</div>
              <h2 className="serif">An engineer by education. A designer by curiosity.</h2>
              <p>I'm a Computer Engineering student who loves turning ideas into interfaces people enjoy using. I design in Figma, build with code, and work on healthcare, civic-tech and AI projects.</p>
              <div className="skill-group"><span className="skill-label">Design</span>{['Figma', 'Canva', 'Wireframing', 'Prototyping', 'User Research'].map((s) => <span className="tag" key={s}>{s}</span>)}</div>
              <div className="skill-group"><span className="skill-label">Code</span>{['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'SQL'].map((s) => <span className="tag" key={s}>{s}</span>)}</div>
              <div className="stats">
                <div className="stat"><strong>9.86</strong><span>CGPA · 2nd year</span></div>
                <div className="stat"><strong>2</strong><span>UI/UX hackathons</span></div>
                <div className="stat"><strong>8</strong><span>certifications</span></div>
              </div>
              <a className="pill" href={asset('resume.pdf')} download data-testid="link-about-resume">Download resume <ArrowDown size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="section milestones" id="milestones">
          <span className="parallax-blob blob-milestones" aria-hidden="true" />
          <div className="container">
            <div className="section-head reveal" data-reveal><div className="eyebrow">Milestones & learnings</div><h2 className="serif">A little of what shaped me.</h2></div>
            <div className="milestone-grid">
              <article className="milestone reveal" data-reveal><h3>Drishti UI/UX Designathon</h3><p>CESA, VIT Mumbai · Oct 2026<br />Top 6 of 193+ registrations</p></article>
              <article className="milestone reveal" data-reveal><h3>PixelVerse UI/UX Hackathon</h3><p>GDG on Campus, SIES GST · Mar 2026</p></article>
              <article className="milestone reveal" data-reveal><h3>B.E. Computer Engineering</h3><p>SIES Graduate School of Technology · 2024–2028<br />CGPA 9.86 in 2nd year</p></article>
              <article className="milestone reveal" data-reveal><h3>Web Development and Design Intern</h3><p>Oasis Infobyte · Remote · Nov–Dec 2024</p></article>
            </div>
            <div className="certs reveal" data-reveal>
              <h3>Certifications</h3><ul className="cert-list">{certifications.map((cert) => <li key={cert}>{cert}</li>)}</ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="contact" id="contact">
        <div className="footer-flora" aria-hidden="true">
          <Blossom className="flower footer-flower footer-flower-one" />
          <Blossom className="flower footer-flower footer-flower-two" />
          <span className="petal footer-petal footer-petal-one" />
          <span className="petal footer-petal footer-petal-two" />
        </div>
        <div className="container">
          <div className="eyebrow">Contact</div>
          <h2 className="serif">Let's design something that moves <span className="pink-italic">people.</span></h2>
          <p>Open to remote internships.</p>
          <a className="pill" href={`mailto:${EMAIL}`} data-testid="link-contact-email"><Mail size={18} aria-hidden="true" /> {EMAIL} <ArrowUpRight size={16} aria-hidden="true" /></a>
          <div className="socials" aria-label="Connect with Vaishnavi">
            <a href={LINKS.linkedin} {...externalProps} data-testid="link-linkedin">LinkedIn <ArrowUpRight size={14} /></a>
            <a href={LINKS.behance} {...externalProps} data-testid="link-behance">Behance <ArrowUpRight size={14} /></a>
            <a href={LINKS.github} {...externalProps} data-testid="link-github"><Code2 size={15} />GitHub</a>
            <button onClick={copyEmail} data-testid="button-copy-email"><Copy size={15} />Copy email</button>
            <a href={asset('resume.pdf')} download data-testid="link-resume-footer">Resume <ArrowDown size={14} /></a>
          </div>
          <div className="copyright">© 2026 Vaishnavi Kedar. All rights reserved. · Mumbai, India</div>
        </div>
      </footer>

      {toast && <div className="toast" role="status" aria-live="polite" data-testid="status-copy-toast">{toast === 'Copied!' ? <><Check size={16} style={{ verticalAlign: 'middle', marginRight: 7 }} />Copied!</> : toast}</div>}
      {openCase && (() => {
        const study = caseStudies[openCase];
        return <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }} data-testid="overlay-case-dialog">
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="case-dialog-title" tabIndex={-1} ref={dialogRef} data-testid={`dialog-${study.id}-case-study`}>
            <button className="dialog-close" aria-label={`Close ${study.title} case study`} onClick={closeDialog} data-testid="button-close-case"><X size={20} /></button>
            <div className="eyebrow">{study.eyebrow}</div>
            <h2 id="case-dialog-title">{study.title}</h2>
            <dl className="case-meta">{study.meta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            <h3>The problem</h3>
            <p>{study.problem}</p>
            <h3>What it does</h3>
            <ul className="case-list">{study.features.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>Design decisions</h3>
            <div className="case-decisions">{study.decisions.map((item, i) => <article key={item.title}><span>0{i + 1}</span><h4>{item.title}</h4><p>{item.text}</p></article>)}</div>
            <div className={`dialog-phones ${study.images.length === 1 ? 'single' : ''}`}>
              {study.images.map((image) => <img key={image.file} src={asset(image.file)} alt={image.alt} width="407" height="820" loading="lazy" />)}
            </div>
            <p className="dialog-note">{study.title} screen previews</p>
            {study.id === 'avira' && <PulseDemo />}
            <h3>Result</h3>
            <p>{study.result}</p>
            <a className="pill" href={study.link} {...externalProps} data-testid={`link-dialog-${study.id}-figma`}>{study.linkLabel} <ArrowUpRight size={16} /></a>
          </section>
        </div>;
      })()}
      <span className="sr-only" aria-live="polite">{active ? `Current section: ${active}` : ''}</span>
    </div>
  );
}

export default App;

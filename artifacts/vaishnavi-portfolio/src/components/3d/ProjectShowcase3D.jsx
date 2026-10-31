import React, { useState } from 'react';
import InteractiveCard3D from './InteractiveCard3D';
import { AyushLinkScene3D, AnuvaadScene3D, PipelineScene3D } from './ProjectVisual3D';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  BellRing,
  HeartPulse,
  Bot,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Monitor,
  Activity,
  Globe2,
} from 'lucide-react';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;
const externalProps = { target: '_blank', rel: 'noopener noreferrer' };

export default function ProjectShowcase3D({ openCaseStudy, LINKS }) {
  // Pulse Demo state for AVIRA
  const START = 10;
  const [pulseLeft, setPulseLeft] = useState(START);
  const [pulseState, setPulseState] = useState('waiting');

  React.useEffect(() => {
    if (pulseState !== 'waiting') return;
    if (pulseLeft <= 0) {
      setPulseState('alert');
      return;
    }
    const timer = window.setTimeout(() => setPulseLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [pulseLeft, pulseState]);

  const resetPulse = () => {
    setPulseLeft(START);
    setPulseState('waiting');
  };

  const pulseMessage =
    pulseState === 'safe'
      ? 'Reassured with one tap. Your circle stays quiet.'
      : pulseState === 'alert'
      ? 'No response: trusted emergency circle is alerted immediately.'
      : 'Are you feeling safe? Tap before the 10-second timer ends.';

  return (
    <div className="projects-showcase-3d">
      {/* 1. FEATURED HERO PROJECT: AVIRA (Women Safety Transit Companion) */}
      <InteractiveCard3D
        id="project-avira"
        className="featured-project-3d"
        depth={25}
        glowColor="rgba(214, 51, 108, 0.25)"
      >
        <div className="featured-3d-grid">
          <div className="featured-info-col">
            <div className="badge-row">
              <span className="trophy-tag">
                <Sparkles size={14} aria-hidden="true" /> Top 6 of 193+ · Drishti CESA VIT Mumbai
              </span>
              <span className="platform-tag">Mobile UX</span>
            </div>

            <h3 className="featured-title">AVIRA</h3>
            <p className="featured-lead">
              A safety-first transit companion for women commuters. Designed to replace anxious manual “reached?” check-ins with non-intrusive safety scores, automated arrival confirmations, proactive Avira Pulse check-ins, and a zero-friction emergency SOS pipeline.
            </p>

            <div className="key-attributes-row">
              <div className="attr-pill">
                <ShieldCheck size={16} className="icon-emerald" />
                <span>Real-Time Safety Scoring</span>
              </div>
              <div className="attr-pill">
                <BellRing size={16} className="icon-rose" />
                <span>Automated Arrival Alerts</span>
              </div>
              <div className="attr-pill">
                <Activity size={16} className="icon-rose" />
                <span>1-Tap SOS Workflow</span>
              </div>
            </div>

            {/* Interactive Avira Pulse Widget */}
            <div className={`pulse-demo ${pulseState}`} data-testid="demo-avira-pulse">
              <div className="pulse-head">
                <BellRing size={17} aria-hidden="true" />
                <strong>Try the Avira Pulse Check-in</strong>
                <span className="pulse-timer-chip">00:{String(Math.max(pulseLeft, 0)).padStart(2, '0')}</span>
              </div>
              <p className="pulse-msg" aria-live="polite">{pulseMessage}</p>
              <div className="pulse-actions">
                {pulseState === 'waiting' ? (
                  <button className="pill pill-safe" onClick={() => setPulseState('safe')}>
                    <ShieldCheck size={16} /> I'm Safe
                  </button>
                ) : (
                  <button className="pill outline" onClick={resetPulse}>
                    <RotateCcw size={15} /> Replay Demo
                  </button>
                )}
              </div>
            </div>

            <div className="action-buttons-group">
              <button
                className="pill pill-primary"
                onClick={(e) => openCaseStudy('avira', e.currentTarget)}
                data-testid="button-avira-case-study"
              >
                Read Case Study <ArrowRight size={17} className="arrow" />
              </button>
              <a
                className="pill pill-outline"
                href={LINKS.aviraPrototype}
                {...externalProps}
                data-testid="link-avira-prototype"
              >
                View Figma Prototype <ArrowUpRight size={16} />
              </a>
              <a
                className="design-link-subtle"
                href={LINKS.avira}
                {...externalProps}
                data-testid="link-avira-design-file"
              >
                Design File <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Dimensional Phone Screens Showcase with Depth */}
          <div className="featured-visual-col">
            <div className="dimensional-phones-stage" aria-label="AVIRA mobile screen previews">
              <div className="phone-mockup phone-front">
                <img
                  src={asset('avira-1.png')}
                  alt="AVIRA home screen showing trip planning, SOS, pulse and trusted circle"
                  width="407"
                  height="820"
                  loading="lazy"
                />
                <div className="phone-glare" aria-hidden="true" />
              </div>
              <div className="phone-mockup phone-back">
                <img
                  src={asset('avira-2.png')}
                  alt="AVIRA route guidance and assistance screen"
                  width="401"
                  height="815"
                  loading="lazy"
                />
                <div className="phone-glare" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </InteractiveCard3D>

      {/* 2. SECONDARY 3D PROJECTS GRID */}
      <div className="projects-cards-grid">
        {/* AYUSHLINK-FINAL: Healthcare-Themed 3D Dashboard */}
        <InteractiveCard3D id="project-ayushlink" className="project-grid-card healthcare-card" depth={20} glowColor="rgba(32, 201, 151, 0.22)">
          <div className="card-image-display ayushlink-preview-wrap">
            <a href={LINKS.ayushlink} {...externalProps}>
              <img
                src={asset('ayushlink.jpg')}
                alt="AyushLink - Healthcare that works even without the Internet"
                width="380"
                height="380"
                loading="lazy"
              />
            </a>
            <div className="canvas-badge healthcare">
              <HeartPulse size={14} /> Offline-First Health
            </div>
          </div>
          <div className="card-body">
            <div className="card-category">Healthcare Systems · Frontend & Deployment</div>
            <h3 className="card-title">AYUSHLINK-FINAL</h3>
            <p className="card-excerpt">
              Offline-first medical record & patient clinic dashboard designed for low-connectivity regions. Connect with care, records, and support — online or offline, anywhere you are.
            </p>
            <div className="card-tags">
              <span className="card-tag">React</span>
              <span className="card-tag">Offline-First</span>
              <span className="card-tag">Healthcare UI</span>
              <span className="card-tag">PWA Sync</span>
            </div>
            <div className="card-footer">
              <a href={LINKS.ayushlink} {...externalProps} className="card-action-btn">
                View Repository <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </InteractiveCard3D>

        {/* ANUVAAD CHATBOT: Layered 3D Multilingual AI Chat Showcase */}
        <InteractiveCard3D id="project-anuvaad" className="project-grid-card anuvaad-card" depth={20} glowColor="rgba(214, 51, 108, 0.22)">
          <div className="card-image-display anuvaad-preview-wrap">
            <img
              src={asset('anuvaad.png')}
              alt="Anuvaad - Bridging Voices, Connecting Bharat interface with 22 languages"
              width="600"
              height="338"
              loading="lazy"
            />
            <div className="canvas-badge anuvaad">
              <Bot size={14} /> AI Multilingual Chatbot
            </div>
          </div>
          <div className="card-body">
            <div className="card-category">Conversational AI · 22 Indian Languages</div>
            <h3 className="card-title">Anuvaad Chatbot</h3>
            <p className="card-excerpt">
              Multilingual artificial intelligence translation and conversational bot bridging 22 official languages across Bharat. Features instant dialect translation, language exploration chips, and speech translation workflows.
            </p>
            <div className="card-tags">
              <span className="card-tag">22 Languages</span>
              <span className="card-tag">Multilingual NLP</span>
              <span className="card-tag">React</span>
              <span className="card-tag">AI Chat UI</span>
            </div>
            <div className="card-footer">
              <a href={LINKS.anuvaad} {...externalProps} className="card-action-btn">
                Launch Live Chatbot <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </InteractiveCard3D>

        {/* CIVIC FIX: Smart Civic Reporter Hackathon Prototype */}
        <InteractiveCard3D id="project-civic-fix" className="project-grid-card civic-fix-card" depth={20} glowColor="rgba(110, 68, 89, 0.22)">
          <div className="card-image-display">
            <img
              src={asset('civic-fix-1.png')}
              alt="Civic Fix Smart Civic Reporter app screen"
              width="401"
              height="819"
              loading="lazy"
            />
            <div className="canvas-badge hackathon">PixelVerse UI/UX Hackathon</div>
          </div>
          <div className="card-body">
            <div className="card-category">Civic Tech · GDG SIES GST</div>
            <h3 className="card-title">Civic Fix</h3>
            <p className="card-excerpt">
              Citizen issue-reporting app making reporting potholes and broken utilities fast, trackable, and verifiable with voice and photo inputs.
            </p>
            <div className="card-tags">
              <span className="card-tag">Mobile Prototype</span>
              <span className="card-tag">Accessibility</span>
              <span className="card-tag">Civic Tech</span>
            </div>
            <div className="card-footer-buttons">
              <button
                className="card-text-btn"
                onClick={(e) => openCaseStudy('civic-fix', e.currentTarget)}
                data-testid="button-civic-case-study"
              >
                Case Study <ArrowRight size={14} />
              </button>
              <a href={LINKS.civicFix} {...externalProps} className="card-action-btn">
                Figma Prototype <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </InteractiveCard3D>

        {/* COURSE REGISTRATION CI/CD & DEVELOPER DASHBOARD */}
        <InteractiveCard3D id="project-coursereg" className="project-grid-card pipeline-card" depth={20} glowColor="rgba(212, 139, 153, 0.22)">
          <div className="card-image-display cicd-preview-wrap">
            <a href="https://course-registration-dashboard.onrender.com/" {...externalProps}>
              <img
                src={asset('coursereg-cicd.jpg')}
                alt="CourseReg v2.0 CI/CD University Portal and Live Deployment Status Dashboard"
                width="600"
                height="338"
                loading="lazy"
              />
            </a>
            <div className="canvas-badge devops">
              <Terminal size={14} /> Live CI/CD Platform
            </div>
          </div>
          <div className="card-body">
            <div className="card-category">DevOps & Cloud Systems</div>
            <h3 className="card-title">Course Registration CI/CD</h3>
            <p className="card-excerpt">
              Enterprise academic registration engine with real-time seat tracking, database-enforced capacity constraints, and zero-downtime automated deployment orchestrated with Flask, Docker, Jenkins & Render.
            </p>
            <div className="card-tags">
              <span className="card-tag">CI/CD Pipeline</span>
              <span className="card-tag">Docker & Jenkins</span>
              <span className="card-tag">Flask 3.1 & Gunicorn</span>
              <span className="card-tag">Live on Render</span>
            </div>
            <div className="card-footer-buttons">
              <a href="https://course-registration-dashboard.onrender.com/" {...externalProps} className="card-action-btn">
                Live Platform <ArrowUpRight size={14} />
              </a>
              <a href={LINKS.github} {...externalProps} className="card-text-btn">
                GitHub <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </InteractiveCard3D>

        {/* MY DESIGN PORTFOLIO: Dimensional Browser Window Mockup */}
        <InteractiveCard3D id="project-portfolio" className="project-grid-card portfolio-window-card" depth={20} glowColor="rgba(214, 51, 108, 0.25)">
          <div className="browser-mockup-header" aria-hidden="true">
            <div className="browser-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="browser-url-bar">
              <Globe2 size={12} />
              <span>vaishnavikedar.design/3d-portfolio</span>
            </div>
          </div>
          <div className="browser-mockup-body">
            <div className="mini-hero-preview">
              <div className="mini-photo-circle">
                <img src={asset('hero-photo.png')} alt="Vaishnavi Kedar" width="80" height="80" />
              </div>
              <div className="mini-title">I design how it feels.</div>
              <div className="mini-sub">3D Interactive Portfolio · Three.js & React</div>
            </div>
          </div>
          <div className="card-body">
            <div className="card-category">Creative Engineering · WebGL & Three.js</div>
            <h3 className="card-title">Immersive 3D Portfolio</h3>
            <p className="card-excerpt">
              A bespoke creative developer portfolio built with real-time Three.js shaders, React Three Fiber, physics-based 3D tilt, and cinematic editorial typography.
            </p>
            <div className="card-tags">
              <span className="card-tag">Three.js</span>
              <span className="card-tag">R3F</span>
              <span className="card-tag">React</span>
              <span className="card-tag">3D WebGL</span>
            </div>
            <div className="card-footer">
              <span className="status-live-indicator">
                <span className="status-dot green" /> Active 3D Environment
              </span>
            </div>
          </div>
        </InteractiveCard3D>

        {/* AURA: Women's Wellness App */}
        <InteractiveCard3D id="project-aura" className="project-grid-card aura-card" depth={20} glowColor="rgba(128, 43, 77, 0.22)">
          <div className="card-image-display aura-bg">
            <img
              src={asset('aura-1.png')}
              alt="Aura women's wellness app concept screen"
              width="404"
              height="316"
              loading="lazy"
            />
          </div>
          <div className="card-body">
            <div className="card-category">Mobile UI Concept · Wellness</div>
            <h3 className="card-title">Aura</h3>
            <p className="card-excerpt">
              A serene, empathetic wellness app tailored for women's cycle and mental well-being tracking, utilizing calming plum tones and friendly micro-interactions.
            </p>
            <div className="card-tags">
              <span className="card-tag">Mobile UI</span>
              <span className="card-tag">Wellness UX</span>
              <span className="card-tag">Figma</span>
            </div>
            <div className="card-footer">
              <a href={LINKS.aura} {...externalProps} className="card-action-btn">
                Explore in Figma <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </InteractiveCard3D>

        {/* MISS BEAUTIFUL: Luxury Beauty Editorial */}
        <InteractiveCard3D id="project-miss-beautiful" className="project-grid-card miss-beautiful-card" depth={20} glowColor="rgba(214, 51, 108, 0.22)">
          <div className="dual-image-preview">
            <a href={asset('miss-beautiful-1.png')} target="_blank" rel="noopener noreferrer">
              <img src={asset('miss-beautiful-1.png')} alt="Miss Beautiful screen 1" width="500" height="340" loading="lazy" />
            </a>
            <a href={asset('miss-beautiful-2.png')} target="_blank" rel="noopener noreferrer">
              <img src={asset('miss-beautiful-2.png')} alt="Miss Beautiful screen 2" width="500" height="340" loading="lazy" />
            </a>
          </div>
          <div className="card-body">
            <div className="card-category">Web Editorial Design</div>
            <h3 className="card-title">Miss Beautiful</h3>
            <p className="card-excerpt">
              “Precision in Every Touch” — high-fashion luxury cosmetics e-commerce layout featuring refined serif typography and seamless product staging.
            </p>
            <div className="card-tags">
              <span className="card-tag">E-Commerce</span>
              <span className="card-tag">Editorial UI</span>
              <span className="card-tag">Brand Aesthetics</span>
            </div>
            <div className="card-footer">
              <a href={LINKS.missBeautiful} {...externalProps} className="card-action-btn">
                View Project Prototype <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </InteractiveCard3D>

        {/* SMOOTHIEFY: Interactive Smartphone Trio */}
        <InteractiveCard3D id="project-smoothiefy" className="project-grid-card smoothiefy-card" depth={20} glowColor="rgba(214, 51, 108, 0.22)">
          <div className="trio-phone-preview" role="group" aria-label="Smoothiefy app screens">
            <img className="phone-sub phone-left" src={asset('smoothiefy-2.png')} alt="Smoothiefy login screen" width="160" height="340" loading="lazy" />
            <img className="phone-main" src={asset('smoothiefy-1.png')} alt="Smoothiefy splash screen" width="165" height="340" loading="lazy" />
            <img className="phone-sub phone-right" src={asset('smoothiefy-3.png')} alt="Smoothiefy product selection screen" width="160" height="340" loading="lazy" />
          </div>
          <div className="card-body">
            <div className="card-category">Mobile UI Concept · Quick Commerce</div>
            <h3 className="card-title">Smoothiefy</h3>
            <p className="card-excerpt">
              A playful smoothie and frozen dessert ordering app concept spanning splash, animated login, and visual flavor selector screens.
            </p>
            <div className="card-tags">
              <span className="card-tag">Food Delivery</span>
              <span className="card-tag">Mobile UI</span>
              <span className="card-tag">Visual Design</span>
            </div>
            <div className="card-footer">
              <span className="card-note-tag">Concept · Mobile UI</span>
            </div>
          </div>
        </InteractiveCard3D>
      </div>

      {/* ADDITIONAL MENTION ACCENT: CyberGuard Suite & Smart City */}
      <div className="also-built-3d-box">
        <h4 className="also-title">
          <Terminal size={18} className="icon-rose" /> Also Engineered & Designed
        </h4>
        <div className="also-links-grid">
          <a href={LINKS.cyberGuard} {...externalProps} className="also-card-link">
            <div className="link-title">CyberGuard Suite <ArrowUpRight size={14} /></div>
            <div className="link-sub">Responsive Security Landing Page · Oasis Infobyte</div>
          </a>
          <div className="also-card-static">
            <div className="link-title">Smart City Planning Dashboard</div>
            <div className="link-sub">Interactive Urban Analytics · React, Recharts & Open Data</div>
          </div>
        </div>
      </div>
    </div>
  );
}

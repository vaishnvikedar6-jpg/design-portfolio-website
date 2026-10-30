import React, { useState } from 'react';
import { ArrowDown, Menu, X } from 'lucide-react';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

export default function GlassNav({ active, progress }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Work', id: 'work' },
    { label: 'Skills', id: 'skills' },
    { label: 'About', id: 'about' },
    { label: 'Journey', id: 'milestones' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="glass-nav-header">
      {/* Top scroll progress glow line */}
      <div
        className="top-scroll-progress"
        aria-hidden="true"
        style={{ transform: `scaleX(${progress})` }}
      />

      <nav className="glass-nav-container" aria-label="Main navigation">
        {/* Brand Mark with 3D feel */}
        <a href="#home" className="glass-brand" data-testid="link-home">
          <div className="brand-monogram">
            <span>VK</span>
            <div className="monogram-glow" aria-hidden="true" />
          </div>
          <div className="brand-text-group">
            <span className="brand-name">Vaishnavi Kedar</span>
            <span className="brand-role">UI/UX & Creative Engineering</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="glass-nav-links">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`glass-nav-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                data-testid={`link-nav-${item.id}`}
              >
                {item.label}
                {isActive && <span className="nav-active-pill" aria-hidden="true" />}
              </a>
            );
          })}
        </div>

        {/* Right Action: Resume & Mobile Toggle */}
        <div className="glass-nav-right">
          <a
            href={asset('resume.pdf')}
            download
            className="glass-resume-btn"
            data-testid="link-resume-nav"
          >
            <span>Resume</span>
            <ArrowDown size={14} aria-hidden="true" />
          </a>

          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-links">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`mobile-drawer-link ${isActive ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

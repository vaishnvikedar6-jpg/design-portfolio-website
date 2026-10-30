import React, { useState } from 'react';
import { ExternalLink, X, Sparkles, Eye, Layers } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 'avira-ui',
    title: 'AVIRA Digital Safety Suite',
    category: 'mobile',
    categoryLabel: 'Mobile Safety UI',
    image: '/assets/avira.png',
    fallbackGrad: 'linear-gradient(135deg, #2c1626, #5c2443)',
    description: '10-second pulse check-in, emergency telemetry triggers, and high-contrast night safety interface designed for student urban commutes.',
    tags: ['Figma', 'Prototyping', 'User Safety', 'Design Systems'],
    link: 'https://github.com/vaishnvikedar6-jpg',
  },
  {
    id: 'anuvaad-chat',
    title: 'Anuvaad Language Explorer',
    category: 'systems',
    categoryLabel: 'Multilingual AI UI',
    image: '/assets/anuvaad.png',
    fallbackGrad: 'linear-gradient(135deg, #1b2838, #2d4564)',
    description: 'Clean typographic layout connecting 22 official Indian languages with cultural voice synthesis and real-time translator chatbot flows.',
    tags: ['NLP Interface', 'Typography', 'Localization', 'Accessibility'],
    link: 'https://github.com/vaishnvikedar6-jpg/Anuvaad',
  },
  {
    id: 'ayushlink-dash',
    title: 'AyushLink Clinical Telemetry',
    category: 'systems',
    categoryLabel: 'Healthcare Dashboard',
    image: '/assets/ayushlink.png',
    fallbackGrad: 'linear-gradient(135deg, #143028, #2a5749)',
    description: 'Empowering traditional AYUSH practitioners with vitals telemetry, patient appointment triage, and cross-discipline consultation records.',
    tags: ['Dashboard UX', 'Data Visualization', 'Healthcare', 'React'],
    link: 'https://github.com/vaishnvikedar6-jpg/Ayushlink-Final',
  },
  {
    id: 'civic-fix',
    title: 'Civic Fix Citizen Portal',
    category: 'mobile',
    categoryLabel: 'Civic Technology',
    image: '/assets/civicfix.png',
    fallbackGrad: 'linear-gradient(135deg, #2b3318, #4d5c2a)',
    description: 'Geo-tagged infrastructure reporting tool enabling residents to flag municipal repairs, vote on community priorities, and track resolutions.',
    tags: ['Civic UX', 'Geo-tagging', 'Mobile First', 'Community'],
    link: 'https://github.com/vaishnvikedar6-jpg',
  },
  {
    id: 'drishti-finalist',
    title: 'Drishti UI/UX Finalist Case Study',
    category: 'studies',
    categoryLabel: 'Designathon Top 6',
    image: '/assets/hero-photo.png',
    fallbackGrad: 'linear-gradient(135deg, #42162b, #802753)',
    description: 'Ranked in the Top 6 among 193+ teams nationwide. Rapid 36-hour sprint covering heuristic audits, user empathy maps, and high-fidelity interactive flows.',
    tags: ['Top 6 / 193+', 'Heuristics', 'User Research', 'Hackathon Sprint'],
    link: 'https://github.com/vaishnvikedar6-jpg',
  },
  {
    id: 'devops-pipeline',
    title: 'Course Registration CI/CD Pipeline',
    category: 'systems',
    categoryLabel: 'DevOps & Architecture',
    image: '/assets/course-reg.png',
    fallbackGrad: 'linear-gradient(135deg, #1e1b4b, #3730a3)',
    description: 'Cloud deployment architecture visualizing microservices, continuous integration pipelines, and automated test runners.',
    tags: ['System Architecture', 'CI/CD', 'Cloud Engineering', 'Docker'],
    link: 'https://github.com/vaishnvikedar6-jpg/Course-Registration-System-DevOps',
  },
];

export default function ButterflyLibrary() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  return (
    <section className="section butterfly-library-section" id="gallery">
      <div className="container">
        {/* Section Head matching user's exact color theme */}
        <div className="section-head">
          <div className="eyebrow">
            <Sparkles size={14} style={{ display: 'inline', marginRight: 6 }} />
            CHAPTER VI · THE BUTTERFLY LIBRARY · DESIGN GALLERY & ARTIFACTS
          </div>
          <div className="section-head-title-wrap">
            <div className="title-accent-bar" aria-hidden="true" />
            <h2 className="serif">Curated Interface Artifacts & Studies</h2>
          </div>
          <p className="hero-copy" style={{ margin: '14px auto 0' }}>
            A dimensional collection of design systems, user flows, and product architectures crafted with empathy, precision, and botanical harmony.
          </p>

          {/* Category Filter Pills */}
          <div className="gallery-filter-bar" role="tablist" aria-label="Filter gallery">
            {[
              { key: 'all', label: 'All Artifacts' },
              { key: 'mobile', label: 'Mobile Experiences' },
              { key: 'systems', label: 'Design Systems' },
              { key: 'studies', label: 'Hackathon Studies' },
            ].map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={activeFilter === f.key}
                className={`gallery-filter-pill ${activeFilter === f.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="butterfly-gallery-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="gallery-card"
              onClick={() => setSelectedItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedItem(item);
                }
              }}
              aria-label={`View details for ${item.title}`}
            >
              <div className="gallery-card-thumb" style={{ background: item.fallbackGrad }}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    // graceful fallback if image unavailable
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="gallery-thumb-overlay">
                  <div className="gallery-thumb-badge">
                    <Eye size={16} />
                    <span>Explore Artifact</span>
                  </div>
                </div>
              </div>

              <div className="gallery-card-body">
                <span className="gallery-cat-tag">{item.categoryLabel}</span>
                <h3 className="gallery-card-title">{item.title}</h3>
                <p className="gallery-card-desc">{item.description}</p>
                <div className="gallery-card-tags">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="gallery-tag-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-view Modal */}
      {selectedItem && (
        <div
          className="gallery-modal-overlay"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gallery-modal-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Close preview"
            >
              <X size={20} />
            </button>

            <div className="gallery-modal-hero" style={{ background: selectedItem.fallbackGrad }}>
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
              />
            </div>

            <div className="gallery-modal-details">
              <div className="gallery-modal-eyebrow">
                <Layers size={15} />
                <span>{selectedItem.categoryLabel}</span>
              </div>
              <h2 className="serif">{selectedItem.title}</h2>
              <p>{selectedItem.description}</p>

              <div className="gallery-modal-tags">
                {selectedItem.tags.map((t, idx) => (
                  <span key={idx} className="gallery-tag-pill">
                    {t}
                  </span>
                ))}
              </div>

              <div className="gallery-modal-actions">
                <a
                  href={selectedItem.link}
                  target="_blank"
                  rel="noreferrer"
                  className="pill pill-primary"
                >
                  <span>View Project Repository</span>
                  <ExternalLink size={16} />
                </a>
                <button
                  className="pill pill-secondary"
                  onClick={() => setSelectedItem(null)}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

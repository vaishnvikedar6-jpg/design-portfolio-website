import React from 'react';
import InteractiveCard3D from './InteractiveCard3D';
import { Award, Briefcase, GraduationCap, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

const MILESTONES = [
  {
    year: 'Oct 2026',
    title: 'Drishti UI/UX Designathon',
    organization: 'CESA, VIT Mumbai (Friends of Figma & .xyz)',
    role: 'Top 6 Finalist out of 193+ Registrations',
    icon: Trophy,
    highlight: true,
    description: 'Designed AVIRA: A women transit safety companion with safety scores, Avira Pulse check-ins, automated arrival confirmations and an instant SOS emergency workflow. Built in a team of two.',
    tags: ['UX Research', 'Color Psychology', 'Mobile Prototyping', 'Top 6 Finalist'],
  },
  {
    year: 'Mar 2026',
    title: 'PixelVerse UI/UX Hackathon',
    organization: 'GDG on Campus, SIES GST',
    role: 'Civic-Tech Prototype Designer',
    icon: Award,
    highlight: false,
    description: 'Designed Civic Fix: An accessible civic issue-reporting mobile app with photo verification, live status tracking, and community upvoting under hackathon time limits.',
    tags: ['Civic Tech', 'Accessibility', 'Mobile Flows', 'Fast Prototyping'],
  },
  {
    year: '2024 – 2028',
    title: 'B.E. Computer Engineering',
    organization: 'SIES Graduate School of Technology',
    role: 'Undergraduate Student · 9.86 CGPA (2nd Year)',
    icon: GraduationCap,
    highlight: true,
    description: 'Specializing in computer engineering, data structures, human-computer interaction, and full-stack software development with a consistent academic record.',
    tags: ['Computer Engineering', '9.86 CGPA', 'Algorithms', 'HCI'],
  },
  {
    year: 'Nov – Dec 2024',
    title: 'Web Development & Design Intern',
    organization: 'Oasis Infobyte · Remote',
    role: 'Frontend & UI Intern',
    icon: Briefcase,
    highlight: false,
    description: 'Developed responsive web interfaces including CyberGuard Suite, focusing on cross-browser accessibility, responsive layouts, and user-friendly interactions.',
    tags: ['Web Development', 'HTML/CSS/JS', 'Responsive Design', 'Internship'],
  },
];

const CERTIFICATIONS = [
  { name: 'Figma Web Design', issuer: 'Simplilearn', badge: '🎨' },
  { name: 'Foundations of Prompt Engineering', issuer: 'AWS', badge: '☁️' },
  { name: 'SQL & Relational Databases 101', issuer: 'IBM', badge: '🗄️' },
  { name: 'AWS Solutions Architecture Simulation', issuer: 'AWS / Forage', badge: '📐' },
  { name: 'Web Development HTML/CSS/JS', issuer: 'Udemy', badge: '🌐' },
  { name: 'Generative AI Career Essentials', issuer: 'Microsoft & LinkedIn', badge: '✨' },
  { name: 'Canva Design Certification', issuer: 'Canva', badge: '🖌️' },
  { name: 'Introduction to Cloud Computing', issuer: 'Infosys Springboard', badge: '⚡' },
];

export default function Timeline3D() {
  return (
    <div className="timeline-3d-container">
      {/* 3D Vertical Luminous Spine */}
      <div className="timeline-spine-track" aria-hidden="true">
        <div className="spine-glow" />
      </div>

      <div className="timeline-nodes-list">
        {MILESTONES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className={`timeline-node-row ${idx % 2 === 0 ? 'even' : 'odd'}`}>
              {/* Central Glowing Node with 3D Ring */}
              <div className="timeline-center-node" aria-hidden="true">
                <div className={`node-ring ${item.highlight ? 'highlight' : ''}`}>
                  <Icon size={18} />
                </div>
              </div>

              {/* 3D Glass Milestone Card */}
              <div className="timeline-card-wrapper">
                <InteractiveCard3D
                  className={`timeline-milestone-card ${item.highlight ? 'featured-milestone' : ''}`}
                  depth={18}
                  glowColor={item.highlight ? 'rgba(214, 51, 108, 0.28)' : 'rgba(110, 68, 89, 0.18)'}
                >
                  <div className="milestone-header">
                    <span className="milestone-year">{item.year}</span>
                    <span className="milestone-org">{item.organization}</span>
                  </div>
                  <h3 className="milestone-title">{item.title}</h3>
                  <div className="milestone-role-badge">
                    <Sparkles size={14} aria-hidden="true" />
                    <span>{item.role}</span>
                  </div>
                  <p className="milestone-description">{item.description}</p>
                  <div className="milestone-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="milestone-tag">{tag}</span>
                    ))}
                  </div>
                </InteractiveCard3D>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3D Dimensional Badges Section for Achievements / Certifications */}
      <div className="achievements-badges-section">
        <div className="section-subtitle">
          <Award size={20} className="icon-rose" aria-hidden="true" />
          <span>Verified Certifications & Credentials</span>
        </div>
        <div className="badges-3d-grid">
          {CERTIFICATIONS.map((cert) => (
            <InteractiveCard3D
              key={cert.name}
              className="cert-3d-badge"
              depth={12}
              glowColor="rgba(214, 51, 108, 0.2)"
            >
              <div className="badge-icon-wrap" aria-hidden="true">
                <span className="badge-emoji">{cert.badge}</span>
              </div>
              <div className="badge-info">
                <h4>{cert.name}</h4>
                <span className="badge-issuer">{cert.issuer}</span>
              </div>
              <CheckCircle2 size={16} className="badge-check" aria-hidden="true" />
            </InteractiveCard3D>
          ))}
        </div>
      </div>
    </div>
  );
}

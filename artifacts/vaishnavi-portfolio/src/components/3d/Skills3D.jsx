import React, { useState } from 'react';
import InteractiveCard3D from './InteractiveCard3D';
import { Palette, Code2, Sparkles, Layers, Cpu } from 'lucide-react';

const SKILL_CATEGORIES = [
  {
    id: 'design',
    title: 'UI/UX & Design',
    icon: Palette,
    accent: '#d6336c',
    description: 'Human-centered aesthetics, intuitive system flows, and high-fidelity prototypes.',
    skills: [
      { name: 'Figma', level: 'Advanced', icon: '🎨', note: 'Wireframes, Component Systems, Auto Layout' },
      { name: 'User Research', level: 'Applied', icon: '🔍', note: 'User personas, empathy mapping, interviews' },
      { name: 'Prototyping', level: 'Interactive', icon: '⚡', note: 'Interactive transitions & micro-interactions' },
      { name: 'Wireframing', level: 'Core', icon: '📐', note: 'Low-to-high fidelity layout architecture' },
      { name: 'Canva', level: 'Visual', icon: '✨', note: 'Brand assets, editorial presentations & graphics' },
    ],
  },
  {
    id: 'code',
    title: 'Frontend & Engineering',
    icon: Code2,
    accent: '#3e1a2e',
    description: 'Bridging design into clean, interactive, and responsive web experiences.',
    skills: [
      { name: 'React', level: 'Framework', icon: '⚛️', note: 'Hooks, component architecture, state management' },
      { name: 'JavaScript (ES6+)', level: 'Language', icon: '💻', note: 'Modern JS, async operations, DOM manipulation' },
      { name: 'HTML5 & CSS3', level: 'Semantics', icon: '🌐', note: 'Responsive design, flexbox, CSS grid, animations' },
      { name: 'Node.js', level: 'Runtime', icon: '🟢', note: 'Backend APIs, Express services, NPM ecosystem' },
      { name: 'SQL', level: 'Data', icon: '🗄️', note: 'Relational databases, queries, schema design' },
    ],
  },
  {
    id: 'process',
    title: 'Design Methodology',
    icon: Sparkles,
    accent: '#b76e79',
    description: 'Iterative problem-solving cycle from deep research to polished delivery.',
    skills: [
      { name: 'Discover', level: 'Stage 01', icon: '🔎', note: 'Listen closely and learn what matters' },
      { name: 'Define', level: 'Stage 02', icon: '🧭', note: 'Frame challenges with empathy and clarity' },
      { name: 'Design', level: 'Stage 03', icon: '✏️', note: 'Explore thoughtful, purposeful solutions' },
      { name: 'Prototype', level: 'Stage 04', icon: '💡', note: 'Make ideas tangible and testable' },
      { name: 'Refine', level: 'Stage 05', icon: '✨', note: 'Polish micro-details through user feedback' },
    ],
  },
];

export default function Skills3D() {
  const [activeTab, setActiveTab] = useState('design');

  const activeCategory = SKILL_CATEGORIES.find((c) => c.id === activeTab) || SKILL_CATEGORIES[0];

  return (
    <div className="skills-3d-wrapper">
      {/* Category selector pills with 3D glass look */}
      <div className="skills-category-tabs" role="tablist" aria-label="Skill categories">
        {SKILL_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              className={`skill-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      <p className="skills-category-desc">{activeCategory.description}</p>

      {/* 3D Glass Tiles Grid */}
      <div className="skills-tiles-grid">
        {activeCategory.skills.map((skill, index) => (
          <InteractiveCard3D
            key={skill.name}
            className="skill-3d-tile"
            depth={15}
            glowColor="rgba(214, 51, 108, 0.22)"
          >
            <div className="skill-tile-inner">
              <div className="skill-tile-header">
                <span className="skill-emoji" aria-hidden="true">{skill.icon}</span>
                <span className="skill-level-badge">{skill.level}</span>
              </div>
              <h3 className="skill-name">{skill.name}</h3>
              <p className="skill-note">{skill.note}</p>
              <div className="skill-reflection-bar" aria-hidden="true" />
            </div>
          </InteractiveCard3D>
        ))}
      </div>
    </div>
  );
}

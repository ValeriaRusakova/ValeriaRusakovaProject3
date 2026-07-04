// Public page — no auth required.
// Sections: hero · developer · tech stack · features
//
// To customise: edit the TECH_STACK and FEATURES arrays below,
// and update the developer name / college in the dev-card section.

import '../styles/about.css';

// ── Data ─────────────────────────────────────────────────────────────────────
// Edit these arrays to change what appears on the page.

const TECH_STACK = [
  { icon: '⚛️',  label: 'React 19'       },
  { icon: '🔷',  label: 'TypeScript'     },
  { icon: '⚡',  label: 'Vite 6'         },
  { icon: '🟢',  label: 'Node.js'        },
  { icon: '🚂',  label: 'Express'        },
  { icon: '🐬',  label: 'MySQL 8'        },
  { icon: '🔐',  label: 'JWT + bcrypt'   },
  { icon: '🐳',  label: 'Docker'         },
  { icon: '🤖',  label: 'OpenAI API'     },
  { icon: '🔗',  label: 'MCP Protocol'   },
];

const FEATURES = [
  {
    icon: '🔐',
    title: 'Authentication',
    desc:  'Secure JWT register & login with bcrypt password hashing and role-based access control.',
  },
  {
    icon: '✈️',
    title: 'Browse Vacations',
    desc:  'Filter by all, liked, active, or upcoming with smart windowed pagination.',
  },
  {
    icon: '❤️',
    title: 'Like System',
    desc:  'Like and unlike vacations; like counts update instantly.',
  },
  {
    icon: '🛠️',
    title: 'Admin Dashboard',
    desc:  'Add, edit, and delete vacations with image upload and inline delete confirmation.',
  },
  {
    icon: '📊',
    title: 'Reports',
    desc:  'Animated bar chart of likes per destination plus one-click CSV export.',
  },
  {
    icon: '🤖',
    title: 'AI Recommendations',
    desc:  'Describe your dream trip and receive AI-powered destination suggestions.',
  },
  {
    icon: '💬',
    title: 'MCP Queries',
    desc:  'Ask questions in plain language and query the database naturally via MCP.',
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    desc:  'Mobile-first glassmorphism UI that looks great on any screen size.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <main className="about-page">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <header className="about-hero">
        <div className="about-hero-icon">✈️</div>
        <h1>Vacation System</h1>
        <p className="about-tagline">
          A full-stack vacation management platform with role-based access,
          AI&nbsp;recommendations, and real-time analytics.
        </p>
      </header>

      {/* ── Developer ──────────────────────────────────────────────── */}
      <section className="about-section">
        <h2 className="section-heading">Developer</h2>
        <div className="dev-card glass">
          {/* Avatar shows the developer's initials — change "VR" if needed */}
          <div className="dev-avatar">VR</div>
          <div className="dev-info">
            <p className="dev-name">Valeria Rusakova</p>
            <p className="dev-role">Full Stack Web Developer</p>
            <p className="dev-college">John Bryce College · 2026</p>
          </div>
        </div>
      </section>

      {/* ── Tech stack ─────────────────────────────────────────────── */}
      <section className="about-section">
        <h2 className="section-heading">Tech Stack</h2>
        <div className="tech-grid">
          {TECH_STACK.map(({ icon, label }) => (
            <div key={label} className="tech-badge glass">
              <span className="tech-icon">{icon}</span>
              <span className="tech-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="about-section">
        <h2 className="section-heading">Features</h2>
        <div className="features-grid">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="feature-card glass">
              <span className="feature-icon">{icon}</span>
              <div>
                <p className="feature-title">{title}</p>
                <p className="feature-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}


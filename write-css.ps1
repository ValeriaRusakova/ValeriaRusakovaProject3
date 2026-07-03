$base = "C:\Users\LENA\OneDrive\Desktop\קורס תכנות\ValeriaRusakovaProject3\frontend\src\styles"

# ── vacations.css ──────────────────────────────────────────────────────────
$v = @'
/* vacations.css — Vacations page, AdminVacations, VacationCard, FilterBar, Pagination
   Import in: Vacations.tsx, AdminVacations.tsx, VacationCard.tsx, FilterBar.tsx, Pagination.tsx */

/* ── Page headings ──────────────────────────────────────────────────────── */
.vacations-page h1 {
  font-size: var(--text-4xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--sp-3);
}

.page-info {
  color: var(--text-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--sp-6);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-8);
  flex-wrap: wrap;
  gap: var(--sp-4);
}
.admin-header h1 { margin-bottom: 0; }

/* ── Cards grid ─────────────────────────────────────────────────────────── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--sp-6);
  margin-bottom: var(--sp-8);
}

@media (max-width: 640px) {
  .cards-grid { grid-template-columns: 1fr; }
}

/* ── Vacation card ──────────────────────────────────────────────────────── */
.vacation-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform var(--t-base), box-shadow var(--t-base), border-color var(--t-fast);
}
.vacation-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), 0 0 0 1px var(--glass-border-mid);
}

.card-image {
  width: 100%;
  height: 190px;
  object-fit: cover;
  display: block;
  background: var(--glass-1);
}

.card-body {
  padding: var(--sp-5);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  flex: 1;
}

.card-body h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.3;
}

.card-desc {
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Meta row: dates + price */
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--sp-2);
  flex-wrap: wrap;
  margin-top: var(--sp-1);
}

.card-dates { font-size: var(--text-xs); color: var(--text-muted); }
.card-price { font-size: var(--text-lg); font-weight: 700; color: var(--accent); white-space: nowrap; }

/* ── Card actions ───────────────────────────────────────────────────────── */
.card-actions {
  display: flex;
  gap: var(--sp-2);
  margin-top: auto;
  padding-top: var(--sp-4);
  flex-wrap: wrap;
}

.btn-like {
  background: var(--mint-dim);
  color: var(--mint);
  border: 1px solid rgba(5, 212, 168, 0.25);
  height: 32px;
  padding: 0 var(--sp-4);
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-pill);
  min-width: 68px;
  transition: background var(--t-fast), color var(--t-fast);
}
.btn-like.liked  { background: rgba(5, 212, 168, 0.25); }
.btn-like:hover:not(:disabled) { background: rgba(5, 212, 168, 0.35); color: #fff; }
.btn-like:disabled { opacity: 0.5; cursor: wait; }

.btn-edit {
  background: var(--accent-subtle);
  color: #c4b5fd;
  border: 1px solid rgba(124, 82, 255, 0.28);
  height: 32px;
  padding: 0 var(--sp-4);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}
.btn-edit:hover { background: rgba(124, 82, 255, 0.22); }

.btn-delete {
  background: var(--error-bg);
  color: var(--error);
  border: 1px solid var(--error-border);
  height: 32px;
  padding: 0 var(--sp-4);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}
.btn-delete:hover:not(:disabled) { background: rgba(248, 113, 113, 0.22); }
.btn-delete:disabled { opacity: 0.5; cursor: wait; }

/* ── Inline delete confirmation ─────────────────────────────────────────── */
.delete-confirm {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex: 1;
  flex-wrap: wrap;
}

.delete-confirm-label {
  font-size: var(--text-xs);
  color: var(--error);
  font-weight: 500;
  white-space: nowrap;
}

.btn-confirm-yes {
  background: rgba(248, 113, 113, 0.22);
  color: var(--error);
  border: 1px solid var(--error-border);
  height: 28px;
  padding: 0 var(--sp-3);
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
}
.btn-confirm-yes:hover { background: rgba(248, 113, 113, 0.40); color: #fff; }

.btn-confirm-no {
  background: var(--glass-2);
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
  height: 28px;
  padding: 0 var(--sp-3);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}
.btn-confirm-no:hover { background: var(--glass-3); color: var(--text); }

/* ── Pagination ─────────────────────────────────────────────────────────── */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-8) 0;
  flex-wrap: wrap;
}

.page-btn {
  background: var(--glass-2);
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
  min-width: 38px;
  height: 38px;
  padding: 0 var(--sp-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  transition: background var(--t-fast), color var(--t-fast), border-color var(--t-fast);
}
.page-btn:hover:not(:disabled) {
  background: var(--accent-subtle);
  color: var(--text);
  border-color: var(--accent);
}
.page-btn.active {
  background: var(--accent);
  color: var(--text-on-accent);
  border-color: var(--accent);
  cursor: default;
  font-weight: 600;
}
.page-btn:disabled:not(.active) { opacity: 0.28; cursor: default; }

.pagination-dots {
  color: var(--text-muted);
  font-size: var(--text-sm);
  padding: 0 var(--sp-1);
  user-select: none;
}
'@
$v | Set-Content "$base\vacations.css" -Encoding UTF8

# ── vacation-form.css ──────────────────────────────────────────────────────
$vf = @'
/* vacation-form.css — AddVacation + EditVacation pages
   Import in: AddVacation.tsx, EditVacation.tsx */

/* ── Page wrapper ───────────────────────────────────────────────────────── */
.form-page {
  display: flex;
  justify-content: center;
  padding: calc(var(--navbar-height) + var(--sp-10)) var(--sp-6) var(--sp-12);
}

/* ── Glass form card ────────────────────────────────────────────────────── */
.vacation-form {
  width: 100%;
  max-width: 560px;
  padding: var(--sp-10) var(--sp-8);
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

/* ── Heading ────────────────────────────────────────────────────────────── */
.form-heading h2 {
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.form-heading p {
  color: var(--text-muted);
  font-size: var(--text-sm);
  margin-top: var(--sp-2);
}

/* ── Side-by-side dates ─────────────────────────────────────────────────── */
.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);
}
@media (max-width: 420px) {
  .date-row { grid-template-columns: 1fr; }
}

/* ── File input ─────────────────────────────────────────────────────────── */
.file-input {
  cursor: pointer;
  height: auto;
  padding: var(--sp-2) var(--sp-4);
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.file-input::file-selector-button {
  background: var(--accent-subtle);
  color: var(--text);
  border: 1px solid rgba(124, 82, 255, 0.30);
  border-radius: var(--radius-xs);
  padding: var(--sp-1) var(--sp-3);
  font-size: var(--text-xs);
  cursor: pointer;
  margin-right: var(--sp-3);
  transition: background var(--t-fast);
}
.file-input::file-selector-button:hover { background: rgba(124, 82, 255, 0.22); }

/* ── Image preview ──────────────────────────────────────────────────────── */
.image-preview {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  animation: fadeIn var(--t-base) ease;
}

/* ── Current image (Edit page) ──────────────────────────────────────────── */
.current-image { display: flex; flex-direction: column; gap: var(--sp-2); }
.current-image-label { font-size: var(--text-sm); color: var(--text-muted); font-weight: 500; }
.current-image img {
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
}

/* ── Form-level error banner ────────────────────────────────────────────── */
.form-error {
  color: var(--error);
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  border-radius: var(--radius-sm);
  padding: var(--sp-3) var(--sp-4);
  font-size: var(--text-sm);
}

/* ── Action row ─────────────────────────────────────────────────────────── */
.form-actions {
  display: flex;
  gap: var(--sp-3);
  justify-content: flex-end;
  margin-top: var(--sp-2);
  flex-wrap: wrap;
}

.btn-cancel {
  background: var(--glass-2);
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
  height: 44px;
  padding: 0 var(--sp-6);
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
}
.btn-cancel:hover { background: var(--glass-3); color: var(--text); }

.btn-submit {
  background: var(--accent-gradient);
  color: var(--text-on-accent);
  font-weight: 600;
  height: 44px;
  padding: 0 var(--sp-8);
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-accent);
}
.btn-submit:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

@media (max-width: 500px) {
  .vacation-form { padding: var(--sp-8) var(--sp-5); }
}
'@
$vf | Set-Content "$base\vacation-form.css" -Encoding UTF8

# ── reports.css ────────────────────────────────────────────────────────────
$r = @'
/* reports.css — Admin reports page
   Import in: Reports.tsx */

/* ── Page header ────────────────────────────────────────────────────────── */
.reports-page h1 { font-size: var(--text-4xl); font-weight: 700; letter-spacing: -0.02em; }

.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--sp-8);
  flex-wrap: wrap;
  gap: var(--sp-4);
}

.reports-header-actions { display: flex; gap: var(--sp-3); align-items: center; }

/* ── Summary stat cards ─────────────────────────────────────────────────── */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-4);
  margin-bottom: var(--sp-8);
}
@media (max-width: 640px) { .summary-cards { grid-template-columns: 1fr; } }

.summary-card {
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  text-align: center;
}

.summary-value {
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text);
}
.summary-value.top-dest {
  font-size: var(--text-xl);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── Chart panel ────────────────────────────────────────────────────────── */
.chart { padding: var(--sp-8); }
.chart-title { font-size: var(--text-xl); font-weight: 600; margin-bottom: var(--sp-1); }
.chart-subtitle { font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--sp-6); }

/* ── Bar chart ──────────────────────────────────────────────────────────── */
.bar-chart { display: flex; flex-direction: column; gap: var(--sp-3); }

.bar-item { display: flex; align-items: center; gap: var(--sp-4); }

.bar-label {
  min-width: 140px;
  max-width: 140px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-track {
  flex: 1;
  position: relative;
  height: 36px;
  background: var(--glass-1);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  width: var(--bar-width, 0%);
  background: var(--accent-gradient);
  border-radius: var(--radius-sm);
  animation: growBar 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes growBar {
  from { width: 0; }
  to   { width: var(--bar-width, 100%); }
}

.bar-value {
  position: absolute;
  right: var(--sp-3);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-sm);
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
  pointer-events: none;
}

@media (max-width: 500px) {
  .bar-label { min-width: 80px; max-width: 80px; font-size: var(--text-xs); }
  .chart { padding: var(--sp-5); }
}
'@
$r | Set-Content "$base\reports.css" -Encoding UTF8

# ── ai-mcp.css ──────────────────────────────────────────────────────────────
$ai = @'
/* ai-mcp.css — AI Recommendation + MCP Database Query pages
   Import in: AiPage.tsx, McpPage.tsx */

/* ── Page: centred single card ──────────────────────────────────────────── */
.ai-mcp-page {
  display: flex;
  justify-content: center;
  padding: calc(var(--navbar-height) + var(--sp-10)) var(--sp-6) var(--sp-12);
}

/* ── Main card ──────────────────────────────────────────────────────────── */
.ai-mcp-card {
  width: 100%;
  max-width: 660px;
  padding: var(--sp-10) var(--sp-8);
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  align-self: flex-start;
}

/* ── Heading ────────────────────────────────────────────────────────────── */
.ai-heading h1, .mcp-heading h1 {
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--sp-2);
}
.ai-heading p, .mcp-heading p { color: var(--text-muted); font-size: var(--text-sm); line-height: 1.65; }

/* ── Input row (AI: text + button side by side) ─────────────────────────── */
.ai-input-row { display: flex; gap: var(--sp-3); flex-wrap: wrap; }
.ai-input-row input { flex: 1; min-width: 180px; }
.ai-input-row button { flex-shrink: 0; }

/* ── Input column (MCP: textarea above button) ──────────────────────────── */
.mcp-input-col { display: flex; flex-direction: column; gap: var(--sp-3); }
.mcp-input-col textarea { min-height: 80px; resize: vertical; }
.mcp-input-col button { align-self: flex-end; }

/* ── Thinking indicator ─────────────────────────────────────────────────── */
.ai-thinking, .mcp-thinking {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-style: italic;
}

.dots span { animation: blink 1.2s infinite both; }
.dots span:nth-child(2) { animation-delay: 0.2s; }
.dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40%           { opacity: 1; }
}

/* ── Result card ────────────────────────────────────────────────────────── */
.ai-result-card, .mcp-result-card {
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  animation: fadeIn var(--t-base) ease;
}

.ai-result-header, .mcp-result-header {
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.ai-result-label, .mcp-result-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.ai-result-dest { font-size: var(--text-xl); font-weight: 700; color: var(--accent); }
.mcp-result-question { font-size: var(--text-base); font-weight: 600; color: var(--text); font-style: italic; }

.ai-result-text, .mcp-result-text {
  line-height: 1.85;
  font-size: var(--text-sm);
  white-space: pre-wrap;
  color: var(--text-secondary);
}

/* ── Clear / new search button ──────────────────────────────────────────── */
.ai-clear-btn, .mcp-clear-btn {
  align-self: flex-start;
  background: var(--glass-2);
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
  font-size: var(--text-xs);
  height: 32px;
  padding: 0 var(--sp-4);
  border-radius: var(--radius-sm);
}
.ai-clear-btn:hover, .mcp-clear-btn:hover { background: var(--glass-3); color: var(--text); }

@media (max-width: 500px) {
  .ai-mcp-card { padding: var(--sp-8) var(--sp-5); }
  .ai-input-row button { width: 100%; }
}
'@
$ai | Set-Content "$base\ai-mcp.css" -Encoding UTF8

# ── about.css ──────────────────────────────────────────────────────────────
$ab = @'
/* about.css — About page
   Import in: About.tsx */

.about-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-12);
  max-width: 860px;
  margin: 0 auto;
  padding: calc(var(--navbar-height) + var(--sp-12)) var(--sp-6) var(--sp-16);
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
.about-hero {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
}

.about-hero-icon {
  font-size: 3.5rem;
  line-height: 1;
  filter: drop-shadow(0 4px 16px var(--accent-glow));
}

.about-hero h1 {
  font-size: var(--text-5xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--text) 30%, var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-tagline {
  max-width: 520px;
  color: var(--text-secondary);
  font-size: var(--text-base);
  line-height: 1.75;
}

/* ── Section ────────────────────────────────────────────────────────────── */
.about-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.section-heading {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
  padding-bottom: var(--sp-3);
  border-bottom: 1px solid var(--glass-border);
}

/* ── Developer card ─────────────────────────────────────────────────────── */
.dev-card {
  display: flex;
  align-items: center;
  gap: var(--sp-6);
  padding: var(--sp-6) var(--sp-8);
}

.dev-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  box-shadow: var(--shadow-accent);
}

.dev-name  { font-size: var(--text-xl); font-weight: 700; }
.dev-role  { color: var(--text-muted); font-size: var(--text-sm); margin-top: var(--sp-1); }
.dev-college { color: var(--accent); font-size: var(--text-xs); margin-top: var(--sp-1); opacity: 0.85; }

/* ── Tech badges ────────────────────────────────────────────────────────── */
.tech-grid { display: flex; flex-wrap: wrap; gap: var(--sp-2); }

.tech-badge {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  height: 34px;
  padding: 0 var(--sp-4);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  white-space: nowrap;
  transition: background var(--t-fast), border-color var(--t-fast);
}
.tech-badge:hover { background: var(--glass-3); border-color: var(--glass-border-mid); }
.tech-icon  { font-size: var(--text-base); line-height: 1; }
.tech-label { font-weight: 500; color: var(--text); }

/* ── Feature grid ───────────────────────────────────────────────────────── */
.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-4);
  padding: var(--sp-5) var(--sp-5);
  transition: background var(--t-fast);
}
.feature-card:hover { background: var(--glass-3); }

.feature-icon  { font-size: var(--text-2xl); line-height: 1; flex-shrink: 0; }
.feature-title { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--sp-1); }
.feature-desc  { font-size: var(--text-xs); color: var(--text-muted); line-height: 1.65; }

/* ── Mobile ─────────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .about-hero h1    { font-size: var(--text-4xl); }
  .about-tagline    { font-size: var(--text-sm); }
  .dev-card         { flex-direction: column; text-align: center; }
  .features-grid    { grid-template-columns: 1fr; }
}
'@
$ab | Set-Content "$base\about.css" -Encoding UTF8

Write-Host "All CSS files written:"
Get-ChildItem "$base\*.css" | Select-Object Name, @{N="Lines";E={(Get-Content $_.FullName).Count}}

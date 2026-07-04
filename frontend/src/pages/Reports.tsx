// Admin-only page — bar chart of likes per vacation destination.
//
// Data flow:
//   GET /api/reports → ReportRow[] (destination + likesCount)
//
// Features:
//   • Summary cards: total vacations tracked, total likes, top destination
//   • Vertical bar chart: X-axis destinations, Y-axis likes
//   • Bars animate from 0 → target height on mount (CSS keyframe)
//   • Download CSV button (uses api.downloadReportCsv)
//   • Full loading + error + empty states

import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import * as api from '../services/api';
import type { ReportRow } from '../types';
import '../styles/reports.css';

export default function Reports() {
  const [rows,     setRows]     = useState<ReportRow[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  // Separate error for the CSV button so it doesn't replace the chart.
  const [csvError,      setCsvError]      = useState('');
  const [downloading,   setDownloading]   = useState(false);

  useEffect(() => {
    api
      .getReport()
      // Sort descending so the most-liked destination is at the top.
      .then(data => setRows([...data].sort((a, b) => b.likesCount - a.likesCount)))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load report'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCsvDownload() {
    setCsvError('');
    setDownloading(true);
    try {
      await api.downloadReportCsv();
    } catch (err) {
      setCsvError(err instanceof Error ? err.message : 'CSV download failed');
    } finally {
      setDownloading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error)   return <p className="error-msg page-error">{error}</p>;

  // Derived stats for the summary cards.
  const totalLikes = rows.reduce((sum, r) => sum + r.likesCount, 0);
  const topDest    = rows[0]?.destination ?? '—';
  // The maximum likes count is used to scale every bar to a percentage.
  const maxLikes   = rows[0]?.likesCount ?? 1; // rows is sorted desc, so first = max
  const chartMax   = Math.max(maxLikes, 1);
  const tickCount  = Math.min(chartMax, 5);
  const yTicks     = Array.from(
    { length: tickCount + 1 },
    (_, index) => Math.round((chartMax / tickCount) * (tickCount - index)),
  );

  return (
    <main className="reports-page">

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="reports-header">
        <h1>Vacation Reports</h1>
        <div className="reports-header-actions">
          <button
            className="btn-primary"
            onClick={handleCsvDownload}
            disabled={downloading}
          >
            {downloading ? 'Downloading…' : '⬇ Download CSV'}
          </button>
        </div>
      </div>

      {csvError && <p className="error-msg" style={{ marginBottom: '1.5rem' }}>{csvError}</p>}

      {/* ── Summary cards ─────────────────────────────────────────── */}
      {rows.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card glass">
            <span className="summary-value">{rows.length}</span>
            <span className="summary-label">Vacations tracked</span>
          </div>
          <div className="summary-card glass">
            <span className="summary-value">{totalLikes}</span>
            <span className="summary-label">Total likes</span>
          </div>
          <div className="summary-card glass">
            <span className="summary-value top-dest">{topDest}</span>
            <span className="summary-label">Most popular</span>
          </div>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────── */}
      {rows.length === 0 && (
        <div className="empty-state">
          No data yet — nobody has liked a vacation.
        </div>
      )}

      {/* ── Bar chart ─────────────────────────────────────────────── */}
      {rows.length > 0 && (
        <section className="chart glass">
          <h2 className="chart-title">Likes per Destination</h2>
          <p className="chart-subtitle">X-axis: destinations · Y-axis: likes</p>

          <div className="vertical-chart" aria-label="Likes per vacation destination">
            <div className="y-axis" aria-hidden="true">
              <span className="axis-title">Likes</span>
              {yTicks.map(tick => (
                <span key={tick} className="y-tick">{tick}</span>
              ))}
            </div>

            <div className="bar-chart">
              {rows.map((row, index) => {
                const pct = (row.likesCount / chartMax) * 100;
                return (
                  <div key={row.destination} className="bar-item">
                    <div className="bar-track">
                      <span className="bar-value">{row.likesCount}</span>
                      {/*
                        CSS custom property --bar-height drives the @keyframes animation.
                        Each bar animates from height:0 → --bar-height on mount.
                      */}
                      <div
                        className="bar-fill"
                        style={{
                          '--bar-height': `${pct}%`,
                          animationDelay: `${index * 60}ms`,
                        } as React.CSSProperties}
                      />
                    </div>
                    <span className="bar-label" title={row.destination}>
                      {row.destination}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}


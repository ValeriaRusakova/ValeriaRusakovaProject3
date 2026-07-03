// ── Navbar — role-aware menu ──────────────────────────────────────────────────
//
//  Guest  → About | Login | Register
//  User   → About | Vacations | AI | MCP | 👤 Full Name | Logout
//  Admin  → About | Admin | Add Vacation | Reports | ⬇ CSV | 👤 Full Name | Logout
//
// NavLink is used instead of Link so that react-router automatically adds
// class="active" to the link that matches the current URL.
// On mobile (≤768 px) the links collapse behind a ☰ hamburger button.

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { downloadReportCsv } from '../services/api';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Controls the mobile dropdown panel.
  const [isOpen, setIsOpen] = useState(false);
  // Tracks whether a CSV download is in progress.
  const [downloading, setDownloading] = useState(false);
  // Brief error message shown next to the CSV button if download fails.
  const [csvError, setCsvError] = useState('');

  // Close the mobile menu — called after every link/button click.
  function closeMenu() { setIsOpen(false); }

  function handleLogout() {
    signOut();
    navigate('/login');
    closeMenu();
  }

  async function handleCsvDownload() {
    if (downloading) return;
    setCsvError('');
    setDownloading(true);
    try {
      await downloadReportCsv();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Download failed';
      setCsvError(msg);
      // Auto-clear the error after 4 seconds so it doesn't linger.
      setTimeout(() => setCsvError(''), 4000);
    } finally {
      setDownloading(false);
    }
  }

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="navbar glass">

      {/* Brand / logo — always visible */}
      <div className="navbar-brand">
        <NavLink to="/about" onClick={closeMenu}>✈️ VacationSystem</NavLink>
      </div>

      {/* Hamburger toggle — only visible on mobile (CSS hides it on desktop) */}
      <button
        className="hamburger"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Links panel — on mobile this collapses until isOpen is true */}
      <ul className={`navbar-links${isOpen ? ' open' : ''}`}>

        {/* ── Always visible ─────────────────────────────────────── */}
        <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>

        {/* ── Guest ─────────────────────────────────────────────── */}
        {!user && (
          <>
            <li><NavLink to="/login"    onClick={closeMenu}>Login</NavLink></li>
            <li><NavLink to="/register" onClick={closeMenu}>Register</NavLink></li>
          </>
        )}

        {/* ── Regular user (not admin) ───────────────────────────── */}
        {user && !isAdmin && (
          <>
            <li><NavLink to="/vacations" onClick={closeMenu}>Vacations</NavLink></li>
            <li><NavLink to="/ai"        onClick={closeMenu}>AI</NavLink></li>
            <li><NavLink to="/mcp"       onClick={closeMenu}>MCP</NavLink></li>
          </>
        )}

        {/* ── Admin ─────────────────────────────────────────────── */}
        {isAdmin && (
          <>
            <li><NavLink to="/admin"        onClick={closeMenu}>Admin</NavLink></li>
            <li><NavLink to="/add-vacation" onClick={closeMenu}>+ Add Vacation</NavLink></li>
            <li><NavLink to="/reports"      onClick={closeMenu}>Reports</NavLink></li>
            <li className="csv-btn-wrap">
              <button
                className="btn-csv"
                onClick={handleCsvDownload}
                disabled={downloading}
              >
                {downloading ? '⏳ Downloading…' : '⬇ CSV'}
              </button>
              {csvError && <span className="csv-error">{csvError}</span>}
            </li>
          </>
        )}

        {/* ── Logged-in: name + logout ───────────────────────────── */}
        {user && (
          <>
            <li className="navbar-user">
              👤 {user.firstName} {user.lastName}
            </li>
            <li>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}

      </ul>
    </nav>
  );
}


// Displays a single vacation as a glass card.
//
// User view:  like / unlike button with count
// Admin view: Edit + Delete buttons with inline confirmation
//
// Props:
//   isAdmin    → switches between user view and admin view
//   isLiking   → disables like button while API call runs
//   isDeleting → disables delete button while API call runs
//   onLike     → called with id when user clicks like/unlike
//   onEdit     → called with id when admin clicks Edit
//   onDelete   → called with id AFTER admin confirms deletion

import { useState } from 'react';
import { IMAGES_URL } from '../services/api';
import type { Vacation } from '../types';
import CardMedia from './CardMedia';

interface Props {
  vacation:    Vacation;
  isAdmin?:    boolean;
  isLiking?:   boolean;
  isDeleting?: boolean;
  onLike?:     (id: number) => void;
  onEdit?:     (id: number) => void;
  onDelete?:   (id: number) => void;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
}

/** Returns the vacation's current status and a label for the chip. */
function getStatus(startDate: string, endDate: string) {
  const today = new Date().toISOString().split('T')[0];
  const start = startDate.split('T')[0];
  const end   = endDate.split('T')[0];
  if (end < today)    return { cls: 'status-past',     label: 'Past' };
  if (start > today)  return { cls: 'status-upcoming', label: 'Upcoming' };
  return               { cls: 'status-active',         label: 'Active' };
}

export default function VacationCard({
  vacation,
  isAdmin,
  isLiking,
  isDeleting,
  onLike,
  onEdit,
  onDelete,
}: Props) {
  // Controls the inline "Are you sure?" confirmation row inside this card.
  const [confirming, setConfirming] = useState(false);

  // Empty string tells CardMedia to skip the <img> and show the placeholder.
  const imageUrl = vacation.imageFileName
    ? `${IMAGES_URL}/${vacation.imageFileName}`
    : '';

  const status = getStatus(vacation.startDate, vacation.endDate);

  function handleDeleteClick() {
    setConfirming(true); // show inline confirm
  }

  function handleConfirmYes() {
    setConfirming(false);
    onDelete?.(vacation.id); // parent handles the API call + loading state
  }

  function handleConfirmNo() {
    setConfirming(false);
  }

  return (
    <article className="vacation-card glass">
      <div className="card-image-wrap">
        <CardMedia src={imageUrl} alt={vacation.destination} />
        <span className={`vacation-status ${status.cls}`}>
          {status.label}
        </span>
      </div>

      <div className="card-body">
        <h3>{vacation.destination}</h3>
        <p className="card-desc">{vacation.description}</p>

        <div className="card-meta">
          <span className="card-dates">
            📅 {formatDate(vacation.startDate)} – {formatDate(vacation.endDate)}
          </span>
          <span className="card-price">
            ${vacation.price.toLocaleString()}
          </span>
        </div>

        {/* ── Action row ──────────────────────────────────────────── */}
        <div className="card-actions">

          {/* User: like / unlike */}
          {!isAdmin && (
            <button
              className={`btn-like ${vacation.isLiked ? 'liked' : ''}`}
              onClick={() => onLike?.(vacation.id)}
              disabled={isLiking}
              aria-label={vacation.isLiked ? 'Unlike vacation' : 'Like vacation'}
            >
              {isLiking ? '⏳' : vacation.isLiked ? '❤️' : '🤍'}
              {' '}{vacation.likesCount}
            </button>
          )}

          {/* Admin: Edit + Delete (or inline confirm) */}
          {isAdmin && !confirming && (
            <>
              <button
                className="btn-edit"
                onClick={() => onEdit?.(vacation.id)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn-delete"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                {isDeleting ? '⏳' : '🗑 Delete'}
              </button>
            </>
          )}

          {/* Inline confirmation — replaces the buttons */}
          {isAdmin && confirming && (
            <div className="delete-confirm">
              <span className="delete-confirm-label">Delete?</span>
              <button className="btn-confirm-yes" onClick={handleConfirmYes}>
                Yes
              </button>
              <button className="btn-confirm-no" onClick={handleConfirmNo}>
                No
              </button>
            </div>
          )}

        </div>
      </div>
    </article>
  );
}




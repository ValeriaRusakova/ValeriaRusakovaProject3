// Admin-only page — edit an existing vacation.
//
// How the page gets its data:
//   1. AdminVacations passes the vacation object in navigation state
//      → form is pre-filled instantly, no extra API call needed.
//   2. If the user navigates directly via URL, the page fetches the
//      vacation from the API by id.
//
// Validation rules (same as Add except where noted):
//   • Destination / Description — required
//   • Start date — required; PAST DATES ARE ALLOWED
//   • End date   — required; must be ≥ start date
//   • Price      — required; 0 – 10,000
//   • Image      — OPTIONAL; if provided it replaces the current one

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FieldError from '../components/FieldError';
import LoadingSpinner from '../components/LoadingSpinner';
import * as api from '../services/api';
import { IMAGES_URL } from '../services/api';
import type { Vacation } from '../types';
import { validatePrice, validateRequired } from '../utils/validation';
import '../styles/vacation-form.css';

interface LocationState {
  vacation?: Vacation;
}

// Convert "2024-07-15T00:00:00.000Z" or "2024-07-15" → "2024-07-15"
// (HTML date inputs only accept YYYY-MM-DD)
function toDateInput(dateStr: string): string {
  return dateStr.split('T')[0];
}

// One optional error string per field.
type FieldErrors = {
  destination?: string;
  description?: string;
  startDate?:   string;
  endDate?:     string;
  price?:       string;
};

export default function EditVacation() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as LocationState | null;

  const [form, setForm] = useState({
    destination: '',
    description: '',
    startDate:   '',
    endDate:     '',
    price:       '',
  });

  // currentImage   — the filename already stored on the server
  // newImage       — a new File picked by the admin (replaces currentImage on save)
  // newImagePreview — object URL for the preview thumbnail
  const [currentImage,    setCurrentImage]    = useState('');
  const [newImage,        setNewImage]        = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState('');

  const [errors,      setErrors]      = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(false);

  // Pre-fill the form from nav state or API.
  useEffect(() => {
    if (state?.vacation) {
      fillForm(state.vacation);
    } else {
      // Direct URL access (e.g. browser refresh) — fetch from API.
      setFetching(true);
      api
        .getVacationById(Number(id))
        .then(fillForm)
        .catch(() =>
          setServerError('Could not load vacation. Please go back and try again.'),
        )
        .finally(() => setFetching(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fillForm(v: Vacation) {
    setForm({
      destination: v.destination,
      description: v.description,
      startDate:   toDateInput(v.startDate),
      endDate:     toDateInput(v.endDate),
      price:       String(v.price),
    });
    setCurrentImage(v.imageFileName ?? '');
  }

  // Clear the matching field error as soon as the user edits that field.
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setNewImage(file);

    // Revoke old preview URL to prevent memory leaks.
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImagePreview(file ? URL.createObjectURL(file) : '');
  }

  // Validates all text fields. Returns true only when there are zero errors.
  // Note: image is NOT validated — it is optional for edits.
  function validate(): boolean {
    const next: FieldErrors = {
      destination: validateRequired(form.destination, 'Destination') ?? undefined,
      description: validateRequired(form.description, 'Description') ?? undefined,
      price:       validatePrice(form.price) ?? undefined,
    };

    // Start date — required only (past dates are allowed for edits)
    if (!form.startDate) {
      next.startDate = 'Start date is required';
    }

    // End date — required + must be ≥ start date
    if (!form.endDate) {
      next.endDate = 'End date is required';
    } else if (form.startDate && form.endDate < form.startDate) {
      next.endDate = 'End date cannot be before start date';
    }

    setErrors(next);
    return !Object.values(next).some(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    const formData = new FormData();
    formData.append('destination', form.destination.trim());
    formData.append('description', form.description.trim());
    formData.append('startDate',   form.startDate);
    formData.append('endDate',     form.endDate);
    formData.append('price',       form.price);
    // Only include image if the admin actually picked a new file.
    if (newImage) formData.append('image', newImage);

    setLoading(true);
    try {
      await api.updateVacation(Number(id), formData);
      navigate('/admin');
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Failed to update vacation',
      );
    } finally {
      setLoading(false);
    }
  }

  // Full-page spinner while the API fetch loads the vacation data.
  if (fetching) return <LoadingSpinner />;

  return (
    <main className="form-page">
      <form className="vacation-form glass" onSubmit={handleSubmit} noValidate>

        <div className="form-heading">
          <h2>✏️ Edit Vacation</h2>
          <p>Update the details below. Image is optional — leave it to keep the current photo.</p>
        </div>

        {/* Server-side error (network failure, 404, etc.) */}
        {serverError && <div className="form-error">{serverError}</div>}

        {/* ── Destination ─────────────────────────────────────────── */}
        <div className="field-group">
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            name="destination"
            type="text"
            value={form.destination}
            onChange={handleChange}
            className={errors.destination ? 'input-error' : ''}
            autoComplete="off"
          />
          <FieldError message={errors.destination} />
        </div>

        {/* ── Description ─────────────────────────────────────────── */}
        <div className="field-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={errors.description ? 'input-error' : ''}
          />
          <FieldError message={errors.description} />
        </div>

        {/* ── Dates — side by side on wider screens ───────────────── */}
        <div className="date-row">
          <div className="field-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className={errors.startDate ? 'input-error' : ''}
            />
            <FieldError message={errors.startDate} />
          </div>

          <div className="field-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              className={errors.endDate ? 'input-error' : ''}
            />
            <FieldError message={errors.endDate} />
          </div>
        </div>

        {/* ── Price ───────────────────────────────────────────────── */}
        <div className="field-group">
          <label htmlFor="price">Price ($)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            max="10000"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className={errors.price ? 'input-error' : ''}
          />
          <span className="field-hint">Between $0 and $10,000</span>
          <FieldError message={errors.price} />
        </div>

        {/* ── Current image ────────────────────────────────────────── */}
        {currentImage && !newImagePreview && (
          <div className="current-image">
            <span className="current-image-label">Current photo</span>
            <img
              src={`${IMAGES_URL}/${currentImage}`}
              alt="Current vacation photo"
            />
          </div>
        )}

        {/* ── Replace image (optional) ─────────────────────────────── */}
        <div className="field-group">
          <label htmlFor="image">
            {currentImage ? 'Replace Photo (optional)' : 'Vacation Photo (optional)'}
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          <span className="field-hint">
            {currentImage
              ? 'Upload a new image to replace the current one, or leave blank to keep it.'
              : 'No photo currently set.'}
          </span>
          {/* Preview of newly selected image */}
          {newImagePreview && (
            <img
              src={newImagePreview}
              alt="Preview of new photo"
              className="image-preview"
            />
          )}
        </div>

        {/* ── Submit / Cancel ─────────────────────────────────────── */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

      </form>
    </main>
  );
}


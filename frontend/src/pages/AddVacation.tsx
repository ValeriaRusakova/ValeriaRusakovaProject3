// Admin-only page — create a new vacation.
//
// Validation rules:
//   • All text fields required (no blank/whitespace)
//   • Start date ≥ today (no past dates)
//   • End date ≥ start date
//   • Price 0 – 10,000
//   • Image file required
//
// Each rule shows its error directly under the relevant input,
// just like the Register/Login pages (per-field errors, not one banner).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FieldError from '../components/FieldError';
import * as api from '../services/api';
import { validatePrice, validateRequired } from '../utils/validation';
import '../styles/vacation-form.css';

// One optional error string per field.
type FieldErrors = {
  destination?: string;
  description?: string;
  startDate?:   string;
  endDate?:     string;
  price?:       string;
  image?:       string;
};

export default function AddVacation() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    destination: '',
    description: '',
    startDate:   '',
    endDate:     '',
    price:       '',
  });

  const [image,   setImage]   = useState<File | null>(null);
  // Object URL used only for the preview thumbnail — revoked on unmount.
  const [preview, setPreview] = useState('');

  const [errors,      setErrors]      = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading,     setLoading]     = useState(false);

  // Clear the matching field error as soon as the user edits that field.
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setErrors(prev => ({ ...prev, image: undefined }));

    // Revoke the old preview URL to avoid memory leaks, then create a new one.
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : '');
  }

  // Validates every field and stores per-field errors.
  // Returns true only when there are zero errors.
  function validate(): boolean {
    const today = new Date().toISOString().split('T')[0];

    const next: FieldErrors = {
      destination: validateRequired(form.destination, 'Destination') ?? undefined,
      description: validateRequired(form.description, 'Description') ?? undefined,
      price:       validatePrice(form.price) ?? undefined,
    };

    // Start date — required + not in the past
    if (!form.startDate) {
      next.startDate = 'Start date is required';
    } else if (form.startDate < today) {
      next.startDate = 'Start date cannot be in the past';
    }

    // End date — required + not before start
    if (!form.endDate) {
      next.endDate = 'End date is required';
    } else if (form.startDate && form.endDate < form.startDate) {
      next.endDate = 'End date cannot be before start date';
    }

    if (!image) next.image = 'Please upload a vacation photo';

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
    formData.append('image',       image!);

    setLoading(true);
    try {
      await api.createVacation(formData);
      navigate('/admin');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to create vacation');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <form className="vacation-form glass" onSubmit={handleSubmit} noValidate>

        <div className="form-heading">
          <h2>✈️ Add Vacation</h2>
          <p>Fill in every field and upload a photo to publish a new vacation.</p>
        </div>

        {/* Server-side error (e.g. network failure) */}
        {serverError && <div className="form-error">{serverError}</div>}

        {/* ── Destination ─────────────────────────────────────────── */}
        <div className="field-group">
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            name="destination"
            type="text"
            placeholder="e.g. Paris, France"
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
            placeholder="Describe what makes this vacation special…"
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
            placeholder="0 – 10,000"
            value={form.price}
            onChange={handleChange}
            className={errors.price ? 'input-error' : ''}
          />
          <span className="field-hint">Between $0 and $10,000</span>
          <FieldError message={errors.price} />
        </div>

        {/* ── Image ───────────────────────────────────────────────── */}
        <div className="field-group">
          <label htmlFor="image">Vacation Photo</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`file-input${errors.image ? ' input-error' : ''}`}
          />
          <FieldError message={errors.image} />
          {/* Live preview as soon as the user picks a file */}
          {preview && (
            <img src={preview} alt="Preview of selected photo" className="image-preview" />
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
            {loading ? 'Saving…' : 'Add Vacation'}
          </button>
        </div>

      </form>
    </main>
  );
}


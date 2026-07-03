// Admin-only page — manage vacations.
// Guards: AdminRoute in App.tsx redirects non-admins away.
// Each card shows Edit + Delete buttons. Deletion requires inline confirmation.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import VacationCard from '../components/VacationCard';
import * as api from '../services/api';
import type { Vacation, VacationFilter, VacationsResponse } from '../types';
import '../styles/vacations.css';

export default function AdminVacations() {
  const navigate = useNavigate();

  const [data, setData]           = useState<VacationsResponse | null>(null);
  const [filter, setFilter]       = useState<VacationFilter>('all');
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  // Tracks which vacation is currently being deleted (shows loading on its button).
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, [page, filter]);

  async function load() {
    setLoading(true);
    try {
      const result = await api.getVacations(page, filter);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vacations');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    const vacation = data?.vacations.find(v => v.id === id);
    // Pass vacation in state so EditVacation can pre-fill the form without an extra API call.
    navigate(`/edit-vacation/${id}`, { state: { vacation } });
  }

  // Called when admin confirms deletion inside the card.
  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await api.deleteVacation(id);
      await load();
    } catch {
      setError('Delete failed. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  function handleFilterChange(newFilter: VacationFilter) {
    setFilter(newFilter);
    setPage(1);
  }

  if (loading) return <LoadingSpinner />;
  if (error)   return <p className="error-msg page-error">{error}</p>;

  return (
    <main className="vacations-page">
      <div className="admin-header">
        <h1>Manage Vacations</h1>
        <button className="btn-primary" onClick={() => navigate('/add-vacation')}>
          + Add Vacation
        </button>
      </div>

      <FilterBar active={filter} onChange={handleFilterChange} />

      {data && data.total > 0 && (
        <p className="page-info">{data.total} vacation{data.total !== 1 ? 's' : ''} total</p>
      )}

      {data?.vacations.length === 0 && (
        <div className="empty-state">No vacations found. Click <strong>+ Add Vacation</strong> to get started.</div>
      )}

      <div className="cards-grid">
        {data?.vacations.map((v: Vacation) => (
          <VacationCard
            key={v.id}
            vacation={v}
            isAdmin={true}
            isDeleting={deletingId === v.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {data && <Pagination page={data.page} pages={data.pages} onChange={setPage} />}
    </main>
  );
}


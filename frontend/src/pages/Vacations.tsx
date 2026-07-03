// Protected page — logged-in users only.
// Shows vacation cards with filters, pagination, and like/unlike.
// Admin sees cards but WITHOUT like buttons.

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import VacationCard from '../components/VacationCard';
import * as api from '../services/api';
import type { VacationFilter, VacationsResponse } from '../types';
import '../styles/vacations.css';

// Friendly message shown when a filter returns no results.
const EMPTY_MESSAGES: Record<VacationFilter, string> = {
  all:      'No vacations available.',
  liked:    "You haven't liked any vacations yet.",
  active:   'No vacations are active right now.',
  upcoming: 'No upcoming vacations found.',
};

export default function Vacations() {
  const { user } = useAuth();

  const [data, setData]         = useState<VacationsResponse | null>(null);
  const [filter, setFilter]     = useState<VacationFilter>('all');
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  // Tracks which vacation id is currently being liked/unliked (null = none).
  const [likingId, setLikingId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .getVacations(page, filter)
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [page, filter]);

  async function handleLike(id: number) {
    if (likingId !== null) return; // ignore click if another like is in progress

    const vacation = data?.vacations.find(v => v.id === id);
    if (!vacation) return;

    setLikingId(id);
    try {
      if (vacation.isLiked) {
        await api.unlikeVacation(id);
      } else {
        await api.likeVacation(id);
      }
      const updated = await api.getVacations(page, filter);
      setData(updated);
    } catch (err) {
      console.error('Like action failed:', err);
    } finally {
      setLikingId(null);
    }
  }

  function handleFilterChange(newFilter: VacationFilter) {
    setFilter(newFilter);
    setPage(1); // always go back to page 1 when filter changes
  }

  if (loading) return <LoadingSpinner />;
  if (error)   return <p className="error-msg page-error">{error}</p>;

  return (
    <main className="vacations-page">
      <h1>Vacations</h1>

      <FilterBar active={filter} onChange={handleFilterChange} />

      {/* Total count label */}
      {data && data.total > 0 && (
        <p className="page-info">
          {data.total} vacation{data.total !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Empty state */}
      {data?.vacations.length === 0 && (
        <div className="empty-state">{EMPTY_MESSAGES[filter]}</div>
      )}

      <div className="cards-grid">
        {data?.vacations.map(v => (
          <VacationCard
            key={v.id}
            vacation={v}
            isAdmin={user?.role === 'admin'}  // admins must not see like buttons
            isLiking={likingId === v.id}
            onLike={handleLike}
          />
        ))}
      </div>

      {data && <Pagination page={data.page} pages={data.pages} onChange={setPage} />}
    </main>
  );
}

// Filter tab bar — All / Liked / Active / Upcoming

import type { VacationFilter } from '../types';

interface Props {
  active: VacationFilter;
  onChange: (filter: VacationFilter) => void;
}

const FILTERS: { value: VacationFilter; label: string }[] = [
  { value: 'all',      label: 'All' },
  { value: 'liked',    label: '❤️ Liked' },
  { value: 'active',   label: '✈️ Active' },
  { value: 'upcoming', label: '🗓 Upcoming' },
];

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className="filter-bar" role="group" aria-label="Vacation filters">
      {FILTERS.map(f => (
        <button
          key={f.value}
          className={`filter-btn ${active === f.value ? 'active' : ''}`}
          onClick={() => onChange(f.value)}
          aria-pressed={active === f.value}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

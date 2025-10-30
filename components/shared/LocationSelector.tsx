'use client';

import React from 'react';
import { useRegion } from '@/lib/region-context';
import { Region } from '@/lib/electricity-api';

const REGIONS: { value: Region; label: string }[] = [
  { value: 'SE1', label: 'The ski cabin (SE1)' },
  { value: 'SE2', label: 'Cottage by the lake (SE2)' },
  { value: 'SE3', label: 'Home (SE3)' },
  { value: 'SE4', label: 'Summer house (SE4)' },
];

export function LocationSelector() {
  const { region, setRegion } = useRegion();
  const currentRegion = REGIONS.find(r => r.value === region);

  return (
    <div className="relative">
      <select
        value={region}
        onChange={(e) => setRegion(e.target.value as Region)}
        className="appearance-none bg-transparent border-none text-sm font-normal pr-6 focus:outline-none cursor-pointer hover:opacity-70 transition-opacity"
      >
        {REGIONS.map(r => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}


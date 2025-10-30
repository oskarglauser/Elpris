'use client';

import React from 'react';

export type DaySelection = 'today' | 'tomorrow';

interface DayToggleProps {
  selectedDay: DaySelection;
  onDayChange: (day: DaySelection) => void;
}

export function DayToggle({ selectedDay, onDayChange }: DayToggleProps) {
  return (
    <div className="px-4 pb-4">
      <div className="max-w-4xl mx-auto flex justify-center">
        <div className="inline-flex rounded bg-[#F2EFEC] p-1">
          <button
            onClick={() => onDayChange('today')}
            className={`px-4 py-1.5 text-sm rounded transition-colors ${
              selectedDay === 'today'
                ? 'bg-white text-[#000000] shadow-sm'
                : 'bg-[#CDC8C2] hover:bg-white/50 text-[#000000]'
            }`}
          >
            Idag
          </button>
          <button
            onClick={() => onDayChange('tomorrow')}
            className={`px-4 py-1.5 text-sm rounded transition-colors ${
              selectedDay === 'tomorrow'
                ? 'bg-white text-[#000000] shadow-sm'
                : 'bg-[#CDC8C2] hover:bg-white/50 text-[#000000]'
            }`}
          >
            Imorgon
          </button>
        </div>
      </div>
    </div>
  );
}


import React from 'react';

export function LocationSelector() {
  return (
    <button className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity">
      <span className="font-normal">Mor Wingmarks gränd 4</span>
      <ChevronDownIcon className="w-4 h-4" />
    </button>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}


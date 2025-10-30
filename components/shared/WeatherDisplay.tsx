import React from 'react';

export function WeatherDisplay() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CloudIcon className="w-5 h-5" />
      <span>+4.6°</span>
    </div>
  );
}

function CloudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}


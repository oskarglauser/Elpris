'use client';

import React, { useState } from 'react';
import { PriceInterval } from '@/lib/electricity-api';

interface QuickTimelineProps {
  prices: PriceInterval[];
  average: number;
  currentIndex: number;
}

export function QuickTimeline({ prices, average, currentIndex }: QuickTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const startIndex = Math.max(0, currentIndex);
  const endIndex = Math.min(prices.length, currentIndex + 48);
  const displayPrices = prices.slice(startIndex, endIndex);

  const getPriceColor = (price: number) => {
    const threshold = 0.15;
    if (price < average * (1 - threshold)) return '#009A33';
    if (price > average * (1 + threshold)) return '#D73333';
    return '#FFC107';
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative">
      <div className="flex gap-[0px] h-8 items-center">
        {displayPrices.map((interval, index) => {
          const globalIndex = startIndex + index;
          const isCurrent = globalIndex === currentIndex;
          const color = getPriceColor(interval.SEK_per_kWh);

          return (
            <div
              key={globalIndex}
              className="flex-1 h-full transition-all relative group"
              style={{
                backgroundColor: color,
                opacity: hoveredIndex === index || hoveredIndex === null ? 1 : 0.3,
                transform: isCurrent ? 'scaleY(1.2)' : 'scaleY(1)',
                border: isCurrent ? '2px solid #000' : 'none'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {formatTime(interval.time_start)}-{formatTime(interval.time_end)}
                  <br />
                  {(interval.SEK_per_kWh * 100).toFixed(1)} öre/kWh
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
        <span>Nu</span>
        <span>+6h</span>
        <span>+12h</span>
      </div>
    </div>
  );
}

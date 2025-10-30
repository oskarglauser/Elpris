'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import {
  fetchTodayAndTomorrowPrices,
  PriceInterval
} from '@/lib/electricity-api';
import { PriceChartGraph } from './PriceChartGraph';
import { DayToggle, DaySelection } from './DayToggle';
import { BottomNav } from '@/components/shared/BottomNav';

export function DetailView({ prototypeId }: { prototypeId: string }) {
  const [prices, setPrices] = useState<PriceInterval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DaySelection>('today');

  useEffect(() => {
    async function loadPrices() {
      try {
        const { today, tomorrow } = await fetchTodayAndTomorrowPrices();
        const allPrices = [...today, ...tomorrow];
        setPrices(allPrices);
        setError(null);
      } catch (error) {
        console.error('Failed to load prices:', error);
        setError(error instanceof Error ? error.message : 'Failed to load electricity prices');
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || prices.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-muted-foreground text-center">
          {error || 'No price data available'}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Retry
        </button>
        <Link
          href={`/prototype-${prototypeId}`}
          className="text-primary hover:opacity-70"
        >
          Back to overview
        </Link>
      </div>
    );
  }

  const todayPrices = prices.filter(p => {
    const date = new Date(p.time_start);
    const now = new Date();
    return date.getDate() === now.getDate() && date.getMonth() === now.getMonth();
  });

  const tomorrowPrices = prices.filter(p => {
    const date = new Date(p.time_start);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth();
  });

  const filteredPrices = selectedDay === 'today' ? todayPrices : tomorrowPrices;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* iOS-style header */}
      <div className="sticky top-0 z-50 bg-white">
        <div className="relative flex items-center justify-center px-4 py-3">
          <Link
            href={`/prototype-${prototypeId}`}
            className="absolute left-4 hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-base font-semibold">Elpris</h1>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white">
        {/* Price Chart */}
        <PriceChartGraph priceData={filteredPrices} selectedDay={selectedDay} />

        {/* Day Toggle */}
        <DayToggle selectedDay={selectedDay} onDayChange={setSelectedDay} />
      </div>

      <BottomNav prototypePrefix="/prototype-f" />
    </div>
  );
}


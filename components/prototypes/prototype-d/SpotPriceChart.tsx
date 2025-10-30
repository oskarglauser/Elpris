'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  fetchTodayAndTomorrowPrices,
  getCurrentPriceInterval,
  PriceInterval
} from '@/lib/electricity-api';

const DEFAULT_WINDOW_HOURS = 4;

interface WindowHighlight {
  start: string;
  end: string;
  average: number;
}

interface HighlightSet {
  best: WindowHighlight;
  avoid: WindowHighlight;
}

function getIntervalDurationMinutes(intervals: PriceInterval[]): number {
  if (intervals.length === 0) return 60;

  const diff =
    (new Date(intervals[0].time_end).getTime() - new Date(intervals[0].time_start).getTime()) /
    (60 * 1000);

  return diff > 0 ? diff : 60;
}

function formatTimeRangeShort(startIso: string, endIso: string) {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const start = new Date(startIso).toLocaleTimeString('sv-SE', options);
  const end = new Date(endIso).toLocaleTimeString('sv-SE', options);
  return `${start} - ${end}`;
}

function formatAveragePrice(valueInSek: number) {
  return `${Math.round(valueInSek * 100)} öre/kWh`;
}

function computeHighlights(
  intervals: PriceInterval[],
  windowHours: number = DEFAULT_WINDOW_HOURS
): HighlightSet | null {
  if (intervals.length === 0) {
    return null;
  }

  const intervalMinutes = getIntervalDurationMinutes(intervals);
  const windowSize = Math.max(1, Math.round((windowHours * 60) / intervalMinutes));

  if (intervals.length < windowSize) {
    const best = intervals.reduce((min, interval) =>
      interval.SEK_per_kWh < min.SEK_per_kWh ? interval : min
    );
    const avoid = intervals.reduce((max, interval) =>
      interval.SEK_per_kWh > max.SEK_per_kWh ? interval : max
    );

    return {
      best: {
        start: best.time_start,
        end: best.time_end,
        average: best.SEK_per_kWh
      },
      avoid: {
        start: avoid.time_start,
        end: avoid.time_end,
        average: avoid.SEK_per_kWh
      }
    };
  }

  let runningSum = 0;
  for (let i = 0; i < windowSize; i++) {
    runningSum += intervals[i].SEK_per_kWh;
  }

  let best = { average: runningSum / windowSize, startIndex: 0 };
  let avoid = { average: runningSum / windowSize, startIndex: 0 };

  for (let start = 1; start <= intervals.length - windowSize; start++) {
    runningSum += intervals[start + windowSize - 1].SEK_per_kWh;
    runningSum -= intervals[start - 1].SEK_per_kWh;

    const average = runningSum / windowSize;

    if (average < best.average) {
      best = { average, startIndex: start };
    }

    if (average > avoid.average) {
      avoid = { average, startIndex: start };
    }
  }

  const bestStartInterval = intervals[best.startIndex];
  const bestEndInterval = intervals[Math.min(best.startIndex + windowSize - 1, intervals.length - 1)];
  const avoidStartInterval = intervals[avoid.startIndex];
  const avoidEndInterval =
    intervals[Math.min(avoid.startIndex + windowSize - 1, intervals.length - 1)];

  return {
    best: {
      start: bestStartInterval.time_start,
      end: bestEndInterval.time_end,
      average: best.average
    },
    avoid: {
      start: avoidStartInterval.time_start,
      end: avoidEndInterval.time_end,
      average: avoid.average
    }
  };
}

function HighlightCard({
  title,
  highlight,
  accentColor,
  backgroundColor
}: {
  title: string;
  highlight: WindowHighlight;
  accentColor: string;
  backgroundColor: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded border border-border/50"
      style={{ backgroundColor }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: accentColor }}
      />
      <div className="relative px-3 py-3 pl-5">
        <div className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {title}
        </div>
        <div className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          {formatTimeRangeShort(highlight.start, highlight.end)}
        </div>
        <div className="mt-1 text-base font-semibold text-muted-foreground">
          {formatAveragePrice(highlight.average)}
        </div>
      </div>
    </div>
  );
}

export function SpotPriceChart({ prototypeId }: { prototypeId: string }) {
  const [highlights, setHighlights] = useState<HighlightSet | null>(null);
  const [currentPrice, setCurrentPrice] = useState<PriceInterval | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrices() {
      try {
        const { today } = await fetchTodayAndTomorrowPrices();
        setCurrentPrice(getCurrentPriceInterval(today));
        setHighlights(computeHighlights(today));
        setError(null);
      } catch (err) {
        console.error('Failed to load prices:', err);
        setError(err instanceof Error ? err.message : 'Failed to load electricity prices');
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
  }, []);

  const currentPriceOre = useMemo(() => {
    if (!currentPrice) return null;
    return Math.round(currentPrice.SEK_per_kWh * 100);
  }, [currentPrice]);

  const currentRange = useMemo(() => {
    if (!currentPrice) return null;
    return formatTimeRangeShort(currentPrice.time_start, currentPrice.time_end);
  }, [currentPrice]);

  if (loading) {
    return (
      <Card className="p-5">
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          Hämtar dagens priser...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-5">
        <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary/85"
          >
            Försök igen
          </button>
        </div>
      </Card>
    );
  }

  if (!highlights) {
    return (
      <Card className="p-5">
        <div className="text-center text-sm text-muted-foreground">
          Inga rekommendationer kunde skapas för idag.
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative p-5">
      <Link
        href={`/prototype-${prototypeId}/detail`}
        aria-label="Visa hela prisbilden"
        className="absolute right-5 top-5 rounded-full bg-primary/10 p-3 text-primary transition hover:bg-primary/20"
      >
        <ChevronRight className="h-6 w-6" />
      </Link>
      <div className="pr-14">
        <h2 className="text-base font-semibold tracking-tight">Dagens spotpris</h2>
        <p className="text-sm text-muted-foreground">Rekommendationer för SE3</p>

        {currentPriceOre !== null && (
          <div className="mt-3 flex flex-wrap items-baseline gap-2 text-foreground">
            <span className="text-2xl font-medium tracking-tight">
              {currentPriceOre} öre/kWh
            </span>
            {currentRange && (
              <span className="text-sm font-medium text-muted-foreground">
                {currentRange}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <HighlightCard
          title="Bästa tid"
          highlight={highlights.best}
          accentColor="#009A33"
          backgroundColor="#E6F6EA"
        />
        <HighlightCard
          title="Undvik"
          highlight={highlights.avoid}
          accentColor="#D73333"
          backgroundColor="#FCE8EA"
        />
      </div>
    </Card>
  );
}


'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { 
  fetchTodayAndTomorrowPrices, 
  PriceInterval, 
  formatTimeRange,
  getCurrentPriceInterval 
} from '@/lib/electricity-api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

export function SpotPriceChart({ prototypeId }: { prototypeId: string }) {
  const [prices, setPrices] = useState<PriceInterval[]>([]);
  const [displayedInterval, setDisplayedInterval] = useState<PriceInterval | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  // Memoize callbacks to prevent child re-renders
  const handleIntervalChange = useCallback((interval: PriceInterval, index: number) => {
    setDisplayedInterval(interval);
    setSelectedIndex(index);
  }, []);

  const handleReset = useCallback(() => {
    setDisplayedInterval(getCurrentPriceInterval(prices));
    setSelectedIndex(null);
  }, [prices]);

  useEffect(() => {
    async function loadPrices() {
      try {
        const { today, tomorrow } = await fetchTodayAndTomorrowPrices();
        const allPrices = [...today, ...tomorrow];
        setPrices(allPrices);
        const current = getCurrentPriceInterval(allPrices);
        setDisplayedInterval(current);
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
      <Card className="p-4 bg-card border-border">
        <div className="h-64 flex items-center justify-center">
          <div className="text-muted-foreground">Loading prices...</div>
        </div>
      </Card>
    );
  }

  if (error || prices.length === 0) {
    return (
      <Card className="p-4 bg-card border-border">
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <div className="text-muted-foreground text-center">
            {error || 'No price data available'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white rounded">
      <div className="flex justify-between items-start pb-3">
        <div className="flex-1">
          {displayedInterval && (
            <div className="flex items-end gap-1 leading-none mb-1">
              <span className="text-[32px] font-normal text-black leading-[36px] tracking-[-0.96px]">
                {(displayedInterval.SEK_per_kWh * 100).toFixed(1)}
              </span>
              <span className="text-[16px] font-normal text-black leading-[24px] tracking-[-0.24px] pb-[6px]">
                öre
              </span>
            </div>
          )}
          {displayedInterval && (
            <div className="text-[14px] font-normal text-black leading-[20px] tracking-[-0.14px]">
              {formatTimeRange(displayedInterval.time_start, displayedInterval.time_end, selectedIndex === null)}
            </div>
          )}
        </div>
        <Link href={`/prototype-${prototypeId}/detail`} className="flex items-center gap-0 text-[16px] font-normal text-black leading-[24px] tracking-[-0.24px] hover:opacity-70 transition-opacity">
          <span>Dagens elpris</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="relative h-[139px]">
        <RollingLineChart
          prices={prices}
          chartRef={chartRef}
          onIntervalChange={handleIntervalChange}
          onReset={handleReset}
        />
      </div>
    </Card>
  );
}

function RollingLineChart({
  prices,
  chartRef,
  onIntervalChange,
  onReset
}: {
  prices: PriceInterval[];
  chartRef: React.RefObject<ChartJS<'line'> | null>;
  onIntervalChange: (interval: PriceInterval, index: number) => void;
  onReset: () => void;
}) {
  const [activeIndexInWindow, setActiveIndexInWindow] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalChartRef = useRef<ChartJS | null>(null);
  const lastInteractionTimeRef = useRef<number>(0);
  const onResetRef = useRef(onReset);
  const onIntervalChangeRef = useRef(onIntervalChange);

  useEffect(() => {
    onResetRef.current = onReset;
    onIntervalChangeRef.current = onIntervalChange;
  }, [onReset, onIntervalChange]);

  // Get current time and create 18-hour window
  const now = new Date();
  const currentInterval = getCurrentPriceInterval(prices);
  const currentIndex = prices.findIndex(p =>
    new Date(p.time_start) <= now && new Date(p.time_end) > now
  );

  if (currentIndex === -1 || !currentInterval) {
    return <div className="text-muted-foreground">No price data available</div>;
  }

  // Start window 1-2 hours before current time
  // Go back 4-8 intervals (1-2 hours) depending on current time
  const backIntervals = 4; // 1 hour back
  const windowStartIndex = useMemo(() =>
    Math.max(0, currentIndex - backIntervals)
  , [currentIndex]);

  // Calculate 18-hour window (72 intervals: 18 hours × 4 quarters each)
  // But limit to available data
  const maxWindowSize = 72;
  const windowEndIndex = useMemo(() =>
    Math.min(windowStartIndex + maxWindowSize, prices.length)
  , [windowStartIndex, prices.length]);

  const windowIntervals = useMemo(() =>
    prices.slice(windowStartIndex, windowEndIndex)
  , [prices, windowStartIndex, windowEndIndex]);

  // Calculate price range
  const priceValues = useMemo(() =>
    windowIntervals.map(p => p.SEK_per_kWh * 100)
  , [windowIntervals]);

  const { minPrice, maxPrice, avgPrice } = useMemo(() => {
    const values = priceValues;
    return {
      minPrice: Math.min(...values),
      maxPrice: Math.max(...values),
      avgPrice: values.reduce((a, b) => a + b, 0) / values.length
    };
  }, [priceValues]);

  // Current index within the window
  const currentIndexInWindow = useMemo(() =>
    currentIndex - windowStartIndex
  , [currentIndex, windowStartIndex]);

  useEffect(() => {
    if (!canvasRef.current || windowIntervals.length === 0) return;

    if (internalChartRef.current) {
      internalChartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Create labels - show hours and minutes
    const labels = windowIntervals.map((interval) => {
      const start = new Date(interval.time_start);
      const h = String(start.getHours()).padStart(2, '0');
      const m = String(start.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    });

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(215, 51, 51, 0.1)');
    gradient.addColorStop(0.45, 'rgba(255, 193, 7, 0.1)');
    gradient.addColorStop(0.8, 'rgba(0, 154, 51, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 154, 51, 0.05)');

    const annotations: any = {};

    // Add white overlay for past time intervals
    if (currentIndexInWindow >= 0 && currentIndexInWindow < windowIntervals.length) {
      annotations.pastOverlay = {
        type: 'box',
        xMin: -0.5,
        xMax: currentIndexInWindow,
        yMin: 'min',
        yMax: 'max',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 0,
        drawTime: 'afterDatasetsDraw'
      };
    }

    // Add new day boundary indicator (solid line at midnight)
    for (let i = 1; i < windowIntervals.length; i++) {
      const prevDate = new Date(windowIntervals[i - 1].time_start);
      const currDate = new Date(windowIntervals[i].time_start);

      // Check if we crossed midnight
      if (prevDate.getDate() !== currDate.getDate()) {
        annotations[`dayBoundary${i}`] = {
          type: 'line',
          xMin: i,
          xMax: i,
          borderColor: '#CDC8C2',
          borderWidth: 1.5,
          borderDash: [0],
        };
      }
    }

    // Add current time line (grey dashed, no label)
    if (currentIndexInWindow >= 0 && currentIndexInWindow < windowIntervals.length) {
      annotations.currentTime = {
        type: 'line',
        xMin: currentIndexInWindow,
        xMax: currentIndexInWindow,
        borderColor: '#CDC8C2',
        borderWidth: 1.5,
        borderDash: [5, 5],
        label: {
          display: false
        }
      };
    }

    const chart = new ChartJS(canvasRef.current, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pris (öre/kWh)',
          data: priceValues,
          borderColor: '#191919',
          backgroundColor: gradient,
          borderWidth: 1.5,
          fill: 'origin',
          stepped: true,
          pointRadius: 0,
          pointHoverRadius: 0,
          segment: {
            borderColor: (ctx) => {
              const price = ctx.p1.parsed.y;
              if (price == null) return '#FFC107';
              if (price < avgPrice * 0.85) return '#009A33';
              if (price >= avgPrice * 1.15) return '#D73333';
              return '#FFC107';
            }
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'x'
        },
        onHover: (event, activeElements) => {
          if (activeElements.length > 0) {
            lastInteractionTimeRef.current = Date.now();
            const windowIndex = activeElements[0].index;
            const globalIndex = windowStartIndex + windowIndex;
            setActiveIndexInWindow(windowIndex);
            onIntervalChangeRef.current(prices[globalIndex], globalIndex);
          }
        },
        onClick: (event, activeElements) => {
          if (activeElements.length > 0) {
            const windowIndex = activeElements[0].index;
            const globalIndex = windowStartIndex + windowIndex;
            setActiveIndexInWindow(windowIndex);
            onIntervalChangeRef.current(prices[globalIndex], globalIndex);
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          annotation: {
            annotations
          }
        },
        scales: {
          y: {
            display: true,
            position: 'left',
            beginAtZero: true,
            min: 0,
            max: 90,
            ticks: {
              stepSize: 30,
              font: { size: 12 },
              color: '#000000',
              padding: 5,
              callback: function(value) {
                return value;
              }
            },
            grid: {
              display: true,
              color: '#CDC8C2',
              lineWidth: 1
            },
            border: {
              display: false
            }
          },
          x: {
            ticks: {
              font: { size: 12 },
              color: '#000000',
              maxRotation: 0,
              minRotation: 0,
              autoSkip: false,
              padding: 0,
              callback: function(value, index) {
                // Show label every 8 intervals (2 hours)
                if (index % 8 === 0) {
                  const interval = windowIntervals[index];
                  if (interval) {
                    const hour = new Date(interval.time_start).getHours();
                    return String(hour).padStart(2, '0');
                  }
                }
                return '';
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });

    internalChartRef.current = chart;

    return () => {
      if (internalChartRef.current) {
        internalChartRef.current.destroy();
      }
    };
  }, [windowStartIndex, windowEndIndex]);

  // Update active line annotation when hovering without recreating chart
  useEffect(() => {
    if (!internalChartRef.current) return;

    const chart = internalChartRef.current;
    const annotations = chart.options.plugins?.annotation?.annotations as any;

    if (!annotations) return;

    // Remove existing active line
    if (annotations.activeTimeLine) {
      delete annotations.activeTimeLine;
    }

    // Add active/selected line (black solid) if user is interacting
    if (activeIndexInWindow !== null && activeIndexInWindow >= 0 && activeIndexInWindow < windowIntervals.length) {
      annotations.activeTimeLine = {
        type: 'line',
        xMin: activeIndexInWindow,
        xMax: activeIndexInWindow,
        yMin: 0,
        yMax: 'max',
        borderColor: '#000000',
        borderWidth: 2,
        borderDash: [0],
        drawTime: 'afterDatasetsDraw',
        label: {
          display: false
        }
      };
    }

    // Use requestAnimationFrame for smoother updates on iOS Safari
    requestAnimationFrame(() => {
      // Check if chart still exists before updating (might be unmounted)
      if (internalChartRef.current) {
        internalChartRef.current.update('none');
      }
    });
  }, [activeIndexInWindow, windowIntervals.length]);

  // Auto-reset loop: if user stops interacting, reset to current time
  useEffect(() => {
    let rafId: number;

    const checkAndReset = () => {
      const timeSinceLastInteraction = Date.now() - lastInteractionTimeRef.current;

      // If no interaction for 150ms AND line is not at current time, reset
      if (timeSinceLastInteraction > 150 && activeIndexInWindow !== null) {
        setActiveIndexInWindow(null);
        onResetRef.current();
      }

      rafId = requestAnimationFrame(checkAndReset);
    };

    rafId = requestAnimationFrame(checkAndReset);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [activeIndexInWindow]);

  return <canvas ref={canvasRef} style={{ touchAction: 'none' }} />;
}


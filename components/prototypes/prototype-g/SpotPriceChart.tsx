'use client';

import React, { useEffect, useState, useRef } from 'react';
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
    <Card className="p-6 bg-card">
      <Link href={`/prototype-${prototypeId}/detail`} className="block">
        <div className="flex justify-between items-start mb-[-20] mt-[-10] cursor-pointer">
          <h2 className="text-xl font-normal text-[#1a1a1a]">Dagens spotpris</h2>
          <ChevronRight className="w-5 h-5 text-[#666]" />
        </div>
      </Link>
      <p className="text-sm text-[#666] mb-[-10]">Inklusive moms, exklusive avgifter</p>

      {displayedInterval && (
        <div className="bg-card border border-[#e5e5e5] rounded px-5 py-2.5 flex justify-between items-center mb-[-10]">
          <div className="flex items-center gap-2 text-[#1a1a1a] text-base">
            <span>{(() => {
              const currentInterval = getCurrentPriceInterval(prices);
              const isCurrentTime = currentInterval &&
                displayedInterval.time_start === currentInterval.time_start &&
                displayedInterval.time_end === currentInterval.time_end;

              const startTime = new Date(displayedInterval.time_start).toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const endTime = new Date(displayedInterval.time_end).toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return isCurrentTime ? `Just nu, ${startTime}-${endTime}` : `Idag, ${startTime}-${endTime}`;
            })()}</span>
          </div>
          <div className="text-[#1a1a1a] text-base font-semibold">
            {(displayedInterval.SEK_per_kWh * 100).toFixed(1)} öre
          </div>
        </div>
      )}

      <div className="relative h-[200px]">
        <RollingLineChart 
          prices={prices} 
          chartRef={chartRef}
          onIntervalChange={(interval, index) => {
            setDisplayedInterval(interval);
            setSelectedIndex(index);
          }}
          onReset={() => {
            setDisplayedInterval(getCurrentPriceInterval(prices));
            setSelectedIndex(null);
          }}
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
  const activeIndexRef = useRef<number | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    activeIndexRef.current = activeIndexInWindow;
  }, [activeIndexInWindow]);

  const crosshairPlugin = {
    id: 'crosshair',
    afterDraw: (chart: ChartJS) => {
      const activeIdx = activeIndexRef.current;
      if (activeIdx !== null && activeIdx >= 0) {
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        const dataPoint = meta.data[activeIdx];

        if (dataPoint) {
          const x = dataPoint.x;
          const y = dataPoint.y;

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#000000';
          ctx.fill();
          ctx.restore();
        }
      }
    }
  };

  // Get current time and create 18-hour window starting from current hour
  const now = new Date();
  const currentInterval = getCurrentPriceInterval(prices);
  const currentIndex = prices.findIndex(p =>
    new Date(p.time_start) <= now && new Date(p.time_end) > now
  );

  if (currentIndex === -1 || !currentInterval) {
    return <div className="text-muted-foreground">No price data available</div>;
  }

  // Get the start hour
  const currentStart = new Date(currentInterval.time_start);
  const currentHour = currentStart.getHours();

  // Find the start of one hour back from current time
  const oneHourBackIndex = Math.max(0, currentIndex - 4); // Go back 4 intervals (1 hour)
  const oneHourBackStart = new Date(prices[oneHourBackIndex].time_start);
  const oneHourBackHour = oneHourBackStart.getHours();

  // Find the start of the hour that's one hour back (first interval of that hour)
  const hourStartIndex = prices.findIndex(p => {
    const start = new Date(p.time_start);
    return start.getHours() === oneHourBackHour && start.getMinutes() === 0;
  });

  // Create 18-hour slice (72 intervals: 18 hours × 4 quarters each)
  const windowStart = hourStartIndex >= 0 ? hourStartIndex : oneHourBackIndex;
  const windowEnd = Math.min(windowStart + 72, prices.length);
  const windowIntervals = prices.slice(windowStart, windowEnd);

  // Calculate price range
  const priceValues = windowIntervals.map(p => p.SEK_per_kWh * 100); // Convert to öre
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);
  const avgPrice = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;

  // Current index within the window
  const currentIndexInWindow = currentIndex - windowStart;

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

    // Add current time line with "Nu" label (black dashed)
    if (currentIndexInWindow >= 0 && currentIndexInWindow < windowIntervals.length) {
      annotations.currentTime = {
        type: 'line',
        xMin: currentIndexInWindow,
        xMax: currentIndexInWindow,
        borderColor: '#000000',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: 'Nu',
          position: 'start',
          backgroundColor: '#000000',
          color: '#FFFFFF',
          font: { size: 11 },
          padding: 4
        }
      };
    }

    const chart = new ChartJS(canvasRef.current, {
      type: 'line',
      plugins: [crosshairPlugin],
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
            const windowIndex = activeElements[0].index;
            const globalIndex = windowStart + windowIndex;
            setActiveIndexInWindow(windowIndex);
            onIntervalChange(prices[globalIndex], globalIndex);
          }
        },
        onClick: (event, activeElements) => {
          if (activeElements.length > 0) {
            const windowIndex = activeElements[0].index;
            const globalIndex = windowStart + windowIndex;
            setActiveIndexInWindow(windowIndex);
            onIntervalChange(prices[globalIndex], globalIndex);
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
            display: false,
            beginAtZero: false,
            min: Math.floor(minPrice * 0.95),
            max: Math.ceil(maxPrice * 1.05),
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          x: {
            ticks: {
              font: { size: 11 },
              color: '#000000',
              maxRotation: 0,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 12,
              padding: 0,
              callback: function(value, index) {
                const label = this.getLabelForValue(value as number);
                return label.split(':')[0];
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
  }, [windowStart, windowEnd, currentIndexInWindow]);

  // Update active line annotation and dot when hovering without recreating chart
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

    chart.update('none'); // Update without animation, triggers crosshair plugin
  }, [activeIndexInWindow, windowIntervals.length]);

  // Add double-click to reset and mouse leave to auto-return to current time
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const handleDoubleClick = () => {
        setActiveIndexInWindow(null);
        onReset();
      };
      const handleMouseLeave = () => {
        setActiveIndexInWindow(null);
        onReset();
      };
      canvas.addEventListener('dblclick', handleDoubleClick);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        canvas.removeEventListener('dblclick', handleDoubleClick);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [onReset]);

  return <canvas ref={canvasRef} />;
}


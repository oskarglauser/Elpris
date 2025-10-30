'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Filler,
  ChartOptions
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import {
  fetchTodayAndTomorrowPrices,
  PriceInterval,
  calculatePriceStats,
  getPriceLevel,
  formatTimeRange,
  getCurrentPriceInterval
} from '@/lib/electricity-api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Filler,
  annotationPlugin
);

export function SpotPriceChart({ prototypeId }: { prototypeId: string }) {
  const [prices, setPrices] = useState<PriceInterval[]>([]);
  const [currentPrice, setCurrentPrice] = useState<PriceInterval | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrices() {
      try {
        const { today, tomorrow } = await fetchTodayAndTomorrowPrices();
        const allPrices = [...today, ...tomorrow];
        setPrices(allPrices);
        setCurrentPrice(getCurrentPriceInterval(today));
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

  const stats = calculatePriceStats(prices);

  return (
    <Card className="p-4 bg-card border-border">
      <Link href={`/prototype-${prototypeId}/detail`}>
        <div className="mb-0 cursor-pointer">
          {currentPrice && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-normal">Spotpris just nu</h2>
              <div className="flex items-center gap-2">
                <div className="text-lg font-normal">
                  {(currentPrice.SEK_per_kWh * 100).toFixed(1)} <span className="text-xs">öre/kWh</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="relative h-24 mb-0 -mt-2">
        <PriceStepGraph prices={prices} average={stats.average} />
      </div>

      <div className="flex items-center text-sm gap-1">
        <div className="flex-1 text-black flex flex-col items-start">
          <div className="text-xs">Lägsta</div>
          <div className="text-lg" style={{ color: '#009A33' }}>{(stats.min * 100).toFixed(1)} <span className="text-xs">öre</span></div>
        </div>
        <div className="flex-1 text-black flex flex-col items-start">
          <div className="text-xs">Snittpris</div>
          <div className="text-lg">{(stats.average * 100).toFixed(1)} <span className="text-xs">öre</span></div>
        </div>
        <div className="flex-1 text-black flex flex-col items-start">
          <div className="text-xs">Högsta</div>
          <div className="text-lg" style={{ color: '#D73333' }}>{(stats.max * 100).toFixed(1)} <span className="text-xs">öre</span></div>
        </div>
      </div>
    </Card>
  );
}

function PriceStepGraph({ prices, average }: { prices: PriceInterval[]; average: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const now = new Date();

  // Calculate window: 1 hour back + max 12 hours forward
  const currentIndex = prices.findIndex(p => {
    const start = new Date(p.time_start);
    const end = new Date(p.time_end);
    return now >= start && now < end;
  });

  let displayPrices: PriceInterval[];
  let displayStartIndex = 0;

  if (currentIndex === -1) {
    // No current interval found, show all available prices
    displayPrices = prices;
    displayStartIndex = 0;
  } else {
    // Start 1 hour back (4 intervals) and show all remaining data
    displayStartIndex = Math.max(0, currentIndex - 4);
    displayPrices = prices.slice(displayStartIndex);
  }

  // Find current time position in displayPrices
  const currentDisplayIndex = currentIndex === -1 ? -1 : currentIndex - displayStartIndex;

  useEffect(() => {
    if (!canvasRef.current || displayPrices.length === 0) return;

    const pricesInOre = displayPrices.map(item => Math.round(item.SEK_per_kWh * 100));
    const labels = displayPrices.map(item => {
      const time = new Date(item.time_start);
      const h = String(time.getHours()).padStart(2, '0');
      const m = String(time.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    });

    const avgPrice = average * 100; // Convert to ore

    const annotations: any = {};

    // Add current time indicator
    if (currentDisplayIndex >= 0 && currentDisplayIndex < displayPrices.length) {
      annotations.currentTime = {
        type: 'line',
        xMin: currentDisplayIndex,
        xMax: currentDisplayIndex,
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

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 100);
    gradient.addColorStop(0, 'rgba(215, 51, 51, 0.1)');
    gradient.addColorStop(0.45, 'rgba(255, 193, 7, 0.1)');
    gradient.addColorStop(0.8, 'rgba(0, 154, 51, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 154, 51, 0.05)');

    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pris (öre/kWh)',
          data: pricesInOre,
          borderColor: '#191919',
          backgroundColor: gradient,
          borderWidth: 1.5,
          fill: 'origin',
          stepped: true,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#000000',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 2,
          segment: {
            borderColor: (ctx) => {
              const price = ctx.p1.parsed.y;
              if (price == null) return '#FFD15F';
              if (price < avgPrice * 0.85) return '#009A33';
              if (price >= avgPrice * 1.15) return '#D73333';
              return '#FFD15F';
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
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            padding: 12,
            titleFont: { size: 11 },
            bodyFont: { size: 12 },
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
              title: (context) => {
                const startTime = context[0].label;
                const [h, m] = startTime.split(':');
                const endMinute = (parseInt(m) + 15) % 60;
                const endHour = endMinute === 0 ? (parseInt(h) + 1) % 24 : parseInt(h);
                const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
                return `${startTime} - ${endTime}`;
              },
              label: (context) => `${context.parsed.y} öre/kWh`
            }
          },
          annotation: {
            annotations
          }
        },
        scales: {
          y: {
            display: false,
            beginAtZero: false,
            min: Math.floor(Math.min(...pricesInOre) * 0.95),
            max: Math.ceil(Math.max(...pricesInOre) * 1.05)
          },
          x: {
            display: false
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [displayPrices, average, currentDisplayIndex]);

  if (displayPrices.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground text-xs">No price data available</p>
      </div>
    );
  }

  // Show exactly 5 time labels evenly distributed
  const hourlyLabels: { index: number; label: string }[] = [];
  const labelCount = 5;
  const step = Math.floor(displayPrices.length / labelCount);

  for (let i = 0; i < labelCount; i++) {
    const index = i * step;
    if (index < displayPrices.length) {
      const price = displayPrices[index];
      const startTime = new Date(price.time_start);
      hourlyLabels.push({
        index,
        label: startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
      });
    }
  }

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        {hourlyLabels.map(({ index, label }) => (
          <span
            key={index}
            className="text-[10px] text-muted-foreground"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              position: 'absolute',
              left: `${(index / displayPrices.length) * 100}%`
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}


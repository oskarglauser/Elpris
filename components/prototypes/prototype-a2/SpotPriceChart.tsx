'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight, ArrowDownRight } from 'lucide-react';
import {
  fetchTodayAndTomorrowPrices,
  PriceInterval,
  formatTimeRange,
  getCurrentPriceInterval
} from '@/lib/electricity-api';
import { useRegion } from '@/lib/region-context';
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
  const { region } = useRegion();
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
      setLoading(true);
      try {
        const { today, tomorrow } = await fetchTodayAndTomorrowPrices(region);
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
  }, [region]);

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
      <div className="flex justify-between items-start pb-1">
        <div className="flex-1">
          {displayedInterval && (
            <div className="flex items-end gap-1 leading-none mb-0">
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
              {formatTimeRange(displayedInterval.time_start, displayedInterval.time_end, selectedIndex === null, 'today')}
            </div>
          )}
        </div>
        <Link href={`/prototype-${prototypeId}/detail`} className="flex items-center gap-0 text-[16px] font-normal text-black leading-[24px] tracking-[-0.24px] hover:opacity-70 transition-opacity">
          <span>Se mer</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="relative h-[160px]">
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
  const [activeLineOpacity, setActiveLineOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [labelPosition, setLabelPosition] = useState<{ x: number; y: number; time: string } | null>(null);
  const [labelVisible, setLabelVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalChartRef = useRef<ChartJS | null>(null);
  const isTouchingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const currentIndexInWindowRef = useRef<number>(0);
  const prevIndexRef = useRef<number | null>(null);
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

  // Show all available future prices (no window limit)
  const windowEndIndex = useMemo(() =>
    prices.length
  , [windowStartIndex, prices.length]);

  const windowIntervals = useMemo(() =>
    prices.slice(windowStartIndex, windowEndIndex)
  , [prices, windowStartIndex, windowEndIndex]);

  // Calculate price range
  const priceValues = useMemo(() =>
    windowIntervals.map(p => p.SEK_per_kWh * 100)
  , [windowIntervals]);

  const { minPrice, maxPrice, avgPrice, yAxisMin, yAxisMax, yAxisStep } = useMemo(() => {
    const values = priceValues;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    // Calculate nice axis bounds
    const range = max - min;
    const padding = range * 0.1; // 10% padding
    const axisMin = Math.max(0, Math.floor((min - padding) / 10) * 10);
    const axisMax = Math.ceil((max + padding) / 10) * 10;
    const axisRange = axisMax - axisMin;

    // Calculate step size (aim for 3-4 ticks)
    let step = 10;
    if (axisRange <= 30) step = 10;
    else if (axisRange <= 60) step = 20;
    else if (axisRange <= 90) step = 30;
    else step = Math.ceil(axisRange / 4 / 10) * 10;

    return {
      minPrice: min,
      maxPrice: max,
      avgPrice: avg,
      yAxisMin: axisMin,
      yAxisMax: axisMax,
      yAxisStep: step
    };
  }, [priceValues]);

  // Current index within the window
  const currentIndexInWindow = useMemo(() =>
    currentIndex - windowStartIndex
  , [currentIndex, windowStartIndex]);

  // Find best charging stretch (longest and lowest stretch of low prices)
  const bestChargingStretch = useMemo(() => {
    const startSearchIndex = currentIndexInWindow + 1;
    if (startSearchIndex >= windowIntervals.length) return null;

    const cheapThreshold = avgPrice * 0.85;
    const stretches: Array<{ startIndex: number; endIndex: number; avgPrice: number }> = [];

    // Find all continuous stretches of cheap prices
    let stretchStart: number | null = null;
    for (let i = startSearchIndex; i < windowIntervals.length; i++) {
      const isCheap = priceValues[i] < cheapThreshold;

      if (isCheap && stretchStart === null) {
        stretchStart = i;
      } else if (!isCheap && stretchStart !== null) {
        stretches.push({
          startIndex: stretchStart,
          endIndex: i - 1,
          avgPrice: priceValues.slice(stretchStart, i).reduce((a, b) => a + b, 0) / (i - stretchStart)
        });
        stretchStart = null;
      }
    }

    // If stretch continues to end of data
    if (stretchStart !== null) {
      stretches.push({
        startIndex: stretchStart,
        endIndex: windowIntervals.length - 1,
        avgPrice: priceValues.slice(stretchStart).reduce((a, b) => a + b, 0) / (windowIntervals.length - stretchStart)
      });
    }

    if (stretches.length === 0) return null;

    // Score each stretch: duration × savings percentage
    const scoredStretches = stretches.map(stretch => {
      const duration = (stretch.endIndex - stretch.startIndex + 1) * 0.25; // hours
      const savings = ((avgPrice - stretch.avgPrice) / avgPrice) * 100; // percent
      const score = duration * savings;
      return { ...stretch, score };
    });

    // Find best stretch
    const best = scoredStretches.reduce((prev, curr) => curr.score > prev.score ? curr : prev);

    const time = new Date(windowIntervals[best.startIndex].time_start);
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');

    return { index: best.startIndex, time: `${h}:${m}` };
  }, [windowIntervals, priceValues, avgPrice, currentIndexInWindow]);

  // Keep ref updated
  useEffect(() => {
    currentIndexInWindowRef.current = currentIndexInWindow;
  }, [currentIndexInWindow]);

  useEffect(() => {
    if (!canvasRef.current || windowIntervals.length === 0) return;

    if (internalChartRef.current) {
      internalChartRef.current.destroy();
    }

    setLabelVisible(false);

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

    // Add new day boundary indicator (dashed line at midnight)
    for (let i = 1; i < windowIntervals.length; i++) {
      const currDate = new Date(windowIntervals[i].time_start);
      const currHour = currDate.getHours();
      const currMinute = currDate.getMinutes();

      // Check if this interval starts at exactly 00:00
      if (currHour === 0 && currMinute === 0) {
        annotations[`dayBoundary${i}`] = {
          type: 'line',
          xMin: i - 0.5,
          xMax: i - 0.5,
          borderColor: '#CDC8C2',
          borderWidth: 1.5,
          borderDash: [5, 5],
        };
      }
    }

    // Add current time line (black dashed, color updated dynamically by separate effect)
    if (currentIndexInWindow >= 0 && currentIndexInWindow < windowIntervals.length) {
      annotations.currentTime = {
        type: 'line',
        xMin: currentIndexInWindow,
        xMax: currentIndexInWindow,
        borderColor: '#191919',
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
          stepped: 'middle',
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
        layout: {
          padding: {
            top: 5,
            bottom: 0,
            left: 0,
            right: 0
          }
        },
        interaction: {
          mode: 'index',
          intersect: false,
          axis: 'x'
        },
        onHover: (event, activeElements) => {
          if (activeElements.length > 0 && isTouchingRef.current) {
            const windowIndex = activeElements[0].index;

            // Haptic feedback when crossing to new interval
            if (prevIndexRef.current !== windowIndex && navigator.vibrate) {
              navigator.vibrate(1);
            }
            prevIndexRef.current = windowIndex;

            const globalIndex = windowStartIndex + windowIndex;
            setActiveIndexInWindow(windowIndex);
            setActiveLineOpacity(1);
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
            beginAtZero: false,
            min: yAxisMin,
            max: yAxisMax,
            ticks: {
              stepSize: yAxisStep,
              font: { size: 12 },
              color: '#000000',
              padding: 3,
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
            type: 'category',
            offset: true,
            bounds: 'data',
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
  }, [windowStartIndex, windowEndIndex, windowIntervals, yAxisMin, yAxisMax, yAxisStep, avgPrice]);

  // Calculate label position after chart render
  useEffect(() => {
    if (!internalChartRef.current || !bestChargingStretch) {
      setLabelPosition(null);
      setLabelVisible(false);
      return;
    }

    const chart = internalChartRef.current;
    const chartArea = chart.chartArea;

    let x = chart.scales.x.getPixelForValue(bestChargingStretch.index);
    let y = chart.scales.y.getPixelForValue(priceValues[bestChargingStretch.index]) - 20;

    // Ensure label stays within chart bounds
    const labelWidth = 50; // Approximate width of label with time + icon
    const labelHeight = 20; // Approximate height

    if (x - labelWidth / 2 < chartArea.left) {
      x = chartArea.left + labelWidth / 2;
    } else if (x + labelWidth / 2 > chartArea.right) {
      x = chartArea.right - labelWidth / 2;
    }

    if (y - labelHeight < chartArea.top) {
      y = chartArea.top + labelHeight;
    }

    setLabelPosition({
      x,
      y,
      time: bestChargingStretch.time
    });

    // Fade in label after a short delay
    setTimeout(() => {
      setLabelVisible(true);
    }, 300);
  }, [internalChartRef.current, bestChargingStretch, priceValues]);

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
      const opacity = activeLineOpacity;
      annotations.activeTimeLine = {
        type: 'line',
        xMin: activeIndexInWindow,
        xMax: activeIndexInWindow,
        yMin: 0,
        yMax: 'max',
        borderColor: `rgba(0, 0, 0, ${opacity})`,
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
  }, [activeIndexInWindow, activeLineOpacity, windowIntervals.length]);

  // Update current time line color when dragging state changes
  useEffect(() => {
    if (!internalChartRef.current) return;

    const chart = internalChartRef.current;
    const annotations = chart.options.plugins?.annotation?.annotations as any;

    if (!annotations || !annotations.currentTime) return;

    // Update current time line color based on dragging state
    annotations.currentTime.borderColor = isDragging ? '#CDC8C2' : '#191919';

    requestAnimationFrame(() => {
      if (internalChartRef.current) {
        internalChartRef.current.update('none');
      }
    });
  }, [isDragging]);

  // Fade out line at current position
  const fadeOutLine = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const fadeDuration = 200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      setActiveLineOpacity(1 - progress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Fade complete - hide line and reset
        setActiveIndexInWindow(null);
        setActiveLineOpacity(1);
        onResetRef.current();
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Pointer event handlers to track touch state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setActiveLineOpacity(1);
      setIsDragging(true);
      isTouchingRef.current = true;
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      isTouchingRef.current = false;
      prevIndexRef.current = null;
      if (activeIndexInWindow !== null) {
        fadeOutLine();
      }
    };

    const handlePointerLeave = () => {
      setIsDragging(false);
      isTouchingRef.current = false;
      prevIndexRef.current = null;
      if (activeIndexInWindow !== null) {
        fadeOutLine();
      }
    };

    const handlePointerCancel = () => {
      setIsDragging(false);
      isTouchingRef.current = false;
      prevIndexRef.current = null;
      if (activeIndexInWindow !== null) {
        fadeOutLine();
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [activeIndexInWindow]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} style={{ touchAction: 'none' }} />
      {labelPosition && (
        <div
          className="absolute flex items-center gap-1 px-[6px] py-[3px] rounded text-white text-[11px] font-normal pointer-events-none transition-opacity duration-300"
          style={{
            left: `${labelPosition.x}px`,
            top: `${labelPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            backgroundColor: '#009A33',
            opacity: labelVisible ? 1 : 0
          }}
        >
          <span>{labelPosition.time}</span>
          <ArrowDownRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}


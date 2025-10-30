'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
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
  ChartOptions
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { PriceInterval, formatTimeRange, getCurrentPriceInterval } from '@/lib/electricity-api';

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

interface PriceChartGraphProps {
  priceData: PriceInterval[];
  selectedDay: 'today' | 'tomorrow';
}

export function PriceChartGraph({ priceData, selectedDay }: PriceChartGraphProps) {
  const [displayedInterval, setDisplayedInterval] = useState<PriceInterval | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeIndexInChart, setActiveIndexInChart] = useState<number | null>(null);
  const [activeLineOpacity, setActiveLineOpacity] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const isTouchingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const onIntervalChangeRef = useRef<(interval: PriceInterval, index: number) => void>(() => {});
  const onResetRef = useRef<() => void>(() => {});

  // Update refs for callbacks
  useEffect(() => {
    onIntervalChangeRef.current = (interval: PriceInterval, index: number) => {
      setDisplayedInterval(interval);
      setSelectedIndex(index);
    };

    onResetRef.current = () => {
      if (selectedDay === 'tomorrow') {
        // For tomorrow, reset to first interval instead of "current"
        setDisplayedInterval(priceData[0] || null);
      } else {
        // For today, reset to current interval
        const current = getCurrentPriceInterval(priceData);
        setDisplayedInterval(current);
      }
      setSelectedIndex(null);
    };
  }, [priceData, selectedDay]);

  // Initialize displayed interval
  useEffect(() => {
    if (priceData.length > 0) {
      const current = getCurrentPriceInterval(priceData);
      setDisplayedInterval(current || priceData[0]);
    }
  }, [priceData, selectedDay]);

  // Empty state
  if (priceData.length === 0) {
    return (
      <div className="px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="text-gray-400 text-center">
              <p className="text-lg font-medium">Priser för imorgon är inte tillgängliga än</p>
              <p className="text-sm mt-2">Morgondagens priser publiceras tidigast kl 13:00</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-2 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Price Display Header */}
        <div className="flex-1 mb-3 text-center">
          {displayedInterval && (
            <div className="flex items-end gap-1 leading-none mb-0 justify-center">
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
              {formatTimeRange(displayedInterval.time_start, displayedInterval.time_end, selectedIndex === null && selectedDay === 'today')}
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="relative h-[500px]">
          <InteractiveChart
            priceData={priceData}
            selectedDay={selectedDay}
            canvasRef={canvasRef}
            chartRef={chartRef}
            isTouchingRef={isTouchingRef}
            animationFrameRef={animationFrameRef}
            activeIndexInChart={activeIndexInChart}
            setActiveIndexInChart={setActiveIndexInChart}
            activeLineOpacity={activeLineOpacity}
            setActiveLineOpacity={setActiveLineOpacity}
            onIntervalChangeRef={onIntervalChangeRef}
            onResetRef={onResetRef}
          />
        </div>
      </div>
    </div>
  );
}

interface InteractiveChartProps {
  priceData: PriceInterval[];
  selectedDay: 'today' | 'tomorrow';
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  chartRef: React.MutableRefObject<ChartJS | null>;
  isTouchingRef: React.MutableRefObject<boolean>;
  animationFrameRef: React.MutableRefObject<number | null>;
  activeIndexInChart: number | null;
  setActiveIndexInChart: (index: number | null) => void;
  activeLineOpacity: number;
  setActiveLineOpacity: (opacity: number) => void;
  onIntervalChangeRef: React.MutableRefObject<(interval: PriceInterval, index: number) => void>;
  onResetRef: React.MutableRefObject<() => void>;
}

function InteractiveChart({
  priceData,
  selectedDay,
  canvasRef,
  chartRef,
  isTouchingRef,
  animationFrameRef,
  activeIndexInChart,
  setActiveIndexInChart,
  activeLineOpacity,
  setActiveLineOpacity,
  onIntervalChangeRef,
  onResetRef
}: InteractiveChartProps) {

  // Calculate prices and stats
  const prices = useMemo(() => priceData.map(item => item.SEK_per_kWh * 100), [priceData]);
  const avgPrice = useMemo(() => prices.reduce((a, b) => a + b, 0) / prices.length, [prices]);

  // Calculate dynamic y-axis bounds
  const { yAxisMin, yAxisMax, yAxisStep } = useMemo(() => {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    const padding = range * 0.15;

    // Calculate initial bounds
    let axisMin = Math.max(0, Math.floor((min - padding) / 10) * 10);
    let tempMax = Math.ceil((max + padding) / 10) * 10;
    let axisRange = tempMax - axisMin;

    // Determine step size aiming for 8-10 labels
    let step = 10;
    if (axisRange <= 60) step = 10;
    else if (axisRange <= 100) step = 10;
    else if (axisRange <= 140) step = 15;
    else if (axisRange <= 200) step = 20;
    else if (axisRange <= 300) step = 30;
    else step = Math.ceil(axisRange / 9 / 10) * 10;

    // Round max up to next multiple of step for even spacing
    const axisMax = Math.ceil(tempMax / step) * step;

    return { yAxisMin: axisMin, yAxisMax: axisMax, yAxisStep: step };
  }, [prices]);

  // Find current time index (only for 'today')
  const currentIndex = useMemo(() => {
    if (selectedDay !== 'today') return -1;
    const now = new Date();
    return priceData.findIndex(item => {
      const start = new Date(item.time_start);
      const end = new Date(item.time_end);
      return now >= start && now < end;
    });
  }, [priceData, selectedDay]);

  // Find smart labels: max 1 "going up" and 1 "going down" in the future
  const smartLabels = useMemo(() => {
    const labels: Array<{ index: number; type: 'up' | 'down'; time: string }> = [];

    if (selectedDay !== 'today' || currentIndex < 0) {
      return labels;
    }

    let foundUp = false;
    let foundDown = false;

    for (let i = currentIndex + 1; i < prices.length && (!foundUp || !foundDown); i++) {
      const prevPrice = prices[i - 1];
      const currPrice = prices[i];
      const prevCategory = prevPrice < avgPrice * 0.85 ? 'green' : prevPrice >= avgPrice * 1.15 ? 'red' : 'yellow';
      const currCategory = currPrice < avgPrice * 0.85 ? 'green' : currPrice >= avgPrice * 1.15 ? 'red' : 'yellow';

      // Transition to expensive
      if (!foundUp && (prevCategory === 'green' || prevCategory === 'yellow') && currCategory === 'red') {
        const time = new Date(priceData[i].time_start);
        const h = String(time.getHours()).padStart(2, '0');
        const m = String(time.getMinutes()).padStart(2, '0');
        labels.push({ index: i, type: 'up', time: `${h}:${m}` });
        foundUp = true;
      }

      // Transition to cheap
      if (!foundDown && (prevCategory === 'red' || prevCategory === 'yellow') && currCategory === 'green') {
        const time = new Date(priceData[i].time_start);
        const h = String(time.getHours()).padStart(2, '0');
        const m = String(time.getMinutes()).padStart(2, '0');
        labels.push({ index: i, type: 'down', time: `${h}:${m}` });
        foundDown = true;
      }
    }

    return labels;
  }, [prices, avgPrice, currentIndex, priceData, selectedDay]);

  // Fade out animation
  const fadeOutLine = useCallback(() => {
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
        setActiveIndexInChart(null);
        setActiveLineOpacity(1);
        onResetRef.current();
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [animationFrameRef, setActiveIndexInChart, setActiveLineOpacity, onResetRef]);

  // Pointer event handlers
  const handlePointerDown = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setActiveLineOpacity(1);
    isTouchingRef.current = true;
  }, [animationFrameRef, setActiveLineOpacity, isTouchingRef]);

  const handlePointerUp = useCallback(() => {
    isTouchingRef.current = false;
    if (activeIndexInChart !== null) {
      fadeOutLine();
    }
  }, [isTouchingRef, activeIndexInChart, fadeOutLine]);

  const handlePointerLeave = useCallback(() => {
    if (isTouchingRef.current) {
      isTouchingRef.current = false;
      if (activeIndexInChart !== null) {
        fadeOutLine();
      }
    }
  }, [isTouchingRef, activeIndexInChart, fadeOutLine]);

  const handlePointerCancel = useCallback(() => {
    isTouchingRef.current = false;
    if (activeIndexInChart !== null) {
      fadeOutLine();
    }
  }, [isTouchingRef, activeIndexInChart, fadeOutLine]);

  // Create chart
  useEffect(() => {
    if (!canvasRef.current || priceData.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = priceData.map(item => {
      const time = new Date(item.time_start);
      const h = String(time.getHours()).padStart(2, '0');
      const m = String(time.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    });

    const gradient = ctx.createLinearGradient(0, 0, 0, 500);
    gradient.addColorStop(0, 'rgba(215, 51, 51, 0.1)');
    gradient.addColorStop(0.45, 'rgba(255, 193, 7, 0.1)');
    gradient.addColorStop(0.8, 'rgba(0, 154, 51, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 154, 51, 0.05)');

    const annotations: any = {};

    // Add current time line (only for 'today')
    if (currentIndex >= 0) {
      annotations.currentTime = {
        type: 'line',
        xMin: currentIndex,
        xMax: currentIndex,
        borderColor: '#CDC8C2',
        borderWidth: 1.5,
        borderDash: [0],
      };
    }

    // Add smart labels
    smartLabels.forEach((label, idx) => {
      annotations[`label_${idx}`] = {
        type: 'label',
        xValue: label.index,
        yValue: prices[label.index],
        backgroundColor: label.type === 'up' ? '#D73333' : '#009A33',
        color: '#FFFFFF',
        content: label.time,
        font: { size: 11 },
        padding: { top: 3, bottom: 3, left: 6, right: 6 },
        borderRadius: 4,
        position: 'start'
      };
    });

    const chart = new ChartJS(canvasRef.current, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pris (öre/kWh)',
          data: prices,
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
            const index = activeElements[0].index;
            setActiveIndexInChart(index);
            setActiveLineOpacity(1);
            onIntervalChangeRef.current(priceData[index], index);
          }
        },
        onClick: (event, activeElements) => {
          if (activeElements.length > 0) {
            const index = activeElements[0].index;
            setActiveIndexInChart(index);
            onIntervalChangeRef.current(priceData[index], index);
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
                  const interval = priceData[index];
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

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [priceData, prices, avgPrice, currentIndex, smartLabels, yAxisMin, yAxisMax, yAxisStep, selectedDay]);

  // Update active line annotation
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const annotations = chart.options.plugins?.annotation?.annotations as any;

    if (!annotations) return;

    // Remove old active line
    delete annotations.activeTimeLine;

    // Add active line if user is interacting
    if (activeIndexInChart !== null && activeIndexInChart >= 0 && activeIndexInChart < priceData.length) {
      annotations.activeTimeLine = {
        type: 'line',
        xMin: activeIndexInChart,
        xMax: activeIndexInChart,
        yMin: 0,
        yMax: 'max',
        borderColor: `rgba(0, 0, 0, ${activeLineOpacity})`,
        borderWidth: 2,
        borderDash: [0],
        drawTime: 'afterDatasetsDraw',
      };
    }

    // Update current time line style
    if (annotations.currentTime) {
      annotations.currentTime.borderDash = activeIndexInChart !== null ? [5, 5] : [0];
    }

    chart.update('none');
  }, [activeIndexInChart, activeLineOpacity, priceData.length]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationFrameRef]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      style={{ touchAction: 'none' }}
    />
  );
}

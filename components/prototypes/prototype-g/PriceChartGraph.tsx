'use client';

import React, { useEffect, useRef } from 'react';
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
import { PriceInterval } from '@/lib/electricity-api';
import { PriceSlot } from '@/lib/appliance-service';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  const crosshairPlugin = {
    id: 'crosshair',
    afterDraw: (chart: ChartJS) => {
      if (chart.tooltip?.getActiveElements()?.length) {
        const ctx = chart.ctx;
        const activePoint = chart.tooltip.getActiveElements()[0];
        const x = activePoint.element.x;
        const y = activePoint.element.y;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.restore();
      }
    }
  };

  useEffect(() => {
    if (!canvasRef.current || priceData.length === 0) return;

    const prices = priceData.map(item => Math.round(item.SEK_per_kWh * 100));
    const labels = priceData.map(item => {
      const time = new Date(item.time_start);
      const h = String(time.getHours()).padStart(2, '0');
      const m = String(time.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    });

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    const now = new Date();
    const currentIndex = selectedDay === 'today'
      ? priceData.findIndex(item => {
          const start = new Date(item.time_start);
          const end = new Date(item.time_end);
          return now >= start && now < end;
        })
      : -1;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minIndex = prices.indexOf(minPrice);
    const maxIndex = prices.indexOf(maxPrice);

    const transitions: Array<{ index: number; type: 'expensive' | 'cheap'; time: string }> = [];
    for (let i = 1; i < prices.length; i++) {
      const prevPrice = prices[i - 1];
      const currPrice = prices[i];
      const prevCategory = prevPrice < avgPrice * 0.85 ? 'green' : prevPrice >= avgPrice * 1.15 ? 'red' : 'yellow';
      const currCategory = currPrice < avgPrice * 0.85 ? 'green' : currPrice >= avgPrice * 1.15 ? 'red' : 'yellow';

      if ((prevCategory === 'green' || prevCategory === 'yellow') && currCategory === 'red') {
        transitions.push({ index: i, type: 'expensive', time: labels[i] });
      }
      if ((prevCategory === 'red' || prevCategory === 'yellow') && currCategory === 'green') {
        transitions.push({ index: i, type: 'cheap', time: labels[i] });
      }
    }

    const minSpacing = 8;
    const filteredTransitions: typeof transitions = [];
    let lastIndex = -minSpacing;

    for (const transition of transitions) {
      if (transition.index - lastIndex >= minSpacing) {
        filteredTransitions.push(transition);
        lastIndex = transition.index;
      }
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(215, 51, 51, 0.1)');
    gradient.addColorStop(0.45, 'rgba(255, 193, 7, 0.1)');
    gradient.addColorStop(0.8, 'rgba(0, 154, 51, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 154, 51, 0.05)');

    const annotations: any = {
      minPrice: {
        type: 'point',
        xValue: minIndex,
        yValue: minPrice,
        backgroundColor: '#009A33',
        radius: 6,
        borderWidth: 0
      },
      maxPrice: {
        type: 'point',
        xValue: maxIndex,
        yValue: maxPrice,
        backgroundColor: '#D73333',
        radius: 6,
        borderWidth: 0
      }
    };

    if (currentIndex >= 0) {
      annotations.currentTime = {
        type: 'line',
        xMin: currentIndex,
        xMax: currentIndex,
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

    filteredTransitions.forEach((transition, idx) => {
      annotations[`transition_${idx}`] = {
        type: 'label',
        xValue: transition.index,
        yValue: prices[transition.index],
        backgroundColor: transition.type === 'expensive' ? '#D73333' : '#009A33',
        color: '#FFFFFF',
        content: transition.time,
        font: { size: 10 },
        padding: { top: 2, bottom: 2, left: 4, right: 4 },
        borderRadius: 4,
        position: 'start'
      };
    });

    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'line',
      plugins: [crosshairPlugin],
      data: {
        labels: labels,
        datasets: [{
          label: 'Pris (öre/kWh)',
          data: prices,
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
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            padding: 16,
            titleFont: { size: 16 },
            bodyFont: { size: 18 },
            cornerRadius: 8,
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
            display: true,
            beginAtZero: false,
            min: Math.floor(minPrice * 0.95),
            max: Math.ceil(maxPrice * 1.05),
            ticks: {
              font: { size: 11 },
              color: '#000000',
              padding: 0,
              maxTicksLimit: 7
            },
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

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [priceData, selectedDay]);

  if (priceData.length === 0) {
    return (
      <div className="px-4 py-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Priser för imorgon är inte tillgängliga än</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-2 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="relative h-[250px] sm:h-[240px] md:h-[280px]">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}


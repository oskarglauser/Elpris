'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  fetchTodayAndTomorrowPrices,
  PriceInterval,
  calculatePriceStats,
  getCurrentPriceInterval
} from '@/lib/electricity-api';

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

  // Calculate rolling 12-hour window for display
  const now = new Date();
  const currentIndex = prices.findIndex(p => {
    const start = new Date(p.time_start);
    const end = new Date(p.time_end);
    return now >= start && now < end;
  });

  let displayPrices: PriceInterval[];
  if (currentIndex === -1) {
    displayPrices = prices.slice(0, 48);
  } else {
    const startIndex = Math.max(0, currentIndex - 4);
    const endIndex = Math.min(prices.length, currentIndex + 44);
    displayPrices = prices.slice(startIndex, endIndex);

    if (displayPrices.length < 48 && startIndex > 0) {
      const additionalStart = Math.max(0, startIndex - (48 - displayPrices.length));
      displayPrices = prices.slice(additionalStart, endIndex);
    }
  }
  displayPrices = displayPrices.slice(0, 48);

  // Calculate stats from visible window only
  const windowStats = calculatePriceStats(displayPrices);

  return (
    <Card className="p-4 bg-card border-border">
      <Link href={`/prototype-${prototypeId}/detail`}>
        <div className="mb-0 cursor-pointer">
          <div className="flex items-center justify-between mb-0">
            <h2 className="text-lg font-normal">Dagens elpris</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Inklusive moms, exklusive avgifter</p>
        </div>
      </Link>

      <div className="relative h-78">
        <PriceClockChart prices={prices} displayPrices={displayPrices} average={windowStats.average} />
      </div>
    </Card>
  );
}

function PriceClockChart({ prices, displayPrices, average }: { prices: PriceInterval[]; displayPrices: PriceInterval[]; average: number }) {
  const now = new Date();
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [isTouching, setIsTouching] = useState(false);
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Find current index for the hand indicator
  const currentIndex = prices.findIndex(p => {
    const start = new Date(p.time_start);
    const end = new Date(p.time_end);
    return now >= start && now < end;
  });

  const size = 360;
  const center = size / 2;
  const outerRadius = size * 0.43;
  const innerRadius = size * 0.16;

  const getColor = (price: number) => {
    const threshold = 0.15;
    if (price < average * (1 - threshold)) return '#009A33';
    if (price > average * (1 + threshold)) return '#D73333';
    return '#FFC107';
  };

  // Handle touch movement to update hovered segment
  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || !isTouching) return;

    e.preventDefault();
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();

    // Convert touch coordinates to SVG coordinates
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touchX = touch.clientX - centerX;
    const touchY = touch.clientY - centerY;

    // Calculate angle from center (0° at top, clockwise)
    let angle = Math.atan2(touchY, touchX) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // Normalize to 0-360, with 0° at top

    // Find which segment this angle corresponds to
    for (let i = 0; i < displayPrices.length; i++) {
      const startTime = new Date(displayPrices[i].time_start);
      const endTime = new Date(displayPrices[i].time_end);
      const startAngle = timeToAngle(startTime);
      const endAngle = timeToAngle(endTime);

      // Handle wrap-around (e.g., 11:45 to 00:00)
      if (startAngle <= endAngle) {
        if (angle >= startAngle && angle < endAngle) {
          setHoveredSegment(i);
          return;
        }
      } else {
        if (angle >= startAngle || angle < endAngle) {
          setHoveredSegment(i);
          return;
        }
      }
    }
  };

  // Convert time to clock angle (12 at top = 0°, 3 at right = 90°, etc.)
  const timeToAngle = (date: Date) => {
    const hours = date.getHours() % 12; // Convert to 12-hour format
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    // Each minute = 0.5 degrees (360° / 720 minutes in 12 hours)
    return (totalMinutes * 0.5);
  };

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  };

  const createArcPath = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const start = polarToCartesian(startAngle, outerR);
    const end = polarToCartesian(endAngle, outerR);
    const innerStart = polarToCartesian(endAngle, innerR);
    const innerEnd = polarToCartesian(startAngle, innerR);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${start.x} ${start.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z'
    ].join(' ');
  };

  // Group prices by hour for labeling
  const hourlyPrices = new Map<number, { price: number; startAngle: number; midAngle: number }>();

  displayPrices.forEach((priceInterval) => {
    const startTime = new Date(priceInterval.time_start);
    const hour = startTime.getHours() % 12;
    const startAngle = timeToAngle(startTime);

    if (!hourlyPrices.has(hour)) {
      hourlyPrices.set(hour, {
        price: priceInterval.SEK_per_kWh,
        startAngle,
        midAngle: startAngle + 15 // Middle of the hour segment
      });
    }
  });

  // Find current price
  const currentPriceInterval = displayPrices.find(p => {
    const start = new Date(p.time_start);
    const end = new Date(p.time_end);
    return now >= start && now < end;
  });
  const currentPriceDisplay = currentPriceInterval
    ? (currentPriceInterval.SEK_per_kWh * 100).toFixed(1)
    : '--';

  // Get hovered segment data
  const hoveredData = hoveredSegment !== null ? displayPrices[hoveredSegment] : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        onTouchStart={(e) => {
          setIsTouching(true);
          handleTouchMove(e);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
          setIsTouching(false);
          setHoveredSegment(null);
        }}
        onTouchCancel={() => {
          setIsTouching(false);
          setHoveredSegment(null);
        }}
        style={{ touchAction: 'none' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#000" />
          </marker>
        </defs>

        {/* Clock segments */}
        {displayPrices.map((priceInterval, index) => {
          const startTime = new Date(priceInterval.time_start);
          const endTime = new Date(priceInterval.time_end);

          const startAngle = timeToAngle(startTime);
          const endAngle = timeToAngle(endTime);
          const color = getColor(priceInterval.SEK_per_kWh);

          // Check if this is the current time segment
          const isCurrent = now >= startTime && now < endTime;

          // Check if this segment has already passed
          const isPast = endTime < now;

          // Use grey for past segments, normal color for current/future
          const segmentColor = isPast ? '#CDC8C2' : color;
          const segmentOpacity = isPast ? 0.6 : 1;

          return (
            <path
              key={index}
              d={createArcPath(startAngle, endAngle, outerRadius, innerRadius)}
              fill={hoveredSegment === index ? '#000000' : segmentColor}
              opacity={hoveredSegment === index ? 1 : segmentOpacity}
              stroke="none"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => !isTouching && setHoveredSegment(index)}
              onMouseLeave={() => !isTouching && setHoveredSegment(null)}
            />
          );
        })}

        {/* Clock face numbers in 24-hour format */}
        {(() => {
          // Map 12-hour positions (0-11) to actual 24-hour times in the data
          const hourLabels = new Map<number, number>();

          displayPrices.forEach((priceInterval) => {
            const startTime = new Date(priceInterval.time_start);
            const actualHour = startTime.getHours(); // 0-23
            const position = actualHour % 12; // 0-11

            if (!hourLabels.has(position)) {
              hourLabels.set(position, actualHour);
            }
          });

          // Create labels for all 12 positions
          return Array.from({ length: 12 }, (_, position) => {
            const hour = hourLabels.get(position) ?? position;
            const angle = position * 30; // 30° per position
            const tickStart = polarToCartesian(angle, outerRadius);
            const tickEnd = polarToCartesian(angle, outerRadius + 10);
            const labelPos = polarToCartesian(angle, outerRadius + 18);

            return (
              <g key={position}>
                {/* Hour tick */}
                <line
                  x1={tickStart.x}
                  y1={tickStart.y}
                  x2={tickEnd.x}
                  y2={tickEnd.y}
                  stroke="#333"
                  strokeWidth="2"
                />
                {/* Hour label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-base font-normal fill-foreground"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {hour}
                </text>
              </g>
            );
          });
        })()}

        {/* 15-minute tick marks */}
        {displayPrices.map((priceInterval, index) => {
          const startTime = new Date(priceInterval.time_start);
          const minutes = startTime.getMinutes();

          // Skip hour markers (at 0 minutes)
          if (minutes === 0) return null;

          const angle = timeToAngle(startTime);
          const tickStart = polarToCartesian(angle, outerRadius);
          const tickEnd = polarToCartesian(angle, outerRadius + 5);

          return (
            <line
              key={`tick-${index}`}
              x1={tickStart.x}
              y1={tickStart.y}
              x2={tickEnd.x}
              y2={tickEnd.y}
              stroke="#666"
              strokeWidth="1"
            />
          );
        })}

        {/* Dotted line marking start of pricing data */}
        {displayPrices.length > 0 && (
          <line
            x1={center}
            y1={center}
            x2={polarToCartesian(timeToAngle(new Date(displayPrices[0].time_start)), outerRadius).x}
            y2={polarToCartesian(timeToAngle(new Date(displayPrices[0].time_start)), outerRadius).y}
            stroke="#000"
            strokeWidth="2"
            strokeDasharray="2 2"
            opacity="1"
          />
        )}

        {/* Current time indicator hand */}
        {currentIndex !== -1 && (
          <line
            x1={center}
            y1={center}
            x2={polarToCartesian(timeToAngle(now), outerRadius).x}
            y2={polarToCartesian(timeToAngle(now), outerRadius).y}
            stroke="#000"
            strokeWidth="3"
            opacity="0.8"
            markerEnd="url(#arrowhead)"
          />
        )}

        {/* Center circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius + 15}
          fill="#ffffff"
          stroke="#333"
          strokeWidth="0"
        />

        {/* Center text - dynamic based on hover */}
        <text
          x={center}
          y={center - 28}
          textAnchor="middle"
          className="text-[16px] font-normal fill-muted-foreground"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {hoveredData
            ? `${new Date(hoveredData.time_start).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}-${new Date(hoveredData.time_end).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}`
            : 'Just nu'}
        </text>
        <text
          x={center}
          y={center + 6}
          textAnchor="middle"
          className="text-4xl font-normal fill-foreground"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {hoveredData
            ? (hoveredData.SEK_per_kWh * 100).toFixed(1)
            : currentPriceDisplay}
        </text>
        <text
          x={center}
          y={center + 28}
          textAnchor="middle"
          className="text-[16px] font-normal fill-muted-foreground"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          öre/kWh
        </text>
      </svg>
    </div>
  );
}


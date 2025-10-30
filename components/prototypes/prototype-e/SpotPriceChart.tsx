'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import {
  fetchTodayAndTomorrowPrices,
  PriceInterval,
  calculatePriceStats,
  getCurrentPriceInterval,
  formatTimeRange
} from '@/lib/electricity-api';
import { QuickTimeline } from './QuickTimeline';

interface RecommendationData {
  status: 'good' | 'ok' | 'bad';
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

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
  const currentPriceValue = currentPrice?.SEK_per_kWh || 0;

  const getRecommendation = (): RecommendationData => {
    const threshold = 0.15;
    const priceDiff = ((currentPriceValue - stats.average) / stats.average) * 100;

    if (currentPriceValue < stats.average * (1 - threshold)) {
      return {
        status: 'good',
        title: 'BRA TID ATT ANVÄNDA EL',
        subtitle: `${Math.abs(priceDiff).toFixed(0)}% under snittet`,
        color: '#009A33',
        bgColor: 'rgba(0, 154, 51, 0.1)',
        icon: <CheckCircle className="w-6 h-6" />
      };
    } else if (currentPriceValue > stats.average * (1 + threshold)) {
      return {
        status: 'bad',
        title: 'VÄNTA OM MÖJLIGT',
        subtitle: `${Math.abs(priceDiff).toFixed(0)}% över snittet`,
        color: '#D73333',
        bgColor: 'rgba(215, 51, 51, 0.1)',
        icon: <XCircle className="w-6 h-6" />
      };
    } else {
      return {
        status: 'ok',
        title: 'OK TID',
        subtitle: `Nära snittet (${(stats.average * 100).toFixed(1)} öre)`,
        color: '#FFC107',
        bgColor: 'rgba(255, 193, 7, 0.1)',
        icon: <AlertCircle className="w-6 h-6" />
      };
    }
  };

  const recommendation = getRecommendation();

  const minPriceInterval = prices.reduce((min, p) => p.SEK_per_kWh < min.SEK_per_kWh ? p : min, prices[0]);

  const now = new Date();
  const currentIndex = prices.findIndex(p => {
    const start = new Date(p.time_start);
    const end = new Date(p.time_end);
    return now >= start && now < end;
  });

  const findNextGoodPeriod = () => {
    const threshold = stats.average * 0.85;
    let goodPeriodStart: PriceInterval | null = null;
    let goodPeriodEnd: PriceInterval | null = null;

    for (let i = currentIndex + 1; i < Math.min(currentIndex + 48, prices.length); i++) {
      if (prices[i].SEK_per_kWh <= threshold) {
        if (!goodPeriodStart) {
          goodPeriodStart = prices[i];
        }
        goodPeriodEnd = prices[i];
      } else if (goodPeriodStart && goodPeriodEnd) {
        break;
      }
    }

    if (goodPeriodStart && goodPeriodEnd) {
      const avgPrice = prices
        .slice(prices.indexOf(goodPeriodStart), prices.indexOf(goodPeriodEnd) + 1)
        .reduce((sum, p) => sum + p.SEK_per_kWh, 0) /
        (prices.indexOf(goodPeriodEnd) - prices.indexOf(goodPeriodStart) + 1);

      return {
        start: goodPeriodStart.time_start,
        end: goodPeriodEnd.time_end,
        avgPrice
      };
    }
    return null;
  };

  const nextGoodPeriod = findNextGoodPeriod();

  return (
    <Card className="p-3 bg-card border-border">
      <Link href={`/prototype-${prototypeId}/detail`}>
        <div className="mb-1 cursor-pointer">
          {currentPrice && (
            <div className="flex items-center justify-between -mb-4">
              <h2 className="text-lg font-normal">Spotpris</h2>
              <div className="flex items-center gap-2">
                <div className="text-lg font-normal">
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="overflow-x-auto -mb-3">
        <table className="w-full">
          <tbody>
            <tr
              className="border-b border-border"
              style={{ backgroundColor: recommendation.bgColor }}
            >
              <td className="pl-2 py-2 pr-2 text-muted-foreground">
                Just nu
              </td>
              <td
                className="py-2 px-2 font-medium"
                style={
                  recommendation.status === 'ok'
                    ? { color: '#000000', padding: '8px' }
                    : { color: recommendation.color }
                }
              >
                {recommendation.title}
              </td>
              <td
                className="py-2 pl-2 pr-2 text-right font-medium"
                style={
                  recommendation.status === 'ok'
                    ? { color: '#000000' }
                    : { color: recommendation.color }
                }
              >
                {currentPrice ? `${(currentPrice.SEK_per_kWh * 100).toFixed(1)} öre` : '-'}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pl-2 pr-2 text-muted-foreground">
                {formatTimeRange(minPriceInterval.time_start, minPriceInterval.time_end).replace('Idag, ', '')}
              </td>
              <td className="py-2 px-2 text-muted-foreground">
                Billigast tid
              </td>
              <td className="py-2 pr-2 text-right font-medium" style={{ color: '#009A33' }}>
                {(minPriceInterval.SEK_per_kWh * 100).toFixed(1)} öre
              </td>
            </tr>
            {nextGoodPeriod && (
              <tr>
                <td className="py-2 pl-2 pr-2 text-muted-foreground">
                  {formatTimeRange(nextGoodPeriod.start, nextGoodPeriod.end).replace('Idag, ', '')}
                </td>
                <td className="py-2 px-2 text-muted-foreground">
                  Näst bästa tid
                </td>
                <td className="py-2 pr-2 text-right font-medium" style={{ color: '#009A33' }}>
                  {(nextGoodPeriod.avgPrice * 100).toFixed(1)} öre
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-2">Kommande 12 timmar</div>
        <QuickTimeline
          prices={prices}
          average={stats.average}
          currentIndex={currentIndex}
        />
      </div>


    </Card>
  );
}

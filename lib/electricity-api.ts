// Type definitions for 15-minute electricity price data
export interface PriceInterval {
  time_start: string; // ISO 8601 DateTime with timezone
  time_end: string; // ISO 8601 DateTime with timezone
  SEK_per_kWh: number; // Electricity spot price in SEK per kWh
}

export interface ElectricityPriceResponse {
  data: PriceInterval[];
}

export type Region = 'SE1' | 'SE2' | 'SE3' | 'SE4';

/**
 * Fetch electricity prices for a specific date and region
 * @param year - Four-digit year (YYYY)
 * @param month - Two-digit month (MM)
 * @param day - Two-digit day (DD)
 * @param region - Swedish electricity price region (SE1-SE4)
 * @returns Array of 96 price intervals (24 hours × 4 intervals per hour)
 */
export async function fetchElectricityPrices(
  year: string,
  month: string,
  day: string,
  region: Region = 'SE3'
): Promise<PriceInterval[]> {
  const url = `https://www.elprisetjustnu.se/api/v1/prices/${year}/${month}-${day}_${region}.json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Data ej tillgänglig för ${year}-${month}-${day}. Morgondagens priser publiceras tidigast kl 13:00.`);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: PriceInterval[] = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Tom eller ogiltig data från API');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Nätverksfel: Kunde inte hämta elpriser');
  }
}

/**
 * Get current date formatted for API
 */
export function getCurrentDate(): { year: string; month: string; day: string } {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  
  return { year, month, day };
}

/**
 * Fetch today's electricity prices
 */
export async function fetchTodaysPrices(region: Region = 'SE3'): Promise<PriceInterval[]> {
  const { year, month, day } = getCurrentDate();
  return fetchElectricityPrices(year, month, day, region);
}

/**
 * Get tomorrow's date formatted for API
 */
export function getTomorrowDate(): { year: string; month: string; day: string } {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const year = tomorrow.getFullYear().toString();
  const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
  const day = tomorrow.getDate().toString().padStart(2, '0');
  
  return { year, month, day };
}

/**
 * Fetch tomorrow's electricity prices
 */
export async function fetchTomorrowsPrices(region: Region = 'SE3'): Promise<PriceInterval[]> {
  const { year, month, day } = getTomorrowDate();
  return fetchElectricityPrices(year, month, day, region);
}

/**
 * Fetch both today's and tomorrow's prices
 */
export async function fetchTodayAndTomorrowPrices(region: Region = 'SE3'): Promise<{
  today: PriceInterval[];
  tomorrow: PriceInterval[];
}> {
  try {
    const [today, tomorrow] = await Promise.all([
      fetchTodaysPrices(region),
      fetchTomorrowsPrices(region).catch((err) => {
        console.info('Morgondagens priser är inte tillgängliga än:', err.message);
        return [];
      }),
    ]);

    if (today.length === 0) {
      throw new Error('Inga elpriser tillgängliga för idag');
    }

    return { today, tomorrow };
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

/**
 * Get the current price interval based on current time
 */
export function getCurrentPriceInterval(prices: PriceInterval[]): PriceInterval | null {
  const now = new Date();
  
  for (const interval of prices) {
    const start = new Date(interval.time_start);
    const end = new Date(interval.time_end);
    
    if (now >= start && now < end) {
      return interval;
    }
  }
  
  return null;
}

/**
 * Calculate price statistics
 */
export function calculatePriceStats(prices: PriceInterval[]) {
  if (prices.length === 0) {
    return { min: 0, max: 0, average: 0 };
  }
  
  const priceValues = prices.map(p => p.SEK_per_kWh);
  const min = Math.min(...priceValues);
  const max = Math.max(...priceValues);
  const average = priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length;
  
  return { min, max, average };
}

/**
 * Get price level (low, medium, high) based on comparison to average
 */
export function getPriceLevel(price: number, average: number): 'low' | 'medium' | 'high' {
  const threshold = average * 0.2; // 20% threshold
  
  if (price < average - threshold) return 'low';
  if (price > average + threshold) return 'high';
  return 'medium';
}

/**
 * Format time for display (e.g., "Idag, 12:00-13:00")
 */
export function formatTimeRange(start: string, end: string): string {
  const startTime = new Date(start).toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(end).toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return `Idag, ${startTime}-${endTime}`;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(1)} öre/kWh`;
}


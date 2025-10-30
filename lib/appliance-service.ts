import { PriceInterval } from './electricity-api';

export interface Appliance {
  id: number;
  name: string;
  icon: string;
  kWh: number;
  hours: number;
  timeWindow: { start: number; end: number };
  enabled: boolean;
}

export interface PriceSlot {
  price: number;
  hour: number;
  minute: number;
  time: Date;
}

export interface SavingsData {
  bestSlots: PriceSlot[];
  bestAvg: number;
  savingsKr: number;
  savingsOre: number;
  savingsDisplay: string;
}

export const iconOptions = [
  'Car', 'WashingMachine', 'Wind', 'Utensils', 'Flame', 'SprayCan',
  'CookingPot', 'ShowerHead', 'Bath', 'Zap', 'Lightbulb', 'Refrigerator',
  'Tv', 'Laptop', 'Smartphone', 'Drill', 'Microwave', 'Coffee',
  'Fan', 'Speaker', 'Heater', 'Snowflake', 'Droplet', 'Waves',
  'Plug', 'BatteryCharging', 'Power', 'Gauge', 'Archive', 'Thermometer'
];

export const presets: Appliance[] = [
  { id: 1, name: 'Elbil', icon: 'Car', kWh: 40, hours: 4, timeWindow: { start: 0, end: 24 }, enabled: true },
  { id: 2, name: 'Tvättmaskin', icon: 'WashingMachine', kWh: 1, hours: 1, timeWindow: { start: 6, end: 23 }, enabled: true },
  { id: 3, name: 'Torktumlare', icon: 'Wind', kWh: 3, hours: 1.5, timeWindow: { start: 6, end: 23 }, enabled: false },
  { id: 4, name: 'Torkskåp', icon: 'Archive', kWh: 2.5, hours: 3, timeWindow: { start: 6, end: 23 }, enabled: false },
  { id: 5, name: 'Diskmaskin', icon: 'Utensils', kWh: 1.5, hours: 2, timeWindow: { start: 6, end: 24 }, enabled: false },
  { id: 6, name: 'Värmepump', icon: 'Thermometer', kWh: 3, hours: 8, timeWindow: { start: 0, end: 24 }, enabled: false },
  { id: 7, name: 'Luftkonditionering', icon: 'Snowflake', kWh: 2, hours: 6, timeWindow: { start: 0, end: 24 }, enabled: false },
  { id: 8, name: 'Poolpump', icon: 'Waves', kWh: 1.5, hours: 6, timeWindow: { start: 0, end: 24 }, enabled: false },
  { id: 9, name: 'Elpatron', icon: 'Heater', kWh: 5, hours: 3, timeWindow: { start: 0, end: 24 }, enabled: false },
  { id: 10, name: 'Spis och ugn', icon: 'CookingPot', kWh: 3, hours: 1, timeWindow: { start: 6, end: 23 }, enabled: false },
  { id: 11, name: 'Computer', icon: 'Laptop', kWh: 0.3, hours: 8, timeWindow: { start: 6, end: 23 }, enabled: false },
  { id: 12, name: 'Eldriven golvvärme badrum', icon: 'Flame', kWh: 2, hours: 4, timeWindow: { start: 5, end: 23 }, enabled: false },
  { id: 13, name: 'Dammsugare', icon: 'SprayCan', kWh: 1.5, hours: 0.5, timeWindow: { start: 7, end: 22 }, enabled: false },
  { id: 14, name: 'Bastu', icon: 'Flame', kWh: 8, hours: 2, timeWindow: { start: 15, end: 23 }, enabled: false }
];

const STORAGE_KEY = 'greenely_appliances';

export class ApplianceService {
  private appliances: Appliance[];

  constructor() {
    this.appliances = this.loadAppliances();
  }

  private loadAppliances(): Appliance[] {
    if (typeof window === 'undefined') return [...presets];

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load appliances:', error);
    }
    return [...presets];
  }

  private saveAppliances(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.appliances));
    } catch (error) {
      console.error('Failed to save appliances:', error);
    }
  }

  getAppliances(): Appliance[] {
    return this.appliances;
  }

  getEnabledAppliances(): Appliance[] {
    return this.appliances.filter(a => a.enabled);
  }

  toggleAppliance(id: number): void {
    const app = this.appliances.find(a => a.id === id);
    if (app) {
      app.enabled = !app.enabled;
      this.saveAppliances();
    }
  }

  updateApplianceField(id: number, field: keyof Appliance, value: any): void {
    const app = this.appliances.find(a => a.id === id);
    if (app && field !== 'id') {
      (app as any)[field] = value;
      this.saveAppliances();
    }
  }

  updateTimeWindow(id: number, field: 'start' | 'end', value: number): void {
    const app = this.appliances.find(a => a.id === id);
    if (app) {
      app.timeWindow[field] = value;
      this.saveAppliances();
    }
  }

  convertPriceIntervalsToPriceSlots(intervals: PriceInterval[]): PriceSlot[] {
    return intervals.map(item => {
      const time = new Date(item.time_start);
      return {
        price: Math.round(item.SEK_per_kWh * 100),
        hour: time.getHours(),
        minute: time.getMinutes(),
        time: time
      };
    });
  }

  findBestTimeSlots(
    durationSlots: number = 1,
    timeWindow: { start: number; end: number } = { start: 0, end: 24 },
    priceData: PriceSlot[] = []
  ): PriceSlot[] {
    const filteredData = priceData.filter(slot => {
      const hour = slot.hour;
      if (timeWindow.start < timeWindow.end) {
        return hour >= timeWindow.start && hour < timeWindow.end;
      } else {
        return hour >= timeWindow.start || hour < timeWindow.end;
      }
    });

    if (filteredData.length === 0) return [];

    if (durationSlots === 1) {
      return [[...filteredData].sort((a, b) => a.price - b.price)[0]];
    }

    let bestSlots: PriceSlot[] = [];
    let lowestAvg = Infinity;

    for (let i = 0; i <= filteredData.length - durationSlots; i++) {
      const slots = filteredData.slice(i, i + durationSlots);
      const avg = slots.reduce((sum, slot) => sum + slot.price, 0) / durationSlots;

      if (avg < lowestAvg) {
        lowestAvg = avg;
        bestSlots = slots;
      }
    }

    return bestSlots;
  }

  calculateSavings(
    appliance: Appliance,
    dailyAvgPrice: number,
    priceData: PriceSlot[]
  ): SavingsData | null {
    const slots = Math.ceil((appliance.hours * 60) / 15);
    const timeWindow = appliance.timeWindow || { start: 0, end: 24 };
    const bestSlots = this.findBestTimeSlots(slots, timeWindow, priceData);

    if (bestSlots.length === 0) return null;

    const bestAvg = bestSlots.reduce((sum, slot) => sum + slot.price, 0) / bestSlots.length;
    const savingsKr = ((dailyAvgPrice - bestAvg) * appliance.kWh) / 100;
    const savingsOre = Math.round(savingsKr * 100);

    let savingsDisplay;
    if (Math.abs(savingsKr) >= 1) {
      const sign = savingsKr >= 0 ? '+' : '';
      savingsDisplay = `${sign}${savingsKr.toFixed(0)} kr`;
    } else {
      const sign = savingsOre >= 0 ? '+' : '';
      savingsDisplay = `${sign}${savingsOre} öre`;
    }

    return {
      bestSlots,
      bestAvg,
      savingsKr,
      savingsOre,
      savingsDisplay
    };
  }
}

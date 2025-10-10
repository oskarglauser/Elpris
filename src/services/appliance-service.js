import { presets, emojiToIcon, iconOptions } from '../utils/constants.js';
import { StorageService } from './storage-service.js';

export class ApplianceService {
  constructor() {
    this.appliances = this.initializeAppliances();
  }

  initializeAppliances() {
    const savedDevices = StorageService.getAppliances();
    return presets.map((preset, index) => {
      const saved = savedDevices.find(s => s.name === preset.name);
      return {
        id: index + 1,
        name: preset.name,
        icon: preset.icon,
        kWh: preset.kWh,
        hours: preset.hours,
        timeWindow: preset.timeWindow,
        enabled: saved ? saved.enabled : (preset.name === 'Elbil' || preset.name === 'Tvättmaskin')
      };
    });
  }

  migrateAppliances(apps) {
    return apps.map(app => {
      if (emojiToIcon[app.icon]) {
        return { ...app, icon: emojiToIcon[app.icon] };
      }
      if (!iconOptions.includes(app.icon)) {
        return { ...app, icon: 'zap' };
      }
      return app;
    });
  }

  getAppliances() {
    return this.appliances;
  }

  getEnabledAppliances() {
    return this.appliances.filter(a => a.enabled);
  }

  toggleAppliance(id) {
    const app = this.appliances.find(a => a.id === id);
    if (app) {
      app.enabled = !app.enabled;
      this.saveAppliances();
    }
  }

  updateApplianceField(id, field, value) {
    const app = this.appliances.find(a => a.id === id);
    if (app) {
      app[field] = value;
      this.saveAppliances();
    }
  }

  updateTimeWindow(id, field, value) {
    const app = this.appliances.find(a => a.id === id);
    if (app) {
      app.timeWindow[field] = value;
      this.saveAppliances();
    }
  }

  saveAppliances() {
    StorageService.saveAppliances(this.appliances);
  }

  findBestTimeSlots(durationSlots = 1, timeWindow = { start: 0, end: 24 }, priceData = []) {
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

    let bestSlots = [];
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

  calculateSavings(appliance, dailyAvgPrice, priceData) {
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

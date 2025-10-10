import { PriceService } from './services/price-service.js';
import { ApplianceService } from './services/appliance-service.js';
import { StorageService } from './services/storage-service.js';
import { createHeader } from './components/header.js';
import { createCurrentPrice } from './components/current-price.js';
import { createPriceChart } from './components/price-chart.js';
import { createDayToggle } from './components/day-toggle.js';
import { createDeviceList } from './components/device-list.js';
import { createSettingsModal } from './components/settings-modal.js';

export function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const priceService = new PriceService();
  const applianceService = new ApplianceService();
  let selectedDay = 'today';
  let selectedRegion = StorageService.getSelectedRegion();

  const header = createHeader(
    selectedRegion,
    async (newRegion) => {
      selectedRegion = newRegion;
      StorageService.saveSelectedRegion(newRegion);
      await priceService.fetchPriceData(newRegion);
      updateAll();
    }
  );

  const currentPrice = createCurrentPrice();

  const priceChart = createPriceChart();

  const dayToggle = createDayToggle(selectedDay, (newDay) => {
    selectedDay = newDay;
    updateChart();
    updateDeviceList();
  });

  const chartSection = document.createElement('div');
  chartSection.appendChild(priceChart.element);
  chartSection.appendChild(dayToggle.element);

  const deviceList = createDeviceList(() => {
    settingsModal.show();
  });

  const settingsModal = createSettingsModal(
    applianceService,
    () => {
      settingsModal.hide();
    },
    () => {
      updateDeviceList();
    }
  );

  app.appendChild(header.element);
  app.appendChild(currentPrice.element);
  app.appendChild(chartSection);
  app.appendChild(deviceList.element);
  app.appendChild(settingsModal.element);

  const updateCurrentPrice = () => {
    const currentData = priceService.getCurrentPrice();
    const avgPrice = priceService.getAveragePrice();
    currentPrice.update(currentData, avgPrice);
  };

  const updateChart = () => {
    const filteredData = priceService.getFilteredPriceData(selectedDay);
    priceChart.update(filteredData, selectedDay);
  };

  const updateDeviceList = () => {
    const enabledAppliances = applianceService.getEnabledAppliances();
    const filteredPriceData = priceService.getFilteredPriceData(selectedDay);
    deviceList.update(enabledAppliances, filteredPriceData, applianceService);
  };

  const updateAll = () => {
    updateCurrentPrice();
    updateChart();
    updateDeviceList();
  };

  (async () => {
    await priceService.fetchPriceData(selectedRegion);
    updateAll();
    setInterval(updateCurrentPrice, 60000);
  })();
}

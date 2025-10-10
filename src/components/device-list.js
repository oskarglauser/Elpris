import { createIcons, icons } from 'lucide';
import { createDeviceRow } from './device-row.js';
import { createYearlySavingsTop, createYearlySavingsBottom } from './yearly-savings.js';

export function createDeviceList(onSettingsClick) {
  const container = document.createElement('div');
  container.className = 'px-4 py-2 pb-8';

  const innerContainer = document.createElement('div');
  innerContainer.className = 'max-w-4xl mx-auto';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-3';

  const title = document.createElement('h2');
  title.className = 'text-h2';
  title.textContent = 'Dina enheter';

  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'p-2 hover:bg-[#F2EFEC] rounded transition-colors';
  const settingsIcon = document.createElement('i');
  settingsIcon.setAttribute('data-lucide', 'settings');
  settingsIcon.className = 'w-6 h-6 text-[#000000]';
  settingsBtn.appendChild(settingsIcon);
  settingsBtn.addEventListener('click', onSettingsClick);

  header.appendChild(title);
  header.appendChild(settingsBtn);

  const yearlySavingsDiv = document.createElement('div');
  yearlySavingsDiv.id = 'yearlySavings';
  yearlySavingsDiv.className = 'mb-3';

  const recommendationsDiv = document.createElement('div');
  recommendationsDiv.id = 'recommendations';
  recommendationsDiv.className = 'bg-white rounded';
  recommendationsDiv.innerHTML = `
    <div class="flex items-center gap-3 p-4 bg-white rounded">
      <i data-lucide="loader" class="w-5 h-5"></i>
      <div>Laddar...</div>
    </div>
  `;

  innerContainer.appendChild(header);
  innerContainer.appendChild(yearlySavingsDiv);
  innerContainer.appendChild(recommendationsDiv);
  container.appendChild(innerContainer);

  setTimeout(() => createIcons({ icons }), 0);

  const update = (enabledAppliances, priceData, applianceService) => {
    if (enabledAppliances.length === 0) {
      yearlySavingsDiv.innerHTML = '';
      recommendationsDiv.innerHTML = `
        <div class="p-8 text-center bg-white rounded">
          <p class="text-el-gray-dark">Lägg till apparater för att se bästa tiderna</p>
        </div>
      `;
      return;
    }

    if (priceData.length === 0) {
      yearlySavingsDiv.innerHTML = '';
      recommendationsDiv.innerHTML = '';

      const headerRow = document.createElement('div');
      headerRow.className = 'px-4 py-3 grid grid-cols-3 gap-3 items-center border-b border-[#F2EFEC]';
      headerRow.innerHTML = `
        <div class="text-xs text-[#000000] opacity-60">Enhet</div>
        <div class="text-xs text-[#000000] opacity-60 text-center">Billigast tid</div>
        <div class="text-xs text-[#000000] opacity-60 text-right">Besparing</div>
      `;
      recommendationsDiv.appendChild(headerRow);

      enabledAppliances.forEach(appliance => {
        const row = document.createElement('div');
        row.className = 'border-b border-[#F2EFEC] last:border-0';
        row.innerHTML = `
          <div class="w-full px-4 py-2 grid grid-cols-3 gap-3 items-center opacity-50">
            <div class="text-caption text-[#000000]">${appliance.name}</div>
            <div class="text-xs text-[#000000] opacity-60 text-center">—</div>
            <div class="text-caption text-[#000000] text-right">—</div>
          </div>
        `;
        recommendationsDiv.appendChild(row);
      });

      const messageDiv = document.createElement('div');
      messageDiv.className = 'px-4 py-4 text-center';
      messageDiv.innerHTML = '<div class="text-xs text-[#000000] opacity-60">Priser för imorgon är inte tillgängliga än</div>';
      recommendationsDiv.appendChild(messageDiv);

      createIcons({ icons });
      return;
    }

    let totalSavings = 0;
    const savingsDataMap = new Map();

    const dailyAvgPrice = priceData.reduce((sum, slot) => sum + slot.price, 0) / priceData.length;

    enabledAppliances.forEach((appliance, idx) => {
      const savingsData = applianceService.calculateSavings(appliance, dailyAvgPrice, priceData);
      if (savingsData) {
        totalSavings += savingsData.savingsKr;
        savingsDataMap.set(idx, savingsData);
      }
    });

    yearlySavingsDiv.innerHTML = '';

    recommendationsDiv.innerHTML = '';

    const headerRow = document.createElement('div');
    headerRow.className = 'px-4 py-3 grid grid-cols-3 gap-3 items-center border-b border-[#F2EFEC]';
    headerRow.innerHTML = `
      <div class="text-xs text-[#000000] opacity-60">Enhet</div>
      <div class="text-xs text-[#000000] opacity-60 text-center">Optimal tid</div>
      <div class="text-xs text-[#000000] opacity-60 text-right">Besparing</div>
    `;
    recommendationsDiv.appendChild(headerRow);

    enabledAppliances.forEach((appliance, idx) => {
      const savingsData = savingsDataMap.get(idx);
      const row = createDeviceRow(appliance, savingsData, idx);
      recommendationsDiv.appendChild(row);
    });

    if (totalSavings > 0) {
      const totalYearly = totalSavings * 365;
      const dailySavings = totalSavings.toFixed(2);
      recommendationsDiv.appendChild(createYearlySavingsBottom(totalYearly, dailySavings));
    }

    createIcons({ icons });
  };

  return {
    element: container,
    update
  };
}

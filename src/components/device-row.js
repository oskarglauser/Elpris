import { createIcons, icons } from 'lucide';
import { formatTime } from '../utils/time-utils.js';

export function createDeviceRow(appliance, savingsData, idx) {
  const container = document.createElement('div');
  container.className = 'border-b border-[#F2EFEC] last:border-0';

  const button = document.createElement('button');
  button.className = 'w-full px-4 py-2 grid grid-cols-3 gap-3 items-center hover:bg-[#F2EFEC]/30 transition-colors text-left';

  const nameCell = document.createElement('div');
  nameCell.className = 'flex items-center gap-2 min-w-0';

  const nameText = document.createElement('div');
  nameText.className = 'text-caption text-[#000000] truncate';
  nameText.textContent = appliance.name;

  const chevron = document.createElement('i');
  chevron.setAttribute('data-lucide', 'chevron-down');
  chevron.className = 'w-3 h-3 text-[#000000] opacity-40 shrink-0';

  nameCell.appendChild(nameText);
  nameCell.appendChild(chevron);

  const timeCell = document.createElement('div');
  timeCell.className = 'text-xs text-[#000000] opacity-60 text-center whitespace-nowrap';

  if (savingsData) {
    const bestStart = formatTime(savingsData.bestSlots[0].time);
    const bestEnd = formatTime(new Date(savingsData.bestSlots[savingsData.bestSlots.length - 1].time.getTime() + 15 * 60000));
    timeCell.textContent = `${bestStart}–${bestEnd}`;
  } else {
    timeCell.textContent = '—';
  }

  const savingsCell = document.createElement('div');
  savingsCell.className = 'text-caption text-[#000000] text-right';
  savingsCell.textContent = savingsData ? savingsData.savingsDisplay : '—';

  button.appendChild(nameCell);
  button.appendChild(timeCell);
  button.appendChild(savingsCell);

  const details = document.createElement('div');
  details.className = 'hidden px-4 pb-2 text-xs text-[#000000] space-y-1';
  details.id = `deviceDetails${idx}`;

  if (savingsData) {
    const consumptionRow = document.createElement('div');
    consumptionRow.className = 'flex justify-between';
    const consumptionLabel = document.createElement('span');
    consumptionLabel.className = 'opacity-60';
    consumptionLabel.textContent = 'Förbrukning';
    const consumptionValue = document.createElement('span');
    consumptionValue.textContent = `${appliance.kWh} kWh · ${appliance.hours}h`;
    consumptionRow.appendChild(consumptionLabel);
    consumptionRow.appendChild(consumptionValue);

    const avgPriceRow = document.createElement('div');
    avgPriceRow.className = 'flex justify-between';
    const avgPriceLabel = document.createElement('span');
    avgPriceLabel.className = 'opacity-60';
    avgPriceLabel.textContent = 'Snittpris';
    const avgPriceValue = document.createElement('span');
    avgPriceValue.textContent = `${savingsData.bestAvg.toFixed(1)} öre/kWh`;
    avgPriceRow.appendChild(avgPriceLabel);
    avgPriceRow.appendChild(avgPriceValue);

    details.appendChild(consumptionRow);
    details.appendChild(avgPriceRow);
  }

  button.addEventListener('click', () => {
    details.classList.toggle('hidden');
  });

  container.appendChild(button);
  container.appendChild(details);

  setTimeout(() => createIcons({ icons }), 0);

  return container;
}

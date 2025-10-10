import { createIcons, icons } from 'lucide';

export function createYearlySavingsTop(totalYearly) {
  const container = document.createElement('div');
  container.className = 'flex items-center justify-between';

  const label = document.createElement('div');
  label.className = 'text-caption text-[#000000]';
  label.textContent = 'Årlig besparing';

  const value = document.createElement('div');
  value.className = 'text-h2 text-[#009A33]';
  value.textContent = `${totalYearly.toFixed(0)} kr`;

  container.appendChild(label);
  container.appendChild(value);

  return container;
}

export function createYearlySavingsBottom(totalYearly, dailySavings) {
  const container = document.createElement('div');
  container.className = 'border-t border-[#F2EFEC] mt-2';

  const button = document.createElement('button');
  button.className = 'w-full px-4 pt-3 pb-3 flex items-center justify-between hover:bg-[#F2EFEC]/30 transition-colors';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'text-body text-[#000000]';
  labelDiv.textContent = 'Årlig besparing';

  const rightSide = document.createElement('div');
  rightSide.className = 'flex items-center gap-2 shrink-0';

  const valueDiv = document.createElement('div');
  valueDiv.className = 'text-body text-[#009A33]';
  valueDiv.textContent = `${totalYearly.toFixed(0)} kr`;

  const chevron = document.createElement('i');
  chevron.setAttribute('data-lucide', 'chevron-down');
  chevron.className = 'w-4 h-4 text-[#000000] opacity-40';

  rightSide.appendChild(valueDiv);
  rightSide.appendChild(chevron);

  button.appendChild(labelDiv);
  button.appendChild(rightSide);

  const details = document.createElement('div');
  details.className = 'hidden px-4 pb-3 text-xs text-[#000000] space-y-2';

  const dailyRow = document.createElement('div');
  dailyRow.className = 'flex justify-between';
  const dailyLabel = document.createElement('span');
  dailyLabel.className = 'opacity-60';
  dailyLabel.textContent = 'Daglig besparing';
  const dailyValue = document.createElement('span');
  dailyValue.textContent = `${dailySavings} kr`;
  dailyRow.appendChild(dailyLabel);
  dailyRow.appendChild(dailyValue);

  const explanation = document.createElement('div');
  explanation.className = 'pt-1 border-t border-[#F2EFEC]';

  const explanationTitle = document.createElement('div');
  explanationTitle.className = 'opacity-60 mb-1';
  explanationTitle.textContent = 'Så räknas det ut:';

  const explanationSteps = document.createElement('div');
  explanationSteps.className = 'space-y-0.5';

  const steps = [
    'Jämför snittpris för dagen med bästa tid för varje enhet',
    'Multiplicerar skillnaden med förbrukning (kWh)',
    'Summerar alla enheter = daglig besparing',
    `${dailySavings} kr × 365 dagar = ${totalYearly.toFixed(0)} kr/år`
  ];

  steps.forEach(step => {
    const stepDiv = document.createElement('div');
    stepDiv.textContent = step;
    if (step.includes('×')) {
      stepDiv.className = 'pt-1';
    }
    explanationSteps.appendChild(stepDiv);
  });

  explanation.appendChild(explanationTitle);
  explanation.appendChild(explanationSteps);

  details.appendChild(dailyRow);
  details.appendChild(explanation);

  button.addEventListener('click', () => {
    details.classList.toggle('hidden');
  });

  container.appendChild(button);
  container.appendChild(details);

  setTimeout(() => createIcons({ icons }), 0);

  return container;
}

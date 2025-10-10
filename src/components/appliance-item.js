import { createIcons, icons } from 'lucide';

export function createApplianceItem(app, onToggle, onUpdateField, onUpdateTimeWindow, onToggleSettings) {
  const container = document.createElement('div');
  container.className = 'bg-[#F2EFEC] rounded';
  container.dataset.appId = app.id;

  const mainRow = document.createElement('div');
  mainRow.className = 'flex items-center justify-between p-4';

  const leftSide = document.createElement('div');
  leftSide.className = 'flex items-center gap-3';

  const icon = document.createElement('i');
  icon.setAttribute('data-lucide', app.icon);
  icon.className = 'w-6 h-6';

  const name = document.createElement('div');
  name.className = 'text-body';
  name.textContent = app.name;

  leftSide.appendChild(icon);
  leftSide.appendChild(name);

  const rightSide = document.createElement('div');
  rightSide.className = 'flex items-center gap-2';

  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'p-2 hover:bg-[#CDC8C2] rounded transition-colors';
  const settingsIcon = document.createElement('i');
  settingsIcon.setAttribute('data-lucide', 'settings');
  settingsIcon.className = 'w-5 h-5 text-[#000000]';
  settingsBtn.appendChild(settingsIcon);
  settingsBtn.addEventListener('click', () => onToggleSettings(app.id));

  const toggleBtn = document.createElement('button');
  toggleBtn.className = `relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${app.enabled ? 'bg-[#009A33]' : 'bg-[#CDC8C2]'}`;
  toggleBtn.setAttribute('role', 'switch');
  toggleBtn.setAttribute('aria-checked', app.enabled);

  const toggleIndicator = document.createElement('span');
  toggleIndicator.className = `pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${app.enabled ? 'translate-x-5' : 'translate-x-0'}`;

  toggleBtn.appendChild(toggleIndicator);
  toggleBtn.addEventListener('click', () => onToggle(app.id));

  rightSide.appendChild(settingsBtn);
  rightSide.appendChild(toggleBtn);

  mainRow.appendChild(leftSide);
  mainRow.appendChild(rightSide);

  const settingsOptions = document.createElement('div');
  settingsOptions.id = `settingsOptions${app.id}`;
  settingsOptions.className = 'hidden px-4 pb-4 space-y-3 border-t border-[#CDC8C2] pt-3';

  const kWhField = createField(
    'Förbrukning (kWh)',
    'number',
    app.kWh,
    (value) => onUpdateField(app.id, 'kWh', parseFloat(value)),
    { step: '0.1', min: '0' }
  );

  const hoursField = createField(
    'Tid (timmar)',
    'number',
    app.hours,
    (value) => onUpdateField(app.id, 'hours', parseFloat(value)),
    { step: '0.5', min: '0.5' }
  );

  const timeWindowField = createTimeWindowField(
    app.timeWindow,
    (field, value) => onUpdateTimeWindow(app.id, field, parseInt(value))
  );

  settingsOptions.appendChild(kWhField);
  settingsOptions.appendChild(hoursField);
  settingsOptions.appendChild(timeWindowField);

  container.appendChild(mainRow);
  container.appendChild(settingsOptions);

  setTimeout(() => createIcons({ icons }), 0);

  return {
    element: container,
    update: (updatedApp) => {
      toggleBtn.className = `relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${updatedApp.enabled ? 'bg-[#009A33]' : 'bg-[#CDC8C2]'}`;
      toggleIndicator.className = `pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${updatedApp.enabled ? 'translate-x-5' : 'translate-x-0'}`;
    }
  };
}

function createField(label, type, value, onChange, attrs = {}) {
  const fieldDiv = document.createElement('div');

  const labelElem = document.createElement('label');
  labelElem.className = 'text-xs text-[#000000] opacity-75 mb-1 block';
  labelElem.textContent = label;

  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.className = 'w-full px-3 py-2 bg-white rounded text-caption border border-[#CDC8C2]';
  Object.entries(attrs).forEach(([key, val]) => input.setAttribute(key, val));
  input.addEventListener('change', (e) => onChange(e.target.value));

  fieldDiv.appendChild(labelElem);
  fieldDiv.appendChild(input);

  return fieldDiv;
}

function createTimeWindowField(timeWindow, onChange) {
  const fieldDiv = document.createElement('div');

  const labelElem = document.createElement('label');
  labelElem.className = 'text-xs text-[#000000] opacity-75 mb-1 block';
  labelElem.textContent = 'Tidsfönster';

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'flex gap-2';

  const startInput = document.createElement('input');
  startInput.type = 'number';
  startInput.value = timeWindow.start;
  startInput.className = 'flex-1 px-3 py-2 bg-white rounded text-caption border border-[#CDC8C2]';
  startInput.setAttribute('min', '0');
  startInput.setAttribute('max', '23');
  startInput.setAttribute('placeholder', 'Från');
  startInput.addEventListener('change', (e) => onChange('start', e.target.value));

  const separator = document.createElement('span');
  separator.className = 'flex items-center text-caption';
  separator.textContent = '–';

  const endInput = document.createElement('input');
  endInput.type = 'number';
  endInput.value = timeWindow.end;
  endInput.className = 'flex-1 px-3 py-2 bg-white rounded text-caption border border-[#CDC8C2]';
  endInput.setAttribute('min', '0');
  endInput.setAttribute('max', '24');
  endInput.setAttribute('placeholder', 'Till');
  endInput.addEventListener('change', (e) => onChange('end', e.target.value));

  inputWrapper.appendChild(startInput);
  inputWrapper.appendChild(separator);
  inputWrapper.appendChild(endInput);

  fieldDiv.appendChild(labelElem);
  fieldDiv.appendChild(inputWrapper);

  return fieldDiv;
}

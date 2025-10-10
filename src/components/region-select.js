import { createIcons, icons } from 'lucide';

export function createRegionSelect(selectedRegion, onRegionChange) {
  const container = document.createElement('div');
  container.className = 'relative';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'flex items-center gap-1 px-2 py-1.5 bg-[#F2EFEC] text-[#000000] rounded text-caption hover:bg-[#CDC8C2] transition-colors';
  button.innerHTML = `
    <span id="selected-region">${selectedRegion}</span>
    <i data-lucide="chevron-down" class="h-3 w-3"></i>
  `;

  const dropdown = document.createElement('div');
  dropdown.className = 'hidden absolute left-0 z-50 min-w-[140px] overflow-hidden rounded bg-white shadow-xl mt-2 text-black border border-[#F2EFEC]';
  dropdown.innerHTML = `
    <div class="p-1">
      <div data-value="SE1" class="flex items-center px-4 py-3 cursor-pointer hover:bg-[#F2EFEC] text-body transition-colors">
        <span>SE1 - Luleå</span>
      </div>
      <div data-value="SE2" class="flex items-center px-4 py-3 cursor-pointer hover:bg-[#F2EFEC] text-body transition-colors">
        <span>SE2 - Sundsvall</span>
      </div>
      <div data-value="SE3" class="flex items-center px-4 py-3 cursor-pointer hover:bg-[#F2EFEC] text-body transition-colors">
        <span>SE3 - Stockholm</span>
      </div>
      <div data-value="SE4" class="flex items-center px-4 py-3 cursor-pointer hover:bg-[#F2EFEC] text-body transition-colors">
        <span>SE4 - Malmö</span>
      </div>
    </div>
  `;

  let isOpen = false;

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    dropdown.classList.toggle('hidden', !isOpen);
  });

  document.addEventListener('click', () => {
    if (isOpen) {
      isOpen = false;
      dropdown.classList.add('hidden');
    }
  });

  dropdown.querySelectorAll('[data-value]').forEach(item => {
    item.addEventListener('click', (e) => {
      const value = e.currentTarget.dataset.value;

      // Update button text
      button.querySelector('#selected-region').textContent = value;

      // Close dropdown
      isOpen = false;
      dropdown.classList.add('hidden');

      // Call callback
      onRegionChange(value);

      // Re-initialize icons
      createIcons({ icons });
    });
  });

  container.appendChild(button);
  container.appendChild(dropdown);

  // Initialize icons
  setTimeout(() => createIcons({ icons }), 0);

  return container;
}

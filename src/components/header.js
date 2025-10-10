import { createRegionSelect } from './region-select.js';

export function createHeader(selectedRegion, onRegionChange, onSettingsClick) {
  const container = document.createElement('header');
  container.className = 'bg-white border-b border-[#F2EFEC] sticky top-0 z-30';

  const inner = document.createElement('div');
  inner.className = 'max-w-4xl mx-auto px-4 py-4 flex items-center justify-between';

  const regionSelectContainer = document.createElement('div');
  const regionSelect = createRegionSelect(selectedRegion, onRegionChange);
  regionSelectContainer.appendChild(regionSelect);

  const title = document.createElement('h1');
  title.className = 'text-h2 absolute left-1/2 transform -translate-x-1/2';
  title.textContent = 'Greenely';

  inner.appendChild(regionSelectContainer);
  inner.appendChild(title);
  container.appendChild(inner);

  return {
    element: container,
    update: (newRegion) => {
      regionSelectContainer.innerHTML = '';
      const newSelect = createRegionSelect(newRegion, onRegionChange);
      regionSelectContainer.appendChild(newSelect);
    }
  };
}

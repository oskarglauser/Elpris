import { createIcons, icons } from 'lucide';
import { createApplianceItem } from './appliance-item.js';

export function createSettingsModal(applianceService, onClose, onApplianceUpdate) {
  const overlay = document.createElement('div');
  overlay.id = 'settingsModal';
  overlay.className = 'hidden fixed inset-0 z-50';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';

  const modal = document.createElement('div');
  modal.className = 'absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-6';

  const title = document.createElement('h2');
  title.className = 'text-h2';
  title.textContent = 'Enheter';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'p-2 hover:bg-[#F2EFEC] rounded-full transition-colors';
  const closeIcon = document.createElement('i');
  closeIcon.setAttribute('data-lucide', 'x');
  closeIcon.className = 'w-6 h-6';
  closeBtn.appendChild(closeIcon);
  closeBtn.addEventListener('click', onClose);

  header.appendChild(title);
  header.appendChild(closeBtn);

  const appliancesList = document.createElement('div');
  appliancesList.id = 'appliancesList';
  appliancesList.className = 'space-y-3';

  modal.appendChild(header);
  modal.appendChild(appliancesList);
  overlay.appendChild(modal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      onClose();
    }
  });

  const applianceItems = new Map();

  const renderAppliances = () => {
    appliancesList.innerHTML = '';
    applianceItems.clear();

    const appliances = applianceService.getAppliances();

    appliances.forEach(app => {
      const item = createApplianceItem(
        app,
        (id) => {
          applianceService.toggleAppliance(id);
          const updatedApp = appliances.find(a => a.id === id);
          if (updatedApp && applianceItems.has(id)) {
            applianceItems.get(id).update(updatedApp);
          }
          onApplianceUpdate();
        },
        (id, field, value) => {
          applianceService.updateApplianceField(id, field, value);
          onApplianceUpdate();
        },
        (id, field, value) => {
          applianceService.updateTimeWindow(id, field, value);
          onApplianceUpdate();
        },
        (id) => {
          const settings = document.getElementById(`settingsOptions${id}`);
          if (settings) {
            settings.classList.toggle('hidden');
          }
        }
      );

      applianceItems.set(app.id, item);
      appliancesList.appendChild(item.element);
    });

    createIcons({ icons });
  };

  const show = () => {
    renderAppliances();
    overlay.classList.remove('hidden');
  };

  const hide = () => {
    overlay.classList.add('hidden');
  };

  return {
    element: overlay,
    show,
    hide,
    renderAppliances
  };
}

export function createDayToggle(selectedDay, onDayChange) {
  const container = document.createElement('div');
  container.className = 'flex justify-center mt-2';

  const toggleWrapper = document.createElement('div');
  toggleWrapper.className = 'inline-flex rounded bg-[#F2EFEC] p-1';

  const todayBtn = document.createElement('button');
  todayBtn.dataset.day = 'today';
  todayBtn.className = 'px-4 py-1.5 text-caption rounded transition-colors';
  todayBtn.textContent = 'Idag';

  const tomorrowBtn = document.createElement('button');
  tomorrowBtn.dataset.day = 'tomorrow';
  tomorrowBtn.className = 'px-4 py-1.5 text-caption rounded transition-colors';
  tomorrowBtn.textContent = 'Imorgon';

  const updateStyles = (selected) => {
    [todayBtn, tomorrowBtn].forEach(btn => {
      if (btn.dataset.day === selected) {
        btn.classList.add('bg-white', 'text-[#000000]', 'shadow-sm');
        btn.classList.remove('bg-[#CDC8C2]', 'hover:bg-white/50');
      } else {
        btn.classList.remove('bg-white', 'shadow-sm');
        btn.classList.add('bg-[#CDC8C2]', 'hover:bg-white/50', 'text-[#000000]');
      }
    });
  };

  todayBtn.addEventListener('click', () => {
    updateStyles('today');
    onDayChange('today');
  });

  tomorrowBtn.addEventListener('click', () => {
    updateStyles('tomorrow');
    onDayChange('tomorrow');
  });

  updateStyles(selectedDay);

  toggleWrapper.appendChild(todayBtn);
  toggleWrapper.appendChild(tomorrowBtn);
  container.appendChild(toggleWrapper);

  return {
    element: container,
    update: (newSelectedDay) => {
      updateStyles(newSelectedDay);
    }
  };
}

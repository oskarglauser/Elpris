export function createCurrentPrice() {
  const container = document.createElement('div');
  container.id = 'currentPrice';
  container.className = 'transition-colors duration-500';
  container.style.background = '#000000';

  const inner = document.createElement('div');
  inner.className = 'px-6 py-3 text-center text-white';

  const priceDisplay = document.createElement('div');
  priceDisplay.id = 'priceDisplay';
  priceDisplay.className = 'text-h1';
  priceDisplay.textContent = '--';

  const priceUnit = document.createElement('div');
  priceUnit.id = 'priceUnit';
  priceUnit.className = 'text-sm opacity-75 mt-1';
  priceUnit.textContent = 'öre/kWh just nu';

  inner.appendChild(priceDisplay);
  inner.appendChild(priceUnit);
  container.appendChild(inner);

  return {
    element: container,
    update: (currentData, avgPrice) => {
      if (currentData) {
        priceDisplay.textContent = currentData.price;

        if (currentData.price < avgPrice * 0.7) {
          container.style.background = '#009A33';
        } else if (currentData.price > avgPrice * 1.3) {
          container.style.background = '#D73333';
        } else {
          container.style.background = '#000000';
        }
      }
    }
  };
}

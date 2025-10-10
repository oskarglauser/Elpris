import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { createIcons, icons } from 'lucide';
import { createRegionSelect } from './components/region-select';

Chart.register(annotationPlugin);

let priceData = [];
let chart = null;
let selectedDay = 'today';

const iconOptions = [
  'car', 'washing-machine', 'wind', 'utensils', 'flame', 'spray-can',
  'oven', 'shower-head', 'bath', 'zap', 'lightbulb', 'refrigerator',
  'tv', 'laptop', 'smartphone', 'drill', 'microwave', 'coffee',
  'fan', 'speaker', 'heater', 'snowflake', 'droplet', 'waves',
  'plug', 'battery-charging', 'power', 'gauge'
];

const presets = [
  { name: 'Elbil', icon: 'car', kWh: 40, hours: 4, timeWindow: { start: 0, end: 24 } },
  { name: 'Tvättmaskin', icon: 'washing-machine', kWh: 1, hours: 1, timeWindow: { start: 6, end: 23 } },
  { name: 'Torktumlare', icon: 'wind', kWh: 3, hours: 1.5, timeWindow: { start: 6, end: 23 } },
  { name: 'Torkskåp', icon: 'archive', kWh: 2.5, hours: 3, timeWindow: { start: 6, end: 23 } },
  { name: 'Diskmaskin', icon: 'utensils', kWh: 1.5, hours: 2, timeWindow: { start: 6, end: 24 } },
  { name: 'Värmepump', icon: 'thermometer', kWh: 3, hours: 8, timeWindow: { start: 0, end: 24 } },
  { name: 'Luftkonditionering', icon: 'snowflake', kWh: 2, hours: 6, timeWindow: { start: 0, end: 24 } },
  { name: 'Poolpump', icon: 'waves', kWh: 1.5, hours: 6, timeWindow: { start: 0, end: 24 } },
  { name: 'Elpatron', icon: 'heater', kWh: 5, hours: 3, timeWindow: { start: 0, end: 24 } },
  { name: 'Spis och ugn', icon: 'cooking-pot', kWh: 3, hours: 1, timeWindow: { start: 6, end: 23 } },
  { name: 'Computer', icon: 'laptop', kWh: 0.3, hours: 8, timeWindow: { start: 6, end: 23 } },
  { name: 'Eldriven golvvärme badrum', icon: 'flame', kWh: 2, hours: 4, timeWindow: { start: 5, end: 23 } },
  { name: 'Dammsugare', icon: 'spray-can', kWh: 1.5, hours: 0.5, timeWindow: { start: 7, end: 22 } },
  { name: 'Bastu', icon: 'flame', kWh: 8, hours: 2, timeWindow: { start: 15, end: 23 } }
];

const emojiToIcon = {
  '🚗': 'car',
  '🧺': 'washing-machine',
  '🌀': 'wind',
  '🍽️': 'utensils',
  '🧖': 'flame',
  '🧹': 'spray-can',
  '🍕': 'oven',
  '🚿': 'shower-head',
  '🛁': 'bath',
  '⚡': 'zap',
  '💰': 'piggy-bank'
};

function migrateAppliances(apps) {
  return apps.map(app => {
    if (emojiToIcon[app.icon]) {
      return { ...app, icon: emojiToIcon[app.icon] };
    }
    if (!iconOptions.includes(app.icon)) {
      return { ...app, icon: 'zap' };
    }
    return app;
  });
}

// Initialize all devices from presets with enabled state
let savedDevices = JSON.parse(localStorage.getItem('appliances')) || [];
let appliances = presets.map((preset, index) => {
  const saved = savedDevices.find(s => s.name === preset.name);
  return {
    id: index + 1,
    name: preset.name,
    icon: preset.icon,
    kWh: preset.kWh,
    hours: preset.hours,
    timeWindow: preset.timeWindow,
    enabled: saved ? saved.enabled : (preset.name === 'Elbil' || preset.name === 'Tvättmaskin')
  };
});

function saveAppliances() {
  localStorage.setItem('appliances', JSON.stringify(appliances));
}

export function renderApp() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <!-- Header -->
    <header class="bg-white border-b border-[#F2EFEC] sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div id="regionSelectContainer"></div>
        <h1 class="text-h2 absolute left-1/2 transform -translate-x-1/2">Greenely</h1>
      </div>
    </header>

    <!-- Hero Section -->
    <div id="currentPrice" class="transition-colors duration-500" style="background: #000000;">
      <div class="px-6 py-3 text-center text-white">
        <div id="priceDisplay" class="text-h1">--</div>
        <div id="priceUnit" class="text-sm opacity-75 mt-1">öre/kWh</div>
      </div>
    </div>

    <!-- Graph Section -->
    <div class="py-8 bg-white">
      <div id="chartContainer" class="relative h-[250px] sm:h-[240px] md:h-[280px]">
        <canvas id="priceChart"></canvas>
      </div>
      <div id="noDataMessage" class="hidden p-8 text-center">
        <p class="text-el-gray-dark">Priser för imorgon är inte tillgängliga än</p>
      </div>
      <div class="flex justify-center mt-4">
        <div id="dayToggle" class="inline-flex rounded bg-[#F2EFEC] p-1">
          <button data-day="today" class="px-4 py-1.5 text-caption rounded transition-colors bg-white text-[#000000]">
            Idag
          </button>
          <button data-day="tomorrow" class="px-4 py-1.5 text-caption rounded transition-colors hover:bg-white/50 text-[#353230]">
            Imorgon
          </button>
        </div>
      </div>
    </div>

    <!-- Recommendations Section -->
    <div class="px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-h2">Dina enheter</h2>
          <button id="settingsBtn" class="p-2 hover:bg-[#F2EFEC] rounded transition-colors">
            <i data-lucide="settings" class="w-6 h-6 text-[#000000]"></i>
          </button>
        </div>
        <div id="yearlySavings" class="mb-3"></div>
        <div id="recommendations" class="space-y-3">
          <div class="flex items-center gap-3 p-4 bg-white rounded">
            <i data-lucide="loader" class="w-5 h-5"></i>
            <div>Laddar...</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal (Slide-up) -->
    <div id="settingsModal" class="hidden fixed inset-0 z-50" style="background-color: rgba(0, 0, 0, 0.3);">
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-h2">Enheter</h2>
          <button id="closeModal" class="p-2 hover:bg-[#F2EFEC] rounded-full transition-colors">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>
        <div id="appliancesList" class="space-y-3"></div>
      </div>
    </div>
  `;

  createIcons({ icons });
  initializeApp();
}

function initializeApp() {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeModal = document.getElementById('closeModal');

  settingsBtn.addEventListener('click', () => openSettings());
  closeModal.addEventListener('click', () => settingsModal.classList.add('hidden'));
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
  });

  // Add day toggle functionality
  const dayToggle = document.getElementById('dayToggle');
  dayToggle.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDay = btn.dataset.day;

      // Update button styles
      dayToggle.querySelectorAll('button').forEach(b => {
        if (b.dataset.day === selectedDay) {
          b.classList.add('bg-white', 'text-[#000000]');
          b.classList.remove('hover:bg-white/50', 'text-[#353230]');
        } else {
          b.classList.remove('bg-white', 'text-[#000000]');
          b.classList.add('hover:bg-white/50', 'text-[#353230]');
        }
      });

      updateChart();
      updateRecommendations();
    });
  });

  // Add region select
  const regionSelectContainer = document.getElementById('regionSelectContainer');
  const savedRegion = localStorage.getItem('selectedRegion') || 'SE3';
  const regionSelect = createRegionSelect(savedRegion, (newRegion) => {
    localStorage.setItem('selectedRegion', newRegion);
    fetchPriceData(newRegion);
  });
  regionSelectContainer.appendChild(regionSelect);

  fetchPriceData(savedRegion);
  setInterval(updateCurrentPrice, 60000);
}

async function fetchPriceData(region = 'SE3') {
  const now = new Date();

  // Fetch today's data
  const todayYear = now.getFullYear();
  const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
  const todayDay = String(now.getDate()).padStart(2, '0');
  const todayUrl = `https://www.elprisetjustnu.se/api/v1/prices/${todayYear}/${todayMonth}-${todayDay}_${region}.json`;

  // Fetch tomorrow's data
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowYear = tomorrow.getFullYear();
  const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0');
  const tomorrowUrl = `https://www.elprisetjustnu.se/api/v1/prices/${tomorrowYear}/${tomorrowMonth}-${tomorrowDay}_${region}.json`;

  try {
    const [todayResponse, tomorrowResponse] = await Promise.all([
      fetch(todayUrl),
      fetch(tomorrowUrl).catch(() => null) // Tomorrow's data might not be available yet
    ]);

    const todayData = await todayResponse.json();
    const tomorrowData = tomorrowResponse ? await tomorrowResponse.json().catch(() => []) : [];

    priceData = [...todayData, ...tomorrowData].map(item => {
      const time = new Date(item.time_start);
      return {
        ...item,
        price: Math.round(item.SEK_per_kWh * 100),
        hour: time.getHours(),
        minute: time.getMinutes(),
        time: time
      };
    });

    updateCurrentPrice();
    updateChart();
    updateRecommendations();
  } catch (error) {
    console.error('Error fetching price data:', error);
  }
}

function updateCurrentPrice() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = Math.floor(now.getMinutes() / 15) * 15;

  const currentData = priceData.find(item =>
    item.hour === currentHour && item.minute === currentMinute
  );

  if (currentData) {
    const priceDisplay = document.getElementById('priceDisplay');
    priceDisplay.textContent = currentData.price;

    const currentPriceCard = document.getElementById('currentPrice');
    const avgPrice = priceData.reduce((sum, item) => sum + item.price, 0) / priceData.length;

    if (currentData.price < avgPrice * 0.7) {
      currentPriceCard.style.background = '#009A33';
    } else if (currentData.price > avgPrice * 1.3) {
      currentPriceCard.style.background = '#D73333';
    } else {
      currentPriceCard.style.background = '#000000';
    }
  }
}

function updateChart() {
  const ctx = document.getElementById('priceChart');
  if (!ctx) return;

  const chartContainer = document.getElementById('chartContainer');
  const noDataMessage = document.getElementById('noDataMessage');

  // Filter data based on selected day
  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  let filteredData = priceData.filter(item => {
    const itemDate = new Date(item.time.getFullYear(), item.time.getMonth(), item.time.getDate());
    if (selectedDay === 'today') {
      return itemDate.getTime() === todayDate.getTime();
    } else {
      return itemDate.getTime() === tomorrowDate.getTime();
    }
  });

  // For today, only show from 1 hour ago onwards
  if (selectedDay === 'today') {
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    filteredData = filteredData.filter(item => item.time >= oneHourAgo);
  }

  if (filteredData.length === 0) {
    if (chart) {
      chart.destroy();
      chart = null;
    }
    chartContainer.classList.add('hidden');
    noDataMessage.classList.remove('hidden');
    return;
  }

  // Show chart and hide message when data exists
  chartContainer.classList.remove('hidden');
  noDataMessage.classList.add('hidden');

  const labels = filteredData.map(item => {
    const h = String(item.hour).padStart(2, '0');
    const m = String(item.minute).padStart(2, '0');
    return `${h}:${m}`;
  });

  const prices = filteredData.map(item => item.price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  // Find current time index (only for today)
  const currentHour = now.getHours();
  const currentMinute = Math.floor(now.getMinutes() / 15) * 15;
  const currentIndex = selectedDay === 'today' ? filteredData.findIndex(item =>
    item.hour === currentHour && item.minute === currentMinute
  ) : -1;

  // Find min and max prices for annotations
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minIndex = prices.indexOf(minPrice);
  const maxIndex = prices.indexOf(maxPrice);

  // Find price transitions (cheap to expensive and vice versa)
  const transitions = [];
  for (let i = 1; i < prices.length; i++) {
    const prevPrice = prices[i - 1];
    const currPrice = prices[i];
    const prevCategory = prevPrice < avgPrice * 0.85 ? 'green' : prevPrice >= avgPrice * 1.15 ? 'red' : 'yellow';
    const currCategory = currPrice < avgPrice * 0.85 ? 'green' : currPrice >= avgPrice * 1.15 ? 'red' : 'yellow';

    // Going more expensive (green/yellow → red)
    if ((prevCategory === 'green' || prevCategory === 'yellow') && currCategory === 'red') {
      transitions.push({ index: i, type: 'expensive', time: labels[i] });
    }
    // Going cheaper (red/yellow → green)
    if ((prevCategory === 'red' || prevCategory === 'yellow') && currCategory === 'green') {
      transitions.push({ index: i, type: 'cheap', time: labels[i] });
    }
  }

  if (chart) {
    chart.destroy();
  }

  // Get chart height for gradient
  const chartHeight = ctx.height || 250;

  // Create gradient background
  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, chartHeight);
  gradient.addColorStop(0, 'rgba(215, 51, 51, 0.1)');   // Red top
  gradient.addColorStop(0.35, 'rgba(255, 193, 7, 0.1)'); // Yellow
  gradient.addColorStop(0.7, 'rgba(0, 154, 51, 0.1)');   // Green bottom
  gradient.addColorStop(1, 'rgba(0, 154, 51, 0.05)');    // Fade out

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Pris (öre/kWh)',
        data: prices,
        borderColor: '#191919',
        backgroundColor: gradient,
        borderWidth: 2,
        fill: 'origin',
        stepped: true,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#000000',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 3,
        segment: {
          borderColor: (ctx) => {
            const price = ctx.p1.parsed.y;
            if (price < avgPrice * 0.85) return '#009A33';
            if (price >= avgPrice * 1.15) return '#D73333';
            return '#FFC107';
          }
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'x'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          padding: 16,
          titleFont: { size: 16, weight: 'normal' },
          bodyFont: { size: 18, weight: 'normal' },
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (context) => {
              const startTime = context[0].label;
              const [h, m] = startTime.split(':');
              const endMinute = (parseInt(m) + 15) % 60;
              const endHour = endMinute === 0 ? (parseInt(h) + 1) % 24 : parseInt(h);
              const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
              return `${startTime} - ${endTime}`;
            },
            label: (context) => `${context.parsed.y} öre/kWh`
          }
        },
        annotation: {
          annotations: {
            ...(currentIndex >= 0 && {
              currentTime: {
                type: 'line',
                xMin: currentIndex,
                xMax: currentIndex,
                borderColor: '#000000',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  display: true,
                  content: 'Nu',
                  position: 'start',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  font: { size: 11, weight: 'normal' },
                  padding: 4
                }
              }
            }),
            minPrice: {
              type: 'point',
              xValue: minIndex,
              yValue: minPrice,
              backgroundColor: '#009A33',
              radius: 6,
              borderWidth: 0
            },
            maxPrice: {
              type: 'point',
              xValue: maxIndex,
              yValue: maxPrice,
              backgroundColor: '#D73333',
              radius: 6,
              borderWidth: 0
            },
            // Add transition labels
            ...Object.fromEntries(
              transitions.map((transition, idx) => [
                `transition_${idx}`,
                {
                  type: 'label',
                  xValue: transition.index,
                  yValue: prices[transition.index],
                  backgroundColor: transition.type === 'expensive' ? '#D73333' : '#009A33',
                  color: '#FFFFFF',
                  content: transition.time,
                  font: { size: 10, weight: 'normal' },
                  padding: { top: 2, bottom: 2, left: 4, right: 4 },
                  borderRadius: 4,
                  position: 'start'
                }
              ])
            )
          }
        }
      },
      scales: {
        y: {
          display: true,
          beginAtZero: false,
          min: Math.floor(minPrice * 0.95),
          max: Math.ceil(maxPrice * 1.05),
          ticks: {
            font: { size: 11, weight: 'normal' },
            color: '#353230',
            padding: 8,
            maxTicksLimit: 5
          },
          grid: {
            display: false
          },
          border: {
            display: false
          }
        },
        x: {
          ticks: {
            font: { size: 11, weight: 'normal' },
            color: '#353230',
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: window.innerWidth < 640 ? 6 : 12,
            padding: 8,
            callback: function(value, index) {
              const label = this.getLabelForValue(value);
              // Show only the hour part of the time
              return label.split(':')[0];
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function findBestTimeSlots(durationSlots = 1, timeWindow = { start: 0, end: 24 }, sourceData = priceData) {
  // Filter price data to only include slots within time window
  const filteredData = sourceData.filter(slot => {
    const hour = slot.hour;
    if (timeWindow.start < timeWindow.end) {
      return hour >= timeWindow.start && hour < timeWindow.end;
    } else {
      // Handle overnight windows (e.g., 22:00 - 06:00)
      return hour >= timeWindow.start || hour < timeWindow.end;
    }
  });

  if (filteredData.length === 0) return [];

  if (durationSlots === 1) {
    return [[...filteredData].sort((a, b) => a.price - b.price)[0]];
  }

  let bestSlots = [];
  let lowestAvg = Infinity;

  for (let i = 0; i <= filteredData.length - durationSlots; i++) {
    const slots = filteredData.slice(i, i + durationSlots);
    const avg = slots.reduce((sum, slot) => sum + slot.price, 0) / durationSlots;

    if (avg < lowestAvg) {
      lowestAvg = avg;
      bestSlots = slots;
    }
  }

  return bestSlots;
}

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function updateRecommendations() {
  const recommendationsDiv = document.getElementById('recommendations');
  const yearlySavingsDiv = document.getElementById('yearlySavings');
  const enabledAppliances = appliances.filter(a => a.enabled);

  if (enabledAppliances.length === 0) {
    yearlySavingsDiv.innerHTML = '';
    recommendationsDiv.innerHTML = `
      <div class="p-8 text-center bg-white rounded">
        <p class="text-el-gray-dark">Lägg till apparater för att se bästa tiderna</p>
      </div>
    `;
    return;
  }

  // Filter price data based on selected day
  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const filteredPriceData = priceData.filter(item => {
    const itemDate = new Date(item.time.getFullYear(), item.time.getMonth(), item.time.getDate());
    if (selectedDay === 'today') {
      return itemDate.getTime() === todayDate.getTime();
    } else {
      return itemDate.getTime() === tomorrowDate.getTime();
    }
  });

  if (filteredPriceData.length === 0) {
    yearlySavingsDiv.innerHTML = '';
    let html = '';
    enabledAppliances.forEach(appliance => {
      html += `
        <div class="flex items-center justify-between p-3 bg-white rounded">
          <div class="flex items-center gap-2 flex-1">
            <i data-lucide="${appliance.icon}" class="w-5 h-5 text-el-gray-dark"></i>
            <div>
              <div class="text-caption">${appliance.name}</div>
              <div class="text-xs text-el-gray-dark">${appliance.kWh} kWh · ${appliance.hours}h</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-body text-el-gray-dark">—</div>
          </div>
        </div>
      `;
    });

    html += `
      <div class="p-6 bg-[#F2EFEC] text-[#353230] rounded text-center mt-2">
        <div class="text-caption">Priser för imorgon är inte tillgängliga än</div>
      </div>
    `;

    recommendationsDiv.innerHTML = html;
    createIcons({ icons });
    return;
  }

  let html = '';
  let totalSavings = 0;

  // Calculate daily average price for selected day
  const dailyAvgPrice = filteredPriceData.reduce((sum, slot) => sum + slot.price, 0) / filteredPriceData.length;

  // Calculate total savings first
  enabledAppliances.forEach(appliance => {
    const slots = Math.ceil((appliance.hours * 60) / 15);
    const timeWindow = appliance.timeWindow || { start: 0, end: 24 };
    const bestSlots = findBestTimeSlots(slots, timeWindow, filteredPriceData);

    if (bestSlots.length === 0) return;

    const bestAvg = bestSlots.reduce((sum, slot) => sum + slot.price, 0) / bestSlots.length;
    const savings = ((dailyAvgPrice - bestAvg) * appliance.kWh) / 100;
    totalSavings += savings;
  });

  // Add yearly savings at the top if there are any
  if (totalSavings > 0) {
    const totalYearly = totalSavings * 365;
    yearlySavingsDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="text-caption text-[#353230]">Årlig besparing</div>
        <div class="text-h2 text-[#009A33]">${totalYearly.toFixed(0)} kr</div>
      </div>
    `;
  } else {
    yearlySavingsDiv.innerHTML = '';
  }

  // Add device recommendations
  enabledAppliances.forEach(appliance => {
    const slots = Math.ceil((appliance.hours * 60) / 15);
    const timeWindow = appliance.timeWindow || { start: 0, end: 24 };
    const bestSlots = findBestTimeSlots(slots, timeWindow, filteredPriceData);

    if (bestSlots.length === 0) return;

    const bestAvg = bestSlots.reduce((sum, slot) => sum + slot.price, 0) / bestSlots.length;
    const savings = ((dailyAvgPrice - bestAvg) * appliance.kWh) / 100;

    const bestStart = formatTime(bestSlots[0].time);
    const bestEnd = formatTime(new Date(bestSlots[bestSlots.length - 1].time.getTime() + 15 * 60000));

    html += `
      <div class="flex items-center justify-between p-3 bg-white rounded">
        <div class="flex items-center gap-2 flex-1">
          <i data-lucide="${appliance.icon}" class="w-5 h-5 text-el-gray-dark"></i>
          <div>
            <div class="text-caption">${appliance.name}</div>
            <div class="text-xs text-el-gray-dark">${appliance.kWh} kWh · ${appliance.hours}h</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-body">${bestStart} – ${bestEnd}</div>
          <div class="text-xs text-el-green">Spara ${savings.toFixed(0)} kr</div>
        </div>
      </div>
    `;
  });

  recommendationsDiv.innerHTML = html;
  createIcons({ icons });
}

function openSettings() {
  renderAppliances();
  document.getElementById('settingsModal').classList.remove('hidden');
}

function renderAppliances() {
  const list = document.getElementById('appliancesList');
  list.innerHTML = appliances.map(app => `
    <div class="flex items-center justify-between p-4 bg-[#F2EFEC] rounded" data-app-id="${app.id}">
      <div class="flex items-center gap-3">
        <i data-lucide="${app.icon}" class="w-6 h-6"></i>
        <div class="text-body">${app.name}</div>
      </div>
      <button
        onclick="window.toggleAppliance(${app.id})"
        class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${app.enabled ? 'bg-[#009A33]' : 'bg-[#CDC8C2]'}"
        role="switch"
        aria-checked="${app.enabled}">
        <span class="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${app.enabled ? 'translate-x-5' : 'translate-x-0'}"></span>
      </button>
    </div>
  `).join('');
  createIcons({ icons });
}

window.toggleAppliance = function(id) {
  const app = appliances.find(a => a.id === id);
  if (app) {
    app.enabled = !app.enabled;
    saveAppliances();
    renderAppliances();
    updateRecommendations();
  }
};

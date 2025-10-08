let priceData = [];
let chart = null;

const iconOptions = [
    'car', 'washing-machine', 'wind', 'utensils', 'flame', 'spray-can',
    'oven', 'shower-head', 'bath', 'zap', 'lightbulb', 'refrigerator',
    'tv', 'laptop', 'smartphone', 'drill', 'microwave', 'coffee',
    'fan', 'speaker', 'heater', 'snowflake', 'droplet', 'waves',
    'plug', 'battery-charging', 'power', 'gauge'
];

const presets = [
    { name: 'Elbil', icon: 'car', kWh: 40, hours: 4 },
    { name: 'Tvättmaskin', icon: 'washing-machine', kWh: 1, hours: 1 },
    { name: 'Torktumlare', icon: 'wind', kWh: 3, hours: 1.5 },
    { name: 'Diskmaskin', icon: 'utensils', kWh: 1.5, hours: 2 },
    { name: 'Bastu', icon: 'flame', kWh: 8, hours: 2 },
    { name: 'Dammsugare', icon: 'spray-can', kWh: 1.5, hours: 0.5 },
    { name: 'Ugn', icon: 'oven', kWh: 2, hours: 1 },
    { name: 'Dusch', icon: 'shower-head', kWh: 10, hours: 0.25 },
    { name: 'Badkar', icon: 'bath', kWh: 15, hours: 0.5 },
    { name: 'Custom', icon: 'zap', kWh: 1, hours: 1 }
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

let appliances = JSON.parse(localStorage.getItem('appliances')) || [
    { id: 1, name: 'Elbil', icon: 'car', kWh: 40, hours: 4, enabled: true },
    { id: 2, name: 'Tvättmaskin', icon: 'washing-machine', kWh: 1, hours: 1, enabled: true }
];

appliances = migrateAppliances(appliances);
localStorage.setItem('appliances', JSON.stringify(appliances));

const regionSelector = document.getElementById('region');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const addApplianceBtn = document.getElementById('addAppliance');

regionSelector.addEventListener('change', () => fetchPriceData());
settingsBtn.addEventListener('click', () => openSettings());
closeModal.addEventListener('click', () => settingsModal.classList.remove('active'));
addApplianceBtn.addEventListener('click', () => showPresetSelector());
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.remove('active');
});

async function fetchPriceData() {
    const region = regionSelector.value;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const url = `https://www.elprisetjustnu.se/api/v1/prices/${year}/${month}-${day}_${region}.json`;

    try {
        const response = await fetch(url);
        priceData = await response.json();

        priceData = priceData.map(item => {
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
        priceDisplay.textContent = `${currentData.price} öre`;

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
    const ctx = document.getElementById('priceChart').getContext('2d');

    const labels = priceData.map(item => {
        const h = String(item.hour).padStart(2, '0');
        const m = String(item.minute).padStart(2, '0');
        return `${h}:${m}`;
    });

    const prices = priceData.map(item => item.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    const backgroundColors = prices.map(price => {
        if (price < avgPrice * 0.7) return '#009A33';
        if (price > avgPrice * 1.3) return '#D73333';
        return '#191919';
    });

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pris (öre/kWh)',
                data: prices,
                backgroundColor: backgroundColors,
                borderWidth: 0,
                barPercentage: 1.0,
                categoryPercentage: 1.0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.parsed.y} öre/kWh`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { font: { size: 11 } }
                },
                x: {
                    ticks: {
                        font: { size: 10 },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function findBestTimeSlots(durationSlots = 1) {
    if (durationSlots === 1) {
        return [[...priceData].sort((a, b) => a.price - b.price)[0]];
    }

    let bestSlots = [];
    let lowestAvg = Infinity;

    for (let i = 0; i <= priceData.length - durationSlots; i++) {
        const slots = priceData.slice(i, i + durationSlots);
        const avg = slots.reduce((sum, slot) => sum + slot.price, 0) / durationSlots;

        if (avg < lowestAvg) {
            lowestAvg = avg;
            bestSlots = slots;
        }
    }

    return bestSlots;
}

function findWorstTimeSlots(durationSlots = 1) {
    if (durationSlots === 1) {
        return [[...priceData].sort((a, b) => b.price - a.price)[0]];
    }

    let worstSlots = [];
    let highestAvg = -Infinity;

    for (let i = 0; i <= priceData.length - durationSlots; i++) {
        const slots = priceData.slice(i, i + durationSlots);
        const avg = slots.reduce((sum, slot) => sum + slot.price, 0) / durationSlots;

        if (avg > highestAvg) {
            highestAvg = avg;
            worstSlots = slots;
        }
    }

    return worstSlots;
}

function formatTime(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
}

function updateRecommendations() {
    const recommendationsDiv = document.getElementById('recommendations');
    const enabledAppliances = appliances.filter(a => a.enabled);

    let html = '';
    let totalSavings = 0;

    enabledAppliances.forEach(appliance => {
        const slots = Math.ceil((appliance.hours * 60) / 15);
        const bestSlots = findBestTimeSlots(slots);
        const worstSlots = findWorstTimeSlots(slots);

        const bestAvg = bestSlots.reduce((sum, slot) => sum + slot.price, 0) / bestSlots.length;
        const worstAvg = worstSlots.reduce((sum, slot) => sum + slot.price, 0) / worstSlots.length;
        const savings = ((worstAvg - bestAvg) * appliance.kWh) / 100;
        totalSavings += savings;

        const bestStart = formatTime(bestSlots[0].time);
        const bestEnd = formatTime(new Date(bestSlots[bestSlots.length - 1].time.getTime() + 15 * 60000));
        const worstStart = formatTime(worstSlots[0].time);
        const worstEnd = formatTime(new Date(worstSlots[worstSlots.length - 1].time.getTime() + 15 * 60000));

        html += `
            <div class="recommendation-card">
                <h3><i data-lucide="${appliance.icon}" class="icon"></i> ${appliance.name}</h3>
                <div class="time-slot best">
                    <strong>Bästa tid:</strong><br>
                    ${bestStart} - ${bestEnd}<br>
                    Genomsnitt: ${Math.round(bestAvg)} öre/kWh
                </div>
                <div class="time-slot worst">
                    <strong>Undvik:</strong><br>
                    ${worstStart} - ${worstEnd}<br>
                    Genomsnitt: ${Math.round(worstAvg)} öre/kWh
                </div>
                <p style="margin-top: 10px; font-size: 13px; color: #353230;">
                    ${appliance.kWh} kWh, ${appliance.hours}h | Besparing: ${savings.toFixed(2)} kr
                </p>
            </div>
        `;
    });

    const totalMonthly = totalSavings * 30;
    const totalYearly = totalSavings * 365;

    html += `
        <div class="recommendation-card">
            <h3><i data-lucide="piggy-bank" class="icon"></i> Total besparing</h3>
            <div class="savings">
                ${totalMonthly.toFixed(0)} kr/månad
            </div>
            <p style="margin-top: 10px; color: #353230;">
                ${totalYearly.toFixed(0)} kr/år om du kör dagligen
            </p>
        </div>
    `;

    recommendationsDiv.innerHTML = html;
    lucide.createIcons();
}

function openSettings() {
    renderAppliances();
    settingsModal.classList.add('active');
}

function renderAppliances() {
    const list = document.getElementById('appliancesList');
    list.innerHTML = appliances.map(app => `
        <div class="appliance-item">
            <div class="appliance-header" data-app-id="${app.id}">
                <div>
                    <i data-lucide="${app.icon}" style="width: 24px; height: 24px; margin-right: 8px;"></i>
                    <strong>${app.name}</strong>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label class="toggle">
                        <input type="checkbox" ${app.enabled ? 'checked' : ''}
                            onchange="toggleAppliance(${app.id})">
                        <span class="slider"></span>
                    </label>
                    <button class="remove-btn" onclick="removeAppliance(${app.id})">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                        Ta bort
                    </button>
                </div>
            </div>
            <div class="appliance-controls">
                <div style="grid-column: 1 / -1;">
                    <label>Ikon</label>
                    <div style="display: flex; gap: 8px; margin-top: 4px; align-items: center;">
                        <div style="padding: 10px; border: 1px solid var(--gray); background: var(--white); display: flex; align-items: center; justify-content: center; width: 48px; height: 48px;">
                            <i data-lucide="${app.icon}" id="icon-preview-${app.id}" style="width: 28px; height: 28px;"></i>
                        </div>
                        <select onchange="updateApplianceIcon(${app.id}, this.value)"
                            style="flex: 1; padding: 10px; border: 1px solid var(--gray); font-size: 16px;">
                            ${iconOptions.map(iconName => `
                                <option value="${iconName}" ${app.icon === iconName ? 'selected' : ''}>
                                    ${iconName}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <div>
                    <label>Namn</label>
                    <input type="text" value="${app.name}"
                        onchange="updateAppliance(${app.id}, 'name', this.value)">
                </div>
                <div>
                    <label>kWh förbrukning</label>
                    <input type="number" value="${app.kWh}"
                        onchange="updateAppliance(${app.id}, 'kWh', parseFloat(this.value))">
                </div>
                <div>
                    <label>Timmar</label>
                    <input type="number" step="0.25" value="${app.hours}"
                        onchange="updateAppliance(${app.id}, 'hours', parseFloat(this.value))">
                </div>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function showPresetSelector() {
    const list = document.getElementById('appliancesList');
    const presetHTML = `
        <div style="background: #F2EFEC; padding: 15px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 12px; font-size: 16px;">Välj apparat</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;">
                ${presets.map(preset => `
                    <button onclick="addPresetAppliance('${preset.name}')" class="preset-btn">
                        <i data-lucide="${preset.icon}" style="width: 28px; height: 28px;"></i>
                        <span>${preset.name}</span>
                    </button>
                `).join('')}
            </div>
            <button onclick="closePresetSelector()"
                style="margin-top: 12px; padding: 10px 16px; background: #353230; color: white; border: none; cursor: pointer; width: 100%;">
                Avbryt
            </button>
        </div>
    `;
    list.innerHTML = presetHTML + list.innerHTML;
    lucide.createIcons();
}

function closePresetSelector() {
    renderAppliances();
}

function addPresetAppliance(presetName) {
    const preset = presets.find(p => p.name === presetName);
    const newId = Math.max(...appliances.map(a => a.id), 0) + 1;

    appliances.push({
        id: newId,
        name: preset.name,
        icon: preset.icon,
        kWh: preset.kWh,
        hours: preset.hours,
        enabled: true,
        isCustom: preset.name === 'Custom'
    });

    saveAppliances();
    renderAppliances();
    updateRecommendations();
}

function removeAppliance(id) {
    appliances = appliances.filter(a => a.id !== id);
    saveAppliances();
    renderAppliances();
    updateRecommendations();
}

function toggleAppliance(id) {
    const app = appliances.find(a => a.id === id);
    if (app) {
        app.enabled = !app.enabled;
        saveAppliances();
        updateRecommendations();
    }
}

function updateApplianceIcon(id, iconName) {
    const app = appliances.find(a => a.id === id);
    if (app) {
        app.icon = iconName;
        saveAppliances();

        const previewElement = document.getElementById(`icon-preview-${id}`);
        if (previewElement) {
            previewElement.setAttribute('data-lucide', iconName);
            lucide.createIcons();
        }

        const headerIcon = document.querySelector(`[data-app-id="${id}"] i[data-lucide]`);
        if (headerIcon) {
            headerIcon.setAttribute('data-lucide', iconName);
            lucide.createIcons();
        }

        updateRecommendations();
    }
}

function updateAppliance(id, field, value) {
    const app = appliances.find(a => a.id === id);
    if (app) {
        app[field] = value;
        saveAppliances();
        updateRecommendations();
    }
}

function saveAppliances() {
    localStorage.setItem('appliances', JSON.stringify(appliances));
}

fetchPriceData();
setInterval(updateCurrentPrice, 60000);

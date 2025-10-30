(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/electricity-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Type definitions for 15-minute electricity price data
__turbopack_context__.s([
    "calculatePriceStats",
    ()=>calculatePriceStats,
    "fetchElectricityPrices",
    ()=>fetchElectricityPrices,
    "fetchTodayAndTomorrowPrices",
    ()=>fetchTodayAndTomorrowPrices,
    "fetchTodaysPrices",
    ()=>fetchTodaysPrices,
    "fetchTomorrowsPrices",
    ()=>fetchTomorrowsPrices,
    "formatPrice",
    ()=>formatPrice,
    "formatTimeRange",
    ()=>formatTimeRange,
    "getCurrentDate",
    ()=>getCurrentDate,
    "getCurrentPriceInterval",
    ()=>getCurrentPriceInterval,
    "getPriceLevel",
    ()=>getPriceLevel,
    "getTomorrowDate",
    ()=>getTomorrowDate
]);
async function fetchElectricityPrices(year, month, day) {
    let region = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 'SE3';
    const url = "https://www.elprisetjustnu.se/api/v1/prices/".concat(year, "/").concat(month, "-").concat(day, "_").concat(region, ".json");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Data ej tillgänglig för ".concat(year, "-").concat(month, "-").concat(day, ". Morgondagens priser publiceras tidigast kl 13:00."));
            }
            throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Tom eller ogiltig data från API');
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Nätverksfel: Kunde inte hämta elpriser');
    }
}
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return {
        year,
        month,
        day
    };
}
async function fetchTodaysPrices() {
    let region = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'SE3';
    const { year, month, day } = getCurrentDate();
    return fetchElectricityPrices(year, month, day, region);
}
function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear().toString();
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const day = tomorrow.getDate().toString().padStart(2, '0');
    return {
        year,
        month,
        day
    };
}
async function fetchTomorrowsPrices() {
    let region = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'SE3';
    const { year, month, day } = getTomorrowDate();
    return fetchElectricityPrices(year, month, day, region);
}
async function fetchTodayAndTomorrowPrices() {
    let region = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'SE3';
    try {
        const [today, tomorrow] = await Promise.all([
            fetchTodaysPrices(region),
            fetchTomorrowsPrices(region).catch((err)=>{
                console.info('Morgondagens priser är inte tillgängliga än:', err.message);
                return [];
            })
        ]);
        if (today.length === 0) {
            throw new Error('Inga elpriser tillgängliga för idag');
        }
        return {
            today,
            tomorrow
        };
    } catch (error) {
        console.error('Error fetching prices:', error);
        throw error;
    }
}
function getCurrentPriceInterval(prices) {
    const now = new Date();
    for (const interval of prices){
        const start = new Date(interval.time_start);
        const end = new Date(interval.time_end);
        if (now >= start && now < end) {
            return interval;
        }
    }
    return null;
}
function calculatePriceStats(prices) {
    if (prices.length === 0) {
        return {
            min: 0,
            max: 0,
            average: 0
        };
    }
    const priceValues = prices.map((p)=>p.SEK_per_kWh);
    const min = Math.min(...priceValues);
    const max = Math.max(...priceValues);
    const average = priceValues.reduce((sum, price)=>sum + price, 0) / priceValues.length;
    return {
        min,
        max,
        average
    };
}
function getPriceLevel(price, average) {
    const threshold = average * 0.2; // 20% threshold
    if (price < average - threshold) return 'low';
    if (price > average + threshold) return 'high';
    return 'medium';
}
function formatTimeRange(start, end) {
    const startTime = new Date(start).toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const endTime = new Date(end).toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return "Idag, ".concat(startTime, "-").concat(endTime);
}
function formatPrice(price) {
    return "".concat(price.toFixed(1), " öre/kWh");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/appliance-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApplianceService",
    ()=>ApplianceService,
    "iconOptions",
    ()=>iconOptions,
    "presets",
    ()=>presets
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
const iconOptions = [
    'Car',
    'WashingMachine',
    'Wind',
    'Utensils',
    'Flame',
    'SprayCan',
    'CookingPot',
    'ShowerHead',
    'Bath',
    'Zap',
    'Lightbulb',
    'Refrigerator',
    'Tv',
    'Laptop',
    'Smartphone',
    'Drill',
    'Microwave',
    'Coffee',
    'Fan',
    'Speaker',
    'Heater',
    'Snowflake',
    'Droplet',
    'Waves',
    'Plug',
    'BatteryCharging',
    'Power',
    'Gauge',
    'Archive',
    'Thermometer'
];
const presets = [
    {
        id: 1,
        name: 'Elbil',
        icon: 'Car',
        kWh: 40,
        hours: 4,
        timeWindow: {
            start: 0,
            end: 24
        },
        enabled: true
    },
    {
        id: 2,
        name: 'Tvättmaskin',
        icon: 'WashingMachine',
        kWh: 1,
        hours: 1,
        timeWindow: {
            start: 6,
            end: 23
        },
        enabled: true
    },
    {
        id: 3,
        name: 'Torktumlare',
        icon: 'Wind',
        kWh: 3,
        hours: 1.5,
        timeWindow: {
            start: 6,
            end: 23
        },
        enabled: false
    },
    {
        id: 4,
        name: 'Torkskåp',
        icon: 'Archive',
        kWh: 2.5,
        hours: 3,
        timeWindow: {
            start: 6,
            end: 23
        },
        enabled: false
    },
    {
        id: 5,
        name: 'Diskmaskin',
        icon: 'Utensils',
        kWh: 1.5,
        hours: 2,
        timeWindow: {
            start: 6,
            end: 24
        },
        enabled: false
    },
    {
        id: 6,
        name: 'Värmepump',
        icon: 'Thermometer',
        kWh: 3,
        hours: 8,
        timeWindow: {
            start: 0,
            end: 24
        },
        enabled: false
    },
    {
        id: 7,
        name: 'Luftkonditionering',
        icon: 'Snowflake',
        kWh: 2,
        hours: 6,
        timeWindow: {
            start: 0,
            end: 24
        },
        enabled: false
    },
    {
        id: 8,
        name: 'Poolpump',
        icon: 'Waves',
        kWh: 1.5,
        hours: 6,
        timeWindow: {
            start: 0,
            end: 24
        },
        enabled: false
    },
    {
        id: 9,
        name: 'Elpatron',
        icon: 'Heater',
        kWh: 5,
        hours: 3,
        timeWindow: {
            start: 0,
            end: 24
        },
        enabled: false
    },
    {
        id: 10,
        name: 'Spis och ugn',
        icon: 'CookingPot',
        kWh: 3,
        hours: 1,
        timeWindow: {
            start: 6,
            end: 23
        },
        enabled: false
    },
    {
        id: 11,
        name: 'Computer',
        icon: 'Laptop',
        kWh: 0.3,
        hours: 8,
        timeWindow: {
            start: 6,
            end: 23
        },
        enabled: false
    },
    {
        id: 12,
        name: 'Eldriven golvvärme badrum',
        icon: 'Flame',
        kWh: 2,
        hours: 4,
        timeWindow: {
            start: 5,
            end: 23
        },
        enabled: false
    },
    {
        id: 13,
        name: 'Dammsugare',
        icon: 'SprayCan',
        kWh: 1.5,
        hours: 0.5,
        timeWindow: {
            start: 7,
            end: 22
        },
        enabled: false
    },
    {
        id: 14,
        name: 'Bastu',
        icon: 'Flame',
        kWh: 8,
        hours: 2,
        timeWindow: {
            start: 15,
            end: 23
        },
        enabled: false
    }
];
const STORAGE_KEY = 'greenely_appliances';
class ApplianceService {
    loadAppliances() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load appliances:', error);
        }
        return [
            ...presets
        ];
    }
    saveAppliances() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.appliances));
        } catch (error) {
            console.error('Failed to save appliances:', error);
        }
    }
    getAppliances() {
        return this.appliances;
    }
    getEnabledAppliances() {
        return this.appliances.filter((a)=>a.enabled);
    }
    toggleAppliance(id) {
        const app = this.appliances.find((a)=>a.id === id);
        if (app) {
            app.enabled = !app.enabled;
            this.saveAppliances();
        }
    }
    updateApplianceField(id, field, value) {
        const app = this.appliances.find((a)=>a.id === id);
        if (app && field !== 'id') {
            app[field] = value;
            this.saveAppliances();
        }
    }
    updateTimeWindow(id, field, value) {
        const app = this.appliances.find((a)=>a.id === id);
        if (app) {
            app.timeWindow[field] = value;
            this.saveAppliances();
        }
    }
    convertPriceIntervalsToPriceSlots(intervals) {
        return intervals.map((item)=>{
            const time = new Date(item.time_start);
            return {
                price: Math.round(item.SEK_per_kWh * 100),
                hour: time.getHours(),
                minute: time.getMinutes(),
                time: time
            };
        });
    }
    findBestTimeSlots() {
        let durationSlots = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, timeWindow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
            start: 0,
            end: 24
        }, priceData = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
        const filteredData = priceData.filter((slot)=>{
            const hour = slot.hour;
            if (timeWindow.start < timeWindow.end) {
                return hour >= timeWindow.start && hour < timeWindow.end;
            } else {
                return hour >= timeWindow.start || hour < timeWindow.end;
            }
        });
        if (filteredData.length === 0) return [];
        if (durationSlots === 1) {
            return [
                [
                    ...filteredData
                ].sort((a, b)=>a.price - b.price)[0]
            ];
        }
        let bestSlots = [];
        let lowestAvg = Infinity;
        for(let i = 0; i <= filteredData.length - durationSlots; i++){
            const slots = filteredData.slice(i, i + durationSlots);
            const avg = slots.reduce((sum, slot)=>sum + slot.price, 0) / durationSlots;
            if (avg < lowestAvg) {
                lowestAvg = avg;
                bestSlots = slots;
            }
        }
        return bestSlots;
    }
    calculateSavings(appliance, dailyAvgPrice, priceData) {
        const slots = Math.ceil(appliance.hours * 60 / 15);
        const timeWindow = appliance.timeWindow || {
            start: 0,
            end: 24
        };
        const bestSlots = this.findBestTimeSlots(slots, timeWindow, priceData);
        if (bestSlots.length === 0) return null;
        const bestAvg = bestSlots.reduce((sum, slot)=>sum + slot.price, 0) / bestSlots.length;
        const savingsKr = (dailyAvgPrice - bestAvg) * appliance.kWh / 100;
        const savingsOre = Math.round(savingsKr * 100);
        let savingsDisplay;
        if (Math.abs(savingsKr) >= 1) {
            const sign = savingsKr >= 0 ? '+' : '';
            savingsDisplay = "".concat(sign).concat(savingsKr.toFixed(0), " kr");
        } else {
            const sign = savingsOre >= 0 ? '+' : '';
            savingsDisplay = "".concat(sign).concat(savingsOre, " öre");
        }
        return {
            bestSlots,
            bestAvg,
            savingsKr,
            savingsOre,
            savingsDisplay
        };
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "appliances", void 0);
        this.appliances = this.loadAppliances();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/prototypes/prototype-a/PriceChartGraph.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PriceChartGraph",
    ()=>PriceChartGraph
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chartjs$2d$plugin$2d$annotation$2f$dist$2f$chartjs$2d$plugin$2d$annotation$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/chartjs-plugin-annotation/dist/chartjs-plugin-annotation.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CategoryScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LinearScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PointElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineController"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Title"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Filler"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chartjs$2d$plugin$2d$annotation$2f$dist$2f$chartjs$2d$plugin$2d$annotation$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
function PriceChartGraph(param) {
    let { priceData, selectedDay } = param;
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PriceChartGraph.useEffect": ()=>{
            if (!canvasRef.current || priceData.length === 0) return;
            const prices = priceData.map({
                "PriceChartGraph.useEffect.prices": (item)=>Math.round(item.SEK_per_kWh * 100)
            }["PriceChartGraph.useEffect.prices"]);
            const labels = priceData.map({
                "PriceChartGraph.useEffect.labels": (item)=>{
                    const time = new Date(item.time_start);
                    const h = String(time.getHours()).padStart(2, '0');
                    const m = String(time.getMinutes()).padStart(2, '0');
                    return "".concat(h, ":").concat(m);
                }
            }["PriceChartGraph.useEffect.labels"]);
            const avgPrice = prices.reduce({
                "PriceChartGraph.useEffect": (a, b)=>a + b
            }["PriceChartGraph.useEffect"], 0) / prices.length;
            const now = new Date();
            const currentIndex = selectedDay === 'today' ? priceData.findIndex({
                "PriceChartGraph.useEffect": (item)=>{
                    const start = new Date(item.time_start);
                    const end = new Date(item.time_end);
                    return now >= start && now < end;
                }
            }["PriceChartGraph.useEffect"]) : -1;
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const minIndex = prices.indexOf(minPrice);
            const maxIndex = prices.indexOf(maxPrice);
            const transitions = [];
            for(let i = 1; i < prices.length; i++){
                const prevPrice = prices[i - 1];
                const currPrice = prices[i];
                const prevCategory = prevPrice < avgPrice * 0.85 ? 'green' : prevPrice >= avgPrice * 1.15 ? 'red' : 'yellow';
                const currCategory = currPrice < avgPrice * 0.85 ? 'green' : currPrice >= avgPrice * 1.15 ? 'red' : 'yellow';
                if ((prevCategory === 'green' || prevCategory === 'yellow') && currCategory === 'red') {
                    transitions.push({
                        index: i,
                        type: 'expensive',
                        time: labels[i]
                    });
                }
                if ((prevCategory === 'red' || prevCategory === 'yellow') && currCategory === 'green') {
                    transitions.push({
                        index: i,
                        type: 'cheap',
                        time: labels[i]
                    });
                }
            }
            const minSpacing = 8;
            const filteredTransitions = [];
            let lastIndex = -minSpacing;
            for (const transition of transitions){
                if (transition.index - lastIndex >= minSpacing) {
                    filteredTransitions.push(transition);
                    lastIndex = transition.index;
                }
            }
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;
            const gradient = ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, 'rgba(215, 51, 51, 0.1)');
            gradient.addColorStop(0.45, 'rgba(255, 193, 7, 0.1)');
            gradient.addColorStop(0.8, 'rgba(0, 154, 51, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 154, 51, 0.05)');
            const annotations = {
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
                }
            };
            if (currentIndex >= 0) {
                annotations.currentTime = {
                    type: 'line',
                    xMin: currentIndex,
                    xMax: currentIndex,
                    borderColor: '#000000',
                    borderWidth: 2,
                    borderDash: [
                        5,
                        5
                    ],
                    label: {
                        display: true,
                        content: 'Nu',
                        position: 'start',
                        backgroundColor: '#000000',
                        color: '#FFFFFF',
                        font: {
                            size: 11
                        },
                        padding: 4
                    }
                };
            }
            filteredTransitions.forEach({
                "PriceChartGraph.useEffect": (transition, idx)=>{
                    annotations["transition_".concat(idx)] = {
                        type: 'label',
                        xValue: transition.index,
                        yValue: prices[transition.index],
                        backgroundColor: transition.type === 'expensive' ? '#D73333' : '#009A33',
                        color: '#FFFFFF',
                        content: transition.time,
                        font: {
                            size: 10
                        },
                        padding: {
                            top: 2,
                            bottom: 2,
                            left: 4,
                            right: 4
                        },
                        borderRadius: 4,
                        position: 'start'
                    };
                }
            }["PriceChartGraph.useEffect"]);
            chartRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"](canvasRef.current, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Pris (öre/kWh)',
                            data: prices,
                            borderColor: '#191919',
                            backgroundColor: gradient,
                            borderWidth: 1.5,
                            fill: 'origin',
                            stepped: true,
                            pointRadius: 0,
                            pointHoverRadius: 8,
                            pointHoverBackgroundColor: '#000000',
                            pointHoverBorderColor: '#FFFFFF',
                            pointHoverBorderWidth: 3,
                            segment: {
                                borderColor: {
                                    "PriceChartGraph.useEffect": (ctx)=>{
                                        const price = ctx.p1.parsed.y;
                                        if (price == null) return '#FFC107';
                                        if (price < avgPrice * 0.85) return '#009A33';
                                        if (price >= avgPrice * 1.15) return '#D73333';
                                        return '#FFC107';
                                    }
                                }["PriceChartGraph.useEffect"]
                            }
                        }
                    ]
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
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'rgba(0, 0, 0, 0.95)',
                            padding: 16,
                            titleFont: {
                                size: 16
                            },
                            bodyFont: {
                                size: 18
                            },
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                title: {
                                    "PriceChartGraph.useEffect": (context)=>{
                                        const startTime = context[0].label;
                                        const [h, m] = startTime.split(':');
                                        const endMinute = (parseInt(m) + 15) % 60;
                                        const endHour = endMinute === 0 ? (parseInt(h) + 1) % 24 : parseInt(h);
                                        const endTime = "".concat(String(endHour).padStart(2, '0'), ":").concat(String(endMinute).padStart(2, '0'));
                                        return "".concat(startTime, " - ").concat(endTime);
                                    }
                                }["PriceChartGraph.useEffect"],
                                label: {
                                    "PriceChartGraph.useEffect": (context)=>"".concat(context.parsed.y, " öre/kWh")
                                }["PriceChartGraph.useEffect"]
                            }
                        },
                        annotation: {
                            annotations
                        }
                    },
                    scales: {
                        y: {
                            display: true,
                            beginAtZero: false,
                            min: Math.floor(minPrice * 0.95),
                            max: Math.ceil(maxPrice * 1.05),
                            ticks: {
                                font: {
                                    size: 11
                                },
                                color: '#000000',
                                padding: 0,
                                maxTicksLimit: 7
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
                                font: {
                                    size: 11
                                },
                                color: '#000000',
                                maxRotation: 0,
                                minRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: "object" !== 'undefined' && window.innerWidth < 640 ? 6 : 12,
                                padding: 0,
                                callback: {
                                    "PriceChartGraph.useEffect": function(value, index) {
                                        const label = this.getLabelForValue(value);
                                        return label.split(':')[0];
                                    }
                                }["PriceChartGraph.useEffect"]
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
            return ({
                "PriceChartGraph.useEffect": ()=>{
                    if (chartRef.current) {
                        chartRef.current.destroy();
                    }
                }
            })["PriceChartGraph.useEffect"];
        }
    }["PriceChartGraph.useEffect"], [
        priceData,
        selectedDay
    ]);
    if (priceData.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 py-4 bg-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-4xl mx-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-8 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Priser för imorgon är inte tillgängliga än"
                    }, void 0, false, {
                        fileName: "[project]/components/prototypes/prototype-a/PriceChartGraph.tsx",
                        lineNumber: 278,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/PriceChartGraph.tsx",
                    lineNumber: 277,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/PriceChartGraph.tsx",
                lineNumber: 276,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/prototypes/prototype-a/PriceChartGraph.tsx",
            lineNumber: 275,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 pt-4 pb-2 bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-[250px] sm:h-[240px] md:h-[280px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                    ref: canvasRef
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/PriceChartGraph.tsx",
                    lineNumber: 289,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/PriceChartGraph.tsx",
                lineNumber: 288,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/prototypes/prototype-a/PriceChartGraph.tsx",
            lineNumber: 287,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/prototypes/prototype-a/PriceChartGraph.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, this);
}
_s(PriceChartGraph, "WDVG+s/RUdgzBQM+WtvU+4sd8NI=");
_c = PriceChartGraph;
var _c;
__turbopack_context__.k.register(_c, "PriceChartGraph");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/prototypes/prototype-a/DayToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DayToggle",
    ()=>DayToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function DayToggle(param) {
    let { selectedDay, onDayChange } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 pb-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto flex justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "inline-flex rounded bg-[#F2EFEC] p-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onDayChange('today'),
                        className: "px-4 py-1.5 text-sm rounded transition-colors ".concat(selectedDay === 'today' ? 'bg-white text-[#000000] shadow-sm' : 'bg-[#CDC8C2] hover:bg-white/50 text-[#000000]'),
                        children: "Idag"
                    }, void 0, false, {
                        fileName: "[project]/components/prototypes/prototype-a/DayToggle.tsx",
                        lineNumber: 17,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onDayChange('tomorrow'),
                        className: "px-4 py-1.5 text-sm rounded transition-colors ".concat(selectedDay === 'tomorrow' ? 'bg-white text-[#000000] shadow-sm' : 'bg-[#CDC8C2] hover:bg-white/50 text-[#000000]'),
                        children: "Imorgon"
                    }, void 0, false, {
                        fileName: "[project]/components/prototypes/prototype-a/DayToggle.tsx",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/prototypes/prototype-a/DayToggle.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/prototypes/prototype-a/DayToggle.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/prototypes/prototype-a/DayToggle.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = DayToggle;
var _c;
__turbopack_context__.k.register(_c, "DayToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/prototypes/prototype-a/DeviceList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeviceList",
    ()=>DeviceList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$lucide$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function DeviceList(param) {
    let { applianceService, priceData, onSettingsClick, onUpdate } = param;
    _s();
    const [expandedDevices, setExpandedDevices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [expandedSavings, setExpandedSavings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const enabledAppliances = applianceService.getEnabledAppliances();
    if (enabledAppliances.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 py-2 pb-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-normal",
                                children: "Dina enheter"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 26,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onSettingsClick,
                                className: "p-2 hover:bg-[#F2EFEC] rounded transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                    className: "w-6 h-6 text-[#000000]"
                                }, void 0, false, {
                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                    lineNumber: 31,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-8 text-center bg-white rounded",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Lägg till apparater för att se bästa tiderna"
                    }, void 0, false, {
                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    if (priceData.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 py-2 pb-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-normal",
                                children: "Dina enheter"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 47,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onSettingsClick,
                                className: "p-2 hover:bg-[#F2EFEC] rounded transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                    className: "w-6 h-6 text-[#000000]"
                                }, void 0, false, {
                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 grid grid-cols-3 gap-3 items-center border-b border-[#E5E5E5]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-[#000000] opacity-60",
                                    children: "Enhet"
                                }, void 0, false, {
                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-[#000000] opacity-60 text-center",
                                    children: "Billigast tid"
                                }, void 0, false, {
                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-[#000000] opacity-60 text-right",
                                    children: "Besparing"
                                }, void 0, false, {
                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        enabledAppliances.map((appliance)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b border-[#E5E5E5] last:border-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full px-4 py-2 grid grid-cols-3 gap-3 items-center opacity-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-[#000000]",
                                            children: appliance.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                            lineNumber: 65,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-[#000000] opacity-60 text-center",
                                            children: "—"
                                        }, void 0, false, {
                                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                            lineNumber: 66,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-[#000000] text-right",
                                            children: "—"
                                        }, void 0, false, {
                                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this)
                            }, appliance.id, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-4 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-[#000000] opacity-60",
                                children: "Priser för imorgon är inte tillgängliga än"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this);
    }
    let totalSavings = 0;
    const savingsDataMap = new Map();
    const dailyAvgPrice = priceData.reduce((sum, slot)=>sum + slot.price, 0) / priceData.length;
    enabledAppliances.forEach((appliance)=>{
        const savingsData = applianceService.calculateSavings(appliance, dailyAvgPrice, priceData);
        if (savingsData) {
            totalSavings += savingsData.savingsKr;
            savingsDataMap.set(appliance.id, savingsData);
        }
    });
    const toggleDevice = (id)=>{
        setExpandedDevices((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    const getIconComponent = (iconName)=>{
        const IconComponent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$lucide$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[iconName];
        return IconComponent ? IconComponent : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$lucide$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Zap;
    };
    const formatTime = (time)=>{
        return time.toLocaleTimeString('sv-SE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const totalYearly = totalSavings * 365;
    const dailySavings = totalSavings.toFixed(2);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "py-2 pb-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-4xl mx-auto px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-normal",
                            children: "Dina enheter"
                        }, void 0, false, {
                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onSettingsClick,
                            className: "p-2 hover:bg-[#F2EFEC] rounded transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                className: "w-6 h-6 text-[#000000]"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 grid grid-cols-3 gap-3 items-center border-b border-[#E5E5E5]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-[#000000] opacity-60",
                                children: "Enhet"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-[#000000] opacity-60 text-center",
                                children: "Optimal tid"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-[#000000] opacity-60 text-right",
                                children: "Besparing"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    enabledAppliances.map((appliance)=>{
                        const savingsData = savingsDataMap.get(appliance.id);
                        const isExpanded = expandedDevices.has(appliance.id);
                        const Icon = getIconComponent(appliance.icon);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-b border-[#E5E5E5] last:border-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>toggleDevice(appliance.id),
                                    className: "w-full px-4 py-2 grid grid-cols-3 gap-3 items-center hover:bg-[#F2EFEC]/30 transition-colors text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-[#000000] truncate",
                                            children: appliance.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                            lineNumber: 148,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-[#000000] opacity-60 text-center whitespace-nowrap",
                                            children: savingsData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    formatTime(savingsData.bestSlots[0].time),
                                                    "–",
                                                    formatTime(new Date(savingsData.bestSlots[savingsData.bestSlots.length - 1].time.getTime() + 15 * 60000))
                                                ]
                                            }, void 0, true) : '—'
                                        }, void 0, false, {
                                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                            lineNumber: 151,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-end gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-[#000000]",
                                                    children: savingsData ? savingsData.savingsDisplay : '—'
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: "w-3 h-3 text-[#000000] opacity-40 shrink-0 transition-transform ".concat(isExpanded ? 'rotate-180' : '')
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                            lineNumber: 159,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                    lineNumber: 144,
                                    columnNumber: 17
                                }, this),
                                isExpanded && savingsData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-4 pb-2 text-xs text-[#000000] space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "opacity-60",
                                                    children: "Förbrukning"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        appliance.kWh,
                                                        " kWh · ",
                                                        appliance.hours,
                                                        "h"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                            lineNumber: 169,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "opacity-60",
                                                    children: "Snittpris"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        savingsData.bestAvg.toFixed(1),
                                                        " öre/kWh"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                            lineNumber: 173,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                    lineNumber: 168,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, appliance.id, true, {
                            fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                            lineNumber: 143,
                            columnNumber: 13
                        }, this);
                    }),
                    totalSavings > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-[#E5E5E5] mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setExpandedSavings(!expandedSavings),
                                className: "w-full px-4 pt-3 pb-3 flex items-center justify-between hover:bg-[#F2EFEC]/30 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-[#000000]",
                                        children: "Årlig besparing"
                                    }, void 0, false, {
                                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-[#009A33]",
                                                children: [
                                                    totalYearly.toFixed(0),
                                                    " kr"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "w-4 h-4 text-[#000000] opacity-40 transition-transform ".concat(expandedSavings ? 'rotate-180' : '')
                                            }, void 0, false, {
                                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                lineNumber: 192,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this),
                            expandedSavings && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 pb-3 text-xs text-[#000000] space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "opacity-60",
                                                children: "Daglig besparing"
                                            }, void 0, false, {
                                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                lineNumber: 199,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    dailySavings,
                                                    " kr"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                lineNumber: 200,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                        lineNumber: 198,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-1 border-t border-[#E5E5E5]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "opacity-60 mb-1",
                                                children: "Så räknas det ut:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                lineNumber: 203,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: "Jämför snittpris för dagen med bästa tid för varje enhet"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                        lineNumber: 205,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: "Multiplicerar skillnaden med förbrukning (kWh)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: "Summerar alla enheter = daglig besparing"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "pt-1",
                                                        children: [
                                                            dailySavings,
                                                            " kr × 365 dagar = ",
                                                            totalYearly.toFixed(0),
                                                            " kr/år"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                        lineNumber: 208,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                                lineNumber: 204,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                        lineNumber: 202,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                                lineNumber: 197,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/prototypes/prototype-a/DeviceList.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_s(DeviceList, "G3+4Cxx4oNuQrnoz+2xfQaRM7dI=");
_c = DeviceList;
var _c;
__turbopack_context__.k.register(_c, "DeviceList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/prototypes/prototype-a/SettingsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsModal",
    ()=>SettingsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$lucide$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function SettingsModal(param) {
    let { isOpen, onClose, applianceService, onUpdate } = param;
    _s();
    const [expandedSettings, setExpandedSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    if (!isOpen) return null;
    const appliances = applianceService.getAppliances();
    const toggleAppliance = (id)=>{
        applianceService.toggleAppliance(id);
        onUpdate();
    };
    const toggleSettings = (id)=>{
        setExpandedSettings((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    const updateField = (id, field, value)=>{
        applianceService.updateApplianceField(id, field, value);
        onUpdate();
    };
    const updateTimeWindow = (id, field, value)=>{
        applianceService.updateTimeWindow(id, field, value);
        onUpdate();
    };
    const getIconComponent = (iconName)=>{
        const IconComponent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$lucide$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[iconName];
        return IconComponent ? IconComponent : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$lucide$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Zap;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50",
        style: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
        },
        onClick: (e)=>{
            if (e.target === e.currentTarget) {
                onClose();
            }
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-normal",
                            children: "Enheter"
                        }, void 0, false, {
                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 hover:bg-[#F2EFEC] rounded-full transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: appliances.map((app)=>{
                        const isExpanded = expandedSettings.has(app.id);
                        const Icon = getIconComponent(app.icon);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#F2EFEC] rounded",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "w-6 h-6"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm",
                                                    children: app.name
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 85,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>toggleSettings(app.id),
                                                    className: "p-2 hover:bg-[#CDC8C2] rounded transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                        className: "w-5 h-5 text-[#000000]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                        lineNumber: 92,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>toggleAppliance(app.id),
                                                    className: "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ".concat(app.enabled ? 'bg-[#009A33]' : 'bg-[#CDC8C2]'),
                                                    role: "switch",
                                                    "aria-checked": app.enabled,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ".concat(app.enabled ? 'translate-x-5' : 'translate-x-0')
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                            lineNumber: 87,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                    lineNumber: 82,
                                    columnNumber: 17
                                }, this),
                                isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-4 pb-4 space-y-3 border-t border-[#CDC8C2] pt-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs text-[#000000] opacity-75 mb-1 block",
                                                    children: "Förbrukning (kWh)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: app.kWh,
                                                    onChange: (e)=>updateField(app.id, 'kWh', parseFloat(e.target.value)),
                                                    className: "w-full px-3 py-2 bg-white rounded text-sm border border-[#CDC8C2]",
                                                    step: "0.1",
                                                    min: "0"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                            lineNumber: 113,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs text-[#000000] opacity-75 mb-1 block",
                                                    children: "Tid (timmar)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: app.hours,
                                                    onChange: (e)=>updateField(app.id, 'hours', parseFloat(e.target.value)),
                                                    className: "w-full px-3 py-2 bg-white rounded text-sm border border-[#CDC8C2]",
                                                    step: "0.5",
                                                    min: "0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                            lineNumber: 127,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs text-[#000000] opacity-75 mb-1 block",
                                                    children: "Tidsfönster"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            value: app.timeWindow.start,
                                                            onChange: (e)=>updateTimeWindow(app.id, 'start', parseInt(e.target.value)),
                                                            className: "flex-1 px-3 py-2 bg-white rounded text-sm border border-[#CDC8C2]",
                                                            min: "0",
                                                            max: "23",
                                                            placeholder: "Från"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                            lineNumber: 146,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex items-center text-sm",
                                                            children: "–"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            value: app.timeWindow.end,
                                                            onChange: (e)=>updateTimeWindow(app.id, 'end', parseInt(e.target.value)),
                                                            className: "flex-1 px-3 py-2 bg-white rounded text-sm border border-[#CDC8C2]",
                                                            min: "0",
                                                            max: "24",
                                                            placeholder: "Till"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                            lineNumber: 141,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                                    lineNumber: 112,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, app.id, true, {
                            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                            lineNumber: 81,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
            lineNumber: 64,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/prototypes/prototype-a/SettingsModal.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(SettingsModal, "Bkfab6DfX6dQtkbJbLl8iuXAbG8=");
_c = SettingsModal;
var _c;
__turbopack_context__.k.register(_c, "SettingsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/shared/BottomNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BottomNav",
    ()=>BottomNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function BottomNav(param) {
    let { prototypePrefix = '' } = param;
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const navItems = [
        {
            label: 'Hem',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/components/shared/BottomNav.tsx",
                lineNumber: 20,
                columnNumber: 13
            }, this),
            href: prototypePrefix || '/'
        },
        {
            label: 'Insikter',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/components/shared/BottomNav.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            href: "".concat(prototypePrefix, "/insights")
        },
        {
            label: 'Enheter',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/components/shared/BottomNav.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this),
            href: "".concat(prototypePrefix, "/devices")
        },
        {
            label: 'Profil',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/components/shared/BottomNav.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, this),
            href: "".concat(prototypePrefix, "/profile")
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed bottom-0 left-0 right-0 bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-around px-4 py-2 max-w-md mx-auto",
            children: navItems.map((item)=>{
                const isActive = pathname === item.href;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: item.href,
                    className: "flex flex-col items-center gap-1 px-4 py-2 transition-colors ".concat(isActive ? 'text-foreground' : 'text-muted-foreground'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: isActive ? 'text-foreground' : '',
                            children: item.icon
                        }, void 0, false, {
                            fileName: "[project]/components/shared/BottomNav.tsx",
                            lineNumber: 53,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs",
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/components/shared/BottomNav.tsx",
                            lineNumber: 54,
                            columnNumber: 15
                        }, this)
                    ]
                }, item.label, true, {
                    fileName: "[project]/components/shared/BottomNav.tsx",
                    lineNumber: 46,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/components/shared/BottomNav.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/shared/BottomNav.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(BottomNav, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = BottomNav;
var _c;
__turbopack_context__.k.register(_c, "BottomNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/prototypes/prototype-a/DetailView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DetailView",
    ()=>DetailView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/electricity-api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$appliance$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/appliance-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$prototypes$2f$prototype$2d$a$2f$PriceChartGraph$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/prototypes/prototype-a/PriceChartGraph.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$prototypes$2f$prototype$2d$a$2f$DayToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/prototypes/prototype-a/DayToggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$prototypes$2f$prototype$2d$a$2f$DeviceList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/prototypes/prototype-a/DeviceList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$prototypes$2f$prototype$2d$a$2f$SettingsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/prototypes/prototype-a/SettingsModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/BottomNav.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
function DetailView(param) {
    let { prototypeId } = param;
    _s();
    const [prices, setPrices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedDay, setSelectedDay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('today');
    const [isSettingsOpen, setIsSettingsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [updateTrigger, setUpdateTrigger] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const applianceService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DetailView.useMemo[applianceService]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$appliance$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApplianceService"]()
    }["DetailView.useMemo[applianceService]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DetailView.useEffect": ()=>{
            async function loadPrices() {
                try {
                    const { today, tomorrow } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchTodayAndTomorrowPrices"])();
                    const allPrices = [
                        ...today,
                        ...tomorrow
                    ];
                    setPrices(allPrices);
                    setError(null);
                } catch (error) {
                    console.error('Failed to load prices:', error);
                    setError(error instanceof Error ? error.message : 'Failed to load electricity prices');
                } finally{
                    setLoading(false);
                }
            }
            loadPrices();
        }
    }["DetailView.useEffect"], []);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-muted-foreground",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this);
    }
    if (error || prices.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex flex-col items-center justify-center gap-4 p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-muted-foreground text-center",
                    children: error || 'No price data available'
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>window.location.reload(),
                    className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90",
                    children: "Retry"
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/prototype-".concat(prototypeId),
                    className: "text-primary hover:opacity-70",
                    children: "Back to overview"
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this);
    }
    const todayPrices = prices.filter((p)=>{
        const date = new Date(p.time_start);
        const now = new Date();
        return date.getDate() === now.getDate() && date.getMonth() === now.getMonth();
    });
    const tomorrowPrices = prices.filter((p)=>{
        const date = new Date(p.time_start);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth();
    });
    const filteredPrices = selectedDay === 'today' ? todayPrices : tomorrowPrices;
    const priceSlots = applianceService.convertPriceIntervalsToPriceSlots(filteredPrices);
    const currentPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentPriceInterval"])(todayPrices);
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculatePriceStats"])(prices);
    const handleUpdate = ()=>{
        setUpdateTrigger((prev)=>prev + 1);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background pb-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky top-0 z-50 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex items-center justify-center px-4 py-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/prototype-".concat(prototypeId),
                            className: "absolute left-4 hover:opacity-70 transition-opacity",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-base font-semibold",
                            children: "Elpris"
                        }, void 0, false, {
                            fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$prototypes$2f$prototype$2d$a$2f$PriceChartGraph$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriceChartGraph"], {
                        priceData: filteredPrices,
                        selectedDay: selectedDay
                    }, void 0, false, {
                        fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$prototypes$2f$prototype$2d$a$2f$DayToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DayToggle"], {
                        selectedDay: selectedDay,
                        onDayChange: setSelectedDay
                    }, void 0, false, {
                        fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-background",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$prototypes$2f$prototype$2d$a$2f$DeviceList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeviceList"], {
                    applianceService: applianceService,
                    priceData: priceSlots,
                    onSettingsClick: ()=>setIsSettingsOpen(true),
                    onUpdate: handleUpdate
                }, updateTrigger, false, {
                    fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$prototypes$2f$prototype$2d$a$2f$SettingsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsModal"], {
                isOpen: isSettingsOpen,
                onClose: ()=>setIsSettingsOpen(false),
                applianceService: applianceService,
                onUpdate: handleUpdate
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BottomNav"], {
                prototypePrefix: "/prototype-a"
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/prototypes/prototype-a/DetailView.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, this);
}
_s(DetailView, "PmYeVMG8bMYNovf29yF4sFU/iwM=");
_c = DetailView;
var _c;
__turbopack_context__.k.register(_c, "DetailView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_18ecc2f0._.js.map
export const iconOptions = [
  'car', 'washing-machine', 'wind', 'utensils', 'flame', 'spray-can',
  'oven', 'shower-head', 'bath', 'zap', 'lightbulb', 'refrigerator',
  'tv', 'laptop', 'smartphone', 'drill', 'microwave', 'coffee',
  'fan', 'speaker', 'heater', 'snowflake', 'droplet', 'waves',
  'plug', 'battery-charging', 'power', 'gauge'
];

export const presets = [
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

export const emojiToIcon = {
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

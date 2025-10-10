export function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getTomorrowDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
}

export function getCurrentTimeSlot() {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: Math.floor(now.getMinutes() / 15) * 15
  };
}

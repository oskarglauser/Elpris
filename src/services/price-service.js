export class PriceService {
  constructor() {
    this.priceData = [];
  }

  async fetchPriceData(region = 'SE3') {
    const now = new Date();

    const todayYear = now.getFullYear();
    const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
    const todayDay = String(now.getDate()).padStart(2, '0');
    const todayUrl = `https://www.elprisetjustnu.se/api/v1/prices/${todayYear}/${todayMonth}-${todayDay}_${region}.json`;

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowYear = tomorrow.getFullYear();
    const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowUrl = `https://www.elprisetjustnu.se/api/v1/prices/${tomorrowYear}/${tomorrowMonth}-${tomorrowDay}_${region}.json`;

    try {
      const [todayResponse, tomorrowResponse] = await Promise.all([
        fetch(todayUrl),
        fetch(tomorrowUrl).catch(() => null)
      ]);

      const todayData = await todayResponse.json();
      const tomorrowData = tomorrowResponse ? await tomorrowResponse.json().catch(() => []) : [];

      this.priceData = [...todayData, ...tomorrowData].map(item => {
        const time = new Date(item.time_start);
        return {
          ...item,
          price: Math.round(item.SEK_per_kWh * 100),
          hour: time.getHours(),
          minute: time.getMinutes(),
          time: time
        };
      });

      return this.priceData;
    } catch (error) {
      console.error('Error fetching price data:', error);
      return [];
    }
  }

  getPriceData() {
    return this.priceData;
  }

  getFilteredPriceData(selectedDay) {
    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    let filtered = this.priceData.filter(item => {
      const itemDate = new Date(item.time.getFullYear(), item.time.getMonth(), item.time.getDate());
      if (selectedDay === 'today') {
        return itemDate.getTime() === todayDate.getTime();
      } else {
        return itemDate.getTime() === tomorrowDate.getTime();
      }
    });

    if (selectedDay === 'today') {
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      filtered = filtered.filter(item => item.time >= oneHourAgo);
    }

    return filtered;
  }

  getCurrentPrice() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = Math.floor(now.getMinutes() / 15) * 15;

    return this.priceData.find(item =>
      item.hour === currentHour && item.minute === currentMinute
    );
  }

  getAveragePrice() {
    if (this.priceData.length === 0) return 0;
    return this.priceData.reduce((sum, item) => sum + item.price, 0) / this.priceData.length;
  }
}

import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { getCurrentTimeSlot } from '../utils/time-utils.js';

Chart.register(annotationPlugin);

export function createPriceChart() {
  const container = document.createElement('div');
  container.className = 'py-4 bg-white';

  const chartContainer = document.createElement('div');
  chartContainer.id = 'chartContainer';
  chartContainer.className = 'relative h-[250px] sm:h-[240px] md:h-[280px]';

  const canvas = document.createElement('canvas');
  canvas.id = 'priceChart';

  chartContainer.appendChild(canvas);

  const noDataMessage = document.createElement('div');
  noDataMessage.className = 'hidden p-8 text-center';
  const noDataText = document.createElement('p');
  noDataText.className = 'text-el-gray-dark';
  noDataText.textContent = 'Priser för imorgon är inte tillgängliga än';
  noDataMessage.appendChild(noDataText);

  container.appendChild(chartContainer);
  container.appendChild(noDataMessage);

  let chart = null;

  const update = (filteredData, selectedDay) => {
    if (filteredData.length === 0) {
      if (chart) {
        chart.destroy();
        chart = null;
      }
      chartContainer.classList.add('hidden');
      noDataMessage.classList.remove('hidden');
      return;
    }

    chartContainer.classList.remove('hidden');
    noDataMessage.classList.add('hidden');

    const labels = filteredData.map(item => {
      const h = String(item.hour).padStart(2, '0');
      const m = String(item.minute).padStart(2, '0');
      return `${h}:${m}`;
    });

    const prices = filteredData.map(item => item.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    const currentTime = getCurrentTimeSlot();
    const currentIndex = selectedDay === 'today' ? filteredData.findIndex(item =>
      item.hour === currentTime.hour && item.minute === currentTime.minute
    ) : -1;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minIndex = prices.indexOf(minPrice);
    const maxIndex = prices.indexOf(maxPrice);

    const transitions = [];
    for (let i = 1; i < prices.length; i++) {
      const prevPrice = prices[i - 1];
      const currPrice = prices[i];
      const prevCategory = prevPrice < avgPrice * 0.85 ? 'green' : prevPrice >= avgPrice * 1.15 ? 'red' : 'yellow';
      const currCategory = currPrice < avgPrice * 0.85 ? 'green' : currPrice >= avgPrice * 1.15 ? 'red' : 'yellow';

      if ((prevCategory === 'green' || prevCategory === 'yellow') && currCategory === 'red') {
        transitions.push({ index: i, type: 'expensive', time: labels[i] });
      }
      if ((prevCategory === 'red' || prevCategory === 'yellow') && currCategory === 'green') {
        transitions.push({ index: i, type: 'cheap', time: labels[i] });
      }
    }

    if (chart) {
      chart.destroy();
    }

    const chartHeight = canvas.height || 250;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
    gradient.addColorStop(0, 'rgba(215, 51, 51, 0.1)');
    gradient.addColorStop(0.35, 'rgba(255, 193, 7, 0.1)');
    gradient.addColorStop(0.7, 'rgba(0, 154, 51, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 154, 51, 0.05)');

    chart = new Chart(canvas, {
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
              color: '#000000',
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
              color: '#000000',
              maxRotation: 0,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: window.innerWidth < 640 ? 6 : 12,
              padding: 8,
              callback: function(value, index) {
                const label = this.getLabelForValue(value);
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
  };

  return {
    element: container,
    update,
    destroy: () => {
      if (chart) {
        chart.destroy();
      }
    }
  };
}

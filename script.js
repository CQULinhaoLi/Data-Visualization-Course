document.addEventListener('DOMContentLoaded', async () => {
  // 加载数据
  const data = await fetchData();
  let sortedData = sortData(data, 'gold');
  
  // 初始化图表
  const barCtx = document.getElementById('barChart').getContext('2d');
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  const radarCtx = document.getElementById('radarChart').getContext('2d');
  
  // 创建图表实例
  const barChart = createBarChart(barCtx, sortedData);
  const pieChart = createPieChart(pieCtx, sortedData);
  const radarChart = createRadarChart(radarCtx, sortedData);
  
  // 事件监听
  document.getElementById('sortSelect').addEventListener('change', (e) => {
      sortedData = sortData(data, e.target.value);
      updateCharts(barChart, pieChart, radarChart, sortedData);
  });
});

// async function fetchData() {
//   const response = await fetch('medal_countries.csv');
//   const csv = await response.text();
//   return parseCSV(csv);
// }


async function fetchData() {
  showLoader();
  try {
    const response = await fetch('medal_countries.csv');
    const csv = await response.text();
    return parseCSV(csv);
  } finally {
    hideLoader();
  }
}

function showLoader() {
  const loader = `<div class="loader">🌍 加载数据中...</div>`;
  document.body.insertAdjacentHTML('afterbegin', loader);
}

function hideLoader() {
  document.querySelector('.loader').remove();
}




function parseCSV(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
          code: values[0],
          country: values[1],
          gold: parseInt(values[2]),
          silver: parseInt(values[3]),
          bronze: parseInt(values[4]),
          total: parseInt(values[2]) + parseInt(values[3]) + parseInt(values[4])
      };
  });
}

function sortData(data, key) {
  return [...data].sort((a, b) => b[key] - a[key]);
}

function createBarChart(ctx, data) {
  return new Chart(ctx, {
      type: 'bar',
      data: getBarData(data),
      options: {
          responsive: true,
          plugins: {
              legend: { position: 'top' }
          }
      }
  });
}

function createPieChart(ctx, data) {
  return new Chart(ctx, {
      type: 'pie',
      data: getPieData(data),
      options: {
          responsive: true,
          plugins: {
              legend: { position: 'right' }
          }
      }
  });
}

function createRadarChart(ctx, data) {
  return new Chart(ctx, {
      type: 'radar',
      data: getRadarData(data),
      options: {
          responsive: true,
          elements: {
              line: { tension: 0.3 }
          }
      }
  });
}

function getBarData(data) {
  return {
      labels: data.map(d => d.country),
      datasets: [{
          label: '金牌',
          data: data.map(d => d.gold),
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
          borderRadius: 8,          // 圆角柱状图
          borderSkipped: false,     // 完整圆角
          categoryPercentage: 0.8,  // 调整柱宽
      }, {
          label: '银牌',
          data: data.map(d => d.silver),
          backgroundColor: 'rgba(192, 192, 192, 0.7)',
          borderRadius: 8,          // 圆角柱状图
          borderSkipped: false,     // 完整圆角
          categoryPercentage: 0.8,  // 调整柱宽
      }, {
          label: '铜牌',
          data: data.map(d => d.bronze),
          backgroundColor: 'rgba(205, 127, 50, 0.7)',
          borderRadius: 8,          // 圆角柱状图
          borderSkipped: false,     // 完整圆角
          categoryPercentage: 0.8,  // 调整柱宽
      }, ]
  };
}
 
function getPieData(data) {
  return {
      labels: data.map(d => d.country),
      datasets: [{
          data: data.map(d => d.total),
          backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', 
              '#4BC0C0', '#9966FF', '#FF9F40'
          ]
      }]
  };
}

function getRadarData(data) {
  return {
      labels: ['金牌', '银牌', '铜牌'],
      datasets: data.slice(0, 5).map(country => ({
          label: country.country,
          data: [country.gold, country.silver, country.bronze],
          backgroundColor: `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.2)`
      }))
  };
}

function updateCharts(barChart, pieChart, radarChart, newData) {
  // 先执行淡出动画
  barChart.options.animation.duration = 500;
  barChart.data = getBarData(newData);
  barChart.update();
  
  // 使用交错的动画时间
  setTimeout(() => {
    pieChart.data = getPieData(newData);
    pieChart.update();
  }, 200);
  
  setTimeout(() => {
    radarChart.data = getRadarData(newData);
    radarChart.update();
  }, 400);
  // barChart.data = getBarData(newData);
  // pieChart.data = getPieData(newData);
  // radarChart.data = getRadarData(newData);
  
  // barChart.update();
  // pieChart.update();
  // radarChart.update();
}
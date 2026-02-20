/* HVAC Super Dashboard Enhancements - super.js
   Director Comparison, Trends, and Ultra-Interactivity
   🚀 THE ULTIMATE DASHBOARD ENGINE 🚀
*/

// ══════════════════════════════════════════════════════════════════════
// DIRECTOR COMPARISON STATE
// ══════════════════════════════════════════════════════════════════════
const SuperState = {
  directors: [],
  directorMetrics: {},
  historicalTnt: [],
  directorTrends: {},
  trendMonths: [],
  woCategories: {},
  milestones: [],
  selectedDirector: '15B',
  comparisonMode: false,
  compareWith: [],
};

let trendsChart = null;
let directorCompareChart = null;
let improvementChart = null;

// ══════════════════════════════════════════════════════════════════════
// INITIALIZE SUPER FEATURES
// ══════════════════════════════════════════════════════════════════════
function initSuperDashboard(data) {
  SuperState.directors = data.directors || [];
  SuperState.directorMetrics = data.director_metrics || {};
  SuperState.historicalTnt = data.historical_tnt || [];
  SuperState.directorTrends = data.director_trends || {};
  SuperState.trendMonths = data.trend_months || [];
  SuperState.woCategories = data.wo_categories || {};
  SuperState.milestones = data.milestones || [];
  SuperState.stores = data.stores || [];
  SuperState.ahuRtu = data.ahu_rtu || [];
  
  populateDirectorDropdown();
  renderRegionalManagersGrid();
  renderTrendsSection();
  renderDirectorComparison();
  renderMilestones();
  enhanceClickability();
  console.log('🚀 Super Dashboard initialized!');
}

// ══════════════════════════════════════════════════════════════════════
// DIRECTOR DROPDOWN & COMPARISON
// ══════════════════════════════════════════════════════════════════════
function populateDirectorDropdown() {
  const container = document.getElementById('directorSelector');
  if (!container) return;
  
  let html = `
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <label class="text-sm font-semibold text-gray-600">Director:</label>
        <select id="directorDropdown" onchange="changeDirector(this.value)" 
                class="px-4 py-2 border-2 border-blue-200 rounded-lg font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer">
  `;
  
  SuperState.directors.forEach(d => {
    const selected = d.is_current ? 'selected' : '';
    const badge = d.is_current ? ' ⭐ (You)' : '';
    html += `<option value="${d.id}" ${selected}>${d.id} - ${d.name}${badge}</option>`;
  });
  
  html += `
        </select>
      </div>
      <button onclick="toggleComparisonMode()" id="compareBtn"
              class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg">
        📊 Compare Directors
      </button>
    </div>
  `;
  
  container.innerHTML = html;
}

function changeDirector(directorId) {
  SuperState.selectedDirector = directorId;
  renderDirectorComparison();
  showToast(`📊 Viewing ${getDirectorName(directorId)}'s data`);
}

function getDirectorName(id) {
  const d = SuperState.directors.find(d => d.id === id);
  return d ? d.name : id;
}

// ══════════════════════════════════════════════════════════════════════
// YOUR REGIONAL MANAGERS
// ══════════════════════════════════════════════════════════════════════
function renderRegionalManagersGrid() {
  const container = document.getElementById('regionalManagersGrid');
  if (!container) return;
  
  // Calculate stats for each Regional Manager from store data
  const managers = ['ERIC GRAY', 'JASON MCALESTER', 'DAVID GUESS', 'DANE CLAYTON'];
  
  let html = '';
  managers.forEach(mgr => {
    const mgrStores = SuperState.stores.filter(s => s.mgr === mgr);
    const withTnT = mgrStores.filter(s => s.tit != null);
    const avgTnT = withTnT.length ? (withTnT.reduce((a, s) => a + s.tit, 0) / withTnT.length).toFixed(1) : 'N/A';
    const wos = SuperState.ahuRtu.filter(w => w.mgr === mgr);
    const aged = wos.filter(w => w.age_days > 14).length;
    
    const tntColor = parseFloat(avgTnT) >= 93 ? '#2a8703' : parseFloat(avgTnT) >= 90 ? '#f59e0b' : '#ea1100';
    const agedColor = aged === 0 ? '#2a8703' : aged <= 2 ? '#f59e0b' : '#ea1100';
    
    html += `
      <div class="bg-white rounded-xl p-4 border-2 border-blue-100 hover:border-blue-400 transition-all cursor-pointer shadow-sm hover:shadow-lg"
           onclick="filterByManager('${mgr}')">
        <div class="font-bold text-blue-800 mb-2">${mgr}</div>
        <div class="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div class="text-lg font-bold text-gray-700">${mgrStores.length}</div>
            <div class="text-xs text-gray-500">Stores</div>
          </div>
          <div>
            <div class="text-lg font-bold" style="color: ${tntColor}">${avgTnT}%</div>
            <div class="text-xs text-gray-500">TnT</div>
          </div>
          <div>
            <div class="text-lg font-bold" style="color: ${agedColor}">${aged}</div>
            <div class="text-xs text-gray-500">Aged WOs</div>
          </div>
        </div>
        <div class="mt-2 text-xs text-blue-600 text-center">→ Click to filter</div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function toggleComparisonMode() {
  SuperState.comparisonMode = !SuperState.comparisonMode;
  const btn = document.getElementById('compareBtn');
  if (SuperState.comparisonMode) {
    btn.classList.add('ring-4', 'ring-purple-300');
    btn.innerHTML = '✓ Comparison Mode ON';
    showDirectorComparisonPanel();
  } else {
    btn.classList.remove('ring-4', 'ring-purple-300');
    btn.innerHTML = '📊 Compare Directors';
    hideDirectorComparisonPanel();
  }
}

function showDirectorComparisonPanel() {
  const panel = document.getElementById('comparisonPanel');
  if (panel) panel.classList.remove('hidden');
}

function hideDirectorComparisonPanel() {
  const panel = document.getElementById('comparisonPanel');
  if (panel) panel.classList.add('hidden');
}

// ══════════════════════════════════════════════════════════════════════
// DIRECTOR COMPARISON CHART
// ══════════════════════════════════════════════════════════════════════
function renderDirectorComparison() {
  const container = document.getElementById('directorComparisonChart');
  if (!container) return;
  
  // Get all directors sorted by TnT
  const directors = SuperState.directors.map(d => ({
    ...d,
    ...SuperState.directorMetrics[d.id]
  })).sort((a, b) => b.tnt_avg - a.tnt_avg);
  
  // Build comparison table
  let tableHtml = `
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <th class="p-3 text-left font-bold text-gray-700">Rank</th>
            <th class="p-3 text-left font-bold text-gray-700">Director</th>
            <th class="p-3 text-left font-bold text-gray-700">Region</th>
            <th class="p-3 text-center font-bold text-gray-700">Stores</th>
            <th class="p-3 text-center font-bold text-gray-700">TnT %</th>
            <th class="p-3 text-center font-bold text-gray-700">Open WOs</th>
            <th class="p-3 text-center font-bold text-gray-700">Aged 14+</th>
            <th class="p-3 text-center font-bold text-gray-700">Trend</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  directors.forEach((d, i) => {
    const isYou = d.is_current;
    const rowClass = isYou ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400' : 'hover:bg-gray-50';
    const rankIcon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
    const tntColor = d.tnt_avg >= 92 ? '#2a8703' : d.tnt_avg >= 90 ? '#f59e0b' : '#ea1100';
    const trend = getTrendArrow(d.id);
    
    tableHtml += `
      <tr class="${rowClass} cursor-pointer transition-all" onclick="selectDirectorForDetail('${d.id}')">
        <td class="p-3 font-bold text-lg">${rankIcon}</td>
        <td class="p-3">
          <div class="font-semibold ${isYou ? 'text-amber-700' : 'text-gray-800'}">${d.name}</div>
          <div class="text-xs text-gray-500">Sr: ${d.sr_director}</div>
        </td>
        <td class="p-3 font-mono font-bold" style="color: #0053e2">${d.id}</td>
        <td class="p-3 text-center font-semibold">${d.stores}</td>
        <td class="p-3 text-center">
          <span class="px-3 py-1 rounded-full font-bold text-white" style="background: ${tntColor}">
            ${d.tnt_avg}%
          </span>
        </td>
        <td class="p-3 text-center font-semibold">${d.wos_open || '-'}</td>
        <td class="p-3 text-center">
          <span class="px-2 py-1 rounded ${d.wos_aged > 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} font-bold">
            ${d.wos_aged || 0}
          </span>
        </td>
        <td class="p-3 text-center text-xl">${trend}</td>
      </tr>
    `;
  });
  
  tableHtml += '</tbody></table></div>';
  
  document.getElementById('directorTable').innerHTML = tableHtml;
  
  // Render bar chart
  renderDirectorBarChart(directors);
}

function getTrendArrow(directorId) {
  const trends = SuperState.directorTrends[directorId];
  if (!trends || trends.length < 2) return '➖';
  const diff = trends[trends.length - 1] - trends[trends.length - 2];
  if (diff > 0.5) return '📈';
  if (diff < -0.5) return '📉';
  return '➡️';
}

function renderDirectorBarChart(directors) {
  const canvas = document.getElementById('directorBarChart');
  if (!canvas) return;
  
  if (directorCompareChart) directorCompareChart.destroy();
  
  const colors = directors.map(d => d.is_current ? '#ffc220' : '#0053e2');
  const borderColors = directors.map(d => d.is_current ? '#f59e0b' : '#001f5c');
  
  directorCompareChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: directors.map(d => d.id),
      datasets: [{
        label: 'TnT Average %',
        data: directors.map(d => d.tnt_avg),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = directors[ctx.dataIndex];
              return [`TnT: ${d.tnt_avg}%`, `WOs: ${d.wos_open}`, `Aged: ${d.wos_aged}`];
            }
          }
        }
      },
      scales: {
        y: { 
          beginAtZero: false, 
          min: 85,
          max: 95,
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

function selectDirectorForDetail(directorId) {
  SuperState.selectedDirector = directorId;
  document.getElementById('directorDropdown').value = directorId;
  renderDirectorTrendChart();
  showToast(`📊 Selected ${getDirectorName(directorId)}`);
}

// ══════════════════════════════════════════════════════════════════════
// MONTH-OVER-MONTH TRENDS
// ══════════════════════════════════════════════════════════════════════
function renderTrendsSection() {
  renderImprovementChart();
  renderDirectorTrendChart();
}

function renderImprovementChart() {
  const canvas = document.getElementById('improvementChart');
  if (!canvas) return;
  
  if (improvementChart) improvementChart.destroy();
  
  const data = SuperState.historicalTnt;
  
  improvementChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map(d => d.month),
      datasets: [
        {
          label: 'TnT %',
          data: data.map(d => d.tnt),
          borderColor: '#2a8703',
          backgroundColor: 'rgba(42, 135, 3, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#2a8703',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          yAxisID: 'y',
        },
        {
          label: 'Open WOs',
          data: data.map(d => d.wos),
          borderColor: '#ea1100',
          backgroundColor: 'rgba(234, 17, 0, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#ea1100',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            afterBody: (ctx) => {
              const idx = ctx[0].dataIndex;
              const d = data[idx];
              const prevTnt = idx > 0 ? data[idx - 1].tnt : d.tnt;
              const change = (d.tnt - prevTnt).toFixed(1);
              return change > 0 ? `📈 +${change}% improvement` : '';
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'TnT %', color: '#2a8703' },
          min: 85,
          max: 95,
          grid: { color: 'rgba(42, 135, 3, 0.1)' }
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Open WOs', color: '#ea1100' },
          min: 40,
          max: 80,
          grid: { display: false }
        }
      }
    }
  });
}

function renderDirectorTrendChart() {
  const canvas = document.getElementById('directorTrendChart');
  if (!canvas) return;
  
  if (trendsChart) trendsChart.destroy();
  
  const colors = [
    '#0053e2', '#ffc220', '#2a8703', '#ea1100', 
    '#7c3aed', '#06b6d4', '#f59e0b', '#ec4899'
  ];
  
  const datasets = Object.keys(SuperState.directorTrends).map((id, i) => {
    const director = SuperState.directors.find(d => d.id === id);
    const isCurrent = director?.is_current;
    return {
      label: id,
      data: SuperState.directorTrends[id],
      borderColor: isCurrent ? '#ffc220' : colors[i % colors.length],
      backgroundColor: 'transparent',
      borderWidth: isCurrent ? 4 : 2,
      tension: 0.4,
      pointRadius: isCurrent ? 6 : 3,
    };
  });
  
  trendsChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: SuperState.trendMonths,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { mode: 'index' }
      },
      scales: {
        y: { min: 82, max: 95, grid: { color: 'rgba(0,0,0,0.05)' } }
      }
    }
  });
}

// ══════════════════════════════════════════════════════════════════════
// MILESTONES & ACHIEVEMENTS
// ══════════════════════════════════════════════════════════════════════
function renderMilestones() {
  const container = document.getElementById('milestonesContainer');
  if (!container) return;
  
  const icons = {
    success: '✅',
    milestone: '🎯',
    achievement: '🏆'
  };
  
  const colors = {
    success: 'border-green-400 bg-green-50',
    milestone: 'border-blue-400 bg-blue-50',
    achievement: 'border-yellow-400 bg-yellow-50'
  };
  
  let html = '<div class="flex flex-wrap gap-3">';
  SuperState.milestones.forEach(m => {
    html += `
      <div class="flex items-center gap-2 px-4 py-2 rounded-full border-2 ${colors[m.type]} cursor-pointer hover:scale-105 transition-transform">
        <span class="text-xl">${icons[m.type]}</span>
        <div>
          <div class="font-semibold text-sm">${m.event}</div>
          <div class="text-xs text-gray-500">${m.date}</div>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// ENHANCED CLICKABILITY - WO LINKS
// ══════════════════════════════════════════════════════════════════════
function enhanceClickability() {
  // Add click handlers to all KPI cards
  document.querySelectorAll('.kpi-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.classList.add('hover:ring-4', 'hover:ring-blue-200', 'transition-all');
  });
}

function openServiceChannel(trackingNumber) {
  window.open(`https://servicechannel.com/sc/wo/details/${trackingNumber}`, '_blank');
}

function openServiceChannelStore(storeNumber) {
  window.open(`https://servicechannel.com/sc/locations/${storeNumber}/workorders`, '_blank');
}

function copyAndOpenWO(trackingNumber) {
  navigator.clipboard.writeText(trackingNumber);
  openServiceChannel(trackingNumber);
  showToast(`📋 Copied WO# ${trackingNumber} & opening ServiceChannel`);
}

// ══════════════════════════════════════════════════════════════════════
// EXPORT FUNCTIONS
// ══════════════════════════════════════════════════════════════════════
function exportDirectorReport() {
  const data = SuperState.directors.map(d => ({
    ...d,
    ...SuperState.directorMetrics[d.id]
  }));
  
  let csv = 'Region,Director,Sr Director,Stores,TnT %,Open WOs,Aged 14+,Comm Loss,Rank\n';
  data.forEach(d => {
    csv += `${d.id},${d.name},${d.sr_director},${d.stores},${d.tnt_avg},${d.wos_open},${d.wos_aged},${d.comm_loss},${d.rank}\n`;
  });
  
  downloadCSV(csv, 'director_comparison.csv');
  showToast('📊 Director report exported!');
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

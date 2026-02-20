/* HVAC Win-the-Winter Command Center - app.js
   The ULTIMATE dashboard JS engine
   Auto-refreshes every 5 minutes with live data
*/

// ══════════════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════════════
const S = {
  stores: [],
  ahuRtu: [],
  commLoss: [],
  leakSummary: [],
  wtwStatus: [],
  projects: [],
  fsManagers: {},
  lastRefresh: null,
  config: {},
  activeTab: 'executive',
  filterManager: '',
  filterType: '',
  filterFSM: '',
  searchQuery: '',
  mapLayer: 'tit',
  refreshInterval: 300,
  countdownSeconds: 300,
  drillDownManager: null,
  drillDownFSM: null,
  // Map filter state
  mapFilters: {
    equip: '',
    age: '',
    mgr: '',
    problem: '',
    status: '',
    tnt: '',
    storeType: '',
    hasWO: '',
    sub: ''
  },
  filteredMapWOs: []
};

let map = null;
let markerLayer = null;
let charts = {};

// ══════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  initMap();
  initCharts();
  populateFilters();
  renderAll();
  startCountdown();
  updateFooterTime();
  setInterval(updateFooterTime, 1000);
});

async function loadData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    S.stores = data.stores || [];
    S.ahuRtu = data.ahu_rtu || [];
    S.commLoss = data.comm_loss || [];
    S.leakSummary = data.leak_summary || [];
    S.projects = data.projects || [];
    S.fsManagers = data.fs_managers || {};
    S.wtwStatus = data.wtw_status || [];
    S.wtwPhases = data.wtw_phases || {};
    S.lastRefresh = data.last_refresh;
    S.config = data.config || {};
    S.refreshInterval = data.config?.refresh_interval || 300;
    updateLastRefresh();
    updateBadges();
    
    // Initialize Super Dashboard features
    if (typeof initSuperDashboard === 'function') {
      initSuperDashboard(data);
    }
    
    console.log('✅ Data loaded:', S.stores.length, 'stores,', S.wtwStatus.length, 'WTW stores');
  } catch (e) {
    console.error('Failed to load data:', e);
    showToast('⚠️ Failed to load data', 'error');
  }
}

async function manualRefresh() {
  showToast('🔄 Refreshing data...');
  try {
    await fetch('/api/refresh', { method: 'POST' });
    await loadData();
    renderAll();
    S.countdownSeconds = S.refreshInterval;
    showToast('✅ Data refreshed!');
  } catch (e) {
    showToast('⚠️ Refresh failed', 'error');
  }
}

function startCountdown() {
  setInterval(() => {
    S.countdownSeconds--;
    if (S.countdownSeconds <= 0) {
      S.countdownSeconds = S.refreshInterval;
      loadData().then(renderAll);
    }
    updateCountdownUI();
  }, 1000);
}

function updateCountdownUI() {
  const mins = Math.floor(S.countdownSeconds / 60);
  const secs = S.countdownSeconds % 60;
  document.getElementById('countdown').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  const ring = document.getElementById('countdownRing');
  const pct = S.countdownSeconds / S.refreshInterval;
  ring.style.strokeDashoffset = 107 * (1 - pct);
}

function updateLastRefresh() {
  const el = document.getElementById('lastRefresh');
  if (S.lastRefresh) {
    const d = new Date(S.lastRefresh);
    el.textContent = `Updated: ${d.toLocaleTimeString()}`;
  }
}

function updateFooterTime() {
  document.getElementById('footerTime').textContent = new Date().toLocaleString();
}

function updateBadges() {
  document.getElementById('ahuBadge').textContent = S.ahuRtu.length;
  document.getElementById('commBadge').textContent = S.commLoss.length;
  document.getElementById('leakBadge').textContent = S.leakSummary.length;
  document.getElementById('wtwBadge').textContent = S.wtwStatus.length;
  document.getElementById('projBadge').textContent = S.projects.length;
  document.getElementById('samsBadge').textContent = S.stores.filter(s => s.store_type === 'Sams').length;
}

// ══════════════════════════════════════════════════════════════════════
// FILTERS
// ══════════════════════════════════════════════════════════════════════
function populateFilters() {
  const managers = [...new Set(S.stores.map(s => s.mgr).filter(Boolean))].sort();
  const sel = document.getElementById('filterManager');
  managers.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = m;
    sel.appendChild(opt);
  });
}

function applyFilters() {
  S.filterManager = document.getElementById('filterManager').value;
  S.filterType = document.getElementById('filterType').value;
  S.searchQuery = document.getElementById('searchInput').value.toLowerCase();
  renderAll();
}

function getFilteredStores() {
  return S.stores.filter(s => {
    if (S.filterManager && s.mgr !== S.filterManager) return false;
    if (S.filterType && s.store_type !== S.filterType) return false;
    if (S.searchQuery) {
      const txt = `${s.store} ${s.city} ${s.mgr} ${s.sub}`.toLowerCase();
      if (!txt.includes(S.searchQuery)) return false;
    }
    return true;
  });
}

function getFilteredAhuRtu() {
  return S.ahuRtu.filter(w => {
    if (S.filterManager && w.mgr !== S.filterManager) return false;
    if (S.searchQuery) {
      const txt = `${w.store} ${w.city} ${w.problem} ${w.equipment}`.toLowerCase();
      if (!txt.includes(S.searchQuery)) return false;
    }
    return true;
  });
}

// ══════════════════════════════════════════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════════════════════════════════════════
function switchTab(tab, btn) {
  S.activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('[id^="tab-"]').forEach(t => t.classList.add('hidden'));
  document.getElementById('tab-' + tab).classList.remove('hidden');
  renderActiveTab();
  if (tab === 'heatmap' && map) setTimeout(() => map.invalidateSize(), 100);
}

function renderActiveTab() {
  switch (S.activeTab) {
    case 'executive': renderExecutive(); break;
    case 'heatmap': renderMap(); break;
    case 'ahurtu': renderAhuRtu(); break;
    case 'commloss': renderCommLoss(); break;
    case 'leaks': renderLeaks(); break;
    case 'wtw': renderWtW(); break;
    case 'projects': renderProjects(); break;
    case 'sams': renderSams(); break;
    case 'directors': renderDirectorsTab(); break;
    case 'trends': renderTrendsTab(); break;
  }
}

// Super Dashboard tab renderers
function renderDirectorsTab() {
  if (typeof renderDirectorComparison === 'function') {
    renderDirectorComparison();
  }
}

function renderTrendsTab() {
  if (typeof renderTrendsSection === 'function') {
    renderTrendsSection();
  }
}

function renderAll() {
  renderActiveTab();
  updateBadges();
}

// ══════════════════════════════════════════════════════════════════════
// EXECUTIVE TAB
// ══════════════════════════════════════════════════════════════════════
function renderExecutive() {
  const stores = getFilteredStores();
  const storesWithTnT = stores.filter(s => s.tit != null);
  const avgTnT = storesWithTnT.length ? (storesWithTnT.reduce((a, s) => a + s.tit, 0) / storesWithTnT.length).toFixed(1) : 'N/A';
  const below85 = storesWithTnT.filter(s => s.tit < 85).length;
  const above95 = storesWithTnT.filter(s => s.tit >= 95).length;
  const ahuRtu = getFilteredAhuRtu();
  const aged14 = ahuRtu.filter(w => w.age_days > 14).length;
  const sams = stores.filter(s => s.store_type === 'Sams');
  
  // KPIs
  const kpis = [
    { icon: '🏢', label: 'Total Stores', value: stores.length, color: '#0053e2' },
    { icon: '📊', label: 'TnT Avg', value: avgTnT + '%', color: parseFloat(avgTnT) >= 90 ? '#2a8703' : '#f59e0b' },
    { icon: '✅', label: '≥95% TnT', value: above95, color: '#2a8703' },
    { icon: '⚠️', label: '<85% TnT', value: below85, color: below85 > 10 ? '#ea1100' : '#f59e0b' },
    { icon: '❄️', label: 'AHU/RTU WOs', value: ahuRtu.length, color: '#7c3aed' },
    { icon: '⏰', label: 'Aged 14+', value: aged14, color: aged14 > 5 ? '#ea1100' : '#2a8703' },
    { icon: '📡', label: 'Comm Loss', value: S.commLoss.length, color: S.commLoss.length > 10 ? '#ea1100' : '#f59e0b' },
    { icon: '🛒', label: "Sam's Clubs", value: sams.length, color: '#4f46e5' }
  ];
  
  document.getElementById('kpiRow').innerHTML = kpis.map(k => `
    <div class="card kpi-card p-4 text-center" style="border-top: 3px solid ${k.color}">
      <div class="text-2xl mb-1">${k.icon}</div>
      <div class="text-2xl font-bold" style="color: ${k.color}">${k.value}</div>
      <div class="text-xs text-gray-500 mt-1">${k.label}</div>
    </div>
  `).join('');
  
  // Critical Items
  const critical = [];
  const lowStores = storesWithTnT.filter(s => s.tit < 80).sort((a, b) => a.tit - b.tit).slice(0, 5);
  if (lowStores.length) critical.push(`🔴 <strong>${lowStores.length} stores below 80% TnT:</strong> ${lowStores.map(s => '#' + s.store).join(', ')}`);
  const agedWOs = ahuRtu.filter(w => w.age_days > 30).sort((a, b) => b.age_days - a.age_days).slice(0, 3);
  if (agedWOs.length) critical.push(`⏰ <strong>${agedWOs.length} WOs aged 30+ days:</strong> Store ${agedWOs.map(w => '#' + w.store + ' (' + w.age_days + 'd)').join(', ')}`);
  if (S.commLoss.length > 5) critical.push(`📡 <strong>${S.commLoss.length} controllers offline</strong> - needs immediate attention`);
  if (!critical.length) critical.push('✅ No critical issues - great job!');
  document.getElementById('criticalItems').innerHTML = critical.map(c => `<div>${c}</div>`).join('');
  
  // Wins
  const wins = [];
  const topStores = storesWithTnT.filter(s => s.tit >= 95).sort((a, b) => b.tit - a.tit).slice(0, 5);
  if (topStores.length) wins.push(`🏆 <strong>${topStores.length} stores at ≥95% TnT:</strong> ${topStores.slice(0, 3).map(s => '#' + s.store + ' (' + s.tit.toFixed(1) + '%)').join(', ')}`);
  const cleanMgrs = [...new Set(stores.map(s => s.mgr))].filter(m => ahuRtu.filter(w => w.mgr === m && w.age_days > 14).length === 0);
  if (cleanMgrs.length) wins.push(`⭐ <strong>No aged WOs:</strong> ${cleanMgrs.join(', ')}`);
  if (sams.filter(s => s.tit >= 90).length) wins.push(`🛒 <strong>${sams.filter(s => s.tit >= 90).length} Sam's Clubs</strong> at ≥90% TnT`);
  if (!wins.length) wins.push('Keep pushing for excellence!');
  document.getElementById('winItems').innerHTML = wins.map(w => `<div class="text-green-800">${w}</div>`).join('');
  
  // Scorecard
  renderScorecard(stores, ahuRtu);
  updateCharts(stores, ahuRtu);
}

function renderScorecard(stores, ahuRtu) {
  const managers = [...new Set(stores.map(s => s.mgr).filter(Boolean))];
  const rows = managers.map(mgr => {
    const mgrStores = stores.filter(s => s.mgr === mgr);
    const withTnT = mgrStores.filter(s => s.tit != null);
    const avgTnT = withTnT.length ? (withTnT.reduce((a, s) => a + s.tit, 0) / withTnT.length).toFixed(1) : 'N/A';
    const wos = ahuRtu.filter(w => w.mgr === mgr);
    const aged = wos.filter(w => w.age_days > 14).length;
    const sams = mgrStores.filter(s => s.store_type === 'Sams').length;
    return { mgr, stores: mgrStores.length, avgTnT: parseFloat(avgTnT) || 0, wos: wos.length, aged, sams };
  }).sort((a, b) => b.avgTnT - a.avgTnT);
  
  let html = `<thead><tr>
    <th>Rank</th><th>Manager</th><th>Stores</th><th>Sam's</th><th>TnT Avg</th><th>WOs</th><th>Aged 14+</th><th>Status</th>
  </tr></thead><tbody>`;
  
  rows.forEach((r, i) => {
    const tntColor = r.avgTnT >= 92 ? '#2a8703' : r.avgTnT >= 88 ? '#f59e0b' : '#ea1100';
    const agedColor = r.aged === 0 ? '#2a8703' : r.aged <= 2 ? '#f59e0b' : '#ea1100';
    const status = r.avgTnT >= 92 && r.aged <= 2 ? '✅ Excellent' : r.avgTnT >= 88 ? '🟡 Good' : '⚠️ Focus';
    html += `<tr class="clickable hover:bg-blue-50" onclick="drillDownManager('${r.mgr}')">
      <td class="font-bold text-gray-400">#${i + 1}</td>
      <td class="font-semibold cursor-pointer" style="color: #0053e2">
        <span class="hover:underline">${r.mgr}</span>
        <span class="text-xs text-gray-400 ml-2">→ Click to drill down</span>
      </td>
      <td>${r.stores}</td>
      <td class="text-indigo-600 font-medium">${r.sams}</td>
      <td class="font-bold" style="color: ${tntColor}">${r.avgTnT}%</td>
      <td>${r.wos}</td>
      <td class="font-bold" style="color: ${agedColor}">${r.aged}</td>
      <td>${status}</td>
    </tr>`;
  });
  html += '</tbody>';
  document.getElementById('scorecardTable').innerHTML = html;
}

function filterByManager(mgr) {
  document.getElementById('filterManager').value = mgr;
  applyFilters();
  showToast(`👤 Filtered to ${mgr}`);
}

// ══════════════════════════════════════════════════════════════════════
// MAP
// ══════════════════════════════════════════════════════════════════════
function initMap() {
  map = L.map('map').setView([35.5, -97.5], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap', maxZoom: 18
  }).addTo(map);
  markerLayer = L.layerGroup().addTo(map);
  
  // Legend - will update based on layer
  window.mapLegend = L.control({ position: 'bottomright' });
  window.mapLegend.onAdd = function() {
    const div = L.DomUtil.create('div', 'legend');
    div.id = 'mapLegendContent';
    return div;
  };
  window.mapLegend.addTo(map);
  updateMapLegend();
}

function updateMapLegend() {
  const el = document.getElementById('mapLegendContent');
  if (!el) return;
  
  if (S.mapLayer === 'ahurtu') {
    el.innerHTML = `
      <strong>🛠️ AHU/RTU Work Orders</strong><br>
      <i style="background:#ea1100"></i> Aged 14+ days<br>
      <i style="background:#f47920"></i> Aged 7-14 days<br>
      <i style="background:#ffc220"></i> Aged 3-7 days<br>
      <i style="background:#2a8703"></i> Fresh (<3 days)<br>
      <i style="background:#0053e2;border-radius:0"></i> Multiple WOs
    `;
  } else {
    el.innerHTML = `
      <strong>🎯 Time in Target %</strong><br>
      <i style="background:#2a8703"></i> 95%+ (Excellent)<br>
      <i style="background:#76c043"></i> 90-95% (Good)<br>
      <i style="background:#ffc220"></i> 85-90% (Watch)<br>
      <i style="background:#f47920"></i> 80-85% (Warning)<br>
      <i style="background:#ea1100"></i> <80% (Critical)<br>
      <i style="background:#999"></i> No Data
    `;
  }
}

function renderMap() {
  if (!map) return;
  markerLayer.clearLayers();
  
  if (S.mapLayer === 'ahurtu') {
    renderAhuRtuMap();
  } else if (S.mapLayer === 'comm') {
    renderCommLossMap();
  } else {
    renderTnTMap();
  }
  updateMapLegend();
  updateMapStats();
}

function renderTnTMap() {
  const stores = getFilteredMapStores();
  
  stores.forEach(s => {
    const color = getColor(s.tit);
    const radius = getRadius(s.tit);
    const m = L.circleMarker([s.lat, s.lng], {
      radius, fillColor: color, color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.85
    });
    const titLabel = s.tit != null ? s.tit.toFixed(1) + '%' : 'N/A';
    const wos = S.ahuRtu.filter(w => w.store === s.store).length;
    m.bindTooltip(`<strong>#${s.store}</strong> ${s.city}, ${s.state}<br>TnT: <strong>${titLabel}</strong><br>${s.mgr}${wos ? `<br>🛠️ ${wos} WOs` : ''}`);
    m.on('click', () => showMapDrillDown('store', s));
    m.addTo(markerLayer);
  });
}

function renderAhuRtuMap() {
  const wos = getFilteredMapWOs();
  
  // Group WOs by store
  const storeWOs = {};
  wos.forEach(w => {
    const store = S.stores.find(s => s.store === w.store);
    if (store && store.lat && store.lng) {
      if (!storeWOs[w.store]) {
        storeWOs[w.store] = { store, wos: [] };
      }
      storeWOs[w.store].wos.push(w);
    }
  });
  
  Object.values(storeWOs).forEach(({ store, wos }) => {
    const maxAge = Math.max(...wos.map(w => w.age_days));
    const color = maxAge >= 14 ? '#ea1100' : maxAge >= 7 ? '#f47920' : maxAge >= 3 ? '#ffc220' : '#2a8703';
    const radius = wos.length > 3 ? 14 : wos.length > 1 ? 11 : 8;
    
    const m = L.circleMarker([store.lat, store.lng], {
      radius, 
      fillColor: color, 
      color: wos.length > 1 ? '#0053e2' : '#fff', 
      weight: wos.length > 1 ? 3 : 2, 
      opacity: 1, 
      fillOpacity: 0.9
    });
    
    const woList = wos.slice(0, 3).map(w => `• ${w.tracking} (${w.age_days}d) - ${w.problem}`).join('<br>');
    const moreText = wos.length > 3 ? `<br>...and ${wos.length - 3} more` : '';
    m.bindTooltip(`
      <strong>#${store.store}</strong> ${store.city}, ${store.state}<br>
      <span style="color:${color};font-weight:bold">🛠️ ${wos.length} Work Order${wos.length > 1 ? 's' : ''}</span><br>
      Max Age: <strong>${maxAge} days</strong><br>
      ${woList}${moreText}
    `, { maxWidth: 300 });
    
    m.on('click', () => showMapDrillDown('wo', { store, wos }));
    m.addTo(markerLayer);
  });
}

function renderCommLossMap() {
  S.commLoss.forEach(c => {
    const store = S.stores.find(s => s.store === c.store);
    if (!store || !store.lat || !store.lng) return;
    
    const color = c.days_offline > 7 ? '#ea1100' : c.days_offline > 3 ? '#f47920' : '#ffc220';
    const m = L.circleMarker([store.lat, store.lng], {
      radius: 10, fillColor: color, color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.9
    });
    
    m.bindTooltip(`
      <strong>#${store.store}</strong> ${store.city}, ${store.state}<br>
      <span style="color:${color};font-weight:bold">📡 Comm Loss</span><br>
      Controller: ${c.controller}<br>
      Offline: <strong>${c.days_offline} days</strong>
    `);
    m.on('click', () => showMapDrillDown('store', store));
    m.addTo(markerLayer);
  });
}

function getColor(tit) {
  if (tit == null) return '#999';
  if (tit >= 95) return '#2a8703';
  if (tit >= 90) return '#76c043';
  if (tit >= 85) return '#ffc220';
  if (tit >= 80) return '#f47920';
  return '#ea1100';
}

function getRadius(tit) {
  if (tit == null) return 6;
  if (tit >= 95) return 8;
  if (tit < 80) return 12;
  return 9;
}

function setMapLayer(layer, btn) {
  S.mapLayer = layer;
  document.querySelectorAll('#mapLayerBtns .filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  // Show/hide filter panels based on layer
  const ahuFilters = document.getElementById('ahuMapFilters');
  const tntFilters = document.getElementById('tntMapFilters');
  
  if (layer === 'ahurtu') {
    ahuFilters?.classList.remove('hidden');
    tntFilters?.classList.add('hidden');
  } else if (layer === 'tit') {
    ahuFilters?.classList.add('hidden');
    tntFilters?.classList.remove('hidden');
  } else {
    ahuFilters?.classList.add('hidden');
    tntFilters?.classList.add('hidden');
  }
  
  renderMap();
}

function applyMapFilters() {
  // Read all filter values
  S.mapFilters.equip = document.getElementById('mapFilterEquip')?.value || '';
  S.mapFilters.age = document.getElementById('mapFilterAge')?.value || '';
  S.mapFilters.mgr = document.getElementById('mapFilterMgr')?.value || '';
  S.mapFilters.problem = document.getElementById('mapFilterProblem')?.value || '';
  S.mapFilters.status = document.getElementById('mapFilterStatus')?.value || '';
  S.mapFilters.tnt = document.getElementById('mapFilterTnT')?.value || '';
  S.mapFilters.storeType = document.getElementById('mapFilterType')?.value || '';
  S.mapFilters.tntMgr = document.getElementById('mapFilterTnTMgr')?.value || '';
  S.mapFilters.hasWO = document.getElementById('mapFilterHasWO')?.value || '';
  S.mapFilters.sub = document.getElementById('mapFilterSub')?.value || '';
  
  renderMap();
}

function resetMapFilters() {
  // Reset all filter dropdowns
  ['mapFilterEquip', 'mapFilterAge', 'mapFilterMgr', 'mapFilterProblem', 'mapFilterStatus',
   'mapFilterTnT', 'mapFilterType', 'mapFilterTnTMgr', 'mapFilterHasWO', 'mapFilterSub'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  
  // Reset state
  S.mapFilters = { equip: '', age: '', mgr: '', problem: '', status: '', tnt: '', storeType: '', hasWO: '', sub: '' };
  
  renderMap();
  showToast('🔄 Filters reset!');
}

function getFilteredMapWOs() {
  let wos = [...S.ahuRtu];
  
  // Equipment type filter
  if (S.mapFilters.equip) {
    const eq = S.mapFilters.equip.toLowerCase();
    wos = wos.filter(w => {
      const equip = (w.equipment || '').toLowerCase();
      if (eq === 'ahu') return equip.includes('ahu') && !equip.includes('rtu');
      if (eq === 'rtu') return equip.includes('rtu');
      if (eq === 'mfc') return equip.includes('mfc');
      return true;
    });
  }
  
  // Age filter
  if (S.mapFilters.age) {
    switch (S.mapFilters.age) {
      case 'critical': wos = wos.filter(w => w.age_days >= 14); break;
      case 'warning': wos = wos.filter(w => w.age_days >= 7 && w.age_days < 14); break;
      case 'watch': wos = wos.filter(w => w.age_days >= 3 && w.age_days < 7); break;
      case 'fresh': wos = wos.filter(w => w.age_days < 3); break;
    }
  }
  
  // Manager filter
  if (S.mapFilters.mgr) {
    wos = wos.filter(w => w.mgr === S.mapFilters.mgr);
  }
  
  // Problem filter
  if (S.mapFilters.problem) {
    wos = wos.filter(w => (w.problem || '').toLowerCase().includes(S.mapFilters.problem.toLowerCase()));
  }
  
  // Status filter
  if (S.mapFilters.status) {
    wos = wos.filter(w => w.status === S.mapFilters.status);
  }
  
  S.filteredMapWOs = wos;
  return wos;
}

function getFilteredMapStores() {
  let stores = [...S.stores].filter(s => s.lat && s.lng);
  
  // TnT performance filter
  if (S.mapFilters.tnt) {
    switch (S.mapFilters.tnt) {
      case 'excellent': stores = stores.filter(s => s.tit >= 95); break;
      case 'good': stores = stores.filter(s => s.tit >= 90 && s.tit < 95); break;
      case 'watch': stores = stores.filter(s => s.tit >= 85 && s.tit < 90); break;
      case 'warning': stores = stores.filter(s => s.tit >= 80 && s.tit < 85); break;
      case 'critical': stores = stores.filter(s => s.tit != null && s.tit < 80); break;
    }
  }
  
  // Store type filter
  if (S.mapFilters.storeType) {
    stores = stores.filter(s => s.store_type === S.mapFilters.storeType);
  }
  
  // Manager filter for TnT
  if (S.mapFilters.tntMgr) {
    stores = stores.filter(s => s.mgr === S.mapFilters.tntMgr);
  }
  
  // Has WO filter
  if (S.mapFilters.hasWO) {
    const storesWithWOs = new Set(S.ahuRtu.map(w => w.store));
    if (S.mapFilters.hasWO === 'yes') {
      stores = stores.filter(s => storesWithWOs.has(s.store));
    } else {
      stores = stores.filter(s => !storesWithWOs.has(s.store));
    }
  }
  
  // Sub-region filter
  if (S.mapFilters.sub) {
    stores = stores.filter(s => s.sub === S.mapFilters.sub);
  }
  
  return stores;
}

function updateMapStats() {
  if (S.mapLayer === 'ahurtu') {
    const wos = S.filteredMapWOs;
    const stores = new Set(wos.map(w => w.store));
    const critical = wos.filter(w => w.age_days >= 14).length;
    const avgAge = wos.length ? Math.round(wos.reduce((a, w) => a + w.age_days, 0) / wos.length) : 0;
    
    document.getElementById('statTotalWOs').textContent = wos.length;
    document.getElementById('statStores').textContent = stores.size;
    document.getElementById('statCritical').textContent = critical;
    document.getElementById('statAvgAge').textContent = avgAge;
  } else if (S.mapLayer === 'tit') {
    const stores = getFilteredMapStores();
    const withTnT = stores.filter(s => s.tit != null);
    const avgTnT = withTnT.length ? (withTnT.reduce((a, s) => a + s.tit, 0) / withTnT.length).toFixed(1) : 'N/A';
    const above95 = withTnT.filter(s => s.tit >= 95).length;
    const below85 = withTnT.filter(s => s.tit < 85).length;
    const storesWithWOs = new Set(S.ahuRtu.map(w => w.store));
    const withWOs = stores.filter(s => storesWithWOs.has(s.store)).length;
    
    document.getElementById('statTotalStores').textContent = stores.length;
    document.getElementById('statAvgTnT').textContent = avgTnT + '%';
    document.getElementById('statAbove95').textContent = above95;
    document.getElementById('statBelow85').textContent = below85;
    document.getElementById('statWithWOs').textContent = withWOs;
  }
}

function copyFilteredWOs() {
  const wos = S.filteredMapWOs.map(w => w.tracking).join('\n');
  navigator.clipboard.writeText(wos);
  showToast(`📋 Copied ${S.filteredMapWOs.length} WO numbers!`);
}

function populateSubRegions() {
  const subs = [...new Set(S.stores.map(s => s.sub).filter(Boolean))].sort();
  const sel = document.getElementById('mapFilterSub');
  if (sel) {
    sel.innerHTML = '<option value="">All Sub-Regions</option>';
    subs.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.textContent = sub;
      sel.appendChild(opt);
    });
  }
}

// ══════════════════════════════════════════════════════════════════════
// AHU/RTU TAB
// ══════════════════════════════════════════════════════════════════════
function renderAhuRtu() {
  const data = getFilteredAhuRtu();
  const ahuCount = data.filter(w => (w.equipment || '').toLowerCase().includes('ahu')).length;
  const rtuCount = data.length - ahuCount;
  const aged = data.filter(w => w.age_days > 14).length;
  const stores = [...new Set(data.map(w => w.store))].length;
  
  document.getElementById('ahuSummary').innerHTML = `
    <div class="flex gap-4 text-center">
      <div class="bg-purple-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-purple-700">${data.length}</div>
        <div class="text-xs text-gray-500">Total WOs</div>
      </div>
      <div class="bg-indigo-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-indigo-700">${ahuCount}</div>
        <div class="text-xs text-gray-500">AHU</div>
      </div>
      <div class="bg-purple-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-purple-600">${rtuCount}</div>
        <div class="text-xs text-gray-500">RTU</div>
      </div>
      <div class="bg-blue-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-blue-700">${stores}</div>
        <div class="text-xs text-gray-500">Stores</div>
      </div>
      <div class="bg-red-50 rounded-lg p-3 flex-1 cursor-pointer hover:bg-red-100" onclick="filterAgedWOs()">
        <div class="text-2xl font-bold" style="color: ${aged > 0 ? '#ea1100' : '#2a8703'}">${aged}</div>
        <div class="text-xs text-gray-500">Aged 14+</div>
      </div>
      <div class="bg-green-50 rounded-lg p-3 flex-1 cursor-pointer hover:bg-green-100" onclick="copyAllWOs()">
        <div class="text-2xl">📋</div>
        <div class="text-xs text-gray-500">Copy All WOs</div>
      </div>
    </div>
  `;
  
  let html = `<table class="tbl"><thead><tr>
    <th>Store</th><th>Tracking # <span class="text-xs text-gray-400">(click to copy)</span></th><th>Equipment</th><th>Problem</th><th>Status</th><th>Provider</th><th class="text-right">Age</th><th></th>
  </tr></thead><tbody>`;
  
  data.sort((a, b) => b.age_days - a.age_days).forEach(w => {
    const ageColor = w.age_days > 30 ? '#ea1100' : w.age_days > 14 ? '#f47920' : w.age_days > 7 ? '#ffc220' : '#2a8703';
    const statusCls = w.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
    const eqType = (w.equipment || '').toLowerCase().includes('rtu') ? '🌬️ RTU' : '🌀 AHU';
    html += `<tr>
      <td class="font-mono font-bold cursor-pointer hover:text-blue-700" style="color: #0053e2" onclick="drillDownStore(${w.store})">
        ${w.store}<div class="text-[10px] text-gray-400">${w.city}, ${w.state}</div>
      </td>
      <td>
        <div class="flex items-center gap-2">
          <a href="https://servicechannel.com/sc/wo/details/${w.tracking}" target="_blank" class="text-blue-600 hover:underline font-mono">${w.tracking}</a>
          <button onclick="copyWO('${w.tracking}')" class="text-gray-400 hover:text-blue-600" title="Copy WO#">📋</button>
        </div>
      </td>
      <td>${eqType}</td>
      <td>${w.problem || '-'}</td>
      <td><span class="px-2 py-0.5 rounded text-xs font-medium ${statusCls}">${w.status}</span></td>
      <td class="text-xs text-gray-500 max-w-[100px] truncate" title="${w.provider}">${w.provider || '-'}</td>
      <td class="text-right font-bold" style="color: ${ageColor}">${w.age_days}d</td>
      <td>
        <button onclick="copyWO('${w.tracking}')" class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100">
          Copy
        </button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  if (!data.length) html = '<div class="text-center text-gray-400 py-12">✅ No broken AHU/RTU units!</div>';
  document.getElementById('ahuContent').innerHTML = html;
}

function filterAgedWOs() {
  document.getElementById('ahuGroupBy').value = 'age';
  showToast('🔍 Showing aged 14+ WOs');
}

// ══════════════════════════════════════════════════════════════════════
// COMM LOSS TAB
// ══════════════════════════════════════════════════════════════════════
function renderCommLoss() {
  const data = S.commLoss.filter(c => {
    if (S.filterManager && c.mgr !== S.filterManager) return false;
    return true;
  });
  
  const stores = [...new Set(data.map(c => c.store))].length;
  const aged = data.filter(c => c.days_offline > 7).length;
  
  document.getElementById('commSummary').innerHTML = `
    <div class="flex gap-4 text-center">
      <div class="bg-orange-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-orange-700">${data.length}</div>
        <div class="text-xs text-gray-500">Controllers Offline</div>
      </div>
      <div class="bg-blue-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-blue-700">${stores}</div>
        <div class="text-xs text-gray-500">Stores Affected</div>
      </div>
      <div class="bg-red-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold" style="color: ${aged > 0 ? '#ea1100' : '#2a8703'}">${aged}</div>
        <div class="text-xs text-gray-500">7+ Days</div>
      </div>
    </div>
  `;
  
  let html = `<table class="tbl"><thead><tr>
    <th>Store</th><th>Controller</th><th>Rack</th><th>Manager</th><th class="text-right">Days Offline</th>
  </tr></thead><tbody>`;
  
  data.sort((a, b) => b.days_offline - a.days_offline).forEach(c => {
    const color = c.days_offline > 14 ? '#ea1100' : c.days_offline > 7 ? '#f47920' : '#ffc220';
    html += `<tr>
      <td class="font-mono font-bold" style="color: #0053e2">${c.store}<div class="text-[10px] text-gray-400">${c.city}, ${c.state}</div></td>
      <td>${c.controller || '-'}</td>
      <td>${c.rack || '-'}</td>
      <td class="text-sm">${c.mgr || '-'}</td>
      <td class="text-right font-bold" style="color: ${color}">${c.days_offline}d</td>
    </tr>`;
  });
  html += '</tbody></table>';
  if (!data.length) html = '<div class="text-center text-gray-400 py-12">✅ No communication loss!</div>';
  document.getElementById('commContent').innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// LEAK SUMMARY TAB
// ══════════════════════════════════════════════════════════════════════
function renderLeaks() {
  const data = S.leakSummary;
  const totalLbs = data.reduce((a, l) => a + (l.lbs_leaked || 0), 0);
  const stores = [...new Set(data.map(l => l.store))].length;
  
  document.getElementById('leakSummary').innerHTML = `
    <div class="flex gap-4 text-center">
      <div class="bg-blue-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-blue-700">${data.length}</div>
        <div class="text-xs text-gray-500">Total Events</div>
      </div>
      <div class="bg-cyan-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-cyan-700">${totalLbs.toFixed(1)}</div>
        <div class="text-xs text-gray-500">Total Lbs</div>
      </div>
      <div class="bg-indigo-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-indigo-700">${stores}</div>
        <div class="text-xs text-gray-500">Stores</div>
      </div>
    </div>
  `;
  
  let html = `<table class="tbl"><thead><tr>
    <th>Store</th><th>Date</th><th>Refrigerant</th><th>Circuit</th><th class="text-right">Lbs Leaked</th>
  </tr></thead><tbody>`;
  
  data.forEach(l => {
    html += `<tr>
      <td class="font-mono font-bold" style="color: #0053e2">${l.store}<div class="text-[10px] text-gray-400">${l.city}, ${l.state}</div></td>
      <td>${l.event_date || '-'}</td>
      <td>${l.refrigerant_type || '-'}</td>
      <td>${l.circuit_name || '-'}</td>
      <td class="text-right font-bold text-blue-700">${(l.lbs_leaked || 0).toFixed(1)}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  if (!data.length) html = '<div class="text-center text-gray-400 py-12">✅ No leak events this period!</div>';
  document.getElementById('leakContent').innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// WTW STATUS TAB
// ══════════════════════════════════════════════════════════════════════
function renderWtW() {
  const wtwData = S.wtwStatus || [];
  const total = wtwData.length;
  const complete = wtwData.filter(t => t.status === 'COMPLETE').length;
  const inProgress = wtwData.filter(t => t.status === 'IN PROGRESS').length;
  const notStarted = wtwData.filter(t => t.status === 'NOT STARTED').length;
  const overallPct = total > 0 ? Math.round((complete / total) * 100) : 0;
  
  // Manager breakdown
  const managers = ['DANE CLAYTON', 'DAVID GUESS', 'ERIC GRAY', 'JASON MCALESTER'];
  const mgrStats = managers.map(mgr => {
    const stores = wtwData.filter(w => w.mgr === mgr);
    const comp = stores.filter(w => w.status === 'COMPLETE').length;
    const tot = stores.length;
    return { mgr, complete: comp, total: tot, pct: tot > 0 ? Math.round((comp / tot) * 100) : 0 };
  }).sort((a, b) => b.pct - a.pct);
  
  document.getElementById('wtwSummary').innerHTML = `
    <div class="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <div class="flex items-center justify-center gap-4 mb-6">
        <span class="text-6xl">❄️</span>
        <div class="text-center">
          <h3 class="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent">Win-the-Winter FY26</h3>
          <p class="text-cyan-600">Region 15B Store Completion Status from Crystal</p>
        </div>
        <span class="text-6xl">❄️</span>
      </div>
      
      <!-- Overall Progress -->
      <div class="bg-white/80 rounded-xl p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-lg font-bold text-gray-700">Overall Completion</span>
          <span class="text-2xl font-bold" style="color: ${overallPct >= 50 ? '#2a8703' : overallPct >= 25 ? '#f59e0b' : '#ea1100'}">${overallPct}%</span>
        </div>
        <div class="bg-gray-200 rounded-full h-4">
          <div class="h-4 rounded-full transition-all bg-gradient-to-r from-cyan-500 to-blue-600" style="width: ${overallPct}%"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-2">
          <span>✅ ${complete} Complete</span>
          <span>🔄 ${inProgress} In Progress</span>
          <span>⏳ ${notStarted} Not Started</span>
          <span>🏢 ${total} Total Stores</span>
        </div>
      </div>
      
      <!-- Manager Scoreboard -->
      <div class="grid grid-cols-4 gap-4">
        ${mgrStats.map((m, i) => `
          <div class="bg-white/80 rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition" onclick="drillDownManager('${m.mgr}')">
            <div class="text-xs text-gray-400 mb-1">${i === 0 ? '🏆 LEADER' : '#' + (i + 1)}</div>
            <div class="font-bold text-blue-700">${m.mgr.split(' ')[1]}</div>
            <div class="text-3xl font-bold mt-2" style="color: ${m.pct >= 50 ? '#2a8703' : m.pct >= 25 ? '#f59e0b' : '#ea1100'}">${m.pct}%</div>
            <div class="text-xs text-gray-500">${m.complete}/${m.total} stores</div>
            <div class="mt-2 bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full ${m.pct >= 50 ? 'bg-green-500' : m.pct >= 25 ? 'bg-yellow-500' : 'bg-red-500'}" style="width: ${m.pct}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Phase Details
  const phases = S.wtwPhases || {
    phase1: { name: 'Pre-Season Prep', period: 'Oct - Nov', tasks: ['RTU Filter Change', 'AHU Belt Inspection', 'Heat System Test', 'Thermostat Calibration', 'Ductwork Inspection'] },
    phase2: { name: 'Active Monitoring', period: 'Dec - Feb', tasks: ['Weekly TnT Review', 'Cold Weather Response', 'Emergency Heat Checks', 'MFC System Monitoring', 'Comm Loss Resolution'] },
    phase3: { name: 'Post-Season Review', period: 'Mar - Apr', tasks: ['Season Close-Out', 'Performance Documentation', 'Lessons Learned', 'Equipment Assessment', 'Next Season Planning'] }
  };
  
  document.getElementById('wtwContent').innerHTML = `
    <!-- Phase Cards -->
    <div class="grid grid-cols-3 gap-4 mt-6 mb-6">
      <div class="card p-5 border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl">🍂</span>
          <div>
            <div class="text-xl font-bold text-green-700">Phase 1</div>
            <div class="text-sm text-green-600">${phases.phase1?.name || 'Pre-Season Prep'}</div>
          </div>
        </div>
        <div class="text-xs text-gray-500 mb-3">${phases.phase1?.period || 'Oct - Nov'}</div>
        <ul class="space-y-1">
          ${(phases.phase1?.tasks || []).map(t => `<li class="flex items-center gap-2 text-sm"><span class="text-green-500">✔</span>${t}</li>`).join('')}
        </ul>
        <div class="mt-4 text-center">
          <span class="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">✅ COMPLETE</span>
        </div>
      </div>
      
      <div class="card p-5 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl">❄️</span>
          <div>
            <div class="text-xl font-bold text-blue-700">Phase 2</div>
            <div class="text-sm text-blue-600">${phases.phase2?.name || 'Active Monitoring'}</div>
          </div>
        </div>
        <div class="text-xs text-gray-500 mb-3">${phases.phase2?.period || 'Dec - Feb'}</div>
        <ul class="space-y-1">
          ${(phases.phase2?.tasks || []).map(t => `<li class="flex items-center gap-2 text-sm"><span class="text-blue-500">✔</span>${t}</li>`).join('')}
        </ul>
        <div class="mt-4 text-center">
          <span class="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-pulse">🔄 ACTIVE NOW</span>
        </div>
      </div>
      
      <div class="card p-5 border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl">🌸</span>
          <div>
            <div class="text-xl font-bold text-gray-500">Phase 3</div>
            <div class="text-sm text-gray-400">${phases.phase3?.name || 'Post-Season Review'}</div>
          </div>
        </div>
        <div class="text-xs text-gray-400 mb-3">${phases.phase3?.period || 'Mar - Apr'}</div>
        <ul class="space-y-1">
          ${(phases.phase3?.tasks || []).map(t => `<li class="flex items-center gap-2 text-sm text-gray-400"><span>○</span>${t}</li>`).join('')}
        </ul>
        <div class="mt-4 text-center">
          <span class="px-4 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">⏳ UPCOMING</span>
        </div>
      </div>
    </div>
    
    <!-- Store List -->
    <div class="card p-4">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-bold text-gray-700">🏢 Store Completion Details</h4>
        <div class="flex gap-2">
          <select id="wtwMgrFilter" onchange="renderWtwStoreList()" class="text-sm border rounded px-2 py-1">
            <option value="">All Managers</option>
            ${managers.map(m => `<option value="${m}">${m.split(' ')[1]}</option>`).join('')}
          </select>
          <select id="wtwStatusFilter" onchange="renderWtwStoreList()" class="text-sm border rounded px-2 py-1">
            <option value="">All Status</option>
            <option value="COMPLETE">Complete</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="NOT STARTED">Not Started</option>
          </select>
        </div>
      </div>
      <div id="wtwStoreList" class="max-h-96 overflow-y-auto"></div>
    </div>
  `;
  
  renderWtwStoreList();
}

function renderWtwStoreList() {
  const mgrFilter = document.getElementById('wtwMgrFilter')?.value || '';
  const statusFilter = document.getElementById('wtwStatusFilter')?.value || '';
  
  let data = S.wtwStatus || [];
  if (mgrFilter) data = data.filter(w => w.mgr === mgrFilter);
  if (statusFilter) data = data.filter(w => w.status === statusFilter);
  
  let html = '<table class="tbl text-sm"><thead><tr><th>Store</th><th>City</th><th>Manager</th><th>Sub</th><th>Status</th><th>Goal</th><th>Health</th><th>Start</th><th>Complete</th></tr></thead><tbody>';
  
  data.sort((a, b) => {
    const order = { 'COMPLETE': 0, 'IN PROGRESS': 1, 'NOT STARTED': 2 };
    return order[a.status] - order[b.status];
  }).forEach(w => {
    const statusCls = w.status === 'COMPLETE' ? 'bg-green-100 text-green-800' : 
                      w.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-600';
    const healthColor = w.health >= 95 ? '#2a8703' : w.health >= 90 ? '#f59e0b' : w.health ? '#ea1100' : '#9ca3af';
    html += `<tr class="hover:bg-blue-50">
      <td class="font-mono font-bold" style="color: #0053e2">${w.store}</td>
      <td>${w.city}, ${w.state}</td>
      <td class="text-xs">${w.mgr?.split(' ')[1] || '-'}</td>
      <td class="text-xs text-gray-500">${w.sub}</td>
      <td><span class="px-2 py-0.5 rounded text-xs font-medium ${statusCls}">${w.status}</span></td>
      <td class="text-center">${w.goal || '-'}</td>
      <td class="font-bold" style="color: ${healthColor}">${w.health ? w.health + '%' : '-'}</td>
      <td class="text-xs text-gray-500">${w.start_date || '-'}</td>
      <td class="text-xs text-gray-500">${w.stop_date || '-'}</td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  if (!data.length) html = '<div class="text-center text-gray-400 py-8">No stores match filter</div>';
  document.getElementById('wtwStoreList').innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// PROJECTS TAB
// ══════════════════════════════════════════════════════════════════════
function renderProjects() {
  const data = S.projects;
  let html = `<table class="tbl"><thead><tr>
    <th>Store</th><th>Project</th><th>Type</th><th>Status</th><th>Start</th><th>Completion</th>
  </tr></thead><tbody>`;
  
  data.forEach(p => {
    const statusCls = p.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                      p.status === 'PLANNING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800';
    html += `<tr>
      <td class="font-mono font-bold" style="color: #0053e2">${p.store}<div class="text-[10px] text-gray-400">${p.city}, ${p.state}</div></td>
      <td class="font-medium">${p.project_name || '-'}</td>
      <td>${p.project_type || '-'}</td>
      <td><span class="px-2 py-0.5 rounded text-xs font-medium ${statusCls}">${p.status}</span></td>
      <td>${p.start_date || '-'}</td>
      <td>${p.completion_date || '-'}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  if (!data.length) html = '<div class="text-center text-gray-400 py-12">✅ No active projects!</div>';
  document.getElementById('projContent').innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// SAM'S CLUB TAB
// ══════════════════════════════════════════════════════════════════════
function renderSams() {
  const sams = getFilteredStores().filter(s => s.store_type === 'Sams');
  const withTnT = sams.filter(s => s.tit != null);
  const avgTnT = withTnT.length ? (withTnT.reduce((a, s) => a + s.tit, 0) / withTnT.length).toFixed(1) : 'N/A';
  const below90 = withTnT.filter(s => s.tit < 90).length;
  
  document.getElementById('samsSummary').innerHTML = `
    <div class="flex gap-4 text-center">
      <div class="bg-indigo-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold text-indigo-700">${sams.length}</div>
        <div class="text-xs text-gray-500">Sam's Clubs</div>
      </div>
      <div class="bg-blue-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold" style="color: ${parseFloat(avgTnT) >= 90 ? '#2a8703' : '#f59e0b'}">${avgTnT}%</div>
        <div class="text-xs text-gray-500">Avg TnT</div>
      </div>
      <div class="bg-yellow-50 rounded-lg p-3 flex-1">
        <div class="text-2xl font-bold" style="color: ${below90 > 0 ? '#f59e0b' : '#2a8703'}">${below90}</div>
        <div class="text-xs text-gray-500"><90% TnT</div>
      </div>
    </div>
  `;
  
  let html = `<table class="tbl"><thead><tr>
    <th>Store</th><th>City</th><th>Sub-Region</th><th>Manager</th><th>TnT %</th><th>Status</th>
  </tr></thead><tbody>`;
  
  sams.sort((a, b) => (a.tit || 0) - (b.tit || 0)).forEach(s => {
    const color = getColor(s.tit);
    const status = s.tit >= 95 ? '🟢 Excellent' : s.tit >= 90 ? '🟢 Good' : s.tit >= 85 ? '🟡 Watch' : s.tit >= 80 ? '🟠 Warning' : '🔴 Critical';
    html += `<tr>
      <td class="font-mono font-bold" style="color: #0053e2">${s.store}</td>
      <td>${s.city}, ${s.state}</td>
      <td>${s.sub || '-'}</td>
      <td>${s.mgr || '-'}</td>
      <td class="font-bold" style="color: ${color}">${s.tit != null ? s.tit.toFixed(1) + '%' : 'N/A'}</td>
      <td>${status}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  if (!sams.length) html = '<div class="text-center text-gray-400 py-12">No Sam\'s Clubs in filter!</div>';
  document.getElementById('samsContent').innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// CHARTS
// ══════════════════════════════════════════════════════════════════════
function initCharts() {
  // TnT Distribution
  charts.tnt = new Chart(document.getElementById('chartTnT'), {
    type: 'bar',
    data: { labels: ['<80%', '80-85%', '85-90%', '90-95%', '≥95%'], datasets: [{ data: [0,0,0,0,0], backgroundColor: ['#ea1100', '#f47920', '#ffc220', '#76c043', '#2a8703'], borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
  
  // By Manager
  charts.manager = new Chart(document.getElementById('chartManager'), {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'TnT Avg', data: [], backgroundColor: '#0053e2', borderRadius: 4 }] },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { min: 80, max: 100 } } }
  });
  
  // By Store Type
  charts.type = new Chart(document.getElementById('chartType'), {
    type: 'doughnut',
    data: { labels: ['Supercenter', 'NHM', "Sam's Club", 'Discount'], datasets: [{ data: [0,0,0,0], backgroundColor: ['#0053e2', '#2a8703', '#4f46e5', '#f59e0b'] }] },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function updateCharts(stores, ahuRtu) {
  const withTnT = stores.filter(s => s.tit != null);
  
  // TnT Distribution
  charts.tnt.data.datasets[0].data = [
    withTnT.filter(s => s.tit < 80).length,
    withTnT.filter(s => s.tit >= 80 && s.tit < 85).length,
    withTnT.filter(s => s.tit >= 85 && s.tit < 90).length,
    withTnT.filter(s => s.tit >= 90 && s.tit < 95).length,
    withTnT.filter(s => s.tit >= 95).length
  ];
  charts.tnt.update();
  
  // By Manager
  const managers = [...new Set(stores.map(s => s.mgr).filter(Boolean))];
  const mgrData = managers.map(m => {
    const ms = stores.filter(s => s.mgr === m && s.tit != null);
    return { name: m.split(' ')[1], avg: ms.length ? ms.reduce((a, s) => a + s.tit, 0) / ms.length : 0 };
  }).sort((a, b) => b.avg - a.avg);
  charts.manager.data.labels = mgrData.map(m => m.name);
  charts.manager.data.datasets[0].data = mgrData.map(m => m.avg.toFixed(1));
  charts.manager.update();
  
  // By Store Type
  charts.type.data.datasets[0].data = [
    stores.filter(s => s.store_type === 'Supercenter').length,
    stores.filter(s => s.store_type === 'NHM').length,
    stores.filter(s => s.store_type === 'Sams').length,
    stores.filter(s => s.store_type === 'Discount').length
  ];
  charts.type.update();
}

// ══════════════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════════════
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show';
  if (type === 'error') toast.style.background = '#ea1100';
  else toast.style.background = '#1e293b';
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function copyShareLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  showToast('🔗 Link copied to clipboard!');
  
  // Also update the share URL input
  const input = document.getElementById('shareUrl');
  if (input) input.value = url;
}

function openInNewWindow() {
  const url = window.location.href;
  window.open(url, '_blank', 'width=1600,height=900,menubar=no,toolbar=no,location=no,status=no');
  showToast('🚀 Opened in new window!');
}

function updateShareUrl() {
  const input = document.getElementById('shareUrl');
  if (input) input.value = window.location.href;
}

// Update share URL on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(updateShareUrl, 100);
  setTimeout(populateSubRegions, 500);
});

// ══════════════════════════════════════════════════════════════════════
// MAP DRILL-DOWN PANEL
// ══════════════════════════════════════════════════════════════════════
function showMapDrillDown(type, data) {
  const panel = document.getElementById('mapDrillDown');
  const title = document.getElementById('drillDownTitle');
  const content = document.getElementById('drillDownContent');
  
  if (!panel) return;
  panel.classList.remove('hidden');
  
  if (type === 'store') {
    const s = data;
    const wos = S.ahuRtu.filter(w => w.store === s.store);
    const comm = S.commLoss.filter(c => c.store === s.store);
    
    title.innerHTML = `<span class="text-blue-600">🏢 Store #${s.store}</span> - ${s.city}, ${s.state}`;
    
    content.innerHTML = `
      <div class="grid grid-cols-4 gap-4 mb-4">
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <div class="text-xl font-bold" style="color: ${getColor(s.tit)}">${s.tit ? s.tit.toFixed(1) + '%' : 'N/A'}</div>
          <div class="text-xs text-gray-500">TnT %</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-3 text-center">
          <div class="text-xl font-bold text-purple-700">${wos.length}</div>
          <div class="text-xs text-gray-500">Open WOs</div>
        </div>
        <div class="bg-orange-50 rounded-lg p-3 text-center">
          <div class="text-xl font-bold text-orange-700">${comm.length}</div>
          <div class="text-xs text-gray-500">Comm Loss</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 text-center">
          <div class="text-sm font-medium text-gray-700">${s.store_type}</div>
          <div class="text-xs text-gray-500">Type</div>
        </div>
      </div>
      <div class="text-sm text-gray-600 mb-3">
        <strong>Manager:</strong> ${s.mgr} | <strong>Sub-Region:</strong> ${s.sub}
      </div>
      ${wos.length ? `
        <h5 class="font-bold text-gray-700 mb-2">🛠️ Work Orders</h5>
        <div class="flex items-center gap-2 mb-2">
          <button onclick="copyStoreWOs(${s.store})" class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            📋 Copy ${wos.length} WOs
          </button>
        </div>
        <table class="tbl text-sm">
          <thead><tr><th>WO #</th><th>Equipment</th><th>Problem</th><th>Age</th><th>Status</th></tr></thead>
          <tbody>
            ${wos.map(w => {
              const ageColor = w.age_days >= 14 ? '#ea1100' : w.age_days >= 7 ? '#f47920' : '#2a8703';
              return `<tr>
                <td><a href="https://servicechannel.com/sc/wo/details/${w.tracking}" target="_blank" class="text-blue-600 hover:underline font-mono">${w.tracking}</a></td>
                <td>${w.equipment}</td>
                <td>${w.problem}</td>
                <td class="font-bold" style="color: ${ageColor}">${w.age_days}d</td>
                <td>${w.status}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      ` : '<div class="text-green-600">✅ No open work orders!</div>'}
    `;
  } else if (type === 'wo') {
    const { store, wos } = data;
    const maxAge = Math.max(...wos.map(w => w.age_days));
    
    title.innerHTML = `<span class="text-purple-600">🛠️ Store #${store.store}</span> - ${wos.length} Work Order${wos.length > 1 ? 's' : ''}`;
    
    content.innerHTML = `
      <div class="grid grid-cols-4 gap-4 mb-4">
        <div class="bg-purple-50 rounded-lg p-3 text-center">
          <div class="text-xl font-bold text-purple-700">${wos.length}</div>
          <div class="text-xs text-gray-500">Total WOs</div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 text-center">
          <div class="text-xl font-bold text-red-600">${maxAge}</div>
          <div class="text-xs text-gray-500">Max Age (days)</div>
        </div>
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <div class="text-sm font-medium" style="color: ${getColor(store.tit)}">${store.tit ? store.tit.toFixed(1) + '%' : 'N/A'}</div>
          <div class="text-xs text-gray-500">TnT %</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 text-center">
          <div class="text-sm font-medium text-gray-700">${store.mgr?.split(' ')[1]}</div>
          <div class="text-xs text-gray-500">Manager</div>
        </div>
      </div>
      <div class="text-sm text-gray-600 mb-3">
        <strong>Location:</strong> ${store.city}, ${store.state} | <strong>Sub:</strong> ${store.sub} | <strong>Type:</strong> ${store.store_type}
      </div>
      <div class="flex items-center gap-2 mb-3">
        <button onclick="copyStoreWOs(${store.store})" class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
          📋 Copy All WOs
        </button>
        <button onclick="drillDownStore(${store.store})" class="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
          🔍 Full Store Details
        </button>
      </div>
      <table class="tbl text-sm">
        <thead><tr><th>WO # <span class="text-xs text-gray-400">(click to copy)</span></th><th>Equipment</th><th>Problem</th><th>Age</th><th>Provider</th><th>Status</th></tr></thead>
        <tbody>
          ${wos.sort((a, b) => b.age_days - a.age_days).map(w => {
            const ageColor = w.age_days >= 14 ? '#ea1100' : w.age_days >= 7 ? '#f47920' : w.age_days >= 3 ? '#ffc220' : '#2a8703';
            const eqType = (w.equipment || '').toLowerCase().includes('rtu') ? '🌬️ RTU' : '🌀 AHU';
            return `<tr>
              <td>
                <div class="flex items-center gap-2">
                  <a href="https://servicechannel.com/sc/wo/details/${w.tracking}" target="_blank" class="text-blue-600 hover:underline font-mono">${w.tracking}</a>
                  <button onclick="copyWO('${w.tracking}')" class="text-gray-400 hover:text-blue-600">📋</button>
                </div>
              </td>
              <td>${eqType}</td>
              <td>${w.problem}</td>
              <td class="font-bold" style="color: ${ageColor}">${w.age_days}d</td>
              <td class="text-xs text-gray-500 max-w-[100px] truncate">${w.provider || '-'}</td>
              <td><span class="px-2 py-0.5 rounded text-xs ${w.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}">${w.status}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  }
  
  // Scroll to panel
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeMapDrillDown() {
  const panel = document.getElementById('mapDrillDown');
  if (panel) panel.classList.add('hidden');
}

function exportScorecard() {
  showToast('📤 Exporting scorecard...');
  // CSV export logic here
}

function exportAll() {
  // Generate CSV of all data
  const stores = S.stores;
  const headers = ['Store', 'City', 'State', 'Type', 'Manager', 'Sub-Region', 'TnT %', 'Lat', 'Lng'];
  const rows = stores.map(s => [
    s.store, s.city, s.state, s.store_type, s.mgr, s.sub, 
    s.tit ? s.tit.toFixed(1) : 'N/A', s.lat, s.lng
  ]);
  
  let csv = headers.join(',') + '\n';
  rows.forEach(r => csv += r.join(',') + '\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `region-15b-hvac-report-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📤 Exported to CSV!');
}

// ══════════════════════════════════════════════════════════════════════
// COPY WO FUNCTIONS
// ══════════════════════════════════════════════════════════════════════
function copyWO(tracking) {
  navigator.clipboard.writeText(tracking);
  showToast(`📋 Copied WO: ${tracking}`);
}

function copyAllWOs() {
  const wos = getFilteredAhuRtu().map(w => w.tracking).join('\n');
  navigator.clipboard.writeText(wos);
  showToast(`📋 Copied ${getFilteredAhuRtu().length} WO numbers!`);
}

function copyStoreWOs(store) {
  const wos = S.ahuRtu.filter(w => w.store === store).map(w => w.tracking).join('\n');
  navigator.clipboard.writeText(wos);
  showToast(`📋 Copied WOs for store ${store}`);
}

// ══════════════════════════════════════════════════════════════════════
// DRILL-DOWN FUNCTIONS
// ══════════════════════════════════════════════════════════════════════
function drillDownManager(mgr) {
  S.drillDownManager = mgr;
  showModal('managerModal');
  renderManagerDrillDown(mgr);
}

function renderManagerDrillDown(mgr) {
  const fsms = S.fsManagers[mgr] || [];
  const stores = S.stores.filter(s => s.mgr === mgr);
  const wos = S.ahuRtu.filter(w => w.mgr === mgr);
  
  let html = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-blue-700">👤 ${mgr}</h2>
        <button onclick="closeModal('managerModal')" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-blue-700">${stores.length}</div>
          <div class="text-xs text-gray-500">Stores</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-purple-700">${fsms.length}</div>
          <div class="text-xs text-gray-500">FS Managers</div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-red-700">${wos.length}</div>
          <div class="text-xs text-gray-500">Open WOs</div>
        </div>
        <div class="bg-green-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-green-700">${stores.filter(s => s.tit >= 95).length}</div>
          <div class="text-xs text-gray-500">≥95% TnT</div>
        </div>
      </div>
      
      <h3 class="font-bold text-gray-700 mb-2">👥 Field Service Managers</h3>
      <div class="grid grid-cols-2 gap-2 mb-6">
  `;
  
  if (fsms.length) {
    fsms.forEach(f => {
      html += `
        <div class="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition" onclick="drillDownFSM('${mgr}', '${f.fsm}')">
          <div class="font-semibold text-blue-700">${f.fsm}</div>
          <div class="text-xs text-gray-500">${f.sub} • ${f.stores} stores</div>
        </div>
      `;
    });
  } else {
    html += '<div class="col-span-2 text-gray-400 text-sm">No FS Manager data available</div>';
  }
  
  html += `
      </div>
      
      <h3 class="font-bold text-gray-700 mb-2">❄️ Open AHU/RTU Work Orders</h3>
      <div class="flex items-center gap-2 mb-2">
        <button onclick="copyManagerWOs('${mgr}')" class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
          📋 Copy All ${wos.length} WOs
        </button>
      </div>
  `;
  
  if (wos.length) {
    html += '<div class="max-h-60 overflow-y-auto"><table class="tbl text-sm"><thead><tr><th>Store</th><th>WO #</th><th>Problem</th><th>Age</th><th></th></tr></thead><tbody>';
    wos.sort((a, b) => b.age_days - a.age_days).forEach(w => {
      const ageColor = w.age_days > 14 ? '#ea1100' : w.age_days > 7 ? '#f47920' : '#2a8703';
      html += `<tr>
        <td class="font-mono">${w.store}</td>
        <td class="font-mono text-blue-600">${w.tracking}</td>
        <td>${w.problem}</td>
        <td class="font-bold" style="color: ${ageColor}">${w.age_days}d</td>
        <td><button onclick="copyWO('${w.tracking}')" class="text-blue-600 hover:text-blue-800">📋</button></td>
      </tr>`;
    });
    html += '</tbody></table></div>';
  } else {
    html += '<div class="text-green-600">✅ No open AHU/RTU work orders!</div>';
  }
  
  html += '</div>';
  document.getElementById('managerModalContent').innerHTML = html;
}

function drillDownFSM(mgr, fsm) {
  S.drillDownFSM = fsm;
  const fsmData = (S.fsManagers[mgr] || []).find(f => f.fsm === fsm);
  const stores = S.stores.filter(s => s.mgr === mgr && s.sub === fsmData?.sub);
  const wos = S.ahuRtu.filter(w => w.mgr === mgr && w.sub === fsmData?.sub);
  
  let html = `
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <button onclick="drillDownManager('${mgr}')" class="text-blue-600 hover:text-blue-800">&larr; Back</button>
        <h2 class="text-xl font-bold text-purple-700">👤 ${fsm}</h2>
      </div>
      <p class="text-gray-500 mb-4">Sub-Region: <strong>${fsmData?.sub || 'Unknown'}</strong> | Reports to: <strong>${mgr}</strong></p>
      
      <h3 class="font-bold text-gray-700 mb-2">🏢 Stores (${stores.length})</h3>
      <div class="max-h-80 overflow-y-auto mb-4">
        <table class="tbl text-sm"><thead><tr>
          <th>Store</th><th>City</th><th>Type</th><th>TnT</th><th>WOs</th>
        </tr></thead><tbody>
  `;
  
  stores.sort((a, b) => (a.tit || 0) - (b.tit || 0)).forEach(s => {
    const storeWOs = wos.filter(w => w.store === s.store);
    const color = getColor(s.tit);
    html += `<tr class="cursor-pointer hover:bg-blue-50" onclick="drillDownStore(${s.store})">
      <td class="font-mono font-bold" style="color: #0053e2">${s.store}</td>
      <td>${s.city}, ${s.state}</td>
      <td class="text-xs">${s.store_type}</td>
      <td class="font-bold" style="color: ${color}">${s.tit ? s.tit.toFixed(1) + '%' : 'N/A'}</td>
      <td class="font-bold ${storeWOs.length ? 'text-red-600' : 'text-green-600'}">${storeWOs.length || '✓'}</td>
    </tr>`;
  });
  
  html += '</tbody></table></div></div>';
  document.getElementById('managerModalContent').innerHTML = html;
}

function drillDownStore(store) {
  const s = S.stores.find(x => x.store === store);
  const wos = S.ahuRtu.filter(w => w.store === store);
  const comm = S.commLoss.filter(c => c.store === store);
  
  let html = `
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <button onclick="renderManagerDrillDown('${s?.mgr}')" class="text-blue-600 hover:text-blue-800">&larr; Back</button>
        <h2 class="text-xl font-bold">🏢 Store #${store}</h2>
      </div>
      <p class="text-gray-500 mb-4">${s?.city}, ${s?.state} | ${s?.store_type} | Sub: ${s?.sub}</p>
      
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold" style="color: ${getColor(s?.tit)}">${s?.tit ? s.tit.toFixed(1) + '%' : 'N/A'}</div>
          <div class="text-xs text-gray-500">TnT %</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-purple-700">${wos.length}</div>
          <div class="text-xs text-gray-500">Open WOs</div>
        </div>
        <div class="bg-orange-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-orange-700">${comm.length}</div>
          <div class="text-xs text-gray-500">Comm Loss</div>
        </div>
      </div>
  `;
  
  if (wos.length) {
    html += `
      <h3 class="font-bold text-gray-700 mb-2">❄️ Work Orders</h3>
      <button onclick="copyStoreWOs(${store})" class="mb-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
        📋 Copy ${wos.length} WOs
      </button>
      <table class="tbl text-sm"><thead><tr><th>Tracking #</th><th>Equipment</th><th>Problem</th><th>Age</th><th></th></tr></thead><tbody>
    `;
    wos.forEach(w => {
      const ageColor = w.age_days > 14 ? '#ea1100' : '#2a8703';
      html += `<tr>
        <td><a href="https://servicechannel.com/sc/wo/details/${w.tracking}" target="_blank" class="font-mono text-blue-600 hover:underline">${w.tracking}</a></td>
        <td>${w.equipment}</td>
        <td>${w.problem}</td>
        <td class="font-bold" style="color: ${ageColor}">${w.age_days}d</td>
        <td><button onclick="copyWO('${w.tracking}')" class="text-blue-600">📋</button></td>
      </tr>`;
    });
    html += '</tbody></table>';
  } else {
    html += '<div class="text-green-600">✅ No open work orders!</div>';
  }
  
  html += '</div>';
  document.getElementById('managerModalContent').innerHTML = html;
}

function copyManagerWOs(mgr) {
  const wos = S.ahuRtu.filter(w => w.mgr === mgr).map(w => w.tracking).join('\n');
  navigator.clipboard.writeText(wos);
  showToast(`📋 Copied ${S.ahuRtu.filter(w => w.mgr === mgr).length} WOs for ${mgr}`);
}

// ══════════════════════════════════════════════════════════════════════
// MODAL FUNCTIONS
// ══════════════════════════════════════════════════════════════════════
function showModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
    document.body.style.overflow = 'auto';
  }
});

// ══════════════════════════════════════════════════════════════════════
// KPI DRILL-DOWN (click on KPI cards)
// ══════════════════════════════════════════════════════════════════════
function drillDownKPI(type) {
  switch(type) {
    case 'below85':
      S.filterType = '';
      document.getElementById('searchInput').value = '';
      switchTab('ahurtu', document.querySelector('[data-tab="ahurtu"]'));
      showToast('🔍 Showing stores <85% TnT');
      break;
    case 'above95':
      // Show excellent stores
      showModal('kpiModal');
      renderKPIDrillDown('above95');
      break;
    case 'ahuRtu':
      switchTab('ahurtu', document.querySelector('[data-tab="ahurtu"]'));
      break;
    case 'aged14':
      switchTab('ahurtu', document.querySelector('[data-tab="ahurtu"]'));
      document.getElementById('ahuGroupBy').value = 'age';
      renderAhuRtu();
      showToast('🔍 Showing aged 14+ WOs');
      break;
    case 'commLoss':
      switchTab('commloss', document.querySelector('[data-tab="commloss"]'));
      break;
    case 'sams':
      switchTab('sams', document.querySelector('[data-tab="sams"]'));
      break;
  }
}

function renderKPIDrillDown(type) {
  const stores = getFilteredStores();
  let title = '';
  let filtered = [];
  
  if (type === 'above95') {
    title = '🏆 Stores ≥95% TnT (Excellence)';
    filtered = stores.filter(s => s.tit >= 95).sort((a, b) => b.tit - a.tit);
  } else if (type === 'below85') {
    title = '⚠️ Stores <85% TnT (Critical)';
    filtered = stores.filter(s => s.tit != null && s.tit < 85).sort((a, b) => a.tit - b.tit);
  }
  
  let html = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">${title}</h2>
        <button onclick="closeModal('kpiModal')" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      <p class="text-gray-500 mb-4">${filtered.length} stores</p>
      <div class="max-h-96 overflow-y-auto">
        <table class="tbl"><thead><tr><th>Store</th><th>City</th><th>Manager</th><th>TnT</th></tr></thead><tbody>
  `;
  
  filtered.forEach(s => {
    const color = getColor(s.tit);
    html += `<tr class="cursor-pointer hover:bg-blue-50" onclick="drillDownStore(${s.store})">
      <td class="font-mono font-bold" style="color: #0053e2">${s.store}</td>
      <td>${s.city}, ${s.state}</td>
      <td class="text-sm">${s.mgr}</td>
      <td class="font-bold" style="color: ${color}">${s.tit.toFixed(1)}%</td>
    </tr>`;
  });
  
  html += '</tbody></table></div></div>';
  document.getElementById('kpiModalContent').innerHTML = html;
}


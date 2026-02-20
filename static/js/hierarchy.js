/* Org Hierarchy Tab - hierarchy.js
   Drill-down from Sn Director → FM Director → Regional Manager → FSM → Tech
   🏢 THE ULTIMATE ORG CHART 🏢
*/

// ══════════════════════════════════════════════════════════════════════
// HIERARCHY STATE
// ══════════════════════════════════════════════════════════════════════
const HierarchyState = {
  orgHierarchy: {},
  hierarchySummary: [],
  selectedSnDirector: null,
  selectedFmDirector: null,
  selectedRegionalManager: null,
  selectedFsm: null,
  breadcrumb: [],
};

// ══════════════════════════════════════════════════════════════════════
// INITIALIZE
// ══════════════════════════════════════════════════════════════════════
function initHierarchyTab(data) {
  HierarchyState.orgHierarchy = data.org_hierarchy || {};
  HierarchyState.hierarchySummary = data.hierarchy_summary || [];
  console.log('🏢 Hierarchy tab initialized!');
}

// ══════════════════════════════════════════════════════════════════════
// RENDER HIERARCHY TAB
// ══════════════════════════════════════════════════════════════════════
function renderHierarchyTab() {
  const container = document.getElementById('hierarchyContent');
  if (!container) return;
  
  let html = `
    <div class="mb-6">
      <div id="hierarchyBreadcrumb" class="flex items-center gap-2 text-sm mb-4">
        ${renderBreadcrumb()}
      </div>
    </div>
    <div id="hierarchyDrillDown">
      ${renderCurrentLevel()}
    </div>
  `;
  
  container.innerHTML = html;
}

function renderBreadcrumb() {
  let crumbs = [
    `<button onclick="hierarchyGoToLevel('root')" class="text-blue-600 hover:text-blue-800 font-semibold">
      🏢 All Sn Directors
    </button>`
  ];
  
  if (HierarchyState.selectedSnDirector) {
    const sn = HierarchyState.orgHierarchy[HierarchyState.selectedSnDirector];
    crumbs.push(`<span class="text-gray-400">›</span>`);
    crumbs.push(`<button onclick="hierarchyGoToLevel('sn')" class="text-blue-600 hover:text-blue-800">
      👤 ${sn?.name || HierarchyState.selectedSnDirector}
    </button>`);
  }
  
  if (HierarchyState.selectedFmDirector) {
    const sn = HierarchyState.orgHierarchy[HierarchyState.selectedSnDirector];
    const fm = sn?.fm_directors?.[HierarchyState.selectedFmDirector];
    crumbs.push(`<span class="text-gray-400">›</span>`);
    crumbs.push(`<button onclick="hierarchyGoToLevel('fm')" class="text-purple-600 hover:text-purple-800">
      📊 ${fm?.name || HierarchyState.selectedFmDirector}
    </button>`);
  }
  
  if (HierarchyState.selectedRegionalManager) {
    const sn = HierarchyState.orgHierarchy[HierarchyState.selectedSnDirector];
    const fm = sn?.fm_directors?.[HierarchyState.selectedFmDirector];
    const rm = fm?.regional_managers?.[HierarchyState.selectedRegionalManager];
    crumbs.push(`<span class="text-gray-400">›</span>`);
    crumbs.push(`<button onclick="hierarchyGoToLevel('rm')" class="text-green-600 hover:text-green-800">
      👥 ${rm?.name || HierarchyState.selectedRegionalManager}
    </button>`);
  }
  
  if (HierarchyState.selectedFsm) {
    const sn = HierarchyState.orgHierarchy[HierarchyState.selectedSnDirector];
    const fm = sn?.fm_directors?.[HierarchyState.selectedFmDirector];
    const rm = fm?.regional_managers?.[HierarchyState.selectedRegionalManager];
    const fsm = rm?.fsms?.[HierarchyState.selectedFsm];
    crumbs.push(`<span class="text-gray-400">›</span>`);
    crumbs.push(`<span class="text-orange-600 font-semibold">
      🔧 ${fsm?.name || HierarchyState.selectedFsm}
    </span>`);
  }
  
  return crumbs.join('');
}

function renderCurrentLevel() {
  if (HierarchyState.selectedFsm) {
    return renderTechsLevel();
  }
  if (HierarchyState.selectedRegionalManager) {
    return renderFsmsLevel();
  }
  if (HierarchyState.selectedFmDirector) {
    return renderRegionalManagersLevel();
  }
  if (HierarchyState.selectedSnDirector) {
    return renderFmDirectorsLevel();
  }
  return renderSnDirectorsLevel();
}

// ══════════════════════════════════════════════════════════════════════
// LEVEL 1: SN DIRECTORS
// ══════════════════════════════════════════════════════════════════════
function renderSnDirectorsLevel() {
  const summary = HierarchyState.hierarchySummary;
  
  let html = `
    <h2 class="text-2xl font-bold text-gray-800 mb-4">🏢 Senior Directors</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  `;
  
  summary.forEach(sn => {
    const isCurrent = sn.id === 'BA';
    const cardClass = isCurrent 
      ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 ring-2 ring-yellow-300' 
      : 'border-blue-200 bg-white hover:border-blue-400';
    
    html += `
      <div class="card p-6 cursor-pointer border-2 ${cardClass} transition-all hover:shadow-lg"
           onclick="selectSnDirector('${sn.id}')">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            ${sn.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div class="font-bold text-gray-800">${sn.name}</div>
            <div class="text-sm text-gray-500">Sn Director • ${sn.region}</div>
            ${isCurrent ? '<span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">⭐ Your Director</span>' : ''}
          </div>
        </div>
        <div class="grid grid-cols-4 gap-2 text-center text-sm">
          <div class="bg-purple-50 rounded-lg p-2">
            <div class="font-bold text-purple-700">${sn.fm_directors}</div>
            <div class="text-xs text-gray-500">FM Dirs</div>
          </div>
          <div class="bg-green-50 rounded-lg p-2">
            <div class="font-bold text-green-700">${sn.regional_managers}</div>
            <div class="text-xs text-gray-500">RMs</div>
          </div>
          <div class="bg-orange-50 rounded-lg p-2">
            <div class="font-bold text-orange-700">${sn.fsms}</div>
            <div class="text-xs text-gray-500">FSMs</div>
          </div>
          <div class="bg-blue-50 rounded-lg p-2">
            <div class="font-bold text-blue-700">${sn.techs}</div>
            <div class="text-xs text-gray-500">Techs</div>
          </div>
        </div>
        <div class="mt-3 text-center text-sm text-gray-500">
          <span class="font-semibold text-blue-600">${sn.stores}</span> stores
        </div>
        <div class="mt-3 text-center text-blue-600 text-sm font-medium">
          Click to drill down →
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}

// ══════════════════════════════════════════════════════════════════════
// LEVEL 2: FM DIRECTORS
// ══════════════════════════════════════════════════════════════════════
function renderFmDirectorsLevel() {
  const sn = HierarchyState.orgHierarchy[HierarchyState.selectedSnDirector];
  if (!sn) return '<p>No data found</p>';
  
  const fmDirectors = sn.fm_directors || {};
  
  let html = `
    <h2 class="text-2xl font-bold text-gray-800 mb-2">📊 FM Directors under ${sn.name}</h2>
    <p class="text-gray-500 mb-4">Region: ${sn.region}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  `;
  
  Object.entries(fmDirectors).forEach(([fmId, fm]) => {
    const rmCount = Object.keys(fm.regional_managers || {}).length;
    let fsmCount = 0;
    let techCount = 0;
    let storeCount = 0;
    
    Object.values(fm.regional_managers || {}).forEach(rm => {
      storeCount += rm.stores || 0;
      fsmCount += Object.keys(rm.fsms || {}).length;
      Object.values(rm.fsms || {}).forEach(fsm => {
        techCount += (fsm.techs || []).length;
      });
    });
    
    const isFranky = fm.name === 'FRANKY GONZALEZ';
    const cardClass = isFranky 
      ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 ring-2 ring-purple-300' 
      : 'border-purple-200 bg-white hover:border-purple-400';
    
    html += `
      <div class="card p-6 cursor-pointer border-2 ${cardClass} transition-all hover:shadow-lg"
           onclick="selectFmDirector('${fmId}')">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
            ${fm.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div class="font-bold text-gray-800">${fm.name}</div>
            <div class="text-sm text-gray-500">${fm.title} • ${fm.region}</div>
            ${isFranky ? '<span class="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">⭐ Your FM</span>' : ''}
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center text-sm">
          <div class="bg-green-50 rounded-lg p-2">
            <div class="font-bold text-green-700">${rmCount}</div>
            <div class="text-xs text-gray-500">RMs</div>
          </div>
          <div class="bg-orange-50 rounded-lg p-2">
            <div class="font-bold text-orange-700">${fsmCount}</div>
            <div class="text-xs text-gray-500">FSMs</div>
          </div>
          <div class="bg-blue-50 rounded-lg p-2">
            <div class="font-bold text-blue-700">${techCount}</div>
            <div class="text-xs text-gray-500">Techs</div>
          </div>
        </div>
        <div class="mt-3 text-center text-sm text-gray-500">
          <span class="font-semibold text-purple-600">${storeCount}</span> stores
        </div>
        <div class="mt-3 text-center text-purple-600 text-sm font-medium">
          Click to see Regional Managers →
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}

// ══════════════════════════════════════════════════════════════════════
// LEVEL 3: REGIONAL MANAGERS
// ══════════════════════════════════════════════════════════════════════
function renderRegionalManagersLevel() {
  const sn = HierarchyState.orgHierarchy[HierarchyState.selectedSnDirector];
  const fm = sn?.fm_directors?.[HierarchyState.selectedFmDirector];
  if (!fm) return '<p>No data found</p>';
  
  const regionalManagers = fm.regional_managers || {};
  
  let html = `
    <h2 class="text-2xl font-bold text-gray-800 mb-2">👥 Regional Managers under ${fm.name}</h2>
    <p class="text-gray-500 mb-4">Region: ${fm.region}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  `;
  
  Object.entries(regionalManagers).forEach(([rmId, rm]) => {
    const fsmCount = Object.keys(rm.fsms || {}).length;
    let techCount = 0;
    Object.values(rm.fsms || {}).forEach(fsm => {
      techCount += (fsm.techs || []).length;
    });
    
    html += `
      <div class="card p-5 cursor-pointer border-2 border-green-200 bg-white hover:border-green-400 transition-all hover:shadow-lg"
           onclick="selectRegionalManager('${rmId}')">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
            ${rm.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div class="font-bold text-gray-800 text-sm">${rm.name}</div>
            <div class="text-xs text-gray-500">${rm.title}</div>
          </div>
        </div>
        <div class="text-xs text-gray-600 mb-3">
          Sub-regions: <span class="font-mono text-green-700">${(rm.sub_regions || []).join(', ')}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <div class="bg-blue-50 rounded p-1">
            <div class="font-bold text-blue-700">${rm.stores || 0}</div>
            <div class="text-gray-500">Stores</div>
          </div>
          <div class="bg-orange-50 rounded p-1">
            <div class="font-bold text-orange-700">${fsmCount}</div>
            <div class="text-gray-500">FSMs</div>
          </div>
          <div class="bg-purple-50 rounded p-1">
            <div class="font-bold text-purple-700">${techCount}</div>
            <div class="text-gray-500">Techs</div>
          </div>
        </div>
        <div class="mt-3 text-center text-green-600 text-xs font-medium">
          See FSMs →
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}

// ══════════════════════════════════════════════════════════════════════
// LEVEL 4: FSMs
// ══════════════════════════════════════════════════════════════════════
function renderFsmsLevel() {
  const sn = HierarchyState.orgHierarchy[HierarchyState.selectedSnDirector];
  const fm = sn?.fm_directors?.[HierarchyState.selectedFmDirector];
  const rm = fm?.regional_managers?.[HierarchyState.selectedRegionalManager];
  if (!rm) return '<p>No data found</p>';
  
  const fsms = rm.fsms || {};
  
  let html = `
    <h2 class="text-2xl font-bold text-gray-800 mb-2">🔧 Field Service Managers under ${rm.name}</h2>
    <p class="text-gray-500 mb-4">Sub-regions: ${(rm.sub_regions || []).join(', ')}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  `;
  
  Object.entries(fsms).forEach(([fsmId, fsm]) => {
    const techCount = (fsm.techs || []).length;
    const totalStores = fsm.techs?.reduce((sum, t) => sum + (t.stores?.length || 0), 0) || 0;
    
    html += `
      <div class="card p-5 cursor-pointer border-2 border-orange-200 bg-white hover:border-orange-400 transition-all hover:shadow-lg"
           onclick="selectFsm('${fsmId}')">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
            ${fsm.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div class="font-bold text-gray-800">${fsm.name}</div>
            <div class="text-xs text-gray-500">${fsm.title}</div>
          </div>
        </div>
        <div class="text-sm text-gray-600 mb-3">
          Sub-region: <span class="font-mono text-orange-700">${fsm.sub_region}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-center text-sm">
          <div class="bg-purple-50 rounded-lg p-2">
            <div class="font-bold text-purple-700">${techCount}</div>
            <div class="text-xs text-gray-500">Technicians</div>
          </div>
          <div class="bg-blue-50 rounded-lg p-2">
            <div class="font-bold text-blue-700">${totalStores}</div>
            <div class="text-xs text-gray-500">Stores</div>
          </div>
        </div>
        <div class="mt-3 text-center text-orange-600 text-sm font-medium">
          See Technicians →
        </div>
      </div>
    `;
  });
  
  if (Object.keys(fsms).length === 0) {
    html += '<div class="col-span-full text-center text-gray-500 py-8">No FSM data available for this Regional Manager</div>';
  }
  
  html += '</div>';
  return html;
}

// ══════════════════════════════════════════════════════════════════════
// LEVEL 5: TECHNICIANS
// ══════════════════════════════════════════════════════════════════════
function renderTechsLevel() {
  const sn = HierarchyState.orgHierarchy[HierarchyState.selectedSnDirector];
  const fm = sn?.fm_directors?.[HierarchyState.selectedFmDirector];
  const rm = fm?.regional_managers?.[HierarchyState.selectedRegionalManager];
  const fsm = rm?.fsms?.[HierarchyState.selectedFsm];
  if (!fsm) return '<p>No data found</p>';
  
  const techs = fsm.techs || [];
  
  let html = `
    <h2 class="text-2xl font-bold text-gray-800 mb-2">👷 Technicians under ${fsm.name}</h2>
    <p class="text-gray-500 mb-4">Sub-region: ${fsm.sub_region} • ${techs.length} technicians</p>
    <div class="overflow-x-auto">
      <table class="tbl">
        <thead>
          <tr>
            <th>Technician</th>
            <th>Title</th>
            <th>Stores Assigned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  techs.forEach(tech => {
    const stores = tech.stores || [];
    const storeLinks = stores.map(s => 
      `<a href="javascript:drillDownStore(${s})" class="text-blue-600 hover:underline font-mono">${s}</a>`
    ).join(', ');
    
    // Determine title color based on level
    const titleColor = tech.title.includes('III') ? 'text-green-700 bg-green-100' :
                       tech.title.includes('II') ? 'text-blue-700 bg-blue-100' :
                       'text-gray-700 bg-gray-100';
    
    html += `
      <tr class="hover:bg-gray-50">
        <td>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              ${tech.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span class="font-semibold">${tech.name}</span>
          </div>
        </td>
        <td><span class="px-2 py-1 rounded text-sm font-medium ${titleColor}">${tech.title}</span></td>
        <td class="text-sm">${storeLinks || 'None assigned'}</td>
        <td>
          <button onclick="filterMapByTech('${tech.name}')" class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            🗺️ View on Map
          </button>
        </td>
      </tr>
    `;
  });
  
  html += '</tbody></table></div>';
  return html;
}

// ══════════════════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════════════════
function selectSnDirector(snId) {
  HierarchyState.selectedSnDirector = snId;
  HierarchyState.selectedFmDirector = null;
  HierarchyState.selectedRegionalManager = null;
  HierarchyState.selectedFsm = null;
  renderHierarchyTab();
  showToast(`👤 Viewing ${HierarchyState.orgHierarchy[snId]?.name}`);
}

function selectFmDirector(fmId) {
  HierarchyState.selectedFmDirector = fmId;
  HierarchyState.selectedRegionalManager = null;
  HierarchyState.selectedFsm = null;
  renderHierarchyTab();
}

function selectRegionalManager(rmId) {
  HierarchyState.selectedRegionalManager = rmId;
  HierarchyState.selectedFsm = null;
  renderHierarchyTab();
}

function selectFsm(fsmId) {
  HierarchyState.selectedFsm = fsmId;
  renderHierarchyTab();
}

function hierarchyGoToLevel(level) {
  switch(level) {
    case 'root':
      HierarchyState.selectedSnDirector = null;
      HierarchyState.selectedFmDirector = null;
      HierarchyState.selectedRegionalManager = null;
      HierarchyState.selectedFsm = null;
      break;
    case 'sn':
      HierarchyState.selectedFmDirector = null;
      HierarchyState.selectedRegionalManager = null;
      HierarchyState.selectedFsm = null;
      break;
    case 'fm':
      HierarchyState.selectedRegionalManager = null;
      HierarchyState.selectedFsm = null;
      break;
    case 'rm':
      HierarchyState.selectedFsm = null;
      break;
  }
  renderHierarchyTab();
}

function filterMapByTech(techName) {
  showToast(`🗺️ Filtering map for ${techName}`);
  // This would filter the map to show only the tech's stores
  // For now just switch to map tab
  switchTab('map');
}

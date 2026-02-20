/* Team Report Tabs - team_report.js
   Role-based tabs showing Sn Director teams with full hierarchy
   🏢 COMPREHENSIVE TEAM VIEW 🏢
*/

// ══════════════════════════════════════════════════════════════════════
// TEAM REPORT STATE
// ══════════════════════════════════════════════════════════════════════
const TeamReportState = {
  activeRoleTab: 'sn-directors',
  selectedSnFilter: 'all',
  flattenedData: [],
};

// ══════════════════════════════════════════════════════════════════════
// FLATTEN HIERARCHY DATA
// ══════════════════════════════════════════════════════════════════════
function flattenHierarchy() {
  const hierarchy = HierarchyState.orgHierarchy;
  const flat = {
    snDirectors: [],
    fmDirectors: [],
    regionalManagers: [],
    fsms: [],
    techs: []
  };
  
  Object.entries(hierarchy).forEach(([snId, sn]) => {
    // Count totals for Sn Director
    let fmCount = 0, rmCount = 0, fsmCount = 0, techCount = 0, storeCount = 0;
    
    Object.entries(sn.fm_directors || {}).forEach(([fmId, fm]) => {
      fmCount++;
      let fmRmCount = 0, fmFsmCount = 0, fmTechCount = 0, fmStoreCount = 0;
      
      Object.entries(fm.regional_managers || {}).forEach(([rmId, rm]) => {
        rmCount++;
        fmRmCount++;
        let rmFsmCount = 0, rmTechCount = 0;
        storeCount += rm.stores || 0;
        fmStoreCount += rm.stores || 0;
        
        Object.entries(rm.fsms || {}).forEach(([fsmId, fsm]) => {
          fsmCount++;
          fmFsmCount++;
          rmFsmCount++;
          const techList = fsm.techs || [];
          techCount += techList.length;
          fmTechCount += techList.length;
          rmTechCount += techList.length;
          
          // Add FSM
          flat.fsms.push({
            id: fsmId,
            name: fsm.name,
            title: fsm.title,
            subRegion: fsm.sub_region,
            snDirector: sn.name,
            snId: snId,
            fmDirector: fm.name,
            regionalManager: rm.name,
            techCount: techList.length,
            stores: techList.reduce((sum, t) => sum + (t.stores?.length || 0), 0)
          });
          
          // Add Techs
          techList.forEach(tech => {
            flat.techs.push({
              name: tech.name,
              title: tech.title,
              stores: tech.stores || [],
              storeCount: (tech.stores || []).length,
              snDirector: sn.name,
              snId: snId,
              fmDirector: fm.name,
              regionalManager: rm.name,
              fsm: fsm.name,
              subRegion: fsm.sub_region
            });
          });
        });
        
        // Add Regional Manager
        flat.regionalManagers.push({
          id: rmId,
          name: rm.name,
          title: rm.title,
          subRegions: rm.sub_regions || [],
          snDirector: sn.name,
          snId: snId,
          fmDirector: fm.name,
          fsmCount: rmFsmCount,
          techCount: rmTechCount,
          stores: rm.stores || 0
        });
      });
      
      // Add FM Director
      flat.fmDirectors.push({
        id: fmId,
        name: fm.name,
        title: fm.title,
        region: fm.region,
        snDirector: sn.name,
        snId: snId,
        rmCount: fmRmCount,
        fsmCount: fmFsmCount,
        techCount: fmTechCount,
        stores: fmStoreCount
      });
    });
    
    // Add Sn Director
    flat.snDirectors.push({
      id: snId,
      name: sn.name,
      title: sn.title,
      region: sn.region,
      fmCount,
      rmCount,
      fsmCount,
      techCount,
      stores: storeCount,
      isCurrent: snId === 'BA'
    });
  });
  
  TeamReportState.flattenedData = flat;
  return flat;
}

// ══════════════════════════════════════════════════════════════════
// RENDER TEAM REPORT
// ══════════════════════════════════════════════════════════════════════
function renderTeamReport() {
  const container = document.getElementById('hierarchyContent');
  if (!container) return;
  
  // Flatten data if not already done
  if (!TeamReportState.flattenedData.snDirectors) {
    flattenHierarchy();
  }
  const data = TeamReportState.flattenedData;
  
  const tabs = [
    { id: 'sn-directors', label: '🏢 Sn Directors', count: data.snDirectors?.length || 0, color: 'blue' },
    { id: 'fm-directors', label: '📊 FM Directors', count: data.fmDirectors?.length || 0, color: 'purple' },
    { id: 'regional-managers', label: '👥 Regional Managers', count: data.regionalManagers?.length || 0, color: 'green' },
    { id: 'fsms', label: '🔧 FSMs', count: data.fsms?.length || 0, color: 'orange' },
    { id: 'techs', label: '👷 Technicians', count: data.techs?.length || 0, color: 'indigo' },
  ];
  
  let html = `
    <!-- Sn Director Filter -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <label class="font-semibold text-gray-700">Filter by Sn Director:</label>
        <select id="snDirectorFilter" onchange="filterTeamBySn(this.value)" 
                class="px-4 py-2 border-2 border-blue-200 rounded-lg font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100">
          <option value="all">All Sn Directors</option>
          ${data.snDirectors?.map(sn => 
            `<option value="${sn.id}" ${sn.isCurrent ? 'selected' : ''}>${sn.name} (${sn.region})</option>`
          ).join('')}
        </select>
      </div>
      <button onclick="exportTeamReport()" class="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
        📤 Export Report
      </button>
    </div>
    
    <!-- Role Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b-2 border-gray-200 pb-4">
      ${tabs.map(tab => `
        <button onclick="switchRoleTab('${tab.id}')" 
                id="roleTab-${tab.id}"
                class="role-tab px-4 py-2 rounded-lg font-semibold transition-all ${TeamReportState.activeRoleTab === tab.id 
                  ? `bg-${tab.color}-600 text-white shadow-lg` 
                  : `bg-${tab.color}-100 text-${tab.color}-700 hover:bg-${tab.color}-200`}">
          ${tab.label}
          <span class="ml-2 px-2 py-0.5 rounded-full text-xs ${TeamReportState.activeRoleTab === tab.id 
            ? 'bg-white/30' 
            : `bg-${tab.color}-200`}">${tab.count}</span>
        </button>
      `).join('')}
    </div>
    
    <!-- Content Area -->
    <div id="roleTabContent">
      ${renderRoleTabContent()}
    </div>
  `;
  
  container.innerHTML = html;
  
  // Apply initial filter
  if (TeamReportState.selectedSnFilter === 'all') {
    // Default to BA (your Sn Director)
    const baExists = data.snDirectors?.find(s => s.id === 'BA');
    if (baExists) {
      TeamReportState.selectedSnFilter = 'BA';
      document.getElementById('snDirectorFilter').value = 'BA';
      renderRoleContent();
    }
  }
}

function renderRoleTabContent() {
  switch(TeamReportState.activeRoleTab) {
    case 'sn-directors': return renderSnDirectorsTable();
    case 'fm-directors': return renderFmDirectorsTable();
    case 'regional-managers': return renderRegionalManagersTable();
    case 'fsms': return renderFsmsTable();
    case 'techs': return renderTechsTable();
    default: return renderSnDirectorsTable();
  }
}

function switchRoleTab(tabId) {
  TeamReportState.activeRoleTab = tabId;
  renderTeamReport();
}

function filterTeamBySn(snId) {
  TeamReportState.selectedSnFilter = snId;
  renderRoleContent();
}

function renderRoleContent() {
  const content = document.getElementById('roleTabContent');
  if (content) {
    content.innerHTML = renderRoleTabContent();
  }
}

// ══════════════════════════════════════════════════════════════════════
// SN DIRECTORS TABLE
// ══════════════════════════════════════════════════════════════════════
function renderSnDirectorsTable() {
  const data = TeamReportState.flattenedData.snDirectors || [];
  const filtered = TeamReportState.selectedSnFilter === 'all' 
    ? data 
    : data.filter(d => d.id === TeamReportState.selectedSnFilter);
  
  return `
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
      <h3 class="text-xl font-bold text-blue-800 mb-2">🏢 Senior Directors Overview</h3>
      <p class="text-gray-600">Top-level leadership overseeing Facilities Management regions</p>
    </div>
    <div class="overflow-x-auto">
      <table class="tbl w-full">
        <thead>
          <tr class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <th class="p-3 text-left">Sn Director</th>
            <th class="p-3 text-left">Region</th>
            <th class="p-3 text-center">FM Directors</th>
            <th class="p-3 text-center">Regional Mgrs</th>
            <th class="p-3 text-center">FSMs</th>
            <th class="p-3 text-center">Technicians</th>
            <th class="p-3 text-center">Total Stores</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(sn => `
            <tr class="${sn.isCurrent ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'hover:bg-gray-50'} cursor-pointer"
                onclick="filterTeamBySn('${sn.id}'); switchRoleTab('fm-directors');">
              <td class="p-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    ${sn.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div class="font-bold text-gray-800">${sn.name}</div>
                    <div class="text-xs text-gray-500">${sn.title}</div>
                    ${sn.isCurrent ? '<span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">⭐ Your Director</span>' : ''}
                  </div>
                </div>
              </td>
              <td class="p-3 font-semibold text-blue-700">${sn.region}</td>
              <td class="p-3 text-center"><span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">${sn.fmCount}</span></td>
              <td class="p-3 text-center"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">${sn.rmCount}</span></td>
              <td class="p-3 text-center"><span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold">${sn.fsmCount}</span></td>
              <td class="p-3 text-center"><span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">${sn.techCount}</span></td>
              <td class="p-3 text-center font-bold text-blue-600">${sn.stores}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="p-3" colspan="2">TOTALS</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.fmCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.rmCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.fsmCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.techCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.stores, 0)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="mt-4 text-sm text-gray-500 text-center">Click a row to view that Sn Director's team</div>
  `;
}

// ══════════════════════════════════════════════════════════════════════
// FM DIRECTORS TABLE
// ══════════════════════════════════════════════════════════════════════
function renderFmDirectorsTable() {
  const data = TeamReportState.flattenedData.fmDirectors || [];
  const filtered = TeamReportState.selectedSnFilter === 'all' 
    ? data 
    : data.filter(d => d.snId === TeamReportState.selectedSnFilter);
  
  const snName = TeamReportState.selectedSnFilter === 'all' ? 'All Sn Directors' : 
    (TeamReportState.flattenedData.snDirectors?.find(s => s.id === TeamReportState.selectedSnFilter)?.name || '');
  
  return `
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
      <h3 class="text-xl font-bold text-purple-800 mb-2">📊 FM Directors under ${snName}</h3>
      <p class="text-gray-600">Facilities Management Directors responsible for regional operations</p>
    </div>
    <div class="overflow-x-auto">
      <table class="tbl w-full">
        <thead>
          <tr class="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <th class="p-3 text-left">FM Director</th>
            <th class="p-3 text-left">Region</th>
            <th class="p-3 text-left">Reports To</th>
            <th class="p-3 text-center">Regional Mgrs</th>
            <th class="p-3 text-center">FSMs</th>
            <th class="p-3 text-center">Technicians</th>
            <th class="p-3 text-center">Stores</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? '<tr><td colspan="7" class="p-8 text-center text-gray-500">No FM Directors found for this filter</td></tr>' : 
            filtered.map(fm => {
              const isFranky = fm.name === 'FRANKY GONZALEZ';
              return `
                <tr class="${isFranky ? 'bg-purple-50 border-l-4 border-purple-400' : 'hover:bg-gray-50'} cursor-pointer"
                    onclick="filterTeamBySn('${fm.snId}'); switchRoleTab('regional-managers');">
                  <td class="p-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                        ${fm.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div class="font-bold text-gray-800">${fm.name}</div>
                        <div class="text-xs text-gray-500">${fm.title}</div>
                        ${isFranky ? '<span class="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">⭐ Your FM</span>' : ''}
                      </div>
                    </div>
                  </td>
                  <td class="p-3 font-semibold text-purple-700">${fm.region}</td>
                  <td class="p-3 text-sm text-gray-600">${fm.snDirector}</td>
                  <td class="p-3 text-center"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">${fm.rmCount}</span></td>
                  <td class="p-3 text-center"><span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold">${fm.fsmCount}</span></td>
                  <td class="p-3 text-center"><span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">${fm.techCount}</span></td>
                  <td class="p-3 text-center font-bold text-purple-600">${fm.stores}</td>
                </tr>
              `;
            }).join('')
          }
        </tbody>
        ${filtered.length > 0 ? `
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="p-3" colspan="3">TOTALS (${filtered.length} FM Directors)</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.rmCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.fsmCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.techCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.stores, 0)}</td>
          </tr>
        </tfoot>` : ''}
      </table>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════════════
// REGIONAL MANAGERS TABLE
// ══════════════════════════════════════════════════════════════════════
function renderRegionalManagersTable() {
  const data = TeamReportState.flattenedData.regionalManagers || [];
  const filtered = TeamReportState.selectedSnFilter === 'all' 
    ? data 
    : data.filter(d => d.snId === TeamReportState.selectedSnFilter);
  
  const snName = TeamReportState.selectedSnFilter === 'all' ? 'All Sn Directors' : 
    (TeamReportState.flattenedData.snDirectors?.find(s => s.id === TeamReportState.selectedSnFilter)?.name || '');
  
  return `
    <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 mb-4">
      <h3 class="text-xl font-bold text-green-800 mb-2">👥 Regional Managers under ${snName}</h3>
      <p class="text-gray-600">Field leadership managing FSMs and technicians across sub-regions</p>
    </div>
    <div class="overflow-x-auto">
      <table class="tbl w-full">
        <thead>
          <tr class="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <th class="p-3 text-left">Regional Manager</th>
            <th class="p-3 text-left">Sub-Regions</th>
            <th class="p-3 text-left">FM Director</th>
            <th class="p-3 text-left">Sn Director</th>
            <th class="p-3 text-center">FSMs</th>
            <th class="p-3 text-center">Technicians</th>
            <th class="p-3 text-center">Stores</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? '<tr><td colspan="7" class="p-8 text-center text-gray-500">No Regional Managers found for this filter</td></tr>' : 
            filtered.map(rm => `
              <tr class="hover:bg-gray-50 cursor-pointer" onclick="switchRoleTab('fsms');">
                <td class="p-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                      ${rm.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div class="font-bold text-gray-800">${rm.name}</div>
                      <div class="text-xs text-gray-500">${rm.title}</div>
                    </div>
                  </div>
                </td>
                <td class="p-3">
                  <div class="flex flex-wrap gap-1">
                    ${rm.subRegions.map(sr => `<span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-mono">${sr}</span>`).join('')}
                  </div>
                </td>
                <td class="p-3 text-sm text-gray-600">${rm.fmDirector}</td>
                <td class="p-3 text-sm text-gray-600">${rm.snDirector}</td>
                <td class="p-3 text-center"><span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold">${rm.fsmCount}</span></td>
                <td class="p-3 text-center"><span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">${rm.techCount}</span></td>
                <td class="p-3 text-center font-bold text-green-600">${rm.stores}</td>
              </tr>
            `).join('')
          }
        </tbody>
        ${filtered.length > 0 ? `
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="p-3" colspan="4">TOTALS (${filtered.length} Regional Managers)</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.fsmCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.techCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.stores, 0)}</td>
          </tr>
        </tfoot>` : ''}
      </table>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════════════
// FSMS TABLE
// ══════════════════════════════════════════════════════════════════════
function renderFsmsTable() {
  const data = TeamReportState.flattenedData.fsms || [];
  const filtered = TeamReportState.selectedSnFilter === 'all' 
    ? data 
    : data.filter(d => d.snId === TeamReportState.selectedSnFilter);
  
  const snName = TeamReportState.selectedSnFilter === 'all' ? 'All Sn Directors' : 
    (TeamReportState.flattenedData.snDirectors?.find(s => s.id === TeamReportState.selectedSnFilter)?.name || '');
  
  return `
    <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4">
      <h3 class="text-xl font-bold text-orange-800 mb-2">🔧 Field Service Managers under ${snName}</h3>
      <p class="text-gray-600">Front-line supervisors managing HVAC technicians</p>
    </div>
    <div class="overflow-x-auto">
      <table class="tbl w-full">
        <thead>
          <tr class="bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <th class="p-3 text-left">FSM</th>
            <th class="p-3 text-left">Sub-Region</th>
            <th class="p-3 text-left">Regional Manager</th>
            <th class="p-3 text-left">FM Director</th>
            <th class="p-3 text-center">Technicians</th>
            <th class="p-3 text-center">Stores</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? '<tr><td colspan="6" class="p-8 text-center text-gray-500">No FSMs found for this filter</td></tr>' : 
            filtered.map(fsm => `
              <tr class="hover:bg-gray-50 cursor-pointer" onclick="switchRoleTab('techs');">
                <td class="p-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                      ${fsm.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div class="font-bold text-gray-800">${fsm.name}</div>
                      <div class="text-xs text-gray-500">${fsm.title}</div>
                    </div>
                  </div>
                </td>
                <td class="p-3"><span class="px-2 py-1 bg-orange-100 text-orange-700 rounded font-mono">${fsm.subRegion}</span></td>
                <td class="p-3 text-sm text-gray-600">${fsm.regionalManager}</td>
                <td class="p-3 text-sm text-gray-600">${fsm.fmDirector}</td>
                <td class="p-3 text-center"><span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">${fsm.techCount}</span></td>
                <td class="p-3 text-center font-bold text-orange-600">${fsm.stores}</td>
              </tr>
            `).join('')
          }
        </tbody>
        ${filtered.length > 0 ? `
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="p-3" colspan="4">TOTALS (${filtered.length} FSMs)</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.techCount, 0)}</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.stores, 0)}</td>
          </tr>
        </tfoot>` : ''}
      </table>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════════════
// TECHNICIANS TABLE
// ══════════════════════════════════════════════════════════════════════
function renderTechsTable() {
  const data = TeamReportState.flattenedData.techs || [];
  const filtered = TeamReportState.selectedSnFilter === 'all' 
    ? data 
    : data.filter(d => d.snId === TeamReportState.selectedSnFilter);
  
  const snName = TeamReportState.selectedSnFilter === 'all' ? 'All Sn Directors' : 
    (TeamReportState.flattenedData.snDirectors?.find(s => s.id === TeamReportState.selectedSnFilter)?.name || '');
  
  // Group by title for summary
  const byTitle = {};
  filtered.forEach(t => {
    byTitle[t.title] = (byTitle[t.title] || 0) + 1;
  });
  
  return `
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
      <h3 class="text-xl font-bold text-indigo-800 mb-2">👷 Technicians under ${snName}</h3>
      <p class="text-gray-600">HVAC technicians performing field work</p>
      <div class="flex gap-4 mt-3">
        ${Object.entries(byTitle).map(([title, count]) => {
          const color = title.includes('III') ? 'green' : title.includes('II') ? 'blue' : 'gray';
          return `<span class="px-3 py-1 bg-${color}-100 text-${color}-700 rounded-full text-sm font-semibold">${title}: ${count}</span>`;
        }).join('')}
      </div>
    </div>
    <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
      <table class="tbl w-full">
        <thead class="sticky top-0">
          <tr class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <th class="p-3 text-left">Technician</th>
            <th class="p-3 text-left">Title</th>
            <th class="p-3 text-left">FSM</th>
            <th class="p-3 text-left">Sub-Region</th>
            <th class="p-3 text-left">Regional Manager</th>
            <th class="p-3 text-center">Stores</th>
            <th class="p-3 text-left">Store Numbers</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? '<tr><td colspan="7" class="p-8 text-center text-gray-500">No Technicians found for this filter</td></tr>' : 
            filtered.map(tech => {
              const titleColor = tech.title.includes('III') ? 'green' : tech.title.includes('II') ? 'blue' : 'gray';
              return `
                <tr class="hover:bg-gray-50">
                  <td class="p-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        ${tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span class="font-semibold text-gray-800">${tech.name}</span>
                    </div>
                  </td>
                  <td class="p-3"><span class="px-2 py-1 bg-${titleColor}-100 text-${titleColor}-700 rounded text-sm font-medium">${tech.title}</span></td>
                  <td class="p-3 text-sm text-gray-600">${tech.fsm}</td>
                  <td class="p-3"><span class="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-mono">${tech.subRegion}</span></td>
                  <td class="p-3 text-sm text-gray-600">${tech.regionalManager}</td>
                  <td class="p-3 text-center"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">${tech.storeCount}</span></td>
                  <td class="p-3 text-xs">
                    <div class="flex flex-wrap gap-1">
                      ${tech.stores.slice(0, 6).map(s => 
                        `<a href="javascript:drillDownStore(${s})" class="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded hover:bg-blue-100 font-mono">${s}</a>`
                      ).join('')}
                      ${tech.stores.length > 6 ? `<span class="text-gray-400">+${tech.stores.length - 6} more</span>` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')
          }
        </tbody>
        ${filtered.length > 0 ? `
        <tfoot class="bg-gray-100 font-bold sticky bottom-0">
          <tr>
            <td class="p-3" colspan="5">TOTALS (${filtered.length} Technicians)</td>
            <td class="p-3 text-center">${filtered.reduce((s,d) => s + d.storeCount, 0)}</td>
            <td class="p-3"></td>
          </tr>
        </tfoot>` : ''}
      </table>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════════
function exportTeamReport() {
  const data = TeamReportState.flattenedData;
  const filter = TeamReportState.selectedSnFilter;
  const snName = filter === 'all' ? 'All' : data.snDirectors?.find(s => s.id === filter)?.name || filter;
  
  let csv = `HVAC WtW Team Report - ${snName}\n`;
  csv += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  // Sn Directors
  csv += 'SN DIRECTORS\n';
  csv += 'Name,Region,FM Directors,Regional Managers,FSMs,Technicians,Stores\n';
  const snFiltered = filter === 'all' ? data.snDirectors : data.snDirectors.filter(d => d.id === filter);
  snFiltered.forEach(d => {
    csv += `${d.name},${d.region},${d.fmCount},${d.rmCount},${d.fsmCount},${d.techCount},${d.stores}\n`;
  });
  
  csv += '\nFM DIRECTORS\n';
  csv += 'Name,Region,Sn Director,Regional Managers,FSMs,Technicians,Stores\n';
  const fmFiltered = filter === 'all' ? data.fmDirectors : data.fmDirectors.filter(d => d.snId === filter);
  fmFiltered.forEach(d => {
    csv += `${d.name},${d.region},${d.snDirector},${d.rmCount},${d.fsmCount},${d.techCount},${d.stores}\n`;
  });
  
  csv += '\nREGIONAL MANAGERS\n';
  csv += 'Name,Sub-Regions,FM Director,Sn Director,FSMs,Technicians,Stores\n';
  const rmFiltered = filter === 'all' ? data.regionalManagers : data.regionalManagers.filter(d => d.snId === filter);
  rmFiltered.forEach(d => {
    csv += `${d.name},"${d.subRegions.join('; ')}",${d.fmDirector},${d.snDirector},${d.fsmCount},${d.techCount},${d.stores}\n`;
  });
  
  csv += '\nFSMs\n';
  csv += 'Name,Sub-Region,Regional Manager,FM Director,Technicians,Stores\n';
  const fsmFiltered = filter === 'all' ? data.fsms : data.fsms.filter(d => d.snId === filter);
  fsmFiltered.forEach(d => {
    csv += `${d.name},${d.subRegion},${d.regionalManager},${d.fmDirector},${d.techCount},${d.stores}\n`;
  });
  
  csv += '\nTECHNICIANS\n';
  csv += 'Name,Title,FSM,Sub-Region,Regional Manager,Stores,Store Numbers\n';
  const techFiltered = filter === 'all' ? data.techs : data.techs.filter(d => d.snId === filter);
  techFiltered.forEach(d => {
    csv += `${d.name},${d.title},${d.fsm},${d.subRegion},${d.regionalManager},${d.storeCount},"${d.stores.join('; ')}"\n`;
  });
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `team_report_${snName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📤 Team report exported!');
}

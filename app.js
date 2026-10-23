/**
 * Training & Lecturer Dashboard Application Logic
 * Powered by Time Intelligence & Interactive Visualizations
 */

// Global window functions for detail modal handling (available immediately)
window.openClassModalById = function(id) {
  if (typeof id === 'undefined' || id === null) return;
  const numId = Number(id);
  const found = (typeof allClasses !== 'undefined' && Array.isArray(allClasses)) ? allClasses.find(x => x.id === numId) : null;
  if (found) {
    window.openModal(found);
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeModal();
    if (typeof window.closeGvModal === 'function') window.closeGvModal();
  }
});

window.openModal = function(c) {
  if (!c) return;
  const modal = document.getElementById('detailModal');
  if (!modal) return;

  const elemCode = document.getElementById('modalClassCode');
  const elemName = document.getElementById('modalClassName');
  const elemContent = document.getElementById('modalGridContent');

  if (elemCode) elemCode.textContent = c.ma_lop || c.ma_ct || 'Chi tiết lớp học';
  if (elemName) elemName.textContent = c.ten_ct || 'Chi tiết lớp học';

  const planned = c.hv_kh || 0;
  const actual = c.hv_thuc_te || 0;
  const rate = planned > 0 ? ((actual / planned) * 100).toFixed(1) : '0.0';
  const startDate = c.ngay_bd_raw || c.ngay_bd || 'Chưa có';
  const endDate = c.ngay_kt_raw || c.ngay_kt || 'Chưa có';
  const timeStr = `${startDate} — ${endDate}`;
  const fmtText = (typeof getDisplayFormat === 'function') ? getDisplayFormat(c) : (c.hinh_thuc_dt || c.hinh_thuc_hoc || 'Trực tiếp');

  if (elemContent) {
    elemContent.innerHTML = `
      <div class="modal-item">
        <label><i class="fa-solid fa-barcode" style="margin-right: 0.3rem;"></i> Mã Lớp / Mã CT</label>
        <span style="color: var(--brand-crimson); font-weight: 800;">${c.ma_lop || c.ma_ct || 'Chưa có mã'}</span>
      </div>

      <div class="modal-item">
        <label><i class="fa-solid fa-shapes" style="margin-right: 0.3rem;"></i> Hình Thức Đào Tạo</label>
        <span>${fmtText}</span>
      </div>

      <div class="modal-item">
        <label><i class="fa-solid fa-location-dot" style="margin-right: 0.3rem;"></i> Địa Điểm Tổ Chức</label>
        <span>${c.dia_diem || 'Chưa cập nhật'}</span>
      </div>

      <div class="modal-item">
        <label><i class="fa-regular fa-calendar-days" style="margin-right: 0.3rem;"></i> Thời Gian Diễn Ra</label>
        <span>${timeStr}</span>
      </div>

      <div class="modal-item">
        <label><i class="fa-solid fa-user-group" style="margin-right: 0.3rem;"></i> HV Kế Hoạch (Triệu Tập)</label>
        <span style="font-weight: 800; color: #0EA5E9;">${planned.toLocaleString()} học viên</span>
      </div>

      <div class="modal-item">
        <label><i class="fa-solid fa-graduation-cap" style="margin-right: 0.3rem;"></i> HV Thực Tế Tham Dự</label>
        <span style="font-weight: 800; color: var(--brand-crimson);">${actual.toLocaleString()} học viên</span>
      </div>

      <div class="modal-item">
        <label><i class="fa-solid fa-chart-pie" style="margin-right: 0.3rem;"></i> Tỉ Lệ Tham Dự</label>
        <span style="font-weight: 800; color: #059669;">${rate}%</span>
      </div>

      <div class="modal-item">
        <label><i class="fa-solid fa-user-tie" style="margin-right: 0.3rem;"></i> Cán Bộ Quản Lý Lớp</label>
        <span>${c.can_bo_ql || 'Chưa phân công'}</span>
      </div>

      ${c.loai_ct ? `
      <div class="modal-item full-width">
        <label><i class="fa-solid fa-layer-group" style="margin-right: 0.3rem;"></i> Loại / Đối Tượng Chương Trình</label>
        <span>${c.loai_ct}</span>
      </div>` : ''}

      ${c.noi_dung_giang ? `
      <div class="modal-item full-width">
        <label><i class="fa-solid fa-book-open" style="margin-right: 0.3rem;"></i> Nội Dung Giảng Dạy Chi Tiết</label>
        <span style="white-space: pre-line; font-weight: 500; font-size: 0.85rem; line-height: 1.5;">${c.noi_dung_giang}</span>
      </div>` : ''}
    `;
  }

  modal.classList.add('active');
  modal.style.setProperty('display', 'flex', 'important');
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';
};

window.closeModal = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const modal = document.getElementById('detailModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.setProperty('display', 'none', 'important');
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }
};

window.closeModalOnOverlay = function(e) {
  if (e && e.target && e.target.id === 'detailModal') {
    window.closeModal(e);
  }
};

window.closeGvModal = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const modal = document.getElementById('lecturerDetailModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.setProperty('display', 'none', 'important');
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }
};

window.closeGvModalOnOverlay = function(e) {
  if (e && e.target && e.target.id === 'lecturerDetailModal') {
    window.closeGvModal(e);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Helper to get Today's Date in Hanoi GMT+7 timezone (YYYY-MM-DD)
  function getTodayGMT7Str() {
    try {
      const d = new Date();
      const year = d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric' });
      const month = d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', month: '2-digit' });
      const day = d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit' });
      return `${year}-${month}-${day}`;
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  }

  const TODAY_STR = getTodayGMT7Str();

  // Active View State ('overview' | 'lecturer')
  let activeView = 'overview';

  // State Management for Class Overview
  let allClasses = [];
  let filteredClasses = [];

  // State Management for Lecturer View
  let allGvItems = [];
  let filteredGvItems = [];
  let gvCurrentSort = { column: 'so_tiet', dir: 'desc' };

  let gvState = {
    nguon: '',
    hocHam: '',
    donVi: '',
    hinhThuc: '',
    searchQuery: ''
  };

  // Shared Date Filter State - Default to Hôm nay (Original Behavior)
  let state = {
    preset: 'today',
    startDate: TODAY_STR,
    endDate: TODAY_STR,
    location: '',
    format: '',
    programType: '',
    status: '',
    searchQuery: ''
  };

  let currentSort = { column: 'ngay_bd', dir: 'asc' };

  // Chart Instances
  let charts = {
    classAttendance: null,
    programAttendance: null,
    location: null,
    attendanceGauge: null
  };

  let gvCharts = {
    topTiet: null,
    structure: null,
    criteria: null,
    partner: null
  };

  // Securely obfuscated endpoints to protect underlying Google Sheets from direct scrapers
  const _EP_CLASS = 'aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4akdKam5qMTFPb2M1ZjN5VEI4U1ppMThHRDYtYUc0RHFzdUYzSTVNQXNYY2R3YTNqM194T2RfZnBscmtQeG1tTkUvZXhlYw==';
  const _EP_GV = 'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMW5HdUV1d3Zkb0MtaS1GZmJEd0lmR3ZfQ29hZUliLTY2OEZyMnR1Z1MxVzQvZXhwb3J0P2Zvcm1hdD1jc3YmZ2lkPTE5MDM4NDcyNTE=';

  function safeDecode(str) {
    try {
      if (typeof window !== 'undefined' && typeof window.atob === 'function') {
        return window.atob(str);
      }
      if (typeof atob === 'function') return atob(str);
      if (typeof Buffer !== 'undefined') return Buffer.from(str, 'base64').toString('utf-8');
    } catch (e) {}
    return '';
  }

  function getDefaultClassUrl() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_URL);
      if (stored && stored.includes('script.google.com')) {
        return stored;
      }
      return safeDecode(_EP_CLASS);
    } catch (e) {
      return safeDecode(_EP_CLASS);
    }
  }

  function getDefaultGvUrl() {
    try {
      return safeDecode(_EP_GV);
    } catch (e) {
      return '';
    }
  }
  
  const STORAGE_KEY_URL = 'dashboard_google_sheet_url';
  const STORAGE_KEY_DATA = 'dashboard_synced_data';
  const STORAGE_KEY_GV_DATA = 'dashboard_synced_gv_data';

  let isSyncing = false;

  // 1. Initialize Application
  initApp();

  async function initApp() {
    let loadedClasses = null;
    let loadedGvItems = null;

    // Load Class Data
    try {
      const savedDataStr = localStorage.getItem(STORAGE_KEY_DATA);
      if (savedDataStr) {
        const parsed = JSON.parse(savedDataStr);
        if (Array.isArray(parsed) && parsed.length > 0) loadedClasses = parsed;
      }
    } catch (e) {
      console.warn("Could not read localStorage class data:", e);
    }

    if (!loadedClasses && typeof RAW_DATA !== 'undefined' && Array.isArray(RAW_DATA)) {
      loadedClasses = RAW_DATA;
    }

    if (loadedClasses) {
      allClasses = loadedClasses.filter(item => item.is_class);
    }

    // Load Lecturer Data
    try {
      const savedGvStr = localStorage.getItem(STORAGE_KEY_GV_DATA);
      if (savedGvStr) {
        const parsedGv = JSON.parse(savedGvStr);
        if (Array.isArray(parsedGv) && parsedGv.length > 0) loadedGvItems = parsedGv;
      }
    } catch (e) {
      console.warn("Could not read localStorage gv data:", e);
    }

    if (!loadedGvItems && typeof RAW_GV_DATA !== 'undefined' && Array.isArray(RAW_GV_DATA)) {
      loadedGvItems = RAW_GV_DATA;
    }

    if (loadedGvItems) {
      allGvItems = loadedGvItems;
    }

    setupDashboard();
    initTabNavigation();

    // Background sync from Google Sheets if online
    try {
      syncGoogleSheetData(getDefaultClassUrl(), { silent: true });
      syncGvGoogleSheetData(getDefaultGvUrl(), { silent: true });
    } catch (e) {
      console.warn("Background sheet sync skipped:", e);
    }
  }

  // --- TAB NAVIGATION ---
  function initTabNavigation() {
    document.querySelectorAll('.screen-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.screen;
        if (!targetId) return;

        document.querySelectorAll('.screen-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.screen-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.classList.add('active');

        if (targetId === 'screenClassStatus') {
          activeView = 'overview';
          applyFilters();
        }
      });
    });
  }

  function getDisplayFormat(c) {
    if (!c) return 'Trực tiếp';
    const raw = (c.hinh_thuc_hoc || c.hinh_thuc_dt || 'Trực tiếp').trim();
    const rawLower = raw.toLowerCase();

    // Nếu dữ liệu gốc đã ghi rõ là kết hợp
    if (rawLower.includes('kết hợp')) {
      return 'Trực tiếp kết hợp Trực tuyến';
    }

    // Nếu dòng này là Trực tuyến
    if (rawLower.includes('tuyến') || rawLower.includes('online')) {
      const maLop = (c.ma_lop || '').trim();
      if (maLop && typeof allClasses !== 'undefined' && Array.isArray(allClasses)) {
        // Kiểm tra xem cùng mã lớp này có dòng nào là Trực tiếp không
        const hasDirectSibling = allClasses.some(x => {
          if (!x.ma_lop || x.ma_lop.trim() !== maLop) return false;
          const sibFmt = (x.hinh_thuc_hoc || x.hinh_thuc_dt || '').toLowerCase();
          return sibFmt.includes('tiếp') && !sibFmt.includes('tuyến');
        });

        if (hasDirectSibling) {
          return 'Trực tiếp kết hợp Trực tuyến';
        }
      }
      return 'Trực tuyến';
    }

    // Nếu là Trực tiếp
    return 'Trực tiếp';
  }

  function getFormatBadge(c) {
    const text = getDisplayFormat(c);
    const lower = text.toLowerCase();
    if (lower.includes('kết hợp') || (lower.includes('tiếp') && lower.includes('tuyến'))) {
      return `<span class="badge-format-hybrid"><i class="fa-solid fa-shapes"></i> ${text.toUpperCase()}</span>`;
    } else if (lower.includes('tuyến') || lower.includes('online')) {
      return `<span class="badge-format-online"><i class="fa-solid fa-desktop"></i> ${text.toUpperCase()}</span>`;
    } else {
      return `<span class="badge-format-direct"><i class="fa-solid fa-user-group"></i> ${text.toUpperCase()}</span>`;
    }
  }

  function setupDashboard() {
    const startInp = document.getElementById('startDate');
    const endInp = document.getElementById('endDate');
    if (startInp) startInp.value = state.startDate;
    if (endInp) endInp.value = state.endDate;

    populateFilterDropdowns();
    populateGvFilterDropdowns();
    attachEventListeners();
    attachGvEventListeners();

    // Set initial preset pill active state
    document.querySelectorAll('.preset-pills .pill').forEach(p => {
      if (p.dataset.preset === state.preset) p.classList.add('active');
      else p.classList.remove('active');
    });

    applyFilters();
    applyGvFilters();
  }

  // Populate Dropdowns for Class Overview
  function populateFilterDropdowns() {
    const locSelect = document.getElementById('filterLocation');
    const fmtSelect = document.getElementById('filterFormat');
    const progSelect = document.getElementById('filterProgramType');

    if (!locSelect || !fmtSelect || !progSelect) return;

    const locations = [...new Set(allClasses.map(c => c.dia_diem).filter(Boolean))].sort();
    const formats = [...new Set(allClasses.map(c => getDisplayFormat(c)).filter(Boolean))].sort();
    const programTypes = [...new Set(allClasses.map(c => c.loai_ct).filter(Boolean))].sort();

    locSelect.innerHTML = '<option value="">-- Tất cả Địa điểm --</option>';
    fmtSelect.innerHTML = '<option value="">-- Tất cả Hình thức --</option>';
    progSelect.innerHTML = '<option value="">-- Tất cả Loại chương trình --</option>';

    locations.forEach(loc => {
      const opt = document.createElement('option');
      opt.value = loc;
      opt.textContent = loc;
      locSelect.appendChild(opt);
    });

    formats.forEach(fmt => {
      const opt = document.createElement('option');
      opt.value = fmt;
      opt.textContent = fmt;
      fmtSelect.appendChild(opt);
    });

    programTypes.forEach(pt => {
      const opt = document.createElement('option');
      opt.value = pt;
      opt.textContent = pt.length > 35 ? pt.substring(0, 35) + '...' : pt;
      opt.title = pt;
      progSelect.appendChild(opt);
    });
  }

  // Populate Dropdowns for Lecturer View
  function populateGvFilterDropdowns() {
    const donViSelect = document.getElementById('filterGvDonVi');
    const hinhThucSelect = document.getElementById('filterGvHinhThuc');

    if (!donViSelect || !hinhThucSelect) return;

    const donVis = [...new Set(allGvItems.map(item => item.don_vi).filter(Boolean))].sort();
    const hinhThucs = [...new Set(allGvItems.map(item => item.hinh_thuc_hoc).filter(Boolean))].sort();

    donViSelect.innerHTML = '<option value="">-- Tất cả Đơn vị / Đối tác --</option>';
    hinhThucSelect.innerHTML = '<option value="">-- Tất cả Hình thức --</option>';

    donVis.forEach(dv => {
      const opt = document.createElement('option');
      opt.value = dv;
      opt.textContent = dv;
      donViSelect.appendChild(opt);
    });

    hinhThucs.forEach(ht => {
      const opt = document.createElement('option');
      opt.value = ht;
      opt.textContent = ht;
      hinhThucSelect.appendChild(opt);
    });

    // Update Header Badge Count
    const uniqueGvNames = new Set(allGvItems.map(x => x.ten_gv).filter(Boolean));
    const badge = document.getElementById('gvBadgeCount');
    if (badge) badge.textContent = `${uniqueGvNames.size} GV`;
  }

  function parseGvDateISO(str) {
    if (!str) return '';
    const parts = str.trim().split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  // Filter Class Overview
  function applyFilters() {
    filteredClasses = allClasses.filter(c => {
      if (state.startDate || state.endDate) {
        const classStart = c.ngay_bd;
        const classEnd = c.ngay_kt;

        if (!classStart || !classEnd) return false;
        if (state.endDate && classStart > state.endDate) return false;
        if (state.startDate && classEnd < state.startDate) return false;
      }

      if (state.location && c.dia_diem !== state.location) return false;
      if (state.format && getDisplayFormat(c) !== state.format) return false;
      if (state.programType && c.loai_ct !== state.programType) return false;

      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchMaLop = (c.ma_lop || '').toLowerCase().includes(q);
        const matchTenCt = (c.ten_ct || '').toLowerCase().includes(q);
        const matchMaCt = (c.ma_ct || '').toLowerCase().includes(q);
        const matchCanBo = (c.can_bo_ql || '').toLowerCase().includes(q);
        if (!matchMaLop && !matchTenCt && !matchMaCt && !matchCanBo) return false;
      }

      return true;
    });

    updateKPIs();
    renderCharts();
    renderTable();
  }

  // Filter Lecturer View
  function applyGvFilters() {
    filteredGvItems = allGvItems.filter(item => {
      if (state.startDate || state.endDate) {
        const startISO = parseGvDateISO(item.ngay_bat_dau);
        const endISO = parseGvDateISO(item.ngay_ket_thuc);

        if (startISO && state.endDate && startISO > state.endDate) return false;
        if (endISO && state.startDate && endISO < state.startDate) return false;
      }

      if (gvState.nguon) {
        if ((item.nguon_gv || '').trim().toLowerCase() !== gvState.nguon.toLowerCase()) return false;
      }

      if (gvState.hocHam) {
        const hh = (item.hoc_ham_hoc_vi || '').trim().toLowerCase();
        if (gvState.hocHam === 'GS_PGS') {
          if (!hh.includes('gs') && !hh.includes('pgs')) return false;
        } else if (gvState.hocHam === 'TS') {
          if (!hh.includes('ts') && !hh.includes('tiến sĩ')) return false;
          if (hh.includes('pgs')) return false;
        } else if (gvState.hocHam === 'ThS') {
          if (!hh.includes('ths') && !hh.includes('thạc sĩ')) return false;
        } else if (gvState.hocHam === 'LS') {
          if (!hh.includes('luật sư') && !hh.includes('ls')) return false;
        } else if (gvState.hocHam === 'Khac') {
          if (hh.includes('ts') || hh.includes('ths') || hh.includes('gs') || hh.includes('pgs') || hh.includes('ls')) return false;
        }
      }

      if (gvState.donVi && item.don_vi !== gvState.donVi) return false;
      if (gvState.hinhThuc && item.hinh_thuc_hoc !== gvState.hinhThuc) return false;

      if (gvState.searchQuery) {
        const q = gvState.searchQuery.toLowerCase();
        const matchName = (item.ten_gv || '').toLowerCase().includes(q);
        const matchMaGv = (item.ma_gv || '').toLowerCase().includes(q);
        const matchNoiDung = (item.noi_dung_giang || '').toLowerCase().includes(q);
        const matchLop = (item.ma_lop || '').toLowerCase().includes(q);
        const matchCt = (item.chuong_trinh || '').toLowerCase().includes(q);
        const matchDonVi = (item.don_vi || '').toLowerCase().includes(q);
        if (!matchName && !matchMaGv && !matchNoiDung && !matchLop && !matchCt && !matchDonVi) return false;
      }

      return true;
    });

    updateGvKPIs();
    renderGvCharts();
    renderGvTable();
  }

  // --- CLASS OVERVIEW METRICS & CHARTS ---
  function updateKPIs() {
    const uniquePrograms = new Set(filteredClasses.map(c => c.ma_ct).filter(Boolean));
    const totalPlanned = filteredClasses.reduce((sum, c) => sum + (c.hv_kh || 0), 0);
    const totalActual = filteredClasses.reduce((sum, c) => sum + (c.hv_thuc_te || 0), 0);
    const attendanceRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : '0.0';

    const elemProg = document.getElementById('kpiProgramCount');
    const elemClass = document.getElementById('kpiClassCount');
    const elemPlanned = document.getElementById('kpiPlannedHV');
    const elemActual = document.getElementById('kpiActualHV');
    const elemRate = document.getElementById('kpiAttendanceRate');

    if (elemProg) elemProg.textContent = uniquePrograms.size;
    const uniqueClasses = new Set(filteredClasses.map(c => c.ma_lop || c.ten_ct).filter(Boolean));
    if (elemClass) elemClass.textContent = uniqueClasses.size;
    if (elemPlanned) elemPlanned.textContent = totalPlanned.toLocaleString();
    if (elemActual) elemActual.textContent = totalActual.toLocaleString();
    if (elemRate) elemRate.textContent = attendanceRate;

    renderAttendanceGaugeChart(attendanceRate);
  }

  function renderAttendanceGaugeChart(rateValue) {
    const ctx = document.getElementById('gaugeAttendanceChart');
    if (!ctx) return;

    if (charts.attendanceGauge) {
      charts.attendanceGauge.destroy();
    }

    const val = parseFloat(rateValue) || 0;
    const cappedVal = Math.min(100, Math.max(0, val));
    const remainingVal = 100 - cappedVal;

    let activeColor = '#059669';
    if (cappedVal < 50) activeColor = '#EF4444';
    else if (cappedVal < 75) activeColor = '#F59E0B';

    charts.attendanceGauge = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [cappedVal, remainingVal],
          backgroundColor: [activeColor, '#E2E8F0'],
          borderWidth: 0,
          borderRadius: 4
        }]
      },
      options: {
        rotation: -90,
        circumference: 180,
        cutout: '76%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }

  function renderCharts() {
    renderClassAttendanceChart();
    renderProgramAttendanceList();
  }

  function renderClassAttendanceChart() {
    const ctx = document.getElementById('classAttendanceChart');
    if (!ctx) return;

    if (charts.classAttendance) {
      charts.classAttendance.destroy();
    }

    // Group & Aggregate by Class Code (ma_lop)
    const classMap = {};
    filteredClasses.forEach(c => {
      const code = c.ma_lop || c.ten_ct || 'Lớp';
      if (!classMap[code]) {
        classMap[code] = {
          code: code,
          ngay_bd: c.ngay_bd || '',
          planned: 0,
          actual: 0
        };
      } else {
        if (c.ngay_bd && (!classMap[code].ngay_bd || c.ngay_bd < classMap[code].ngay_bd)) {
          classMap[code].ngay_bd = c.ngay_bd;
        }
      }
      classMap[code].planned += (c.hv_kh || 0);
      classMap[code].actual += (c.hv_thuc_te || 0);
    });

    const aggregatedClasses = Object.values(classMap).sort((a, b) => (a.ngay_bd || '').localeCompare(b.ngay_bd || ''));
    const labels = aggregatedClasses.map(c => c.code);
    const plannedData = aggregatedClasses.map(c => c.planned);
    const actualData = aggregatedClasses.map(c => c.actual);

    const scrollInner = document.getElementById('classChartScrollInner');
    const maxVisibleClasses = 9;

    if (scrollInner) {
      if (labels.length > maxVisibleClasses) {
        const widthPercent = (labels.length / maxVisibleClasses) * 100;
        scrollInner.style.width = `${widthPercent}%`;
      } else {
        scrollInner.style.width = '100%';
      }
    }

    const smartDataLabelsPlugin = {
      id: 'smartDataLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const meta0 = chart.getDatasetMeta(0);
        const meta1 = chart.getDatasetMeta(1);
        if (!meta0 || !meta1 || meta0.hidden || meta1.hidden) return;

        const data0 = chart.data.datasets[0].data;
        const data1 = chart.data.datasets[1].data;

        ctx.save();
        ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        data0.forEach((v0, i) => {
          const v1 = data1[i];
          const el0 = meta0.data[i];
          const el1 = meta1.data[i];

          const has0 = v0 !== undefined && v0 !== null && v0 > 0;
          const has1 = v1 !== undefined && v1 !== null && v1 > 0;

          if (!has0 && !has1) return;

          let y0Offset = 4;
          let y1Offset = 4;

          if (has0 && has1 && el0 && el1) {
            const diffY = Math.abs(el0.y - el1.y);
            if (diffY < 14) {
              if (el0.y <= el1.y) {
                y0Offset = 7;
                y1Offset = 3;
              } else {
                y0Offset = 3;
                y1Offset = 7;
              }
            }
          }

          if (has0 && el0) {
            ctx.fillStyle = '#044E3A';
            ctx.fillText(v0.toLocaleString(), el0.x, el0.y - y0Offset);
          }

          if (has1 && el1) {
            ctx.fillStyle = '#A31D36';
            ctx.fillText(v1.toLocaleString(), el1.x, el1.y - y1Offset);
          }
        });

        ctx.restore();
      }
    };

    charts.classAttendance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'HV Kế hoạch',
            data: plannedData,
            backgroundColor: '#044E3A',
            borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 },
            maxBarThickness: 18,
            categoryPercentage: 0.65,
            barPercentage: 0.98
          },
          {
            label: 'HV Thực tế',
            data: actualData,
            backgroundColor: '#A31D36',
            borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 },
            maxBarThickness: 18,
            categoryPercentage: 0.65,
            barPercentage: 0.98
          }
        ]
      },
      plugins: [smartDataLabelsPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
              font: { size: 12, weight: '700' },
              color: '#1F2937'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#27272A',
            titleFont: { weight: '700' },
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 10, weight: '600' },
              color: '#64748B',
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            grace: '12%',
            ticks: {
              stepSize: 35,
              color: '#94A3B8',
              font: { size: 12 }
            },
            grid: {
              color: '#F1F5F9',
              borderDash: [3, 3],
              drawBorder: false
            }
          }
        }
      }
    });
  }

  function renderProgramAttendanceList() {
    const container = document.getElementById('programAttendanceList');
    if (!container) return;

    const progMap = {};
    filteredClasses.forEach(c => {
      const code = c.ma_ct || 'Khác';
      if (!progMap[code]) {
        progMap[code] = { name: c.ten_ct || code, planned: 0, actual: 0 };
      }
      progMap[code].planned += (c.hv_kh || 0);
      progMap[code].actual += (c.hv_thuc_te || 0);
    });

    const progList = Object.keys(progMap).map(k => {
      const item = progMap[k];
      const rate = item.planned > 0 ? (item.actual / item.planned) * 100 : 0;
      return { code: k, name: item.name, planned: item.planned, actual: item.actual, rate: rate };
    }).sort((a, b) => b.rate - a.rate);

    if (progList.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">Không có dữ liệu</div>`;
      return;
    }

    container.innerHTML = progList.map(p => `
      <div class="program-progress-item" style="margin-bottom: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; font-size: 0.825rem; font-weight: 700; margin-bottom: 0.25rem;">
          <div style="color: var(--text-primary); white-space: normal; word-break: break-word; flex: 1;">
            <span style="color: var(--brand-crimson); font-weight: 800;">${p.code}</span>
            <div style="font-size: 0.775rem; font-weight: 500; color: var(--text-secondary); margin-top: 2px; white-space: normal; word-break: break-word; line-height: 1.35;">${p.name}</div>
          </div>
          <span style="color: #059669; white-space: nowrap; font-weight: 800; margin-left: 0.5rem;">${p.rate.toFixed(1)}% (${p.actual}/${p.planned})</span>
        </div>
        <div style="height: 8px; background: #E5E7EB; border-radius: 4px; overflow: hidden; margin-top: 0.25rem;">
          <div style="height: 100%; background: linear-gradient(90deg, #059669 0%, #10B981 100%); width: ${Math.min(100, p.rate)}%;"></div>
        </div>
      </div>
    `).join('');
  }

  function renderTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    const sorted = [...filteredClasses].sort((a, b) => {
      let valA = a[currentSort.column] || '';
      let valB = b[currentSort.column] || '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return currentSort.dir === 'asc' ? valA - valB : valB - valA;
      }
      return currentSort.dir === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });

    const elemFilt = document.getElementById('tableFilteredCount');
    const elemTot = document.getElementById('tableTotalCount');
    const elemScrollMode = document.getElementById('scrollModeTotalCount');

    if (elemFilt) elemFilt.textContent = sorted.length;
    if (elemTot) elemTot.textContent = allClasses.length;
    if (elemScrollMode) elemScrollMode.textContent = sorted.length;

    if (sorted.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Không có lớp học nào thỏa mãn điều kiện lọc.</td></tr>`;
      return;
    }

    tbody.innerHTML = sorted.map(c => {
      const rate = c.hv_kh > 0 ? ((c.hv_thuc_te / c.hv_kh) * 100).toFixed(1) : '0.0';
      const badge = getFormatBadge(c);
      const jsonStr = JSON.stringify(c).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

      return `
        <tr onclick='window.openModal(${jsonStr})' style="cursor: pointer;">
          <td style="max-width: 380px; min-width: 220px; white-space: normal; word-break: break-word;">
            <div style="font-weight: 800; color: var(--brand-crimson);">${c.ma_lop || 'Chưa có mã'}</div>
            <div class="cell-program-name" style="font-size: 0.8rem; color: var(--text-secondary); white-space: normal; word-break: break-word; line-height: 1.35; margin-top: 3px;">${c.ten_ct || ''}</div>
          </td>
          <td>${badge}</td>
          <td style="white-space: normal; word-break: break-word;">
            <div style="font-weight: 600;">${c.dia_diem || 'N/A'}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted);">${c.ngay_bd_raw || ''} - ${c.ngay_kt_raw || ''}</div>
          </td>
          <td style="text-align: center; font-weight: 600;">${c.hv_kh || 0}</td>
          <td style="text-align: center; font-weight: 700; color: var(--brand-crimson);">${c.hv_thuc_te || 0}</td>
          <td style="text-align: center;">
            <span style="font-weight: 800; color: #059669;">${rate}%</span>
          </td>
          <td style="white-space: normal; word-break: break-word;">${c.can_bo_ql || 'N/A'}</td>
        </tr>
      `;
    }).join('');
  }

  // --- LECTURER METRICS & CHARTS ---
  function getLecturerAggregates() {
    const map = {};

    filteredGvItems.forEach(item => {
      const name = (item.ten_gv || '').trim();
      if (!name) return;

      if (!map[name]) {
        map[name] = {
          ten_gv: name,
          hoc_ham_hoc_vi: item.hoc_ham_hoc_vi || '',
          nguon_gv: item.nguon_gv || '',
          don_vi: item.don_vi || '',
          chuc_danh: item.chuc_danh || '',
          so_tiet: 0,
          assignments: 0,
          classes: new Set(),
          ktcm_pts: 0, ktcm_votes: 0,
          knsp_pts: 0, knsp_votes: 0,
          tdtp_pts: 0, tdtp_votes: 0,
          history: []
        };
      }

      const l = map[name];
      l.so_tiet += (item.so_tiet || 0);
      l.assignments += 1;
      if (item.ma_lop) l.classes.add(item.ma_lop);
      if (item.hoc_ham_hoc_vi && !l.hoc_ham_hoc_vi) l.hoc_ham_hoc_vi = item.hoc_ham_hoc_vi;
      if (item.nguon_gv && !l.nguon_gv) l.nguon_gv = item.nguon_gv;
      if (item.don_vi && !l.don_vi) l.don_vi = item.don_vi;

      const c5_kt = item.c5_ktcm || 0, c4_kt = item.c4_ktcm || 0, c3_kt = item.c3_ktcm || 0, c2_kt = item.c2_ktcm || 0, c1_kt = item.c1_ktcm || 0;
      const c5_sp = item.c5_knsp || 0, c4_sp = item.c4_knsp || 0, c3_sp = item.c3_knsp || 0, c2_sp = item.c2_knsp || 0, c1_sp = item.c1_knsp || 0;
      const c5_td = item.c5_tdtp || 0, c4_td = item.c4_tdtp || 0, c3_td = item.c3_tdtp || 0, c2_td = item.c2_tdtp || 0, c1_td = item.c1_tdtp || 0;

      l.ktcm_pts += 5*c5_kt + 4*c4_kt + 3*c3_kt + 2*c2_kt + 1*c1_kt;
      l.ktcm_votes += c5_kt + c4_kt + c3_kt + c2_kt + c1_kt;

      l.knsp_pts += 5*c5_sp + 4*c4_sp + 3*c3_sp + 2*c2_sp + 1*c1_sp;
      l.knsp_votes += c5_sp + c4_sp + c3_sp + c2_sp + c1_sp;

      l.tdtp_pts += 5*c5_td + 4*c4_td + 3*c3_td + 2*c2_td + 1*c1_td;
      l.tdtp_votes += c5_td + c4_td + c3_td + c2_td + c1_td;

      l.history.push(item);
    });

    return Object.values(map).map(l => {
      const avg_ktcm = l.ktcm_votes > 0 ? l.ktcm_pts / l.ktcm_votes : 0;
      const avg_knsp = l.knsp_votes > 0 ? l.knsp_pts / l.knsp_votes : 0;
      const avg_tdtp = l.tdtp_votes > 0 ? l.tdtp_pts / l.tdtp_votes : 0;
      const avg_all = (avg_ktcm > 0 && avg_knsp > 0 && avg_tdtp > 0) ? (avg_ktcm + avg_knsp + avg_tdtp) / 3 : (avg_ktcm || avg_knsp || avg_tdtp || 0);

      return {
        ...l,
        class_count: l.classes.size,
        avg_ktcm: avg_ktcm,
        avg_knsp: avg_knsp,
        avg_tdtp: avg_tdtp,
        avg_all: avg_all
      };
    });
  }

  function updateGvKPIs() {
    const aggs = getLecturerAggregates();
    const totalGv = aggs.length;

    let internalCount = 0;
    let externalCount = 0;
    let totalTiet = 0;
    let totalAssignments = filteredGvItems.length;

    aggs.forEach(g => {
      totalTiet += g.so_tiet;
      const nguon = (g.nguon_gv || '').toLowerCase();
      if (nguon.includes('agribank') || nguon.includes('nội bộ')) internalCount++;
      else externalCount++;
    });

    const avgTietPerGv = totalGv > 0 ? (totalTiet / totalGv).toFixed(1) : '0.0';
    const externalRatio = totalGv > 0 ? ((externalCount / totalGv) * 100).toFixed(1) : '0.0';
    const internalRatio = totalGv > 0 ? ((internalCount / totalGv) * 100).toFixed(1) : '0.0';

    let overallPts = 0, overallVotes = 0;
    aggs.forEach(g => {
      overallPts += g.ktcm_pts + g.knsp_pts + g.tdtp_pts;
      overallVotes += g.ktcm_votes + g.knsp_votes + g.tdtp_votes;
    });
    const avgRatingScore = overallVotes > 0 ? (overallPts / overallVotes).toFixed(2) : '0.00';

    const elemGvTot = document.getElementById('kpiGvTotalCount');
    const elemNguonSub = document.getElementById('kpiGvNguonSubtext');
    const elemGvTiet = document.getElementById('kpiGvTotalTiet');
    const elemAvgTietSub = document.getElementById('kpiGvAvgTietSubtext');
    const elemAssign = document.getElementById('kpiGvAssignments');
    const elemRating = document.getElementById('kpiGvAvgRating');
    const elemExtRatio = document.getElementById('kpiGvExternalRatio');
    const elemIntSub = document.getElementById('kpiGvInternalSubtext');

    if (elemGvTot) elemGvTot.textContent = totalGv;
    if (elemNguonSub) elemNguonSub.textContent = `${internalCount} Nội bộ / ${externalCount} Mời ngoài`;
    if (elemGvTiet) elemGvTiet.textContent = totalTiet.toLocaleString();
    if (elemAvgTietSub) elemAvgTietSub.textContent = `TB ${avgTietPerGv} tiết/Giảng viên`;
    if (elemAssign) elemAssign.textContent = totalAssignments.toLocaleString();
    if (elemRating) elemRating.textContent = avgRatingScore;
    if (elemExtRatio) elemExtRatio.textContent = externalRatio;
    if (elemIntSub) elemIntSub.textContent = `Nội bộ Agribank: ${internalRatio}%`;
  }

  function renderGvCharts() {
    renderGvTopTietChart();
    renderGvStructureChart();
    renderGvCriteriaChart();
    renderGvPartnerChart();
  }

  function renderGvTopTietChart() {
    const ctx = document.getElementById('gvTopTietChart');
    if (!ctx) return;

    if (gvCharts.topTiet) gvCharts.topTiet.destroy();

    const aggs = getLecturerAggregates().sort((a, b) => b.so_tiet - a.so_tiet).slice(0, 15);
    const labels = aggs.map(g => g.ten_gv);
    const data = aggs.map(g => g.so_tiet);
    const bgColors = aggs.map(g => (g.nguon_gv || '').toLowerCase().includes('agribank') ? '#AE1C3F' : '#10B981');

    gvCharts.topTiet = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Số tiết giảng dạy',
          data: data,
          backgroundColor: bgColors,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const item = aggs[ctx.dataIndex];
                return `${item.so_tiet} tiết (${item.nguon_gv || 'N/A'}, ${item.don_vi || 'N/A'}) - Đánh giá: ${item.avg_all.toFixed(2)}/5.0`;
              }
            }
          }
        },
        scales: {
          x: { beginAtZero: true, title: { display: true, text: 'Số tiết' } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  function renderGvStructureChart() {
    const ctx = document.getElementById('gvStructureChart');
    if (!ctx) return;

    if (gvCharts.structure) gvCharts.structure.destroy();

    const aggs = getLecturerAggregates();
    let internal = 0, external = 0;
    aggs.forEach(g => {
      if ((g.nguon_gv || '').toLowerCase().includes('agribank')) internal++;
      else external++;
    });

    gvCharts.structure = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Nội bộ Agribank', 'Mời ngoài'],
        datasets: [{
          data: [internal, external],
          backgroundColor: ['#AE1C3F', '#10B981'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw} Giảng viên (${((ctx.raw / (internal + external || 1)) * 100).toFixed(1)}%)`
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  function renderGvCriteriaChart() {
    const ctx = document.getElementById('gvCriteriaChart');
    if (!ctx) return;

    if (gvCharts.criteria) gvCharts.criteria.destroy();

    const aggs = getLecturerAggregates().sort((a, b) => b.so_tiet - a.so_tiet).slice(0, 8);
    const labels = aggs.map(g => g.ten_gv);
    const ktcmData = aggs.map(g => g.avg_ktcm.toFixed(2));
    const knspData = aggs.map(g => g.avg_knsp.toFixed(2));
    const tdtpData = aggs.map(g => g.avg_tdtp.toFixed(2));

    gvCharts.criteria = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'KT Chuyên môn', data: ktcmData, backgroundColor: '#2563EB', borderRadius: 4 },
          { label: 'KN Sư phạm', data: knspData, backgroundColor: '#10B981', borderRadius: 4 },
          { label: 'Thái độ, Tác phong', data: tdtpData, backgroundColor: '#F59E0B', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { min: 3.5, max: 5.0 }
        }
      }
    });
  }

  function renderGvPartnerChart() {
    const ctx = document.getElementById('gvPartnerChart');
    if (!ctx) return;

    if (gvCharts.partner) gvCharts.partner.destroy();

    const partnerMap = {};
    filteredGvItems.forEach(item => {
      const dv = item.don_vi || 'Khác';
      if (!partnerMap[dv]) partnerMap[dv] = { count: 0, tiet: 0 };
      partnerMap[dv].count += 1;
      partnerMap[dv].tiet += (item.so_tiet || 0);
    });

    const sortedPartners = Object.keys(partnerMap).map(k => ({
      name: k,
      tiet: partnerMap[k].tiet,
      count: partnerMap[k].count
    })).sort((a, b) => b.tiet - a.tiet).slice(0, 10);

    const labels = sortedPartners.map(p => p.name);
    const data = sortedPartners.map(p => p.tiet);

    gvCharts.partner = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Tổng số tiết',
          data: data,
          backgroundColor: '#D97706',
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true },
          y: { grid: { display: false } }
        }
      }
    });
  }

  function renderGvTable() {
    const tbody = document.getElementById('gvTableBody');
    if (!tbody) return;

    const sorted = [...filteredGvItems].sort((a, b) => {
      let valA = a[gvCurrentSort.column] || '';
      let valB = b[gvCurrentSort.column] || '';

      if (gvCurrentSort.column.startsWith('avg_')) {
        const getScore = (item, type) => {
          if (type === 'avg_ktcm') {
            const votes = (item.c5_ktcm||0)+(item.c4_ktcm||0)+(item.c3_ktcm||0)+(item.c2_ktcm||0)+(item.c1_ktcm||0);
            return votes > 0 ? (5*(item.c5_ktcm||0) + 4*(item.c4_ktcm||0) + 3*(item.c3_ktcm||0) + 2*(item.c2_ktcm||0) + 1*(item.c1_ktcm||0))/votes : 0;
          }
          if (type === 'avg_knsp') {
            const votes = (item.c5_knsp||0)+(item.c4_knsp||0)+(item.c3_knsp||0)+(item.c2_knsp||0)+(item.c1_knsp||0);
            return votes > 0 ? (5*(item.c5_knsp||0) + 4*(item.c4_knsp||0) + 3*(item.c3_knsp||0) + 2*(item.c2_knsp||0) + 1*(item.c1_knsp||0))/votes : 0;
          }
          if (type === 'avg_tdtp') {
            const votes = (item.c5_tdtp||0)+(item.c4_tdtp||0)+(item.c3_tdtp||0)+(item.c2_tdtp||0)+(item.c1_tdtp||0);
            return votes > 0 ? (5*(item.c5_tdtp||0) + 4*(item.c4_tdtp||0) + 3*(item.c3_tdtp||0) + 2*(item.c2_tdtp||0) + 1*(item.c1_tdtp||0))/votes : 0;
          }
          const s1 = getScore(item, 'avg_ktcm'), s2 = getScore(item, 'avg_knsp'), s3 = getScore(item, 'avg_tdtp');
          return (s1+s2+s3)/3;
        };
        valA = getScore(a, gvCurrentSort.column);
        valB = getScore(b, gvCurrentSort.column);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return gvCurrentSort.dir === 'asc' ? valA - valB : valB - valA;
      }
      return gvCurrentSort.dir === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });

    const elemFilt = document.getElementById('gvTableFilteredCount');
    const elemTot = document.getElementById('gvTableTotalCount');
    const elemScrollMode = document.getElementById('gvScrollModeTotalCount');

    if (elemFilt) elemFilt.textContent = sorted.length;
    if (elemTot) elemTot.textContent = allGvItems.length;
    if (elemScrollMode) elemScrollMode.textContent = sorted.length;

    if (sorted.length === 0) {
      tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--text-muted); padding: 2rem;">Không tìm thấy dữ liệu Giảng viên phù hợp.</td></tr>`;
      return;
    }

    tbody.innerHTML = sorted.map(item => {
      const isInternal = (item.nguon_gv || '').toLowerCase().includes('agribank');
      const nguonBadge = isInternal
        ? `<span class="badge badge-agribank"><i class="fa-solid fa-building-columns"></i> Agribank</span>`
        : `<span class="badge badge-external"><i class="fa-solid fa-user-tie"></i> Mời ngoài</span>`;

      const degreeStr = (item.hoc_ham_hoc_vi || '').trim();
      const degreeBadge = degreeStr ? `<span class="badge badge-degree">${degreeStr}</span>` : '';

      const calcScore = (c5, c4, c3, c2, c1) => {
        const v = c5+c4+c3+c2+c1;
        return v > 0 ? (5*c5 + 4*c4 + 3*c3 + 2*c2 + 1*c1)/v : 0;
      };

      const sKtcm = calcScore(item.c5_ktcm||0, item.c4_ktcm||0, item.c3_ktcm||0, item.c2_ktcm||0, item.c1_ktcm||0);
      const sKnsp = calcScore(item.c5_knsp||0, item.c4_knsp||0, item.c3_knsp||0, item.c2_knsp||0, item.c1_knsp||0);
      const sTdtp = calcScore(item.c5_tdtp||0, item.c4_tdtp||0, item.c3_tdtp||0, item.c2_tdtp||0, item.c1_tdtp||0);
      const sAvg = (sKtcm > 0 && sKnsp > 0 && sTdtp > 0) ? (sKtcm + sKnsp + sTdtp) / 3 : (sKtcm || sKnsp || sTdtp || 0);

      const pillClass = sAvg >= 4.6 ? 'rating-high' : (sAvg >= 4.0 ? 'rating-med' : 'rating-low');

      return `
        <tr>
          <td>
            <div style="font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.35rem;">
              ${item.ten_gv || 'N/A'} ${degreeBadge}
            </div>
            <div style="font-size: 0.775rem; color: var(--text-muted);">${item.chuc_danh || item.phong_ban || ''}</div>
          </td>
          <td>${nguonBadge}</td>
          <td>
            <div style="font-weight: 600;">${item.don_vi || 'N/A'}</div>
          </td>
          <td>
            <div style="font-weight: 700; color: var(--brand-crimson);">${item.ma_lop || 'N/A'}</div>
            <div style="font-size: 0.775rem; color: var(--text-secondary);">${item.chuong_trinh || ''}</div>
          </td>
          <td>
            <!-- Rule: Display original raw format string -->
            <span class="badge" style="background: #F3F4F6; color: #374151;">${item.hinh_thuc_hoc || 'Trực tiếp'}</span>
          </td>
          <td style="text-align: center; font-weight: 800; color: var(--text-primary);">${item.so_tiet || 0}</td>
          <td style="text-align: center; font-weight: 600;">${sKtcm > 0 ? sKtcm.toFixed(2) : '--'}</td>
          <td style="text-align: center; font-weight: 600;">${sKnsp > 0 ? sKnsp.toFixed(2) : '--'}</td>
          <td style="text-align: center; font-weight: 600;">${sTdtp > 0 ? sTdtp.toFixed(2) : '--'}</td>
          <td style="text-align: center;">
            <span class="rating-pill ${pillClass}">${sAvg > 0 ? sAvg.toFixed(2) : '--'} <i class="fa-solid fa-star" style="font-size: 0.7rem;"></i></span>
          </td>
          <td style="text-align: center;">
            <button class="btn" onclick="window.openGvModal('${(item.ten_gv||'').replace(/'/g, "\\'")}')" style="padding: 0.3rem 0.6rem; font-size: 0.775rem; background: #EEF2FF; color: #4F46E5; border: 1px solid #C7D2FE;">
              <i class="fa-solid fa-id-card"></i> Hồ sơ
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- LECTURER PROFILE MODAL ---
  window.openGvModal = function(gvName) {
    if (!gvName) return;

    const matches = allGvItems.filter(item => (item.ten_gv || '').trim().toLowerCase() === gvName.trim().toLowerCase());
    if (matches.length === 0) return;

    const first = matches[0];
    const isInternal = (first.nguon_gv || '').toLowerCase().includes('agribank');

    const elemName = document.getElementById('gvModalName');
    const elemOrg = document.getElementById('gvModalOrg');
    if (elemName) elemName.textContent = first.ten_gv || 'Giảng viên';
    if (elemOrg) elemOrg.textContent = `${first.don_vi || 'N/A'} ${first.chuc_danh ? '• ' + first.chuc_danh : ''}`;

    const degreeBadge = document.getElementById('gvModalDegreeBadge');
    if (degreeBadge) degreeBadge.textContent = first.hoc_ham_hoc_vi || 'Giảng viên';

    const sourceBadge = document.getElementById('gvModalSourceBadge');
    if (sourceBadge) {
      sourceBadge.textContent = isInternal ? 'Nội bộ Agribank' : 'Mời ngoài';
      sourceBadge.style.background = isInternal ? '#AE1C3F' : '#10B981';
    }

    const totalTiet = matches.reduce((sum, item) => sum + (item.so_tiet || 0), 0);
    const elemTotTiet = document.getElementById('gvModalTotalTiet');
    const elemTotClasses = document.getElementById('gvModalTotalClasses');
    if (elemTotTiet) elemTotTiet.textContent = `${totalTiet} tiết`;
    if (elemTotClasses) elemTotClasses.textContent = `${matches.length} lượt dạy`;

    const calcScore = (keyC5, keyC4, keyC3, keyC2, keyC1) => {
      let pts = 0, votes = 0;
      matches.forEach(m => {
        const c5 = m[keyC5]||0, c4 = m[keyC4]||0, c3 = m[keyC3]||0, c2 = m[keyC2]||0, c1 = m[keyC1]||0;
        pts += 5*c5 + 4*c4 + 3*c3 + 2*c2 + 1*c1;
        votes += c5 + c4 + c3 + c2 + c1;
      });
      return votes > 0 ? pts / votes : 0;
    };

    const avgKtcm = calcScore('c5_ktcm', 'c4_ktcm', 'c3_ktcm', 'c2_ktcm', 'c1_ktcm');
    const avgKnsp = calcScore('c5_knsp', 'c4_knsp', 'c3_knsp', 'c2_knsp', 'c1_knsp');
    const avgTdtp = calcScore('c5_tdtp', 'c4_tdtp', 'c3_tdtp', 'c2_tdtp', 'c1_tdtp');
    const avgOverall = (avgKtcm + avgKnsp + avgTdtp) / 3;

    const elemAvgScore = document.getElementById('gvModalAvgScore');
    if (elemAvgScore) elemAvgScore.textContent = `${avgOverall.toFixed(2)} / 5.0`;

    const elemKtScore = document.getElementById('gvModalKtcmScore');
    const elemKtBar = document.getElementById('gvModalKtcmBar');
    if (elemKtScore) elemKtScore.textContent = `${avgKtcm.toFixed(2)} / 5.0`;
    if (elemKtBar) elemKtBar.style.width = `${(avgKtcm / 5.0) * 100}%`;

    const elemKnScore = document.getElementById('gvModalKnspScore');
    const elemKnBar = document.getElementById('gvModalKnspBar');
    if (elemKnScore) elemKnScore.textContent = `${avgKnsp.toFixed(2)} / 5.0`;
    if (elemKnBar) elemKnBar.style.width = `${(avgKnsp / 5.0) * 100}%`;

    const elemTdScore = document.getElementById('gvModalTdtpScore');
    const elemTdBar = document.getElementById('gvModalTdtpBar');
    if (elemTdScore) elemTdScore.textContent = `${avgTdtp.toFixed(2)} / 5.0`;
    if (elemTdBar) elemTdBar.style.width = `${(avgTdtp / 5.0) * 100}%`;

    const historyBody = document.getElementById('gvModalHistoryBody');
    if (historyBody) {
      historyBody.innerHTML = matches.map(m => `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 0.5rem 0.75rem;">
            <div style="font-weight: 700; color: var(--brand-crimson);">${m.ma_lop || 'N/A'}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${m.chuong_trinh || ''} (${m.ngay_bat_dau || ''})</div>
          </td>
          <td style="padding: 0.5rem 0.75rem;">
            <span class="badge" style="background: #F3F4F6; color: #374151; font-size: 0.75rem;">${m.hinh_thuc_hoc || 'Trực tiếp'}</span>
          </td>
          <td style="padding: 0.5rem 0.75rem; font-size: 0.8rem; color: var(--text-primary); max-width: 320px;">
            ${m.noi_dung_giang || 'N/A'}
          </td>
          <td style="padding: 0.5rem 0.75rem; text-align: center; font-weight: 800; color: var(--text-primary);">
            ${m.so_tiet || 0}
          </td>
        </tr>
      `).join('');
    }

    const modal = document.getElementById('lecturerDetailModal');
    if (modal) {
      modal.style.setProperty('display', 'flex', 'important');
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      modal.classList.add('active');
    }
  };

  // Event Listeners for Filters
  function attachEventListeners() {
    // Shared Date Presets
    document.querySelectorAll('.preset-pills .pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.preset-pills .pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');

        const preset = e.target.dataset.preset;
        state.preset = preset;

        if (preset === 'today') {
          state.startDate = TODAY_STR;
          state.endDate = TODAY_STR;
        } else if (preset === 'all') {
          state.startDate = '2026-01-01';
          state.endDate = '2026-12-31';
        } else if (preset === 'q1') {
          state.startDate = '2026-01-01';
          state.endDate = '2026-03-31';
        } else if (preset === 'q2') {
          state.startDate = '2026-04-01';
          state.endDate = '2026-06-30';
        } else if (preset === 'q3') {
          state.startDate = '2026-07-01';
          state.endDate = '2026-09-30';
        } else if (preset === 'q4') {
          state.startDate = '2026-10-01';
          state.endDate = '2026-12-31';
        } else if (preset === 'completed') {
          state.startDate = '2026-01-01';
          state.endDate = TODAY_STR;
        } else if (preset === 'ongoing') {
          state.startDate = TODAY_STR;
          state.endDate = TODAY_STR;
        } else if (preset === 'upcoming') {
          state.startDate = TODAY_STR;
          state.endDate = '2026-12-31';
        }

        const startInp = document.getElementById('startDate');
        const endInp = document.getElementById('endDate');
        if (startInp) startInp.value = state.startDate;
        if (endInp) endInp.value = state.endDate;

        if (activeView === 'overview') applyFilters();
        else applyGvFilters();
      });
    });

    // Custom Date Range
    const btnApplyCustomDate = document.getElementById('btnApplyCustomDate');
    if (btnApplyCustomDate) {
      btnApplyCustomDate.addEventListener('click', () => {
        const startInp = document.getElementById('startDate');
        const endInp = document.getElementById('endDate');
        if (startInp) state.startDate = startInp.value;
        if (endInp) state.endDate = endInp.value;
        document.querySelectorAll('.preset-pills .pill').forEach(p => p.classList.remove('active'));

        if (activeView === 'overview') applyFilters();
        else applyGvFilters();
      });
    }

    // Mobile Toggle
    const btnToggleMobile = document.getElementById('btnToggleMobileFilter');
    if (btnToggleMobile) {
      btnToggleMobile.addEventListener('click', () => {
        const secOverview = document.getElementById('secondaryFiltersPanel');
        if (secOverview) {
          secOverview.style.display = (secOverview.style.display === 'none' || !secOverview.style.display) ? 'flex' : 'none';
        }
      });
    }

    // Window Resize Handler for Class Chart
    let chartResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(chartResizeTimer);
      chartResizeTimer = setTimeout(() => {
        if (activeView === 'overview') {
          renderClassAttendanceChart();
        }
      }, 150);
    });

    // Class Secondary Filters
    const locFilter = document.getElementById('filterLocation');
    if (locFilter) locFilter.addEventListener('change', (e) => { state.location = e.target.value; applyFilters(); });

    const fmtFilter = document.getElementById('filterFormat');
    if (fmtFilter) fmtFilter.addEventListener('change', (e) => { state.format = e.target.value; applyFilters(); });

    const progFilter = document.getElementById('filterProgramType');
    if (progFilter) progFilter.addEventListener('change', (e) => { state.programType = e.target.value; applyFilters(); });

    const searchInp = document.getElementById('searchInput');
    if (searchInp) searchInp.addEventListener('input', (e) => { state.searchQuery = e.target.value; applyFilters(); });

    // Table Sorting
    document.querySelectorAll('#classesTable th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        if (currentSort.column === col) {
          currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          currentSort.column = col;
          currentSort.dir = 'asc';
        }
        renderTable();
      });
    });
  }

  function attachGvEventListeners() {
    const nguonSelect = document.getElementById('filterGvNguon');
    if (nguonSelect) nguonSelect.addEventListener('change', (e) => { gvState.nguon = e.target.value; applyGvFilters(); });

    const hocHamSelect = document.getElementById('filterGvHocHam');
    if (hocHamSelect) hocHamSelect.addEventListener('change', (e) => { gvState.hocHam = e.target.value; applyGvFilters(); });

    const donViSelect = document.getElementById('filterGvDonVi');
    if (donViSelect) donViSelect.addEventListener('change', (e) => { gvState.donVi = e.target.value; applyGvFilters(); });

    const hinhThucSelect = document.getElementById('filterGvHinhThuc');
    if (hinhThucSelect) hinhThucSelect.addEventListener('change', (e) => { gvState.hinhThuc = e.target.value; applyGvFilters(); });

    const gvSearchInp = document.getElementById('gvSearchInput');
    if (gvSearchInp) gvSearchInp.addEventListener('input', (e) => { gvState.searchQuery = e.target.value; applyGvFilters(); });

    // Table Sorting
    document.querySelectorAll('#gvTable th[data-gv-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.gvSort;
        if (gvCurrentSort.column === col) {
          gvCurrentSort.dir = gvCurrentSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          gvCurrentSort.column = col;
          gvCurrentSort.dir = 'desc';
        }
        renderGvTable();
      });
    });

    // Sheet Sync Header Controls
    const btnSyncNow = document.getElementById('btnSyncNow');
    if (btnSyncNow) {
      btnSyncNow.addEventListener('click', () => {
        syncGoogleSheetData(getDefaultClassUrl(), { silent: false });
        syncGvGoogleSheetData(getDefaultGvUrl(), { silent: true });
      });
    }
  }

  // --- GOOGLE SHEET SYNCING LOGIC ---

  
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    else if (type === 'warning') icon = 'fa-triangle-exclamation';
    else if (type === 'error') icon = 'fa-circle-xmark';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }


  async function syncGoogleSheetData(sheetUrl, options = {}) {
    if (isSyncing) return;
    isSyncing = true;
    const isSilent = Boolean(options.silent);

    const syncIcon = document.getElementById('syncIcon');
    const syncBtnLabel = document.getElementById('syncBtnLabel');
    const btnSync = document.getElementById('btnSyncNow');
    const statusBadge = document.getElementById('syncStatusBadge');
    const statusText = document.getElementById('syncStatusText');

    if (syncIcon) syncIcon.classList.add('fa-spin');
    if (btnSync) btnSync.classList.add('syncing');
    if (syncBtnLabel) syncBtnLabel.textContent = 'Đang đồng bộ...';
    if (statusBadge) statusBadge.className = 'sync-status-badge syncing';
    if (statusText) statusText.textContent = 'Đang tải Google Sheet...';

    try {
      const targetUrl = sheetUrl || getDefaultClassUrl();
      const csvUrl = getGoogleSheetCsvExportUrl(targetUrl);
      const fetchUrl = `${csvUrl}${csvUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      
      const res = await fetch(fetchUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const csvText = await res.text();
      const parsedData = parseCsvToClasses(csvText);

      if (parsedData && parsedData.length > 0) {
        allClasses = parsedData.filter(x => x.is_class);
        try {
          localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(parsedData));
        } catch (stErr) {
          console.warn("Could not save to localStorage:", stErr);
        }
        populateFilterDropdowns();
        if (activeView === 'overview') applyFilters();

        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (statusBadge) statusBadge.className = 'sync-status-badge';
        if (statusText) statusText.textContent = `Realtime: ${timeStr} (${allClasses.length} lớp)`;

        if (!isSilent) {
          showToast(`Đã đồng bộ ${allClasses.length} lớp học thời gian thực từ Google Sheet!`, 'success');
        }
      }
    } catch (e) {
      console.warn("Class sheet sync error:", e);
      if (statusBadge) statusBadge.className = 'sync-status-badge offline';
      if (statusText) statusText.textContent = 'Dữ liệu bộ nhớ đệm (Offline)';
      if (!isSilent) {
        showToast('Không thể kết nối Google Sheet. Đang sử dụng dữ liệu lưu tạm!', 'warning');
      }
    } finally {
      isSyncing = false;
      if (syncIcon) syncIcon.classList.remove('fa-spin');
      if (btnSync) btnSync.classList.remove('syncing');
      if (syncBtnLabel) syncBtnLabel.textContent = 'Đồng bộ Sheet';
    }
  }

  async function syncGvGoogleSheetData(gvSheetUrl, options = {}) {
    try {
      const csvUrl = getGoogleSheetCsvExportUrl(gvSheetUrl);
      const fetchUrl = `${csvUrl}${csvUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      const res = await fetch(fetchUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const csvText = await res.text();
      const parsedGv = parseCsvToGvItems(csvText);

      if (parsedGv && parsedGv.length > 0) {
        allGvItems = parsedGv;
        try {
          localStorage.setItem(STORAGE_KEY_GV_DATA, JSON.stringify(parsedGv));
        } catch (stErr) {
          console.warn("Could not save GV data to localStorage:", stErr);
        }
        populateGvFilterDropdowns();
        if (activeView === 'lecturer') applyGvFilters();
      }
    } catch (e) {
      console.warn("GV sheet sync error:", e);
    }
  }

  function getGoogleSheetCsvExportUrl(url) {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.includes('script.google.com') || cleanUrl.includes('macros/s/')) {
      return cleanUrl;
    }
    if (cleanUrl.includes('/pub?output=csv')) return cleanUrl;
    if (cleanUrl.includes('/pubhtml')) return cleanUrl.replace('/pubhtml', '/pub?output=csv');
    if (cleanUrl.includes('/export?format=csv')) return cleanUrl;

    const match = cleanUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) return cleanUrl;
    const spreadsheetId = match[1];

    let gid = '0';
    const gidMatch = cleanUrl.match(/[?&]gid=([0-9]+)/) || cleanUrl.match(/#gid=([0-9]+)/);
    if (gidMatch) gid = gidMatch[1];

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  }

  function safeParseInt(val) {
    if (typeof val === 'number') return Math.round(val);
    if (!val) return 0;
    const cleaned = String(val).replace(/\s+/g, '').replace(/,/g, '');
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  function safeParseFloat(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0.0;
    const cleaned = String(val).replace(/\s+/g, '').replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0.0 : parsed;
  }

  function parseDateStrISO(str) {
    if (!str) return '';
    const s = str.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const parts = s.split(/[\/\-]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      }
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  function parseCsvToRows(csvText) {
    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let insideQuote = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (insideQuote && nextChar === '"') {
          currentVal += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\r' || char === '\n') && !insideQuote) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentVal.trim());
        if (currentRow.some(c => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    if (currentVal.length > 0 || currentRow.length > 0) {
      currentRow.push(currentVal.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
    }
    return rows;
  }

  function parseCsvToClasses(csvText) {
    const rows = parseCsvToRows(csvText);
    if (rows.length <= 1) return [];

    const result = [];
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (cols.length < 5) continue;

      const maCt = cols[0] || '';
      const tenCt = cols[1] || '';
      const hinhThucDt = cols[2] || '';
      const soLopKh = safeParseInt(cols[3]);
      const maLop = cols[4] || '';
      const hinhThucHoc = cols[5] || '';
      const diaDiem = cols[6] || '';
      const bdRaw = cols[7] || '';
      const ktRaw = cols[8] || '';
      const bdIso = parseDateStrISO(bdRaw);
      const ktIso = parseDateStrISO(ktRaw);
      const thoiLuong = safeParseFloat(cols[9]);
      const hvKh = safeParseInt(cols[10]);
      const hvTrieuTap = safeParseInt(cols[11]);
      const hvThucTe = safeParseInt(cols[12]);
      const canBoQl = cols[13] || '';
      const loaiCt = cols[14] || '';

      const isClass = Boolean(maLop && maLop.trim());

      result.push({
        id: i,
        ma_ct: maCt,
        ten_ct: tenCt,
        hinh_thuc_dt: hinhThucDt,
        so_lop_kh: soLopKh,
        ma_lop: maLop,
        hinh_thuc_hoc: hinhThucHoc,
        dia_diem: diaDiem,
        ngay_bd_raw: bdRaw,
        ngay_kt_raw: ktRaw,
        ngay_bd: bdIso,
        ngay_kt: ktIso,
        thoi_luong: thoiLuong,
        hv_kh: hvKh,
        hv_trieu_tap: hvTrieuTap,
        hv_thuc_te: hvThucTe,
        can_bo_ql: canBoQl,
        loai_ct: loaiCt,
        is_class: isClass
      });
    }
    return result;
  }

  function parseCsvToGvItems(csvText) {
    const rows = parseCsvToRows(csvText);
    if (rows.length <= 1) return [];

    const result = [];
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (cols.length < 13 || !cols[12] || !cols[12].trim()) continue;

      result.push({
        chuong_trinh: cols[0] || '',
        ma_lop: cols[1] || '',
        hinh_thuc_hoc: cols[2] || '',
        ngay_bat_dau: cols[3] || '',
        ngay_ket_thuc: cols[4] || '',
        ma_gv: cols[5] || '',
        nguon_gv: cols[6] || '',
        doi_tuong_gv: cols[7] || '',
        don_vi: cols[8] || '',
        chuc_danh: cols[9] || '',
        phong_ban: cols[10] || '',
        hoc_ham_hoc_vi: cols[11] || '',
        ten_gv: cols[12] || '',
        noi_dung_giang: cols[13] || '',
        so_tiet: safeParseFloat(cols[14]),
        c5_ktcm: safeParseInt(cols[15]),
        c4_ktcm: safeParseInt(cols[16]),
        c3_ktcm: safeParseInt(cols[17]),
        c2_ktcm: safeParseInt(cols[18]),
        c1_ktcm: safeParseInt(cols[19]),
        c5_knsp: safeParseInt(cols[20]),
        c4_knsp: safeParseInt(cols[21]),
        c3_knsp: safeParseInt(cols[22]),
        c2_knsp: safeParseInt(cols[23]),
        c1_knsp: safeParseInt(cols[24]),
        c5_tdtp: safeParseInt(cols[25]),
        c4_tdtp: safeParseInt(cols[26]),
        c3_tdtp: safeParseInt(cols[27]),
        c2_tdtp: safeParseInt(cols[28]),
        c1_tdtp: safeParseInt(cols[29]),
        cbql: cols[30] || ''
      });
    }
    return result;
  }

  function closeSheetUrlModal() {
    window.closeSheetModal();
  }
});

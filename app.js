/**
 * Training & Lecturer Dashboard Application Logic
 * Powered by Time Intelligence & Interactive Visualizations
 */

// Global window functions for detail modal handling (available immediately)
window.openClassModalById = function(id) {
  if (typeof id === 'undefined' || id === null) return;
  const numId = Number(id);
  const list = window.allClasses || (typeof allClasses !== 'undefined' && Array.isArray(allClasses) ? allClasses : null);
  const found = list ? list.find(x => x.id === numId) : null;
  if (found) {
    window.openModal(found);
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (typeof window.closeModal === 'function') window.closeModal();
    if (typeof window.closeGvModal === 'function') window.closeGvModal();
    if (typeof window.closeNddtModal === 'function') window.closeNddtModal();
    if (typeof window.closePphtdtModal === 'function') window.closePphtdtModal();
    if (typeof window.closeCsvcModal === 'function') window.closeCsvcModal();
    document.body.style.overflow = '';
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

// NDDT Detail Modal Handlers
window.openNddtModalById = function(id) {
  if (typeof id === 'undefined' || id === null) return;
  const numId = Number(id);
  const list = window.allNddtItems || (typeof allNddtItems !== 'undefined' && Array.isArray(allNddtItems) ? allNddtItems : null);
  const found = list ? list.find(x => x.id === numId) : null;
  if (found) {
    window.openNddtModal(found);
  }
};

window.openNddtModal = function(r) {
  if (!r) return;
  const modal = document.getElementById('nddtDetailModal');
  if (!modal) return;

  const elemCode = document.getElementById('modalNddtClassCode');
  const elemName = document.getElementById('modalNddtClassName');
  const elemInfo = document.getElementById('modalNddtInfoGrid');
  const elemCrit = document.getElementById('modalNddtCriteriaContent');

  if (elemCode) elemCode.textContent = r.ma_lop || 'Chi tiết lớp';
  if (elemName) elemName.textContent = r.ten_ct_full || r.chuong_trinh || 'Nội dung đào tạo';

  const timeStr = (r.ngay_bd_raw || '') + (r.ngay_kt_raw ? ' — ' + r.ngay_kt_raw : '');

  if (elemInfo) {
    elemInfo.innerHTML = `
      <div class="modal-item">
        <label><i class="fa-solid fa-barcode"></i> Mã Lớp Học</label>
        <span style="color: var(--brand-crimson); font-weight: 800;">${r.ma_lop || 'Chưa có mã'}</span>
      </div>
      <div class="modal-item">
        <label><i class="fa-solid fa-graduation-cap"></i> Chương Trình Đào Tạo</label>
        <span style="font-weight: 700; color: #1F2937;">${r.chuong_trinh || 'Chưa có tên'}</span>
      </div>
      <div class="modal-item">
        <label><i class="fa-solid fa-shapes"></i> Hình Thức Học</label>
        <span>${r.hinh_thuc_hoc || 'Trực tiếp'}</span>
      </div>
      <div class="modal-item">
        <label><i class="fa-solid fa-user-tie"></i> Cán Bộ Quản Lý</label>
        <span>${r.cbql || 'Chưa cập nhật'}</span>
      </div>
      <div class="modal-item">
        <label><i class="fa-regular fa-calendar-days"></i> Thời Gian Diễn Ra</label>
        <span>${timeStr || 'Chưa cập nhật'}</span>
      </div>
      <div class="modal-item">
        <label><i class="fa-solid fa-users"></i> Số Học Viên Đánh Giá</label>
        <span style="font-weight: 800; color: #0EA5E9;">${(r.tong_phieu || 0).toLocaleString()} phiếu hợp lệ</span>
      </div>
      <div class="modal-item">
        <label><i class="fa-solid fa-star"></i> Điểm TB Chung (Thang 4.0)</label>
        <span style="font-weight: 800; color: var(--brand-primary); font-size: 1.05rem;">${r.diem_tb.toFixed(2)} / 4.0</span>
      </div>
      <div class="modal-item">
        <label><i class="fa-solid fa-thumbs-up"></i> Tỷ Lệ Tích Cực (Tốt + Khá)</label>
        <span style="font-weight: 800; color: #059669; font-size: 1.05rem;">${r.ty_le_tich_cuc.toFixed(1)}%</span>
      </div>
    `;
  }

  if (elemCrit) {
    const renderCriteriaCard = (title, icon, score, posRate, n4, n3, n2, n1, total) => {
      const p4 = total > 0 ? ((n4 / total) * 100).toFixed(1) : '0.0';
      const p3 = total > 0 ? ((n3 / total) * 100).toFixed(1) : '0.0';
      const p2 = total > 0 ? ((n2 / total) * 100).toFixed(1) : '0.0';
      const p1 = total > 0 ? ((n1 / total) * 100).toFixed(1) : '0.0';

      return `
        <div class="nddt-modal-crit-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #1F2937; display: flex; align-items: center; gap: 0.4rem;">
                <i class="fa-solid ${icon}" style="color: var(--brand-primary);"></i> ${title}
              </h4>
              <span style="font-size: 0.78rem; color: var(--text-muted);">Tổng số phản hồi: <strong>${total}</strong> phiếu</span>
            </div>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 700; color: #0F5132; background: #ECFDF5; padding: 0.25rem 0.6rem; border-radius: var(--radius-sm);">
                Tích cực: ${posRate.toFixed(1)}%
              </span>
              <span style="font-size: 1.1rem; font-weight: 800; color: var(--brand-primary); background: #FFF1F2; padding: 0.25rem 0.65rem; border-radius: var(--radius-sm); border: 1px solid #FECDD3;">
                ${score.toFixed(2)} <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">/ 4.0</span>
              </span>
            </div>
          </div>

          <div class="nddt-dist-bar-4" style="height: 14px; border-radius: 6px; overflow: hidden; display: flex; margin-bottom: 0.65rem; background: #F1F5F9;">
            <div style="width: ${p4}%; background: #0F5132;" title="Tốt: ${p4}% (${n4} phiếu)"></div>
            <div style="width: ${p3}%; background: #10B981;" title="Khá: ${p3}% (${n3} phiếu)"></div>
            <div style="width: ${p2}%; background: #D97706;" title="Bình thường: ${p2}% (${n2} phiếu)"></div>
            <div style="width: ${p1}%; background: #EF4444;" title="Hạn chế: ${p1}% (${n1} phiếu)"></div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; text-align: center; font-size: 0.8rem;">
            <div style="background: #F8FAFC; padding: 0.35rem; border-radius: 4px; border-left: 3px solid #0F5132;">
              <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Tốt (4đ)</span>
              <strong style="color: #0F5132;">${n4}</strong> <span style="font-size: 0.7rem; color: var(--text-muted);">(${p4}%)</span>
            </div>
            <div style="background: #F8FAFC; padding: 0.35rem; border-radius: 4px; border-left: 3px solid #10B981;">
              <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Khá (3đ)</span>
              <strong style="color: #10B981;">${n3}</strong> <span style="font-size: 0.7rem; color: var(--text-muted);">(${p3}%)</span>
            </div>
            <div style="background: #F8FAFC; padding: 0.35rem; border-radius: 4px; border-left: 3px solid #D97706;">
              <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Bình thường (2đ)</span>
              <strong style="color: #D97706;">${n2}</strong> <span style="font-size: 0.7rem; color: var(--text-muted);">(${p2}%)</span>
            </div>
            <div style="background: #F8FAFC; padding: 0.35rem; border-radius: 4px; border-left: 3px solid #EF4444;">
              <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Hạn chế (1đ)</span>
              <strong style="color: #EF4444;">${n1}</strong> <span style="font-size: 0.7rem; color: var(--text-muted);">(${p1}%)</span>
            </div>
          </div>
        </div>
      `;
    };

    const tplCfg = (typeof NDDT_CRITERIA_CONFIG !== 'undefined' && NDDT_CRITERIA_CONFIG[nddtActiveTemplate])
      ? NDDT_CRITERIA_CONFIG[nddtActiveTemplate]
      : { modal1: '1. Tiêu chí 1', modal2: '2. Tiêu chí 2', modal3: '3. Tiêu chí 3' };

    elemCrit.innerHTML = `
      ${renderCriteriaCard(tplCfg.modal1, 'fa-bullseye', r.c1_score, r.c1_pos, r.c1_4, r.c1_3, r.c1_2, r.c1_1, r.c1_n)}
      ${renderCriteriaCard(tplCfg.modal2, 'fa-briefcase', r.c2_score, r.c2_pos, r.c2_4, r.c2_3, r.c2_2, r.c2_1, r.c2_n)}
      ${renderCriteriaCard(tplCfg.modal3, 'fa-laptop-code', r.c3_score, r.c3_pos, r.c3_4, r.c3_3, r.c3_2, r.c3_1, r.c3_n)}
    `;
  }

  modal.classList.add('active');
  modal.style.setProperty('display', 'flex', 'important');
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';
};

window.closeNddtModal = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const modal = document.getElementById('nddtDetailModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.setProperty('display', 'none', 'important');
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }
};

window.closeNddtModalOnOverlay = function(e) {
  if (e && e.target && e.target.id === 'nddtDetailModal') {
    window.closeNddtModal(e);
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

  // State Management for Lecturer View (Phân hệ 2: Đánh giá Giảng viên)
  let allGvItems = [];
  let filteredGvItems = [];
  let gvCurrentSort = { column: 'diem_tb', dir: 'desc' };
  let gvCompareMode = 'lecturer';
  let gvRankMetric = 'gpa'; // 'gpa' | 'classes' | 'hours'
  let gvTopLimit = '15'; // '10' | '15' | '20' | '30' | 'all'

  let gvState = {
    preset: 'all',
    program: '',
    nguon: '',
    donVi: '',
    format: '',
    lecturer: '',
    ratingLevel: '',
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
    stackedBar: null,
    comparison: null
  };

  // Securely obfuscated endpoints to protect underlying Google Sheets from direct scrapers
  const _EP_CLASS = 'aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4akdKam5qMTFPb2M1ZjN5VEI4U1ppMThHRDYtYUc0RHFzdUYzSTVNQXNYY2R3YTNqM194T2RfZnBscmtQeG1tTkUvZXhlYw==';
  const _EP_GV = 'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMWtMbVM1YzdNdU5aWUhFN19BOUdSV3dKZ3hMNVowNWstck1KbC1CczBUZkUvZXhwb3J0P2Zvcm1hdD1jc3YmZ2lkPTE5MDM4NDcyNTE=';

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
      if (stored && (stored.includes('1POvv') || stored.includes('script.google.com'))) {
        return stored;
      }
      // Link cũ lớp học: Apps Script proxy hoặc CSV export trực tiếp
      return safeDecode(_EP_CLASS) || safeDecode(_EP_CLASS_DIRECT);
    } catch (e) {
      return safeDecode(_EP_CLASS) || safeDecode(_EP_CLASS_DIRECT);
    }
  }

  function getDefaultGvUrl() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GV_URL);
      if (stored && stored.includes('1kLmS5c7MuNZYHE7') && stored.includes('1903847251')) {
        return stored;
      }
      return safeDecode(_EP_GV);
    } catch (e) {
      return safeDecode(_EP_GV);
    }
  }

  const STORAGE_KEY_URL = 'dashboard_google_sheet_url';
  const STORAGE_KEY_DATA = 'dashboard_synced_data';
  const STORAGE_KEY_GV_URL = 'dashboard_google_sheet_gv_url_v3';
  const STORAGE_KEY_GV_DATA = 'dashboard_synced_gv_data_v3';

  // State Management for Content Evaluation (Screen 2: Nội dung đào tạo)
  let nddtActiveTemplate = 'new'; // 'new' (Mẫu mới - 135 lớp) | 'old' (Mẫu cũ - 155 lớp)
  let nddtNewItems = [];
  let nddtOldItems = [];
  let allNddtItems = [];
  let filteredNddtItems = [];

  const NDDT_CRITERIA_CONFIG = {
    new: {
      name: 'Mẫu mới (Hiện hành)',
      short1: '1. Phù hợp vị trí:',
      short2: '2. Tính thực tiễn:',
      short3: '3. Khả năng áp dụng:',
      chartLabels: ['1. Phù hợp vị trí CV', '2. Tính thực tiễn', '3. Áp dụng kiến thức'],
      th1: 'TC1: PHÙ HỢP',
      th2: 'TC2: THỰC TIỄN',
      th3: 'TC3: ÁP DỤNG',
      modal1: '1. Phù hợp vị trí công việc & mục tiêu học tập',
      modal2: '2. Tính thực tiễn sát với yêu cầu công việc',
      modal3: '3. Khả năng áp dụng kiến thức vào thực tế'
    },
    old: {
      name: 'Mẫu cũ',
      short1: '1. Đáp ứng mong muốn:',
      short2: '2. Liên quan công việc:',
      short3: '3. Ứng dụng thực tế:',
      chartLabels: ['1. Đáp ứng mong muốn', '2. Liên quan công việc', '3. Ứng dụng thực tế'],
      th1: 'TC1: MONG MUỐN',
      th2: 'TC2: CÔNG VIỆC',
      th3: 'TC3: ỨNG DỤNG',
      modal1: '1. Nội dung đáp ứng mong muốn của học viên',
      modal2: '2. Nội dung liên quan trực tiếp đến công việc',
      modal3: '3. Khả năng ứng dụng kiến thức vào thực tế'
    }
  };
  let nddtCurrentSort = { column: 'ngay_bd', dir: 'desc' };
  let nddtState = {
    preset: 'all',
    program: '',
    format: '',
    cbql: '',
    ratingLevel: '',
    searchQuery: '',
    comparisonView: 'program'
  };

  let nddtCharts = {
    stackedBar: null,
    comparison: null
  };

  // PPHTDT (Phương pháp & Hình thức đào tạo) Module State
  let allPphtdtItems = [];
  let filteredPphtdtItems = [];
  let pphtdtCurrentSort = { column: 'ngay_bd', dir: 'desc' };
  let pphtdtState = {
    preset: 'all',
    program: '',
    format: '',
    cbql: '',
    ratingLevel: '',
    searchQuery: '',
    comparisonView: 'program'
  };
  let pphtdtCharts = {
    stackedBar: null,
    comparison: null
  };

  // CSVC (Công tác tổ chức & Cơ sở vật chất) Module State
  let allCsvcItems = [];
  let filteredCsvcItems = [];
  let csvcCurrentSort = { column: 'ma_lop', dir: 'asc' };
  let csvcCompareMode = 'location';
  let csvcState = {
    preset: 'all',
    program: '',
    location: '',
    format: '',
    cbql: '',
    ratingLevel: '',
    searchQuery: ''
  };
  let csvcCharts = {
    stackedBar: null,
    comparison: null
  };

  // Securely obfuscated endpoints (Direct Google Sheet CSV Exports with exact gid):
  const _EP_CLASS_DIRECT = 'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMVBPdnYtYlZaTXZLeVhpaS0zUnhiOVdBWTY3czkzeEF3eER3Q19wZUEwMW8vZXhwb3J0P2Zvcm1hdD1jc3YmZ2lkPTA=';
  const _EP_NDDT = 'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMWtMbVM1YzdNdU5aWUhFN19BOUdSV3dKZ3hMNVowNWstck1KbC1CczBUZkUvZXhwb3J0P2Zvcm1hdD1jc3YmZ2lkPTA=';
  const _EP_NDDT_OLD = 'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMTNKVS03bkxHVHB0MWNlb1RKNHJDeWs3V01lVWFnUV8yY1h3VURfaVA1NUUvZXhwb3J0P2Zvcm1hdD1jc3YmZ2lkPTA=';
  const STORAGE_KEY_NDDT_URL = 'dashboard_google_sheet_nddt_url_v3';
  const STORAGE_KEY_NDDT_DATA = 'dashboard_synced_nddt_data_v3';
  const STORAGE_KEY_NDDT_OLD_DATA = 'dashboard_synced_nddt_old_data_v3';
  const _EP_PPHTDT_DIRECT = 'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMWtMbVM1YzdNdU5aWUhFN19BOUdSV3dKZ3hMNVowNWstck1KbC1CczBUZkUvZXhwb3J0P2Zvcm1hdD1jc3YmZ2lkPTE0ODc5MjAxOTM=';
  const _EP_PPHTDT = _EP_PPHTDT_DIRECT;
  const STORAGE_KEY_PPHTDT_URL = 'dashboard_google_sheet_pphtdt_url_v3';
  const STORAGE_KEY_PPHTDT_DATA = 'dashboard_synced_pphtdt_data_v3';
  const _EP_CSVC_DIRECT = 'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMWtMbVM1YzdNdU5aWUhFN19BOUdSV3dKZ3hMNVowNWstck1KbC1CczBUZkUvZXhwb3J0P2Zvcm1hdD1jc3YmZ2lkPTE2Nzk2ODE5MzU=';
  const _EP_CSVC = _EP_CSVC_DIRECT;
  const STORAGE_KEY_CSVC_URL = 'dashboard_google_sheet_csvc_url_v3';
  const STORAGE_KEY_CSVC_DATA = 'dashboard_synced_csvc_data_v3';

  function getDefaultCsvcUrl() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CSVC_URL);
      if (stored && stored.includes('1kLmS5c7MuNZYHE7') && stored.includes('1679681935')) {
        return stored;
      }
      return safeDecode(_EP_CSVC);
    } catch (e) {
      return safeDecode(_EP_CSVC);
    }
  }

  function getDefaultPphtdtUrl() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PPHTDT_URL);
      if (stored && stored.includes('1kLmS5c7MuNZYHE7') && stored.includes('1487920193')) {
        return stored;
      }
      return safeDecode(_EP_PPHTDT);
    } catch (e) {
      return safeDecode(_EP_PPHTDT);
    }
  }

  function getDefaultNddtOldUrl() {
    try {
      return safeDecode(_EP_NDDT_OLD);
    } catch (e) {
      return safeDecode(_EP_NDDT_OLD);
    }
  }

  function getDefaultNddtUrl() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NDDT_URL);
      if (stored && stored.includes('1kLmS5c7MuNZYHE7')) {
        return stored;
      }
      return safeDecode(_EP_NDDT);
    } catch (e) {
      return safeDecode(_EP_NDDT);
    }
  }

  const MANUAL_PROGRAM_NAMES = {
    'TD32': 'Bồi dưỡng tín dụng dành cho CBTD thực hiện nhiệm vụ khách hàng cá nhân',
    'TD33': 'Bồi dưỡng tín dụng dành cho CBTD thực hiện nhiệm vụ khách hàng doanh nghiệp',
    'TD34': 'Quản lý rủi ro tín dụng và xử lý nợ có vấn đề',
    'TD35': 'Thẩm định dự án đầu tư nâng cao',
    'TD15': 'Phân tích tài chính doanh nghiệp trong hoạt động cấp tín dụng',
    'TC04': 'Nghiệp vụ kế toán ngân hàng và thanh toán trong nước',
    'TC07': 'Bồi dưỡng nghiệp vụ kiểm ngân và an toàn kho quỹ',
    'KT07': 'Kiểm tra, giám sát nội bộ trong hoạt động ngân hàng',
    'PC05': 'Pháp chế ngân hàng và phòng chống rửa tiền (AML/KYC)',
    'QL14': 'Nâng cao năng lực lãnh đạo và quản trị điều hành cấp Chi nhánh',
    'NS05': 'Kỹ năng giao tiếp, chăm sóc khách hàng và văn hóa doanh nghiệp Agribank',
    'CNTT15': 'An toàn thông tin mạng và chuyển đổi số trong ngân hàng'
  };

  function normalizeAllModuleData() {
    const progMap = new Map(Object.entries(MANUAL_PROGRAM_NAMES));
    const classFullMap = new Map();

    // 1. Collect program full names from all available sources
    if (Array.isArray(allClasses)) {
      allClasses.forEach(c => {
        const mct = (c.ma_ct || '').trim();
        const tct = (c.ten_ct || '').trim();
        const ml = (c.ma_lop || '').trim().toLowerCase();
        if (mct && tct && tct !== mct) progMap.set(mct, tct);
        if (ml && tct) classFullMap.set(ml, tct);
      });
    }

    const collectFromEvalList = (list) => {
      if (!Array.isArray(list)) return;
      list.forEach(item => {
        if (!item) return;
        const ct = (item.chuong_trinh || '').trim();
        const full = (item.ten_ct_full || '').trim();
        const ml = (item.ma_lop || '').trim().toLowerCase();
        if (ct && full && full !== ct) progMap.set(ct, full);
        if (ml && full && full !== ct) classFullMap.set(ml, full);
      });
    };

    if (typeof RAW_GV_DATA !== 'undefined') collectFromEvalList(RAW_GV_DATA);
    if (typeof RAW_PPHTDT_DATA !== 'undefined') collectFromEvalList(RAW_PPHTDT_DATA);
    if (typeof RAW_CSVC_DATA !== 'undefined') collectFromEvalList(RAW_CSVC_DATA);
    collectFromEvalList(allGvItems);
    collectFromEvalList(allPphtdtItems);
    collectFromEvalList(allCsvcItems);
    collectFromEvalList(nddtNewItems);
    collectFromEvalList(nddtOldItems);

    // 2. Collect hybrid classes (classes that have both direct and online rows)
    const directClasses = new Set();
    const recordDirectPresence = (list) => {
      if (!Array.isArray(list)) return;
      list.forEach(item => {
        if (!item || !item.ma_lop) return;
        const ml = item.ma_lop.trim().toLowerCase();
        const fmt = (item.hinh_thuc_hoc || item.hinh_thuc_dt || '').toLowerCase();
        if (fmt.includes('tiếp') && !fmt.includes('tuyến') && !fmt.includes('kết hợp')) {
          directClasses.add(ml);
        }
      });
    };

    recordDirectPresence(allClasses);
    recordDirectPresence(nddtNewItems);
    recordDirectPresence(nddtOldItems);
    recordDirectPresence(allPphtdtItems);
    recordDirectPresence(allCsvcItems);
    recordDirectPresence(allGvItems);

    const normalizeFormatVal = (rawFmt, maLop) => {
      const f = (rawFmt || 'Trực tiếp').trim();
      const lower = f.toLowerCase();
      if (lower.includes('kết hợp') || (lower.includes('tiếp') && lower.includes('tuyến'))) {
        return 'Trực tiếp kết hợp Trực tuyến';
      }
      if (lower.includes('tuyến') || lower.includes('polycom') || lower.includes('online')) {
        const ml = (maLop || '').trim().toLowerCase();
        if (ml && directClasses.has(ml)) {
          return 'Trực tiếp kết hợp Trực tuyến';
        }
        return 'Trực tuyến';
      }
      return 'Trực tiếp';
    };

    const normalizeList = (list, type) => {
      if (!Array.isArray(list)) return;
      list.forEach((item, idx) => {
        if (!item) return;
        if (!item.id) item.id = idx + 1;
        const ml = (item.ma_lop || '').trim();
        const mlLower = ml.toLowerCase();
        const ct = (item.chuong_trinh || '').trim();

        if (!item.ten_ct_full || item.ten_ct_full === ct) {
          item.ten_ct_full = classFullMap.get(mlLower) || progMap.get(ct) || item.ten_ct_full || ct || ml || 'Chương trình đào tạo';
        }

        item.hinh_thuc_hoc = normalizeFormatVal(item.hinh_thuc_hoc, ml);

        if (type === 'csvc') {
          if (typeof item.tong_phieu !== 'number') {
            item.tong_phieu = Number(item.so_phieu) || 0;
          }
          if (!item.ngay_bd && item.ngay_bd_raw) {
            item.ngay_bd = parseDateStrISO(item.ngay_bd_raw);
          }
          if (!item.ngay_kt && item.ngay_kt_raw) {
            item.ngay_kt = parseDateStrISO(item.ngay_kt_raw);
          }
        } else if (type === 'gv') {
          item.ngay_bd_iso = parseDateStrISO(item.ngay_bd);
          item.ngay_kt_iso = parseDateStrISO(item.ngay_kt);
          item.diem_ktcm = Number(item.diem_ktcm) || 0;
          item.diem_knsp = Number(item.diem_knsp) || 0;
          item.diem_tdtp = Number(item.diem_tdtp) || 0;
          item.diem_tb = Number(item.diem_tb) || 0;
          item.tong_phieu = Number(item.tong_phieu) || 0;
          item.so_tiet = Number(item.so_tiet) || 0;
        } else {
          if (!item.ngay_bd && item.ngay_bd_raw) {
            item.ngay_bd = parseDateStrISO(item.ngay_bd_raw);
          }
          if (!item.ngay_kt && item.ngay_kt_raw) {
            item.ngay_kt = parseDateStrISO(item.ngay_kt_raw);
          }
          item.diem_tb = Number(item.diem_tb) || 0;
          item.ty_le_tich_cuc = Number(item.ty_le_tich_cuc) || 0;
          item.tong_phieu = Number(item.tong_phieu) || 0;
        }
      });
    };

    normalizeList(nddtNewItems, 'nddt');
    normalizeList(nddtOldItems, 'nddt');
    normalizeList(allPphtdtItems, 'pphtdt');
    normalizeList(allCsvcItems, 'csvc');
    normalizeList(allGvItems, 'gv');
  }

  let isSyncing = false;

  // 1. Initialize Application
  initApp();

  async function initApp() {
    // Purge legacy unversioned / corrupted localStorage keys from older builds
    try {
      [
        'dashboard_synced_gv_data',
        'dashboard_synced_nddt_data',
        'dashboard_synced_nddt_old_data',
        'dashboard_synced_pphtdt_data',
        'dashboard_synced_csvc_data',
        'dashboard_google_sheet_gv_url',
        'dashboard_google_sheet_nddt_url',
        'dashboard_google_sheet_pphtdt_url',
        'dashboard_google_sheet_csvc_url'
      ].forEach(k => localStorage.removeItem(k));
    } catch (e) {}

    let loadedClasses = null;
    let loadedGvItems = null;

    // Load Class Data
    try {
      const savedDataStr = localStorage.getItem(STORAGE_KEY_DATA);
      if (savedDataStr) {
        const parsed = JSON.parse(savedDataStr);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ma_ct !== undefined) {
          loadedClasses = parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read localStorage class data:", e);
    }

    if (!loadedClasses && typeof RAW_DATA !== 'undefined' && Array.isArray(RAW_DATA)) {
      loadedClasses = RAW_DATA;
    }

    if (loadedClasses) {
      allClasses = loadedClasses.filter(item => item.is_class);
      window.allClasses = allClasses;
    }

    // Load Lecturer Data (with schema check)
    try {
      const savedGvStr = localStorage.getItem(STORAGE_KEY_GV_DATA);
      if (savedGvStr) {
        const parsedGv = JSON.parse(savedGvStr);
        if (Array.isArray(parsedGv) && parsedGv.length > 0 && parsedGv[0].ten_gv && typeof parsedGv[0].diem_tb === 'number' && typeof parsedGv[0].ten_ct_full === 'string') {
          loadedGvItems = parsedGv;
        }
      }
    } catch (e) {
      console.warn("Could not read localStorage gv data:", e);
    }

    if (!loadedGvItems && typeof RAW_GV_DATA !== 'undefined' && Array.isArray(RAW_GV_DATA)) {
      loadedGvItems = RAW_GV_DATA;
    }

    allGvItems = loadedGvItems || [];
    window.allGvItems = allGvItems;

    // Load NDDT Data (Content Evaluation: Mẫu mới & Mẫu cũ)
    let loadedNewItems = null;
    try {
      const savedNddtStr = localStorage.getItem(STORAGE_KEY_NDDT_DATA);
      if (savedNddtStr) {
        const parsed = JSON.parse(savedNddtStr);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ma_lop && typeof parsed[0].c3_score === 'number') {
          loadedNewItems = parsed;
        }
      }
    } catch (e) {}
    if (!loadedNewItems && typeof RAW_NDDT_DATA !== 'undefined' && Array.isArray(RAW_NDDT_DATA)) {
      loadedNewItems = RAW_NDDT_DATA;
    }
    nddtNewItems = loadedNewItems || [];

    let loadedOldItems = null;
    try {
      const savedOldStr = localStorage.getItem(STORAGE_KEY_NDDT_OLD_DATA);
      if (savedOldStr) {
        const parsedOld = JSON.parse(savedOldStr);
        if (Array.isArray(parsedOld) && parsedOld.length > 0 && parsedOld[0].ma_lop && typeof parsedOld[0].c3_score === 'number') {
          loadedOldItems = parsedOld;
        }
      }
    } catch (e) {}
    if (!loadedOldItems && typeof RAW_NDDT_OLD_DATA !== 'undefined' && Array.isArray(RAW_NDDT_OLD_DATA)) {
      loadedOldItems = RAW_NDDT_OLD_DATA;
    }
    nddtOldItems = loadedOldItems || [];

    allNddtItems = (nddtActiveTemplate === 'old' ? nddtOldItems : nddtNewItems);
    window.allNddtItems = allNddtItems;

    // Load PPHTDT Data
    let loadedPphtdtItems = null;
    try {
      const savedPphtdtStr = localStorage.getItem(STORAGE_KEY_PPHTDT_DATA);
      if (savedPphtdtStr) {
        const parsed = JSON.parse(savedPphtdtStr);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ma_lop && typeof parsed[0].c2_score === 'number' && parsed[0].c3_score === undefined) {
          loadedPphtdtItems = parsed;
        }
      }
    } catch (e) {}
    if (!loadedPphtdtItems && typeof RAW_PPHTDT_DATA !== 'undefined' && Array.isArray(RAW_PPHTDT_DATA)) {
      loadedPphtdtItems = RAW_PPHTDT_DATA;
    }
    allPphtdtItems = loadedPphtdtItems || [];
    window.allPphtdtItems = allPphtdtItems;

    // Load CSVC Data (Công tác tổ chức & Cơ sở vật chất)
    let loadedCsvcItems = null;
    try {
      const savedCsvcStr = localStorage.getItem(STORAGE_KEY_CSVC_DATA);
      if (savedCsvcStr) {
        const parsed = JSON.parse(savedCsvcStr);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ma_lop && typeof parsed[0].dia_diem === 'string' && ('cttc_score' in parsed[0])) {
          loadedCsvcItems = parsed;
        }
      }
    } catch (e) {}
    if (!loadedCsvcItems && typeof RAW_CSVC_DATA !== 'undefined' && Array.isArray(RAW_CSVC_DATA)) {
      loadedCsvcItems = RAW_CSVC_DATA;
    }
    allCsvcItems = loadedCsvcItems || [];
    window.allCsvcItems = allCsvcItems;

    // Normalize all datasets (ten_ct_full, hybrid hinh_thuc_hoc, ISO dates, numeric fields)
    normalizeAllModuleData();
    updateBookmarkBadges();

    // Initialize Tab Navigation FIRST so tabs always work regardless of module state
    initTabNavigation();

    // Initialize all 5 modules with isolated error boundaries
    try { setupDashboard(); } catch (e) { console.error("Error in setupDashboard:", e); }
    try { setupNddtModule(); } catch (e) { console.error("Error in setupNddtModule:", e); }
    try { setupPphtdtModule(); } catch (e) { console.error("Error in setupPphtdtModule:", e); }
    try { setupCsvcModule(); } catch (e) { console.error("Error in setupCsvcModule:", e); }
    try { setupGvModule(); } catch (e) { console.error("Error in setupGvModule:", e); }

    // Background sync from Google Sheets if online
    try {
      syncGoogleSheetData(getDefaultClassUrl(), { silent: true });
      syncGvGoogleSheetData(getDefaultGvUrl(), { silent: true });
      syncNddtGoogleSheetData(getDefaultNddtUrl(), { silent: true });
      syncNddtOldGoogleSheetData(getDefaultNddtOldUrl(), { silent: true });
      syncPphtdtGoogleSheetData(getDefaultPphtdtUrl(), { silent: true });
      syncCsvcGoogleSheetData(getDefaultCsvcUrl(), { silent: true });
    } catch (e) {
      console.warn("Background sheet sync skipped:", e);
    }
  }

  // --- TAB NAVIGATION ---
  let _lastSwitchId = '';
  let _lastSwitchTime = 0;
  function switchScreen(targetId) {
    if (!targetId) return;
    const now = Date.now();
    if (_lastSwitchId === targetId && (now - _lastSwitchTime) < 60) return;
    _lastSwitchId = targetId;
    _lastSwitchTime = now;

    document.querySelectorAll('.screen-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.screen === targetId);
    });
    document.querySelectorAll('.screen-content').forEach(c => {
      c.classList.toggle('active', c.id === targetId);
    });

    if (targetId === 'screenClassStatus') {
      activeView = 'overview';
      try { applyFilters(); } catch (e) { console.error("applyFilters error:", e); }
      requestAnimationFrame(() => {
        try { renderCharts(); } catch (e) { console.error("renderCharts error:", e); }
      });
    } else if (targetId === 'screenContentEval') {
      activeView = 'content';
      try { if (typeof applyNddtFilters === 'function') applyNddtFilters(); } catch (e) { console.error("applyNddtFilters error:", e); }
      requestAnimationFrame(() => {
        try { if (typeof renderNddtCharts === 'function') renderNddtCharts(); } catch (e) { console.error("renderNddtCharts error:", e); }
      });
    } else if (targetId === 'screenPphtdt') {
      activeView = 'pphtdt';
      try { if (typeof applyPphtdtFilters === 'function') applyPphtdtFilters(); } catch (e) { console.error("applyPphtdtFilters error:", e); }
      requestAnimationFrame(() => {
        try { if (typeof renderPphtdtCharts === 'function') renderPphtdtCharts(); } catch (e) { console.error("renderPphtdtCharts error:", e); }
      });
    } else if (targetId === 'screenCsvc') {
      activeView = 'csvc';
      try { if (typeof applyCsvcFilters === 'function') applyCsvcFilters(); } catch (e) { console.error("applyCsvcFilters error:", e); }
      requestAnimationFrame(() => {
        try { if (typeof renderCsvcCharts === 'function') renderCsvcCharts(); } catch (e) { console.error("renderCsvcCharts error:", e); }
      });
    } else if (targetId === 'screenGv') {
      activeView = 'gv';
      try { if (typeof applyGvFilters === 'function') applyGvFilters(); } catch (e) { console.error("applyGvFilters error:", e); }
      requestAnimationFrame(() => {
        try { if (typeof renderGvCharts === 'function') renderGvCharts(); } catch (e) { console.error("renderGvCharts error:", e); }
      });
    }
  }
  window.switchScreen = switchScreen;

  function initTabNavigation() {
    document.querySelectorAll('.screen-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = tab.dataset.screen;
        if (targetId) switchScreen(targetId);
      });
    });
  }

  function getDisplayFormat(c) {
    if (!c) return 'Trực tiếp';
    const raw = (c.hinh_thuc_hoc || c.hinh_thuc_dt || 'Trực tiếp').trim();
    const rawLower = raw.toLowerCase();

    // Nếu dữ liệu gốc đã ghi rõ là kết hợp
    if (rawLower.includes('kết hợp') || (rawLower.includes('tiếp') && rawLower.includes('tuyến'))) {
      return 'Trực tiếp kết hợp Trực tuyến';
    }

    // Nếu dòng này là Trực tuyến / Polycom / Online
    if (rawLower.includes('tuyến') || rawLower.includes('online') || rawLower.includes('polycom')) {
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
    } else if (lower.includes('tuyến') || lower.includes('online') || lower.includes('polycom')) {
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
    attachEventListeners();

    // Set initial preset pill active state (scoped to Screen 1 only)
    document.querySelectorAll('#screenClassStatus .preset-pills .pill').forEach(p => {
      if (p.dataset.preset === state.preset) p.classList.add('active');
      else p.classList.remove('active');
    });

    applyFilters();
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

  // Old lecturer filter dropdown populate removed - handled by setupGvModule

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

  // Old lecturer apply filter removed - handled by setupGvModule in Screen 5

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

  // Event Listeners for Filters (Screen 1: Tình hình lớp học)
  function attachEventListeners() {
    // Shared Date Presets (Scoped to Screen 1 only so Screens 2-4 preset pills are untouched)
    document.querySelectorAll('#screenClassStatus .preset-pills .pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('#screenClassStatus .preset-pills .pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const preset = e.currentTarget.dataset.preset;
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

        applyFilters();
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
        document.querySelectorAll('#screenClassStatus .preset-pills .pill').forEach(p => p.classList.remove('active'));

        applyFilters();
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

    // Window Resize Handler for Active Module Charts
    let chartResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(chartResizeTimer);
      chartResizeTimer = setTimeout(() => {
        if (activeView === 'overview') {
          renderClassAttendanceChart();
        } else if (activeView === 'content' && typeof renderNddtCharts === 'function') {
          renderNddtCharts();
        } else if (activeView === 'pphtdt' && typeof renderPphtdtCharts === 'function') {
          renderPphtdtCharts();
        } else if (activeView === 'csvc' && typeof renderCsvcCharts === 'function') {
          renderCsvcCharts();
        } else if (activeView === 'gv' && typeof renderGvCharts === 'function') {
          renderGvCharts();
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

    // Sheet Sync Header Controls
    const btnSyncNow = document.getElementById('btnSyncNow');
    if (btnSyncNow) {
      btnSyncNow.addEventListener('click', () => {
        syncGoogleSheetData(getDefaultClassUrl(), { silent: false });
        if (typeof syncGvGoogleSheetData === 'function') syncGvGoogleSheetData(getDefaultGvUrl(), { silent: true });
        if (typeof syncNddtGoogleSheetData === 'function') syncNddtGoogleSheetData(getDefaultNddtUrl(), { silent: true });
        if (typeof syncNddtOldGoogleSheetData === 'function') syncNddtOldGoogleSheetData(getDefaultNddtOldUrl(), { silent: true });
        if (typeof syncPphtdtGoogleSheetData === 'function') syncPphtdtGoogleSheetData(getDefaultPphtdtUrl(), { silent: true });
        if (typeof syncCsvcGoogleSheetData === 'function') syncCsvcGoogleSheetData(getDefaultCsvcUrl(), { silent: true });
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
        window.allClasses = allClasses;
        normalizeAllModuleData();
        try {
          localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(parsedData));
        } catch (stErr) {
          console.warn("Could not save to localStorage:", stErr);
        }
        populateFilterDropdowns();
        if (activeView === 'overview') applyFilters();

        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (statusBadge) statusBadge.className = 'sync-status-badge';
        if (statusText) statusText.textContent = `Đồng bộ: ${timeStr} (${allClasses.length} lớp)`;

        if (!isSilent) {
          showToast(`Đã đồng bộ ${allClasses.length} lớp học mới nhất từ Google Sheet!`, 'success');
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

  // syncGvGoogleSheetData is defined in GV Module Logic below

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

  // ==========================================================================
  // PHÂN HỆ 2: NỘI DUNG ĐÀO TẠO (CONTENT EVALUATION) LOGIC
  // ==========================================================================

  function setupNddtModule() {
    populateNddtFilterDropdowns();
    attachNddtEventListeners();
    applyNddtFilters();
  }

  function populateNddtFilterDropdowns() {
    const progSelect = document.getElementById('filterNddtProgram');
    const fmtSelect = document.getElementById('filterNddtFormat');
    const cbqlSelect = document.getElementById('filterNddtCbql');

    if (!progSelect || !fmtSelect || !cbqlSelect) return;

    const programs = [...new Set(allNddtItems.map(c => c.chuong_trinh).filter(Boolean))].sort();
    const formats = [...new Set(allNddtItems.map(c => c.hinh_thuc_hoc).filter(Boolean))].sort();
    const cbqls = [...new Set(allNddtItems.map(c => c.cbql).filter(Boolean))].sort();

    progSelect.innerHTML = '<option value="">-- Tất cả Chương trình (' + programs.length + ') --</option>' +
      programs.map(p => '<option value="' + p + '">' + p + '</option>').join('');

    fmtSelect.innerHTML = '<option value="">-- Tất cả Hình thức (' + formats.length + ') --</option>' +
      formats.map(f => '<option value="' + f + '">' + f + '</option>').join('');

    cbqlSelect.innerHTML = '<option value="">-- Tất cả Cán bộ QL (' + cbqls.length + ') --</option>' +
      cbqls.map(q => '<option value="' + q + '">' + q + '</option>').join('');
  }

  function updateBookmarkBadges() {
    const bNew = document.getElementById('bmCountNew');
    const bOld = document.getElementById('bmCountOld');
    const countNew = new Set(nddtNewItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)).size;
    const countOld = new Set(nddtOldItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)).size;
    if (bNew) bNew.textContent = countNew + ' lớp';
    if (bOld) bOld.textContent = countOld + ' lớp';
  }

  function switchNddtTemplate(tpl) {
    if (tpl !== 'new' && tpl !== 'old') return;
    nddtActiveTemplate = tpl;

    // Update active button classes
    const btnNew = document.getElementById('bmNddtNew');
    const btnOld = document.getElementById('bmNddtOld');
    if (btnNew) btnNew.classList.toggle('active', tpl === 'new');
    if (btnOld) btnOld.classList.toggle('active', tpl === 'old');

    // Switch data
    allNddtItems = (tpl === 'old' ? nddtOldItems : nddtNewItems);
    window.allNddtItems = allNddtItems;

    // Update criteria header labels
    const cfg = NDDT_CRITERIA_CONFIG[tpl] || NDDT_CRITERIA_CONFIG.new;
    const l1 = document.getElementById('kpiCrit1Label');
    const l2 = document.getElementById('kpiCrit2Label');
    const l3 = document.getElementById('kpiCrit3Label');
    if (l1) l1.textContent = cfg.short1;
    if (l2) l2.textContent = cfg.short2;
    if (l3) l3.textContent = cfg.short3;

    const th1 = document.getElementById('thNddtCrit1');
    const th2 = document.getElementById('thNddtCrit2');
    const th3 = document.getElementById('thNddtCrit3');
    if (th1) th1.innerHTML = cfg.th1 + ' <i class="fa-solid fa-sort"></i>';
    if (th2) th2.innerHTML = cfg.th2 + ' <i class="fa-solid fa-sort"></i>';
    if (th3) th3.innerHTML = cfg.th3 + ' <i class="fa-solid fa-sort"></i>';

    // Reset dropdown filters
    nddtState.program = '';
    nddtState.format = '';
    nddtState.cbql = '';
    nddtState.ratingLevel = '';
    nddtState.searchQuery = '';
    const sInput = document.getElementById('searchNddtInput');
    if (sInput) sInput.value = '';

    populateNddtFilterDropdowns();
    applyNddtFilters();
  }

  function attachNddtEventListeners() {
    // Bookmark buttons (Mẫu mới / Mẫu cũ)
    const btnBmNew = document.getElementById('bmNddtNew');
    const btnBmOld = document.getElementById('bmNddtOld');
    if (btnBmNew) btnBmNew.addEventListener('click', () => switchNddtTemplate('new'));
    if (btnBmOld) btnBmOld.addEventListener('click', () => switchNddtTemplate('old'));

    // Preset pills
    document.querySelectorAll('#nddtPresetPills .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#nddtPresetPills .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        nddtState.preset = pill.dataset.preset;
        applyNddtFilters();
      });
    });

    // Dropdowns
    const progSelect = document.getElementById('filterNddtProgram');
    if (progSelect) {
      progSelect.addEventListener('change', (e) => {
        nddtState.program = e.target.value;
        applyNddtFilters();
      });
    }

    const fmtSelect = document.getElementById('filterNddtFormat');
    if (fmtSelect) {
      fmtSelect.addEventListener('change', (e) => {
        nddtState.format = e.target.value;
        applyNddtFilters();
      });
    }

    const cbqlSelect = document.getElementById('filterNddtCbql');
    if (cbqlSelect) {
      cbqlSelect.addEventListener('change', (e) => {
        nddtState.cbql = e.target.value;
        applyNddtFilters();
      });
    }

    const ratingSelect = document.getElementById('filterNddtRatingLevel');
    if (ratingSelect) {
      ratingSelect.addEventListener('change', (e) => {
        nddtState.ratingLevel = e.target.value;
        applyNddtFilters();
      });
    }

    // Search
    const searchInp = document.getElementById('searchNddtInput');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        nddtState.searchQuery = e.target.value.toLowerCase().trim();
        applyNddtFilters();
      });
    }

    // Reset button
    const btnReset = document.getElementById('btnResetNddtFilters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        nddtState.preset = 'all';
        nddtState.program = '';
        nddtState.format = '';
        nddtState.cbql = '';
        nddtState.ratingLevel = '';
        nddtState.searchQuery = '';

        document.querySelectorAll('#nddtPresetPills .pill').forEach(p => {
          if (p.dataset.preset === 'all') p.classList.add('active');
          else p.classList.remove('active');
        });

        if (progSelect) progSelect.value = '';
        if (fmtSelect) fmtSelect.value = '';
        if (cbqlSelect) cbqlSelect.value = '';
        if (ratingSelect) ratingSelect.value = '';
        if (searchInp) searchInp.value = '';

        applyNddtFilters();
        showToast('Đã đặt lại toàn bộ bộ lọc Nội dung đào tạo', 'info');
      });
    }

    // Toggle comparison chart view
    const btnProg = document.getElementById('btnNddtViewProgram');
    const btnClass = document.getElementById('btnNddtViewClass');
    if (btnProg && btnClass) {
      btnProg.addEventListener('click', () => {
        btnProg.classList.add('active');
        btnClass.classList.remove('active');
        nddtState.comparisonView = 'program';
        renderNddtComparisonChart();
      });
      btnClass.addEventListener('click', () => {
        btnClass.classList.add('active');
        btnProg.classList.remove('active');
        nddtState.comparisonView = 'class';
        renderNddtComparisonChart();
      });
    }

    // Table sorting
    document.querySelectorAll('#nddtClassesTable th[data-nddt-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.nddtSort;
        if (nddtCurrentSort.column === col) {
          nddtCurrentSort.dir = nddtCurrentSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          nddtCurrentSort.column = col;
          nddtCurrentSort.dir = 'desc';
        }
        renderNddtTable();
      });
    });

    // Export buttons
    const btnExportExcel = document.getElementById('btnExportNddtExcel');
    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', () => exportNddtToCsv(true));
    }
    const btnExportCsv = document.getElementById('btnExportNddtCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => exportNddtToCsv(false));
    }
  }

  function applyNddtFilters() {
    filteredNddtItems = allNddtItems.filter(item => {
      // 1. Preset Time Filter
      if (nddtState.preset !== 'all') {
        const dateStr = item.ngay_bd || '';
        if (nddtState.preset === '2026') {
          if (!dateStr.startsWith('2026') && !(item.ngay_bd_raw && item.ngay_bd_raw.includes('2026'))) return false;
        } else if (nddtState.preset === 'q1') {
          const m = parseInt(dateStr.slice(5, 7), 10);
          if (!(m >= 1 && m <= 3)) return false;
        } else if (nddtState.preset === 'q2') {
          const m = parseInt(dateStr.slice(5, 7), 10);
          if (!(m >= 4 && m <= 6)) return false;
        } else if (nddtState.preset === 'q3') {
          const m = parseInt(dateStr.slice(5, 7), 10);
          if (!(m >= 7 && m <= 9)) return false;
        } else if (nddtState.preset === 'q4') {
          const m = parseInt(dateStr.slice(5, 7), 10);
          if (!(m >= 10 && m <= 12)) return false;
        }
      }

      // 2. Program Filter
      if (nddtState.program && item.chuong_trinh !== nddtState.program) return false;

      // 3. Format Filter
      if (nddtState.format && item.hinh_thuc_hoc !== nddtState.format) return false;

      // 4. CBQL Filter
      if (nddtState.cbql && item.cbql !== nddtState.cbql) return false;

      // 5. Rating Level Filter
      if (nddtState.ratingLevel) {
        if (nddtState.ratingLevel === 'high' && item.diem_tb < 3.8) return false;
        if (nddtState.ratingLevel === 'medium' && (item.diem_tb < 3.5 || item.diem_tb >= 3.8)) return false;
        if (nddtState.ratingLevel === 'low' && item.diem_tb >= 3.5) return false;
      }

      // 6. Search Query
      if (nddtState.searchQuery) {
        const q = nddtState.searchQuery;
        const text = ((item.ma_lop || '') + ' ' + (item.chuong_trinh || '') + ' ' + (item.ten_ct_full || '') + ' ' + (item.cbql || '')).toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });

    updateNddtKPIs();
    renderNddtCharts();
    renderNddtTable();
  }

  function updateNddtKPIs() {
    const classCountElem = document.getElementById('kpiNddtClassCount');
    const programCountElem = document.getElementById('kpiNddtProgramCount');
    const totalVotesElem = document.getElementById('kpiNddtTotalVotes');
    const avgScoreElem = document.getElementById('kpiNddtAvgScore');
    const ratingBadgeElem = document.getElementById('kpiNddtScoreRatingBadge');
    const posRateElem = document.getElementById('kpiNddtPosRate');
    const crit1Elem = document.getElementById('kpiCrit1Score');
    const crit2Elem = document.getElementById('kpiCrit2Score');
    const crit3Elem = document.getElementById('kpiCrit3Score');

    const uniqueClasses = new Set(filteredNddtItems.map(r => r.ma_lop).filter(Boolean));
    const uniquePrograms = new Set(filteredNddtItems.map(r => r.chuong_trinh).filter(Boolean));

    const totalVotes = filteredNddtItems.reduce((sum, r) => sum + (r.tong_phieu || 0), 0);

    // Sum criteria votes
    let c1 = { pts: 0, n: 0, pos: 0 };
    let c2 = { pts: 0, n: 0, pos: 0 };
    let c3 = { pts: 0, n: 0, pos: 0 };

    filteredNddtItems.forEach(r => {
      c1.pts += (4 * r.c1_4 + 3 * r.c1_3 + 2 * r.c1_2 + 1 * r.c1_1);
      c1.n += r.c1_n;
      c1.pos += (r.c1_4 + r.c1_3);

      c2.pts += (4 * r.c2_4 + 3 * r.c2_3 + 2 * r.c2_2 + 1 * r.c2_1);
      c2.n += r.c2_n;
      c2.pos += (r.c2_4 + r.c2_3);

      c3.pts += (4 * r.c3_4 + 3 * r.c3_3 + 2 * r.c3_2 + 1 * r.c3_1);
      c3.n += r.c3_n;
      c3.pos += (r.c3_4 + r.c3_3);
    });

    const s1 = c1.n > 0 ? c1.pts / c1.n : 0;
    const s2 = c2.n > 0 ? c2.pts / c2.n : 0;
    const s3 = c3.n > 0 ? c3.pts / c3.n : 0;

    const validCriteria = [s1, s2, s3].filter(s => s > 0);
    const overallAvg = validCriteria.length > 0 ? (validCriteria.reduce((a, b) => a + b, 0) / validCriteria.length) : 0;

    const totalCritVotes = c1.n + c2.n + c3.n;
    const totalPosVotes = c1.pos + c2.pos + c3.pos;
    const posRate = totalCritVotes > 0 ? (totalPosVotes / totalCritVotes * 100) : 0;

    if (classCountElem) classCountElem.textContent = uniqueClasses.size.toLocaleString();
    if (programCountElem) programCountElem.textContent = uniquePrograms.size.toLocaleString();
    if (totalVotesElem) totalVotesElem.textContent = totalVotes.toLocaleString();
    if (avgScoreElem) avgScoreElem.textContent = overallAvg > 0 ? overallAvg.toFixed(2) : '-';
    if (posRateElem) posRateElem.textContent = posRate > 0 ? posRate.toFixed(1) : '-';

    if (ratingBadgeElem) {
      if (overallAvg >= 3.8) {
        ratingBadgeElem.textContent = 'Đánh giá chung: Rất tốt / Xuất sắc';
        ratingBadgeElem.style.color = '#0F5132';
      } else if (overallAvg >= 3.5) {
        ratingBadgeElem.textContent = 'Đánh giá chung: Tốt / Đạt chuẩn';
        ratingBadgeElem.style.color = '#10B981';
      } else if (overallAvg > 0) {
        ratingBadgeElem.textContent = 'Đánh giá chung: Cần rà soát';
        ratingBadgeElem.style.color = '#D97706';
      } else {
        ratingBadgeElem.textContent = 'Chưa có dữ liệu đánh giá';
        ratingBadgeElem.style.color = 'var(--text-muted)';
      }
    }

    if (crit1Elem) crit1Elem.textContent = s1 > 0 ? s1.toFixed(2) : '-';
    if (crit2Elem) crit2Elem.textContent = s2 > 0 ? s2.toFixed(2) : '-';
    if (crit3Elem) crit3Elem.textContent = s3 > 0 ? s3.toFixed(2) : '-';
  }

  function renderNddtCharts() {
    renderNddtStackedBarChart();
    renderNddtComparisonChart();
  }

  function renderNddtStackedBarChart() {
    const canvas = document.getElementById('nddtStackedBarChart');
    if (!canvas) return;

    if (nddtCharts.stackedBar) {
      nddtCharts.stackedBar.destroy();
      nddtCharts.stackedBar = null;
    }

    // Sum votes for the 3 criteria
    let c1 = { 4: 0, 3: 0, 2: 0, 1: 0, n: 0 };
    let c2 = { 4: 0, 3: 0, 2: 0, 1: 0, n: 0 };
    let c3 = { 4: 0, 3: 0, 2: 0, 1: 0, n: 0 };

    filteredNddtItems.forEach(r => {
      c1[4] += r.c1_4; c1[3] += r.c1_3; c1[2] += r.c1_2; c1[1] += r.c1_1; c1.n += r.c1_n;
      c2[4] += r.c2_4; c2[3] += r.c2_3; c2[2] += r.c2_2; c2[1] += r.c2_1; c2.n += r.c2_n;
      c3[4] += r.c3_4; c3[3] += r.c3_3; c3[2] += r.c3_2; c3[1] += r.c3_1; c3.n += r.c3_n;
    });

    const calcP = (crit, lvl) => crit.n > 0 ? (crit[lvl] / crit.n * 100) : 0;

    const dataTot = [calcP(c1, 4), calcP(c2, 4), calcP(c3, 4)];
    const dataKha = [calcP(c1, 3), calcP(c2, 3), calcP(c3, 3)];
    const dataBt = [calcP(c1, 2), calcP(c2, 2), calcP(c3, 2)];
    const dataHc = [calcP(c1, 1), calcP(c2, 1), calcP(c3, 1)];

    const rawVotes = [c1, c2, c3];

    // Dynamic criteria labels according to active template
    const tplCfg = (typeof NDDT_CRITERIA_CONFIG !== 'undefined' && NDDT_CRITERIA_CONFIG[nddtActiveTemplate])
      ? NDDT_CRITERIA_CONFIG[nddtActiveTemplate]
      : { chartLabels: ['1. Tiêu chí 1', '2. Tiêu chí 2', '3. Tiêu chí 3'] };

    const ctx = canvas.getContext('2d');
    nddtCharts.stackedBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: tplCfg.chartLabels,
        datasets: [
          {
            label: 'Tốt (4 điểm)',
            data: dataTot,
            backgroundColor: '#1E5E47', // Deep Emerald Green (êm dịu, sang trọng)
            hoverBackgroundColor: '#164E3A',
            borderRadius: 4,
            maxBarThickness: 28
          },
          {
            label: 'Khá (3 điểm)',
            data: dataKha,
            backgroundColor: '#48A97C', // Mint Jade Green (tươi sáng nhưng không chói lóa)
            hoverBackgroundColor: '#3A966B',
            borderRadius: 4,
            maxBarThickness: 28
          },
          {
            label: 'Bình thường (2 điểm)',
            data: dataBt,
            backgroundColor: '#D68B35', // Warm Amber Ochre (ấm áp, không gắt)
            hoverBackgroundColor: '#C27A26',
            borderRadius: 4,
            maxBarThickness: 28
          },
          {
            label: 'Hạn chế (1 điểm)',
            data: dataHc,
            backgroundColor: '#C84646', // Soft Coral Brick Red (đỏ gạch dịu nhẹ, không lóa)
            hoverBackgroundColor: '#B33838',
            borderRadius: 4,
            maxBarThickness: 28
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            max: 100,
            ticks: {
              callback: v => v + '%',
              font: { family: 'Plus Jakarta Sans', weight: '600', size: 10 }
            },
            grid: { color: '#E2E8F0' }
          },
          y: {
            stacked: true,
            ticks: {
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 },
              color: '#374151'
            },
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 10.5 },
              color: '#374151'
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
            bodyFont: { family: 'Plus Jakarta Sans' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: function(context) {
                const datasetLabel = context.dataset.label || '';
                const pct = context.parsed.x.toFixed(1) + '%';
                const critIdx = context.dataIndex;
                const crit = rawVotes[critIdx];
                let count = 0;
                if (context.datasetIndex === 0) count = crit[4];
                else if (context.datasetIndex === 1) count = crit[3];
                else if (context.datasetIndex === 2) count = crit[2];
                else if (context.datasetIndex === 3) count = crit[1];
                return datasetLabel + ': ' + pct + ' (' + count + ' phiếu)';
              }
            }
          }
        }
      }
    });
  }

  function renderNddtComparisonChart() {
    const canvas = document.getElementById('nddtComparisonChart');
    if (!canvas) return;

    if (nddtCharts.comparison) {
      nddtCharts.comparison.destroy();
      nddtCharts.comparison = null;
    }

    // Group filteredNddtItems by program
    const pMap = {};
    filteredNddtItems.forEach(r => {
      const p = r.chuong_trinh || 'Khác';
      if (!pMap[p]) {
        pMap[p] = {
          name: p,
          c1_pts: 0, c1_n: 0,
          c2_pts: 0, c2_n: 0,
          c3_pts: 0, c3_n: 0,
          classes: 0,
          votes: 0
        };
      }
      pMap[p].c1_pts += (r.c1_score * (r.c1_n || 1));
      pMap[p].c1_n += (r.c1_n || 1);
      pMap[p].c2_pts += (r.c2_score * (r.c2_n || 1));
      pMap[p].c2_n += (r.c2_n || 1);
      pMap[p].c3_pts += (r.c3_score * (r.c3_n || 1));
      pMap[p].c3_n += (r.c3_n || 1);
      pMap[p].classes++;
      pMap[p].votes += (r.tong_phieu || 0);
    });

    const progList = Object.keys(pMap).map(p => {
      const item = pMap[p];
      const s1 = item.c1_n > 0 ? item.c1_pts / item.c1_n : 0;
      const s2 = item.c2_n > 0 ? item.c2_pts / item.c2_n : 0;
      const s3 = item.c3_n > 0 ? item.c3_pts / item.c3_n : 0;
      const avg = (s1 + s2 + s3) / 3;
      return {
        name: p,
        s1: Number(s1.toFixed(2)),
        s2: Number(s2.toFixed(2)),
        s3: Number(s3.toFixed(2)),
        avg: Number(avg.toFixed(2)),
        classes: item.classes,
        votes: item.votes
      };
    }).sort((a, b) => b.avg - a.avg);

    // Update count hint
    const progHint = document.getElementById('nddtProgCountHint');
    if (progHint) progHint.textContent = progList.length;

    // Calculate dynamic width for smooth horizontal scrolling
    const scrollInner = document.getElementById('nddtComparisonScrollInner');
    const scrollOuter = document.getElementById('nddtComparisonScrollOuter');
    if (scrollInner) {
      const outerWidth = scrollOuter ? scrollOuter.clientWidth : 650;
      const calcWidth = Math.max(outerWidth, progList.length * 54);
      scrollInner.style.width = calcWidth + 'px';
    }

    const labels = progList.map(p => p.name);
    const data1 = progList.map(p => p.s1);
    const data2 = progList.map(p => p.s2);
    const data3 = progList.map(p => p.s3);

    // Criteria labels based on active template (Mẫu mới vs Mẫu cũ)
    const tplCfg = (typeof NDDT_CRITERIA_CONFIG !== 'undefined' && NDDT_CRITERIA_CONFIG[nddtActiveTemplate])
      ? NDDT_CRITERIA_CONFIG[nddtActiveTemplate]
      : { chartLabels: ['TC1', 'TC2', 'TC3'] };

    // Expanded Y-Axis Scale starting at 3.0 (or lower if score drops) so lines have vertical breathing room
    const allScores = [...data1, ...data2, ...data3].filter(s => s > 0);
    const minVal = allScores.length > 0 ? Math.min(...allScores) : 3.0;
    const yMin = minVal < 3.0 ? Math.max(2.0, Math.floor((minVal - 0.1) * 10) / 10) : 3.0;

    const ctx = canvas.getContext('2d');
    nddtCharts.comparison = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: tplCfg.chartLabels[0],
            data: data1,
            borderColor: '#A12846', // Agribank Crimson Bordeaux (sắc sảo, sang trọng, không chói)
            backgroundColor: '#A12846',
            pointBackgroundColor: '#A12846',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverRadius: 6.5,
            pointStyle: 'circle',
            tension: 0.25,
            borderWidth: 2.5
          },
          {
            label: tplCfg.chartLabels[1],
            data: data2,
            borderColor: '#24825F', // Forest Jade (tươi sáng hơn đỏ nhưng không lóa, dịu mắt)
            backgroundColor: '#24825F',
            pointBackgroundColor: '#24825F',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointStyle: 'rectRot', // Diamond
            tension: 0.25,
            borderWidth: 2.5
          },
          {
            label: tplCfg.chartLabels[2],
            data: data3,
            borderColor: '#2E6DA4', // Ocean Slate Blue (lam đại dương trầm, thanh lịch, êm dịu)
            backgroundColor: '#2E6DA4',
            pointBackgroundColor: '#2E6DA4',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointStyle: 'triangle',
            tension: 0.25,
            borderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          y: {
            min: yMin,
            max: 4.0,
            ticks: {
              stepSize: 0.2,
              font: { family: 'Plus Jakarta Sans', weight: '600', size: 10.5 }
            },
            grid: { color: '#E2E8F0' }
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 10 },
              color: '#374151'
            },
            grid: { color: '#F1F5F9' }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 },
              color: '#374151',
              padding: 12
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
            bodyFont: { family: 'Plus Jakarta Sans' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: function(items) {
                if (!items || items.length === 0) return '';
                const idx = items[0].dataIndex;
                const prog = progList[idx];
                return 'Chương trình: ' + prog.name + ' (' + prog.classes + ' lớp - ' + prog.votes + ' phiếu)';
              },
              label: function(context) {
                const label = context.dataset.label || '';
                const val = context.parsed.y;
                return label + ': ' + val.toFixed(2) + ' / 4.0';
              }
            }
          }
        }
      }
    });

    // Enable drag-to-scroll on horizontal container
    if (scrollOuter && !scrollOuter._hasDragScroll) {
      scrollOuter._hasDragScroll = true;
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      scrollOuter.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - scrollOuter.offsetLeft;
        scrollLeft = scrollOuter.scrollLeft;
      });
      scrollOuter.addEventListener('mouseleave', () => { isDown = false; });
      scrollOuter.addEventListener('mouseup', () => { isDown = false; });
      scrollOuter.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollOuter.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollOuter.scrollLeft = scrollLeft - walk;
      });
    }
  }

  function renderNddtTable() {
    const tbody = document.getElementById('nddtTableBody');
    const filteredCountElem = document.getElementById('nddtTableFilteredCount');
    const totalCountElem = document.getElementById('nddtTableTotalCount');
    const statusCountElem = document.getElementById('nddtTableStatusCount');

    const distinctFiltered = new Set(filteredNddtItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)).size;
    const distinctTotal = new Set(allNddtItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)).size;

    if (totalCountElem) totalCountElem.textContent = distinctTotal.toLocaleString();
    if (filteredCountElem) filteredCountElem.textContent = distinctFiltered.toLocaleString();
    if (statusCountElem) statusCountElem.textContent = distinctFiltered.toLocaleString();

    if (!tbody) return;

    if (filteredNddtItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i> Không có lớp học nào thỏa mãn điều kiện lọc. Hãy chọn lại bộ lọc.</td></tr>';
      return;
    }

    // Sort items
    const sorted = [...filteredNddtItems].sort((a, b) => {
      let va = a[nddtCurrentSort.column];
      let vb = b[nddtCurrentSort.column];

      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();

      if (va < vb) return nddtCurrentSort.dir === 'asc' ? -1 : 1;
      if (va > vb) return nddtCurrentSort.dir === 'asc' ? 1 : -1;
      return 0;
    });

    const html = sorted.map((r, idx) => {
      // Mini score bars
      const renderMiniBar = (score) => {
        const pct = Math.min(100, Math.max(0, (score / 4.0) * 100)).toFixed(0);
        let color = '#10B981';
        if (score < 3.5) color = '#D97706';
        if (score < 3.0) color = '#EF4444';
        return '<div class="mini-score-bar-wrapper"><span class="mini-score-val">' + score.toFixed(2) + '</span><div class="mini-score-track"><div class="mini-score-fill" style="width: ' + pct + '%; background: ' + color + ';"></div></div></div>';
      };

      let badgeHtml = getFormatBadge(r);
      if (badgeHtml && badgeHtml.includes('TRỰC TIẾP KẾT HỢP TRỰC TUYẾN')) {
        badgeHtml = badgeHtml.replace('TRỰC TIẾP KẾT HỢP TRỰC TUYẾN', 'TRỰC TIẾP KẾT HỢP<br>TRỰC TUYẾN');
      }

      return '<tr onclick="window.openNddtModalById(' + r.id + ')" style="cursor: pointer;">' +
        '<td style="text-align: center; color: var(--text-muted); font-size: 0.76rem;">' + (idx + 1) + '</td>' +
        '<td>' +
          '<div style="font-weight: 800; color: var(--brand-primary); font-size: 0.82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="' + r.ma_lop + '">' + r.ma_lop + '</div>' +
          '<div style="font-size: 0.74rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.25;" title="' + (r.ten_ct_full || r.chuong_trinh) + '">' +
            (r.ten_ct_full || r.chuong_trinh) +
          '</div>' +
        '</td>' +
        '<td style="text-align: center;">' + badgeHtml + '</td>' +
        '<td style="font-size: 0.76rem; line-height: 1.3; overflow: hidden;">' +
          '<div style="white-space: nowrap;">' + (r.ngay_bd_raw || '') + (r.ngay_kt_raw ? ' — ' + r.ngay_kt_raw : '') + '</div>' +
          '<div style="font-size: 0.71rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="' + (r.cbql || '') + '"><i class="fa-solid fa-user-tie"></i> ' + (r.cbql || 'Chưa cập nhật') + '</div>' +
        '</td>' +
        '<td style="text-align: center; font-weight: 800; color: #0284C7; font-size: 0.84rem;">' + r.tong_phieu + '</td>' +
        '<td>' + renderMiniBar(r.c1_score) + '</td>' +
        '<td>' + renderMiniBar(r.c2_score) + '</td>' +
        '<td>' + renderMiniBar(r.c3_score) + '</td>' +
        '<td style="text-align: center; font-size: 0.88rem; font-weight: 800; color: var(--brand-primary);">' + r.diem_tb.toFixed(2) + '</td>' +
        '<td style="text-align: center;">' +
          '<span class="badge" style="background: #ECFDF5; color: #0F5132; font-weight: 700; font-size: 0.74rem; padding: 0.15rem 0.35rem;">' + r.ty_le_tich_cuc.toFixed(1) + '%</span>' +
        '</td>' +
        '<td style="text-align: center;" onclick="event.stopPropagation(); window.openNddtModalById(' + r.id + ');">' +
          '<button class="btn-detail-nddt" type="button" title="Xem phân rã 4 mức đánh giá">' +
            '<i class="fa-solid fa-chart-pie"></i> Chi tiết' +
          '</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    tbody.innerHTML = html;
  }

  function exportNddtToCsv(isExcelFormat) {
    if (!filteredNddtItems || filteredNddtItems.length === 0) {
      showToast('Không có dữ liệu để xuất!', 'warning');
      return;
    }

    const headers = [
      'STT',
      'Mã Lớp',
      'Chương Trình',
      'Tên Đầy Đủ',
      'Hình Thức',
      'Ngày Bắt Đầu',
      'Ngày Kết Thúc',
      'CBQL',
      'Số Phiếu',
      'TC1 Phù Hợp (Điểm TB)',
      'TC2 Thực Tiễn (Điểm TB)',
      'TC3 Áp Dụng (Điểm TB)',
      'Điểm TB Chung (Thang 4.0)',
      'Tỷ Lệ Tích Cực (%)'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return '"' + str + '"';
    };

    const rows = [headers.map(escapeCsv).join(',')];

    filteredNddtItems.forEach((r, idx) => {
      rows.push([
        escapeCsv(idx + 1),
        escapeCsv(r.ma_lop),
        escapeCsv(r.chuong_trinh),
        escapeCsv(r.ten_ct_full || ''),
        escapeCsv(r.hinh_thuc_hoc),
        escapeCsv(r.ngay_bd_raw),
        escapeCsv(r.ngay_kt_raw),
        escapeCsv(r.cbql),
        escapeCsv(r.tong_phieu),
        escapeCsv(r.c1_score.toFixed(2)),
        escapeCsv(r.c2_score.toFixed(2)),
        escapeCsv(r.c3_score.toFixed(2)),
        escapeCsv(r.diem_tb.toFixed(2)),
        escapeCsv(r.ty_le_tich_cuc.toFixed(1) + '%')
      ].join(','));
    });

    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Bao_cao_danh_gia_Noi_dung_dao_tao_' + dateStr + (isExcelFormat ? '.csv' : '.csv'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Đã xuất thành công ' + filteredNddtItems.length + ' bản ghi đánh giá Nội dung đào tạo!', 'success');
  }

  async function syncNddtOldGoogleSheetData(sheetUrl, options = {}) {
    const isSilent = Boolean(options.silent);
    try {
      const targetUrl = sheetUrl || getDefaultNddtOldUrl();
      if (!targetUrl) return;

      const csvUrl = getGoogleSheetCsvExportUrl(targetUrl);
      const fetchUrl = csvUrl + (csvUrl.includes('?') ? '&' : '?') + '_t=' + Date.now();

      const res = await fetch(fetchUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      const csvText = await res.text();
      const parsed = parseCsvToNddtItems(csvText);

      if (parsed && parsed.length > 0) {
        nddtOldItems = parsed;
        normalizeAllModuleData();
        try {
          localStorage.setItem(STORAGE_KEY_NDDT_OLD_DATA, JSON.stringify(nddtOldItems));
        } catch (stErr) {}

        if (nddtActiveTemplate === 'old') {
          allNddtItems = nddtOldItems;
          window.allNddtItems = allNddtItems;
          populateNddtFilterDropdowns();
          if (activeView === 'content') applyNddtFilters();
        }

        updateBookmarkBadges();

        if (!isSilent) {
          showToast('Đã đồng bộ ' + nddtOldItems.length + ' lớp đánh giá Mẫu cũ từ Google Sheet!', 'success');
        }
      }
    } catch (e) {
      console.warn('NDDT Old sheet sync error:', e);
    }
  }

  async function syncNddtGoogleSheetData(sheetUrl, options = {}) {
    const isSilent = Boolean(options.silent);
    try {
      const targetUrl = sheetUrl || getDefaultNddtUrl();
      if (!targetUrl) return;

      let csvUrl = getGoogleSheetCsvExportUrl(targetUrl);
      if (csvUrl.includes('script.google.com') || csvUrl.includes('macros/s/')) {
        if (!csvUrl.includes('gid=') && !csvUrl.includes('sheet=')) {
          csvUrl += (csvUrl.includes('?') ? '&' : '?') + 'gid=0';
        }
      }
      const fetchUrl = csvUrl + (csvUrl.includes('?') ? '&' : '?') + '_t=' + Date.now();

      const res = await fetch(fetchUrl, { cache: 'no-store', redirect: 'follow' });
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      const csvText = await res.text();
      const parsed = parseCsvToNddtItems(csvText);

      if (parsed && parsed.length > 0) {
        nddtNewItems = parsed;
        normalizeAllModuleData();
        if (nddtActiveTemplate === 'new') {
          allNddtItems = nddtNewItems;
          window.allNddtItems = allNddtItems;
        }
        try {
          localStorage.setItem(STORAGE_KEY_NDDT_DATA, JSON.stringify(nddtNewItems));
        } catch (stErr) {
          console.warn('Could not save NDDT to localStorage:', stErr);
        }
        updateBookmarkBadges();
        populateNddtFilterDropdowns();
        if (activeView === 'content') applyNddtFilters();

        if (!isSilent) {
          showToast('Đã đồng bộ ' + allNddtItems.length + ' lớp đánh giá nội dung từ Google Sheet!', 'success');
        }
      }
    } catch (e) {
      console.warn('NDDT sheet sync error:', e);
    }
  }

  function parseCsvToNddtItems(csvText) {
    if (!csvText || csvText.trim().startsWith('<')) return [];
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length <= 1) return [];

    // Build rawClasses mapping if available
    const rawMap = new Map();
    if (typeof allClasses !== 'undefined' && Array.isArray(allClasses)) {
      allClasses.forEach(c => {
        if (c.ma_lop) rawMap.set(c.ma_lop.trim().toLowerCase(), c);
      });
    }

    const parseLine = (text) => {
      const p = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          if (inQuotes && text[i+1] === '"') { cur += '"'; i++; }
          else { inQuotes = !inQuotes; }
        } else if (c === ',' && !inQuotes) {
          p.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      p.push(cur.trim());
      return p;
    };

    const parseFlexibleDate = (dStr) => {
      if (!dStr) return '';
      dStr = dStr.trim();
      const parts = dStr.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return year + '-' + month + '-' + day;
      }
      const clean = dStr.replace(/\s*\([^)]*\)$/, '');
      const d = new Date(clean);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
      }
      return dStr;
    };

    const headerCols = parseLine(lines[0]);
    const headers = headerCols.map(h => h.trim().toLowerCase());

    // Strict schema check for NDDT CSV (must have Chương trình in col 0, Mã lớp, and 3 4-point criteria)
    if (headers[0] && headers[0].includes('địa điểm')) return [];
    let idxProg = headers.findIndex(h => h.includes('chương trình'));
    let idxMaLop = headers.findIndex(h => h.includes('mã lớp'));
    if (idxProg < 0 || idxMaLop < 0) return [];

    let idxFmt = headers.findIndex(h => h.includes('hình thức'));
    let idxNgayBd = headers.findIndex(h => h.includes('bắt đầu'));
    let idxNgayKt = headers.findIndex(h => h.includes('kết thúc'));
    let idxCbql = headers.findIndex(h => h.includes('cbql') || h.includes('cán bộ'));

    if (idxFmt < 0) idxFmt = 2;
    if (idxNgayBd < 0) idxNgayBd = 3;
    if (idxNgayKt < 0) idxNgayKt = 4;

    const c4Indices = [];
    headers.forEach((h, idx) => {
      if (h.startsWith('4 -') || h.startsWith('4-')) {
        c4Indices.push(idx);
      }
    });
    if (c4Indices.length !== 3) return [];

    const c1_start = c4Indices.length > 0 ? c4Indices[0] : 5;
    const c2_start = c4Indices.length > 1 ? c4Indices[1] : 9;
    const c3_start = c4Indices.length > 2 ? c4Indices[2] : 13;

    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      const ct = cols[idxProg] || '';
      const maLop = cols[idxMaLop] || '';
      const fmt = cols[idxFmt] || '';
      const ngayBd = cols[idxNgayBd] || '';
      const ngayKt = cols[idxNgayKt] || '';

      if (!ct && !maLop) continue;

      const c1_4 = Number(cols[c1_start]) || 0;
      const c1_3 = Number(cols[c1_start + 1]) || 0;
      const c1_2 = Number(cols[c1_start + 2]) || 0;
      const c1_1 = Number(cols[c1_start + 3]) || 0;
      const c1_n = c1_4 + c1_3 + c1_2 + c1_1;
      const c1_score = c1_n > 0 ? (4 * c1_4 + 3 * c1_3 + 2 * c1_2 + 1 * c1_1) / c1_n : 0;
      const c1_pos = c1_n > 0 ? (c1_4 + c1_3) / c1_n * 100 : 0;

      const c2_4 = Number(cols[c2_start]) || 0;
      const c2_3 = Number(cols[c2_start + 1]) || 0;
      const c2_2 = Number(cols[c2_start + 2]) || 0;
      const c2_1 = Number(cols[c2_start + 3]) || 0;
      const c2_n = c2_4 + c2_3 + c2_2 + c2_1;
      const c2_score = c2_n > 0 ? (4 * c2_4 + 3 * c2_3 + 2 * c2_2 + 1 * c2_1) / c2_n : 0;
      const c2_pos = c2_n > 0 ? (c2_4 + c2_3) / c2_n * 100 : 0;

      const c3_4 = Number(cols[c3_start]) || 0;
      const c3_3 = Number(cols[c3_start + 1]) || 0;
      const c3_2 = Number(cols[c3_start + 2]) || 0;
      const c3_1 = Number(cols[c3_start + 3]) || 0;
      const c3_n = c3_4 + c3_3 + c3_2 + c3_1;
      const c3_score = c3_n > 0 ? (4 * c3_4 + 3 * c3_3 + 2 * c3_2 + 1 * c3_1) / c3_n : 0;
      const c3_pos = c3_n > 0 ? (c3_4 + c3_3) / c3_n * 100 : 0;

      const cbql = idxCbql >= 0 ? (cols[idxCbql] || '') : (cols[17] || '');
      const chk1 = Number(cols[18]) || 0;

      const validScores = [];
      if (c1_n > 0) validScores.push(c1_score);
      if (c2_n > 0) validScores.push(c2_score);
      if (c3_n > 0) validScores.push(c3_score);
      const avgScore = validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;

      const totalVotes = Math.max(c1_n, c2_n, c3_n, chk1);
      const totalPos = (c1_n > 0 || c2_n > 0 || c3_n > 0)
        ? ((c1_4 + c1_3 + c2_4 + c2_3 + c3_4 + c3_3) / ((c1_n + c2_n + c3_n) || 1) * 100)
        : 0;

      let tenCtFull = '';
      if (rawMap.has(maLop.toLowerCase())) {
        tenCtFull = rawMap.get(maLop.toLowerCase()).ten_ct || '';
      }

      items.push({
        id: i,
        chuong_trinh: ct,
        ma_lop: maLop,
        ten_ct_full: tenCtFull,
        hinh_thuc_hoc: fmt,
        ngay_bd_raw: ngayBd,
        ngay_kt_raw: ngayKt,
        ngay_bd: parseFlexibleDate(ngayBd),
        ngay_kt: parseFlexibleDate(ngayKt),
        c1_4, c1_3, c1_2, c1_1, c1_n, c1_score, c1_pos,
        c2_4, c2_3, c2_2, c2_1, c2_n, c2_score, c2_pos,
        c3_4, c3_3, c3_2, c3_1, c3_n, c3_score, c3_pos,
        diem_tb: avgScore,
        ty_le_tich_cuc: totalPos,
        tong_phieu: totalVotes,
        cbql
      });
    }
    return items;
  }



  // ==========================================================================
  // PHÂN HỆ: ĐÁNH GIÁ VỀ PHƯƠNG PHÁP, HÌNH THỨC ĐÀO TẠO (PPHTDT)
  // ==========================================================================

  function setupPphtdtModule() {
    populatePphtdtFilterDropdowns();
    attachPphtdtEventListeners();
    applyPphtdtFilters();
  }

  function populatePphtdtFilterDropdowns() {
    const progSelect = document.getElementById('filterPphtdtProgram');
    const fmtSelect = document.getElementById('filterPphtdtFormat');
    const cbqlSelect = document.getElementById('filterPphtdtCbql');

    if (!progSelect || !fmtSelect || !cbqlSelect) return;

    const programs = [...new Set(allPphtdtItems.map(c => c.chuong_trinh).filter(Boolean))].sort();
    const formats = [...new Set(allPphtdtItems.map(c => c.hinh_thuc_hoc).filter(Boolean))].sort();
    const cbqls = [...new Set(allPphtdtItems.map(c => c.cbql).filter(Boolean))].sort();

    progSelect.innerHTML = '<option value="">-- Tất cả Chương trình (' + programs.length + ') --</option>' +
      programs.map(p => '<option value="' + p + '">' + p + '</option>').join('');

    fmtSelect.innerHTML = '<option value="">-- Tất cả Hình thức (' + formats.length + ') --</option>' +
      formats.map(f => '<option value="' + f + '">' + f + '</option>').join('');

    cbqlSelect.innerHTML = '<option value="">-- Tất cả Cán bộ QL (' + cbqls.length + ') --</option>' +
      cbqls.map(q => '<option value="' + q + '">' + q + '</option>').join('');
  }

  function attachPphtdtEventListeners() {
    // 1. Preset Time Pills
    document.querySelectorAll('#pphtdtPresetPills .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#pphtdtPresetPills .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        pphtdtState.preset = pill.dataset.preset || 'all';
        applyPphtdtFilters();
      });
    });

    // 2. Dropdown Filters
    const progSelect = document.getElementById('filterPphtdtProgram');
    if (progSelect) {
      progSelect.addEventListener('change', (e) => {
        pphtdtState.program = e.target.value;
        applyPphtdtFilters();
      });
    }

    const fmtSelect = document.getElementById('filterPphtdtFormat');
    if (fmtSelect) {
      fmtSelect.addEventListener('change', (e) => {
        pphtdtState.format = e.target.value;
        applyPphtdtFilters();
      });
    }

    const cbqlSelect = document.getElementById('filterPphtdtCbql');
    if (cbqlSelect) {
      cbqlSelect.addEventListener('change', (e) => {
        pphtdtState.cbql = e.target.value;
        applyPphtdtFilters();
      });
    }

    const ratingSelect = document.getElementById('filterPphtdtRatingLevel');
    if (ratingSelect) {
      ratingSelect.addEventListener('change', (e) => {
        pphtdtState.ratingLevel = e.target.value;
        applyPphtdtFilters();
      });
    }

    // 3. Search input
    const searchInp = document.getElementById('searchPphtdtInput');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        pphtdtState.searchQuery = (e.target.value || '').trim().toLowerCase();
        applyPphtdtFilters();
      });
    }

    // 4. Reset Filters
    const btnReset = document.getElementById('btnResetPphtdtFilters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        pphtdtState.preset = 'all';
        pphtdtState.program = '';
        pphtdtState.format = '';
        pphtdtState.cbql = '';
        pphtdtState.ratingLevel = '';
        pphtdtState.searchQuery = '';

        document.querySelectorAll('#pphtdtPresetPills .pill').forEach(p => {
          if (p.dataset.preset === 'all') p.classList.add('active');
          else p.classList.remove('active');
        });

        if (progSelect) progSelect.value = '';
        if (fmtSelect) fmtSelect.value = '';
        if (cbqlSelect) cbqlSelect.value = '';
        if (ratingSelect) ratingSelect.value = '';
        if (searchInp) searchInp.value = '';

        applyPphtdtFilters();
        showToast('Đã đặt lại toàn bộ bộ lọc Phương pháp & Hình thức', 'info');
      });
    }

    // 5. Table Sorting
    document.querySelectorAll('#pphtdtClassesTable th[data-pphtdt-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.pphtdtSort;
        if (pphtdtCurrentSort.column === col) {
          pphtdtCurrentSort.dir = pphtdtCurrentSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          pphtdtCurrentSort.column = col;
          pphtdtCurrentSort.dir = 'desc';
        }
        renderPphtdtTable();
      });
    });

    // 6. Export Buttons
    const btnExportExcel = document.getElementById('btnExportPphtdtExcel');
    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', () => exportPphtdtToCsv(true));
    }
    const btnExportCsv = document.getElementById('btnExportPphtdtCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => exportPphtdtToCsv(false));
    }
  }

  function applyPphtdtFilters() {
    filteredPphtdtItems = allPphtdtItems.filter(item => {
      // 1. Preset Time Filter
      if (pphtdtState.preset !== 'all') {
        const dateStr = item.ngay_bd || '';
        if (pphtdtState.preset === '2026') {
          if (!dateStr.startsWith('2026') && !(item.ngay_bd_raw && item.ngay_bd_raw.includes('2026'))) return false;
        } else if (pphtdtState.preset === 'q1') {
          const m = parseInt(dateStr.slice(5, 7), 10);
          if (!(m >= 1 && m <= 3)) return false;
        } else if (pphtdtState.preset === 'q2') {
          const m = parseInt(dateStr.slice(5, 7), 10);
          if (!(m >= 4 && m <= 6)) return false;
        } else if (pphtdtState.preset === 'q3') {
          const m = parseInt(dateStr.slice(5, 7), 10);
          if (!(m >= 7 && m <= 9)) return false;
        } else if (pphtdtState.preset === 'q4') {
          const m = parseInt(dateStr.slice(5, 7), 10);
          if (!(m >= 10 && m <= 12)) return false;
        }
      }

      // 2. Program Filter
      if (pphtdtState.program && item.chuong_trinh !== pphtdtState.program) return false;

      // 3. Format Filter
      if (pphtdtState.format && item.hinh_thuc_hoc !== pphtdtState.format) return false;

      // 4. CBQL Filter
      if (pphtdtState.cbql && item.cbql !== pphtdtState.cbql) return false;

      // 5. Rating Level Filter
      if (pphtdtState.ratingLevel) {
        if (pphtdtState.ratingLevel === 'high' && item.diem_tb < 3.8) return false;
        if (pphtdtState.ratingLevel === 'medium' && (item.diem_tb < 3.5 || item.diem_tb >= 3.8)) return false;
        if (pphtdtState.ratingLevel === 'low' && item.diem_tb >= 3.5) return false;
      }

      // 6. Search Query
      if (pphtdtState.searchQuery) {
        const q = pphtdtState.searchQuery;
        const text = ((item.ma_lop || '') + ' ' + (item.chuong_trinh || '') + ' ' + (item.ten_ct_full || '') + ' ' + (item.cbql || '')).toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });

    updatePphtdtKPIs();
    renderPphtdtCharts();
    renderPphtdtTable();
  }

  function updatePphtdtKPIs() {
    const classCountElem = document.getElementById('kpiPphtdtClassCount');
    const programCountElem = document.getElementById('kpiPphtdtProgramCount');
    const totalVotesElem = document.getElementById('kpiPphtdtTotalVotes');
    const avgScoreElem = document.getElementById('kpiPphtdtAvgScore');
    const ratingBadgeElem = document.getElementById('kpiPphtdtScoreRatingBadge');
    const posRateElem = document.getElementById('kpiPphtdtPosRate');
    const crit1Elem = document.getElementById('kpiPphtdtCrit1Score');
    const crit2Elem = document.getElementById('kpiPphtdtCrit2Score');

    const uniqueClasses = new Set(filteredPphtdtItems.map(r => (r.ma_lop || '').trim().toLowerCase()).filter(Boolean));
    const uniquePrograms = new Set(filteredPphtdtItems.map(r => r.chuong_trinh).filter(Boolean));

    const totalVotes = filteredPphtdtItems.reduce((sum, r) => sum + (r.tong_phieu || 0), 0);

    let c1 = { pts: 0, n: 0, pos: 0 };
    let c2 = { pts: 0, n: 0, pos: 0 };

    filteredPphtdtItems.forEach(r => {
      c1.pts += (4 * r.c1_4 + 3 * r.c1_3 + 2 * r.c1_2 + 1 * r.c1_1);
      c1.n += r.c1_n;
      c1.pos += (r.c1_4 + r.c1_3);

      c2.pts += (4 * r.c2_4 + 3 * r.c2_3 + 2 * r.c2_2 + 1 * r.c2_1);
      c2.n += r.c2_n;
      c2.pos += (r.c2_4 + r.c2_3);
    });

    const s1 = c1.n > 0 ? c1.pts / c1.n : 0;
    const s2 = c2.n > 0 ? c2.pts / c2.n : 0;

    const validCriteria = [s1, s2].filter(s => s > 0);
    const overallAvg = validCriteria.length > 0 ? (validCriteria.reduce((a, b) => a + b, 0) / validCriteria.length) : 0;

    const totalCritVotes = c1.n + c2.n;
    const totalPosVotes = c1.pos + c2.pos;
    const posRate = totalCritVotes > 0 ? (totalPosVotes / totalCritVotes * 100) : 0;

    if (classCountElem) classCountElem.textContent = uniqueClasses.size.toLocaleString();
    if (programCountElem) programCountElem.textContent = uniquePrograms.size.toLocaleString();
    if (totalVotesElem) totalVotesElem.textContent = totalVotes.toLocaleString();
    if (avgScoreElem) avgScoreElem.textContent = overallAvg > 0 ? overallAvg.toFixed(2) : '-';

    if (ratingBadgeElem) {
      if (overallAvg >= 3.8) {
        ratingBadgeElem.textContent = 'Đánh giá chung: Xuất sắc / Rất tốt';
        ratingBadgeElem.style.color = '#0F5132';
      } else if (overallAvg >= 3.5) {
        ratingBadgeElem.textContent = 'Đánh giá chung: Tốt / Khá';
        ratingBadgeElem.style.color = '#1D4ED8';
      } else if (overallAvg > 0) {
        ratingBadgeElem.textContent = 'Đánh giá chung: Cần lưu ý cải thiện';
        ratingBadgeElem.style.color = '#B91C1C';
      } else {
        ratingBadgeElem.textContent = 'Chưa có dữ liệu đánh giá';
        ratingBadgeElem.style.color = 'var(--text-muted)';
      }
    }

    if (posRateElem) posRateElem.textContent = posRate.toFixed(1);
    if (crit1Elem) crit1Elem.textContent = s1 > 0 ? s1.toFixed(2) : '-';
    if (crit2Elem) crit2Elem.textContent = s2 > 0 ? s2.toFixed(2) : '-';
  }

  function renderPphtdtCharts() {
    renderPphtdtStackedBarChart();
    renderPphtdtComparisonChart();
  }

  function renderPphtdtStackedBarChart() {
    const canvas = document.getElementById('pphtdtStackedBarChart');
    if (!canvas) return;

    if (pphtdtCharts.stackedBar) {
      pphtdtCharts.stackedBar.destroy();
      pphtdtCharts.stackedBar = null;
    }

    let c1 = { 4: 0, 3: 0, 2: 0, 1: 0, total: 0 };
    let c2 = { 4: 0, 3: 0, 2: 0, 1: 0, total: 0 };

    filteredPphtdtItems.forEach(r => {
      c1[4] += r.c1_4; c1[3] += r.c1_3; c1[2] += r.c1_2; c1[1] += r.c1_1;
      c1.total += r.c1_n;

      c2[4] += r.c2_4; c2[3] += r.c2_3; c2[2] += r.c2_2; c2[1] += r.c2_1;
      c2.total += r.c2_n;
    });

    const calcPcts = (crit) => {
      if (crit.total === 0) return [0, 0, 0, 0];
      return [
        (crit[4] / crit.total * 100),
        (crit[3] / crit.total * 100),
        (crit[2] / crit.total * 100),
        (crit[1] / crit.total * 100)
      ];
    };

    const p1 = calcPcts(c1);
    const p2 = calcPcts(c2);

    const labels = [
      '1. Hoạt động học tập',
      '2. Hình thức đào tạo'
    ];

    const rawVotes = [c1, c2];

    const ctx = canvas.getContext('2d');
    pphtdtCharts.stackedBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Mức 4: Tốt',
            data: [p1[0], p2[0]],
            backgroundColor: '#1E5E47',
            borderWidth: 0,
            borderRadius: 4
          },
          {
            label: 'Mức 3: Khá',
            data: [p1[1], p2[1]],
            backgroundColor: '#48A97C',
            borderWidth: 0
          },
          {
            label: 'Mức 2: Bình thường',
            data: [p1[2], p2[2]],
            backgroundColor: '#D68B35',
            borderWidth: 0
          },
          {
            label: 'Mức 1: Hạn chế',
            data: [p1[3], p2[3]],
            backgroundColor: '#C84646',
            borderWidth: 0,
            borderRadius: 4
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            max: 100,
            ticks: {
              callback: v => v + '%',
              font: { family: 'Plus Jakarta Sans', weight: '600', size: 10 }
            },
            grid: { color: '#E2E8F0' }
          },
          y: {
            stacked: true,
            ticks: {
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 },
              color: '#374151'
            },
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 10.5 },
              color: '#374151'
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
            bodyFont: { family: 'Plus Jakarta Sans' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: function(context) {
                const datasetLabel = context.dataset.label || '';
                const pct = context.parsed.x.toFixed(1) + '%';
                const critIdx = context.dataIndex;
                const crit = rawVotes[critIdx];
                let count = 0;
                if (context.datasetIndex === 0) count = crit[4];
                else if (context.datasetIndex === 1) count = crit[3];
                else if (context.datasetIndex === 2) count = crit[2];
                else if (context.datasetIndex === 3) count = crit[1];
                return datasetLabel + ': ' + pct + ' (' + count + ' phiếu)';
              }
            }
          }
        }
      }
    });
  }

  function renderPphtdtComparisonChart() {
    const canvas = document.getElementById('pphtdtComparisonChart');
    if (!canvas) return;

    if (pphtdtCharts.comparison) {
      pphtdtCharts.comparison.destroy();
      pphtdtCharts.comparison = null;
    }

    const pMap = {};
    filteredPphtdtItems.forEach(r => {
      const p = r.chuong_trinh || 'Khác';
      if (!pMap[p]) {
        pMap[p] = {
          name: p,
          c1_pts: 0, c1_n: 0,
          c2_pts: 0, c2_n: 0,
          classes: 0,
          votes: 0
        };
      }
      pMap[p].c1_pts += (r.c1_score * (r.c1_n || 1));
      pMap[p].c1_n += (r.c1_n || 1);
      pMap[p].c2_pts += (r.c2_score * (r.c2_n || 1));
      pMap[p].c2_n += (r.c2_n || 1);
      pMap[p].classes++;
      pMap[p].votes += (r.tong_phieu || 0);
    });

    const progList = Object.keys(pMap).map(p => {
      const item = pMap[p];
      const s1 = item.c1_n > 0 ? item.c1_pts / item.c1_n : 0;
      const s2 = item.c2_n > 0 ? item.c2_pts / item.c2_n : 0;
      const avg = (s1 + s2) / 2;
      return {
        name: p,
        s1, s2, avg,
        classes: item.classes,
        votes: item.votes
      };
    }).sort((a, b) => b.avg - a.avg);

    // Update count hint badge
    const hint = document.getElementById('pphtdtProgCountHint');
    if (hint) hint.textContent = progList.length;

    // Adjust container width for smooth horizontal scroll
    const scrollInner = document.getElementById('pphtdtComparisonScrollInner');
    const scrollOuter = document.getElementById('pphtdtComparisonScrollOuter');
    if (scrollInner) {
      const minW = Math.max(progList.length * 56, 750);
      scrollInner.style.width = minW + 'px';
    }

    const labels = progList.map(p => p.name);
    const dataC1 = progList.map(p => Number(p.s1.toFixed(2)));
    const dataC2 = progList.map(p => Number(p.s2.toFixed(2)));

    const allScores = [...dataC1, ...dataC2].filter(s => s > 0);
    const minScore = allScores.length > 0 ? Math.min(...allScores) : 3.0;
    const yMin = Math.max(2.5, Math.floor((minScore - 0.2) * 10) / 10);

    const ctx = canvas.getContext('2d');
    pphtdtCharts.comparison = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '1. Hoạt động học tập',
            data: dataC1,
            borderColor: '#1E5E47',
            backgroundColor: 'rgba(30, 94, 71, 0.08)',
            borderWidth: 2.5,
            pointBackgroundColor: '#1E5E47',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            pointStyle: 'circle',
            tension: 0.25,
            fill: false
          },
          {
            label: '2. Hình thức đào tạo',
            data: dataC2,
            borderColor: '#AE1C3F',
            backgroundColor: 'rgba(174, 28, 63, 0.08)',
            borderWidth: 2.5,
            pointBackgroundColor: '#AE1C3F',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            pointStyle: 'rectRot',
            tension: 0.25,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          y: {
            min: yMin,
            max: 4.0,
            ticks: {
              stepSize: 0.2,
              font: { family: 'Plus Jakarta Sans', weight: '600', size: 10.5 }
            },
            grid: { color: '#E2E8F0' }
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 10 },
              color: '#374151'
            },
            grid: { color: '#F1F5F9' }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 },
              color: '#374151',
              padding: 12
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
            bodyFont: { family: 'Plus Jakarta Sans' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: function(items) {
                if (!items || items.length === 0) return '';
                const idx = items[0].dataIndex;
                const prog = progList[idx];
                return 'Chương trình: ' + prog.name + ' (' + prog.classes + ' lớp - ' + prog.votes + ' phiếu)';
              },
              label: function(context) {
                const label = context.dataset.label || '';
                const val = context.parsed.y;
                return label + ': ' + val.toFixed(2) + ' / 4.0';
              }
            }
          }
        }
      }
    });

    // Drag-to-scroll
    if (scrollOuter && !scrollOuter._hasDragScroll) {
      scrollOuter._hasDragScroll = true;
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      scrollOuter.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - scrollOuter.offsetLeft;
        scrollLeft = scrollOuter.scrollLeft;
      });
      scrollOuter.addEventListener('mouseleave', () => { isDown = false; });
      scrollOuter.addEventListener('mouseup', () => { isDown = false; });
      scrollOuter.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollOuter.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollOuter.scrollLeft = scrollLeft - walk;
      });
    }
  }

  function renderPphtdtTable() {
    const tbody = document.getElementById('pphtdtTableBody');
    const filteredCountElem = document.getElementById('pphtdtTableFilteredCount');
    const totalCountElem = document.getElementById('pphtdtTableTotalCount');
    const statusCountElem = document.getElementById('pphtdtTableStatusCount');

    const distinctFiltered = new Set(filteredPphtdtItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)).size;
    const distinctTotal = new Set(allPphtdtItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)).size;

    if (totalCountElem) totalCountElem.textContent = distinctTotal.toLocaleString();
    if (filteredCountElem) filteredCountElem.textContent = distinctFiltered.toLocaleString();
    if (statusCountElem) statusCountElem.textContent = distinctFiltered.toLocaleString();

    if (!tbody) return;

    if (filteredPphtdtItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i> Không có lớp học nào thỏa mãn điều kiện lọc. Hãy chọn lại bộ lọc.</td></tr>';
      return;
    }

    const sorted = [...filteredPphtdtItems].sort((a, b) => {
      let va = a[pphtdtCurrentSort.column];
      let vb = b[pphtdtCurrentSort.column];
      if (typeof va === 'string') {
        return pphtdtCurrentSort.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return pphtdtCurrentSort.dir === 'asc' ? (va - vb) : (vb - va);
    });

    tbody.innerHTML = sorted.map((row, idx) => {
      const fmtBadge = getFormatBadge(row);
      const scoreColor = row.diem_tb >= 3.8 ? '#0F5132' : (row.diem_tb >= 3.5 ? '#1D4ED8' : '#B91C1C');
      const scoreBg = row.diem_tb >= 3.8 ? '#ECFDF5' : (row.diem_tb >= 3.5 ? '#EFF6FF' : '#FEF2F2');
      const timeStr = (row.ngay_bd_raw || row.ngay_bd || '') + ' - ' + (row.ngay_kt_raw || row.ngay_kt || '');

      return `
        <tr onclick="window.openPphtdtModalById(${row.id})" style="cursor: pointer;">
          <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
          <td>
            <div style="font-weight: 800; color: var(--brand-primary); font-size: 0.85rem;">${row.ma_lop}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.25; margin-top: 0.15rem;" title="${row.ten_ct_full}">${row.ten_ct_full || row.chuong_trinh}</div>
          </td>
          <td style="text-align: center;">${fmtBadge}</td>
          <td>
            <div style="font-size: 0.78rem; font-weight: 600; color: #1E293B;">${timeStr}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.1rem;"><i class="fa-solid fa-user-tie"></i> ${row.cbql || 'CBQL'}</div>
          </td>
          <td style="text-align: center; font-weight: 800; color: #1E293B;">${row.tong_phieu}</td>
          <td style="text-align: center; font-weight: 700; color: #1E5E47;">${row.c1_score.toFixed(2)}</td>
          <td style="text-align: center; font-weight: 700; color: #AE1C3F;">${row.c2_score.toFixed(2)}</td>
          <td style="text-align: center;">
            <span style="display: inline-block; padding: 0.2rem 0.5rem; font-weight: 800; font-size: 0.85rem; border-radius: 4px; background: ${scoreBg}; color: ${scoreColor};">
              ${row.diem_tb.toFixed(2)}
            </span>
          </td>
          <td style="text-align: center; font-weight: 800; color: #0F5132;">
            ${row.ty_le_tich_cuc.toFixed(1)}%
          </td>
          <td style="text-align: center;" onclick="event.stopPropagation(); window.openPphtdtModalById(${row.id});">
            <button type="button" class="btn" style="padding: 0.25rem 0.55rem; font-size: 0.72rem; background: #F8FAFC; border: 1px solid var(--border-color); color: var(--brand-primary); font-weight: 700; border-radius: 4px;">
              <i class="fa-solid fa-eye"></i> Chi tiết
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openPphtdtModalById(id) {
    const list = window.allPphtdtItems || allPphtdtItems;
    const row = list.find(r => r.id === id);
    if (!row) return;

    const modal = document.getElementById('pphtdtDetailModal');
    if (!modal) return;

    const codeElem = document.getElementById('modalPphtdtClassCode');
    const nameElem = document.getElementById('modalPphtdtClassName');
    const infoGrid = document.getElementById('modalPphtdtInfoGrid');
    const criteriaContent = document.getElementById('modalPphtdtCriteriaContent');

    if (codeElem) codeElem.textContent = row.ma_lop;
    if (nameElem) nameElem.textContent = row.ten_ct_full || row.chuong_trinh;

    const timeStr = (row.ngay_bd_raw || row.ngay_bd || '') + ' đến ' + (row.ngay_kt_raw || row.ngay_kt || '');
    const scoreRating = row.diem_tb >= 3.8 ? 'Xuất sắc / Rất tốt' : (row.diem_tb >= 3.5 ? 'Tốt / Khá' : 'Cần lưu ý');

    if (infoGrid) {
      infoGrid.innerHTML = `
        <div class="modal-item">
          <label><i class="fa-solid fa-graduation-cap"></i> Chương Trình</label>
          <span style="font-weight: 700;">${row.chuong_trinh}</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-solid fa-shapes"></i> Hình Thức</label>
          <span>${getFormatBadge(row)}</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-regular fa-calendar-days"></i> Thời Gian Tổ Chức</label>
          <span>${timeStr}</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-solid fa-user-tie"></i> Cán Bộ Quản Lý</label>
          <span>${row.cbql || 'Chưa phân công'}</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-solid fa-clipboard-check"></i> Tổng Số Phiếu Đánh Giá</label>
          <span style="font-weight: 800; color: var(--brand-primary);">${row.tong_phieu} phiếu hợp lệ</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-solid fa-star"></i> Điểm TB & Tỷ Lệ Tích Cực</label>
          <span style="font-weight: 800; color: #0F5132;">${row.diem_tb.toFixed(2)} / 4.0 (${row.ty_le_tich_cuc.toFixed(1)}% - ${scoreRating})</span>
        </div>
      `;
    }

    const renderCriteriaBox = (idx, title, score, posRate, n4, n3, n2, n1, total) => {
      const p4 = total > 0 ? (n4 / total * 100).toFixed(1) : '0.0';
      const p3 = total > 0 ? (n3 / total * 100).toFixed(1) : '0.0';
      const p2 = total > 0 ? (n2 / total * 100).toFixed(1) : '0.0';
      const p1 = total > 0 ? (n1 / total * 100).toFixed(1) : '0.0';

      return `
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-weight: 800; font-size: 0.95rem; color: #1E293B;">${idx}. ${title}</div>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <span style="font-size: 0.82rem; font-weight: 700; color: #0F5132; background: #ECFDF5; padding: 0.2rem 0.5rem; border-radius: 4px;">
                Tích cực: ${posRate.toFixed(1)}%
              </span>
              <span style="font-size: 1rem; font-weight: 800; color: var(--brand-primary);">
                ${score.toFixed(2)} <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">/ 4.0</span>
              </span>
            </div>
          </div>

          <!-- 4-segment visual stacked bar -->
          <div style="height: 14px; display: flex; border-radius: 7px; overflow: hidden; margin-bottom: 0.6rem; background: #E2E8F0;">
            <div style="width: ${p4}%; background: #1E5E47;" title="Mức 4: Tốt - ${n4} phiếu (${p4}%)"></div>
            <div style="width: ${p3}%; background: #48A97C;" title="Mức 3: Khá - ${n3} phiếu (${p3}%)"></div>
            <div style="width: ${p2}%; background: #D68B35;" title="Mức 2: Bình thường - ${n2} phiếu (${p2}%)"></div>
            <div style="width: ${p1}%; background: #C84646;" title="Mức 1: Hạn chế - ${n1} phiếu (${p1}%)"></div>
          </div>

          <!-- 4-level vote counts grid -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; text-align: center; font-size: 0.75rem;">
            <div style="background: white; border: 1px solid #E2E8F0; padding: 0.35rem; border-radius: 4px;">
              <div style="color: #1E5E47; font-weight: 800;">4: Tốt</div>
              <div style="font-weight: 700;">${n4} <span style="color: var(--text-muted);">(${p4}%)</span></div>
            </div>
            <div style="background: white; border: 1px solid #E2E8F0; padding: 0.35rem; border-radius: 4px;">
              <div style="color: #48A97C; font-weight: 800;">3: Khá</div>
              <div style="font-weight: 700;">${n3} <span style="color: var(--text-muted);">(${p3}%)</span></div>
            </div>
            <div style="background: white; border: 1px solid #E2E8F0; padding: 0.35rem; border-radius: 4px;">
              <div style="color: #D68B35; font-weight: 800;">2: Bình thường</div>
              <div style="font-weight: 700;">${n2} <span style="color: var(--text-muted);">(${p2}%)</span></div>
            </div>
            <div style="background: white; border: 1px solid #E2E8F0; padding: 0.35rem; border-radius: 4px;">
              <div style="color: #C84646; font-weight: 800;">1: Hạn chế</div>
              <div style="font-weight: 700;">${n1} <span style="color: var(--text-muted);">(${p1}%)</span></div>
            </div>
          </div>
        </div>
      `;
    };

    if (criteriaContent) {
      criteriaContent.innerHTML = 
        renderCriteriaBox(1, 'Đánh giá hoạt động học tập (Phương pháp đào tạo)', row.c1_score, row.c1_pos, row.c1_4, row.c1_3, row.c1_2, row.c1_1, row.c1_n) +
        renderCriteriaBox(2, 'Đánh giá tính phù hợp & hiệu quả của hình thức đào tạo', row.c2_score, row.c2_pos, row.c2_4, row.c2_3, row.c2_2, row.c2_1, row.c2_n);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePphtdtModal(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const modal = document.getElementById('pphtdtDetailModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function closePphtdtModalOnOverlay(e) {
    if (e.target && e.target.id === 'pphtdtDetailModal') {
      closePphtdtModal(e);
    }
  }

  window.openPphtdtModalById = openPphtdtModalById;
  window.closePphtdtModal = closePphtdtModal;
  window.closePphtdtModalOnOverlay = closePphtdtModalOnOverlay;

  function exportPphtdtToCsv(isExcel) {
    if (!filteredPphtdtItems || filteredPphtdtItems.length === 0) {
      showToast('Không có dữ liệu để xuất!', 'warning');
      return;
    }

    const headers = [
      'STT', 'Mã lớp', 'Chương trình', 'Tên chương trình đầy đủ', 'Hình thức đào tạo',
      'Ngày bắt đầu', 'Ngày kết thúc', 'Cán bộ quản lý', 'Tổng số phiếu',
      'Điểm TC1 (Hoạt động học tập)', 'Tỷ lệ tích cực TC1 (%)',
      'Điểm TC2 (Hình thức đào tạo)', 'Tỷ lệ tích cực TC2 (%)',
      'Điểm trung bình (4.0)', 'Tỷ lệ tích cực chung (%)'
    ];

    const rows = [headers.join(',')];

    filteredPphtdtItems.forEach((r, idx) => {
      const row = [
        idx + 1,
        '"' + (r.ma_lop || '').replace(/"/g, '""') + '"',
        '"' + (r.chuong_trinh || '').replace(/"/g, '""') + '"',
        '"' + (r.ten_ct_full || '').replace(/"/g, '""') + '"',
        '"' + (r.hinh_thuc_hoc || '').replace(/"/g, '""') + '"',
        r.ngay_bd || '',
        r.ngay_kt || '',
        '"' + (r.cbql || '').replace(/"/g, '""') + '"',
        r.tong_phieu || 0,
        r.c1_score.toFixed(2),
        r.c1_pos.toFixed(1),
        r.c2_score.toFixed(2),
        r.c2_pos.toFixed(1),
        r.diem_tb.toFixed(2),
        r.ty_le_tich_cuc.toFixed(1)
      ];
      rows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const ext = isExcel ? 'csv' : 'csv';
    link.setAttribute('href', url);
    link.setAttribute('download', 'Bao_cao_Danh_gia_Phuong_phap_Hinh_thuc_Dao_tao_' + new Date().toISOString().slice(0, 10) + '.' + ext);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Đã xuất thành công báo cáo Phương pháp & Hình thức đào tạo (' + filteredPphtdtItems.length + ' lớp)', 'success');
  }

  async function syncPphtdtGoogleSheetData(sheetUrl, options = {}) {
    const isSilent = Boolean(options.silent);
    try {
      const targetUrl = sheetUrl || getDefaultPphtdtUrl();
      if (!targetUrl) return;

      let csvUrl = getGoogleSheetCsvExportUrl(targetUrl);
      if (csvUrl.includes('script.google.com') || csvUrl.includes('macros/s/')) {
        if (!csvUrl.includes('gid=') && !csvUrl.includes('sheet=')) {
          csvUrl += (csvUrl.includes('?') ? '&' : '?') + 'gid=1487920193';
        }
      }
      const fetchUrl = csvUrl + (csvUrl.includes('?') ? '&' : '?') + '_t=' + Date.now();

      const res = await fetch(fetchUrl, { cache: 'no-store', redirect: 'follow' });
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      const csvText = await res.text();
      const parsed = parseCsvToPphtdtItems(csvText);

      if (parsed && parsed.length > 0) {
        allPphtdtItems = parsed;
        normalizeAllModuleData();
        window.allPphtdtItems = allPphtdtItems;
        try {
          localStorage.setItem(STORAGE_KEY_PPHTDT_DATA, JSON.stringify(allPphtdtItems));
        } catch (stErr) {
          console.warn('Could not save PPHTDT to localStorage:', stErr);
        }
        populatePphtdtFilterDropdowns();
        if (activeView === 'pphtdt') applyPphtdtFilters();

        const countPp = new Set(allPphtdtItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)).size;
        if (!isSilent) {
          showToast('Đã đồng bộ ' + countPp + ' lớp đánh giá Phương pháp & Hình thức từ Google Sheet!', 'success');
        }
      }
    } catch (e) {
      console.warn('PPHTDT sheet sync error:', e);
    }
  }

  function parseCsvToPphtdtItems(csvText) {
    if (!csvText || csvText.trim().startsWith('<')) return [];
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length <= 1) return [];

    const rawMap = new Map();
    if (typeof allClasses !== 'undefined' && Array.isArray(allClasses)) {
      allClasses.forEach(c => {
        if (c.ma_lop) rawMap.set(c.ma_lop.trim().toLowerCase(), c);
      });
    }

    const parseLine = (text) => {
      const p = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          if (inQuotes && text[i+1] === '"') { cur += '"'; i++; }
          else { inQuotes = !inQuotes; }
        } else if (c === ',' && !inQuotes) {
          p.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      p.push(cur.trim());
      return p;
    };

    const parseFlexibleDate = (dStr) => {
      if (!dStr) return '';
      dStr = dStr.trim();
      const parts = dStr.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return year + '-' + month + '-' + day;
      }
      const clean = dStr.replace(/\s*\([^)]*\)$/, '');
      const d = new Date(clean);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
      }
      return dStr;
    };

    const headerCols = parseLine(lines[0]);
    const headers = headerCols.map(h => h.trim().toLowerCase());

    if (headers[0] && headers[0].includes('địa điểm')) return [];
    let idxProg = headers.findIndex(h => h.includes('chương trình'));
    let idxMaLop = headers.findIndex(h => h.includes('mã lớp'));
    if (idxProg < 0 || idxMaLop < 0) return [];

    let idxFmt = headers.findIndex(h => h.includes('hình thức'));
    let idxNgayBd = headers.findIndex(h => h.includes('bắt đầu'));
    let idxNgayKt = headers.findIndex(h => h.includes('kết thúc'));
    let idxCbql = headers.findIndex(h => h.includes('cbql') || h.includes('cán bộ'));

    if (idxFmt < 0) idxFmt = 2;
    if (idxNgayBd < 0) idxNgayBd = 3;
    if (idxNgayKt < 0) idxNgayKt = 4;

    const c4Indices = [];
    headers.forEach((h, idx) => {
      if (h.startsWith('4 -') || h.startsWith('4-')) {
        c4Indices.push(idx);
      }
    });
    // Strict schema check: PPHTDT has exactly 2 4-point criteria (unlike NDDT which has 3)
    if (c4Indices.length !== 2) return [];

    const c1_start = c4Indices.length > 0 ? c4Indices[0] : 5;
    const c2_start = c4Indices.length > 1 ? c4Indices[1] : 9;

    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      const ct = cols[idxProg] || '';
      const maLop = cols[idxMaLop] || '';
      const fmt = cols[idxFmt] || '';
      const ngayBd = cols[idxNgayBd] || '';
      const ngayKt = cols[idxNgayKt] || '';

      if (!ct && !maLop) continue;

      const c1_4 = Number(cols[c1_start]) || 0;
      const c1_3 = Number(cols[c1_start + 1]) || 0;
      const c1_2 = Number(cols[c1_start + 2]) || 0;
      const c1_1 = Number(cols[c1_start + 3]) || 0;
      const c1_n = c1_4 + c1_3 + c1_2 + c1_1;
      const c1_score = c1_n > 0 ? (4 * c1_4 + 3 * c1_3 + 2 * c1_2 + 1 * c1_1) / c1_n : 0;
      const c1_pos = c1_n > 0 ? (c1_4 + c1_3) / c1_n * 100 : 0;

      const c2_4 = Number(cols[c2_start]) || 0;
      const c2_3 = Number(cols[c2_start + 1]) || 0;
      const c2_2 = Number(cols[c2_start + 2]) || 0;
      const c2_1 = Number(cols[c2_start + 3]) || 0;
      const c2_n = c2_4 + c2_3 + c2_2 + c2_1;
      const c2_score = c2_n > 0 ? (4 * c2_4 + 3 * c2_3 + 2 * c2_2 + 1 * c2_1) / c2_n : 0;
      const c2_pos = c2_n > 0 ? (c2_4 + c2_3) / c2_n * 100 : 0;

      const cbql = idxCbql >= 0 ? (cols[idxCbql] || '') : (cols[13] || '');
      const chk1 = Number(cols[14]) || 0;
      const chk2 = Number(cols[15]) || 0;
      const thang = cols[16] || '';

      const validScores = [];
      if (c1_n > 0) validScores.push(c1_score);
      if (c2_n > 0) validScores.push(c2_score);
      const avgScore = validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;

      const totalVotes = Math.max(c1_n, c2_n, chk1, chk2);
      const totalPos = (c1_n > 0 || c2_n > 0)
        ? ((c1_4 + c1_3 + c2_4 + c2_3) / ((c1_n + c2_n) || 1) * 100)
        : 0;

      let tenCtFull = '';
      if (rawMap.has(maLop.toLowerCase())) {
        tenCtFull = rawMap.get(maLop.toLowerCase()).ten_ct || '';
      }

      items.push({
        id: items.length + 1,
        chuong_trinh: ct,
        ma_lop: maLop,
        ten_ct_full: tenCtFull,
        hinh_thuc_hoc: fmt,
        ngay_bd_raw: ngayBd,
        ngay_kt_raw: ngayKt,
        ngay_bd: parseFlexibleDate(ngayBd),
        ngay_kt: parseFlexibleDate(ngayKt),
        c1_4, c1_3, c1_2, c1_1, c1_n, c1_score, c1_pos,
        c2_4, c2_3, c2_2, c2_1, c2_n, c2_score, c2_pos,
        diem_tb: avgScore,
        ty_le_tich_cuc: totalPos,
        tong_phieu: totalVotes,
        cbql,
        thang
      });
    }
    return items;
  }
  

  // ==========================================================================
  // PHÂN HỆ: ĐÁNH GIÁ VỀ CÔNG TÁC TỔ CHỨC, CƠ SỞ VẬT CHẤT (CSVC)
  // ==========================================================================

  // Expose global modal functions immediately
  window.openCsvcModalById = function(id) {
    const list = window.allCsvcItems || allCsvcItems;
    if (!list || list.length === 0) return;
    const item = list.find(x => x.id === Number(id));
    if (!item) return;

    const modal = document.getElementById('csvcDetailModal');
    if (!modal) return;

    // Header
    const elemCode = document.getElementById('modalCsvcClassCode');
    const elemName = document.getElementById('modalCsvcClassName');
    if (elemCode) elemCode.textContent = item.ma_lop || item.chuong_trinh || 'Chi tiết lớp học';
    if (elemName) elemName.textContent = item.ten_ct_full || item.chuong_trinh || 'Chi tiết lớp học';

    // Meta Grid
    const infoGrid = document.getElementById('modalCsvcInfoGrid');
    const fmtBadge = getFormatBadge(item);
    const timeStr = (item.ngay_bd_raw || item.ngay_bd || 'Chưa rõ') + ' — ' + (item.ngay_kt_raw || item.ngay_kt || 'Chưa rõ');

    if (infoGrid) {
      infoGrid.innerHTML = `
        <div class="modal-item">
          <label><i class="fa-solid fa-barcode"></i> Mã Lớp</label>
          <span style="color: var(--brand-primary); font-weight: 800;">${item.ma_lop}</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-solid fa-shapes"></i> Hình Thức</label>
          <span>${fmtBadge}</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-solid fa-location-dot"></i> Địa Điểm</label>
          <span style="font-weight: 700; color: #0F5132;">${item.dia_diem || 'Chưa cập nhật'}</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-solid fa-calendar-days"></i> Thời Gian</label>
          <span>${timeStr}</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-solid fa-user-tie"></i> Cán Bộ Quản Lý</label>
          <span style="font-weight: 700;">${item.cbql || 'CBQL'}</span>
        </div>
        <div class="modal-item">
          <label><i class="fa-solid fa-clipboard-check"></i> Tổng Số Phiếu</label>
          <span style="font-weight: 800; color: var(--brand-primary);">${item.so_phieu} phiếu</span>
        </div>
      `;
    }

    // 3 Criteria Breakdown Boxes
    const critContainer = document.getElementById('modalCsvcCriteriaContent');
    if (critContainer) {
      function renderCritBox(title, sub, score, tot, n4, n3, n2, n1, isApplicable = true) {
        if (!isApplicable || tot === 0) {
          return `
            <div style="background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 8px; padding: 0.85rem 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #64748B;">${title}</h4>
                  <p style="margin: 0.15rem 0 0 0; font-size: 0.78rem; color: #94A3B8;">${sub}</p>
                </div>
                <span class="badge" style="background: #E2E8F0; color: #475569; font-weight: 700; padding: 0.3rem 0.6rem;">
                  <i class="fa-solid fa-ban"></i> Không áp dụng cho hình thức này
                </span>
              </div>
            </div>
          `;
        }

        const p4 = tot ? ((n4 / tot) * 100) : 0;
        const p3 = tot ? ((n3 / tot) * 100) : 0;
        const p2 = tot ? ((n2 / tot) * 100) : 0;
        const p1 = tot ? ((n1 / tot) * 100) : 0;
        const posRate = p4 + p3;
        const scoreVal = typeof score === 'number' ? score.toFixed(2) : (score || '0.00');

        return `
          <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.65rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--brand-primary);">${title}</h4>
                <p style="margin: 0.15rem 0 0 0; font-size: 0.78rem; color: var(--text-muted);">${sub}</p>
              </div>
              <div style="display: flex; align-items: baseline; gap: 0.5rem;">
                <span style="font-size: 0.78rem; color: var(--text-muted);">Điểm TB:</span>
                <strong style="font-size: 1.25rem; font-weight: 800; color: var(--brand-primary);">${scoreVal}</strong>
                <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">/ 4.0</span>
                <span style="display: inline-block; margin-left: 0.5rem; padding: 0.15rem 0.5rem; background: #ECFDF5; color: #0F5132; font-size: 0.75rem; font-weight: 700; border-radius: 4px;">
                  Tích cực: ${posRate.toFixed(1)}% (${n4 + n3} phiếu)
                </span>
              </div>
            </div>

            <!-- 4-segment distribution bar -->
            <div style="display: flex; height: 16px; border-radius: 8px; overflow: hidden; background: #E2E8F0; margin-bottom: 0.65rem;">
              <div style="width: ${p4}%; background: #1E5E47;" title="Tốt: ${n4} (${p4.toFixed(1)}%)"></div>
              <div style="width: ${p3}%; background: #48A97C;" title="Khá: ${n3} (${p3.toFixed(1)}%)"></div>
              <div style="width: ${p2}%; background: #D68B35;" title="Bình thường: ${n2} (${p2.toFixed(1)}%)"></div>
              <div style="width: ${p1}%; background: #C84646;" title="Hạn chế: ${n1} (${p1.toFixed(1)}%)"></div>
            </div>

            <!-- Breakdown table / pills -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; font-size: 0.75rem;">
              <div style="background: white; border: 1px solid #E2E8F0; padding: 0.35rem 0.5rem; border-radius: 4px; text-align: center;">
                <span style="color: #1E5E47; font-weight: 700;">● Tốt (4đ):</span> <strong>${n4}</strong> (${p4.toFixed(1)}%)
              </div>
              <div style="background: white; border: 1px solid #E2E8F0; padding: 0.35rem 0.5rem; border-radius: 4px; text-align: center;">
                <span style="color: #48A97C; font-weight: 700;">● Khá (3đ):</span> <strong>${n3}</strong> (${p3.toFixed(1)}%)
              </div>
              <div style="background: white; border: 1px solid #E2E8F0; padding: 0.35rem 0.5rem; border-radius: 4px; text-align: center;">
                <span style="color: #D68B35; font-weight: 700;">● Bình thường (2đ):</span> <strong>${n2}</strong> (${p2.toFixed(1)}%)
              </div>
              <div style="background: white; border: 1px solid #E2E8F0; padding: 0.35rem 0.5rem; border-radius: 4px; text-align: center;">
                <span style="color: #C84646; font-weight: 700;">● Hạn chế (1đ):</span> <strong>${n1}</strong> (${p1.toFixed(1)}%)
              </div>
            </div>
          </div>
        `;
      }

      const hasHc = item.hc_tot > 0;
      const htmlC1 = renderCritBox('1. Công tác tổ chức lớp học (CTTC)', 'Đón tiếp, hướng dẫn, điều phối và tổ chức lớp', item.cttc_score, item.cttc_tot, item.cttc_4, item.cttc_3, item.cttc_2, item.cttc_1);
      const htmlC2 = renderCritBox('2. Cơ sở vật chất & Thiết bị (CSVC)', 'Phòng học, âm thanh, máy chiếu, ánh sáng, máy lạnh, đường truyền mạng', item.csvc_score, item.csvc_tot, item.csvc_4, item.csvc_3, item.csvc_2, item.csvc_1);
      const htmlC3 = renderCritBox('3. Công tác hậu cần (HC)', 'Phục vụ ăn, nghỉ, nước uống giữa giờ cho học viên', item.hc_score, item.hc_tot, item.hc_4, item.hc_3, item.hc_2, item.hc_1, hasHc);

      // Observation summary
      const scores = [];
      if (item.cttc_score) scores.push({ name: 'Công tác tổ chức', score: item.cttc_score });
      if (item.csvc_score) scores.push({ name: 'Cơ sở vật chất', score: item.csvc_score });
      if (item.hc_score && hasHc) scores.push({ name: 'Hậu cần', score: item.hc_score });
      scores.sort((a, b) => b.score - a.score);

      let obsNote = '';
      if (scores.length >= 2) {
        const top = scores[0];
        const low = scores[scores.length - 1];
        if (top.score === low.score) {
          obsNote = 'Các tiêu chí đều được đánh giá đồng đều ở mức ' + top.score.toFixed(2) + ' / 4.0 điểm.';
        } else {
          obsNote = 'Tiêu chí "' + top.name + '" đạt điểm trung bình cao nhất (' + top.score.toFixed(2) + ' / 4.0); tiêu chí "' + low.name + '" đạt ' + low.score.toFixed(2) + ' / 4.0 điểm.';
        }
      }

      critContainer.innerHTML = htmlC1 + htmlC2 + htmlC3 + `
        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 0.75rem 1rem; font-size: 0.82rem; color: #1E40AF; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
          <i class="fa-solid fa-circle-info" style="font-size: 1rem; flex-shrink: 0;"></i>
          <span><strong>Nhận xét tự động:</strong> ${obsNote}</span>
        </div>
      `;
    }

    modal.classList.add('active');
  };

  window.closeCsvcModal = function(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const modal = document.getElementById('csvcDetailModal');
    if (modal) modal.classList.remove('active');
  };

  window.closeCsvcModalOnOverlay = function(e) {
    if (e.target && e.target.id === 'csvcDetailModal') {
      window.closeCsvcModal(e);
    }
  };

  function setupCsvcModule() {
    populateCsvcFilterDropdowns();
    attachCsvcEventListeners();
    applyCsvcFilters();
  }

  function populateCsvcFilterDropdowns() {
    const progSelect = document.getElementById('filterCsvcProgram');
    const locSelect = document.getElementById('filterCsvcLocation');
    const fmtSelect = document.getElementById('filterCsvcFormat');
    const cbqlSelect = document.getElementById('filterCsvcCbql');

    if (!progSelect || !locSelect || !fmtSelect || !cbqlSelect) return;

    const programs = [...new Set(allCsvcItems.map(c => c.chuong_trinh).filter(Boolean))].sort();
    const locations = [...new Set(allCsvcItems.map(c => c.dia_diem).filter(Boolean))].sort();
    const formats = [...new Set(allCsvcItems.map(c => c.hinh_thuc_hoc).filter(Boolean))].sort();
    const cbqls = [...new Set(allCsvcItems.map(c => c.cbql).filter(Boolean))].sort();

    progSelect.innerHTML = '<option value="">-- Tất cả Chương trình (' + programs.length + ') --</option>' +
      programs.map(p => '<option value="' + p + '">' + p + '</option>').join('');

    locSelect.innerHTML = '<option value="">-- Tất cả Địa điểm (' + locations.length + ') --</option>' +
      locations.map(l => '<option value="' + l + '">' + l + '</option>').join('');

    fmtSelect.innerHTML = '<option value="">-- Tất cả Hình thức (' + formats.length + ') --</option>' +
      formats.map(f => '<option value="' + f + '">' + f + '</option>').join('');

    cbqlSelect.innerHTML = '<option value="">-- Tất cả Cán bộ QL (' + cbqls.length + ') --</option>' +
      cbqls.map(q => '<option value="' + q + '">' + q + '</option>').join('');
  }

  function attachCsvcEventListeners() {
    // 1. Preset Time Pills
    document.querySelectorAll('#csvcPresetPills .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#csvcPresetPills .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        csvcState.preset = pill.dataset.preset || 'all';
        applyCsvcFilters();
      });
    });

    // 2. Dropdown Filters
    const progSelect = document.getElementById('filterCsvcProgram');
    if (progSelect) {
      progSelect.addEventListener('change', (e) => {
        csvcState.program = e.target.value;
        applyCsvcFilters();
      });
    }

    const locSelect = document.getElementById('filterCsvcLocation');
    if (locSelect) {
      locSelect.addEventListener('change', (e) => {
        csvcState.location = e.target.value;
        applyCsvcFilters();
      });
    }

    const fmtSelect = document.getElementById('filterCsvcFormat');
    if (fmtSelect) {
      fmtSelect.addEventListener('change', (e) => {
        csvcState.format = e.target.value;
        applyCsvcFilters();
      });
    }

    const cbqlSelect = document.getElementById('filterCsvcCbql');
    if (cbqlSelect) {
      cbqlSelect.addEventListener('change', (e) => {
        csvcState.cbql = e.target.value;
        applyCsvcFilters();
      });
    }

    const ratingSelect = document.getElementById('filterCsvcRatingLevel');
    if (ratingSelect) {
      ratingSelect.addEventListener('change', (e) => {
        csvcState.ratingLevel = e.target.value;
        applyCsvcFilters();
      });
    }

    // 3. Search input
    const searchInp = document.getElementById('searchCsvcInput');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        csvcState.searchQuery = (e.target.value || '').trim().toLowerCase();
        applyCsvcFilters();
      });
    }

    // 4. Reset Filters
    const btnReset = document.getElementById('btnResetCsvcFilters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        csvcState.preset = 'all';
        csvcState.program = '';
        csvcState.location = '';
        csvcState.format = '';
        csvcState.cbql = '';
        csvcState.ratingLevel = '';
        csvcState.searchQuery = '';

        document.querySelectorAll('#csvcPresetPills .pill').forEach(p => {
          if (p.dataset.preset === 'all') p.classList.add('active');
          else p.classList.remove('active');
        });

        if (progSelect) progSelect.value = '';
        if (locSelect) locSelect.value = '';
        if (fmtSelect) fmtSelect.value = '';
        if (cbqlSelect) cbqlSelect.value = '';
        if (ratingSelect) ratingSelect.value = '';
        if (searchInp) searchInp.value = '';

        applyCsvcFilters();
      });
    }

    // 5. Export buttons
    const btnExportCsv = document.getElementById('btnExportCsvcCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => exportCsvcToCsv());
    }
    const btnExportExcel = document.getElementById('btnExportCsvcExcel');
    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', () => exportCsvcToCsv());
    }

    // 6. Compare mode toggle (Theo Địa điểm vs Theo Chương trình)
    const btnToggleLoc = document.getElementById('btnCsvcToggleLoc');
    const btnToggleProg = document.getElementById('btnCsvcToggleProg');
    if (btnToggleLoc && btnToggleProg) {
      btnToggleLoc.addEventListener('click', () => {
        if (csvcCompareMode === 'location') return;
        csvcCompareMode = 'location';
        btnToggleLoc.classList.add('active');
        btnToggleLoc.style.background = 'var(--brand-primary)';
        btnToggleLoc.style.color = 'white';
        btnToggleProg.classList.remove('active');
        btnToggleProg.style.background = 'transparent';
        btnToggleProg.style.color = '#475569';
        renderCsvcComparisonChart();
      });
      btnToggleProg.addEventListener('click', () => {
        if (csvcCompareMode === 'program') return;
        csvcCompareMode = 'program';
        btnToggleProg.classList.add('active');
        btnToggleProg.style.background = 'var(--brand-primary)';
        btnToggleProg.style.color = 'white';
        btnToggleLoc.classList.remove('active');
        btnToggleLoc.style.background = 'transparent';
        btnToggleLoc.style.color = '#475569';
        renderCsvcComparisonChart();
      });
    }

    // 7. Table Header Sorting
    document.querySelectorAll('#csvcClassesTable th[data-csvc-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const col = th.dataset.csvcSort;
        if (csvcCurrentSort.column === col) {
          csvcCurrentSort.dir = csvcCurrentSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          csvcCurrentSort.column = col;
          csvcCurrentSort.dir = 'desc';
        }
        renderCsvcTable();
      });
    });
  }

  function applyCsvcFilters() {
    filteredCsvcItems = allCsvcItems.filter(item => {
      // 1. Time Preset Filter (Date Range)
      if (csvcState.preset && csvcState.preset !== 'all') {
        const dStr = item.ngay_bd_raw || item.ngay_bd;
        if (dStr) {
          const parts = dStr.split('/');
          if (parts.length === 3) {
            const m = parseInt(parts[1], 10);
            const y = parseInt(parts[2], 10);
            if (csvcState.preset === '2026' && y !== 2026) return false;
            if (csvcState.preset === 'q1' && (m < 1 || m > 3)) return false;
            if (csvcState.preset === 'q2' && (m < 4 || m > 6)) return false;
            if (csvcState.preset === 'q3' && (m < 7 || m > 9)) return false;
            if (csvcState.preset === 'q4' && (m < 10 || m > 12)) return false;
          }
        }
      }

      // 2. Program Filter
      if (csvcState.program && item.chuong_trinh !== csvcState.program) return false;

      // 3. Location Filter
      if (csvcState.location && item.dia_diem !== csvcState.location) return false;

      // 4. Format Filter
      if (csvcState.format && item.hinh_thuc_hoc !== csvcState.format) return false;

      // 5. CBQL Filter
      if (csvcState.cbql && item.cbql !== csvcState.cbql) return false;

      // 6. Rating Level Filter
      if (csvcState.ratingLevel) {
        const score = item.diem_tb || 0;
        if (csvcState.ratingLevel === 'high' && score < 3.8) return false;
        if (csvcState.ratingLevel === 'medium' && (score < 3.5 || score >= 3.8)) return false;
        if (csvcState.ratingLevel === 'low' && score >= 3.5) return false;
      }

      // 7. Search Query Filter
      if (csvcState.searchQuery) {
        const q = csvcState.searchQuery;
        const matchCode = (item.ma_lop || '').toLowerCase().includes(q);
        const matchProg = (item.ten_ct_full || item.chuong_trinh || '').toLowerCase().includes(q);
        const matchLoc = (item.dia_diem || '').toLowerCase().includes(q);
        const matchCbql = (item.cbql || '').toLowerCase().includes(q);
        if (!matchCode && !matchProg && !matchLoc && !matchCbql) return false;
      }

      return true;
    });

    updateCsvcKPIs();
    renderCsvcCharts();
    renderCsvcTable();
  }

  function updateCsvcKPIs() {
    const elemClassCount = document.getElementById('kpiCsvcClassCount');
    const elemLocationCount = document.getElementById('kpiCsvcLocationCount');
    const elemTotalVotes = document.getElementById('kpiCsvcTotalVotes');
    const elemAvgScore = document.getElementById('kpiCsvcAvgScore');
    const elemPosRate = document.getElementById('kpiCsvcPosRate');
    const elemBadge = document.getElementById('kpiCsvcScoreRatingBadge');
    const elemC1 = document.getElementById('kpiCsvcCrit1Score');
    const elemC2 = document.getElementById('kpiCsvcCrit2Score');
    const elemC3 = document.getElementById('kpiCsvcCrit3Score');

    if (!elemClassCount) return;

    if (filteredCsvcItems.length === 0) {
      elemClassCount.textContent = '0';
      if (elemLocationCount) elemLocationCount.textContent = '0';
      elemTotalVotes.textContent = '0';
      elemAvgScore.textContent = '-';
      elemPosRate.textContent = '0.0';
      if (elemC1) elemC1.textContent = '-';
      if (elemC2) elemC2.textContent = '-';
      if (elemC3) elemC3.textContent = '-';
      if (elemBadge) {
        elemBadge.textContent = 'Chưa có dữ liệu đánh giá';
        elemBadge.style.color = 'var(--text-muted)';
      }
      return;
    }

    // Distinct Class Count (by ma_lop)
    const distinctClasses = new Set(
      filteredCsvcItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)
    ).size;
    elemClassCount.textContent = distinctClasses.toLocaleString();

    // Distinct Location Count (by dia_diem)
    const distinctLocations = new Set(
      filteredCsvcItems.map(c => (c.dia_diem || '').trim()).filter(Boolean)
    ).size;
    if (elemLocationCount) elemLocationCount.textContent = distinctLocations.toLocaleString();

    // Aggregate Criteria & Overall Votes
    let totalSurveyVotes = 0;
    let sumTotalPoints = 0;
    let sumTotalCritVotes = 0;
    let sumTotalPosVotes = 0;

    let c1_votes = 0, c1_pts = 0;
    let c2_votes = 0, c2_pts = 0;
    let c3_votes = 0, c3_pts = 0;

    filteredCsvcItems.forEach(item => {
      totalSurveyVotes += (item.so_phieu || 0);

      const n4_1 = item.cttc_4 || 0, n3_1 = item.cttc_3 || 0, n2_1 = item.cttc_2 || 0, n1_1 = item.cttc_1 || 0;
      const t1 = n4_1 + n3_1 + n2_1 + n1_1;
      const pts1 = 4 * n4_1 + 3 * n3_1 + 2 * n2_1 + 1 * n1_1;
      c1_votes += t1;
      c1_pts += pts1;

      const n4_2 = item.csvc_4 || 0, n3_2 = item.csvc_3 || 0, n2_2 = item.csvc_2 || 0, n1_2 = item.csvc_1 || 0;
      const t2 = n4_2 + n3_2 + n2_2 + n1_2;
      const pts2 = 4 * n4_2 + 3 * n3_2 + 2 * n2_2 + 1 * n1_2;
      c2_votes += t2;
      c2_pts += pts2;

      const n4_3 = item.hc_4 || 0, n3_3 = item.hc_3 || 0, n2_3 = item.hc_2 || 0, n1_3 = item.hc_1 || 0;
      const t3 = n4_3 + n3_3 + n2_3 + n1_3;
      const pts3 = 4 * n4_3 + 3 * n3_3 + 2 * n2_3 + 1 * n1_3;
      c3_votes += t3;
      c3_pts += pts3;

      sumTotalPoints += (pts1 + pts2 + pts3);
      sumTotalCritVotes += (t1 + t2 + t3);
      sumTotalPosVotes += (n4_1 + n3_1 + n4_2 + n3_2 + n4_3 + n3_3);
    });

    elemTotalVotes.textContent = totalSurveyVotes.toLocaleString();

    const overallScore = sumTotalCritVotes > 0 ? (sumTotalPoints / sumTotalCritVotes) : 0;
    elemAvgScore.textContent = overallScore.toFixed(2);

    const posRate = sumTotalCritVotes > 0 ? ((sumTotalPosVotes / sumTotalCritVotes) * 100) : 0;
    elemPosRate.textContent = posRate.toFixed(1);

    const c1Score = c1_votes > 0 ? (c1_pts / c1_votes) : 0;
    const c2Score = c2_votes > 0 ? (c2_pts / c2_votes) : 0;
    const c3Score = c3_votes > 0 ? (c3_pts / c3_votes) : 0;

    if (elemC1) elemC1.textContent = c1Score.toFixed(2);
    if (elemC2) elemC2.textContent = c2Score.toFixed(2);
    if (elemC3) elemC3.textContent = c3_votes > 0 ? c3Score.toFixed(2) : '-';

    if (elemBadge) {
      if (overallScore >= 3.8) {
        elemBadge.textContent = 'Đánh giá chung: Xuất sắc';
        elemBadge.style.color = '#0F5132';
      } else if (overallScore >= 3.5) {
        elemBadge.textContent = 'Đánh giá chung: Rất tốt';
        elemBadge.style.color = '#1D4ED8';
      } else if (overallScore >= 3.0) {
        elemBadge.textContent = 'Đánh giá chung: Tốt';
        elemBadge.style.color = '#D97706';
      } else {
        elemBadge.textContent = 'Đánh giá chung: Cần cải tiến';
        elemBadge.style.color = '#B91C1C';
      }
    }
  }

  function renderCsvcCharts() {
    renderCsvcStackedBarChart();
    renderCsvcComparisonChart();
  }

  function renderCsvcStackedBarChart() {
    const canvas = document.getElementById('csvcStackedBarChart');
    if (!canvas) return;

    if (csvcCharts.stackedBar) {
      csvcCharts.stackedBar.destroy();
      csvcCharts.stackedBar = null;
    }

    if (filteredCsvcItems.length === 0) return;

    let c1 = { 4:0, 3:0, 2:0, 1:0, tot: 0 };
    let c2 = { 4:0, 3:0, 2:0, 1:0, tot: 0 };
    let c3 = { 4:0, 3:0, 2:0, 1:0, tot: 0 };

    filteredCsvcItems.forEach(item => {
      c1[4] += item.cttc_4 || 0; c1[3] += item.cttc_3 || 0; c1[2] += item.cttc_2 || 0; c1[1] += item.cttc_1 || 0; c1.tot += (item.cttc_tot || 0);
      c2[4] += item.csvc_4 || 0; c2[3] += item.csvc_3 || 0; c2[2] += item.csvc_2 || 0; c2[1] += item.csvc_1 || 0; c2.tot += (item.csvc_tot || 0);
      c3[4] += item.hc_4 || 0;   c3[3] += item.hc_3 || 0;   c3[2] += item.hc_2 || 0;   c3[1] += item.hc_1 || 0;   c3.tot += (item.hc_tot || 0);
    });

    const p1_4 = c1.tot ? ((c1[4] / c1.tot) * 100) : 0;
    const p1_3 = c1.tot ? ((c1[3] / c1.tot) * 100) : 0;
    const p1_2 = c1.tot ? ((c1[2] / c1.tot) * 100) : 0;
    const p1_1 = c1.tot ? ((c1[1] / c1.tot) * 100) : 0;

    const p2_4 = c2.tot ? ((c2[4] / c2.tot) * 100) : 0;
    const p2_3 = c2.tot ? ((c2[3] / c2.tot) * 100) : 0;
    const p2_2 = c2.tot ? ((c2[2] / c2.tot) * 100) : 0;
    const p2_1 = c2.tot ? ((c2[1] / c2.tot) * 100) : 0;

    const p3_4 = c3.tot ? ((c3[4] / c3.tot) * 100) : 0;
    const p3_3 = c3.tot ? ((c3[3] / c3.tot) * 100) : 0;
    const p3_2 = c3.tot ? ((c3[2] / c3.tot) * 100) : 0;
    const p3_1 = c3.tot ? ((c3[1] / c3.tot) * 100) : 0;

    const labels = [
      '1. Công tác tổ chức (CTTC)',
      '2. Cơ sở vật chất (CSVC)',
      '3. Công tác hậu cần (HC)'
    ];

    const ctx = canvas.getContext('2d');
    csvcCharts.stackedBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Tốt (4đ)',
            data: [p1_4, p2_4, p3_4],
            backgroundColor: '#1E5E47',
            rawCounts: [c1[4], c2[4], c3[4]],
            totalVotes: [c1.tot, c2.tot, c3.tot],
            barThickness: 22,
            maxBarThickness: 26
          },
          {
            label: 'Khá (3đ)',
            data: [p1_3, p2_3, p3_3],
            backgroundColor: '#48A97C',
            rawCounts: [c1[3], c2[3], c3[3]],
            totalVotes: [c1.tot, c2.tot, c3.tot],
            barThickness: 22,
            maxBarThickness: 26
          },
          {
            label: 'Bình thường (2đ)',
            data: [p1_2, p2_2, p3_2],
            backgroundColor: '#D68B35',
            rawCounts: [c1[2], c2[2], c3[2]],
            totalVotes: [c1.tot, c2.tot, c3.tot],
            barThickness: 22,
            maxBarThickness: 26
          },
          {
            label: 'Hạn chế (1đ)',
            data: [p1_1, p2_1, p3_1],
            backgroundColor: '#C84646',
            rawCounts: [c1[1], c2[1], c3[1]],
            totalVotes: [c1.tot, c2.tot, c3.tot],
            barThickness: 22,
            maxBarThickness: 26
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 0, bottom: 5, left: 0, right: 10 }
        },
        scales: {
          x: {
            stacked: true,
            max: 100,
            ticks: {
              callback: (v) => v + '%',
              font: { family: 'Plus Jakarta Sans', weight: '600', size: 10 }
            },
            grid: { color: '#F1F5F9' }
          },
          y: {
            stacked: true,
            ticks: {
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 10.5 },
              color: '#374151'
            },
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 },
              color: '#374151',
              padding: 12
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
            bodyFont: { family: 'Plus Jakarta Sans' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: function(context) {
                const dataset = context.dataset;
                const idx = context.dataIndex;
                const pct = context.parsed.x.toFixed(1);
                const count = dataset.rawCounts ? dataset.rawCounts[idx] : 0;
                const tot = dataset.totalVotes ? dataset.totalVotes[idx] : 0;
                return dataset.label + ': ' + count.toLocaleString() + ' phiếu (' + pct + '% / ' + tot.toLocaleString() + ' phiếu)';
              }
            }
          }
        }
      }
    });
  }

  function renderCsvcComparisonChart() {
    const canvas = document.getElementById('csvcComparisonChart');
    const scrollInner = document.getElementById('csvcComparisonScrollInner');
    const scrollOuter = document.getElementById('csvcComparisonScrollOuter');
    const countHint = document.getElementById('csvcScrollCountHint');

    if (!canvas) return;

    if (csvcCharts.comparison) {
      csvcCharts.comparison.destroy();
      csvcCharts.comparison = null;
    }

    if (filteredCsvcItems.length === 0) return;

    const isByLoc = (csvcCompareMode === 'location');
    const groupKey = isByLoc ? 'dia_diem' : 'chuong_trinh';

    // Group items by Location or Program
    const groups = {};
    filteredCsvcItems.forEach(item => {
      const k = item[groupKey] || (isByLoc ? 'Chưa xác định' : 'Khác');
      if (!groups[k]) {
        groups[k] = {
          name: k,
          full_name: isByLoc ? k : (item.ten_ct_full || k),
          classes: new Set(),
          votes: 0,
          c1_pts: 0, c1_votes: 0,
          c2_pts: 0, c2_votes: 0,
          c3_pts: 0, c3_votes: 0
        };
      }
      groups[k].classes.add(item.ma_lop);
      groups[k].votes += (item.so_phieu || 0);

      const n4_1 = item.cttc_4 || 0, n3_1 = item.cttc_3 || 0, n2_1 = item.cttc_2 || 0, n1_1 = item.cttc_1 || 0;
      const t1 = n4_1 + n3_1 + n2_1 + n1_1;
      groups[k].c1_votes += t1;
      groups[k].c1_pts += (4 * n4_1 + 3 * n3_1 + 2 * n2_1 + 1 * n1_1);

      const n4_2 = item.csvc_4 || 0, n3_2 = item.csvc_3 || 0, n2_2 = item.csvc_2 || 0, n1_2 = item.csvc_1 || 0;
      const t2 = n4_2 + n3_2 + n2_2 + n1_2;
      groups[k].c2_votes += t2;
      groups[k].c2_pts += (4 * n4_2 + 3 * n3_2 + 2 * n2_2 + 1 * n1_2);

      const n4_3 = item.hc_4 || 0, n3_3 = item.hc_3 || 0, n2_3 = item.hc_2 || 0, n1_3 = item.hc_1 || 0;
      const t3 = n4_3 + n3_3 + n2_3 + n1_3;
      groups[k].c3_votes += t3;
      groups[k].c3_pts += (4 * n4_3 + 3 * n3_3 + 2 * n2_3 + 1 * n1_3);
    });

    const itemList = Object.values(groups).map(g => {
      const s1 = g.c1_votes > 0 ? (g.c1_pts / g.c1_votes) : null;
      const s2 = g.c2_votes > 0 ? (g.c2_pts / g.c2_votes) : null;
      const s3 = g.c3_votes > 0 ? (g.c3_pts / g.c3_votes) : null;
      const totPts = g.c1_pts + g.c2_pts + g.c3_pts;
      const totVotes = g.c1_votes + g.c2_votes + g.c3_votes;
      const sOverall = totVotes > 0 ? (totPts / totVotes) : null;

      return {
        name: g.name,
        full_name: g.full_name,
        classes: g.classes.size,
        votes: g.votes,
        score1: s1,
        score2: s2,
        score3: s3,
        scoreOverall: sOverall
      };
    });

    // Sort descending by overall score or votes
    itemList.sort((a, b) => (b.votes - a.votes));

    if (countHint) {
      countHint.textContent = itemList.length;
    }

    // Set dynamic width for horizontal scroll
    if (scrollInner) {
      const minW = Math.max(750, itemList.length * 68);
      scrollInner.style.width = minW + 'px';
    }

    // Multi-line labels: Name + Number of classes directly on axis
    const labels = itemList.map(it => [it.name, '(' + it.classes + ' lớp)']);
    const dataClasses = itemList.map(it => it.classes);
    const dataC1 = itemList.map(it => it.score1 !== null ? Number(it.score1.toFixed(2)) : null);
    const dataC2 = itemList.map(it => it.score2 !== null ? Number(it.score2.toFixed(2)) : null);
    const dataC3 = itemList.map(it => it.score3 !== null ? Number(it.score3.toFixed(2)) : null);

    const validScores = [...dataC1, ...dataC2, ...dataC3].filter(s => s !== null && s > 0);
    const minVal = validScores.length ? Math.min(...validScores) : 3.0;
    const yMin = Math.max(2.5, Math.floor((minVal - 0.15) * 10) / 10);
    const maxClassVal = dataClasses.length ? Math.max(...dataClasses) : 10;
    const yClassMax = Math.max(10, Math.ceil(maxClassVal * 1.3));

    const ctx = canvas.getContext('2d');
    csvcCharts.comparison = new Chart(ctx, {
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Số lớp tổ chức (cột mờ)',
            data: dataClasses,
            yAxisID: 'yClasses',
            backgroundColor: 'rgba(140, 29, 64, 0.10)',
            hoverBackgroundColor: 'rgba(140, 29, 64, 0.22)',
            borderColor: 'rgba(140, 29, 64, 0.28)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.5,
            order: 10
          },
          {
            type: 'line',
            label: '1. Công tác tổ chức (CTTC)',
            data: dataC1,
            yAxisID: 'y',
            borderColor: '#0F5132',
            backgroundColor: '#0F5132',
            borderWidth: 2.75,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#0F5132',
            tension: 0.25,
            spanGaps: true,
            order: 1
          },
          {
            type: 'line',
            label: '2. Cơ sở vật chất (CSVC)',
            data: dataC2,
            yAxisID: 'y',
            borderColor: '#8C1D40',
            backgroundColor: '#8C1D40',
            borderWidth: 2.75,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#8C1D40',
            tension: 0.25,
            spanGaps: true,
            order: 2
          },
          {
            type: 'line',
            label: '3. Công tác hậu cần (HC)',
            data: dataC3,
            yAxisID: 'y',
            borderColor: '#D97706',
            backgroundColor: '#D97706',
            borderWidth: 2.75,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#D97706',
            borderDash: [4, 4],
            tension: 0.25,
            spanGaps: true,
            order: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            min: yMin,
            max: 4.0,
            title: {
              display: true,
              text: 'Điểm đánh giá (thang 4.0)',
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 10.5 },
              color: '#475569'
            },
            ticks: {
              stepSize: 0.2,
              font: { family: 'Plus Jakarta Sans', weight: '600', size: 10.5 }
            },
            grid: { color: '#E2E8F0' }
          },
          yClasses: {
            type: 'linear',
            position: 'right',
            min: 0,
            max: yClassMax,
            title: {
              display: true,
              text: 'Số lớp tổ chức',
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 10.5 },
              color: '#8C1D40'
            },
            ticks: {
              stepSize: yClassMax > 15 ? 5 : 2,
              callback: (v) => v + ' lớp',
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 10 },
              color: '#8C1D40'
            },
            grid: { display: false }
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 9.5 },
              color: '#374151'
            },
            grid: { color: '#F1F5F9' }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 },
              color: '#374151',
              padding: 12
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
            bodyFont: { family: 'Plus Jakarta Sans' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: function(items) {
                if (!items || items.length === 0) return '';
                const idx = items[0].dataIndex;
                const it = itemList[idx];
                const prefix = isByLoc ? 'Địa điểm: ' : 'Chương trình: ';
                return prefix + it.full_name + ' (' + it.classes + ' lớp - ' + it.votes + ' phiếu)';
              },
              label: function(context) {
                const label = context.dataset.label || '';
                const val = context.parsed.y;
                if (context.dataset.yAxisID === 'yClasses') {
                  return 'Số lớp tổ chức: ' + val + ' lớp';
                }
                if (val === null || typeof val === 'undefined') {
                  return label + ': Không áp dụng';
                }
                return label + ': ' + val.toFixed(2) + ' / 4.0';
              }
            }
          }
        }
      }
    });

    // Drag-to-scroll
    if (scrollOuter && !scrollOuter._hasDragScroll) {
      scrollOuter._hasDragScroll = true;
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      scrollOuter.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - scrollOuter.offsetLeft;
        scrollLeft = scrollOuter.scrollLeft;
      });
      scrollOuter.addEventListener('mouseleave', () => { isDown = false; });
      scrollOuter.addEventListener('mouseup', () => { isDown = false; });
      scrollOuter.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollOuter.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollOuter.scrollLeft = scrollLeft - walk;
      });
    }
  }

  function renderCsvcTable() {
    const tbody = document.getElementById('csvcTableBody');
    const filteredCountElem = document.getElementById('csvcTableFilteredCount');
    const totalCountElem = document.getElementById('csvcTableTotalCount');
    const statusCountElem = document.getElementById('csvcTableStatusCount');

    const distinctFiltered = new Set(filteredCsvcItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)).size;
    const distinctTotal = new Set(allCsvcItems.map(c => (c.ma_lop || '').trim().toLowerCase()).filter(Boolean)).size;

    if (totalCountElem) totalCountElem.textContent = distinctTotal.toLocaleString();
    if (filteredCountElem) filteredCountElem.textContent = distinctFiltered.toLocaleString();
    if (statusCountElem) statusCountElem.textContent = distinctFiltered.toLocaleString();

    if (!tbody) return;

    if (filteredCsvcItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i> Không có lớp học nào thỏa mãn điều kiện lọc. Hãy chọn lại bộ lọc.</td></tr>';
      return;
    }

    const sorted = [...filteredCsvcItems].sort((a, b) => {
      let va = a[csvcCurrentSort.column];
      let vb = b[csvcCurrentSort.column];
      if (typeof va === 'string') {
        return csvcCurrentSort.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return csvcCurrentSort.dir === 'asc' ? ((va || 0) - (vb || 0)) : ((vb || 0) - (va || 0));
    });

    tbody.innerHTML = sorted.map((row, idx) => {
      let fmtBadge = getFormatBadge(row);
      if (fmtBadge && fmtBadge.includes('TRỰC TIẾP KẾT HỢP TRỰC TUYẾN')) {
        fmtBadge = fmtBadge.replace('TRỰC TIẾP KẾT HỢP TRỰC TUYẾN', 'TRỰC TIẾP KẾT HỢP<br>TRỰC TUYẾN');
      }
      const scoreColor = (row.diem_tb || 0) >= 3.8 ? '#0F5132' : ((row.diem_tb || 0) >= 3.5 ? '#1D4ED8' : '#B91C1C');
      const scoreBg = (row.diem_tb || 0) >= 3.8 ? '#ECFDF5' : ((row.diem_tb || 0) >= 3.5 ? '#EFF6FF' : '#FEF2F2');
      const timeStr = (row.ngay_bd_raw || row.ngay_bd || '') + ' - ' + (row.ngay_kt_raw || row.ngay_kt || '');

      const c1Str = row.cttc_score !== null ? row.cttc_score.toFixed(2) : '-';
      const c2Str = row.csvc_score !== null ? row.csvc_score.toFixed(2) : '-';
      const c3Str = (row.hc_tot > 0 && row.hc_score !== null)
        ? `<span style="font-weight: 700; color: #D97706;">${row.hc_score.toFixed(2)}</span>`
        : `<span style="color: var(--text-muted); font-size: 0.75rem;" title="Không áp dụng cho hình thức trực tuyến">—</span>`;

      const scoreDisplay = row.diem_tb !== null ? row.diem_tb.toFixed(2) : '-';

      return `
        <tr onclick="window.openCsvcModalById(${row.id})" style="cursor: pointer;">
          <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
          <td>
            <div style="font-weight: 800; color: var(--brand-primary); font-size: 0.85rem;">${row.ma_lop}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.25; margin-top: 0.15rem;" title="${row.ten_ct_full}">${row.ten_ct_full || row.chuong_trinh}</div>
          </td>
          <td>
            <span style="font-weight: 700; color: #0F5132; font-size: 0.8rem;"><i class="fa-solid fa-location-dot" style="margin-right: 3px;"></i> ${row.dia_diem || 'Chưa rõ'}</span>
          </td>
          <td style="text-align: center;">${fmtBadge}</td>
          <td>
            <div style="font-size: 0.78rem; font-weight: 600; color: #1E293B;">${timeStr}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.1rem;"><i class="fa-solid fa-user-tie"></i> ${row.cbql || 'CBQL'}</div>
          </td>
          <td style="text-align: center; font-weight: 800; color: #1E293B;">${row.so_phieu}</td>
          <td style="text-align: center; font-weight: 700; color: #0F5132;">${c1Str}</td>
          <td style="text-align: center; font-weight: 700; color: var(--brand-primary);">${c2Str}</td>
          <td style="text-align: center;">${c3Str}</td>
          <td style="text-align: center;">
            <span style="display: inline-block; padding: 0.2rem 0.5rem; font-weight: 800; font-size: 0.85rem; border-radius: 4px; background: ${scoreBg}; color: ${scoreColor};">
              ${scoreDisplay}
            </span>
          </td>
          <td style="text-align: center;" onclick="event.stopPropagation(); window.openCsvcModalById(${row.id});">
            <button type="button" class="btn" style="padding: 0.25rem 0.55rem; font-size: 0.72rem; background: #F8FAFC; border: 1px solid var(--border-color); color: var(--brand-primary); font-weight: 700; border-radius: 4px;">
              <i class="fa-solid fa-eye"></i> Chi tiết
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function exportCsvcToCsv() {
    if (!filteredCsvcItems || filteredCsvcItems.length === 0) {
      showToast('Không có dữ liệu phù hợp để xuất.', 'warning');
      return;
    }

    const headers = [
      'STT',
      'Mã Lớp',
      'Chương Trình',
      'Địa Điểm Tổ Chức',
      'Hình Thức Học',
      'Ngày Bắt Đầu',
      'Ngày Kết Thúc',
      'Cán Bộ Quản Lý',
      'Số Phiếu Đánh Giá',
      'Điểm TC1 Tổ Chức (CTTC)',
      'Điểm TC2 Cơ Sở Vật Chất (CSVC)',
      'Điểm TC3 Hậu Cần (HC)',
      'Điểm TB Chung'
    ];

    const rows = filteredCsvcItems.map((item, idx) => {
      const c1 = item.cttc_score !== null ? item.cttc_score.toFixed(2) : '';
      const c2 = item.csvc_score !== null ? item.csvc_score.toFixed(2) : '';
      const c3 = (item.hc_tot > 0 && item.hc_score !== null) ? item.hc_score.toFixed(2) : '';
      const avg = item.diem_tb !== null ? item.diem_tb.toFixed(2) : '';

      return [
        idx + 1,
        '"' + (item.ma_lop || '').replace(/"/g, '""') + '"',
        '"' + (item.ten_ct_full || item.chuong_trinh || '').replace(/"/g, '""') + '"',
        '"' + (item.dia_diem || '').replace(/"/g, '""') + '"',
        '"' + (getDisplayFormat(item) || item.hinh_thuc_hoc || '').replace(/"/g, '""') + '"',
        '"' + (item.ngay_bd_raw || item.ngay_bd || '') + '"',
        '"' + (item.ngay_kt_raw || item.ngay_kt || '') + '"',
        '"' + (item.cbql || '').replace(/"/g, '""') + '"',
        item.so_phieu || 0,
        c1,
        c2,
        c3,
        avg
      ].join(',');
    });

    const csvContent = '﻿' + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', 'Bao_cao_Danh_gia_To_chuc_CSVC_' + dateStr + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file CSV thành công!', 'success');
  }

  async function syncCsvcGoogleSheetData(url, options = {}) {
    if (!url) return;
    try {
      const res = await fetch(url, { cache: 'no-store', redirect: 'follow' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const csvText = await res.text();
      if (!csvText || csvText.length < 50) return;

      const parsedItems = parseCsvToCsvcItems(csvText);
      if (parsedItems && parsedItems.length > 0) {
        allCsvcItems = parsedItems;
        normalizeAllModuleData();
        window.allCsvcItems = allCsvcItems;
        try {
          localStorage.setItem(STORAGE_KEY_CSVC_DATA, JSON.stringify(allCsvcItems));
        } catch(e) {}
        populateCsvcFilterDropdowns();
        if (activeView === 'csvc' && typeof applyCsvcFilters === 'function') {
          applyCsvcFilters();
        }
        if (!options.silent) {
          showToast('Đồng bộ dữ liệu Tổ chức & CSVC thành công!', 'success');
        }
      }
    } catch (e) {
      console.warn('Lỗi đồng bộ dữ liệu CSVC:', e.message);
      if (!options.silent) {
        showToast('Không thể kết nối Google Sheet CSVC, đang dùng dữ liệu dự phòng.', 'warning');
      }
    }
  }

  function parseCsvToCsvcItems(csvText) {
    if (!csvText || csvText.trim().startsWith('<')) return [];
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];

    // Simple CSV parser
    function parseCSVLine(text) {
      const result = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          if (inQuotes && text[i+1] === '"') { cur += '"'; i++; }
          else inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          result.push(cur); cur = '';
        } else { cur += c; }
      }
      result.push(cur);
      return result;
    }

    const headerRow = parseCSVLine(lines[0]).map(s => s.trim().toLowerCase());
    if (!headerRow[0] || !headerRow[0].includes('địa điểm') || !headerRow[2] || !headerRow[2].includes('mã lớp')) {
      return [];
    }

    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const c = parseCSVLine(lines[i]).map(s => s.trim());
      if (!c[2] || c[2] === '') continue;

      const diaDiem = c[0];
      const chuongTrinh = c[1];
      const maLop = c[2];
      let hinhThuc = c[3];
      if (hinhThuc.toLowerCase() === 'polycom') hinhThuc = 'Trực tuyến';

      const ngayBd = c[4];
      const ngayKt = c[5];

      const cttc_4 = Number(c[6]) || 0;
      const cttc_3 = Number(c[7]) || 0;
      const cttc_2 = Number(c[8]) || 0;
      const cttc_1 = Number(c[9]) || 0;
      const cttc_tot = cttc_4 + cttc_3 + cttc_2 + cttc_1;
      const cttc_score = cttc_tot ? (4*cttc_4 + 3*cttc_3 + 2*cttc_2 + 1*cttc_1) / cttc_tot : null;

      const csvc_4 = Number(c[10]) || 0;
      const csvc_3 = Number(c[11]) || 0;
      const csvc_2 = Number(c[12]) || 0;
      const csvc_1 = Number(c[13]) || 0;
      const csvc_tot = csvc_4 + csvc_3 + csvc_2 + csvc_1;
      const csvc_score = csvc_tot ? (4*csvc_4 + 3*csvc_3 + 2*csvc_2 + 1*csvc_1) / csvc_tot : null;

      const hc_4 = Number(c[14]) || 0;
      const hc_3 = Number(c[15]) || 0;
      const hc_2 = Number(c[16]) || 0;
      const hc_1 = Number(c[17]) || 0;
      const hc_tot = hc_4 + hc_3 + hc_2 + hc_1;
      const hc_score = hc_tot ? (4*hc_4 + 3*hc_3 + 2*hc_2 + 1*hc_1) / hc_tot : null;

      const cbql = c[18];
      const rowVotes = Math.max(cttc_tot, csvc_tot, hc_tot);

      const totalPoints = (4*cttc_4 + 3*cttc_3 + 2*cttc_2 + 1*cttc_1) +
                          (4*csvc_4 + 3*csvc_3 + 2*csvc_2 + 1*csvc_1) +
                          (4*hc_4 + 3*hc_3 + 2*hc_2 + 1*hc_1);
      const totalCritVotes = cttc_tot + csvc_tot + hc_tot;
      const rowAvgScore = totalCritVotes ? (totalPoints / totalCritVotes) : null;

      // Find full name from existing catalog
      let fullProgName = chuongTrinh;
      if (typeof allNddtItems !== 'undefined') {
        const found = allNddtItems.find(x => x.chuong_trinh === chuongTrinh);
        if (found && found.ten_ct_full) fullProgName = found.ten_ct_full;
      }
      if (fullProgName === chuongTrinh && typeof allPphtdtItems !== 'undefined') {
        const found = allPphtdtItems.find(x => x.chuong_trinh === chuongTrinh);
        if (found && found.ten_ct_full) fullProgName = found.ten_ct_full;
      }

      items.push({
        id: items.length + 1,
        dia_diem: diaDiem,
        chuong_trinh: chuongTrinh,
        ma_lop: maLop,
        ten_ct_full: fullProgName,
        hinh_thuc_hoc: c[3],
        ngay_bd_raw: ngayBd,
        ngay_kt_raw: ngayKt,
        cbql: cbql,
        cttc_4, cttc_3, cttc_2, cttc_1, cttc_tot, cttc_score,
        csvc_4, csvc_3, csvc_2, csvc_1, csvc_tot, csvc_score,
        hc_4, hc_3, hc_2, hc_1, hc_tot, hc_score,
        so_phieu: rowVotes,
        total_crit_votes: totalCritVotes,
        total_points: totalPoints,
        diem_tb: rowAvgScore
      });
    }

    return items;
  }


  // ==========================================
  // GV (ĐÁNH GIÁ GIẢNG VIÊN) MODULE LOGIC
  // ==========================================

  function setupGvModule() {
    populateGvFilterDropdowns();
    attachGvEventListeners();
    applyGvFilters();
  }

  function populateGvFilterDropdowns() {
    const progSelect = document.getElementById('filterGvProgram');
    const nguonSelect = document.getElementById('filterGvNguon');
    const donViSelect = document.getElementById('filterGvDonVi');
    const fmtSelect = document.getElementById('filterGvFormat');
    const nameSelect = document.getElementById('filterGvName');

    if (!progSelect || !donViSelect || !fmtSelect || !nameSelect) return;

    // Distinct lists
    const progMap = new Map();
    allGvItems.forEach(item => {
      const code = item.chuong_trinh || '';
      const full = item.ten_ct_full || code;
      if (code && !progMap.has(code)) progMap.set(code, full);
    });
    const sortedProgs = Array.from(progMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    const donVis = [...new Set(allGvItems.map(c => c.don_vi).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const formats = [...new Set(allGvItems.map(c => c.hinh_thuc_hoc).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const lecturers = [...new Set(allGvItems.map(c => c.ten_gv).filter(Boolean))].sort((a, b) => a.localeCompare(b));

    progSelect.innerHTML = '<option value="">-- Tất cả Chương trình (' + sortedProgs.length + ') --</option>' +
      sortedProgs.map(([code, full]) => '<option value="' + code + '">' + code + ' - ' + (full.length > 45 ? full.slice(0, 42) + '...' : full) + '</option>').join('');

    donViSelect.innerHTML = '<option value="">-- Tất cả Đơn vị / Đối tác (' + donVis.length + ') --</option>' +
      donVis.map(d => '<option value="' + d + '">' + d + '</option>').join('');

    fmtSelect.innerHTML = '<option value="">-- Tất cả Hình thức (' + formats.length + ') --</option>' +
      formats.map(f => '<option value="' + f + '">' + f + '</option>').join('');

    nameSelect.innerHTML = '<option value="">-- Tất cả Giảng viên (' + lecturers.length + ') --</option>' +
      lecturers.map(g => '<option value="' + g + '">' + g + '</option>').join('');
  }

  function attachGvEventListeners() {
    // 1. Preset Buttons
    document.querySelectorAll('.gv-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.gv-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gvState.preset = btn.dataset.gvPreset || 'all';
        applyGvFilters();
      });
    });

    // 2. Dropdown Filters
    const progSelect = document.getElementById('filterGvProgram');
    if (progSelect) {
      progSelect.addEventListener('change', (e) => {
        gvState.program = e.target.value;
        applyGvFilters();
      });
    }

    const nguonSelect = document.getElementById('filterGvNguon');
    if (nguonSelect) {
      nguonSelect.addEventListener('change', (e) => {
        gvState.nguon = e.target.value;
        applyGvFilters();
      });
    }

    const donViSelect = document.getElementById('filterGvDonVi');
    if (donViSelect) {
      donViSelect.addEventListener('change', (e) => {
        gvState.donVi = e.target.value;
        applyGvFilters();
      });
    }

    const fmtSelect = document.getElementById('filterGvFormat');
    if (fmtSelect) {
      fmtSelect.addEventListener('change', (e) => {
        gvState.format = e.target.value;
        applyGvFilters();
      });
    }

    const nameSelect = document.getElementById('filterGvName');
    if (nameSelect) {
      nameSelect.addEventListener('change', (e) => {
        gvState.lecturer = e.target.value;
        applyGvFilters();
      });
    }

    const ratingSelect = document.getElementById('filterGvRatingLevel');
    if (ratingSelect) {
      ratingSelect.addEventListener('change', (e) => {
        gvState.ratingLevel = e.target.value;
        applyGvFilters();
      });
    }

    // 3. Search Box with Debouncing
    const searchInput = document.getElementById('filterGvSearch');
    let searchDebounceTimer = null;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          gvState.searchQuery = (e.target.value || '').trim();
          applyGvFilters();
        }, 250);
      });
    }

    // 4. Reset Button
    const btnReset = document.getElementById('btnResetGvFilter');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        gvState = {
          preset: 'all',
          program: '',
          nguon: '',
          donVi: '',
          format: '',
          lecturer: '',
          ratingLevel: '',
          searchQuery: ''
        };
        // Reset inputs
        document.querySelectorAll('.gv-preset-btn').forEach(b => b.classList.remove('active'));
        const defaultPreset = document.querySelector('.gv-preset-btn[data-gv-preset="all"]');
        if (defaultPreset) defaultPreset.classList.add('active');

        if (progSelect) progSelect.value = '';
        if (nguonSelect) nguonSelect.value = '';
        if (donViSelect) donViSelect.value = '';
        if (fmtSelect) fmtSelect.value = '';
        if (nameSelect) nameSelect.value = '';
        if (ratingSelect) ratingSelect.value = '';
        if (searchInput) searchInput.value = '';

        gvRankMetric = 'gpa';
        gvTopLimit = '15';
        if (selectGvTopLimit) selectGvTopLimit.value = '15';
        updateGvRankButtons();

        applyGvFilters();
        if (typeof showToast === 'function') {
          showToast('Đã đặt lại toàn bộ bộ lọc Đánh giá Giảng viên', 'info');
        }
      });
    }

    // 5. Comparison Chart Toggles & Slicers
    const btnToggleLecturer = document.getElementById('btnGvToggleLecturer');
    const btnToggleUnit = document.getElementById('btnGvToggleUnit');
    if (btnToggleLecturer && btnToggleUnit) {
      btnToggleLecturer.addEventListener('click', () => {
        gvCompareMode = 'lecturer';
        btnToggleLecturer.classList.add('active');
        btnToggleLecturer.style.background = 'var(--brand-primary)';
        btnToggleLecturer.style.color = 'white';
        btnToggleUnit.classList.remove('active');
        btnToggleUnit.style.background = 'transparent';
        btnToggleUnit.style.color = '#475569';
        renderGvComparisonChart();
      });

      btnToggleUnit.addEventListener('click', () => {
        gvCompareMode = 'unit';
        btnToggleUnit.classList.add('active');
        btnToggleUnit.style.background = 'var(--brand-primary)';
        btnToggleUnit.style.color = 'white';
        btnToggleLecturer.classList.remove('active');
        btnToggleLecturer.style.background = 'transparent';
        btnToggleLecturer.style.color = '#475569';
        renderGvComparisonChart();
      });
    }

    // Rank metric sub-slicers (Top GPA, Top Số lớp, Top Số tiết)
    const btnGvRankGpa = document.getElementById('btnGvRankGpa');
    const btnGvRankClasses = document.getElementById('btnGvRankClasses');
    const btnGvRankHours = document.getElementById('btnGvRankHours');
    const selectGvTopLimit = document.getElementById('selectGvTopLimit');

    function updateGvRankButtons() {
      const gpa = document.getElementById('btnGvRankGpa');
      const cls = document.getElementById('btnGvRankClasses');
      const hrs = document.getElementById('btnGvRankHours');
      if (!gpa || !cls || !hrs) return;

      [gpa, cls, hrs].forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.color = '#475569';
      });

      if (gvRankMetric === 'gpa') {
        gpa.classList.add('active');
        gpa.style.background = '#8C1D40';
        gpa.style.color = 'white';
      } else if (gvRankMetric === 'classes') {
        cls.classList.add('active');
        cls.style.background = '#0284C7';
        cls.style.color = 'white';
      } else if (gvRankMetric === 'hours') {
        hrs.classList.add('active');
        hrs.style.background = '#059669';
        hrs.style.color = 'white';
      }
    }

    if (btnGvRankGpa) {
      btnGvRankGpa.addEventListener('click', () => {
        gvRankMetric = 'gpa';
        updateGvRankButtons();
        renderGvComparisonChart();
      });
    }

    if (btnGvRankClasses) {
      btnGvRankClasses.addEventListener('click', () => {
        gvRankMetric = 'classes';
        updateGvRankButtons();
        renderGvComparisonChart();
      });
    }

    if (btnGvRankHours) {
      btnGvRankHours.addEventListener('click', () => {
        gvRankMetric = 'hours';
        updateGvRankButtons();
        renderGvComparisonChart();
      });
    }

    if (selectGvTopLimit) {
      selectGvTopLimit.addEventListener('change', (e) => {
        gvTopLimit = e.target.value;
        renderGvComparisonChart();
      });
    }

    // 6. Table Sorting
    document.querySelectorAll('#gvClassesTable th[data-gv-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.gvSort;
        if (gvCurrentSort.column === col) {
          gvCurrentSort.dir = gvCurrentSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          gvCurrentSort.column = col;
          gvCurrentSort.dir = 'desc';
        }
        applyGvFilters();
      });
    });

    // 7. Export Buttons
    const btnExportCsv = document.getElementById('btnExportGvCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', exportGvToCsv);
    }

    const btnExportExcel = document.getElementById('btnExportGvExcel');
    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', exportGvToExcel);
    }
  }

  function applyGvFilters() {
    let filtered = [...allGvItems];

    // 1. Time Preset Filter
    if (gvState.preset && gvState.preset !== 'all') {
      filtered = filtered.filter(item => {
        if (!item.ngay_bd) return true;
        const parts = item.ngay_bd.split('/');
        if (parts.length < 3) return true;
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (gvState.preset === '2026') return year === 2026;
        if (gvState.preset === 'q1') return year === 2026 && month >= 1 && month <= 3;
        if (gvState.preset === 'q2') return year === 2026 && month >= 4 && month <= 6;
        if (gvState.preset === 'q3') return year === 2026 && month >= 7 && month <= 9;
        if (gvState.preset === 'q4') return year === 2026 && month >= 10 && month <= 12;
        return true;
      });
    }

    // 2. Program Filter
    if (gvState.program) {
      filtered = filtered.filter(item => item.chuong_trinh === gvState.program || item.ten_ct_full === gvState.program);
    }

    // 3. Nguồn GV Filter
    if (gvState.nguon) {
      filtered = filtered.filter(item => item.nguon_gv === gvState.nguon);
    }

    // 4. Đơn vị Filter
    if (gvState.donVi) {
      filtered = filtered.filter(item => item.don_vi === gvState.donVi);
    }

    // 5. Format Filter
    if (gvState.format) {
      filtered = filtered.filter(item => item.hinh_thuc_hoc === gvState.format);
    }

    // 6. Lecturer Filter
    if (gvState.lecturer) {
      filtered = filtered.filter(item => item.ten_gv === gvState.lecturer);
    }

    // 7. Rating Level Filter
    if (gvState.ratingLevel) {
      filtered = filtered.filter(item => {
        const score = item.diem_tb || 0;
        if (gvState.ratingLevel === 'excellent') return score >= 4.5;
        if (gvState.ratingLevel === 'good') return score >= 4.0 && score < 4.5;
        if (gvState.ratingLevel === 'fair') return score >= 3.0 && score < 4.0;
        if (gvState.ratingLevel === 'warning') return score < 3.0;
        return true;
      });
    }

    // 8. Search Query Filter
    if (gvState.searchQuery) {
      const q = gvState.searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        return (item.ten_gv && item.ten_gv.toLowerCase().includes(q)) ||
               (item.ma_lop && item.ma_lop.toLowerCase().includes(q)) ||
               (item.chuong_trinh && item.chuong_trinh.toLowerCase().includes(q)) ||
               (item.ten_ct_full && item.ten_ct_full.toLowerCase().includes(q)) ||
               (item.don_vi && item.don_vi.toLowerCase().includes(q)) ||
               (item.noi_dung_giang && item.noi_dung_giang.toLowerCase().includes(q)) ||
               (item.cbql && item.cbql.toLowerCase().includes(q));
      });
    }

    // 9. Sort
    const col = gvCurrentSort.column;
    const dir = gvCurrentSort.dir === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      let valA = col === 'ngay_bd' ? (a.ngay_bd_iso || a.ngay_bd) : a[col];
      let valB = col === 'ngay_bd' ? (b.ngay_bd_iso || b.ngay_bd) : b[col];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * dir;
      }
      return String(valA).localeCompare(String(valB), 'vi', { numeric: true }) * dir;
    });

    filteredGvItems = filtered;
    window.filteredGvItems = filteredGvItems;

    // Update UI components
    updateGvKPIs();
    renderGvCharts();
    renderGvTable();
    updateGvSortHeaders();
  }

  function updateGvSortHeaders() {
    document.querySelectorAll('#gvClassesTable th[data-gv-sort]').forEach(th => {
      const col = th.dataset.gvSort;
      const icon = th.querySelector('i');
      if (!icon) return;
      if (gvCurrentSort.column === col) {
        th.style.color = 'var(--brand-primary)';
        icon.className = gvCurrentSort.dir === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';
      } else {
        th.style.color = '';
        icon.className = 'fa-solid fa-sort';
      }
    });
  }

  function updateGvKPIs() {
    const totalLecturersElem = document.getElementById('kpiGvTotalLecturers');
    const totalClassesElem = document.getElementById('kpiGvTotalClasses');
    const totalVotesElem = document.getElementById('kpiGvTotalVotes');
    const avgScoreElem = document.getElementById('kpiGvAvgScore');
    const badgeElem = document.getElementById('kpiGvScoreRatingBadge');
    const posRateElem = document.getElementById('kpiGvPosRate');
    const crit1Elem = document.getElementById('kpiGvCrit1Score');
    const crit2Elem = document.getElementById('kpiGvCrit2Score');
    const crit3Elem = document.getElementById('kpiGvCrit3Score');

    if (!totalLecturersElem) return;

    if (filteredGvItems.length === 0) {
      totalLecturersElem.textContent = '0';
      totalClassesElem.textContent = '0';
      totalVotesElem.textContent = '0';
      avgScoreElem.textContent = '0.00';
      if (badgeElem) {
        badgeElem.textContent = 'Chưa có dữ liệu';
        badgeElem.style.color = 'var(--text-muted)';
      }
      posRateElem.textContent = '0.0';
      crit1Elem.textContent = '0.00';
      crit2Elem.textContent = '0.00';
      crit3Elem.textContent = '0.00';
      return;
    }

    // 1. Distinct Lecturers & Classes
    const distinctLecturers = new Set(filteredGvItems.map(x => x.ten_gv).filter(Boolean)).size;
    const distinctClasses = new Set(filteredGvItems.map(x => x.ma_lop).filter(Boolean)).size;

    // 2. Votes aggregation
    let totKTCM = { 5:0, 4:0, 3:0, 2:0, 1:0 };
    let totKNSP = { 5:0, 4:0, 3:0, 2:0, 1:0 };
    let totTDTP = { 5:0, 4:0, 3:0, 2:0, 1:0 };
    let totalVotes = 0;

    filteredGvItems.forEach(item => {
      totKTCM[5] += item.c5_ktcm || 0;
      totKTCM[4] += item.c4_ktcm || 0;
      totKTCM[3] += item.c3_ktcm || 0;
      totKTCM[2] += item.c2_ktcm || 0;
      totKTCM[1] += item.c1_ktcm || 0;

      totKNSP[5] += item.c5_knsp || 0;
      totKNSP[4] += item.c4_knsp || 0;
      totKNSP[3] += item.c3_knsp || 0;
      totKNSP[2] += item.c2_knsp || 0;
      totKNSP[1] += item.c1_knsp || 0;

      totTDTP[5] += item.c5_tdtp || 0;
      totTDTP[4] += item.c4_tdtp || 0;
      totTDTP[3] += item.c3_tdtp || 0;
      totTDTP[2] += item.c2_tdtp || 0;
      totTDTP[1] += item.c1_tdtp || 0;

      totalVotes += item.tong_phieu || 0;
    });

    const sumVotes1 = totKTCM[5] + totKTCM[4] + totKTCM[3] + totKTCM[2] + totKTCM[1];
    const score1 = sumVotes1 > 0 ? (5*totKTCM[5] + 4*totKTCM[4] + 3*totKTCM[3] + 2*totKTCM[2] + 1*totKTCM[1]) / sumVotes1 : 0;

    const sumVotes2 = totKNSP[5] + totKNSP[4] + totKNSP[3] + totKNSP[2] + totKNSP[1];
    const score2 = sumVotes2 > 0 ? (5*totKNSP[5] + 4*totKNSP[4] + 3*totKNSP[3] + 2*totKNSP[2] + 1*totKNSP[1]) / sumVotes2 : 0;

    const sumVotes3 = totTDTP[5] + totTDTP[4] + totTDTP[3] + totTDTP[2] + totTDTP[1];
    const score3 = sumVotes3 > 0 ? (5*totTDTP[5] + 4*totTDTP[4] + 3*totTDTP[3] + 2*totTDTP[2] + 1*totTDTP[1]) / sumVotes3 : 0;

    let validCritCount = 0;
    let sumScores = 0;
    if (sumVotes1 > 0) { sumScores += score1; validCritCount++; }
    if (sumVotes2 > 0) { sumScores += score2; validCritCount++; }
    if (sumVotes3 > 0) { sumScores += score3; validCritCount++; }
    const overallScore = validCritCount > 0 ? (sumScores / validCritCount) : 0;

    const totalAllVotes = sumVotes1 + sumVotes2 + sumVotes3;
    const positiveVotes = (totKTCM[5] + totKTCM[4]) + (totKNSP[5] + totKNSP[4]) + (totTDTP[5] + totTDTP[4]);
    const overallPosRate = totalAllVotes > 0 ? (positiveVotes / totalAllVotes) * 100 : 0;

    // Display formatted
    totalLecturersElem.textContent = distinctLecturers.toLocaleString('vi-VN');
    totalClassesElem.textContent = distinctClasses.toLocaleString('vi-VN');
    totalVotesElem.textContent = totalVotes.toLocaleString('vi-VN');
    avgScoreElem.textContent = overallScore.toFixed(2);
    posRateElem.textContent = overallPosRate.toFixed(1);

    crit1Elem.textContent = score1.toFixed(2);
    crit2Elem.textContent = score2.toFixed(2);
    crit3Elem.textContent = score3.toFixed(2);

    if (badgeElem) {
      if (overallScore >= 4.5) {
        badgeElem.textContent = 'Đánh giá chung: Xuất sắc';
        badgeElem.style.color = '#0F5132';
      } else if (overallScore >= 4.0) {
        badgeElem.textContent = 'Đánh giá chung: Tốt';
        badgeElem.style.color = '#22C55E';
      } else if (overallScore >= 3.0) {
        badgeElem.textContent = 'Đánh giá chung: Khá';
        badgeElem.style.color = '#D97706';
      } else {
        badgeElem.textContent = 'Đánh giá chung: Cần cải thiện';
        badgeElem.style.color = '#DC2626';
      }
    }
  }

  function renderGvCharts() {
    renderGvStackedBarChart();
    renderGvComparisonChart();
  }

  function renderGvStackedBarChart() {
    const canvas = document.getElementById('gvStackedBarChart');
    if (!canvas) return;

    if (gvCharts.stackedBar) {
      gvCharts.stackedBar.destroy();
      gvCharts.stackedBar = null;
    }

    if (filteredGvItems.length === 0) return;

    // Aggregate counts for the 3 criteria
    let c1 = { 5:0, 4:0, 3:0, 2:0, 1:0 };
    let c2 = { 5:0, 4:0, 3:0, 2:0, 1:0 };
    let c3 = { 5:0, 4:0, 3:0, 2:0, 1:0 };

    filteredGvItems.forEach(item => {
      c1[5] += item.c5_ktcm || 0; c1[4] += item.c4_ktcm || 0; c1[3] += item.c3_ktcm || 0; c1[2] += item.c2_ktcm || 0; c1[1] += item.c1_ktcm || 0;
      c2[5] += item.c5_knsp || 0; c2[4] += item.c4_knsp || 0; c2[3] += item.c3_knsp || 0; c2[2] += item.c2_knsp || 0; c2[1] += item.c1_knsp || 0;
      c3[5] += item.c5_tdtp || 0; c3[4] += item.c4_tdtp || 0; c3[3] += item.c3_tdtp || 0; c3[2] += item.c2_tdtp || 0; c3[1] += item.c1_tdtp || 0;
    });

    const tot1 = c1[5] + c1[4] + c1[3] + c1[2] + c1[1];
    const tot2 = c2[5] + c2[4] + c2[3] + c2[2] + c2[1];
    const tot3 = c3[5] + c3[4] + c3[3] + c3[2] + c3[1];

    const p5 = [
      tot1 ? (c1[5] / tot1) * 100 : 0,
      tot2 ? (c2[5] / tot2) * 100 : 0,
      tot3 ? (c3[5] / tot3) * 100 : 0
    ];
    const p4 = [
      tot1 ? (c1[4] / tot1) * 100 : 0,
      tot2 ? (c2[4] / tot2) * 100 : 0,
      tot3 ? (c3[4] / tot3) * 100 : 0
    ];
    const p3 = [
      tot1 ? (c1[3] / tot1) * 100 : 0,
      tot2 ? (c2[3] / tot2) * 100 : 0,
      tot3 ? (c3[3] / tot3) * 100 : 0
    ];
    const p2 = [
      tot1 ? (c1[2] / tot1) * 100 : 0,
      tot2 ? (c2[2] / tot2) * 100 : 0,
      tot3 ? (c3[2] / tot3) * 100 : 0
    ];
    const p1 = [
      tot1 ? (c1[1] / tot1) * 100 : 0,
      tot2 ? (c2[1] / tot2) * 100 : 0,
      tot3 ? (c3[1] / tot3) * 100 : 0
    ];

    const ctx = canvas.getContext('2d');
    gvCharts.stackedBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          '1. Chuyên môn (KTCM)',
          '2. Sư phạm (KNSP)',
          '3. Tác phong (TDTP)'
        ],
        datasets: [
          {
            label: 'Mức 5: Xuất sắc',
            data: p5.map(v => Number(v.toFixed(1))),
            backgroundColor: '#0F5132', // ESG Green
            rawVotes: [c1[5], c2[5], c3[5]],
            barThickness: 32
          },
          {
            label: 'Mức 4: Tốt',
            data: p4.map(v => Number(v.toFixed(1))),
            backgroundColor: '#22C55E', // Green
            rawVotes: [c1[4], c2[4], c3[4]],
            barThickness: 32
          },
          {
            label: 'Mức 3: Khá',
            data: p3.map(v => Number(v.toFixed(1))),
            backgroundColor: '#EAB308', // Amber
            rawVotes: [c1[3], c2[3], c3[3]],
            barThickness: 32
          },
          {
            label: 'Mức 2: Bình thường',
            data: p2.map(v => Number(v.toFixed(1))),
            backgroundColor: '#F97316', // Orange
            rawVotes: [c1[2], c2[2], c3[2]],
            barThickness: 32
          },
          {
            label: 'Mức 1: Hạn chế',
            data: p1.map(v => Number(v.toFixed(1))),
            backgroundColor: '#EF4444', // Red
            rawVotes: [c1[1], c2[1], c3[1]],
            barThickness: 32
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 10,
              font: { size: 10.5, weight: '700' }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const ds = context.dataset;
                const vote = ds.rawVotes ? ds.rawVotes[context.dataIndex] : 0;
                return ds.label + ': ' + context.parsed.x + '% (' + vote.toLocaleString('vi-VN') + ' phiếu)';
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            max: 100,
            ticks: {
              callback: function(v) { return v + '%'; },
              font: { size: 10 }
            },
            grid: { color: '#F1F5F9' }
          },
          y: {
            stacked: true,
            ticks: {
              font: { size: 11, weight: '700' },
              color: '#334155'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  function renderGvComparisonChart() {
    const canvas = document.getElementById('gvComparisonChart');
    const scrollInner = document.getElementById('gvComparisonScrollInner');
    const scrollOuter = document.getElementById('gvComparisonScrollOuter');
    const hintElem = document.getElementById('gvScrollCountHint');
    const hintTextElem = document.getElementById('gvScrollHintText');
    if (!canvas || !scrollInner) return;

    if (gvCharts.comparison) {
      gvCharts.comparison.destroy();
      gvCharts.comparison = null;
    }

    if (filteredGvItems.length === 0) {
      if (hintElem) hintElem.textContent = '0';
      if (hintTextElem) hintTextElem.innerHTML = 'Không có dữ liệu';
      return;
    }

    let fullList = [];

    if (gvCompareMode === 'lecturer') {
      // Group by Lecturer Name
      const map = new Map();
      filteredGvItems.forEach(item => {
        const name = item.ten_gv || 'Chưa rõ';
        if (!map.has(name)) {
          map.set(name, {
            name,
            unit: item.don_vi || '',
            v1: 0, s1: 0,
            v2: 0, s2: 0,
            v3: 0, s3: 0,
            classes: new Set(),
            hours: 0
          });
        }
        const g = map.get(name);
        g.classes.add(item.ma_lop);
        g.hours += item.so_tiet || 0;
        if (item.tong_phieu_ktcm) {
          g.v1 += item.tong_phieu_ktcm;
          g.s1 += (item.diem_ktcm || 0) * item.tong_phieu_ktcm;
        }
        if (item.tong_phieu_knsp) {
          g.v2 += item.tong_phieu_knsp;
          g.s2 += (item.diem_knsp || 0) * item.tong_phieu_knsp;
        }
        if (item.tong_phieu_tdtp) {
          g.v3 += item.tong_phieu_tdtp;
          g.s3 += (item.diem_tdtp || 0) * item.tong_phieu_tdtp;
        }
      });

      fullList = Array.from(map.values()).map(g => {
        const sc1 = g.v1 ? g.s1 / g.v1 : 0;
        const sc2 = g.v2 ? g.s2 / g.v2 : 0;
        const sc3 = g.v3 ? g.s3 / g.v3 : 0;
        let cCount = 0; let cSum = 0;
        if (g.v1) { cSum += sc1; cCount++; }
        if (g.v2) { cSum += sc2; cCount++; }
        if (g.v3) { cSum += sc3; cCount++; }
        const scAll = cCount ? cSum / cCount : 0;
        return {
          key: g.name,
          displayName: g.name,
          unit: g.unit,
          sc1: Number(sc1.toFixed(2)),
          sc2: Number(sc2.toFixed(2)),
          sc3: Number(sc3.toFixed(2)),
          scAll: Number(scAll.toFixed(2)),
          classCount: g.classes.size,
          hours: g.hours
        };
      });

      // Sort by gvRankMetric
      if (gvRankMetric === 'classes') {
        fullList.sort((a, b) => b.classCount - a.classCount || b.hours - a.hours || b.scAll - a.scAll);
      } else if (gvRankMetric === 'hours') {
        fullList.sort((a, b) => b.hours - a.hours || b.classCount - a.classCount || b.scAll - a.scAll);
      } else {
        // default 'gpa'
        fullList.sort((a, b) => b.scAll - a.scAll || b.classCount - a.classCount || b.hours - a.hours);
      }
    } else {
      // Group by Unit / Partner
      const map = new Map();
      filteredGvItems.forEach(item => {
        const unit = item.don_vi || 'Khác / Chưa rõ';
        if (!map.has(unit)) {
          map.set(unit, {
            unit,
            v1: 0, s1: 0,
            v2: 0, s2: 0,
            v3: 0, s3: 0,
            lecturers: new Set(),
            classes: new Set(),
            hours: 0
          });
        }
        const u = map.get(unit);
        if (item.ten_gv) u.lecturers.add(item.ten_gv);
        u.classes.add(item.ma_lop);
        u.hours += item.so_tiet || 0;
        if (item.tong_phieu_ktcm) {
          u.v1 += item.tong_phieu_ktcm;
          u.s1 += (item.diem_ktcm || 0) * item.tong_phieu_ktcm;
        }
        if (item.tong_phieu_knsp) {
          u.v2 += item.tong_phieu_knsp;
          u.s2 += (item.diem_knsp || 0) * item.tong_phieu_knsp;
        }
        if (item.tong_phieu_tdtp) {
          u.v3 += item.tong_phieu_tdtp;
          u.s3 += (item.diem_tdtp || 0) * item.tong_phieu_tdtp;
        }
      });

      fullList = Array.from(map.values()).map(u => {
        const sc1 = u.v1 ? u.s1 / u.v1 : 0;
        const sc2 = u.v2 ? u.s2 / u.v2 : 0;
        const sc3 = u.v3 ? u.s3 / u.v3 : 0;
        let cCount = 0; let cSum = 0;
        if (u.v1) { cSum += sc1; cCount++; }
        if (u.v2) { cSum += sc2; cCount++; }
        if (u.v3) { cSum += sc3; cCount++; }
        const scAll = cCount ? cSum / cCount : 0;
        return {
          key: u.unit,
          displayName: u.unit,
          unit: u.unit,
          sc1: Number(sc1.toFixed(2)),
          sc2: Number(sc2.toFixed(2)),
          sc3: Number(sc3.toFixed(2)),
          scAll: Number(scAll.toFixed(2)),
          gvCount: u.lecturers.size,
          classCount: u.classes.size,
          hours: u.hours
        };
      });

      // Sort by gvRankMetric
      if (gvRankMetric === 'classes') {
        fullList.sort((a, b) => b.classCount - a.classCount || b.hours - a.hours || b.scAll - a.scAll);
      } else if (gvRankMetric === 'hours') {
        fullList.sort((a, b) => b.hours - a.hours || b.classCount - a.classCount || b.scAll - a.scAll);
      } else {
        // default 'gpa'
        fullList.sort((a, b) => b.scAll - a.scAll || b.classCount - a.classCount || b.hours - a.hours);
      }
    }

    // Apply Top Limit
    const totalCount = fullList.length;
    let displayList = fullList;
    let isLimited = false;
    if (gvTopLimit && gvTopLimit !== 'all') {
      const limit = parseInt(gvTopLimit, 10);
      if (!isNaN(limit) && limit > 0 && limit < totalCount) {
        displayList = fullList.slice(0, limit);
        isLimited = true;
      }
    }

    // Update hints
    if (hintElem) {
      hintElem.textContent = isLimited ? `${displayList.length} / ${totalCount}` : `${totalCount}`;
    }
    if (hintTextElem) {
      if (isLimited) {
        hintTextElem.innerHTML = `Top <strong>${displayList.length}</strong> / ${totalCount} mục`;
      } else {
        hintTextElem.innerHTML = `Xem tất cả <strong>${totalCount}</strong> mục`;
      }
    }

    // Dynamic width sizing:
    // If <= 15 items, 100% width fits cleanly in 8-column container
    // If > 15 items, horizontal scroll with 75px per item
    if (displayList.length <= 15) {
      scrollInner.style.width = '100%';
    } else {
      const containerWidth = scrollOuter ? scrollOuter.clientWidth : 850;
      const dynWidth = Math.max(containerWidth, displayList.length * 75);
      scrollInner.style.width = dynWidth + 'px';
    }

    // Only display full name (hide class count and hour text from axis)
    const labels = displayList.map(item => item.displayName);

    const keys = displayList.map(x => x.key);
    const ktcmData = displayList.map(x => x.sc1);
    const knspData = displayList.map(x => x.sc2);
    const tdtpData = displayList.map(x => x.sc3);
    const overallData = displayList.map(x => x.scAll);
    const hoursData = displayList.map(x => x.hours);
    const classCountData = displayList.map(x => x.classCount);

    const maxHours = Math.max(...hoursData, 10);
    const suggestedMaxHours = Math.max(Math.ceil(maxHours * 1.25), 20);

    const ctx = canvas.getContext('2d');
    gvCharts.comparison = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          // LINE 1: 1. Chuyên môn (KTCM) - Đỏ Bordeaux Agribank (Tương phản mạnh, trọng tâm)
          {
            type: 'line',
            label: '1. Chuyên môn (KTCM)',
            data: ktcmData,
            borderColor: '#8C1D40',
            backgroundColor: '#8C1D40',
            borderWidth: 2.8,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointStyle: 'circle',
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#8C1D40',
            pointBorderWidth: 2.5,
            tension: 0.25,
            yAxisID: 'yScores',
            order: 1
          },
          // LINE 2: 2. Sư phạm (KNSP) - Xanh dương Sapphire (Đối lập sắc bén với đỏ)
          {
            type: 'line',
            label: '2. Sư phạm (KNSP)',
            data: knspData,
            borderColor: '#0284C7',
            backgroundColor: '#0284C7',
            borderWidth: 2.8,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointStyle: 'rectRot',
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#0284C7',
            pointBorderWidth: 2.5,
            tension: 0.25,
            yAxisID: 'yScores',
            order: 1
          },
          // LINE 3: 3. Tác phong (TDTP) - Xanh lá ngọc ESG Agribank (Tươi sáng, dịu mắt, không lóa)
          {
            type: 'line',
            label: '3. Tác phong (TDTP)',
            data: tdtpData,
            borderColor: '#059669',
            backgroundColor: '#059669',
            borderWidth: 2.8,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointStyle: 'triangle',
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#059669',
            pointBorderWidth: 2.5,
            tension: 0.25,
            yAxisID: 'yScores',
            order: 1
          },
          // BAR 1: Tổng số tiết giảng dạy (Thanh Slate Gray trung tính nhẹ)
          {
            type: 'bar',
            label: 'Tổng số tiết',
            data: hoursData,
            backgroundColor: 'rgba(148, 163, 184, 0.22)',
            borderColor: 'rgba(100, 116, 139, 0.45)',
            borderWidth: 1.2,
            borderRadius: 4,
            barPercentage: 0.55,
            categoryPercentage: 0.7,
            yAxisID: 'yVolume',
            order: 2
          },
          // BAR 2: Tổng số lớp giảng dạy (Thanh Amber Cam đất nhẹ)
          {
            type: 'bar',
            label: 'Tổng số lớp',
            data: classCountData,
            backgroundColor: 'rgba(217, 119, 6, 0.2)',
            borderColor: 'rgba(217, 119, 6, 0.45)',
            borderWidth: 1.2,
            borderRadius: 4,
            barPercentage: 0.55,
            categoryPercentage: 0.7,
            yAxisID: 'yVolume',
            order: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt, elements) => {
          if (!elements || elements.length === 0) return;
          const idx = elements[0].index;
          const clickedKey = keys[idx];
          if (!clickedKey) return;

          if (gvCompareMode === 'lecturer') {
            const nameSelect = document.getElementById('filterGvName');
            if (nameSelect) {
              nameSelect.value = clickedKey;
              gvState.lecturer = clickedKey;
              applyGvFilters();
              if (typeof showToast === 'function') {
                showToast('Đang lọc kết quả cho Giảng viên: ' + clickedKey, 'info');
              }
            }
          } else {
            const donViSelect = document.getElementById('filterGvDonVi');
            if (donViSelect) {
              donViSelect.value = clickedKey;
              gvState.donVi = clickedKey;
              applyGvFilters();
              if (typeof showToast === 'function') {
                showToast('Đang lọc kết quả cho Đơn vị: ' + clickedKey, 'info');
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 13,
              padding: 10,
              font: { size: 10.5, weight: '700' },
              usePointStyle: true
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: function(items) {
                if (!items || items.length === 0) return '';
                const idx = items[0].dataIndex;
                const it = displayList[idx];
                if (!it) return '';
                if (gvCompareMode === 'lecturer') {
                  return it.key + (it.unit ? ' (' + it.unit + ')' : '');
                } else {
                  return it.key + ' (' + it.gvCount + ' GV)';
                }
              },
              beforeBody: function(items) {
                if (!items || items.length === 0) return [];
                const idx = items[0].dataIndex;
                const it = displayList[idx];
                if (!it) return [];
                return [
                  '📚 Số lớp giảng dạy: ' + it.classCount + ' lớp',
                  '⏱️ Số tiết giảng dạy: ' + it.hours + ' tiết',
                  '⭐ Điểm TB chung: ' + it.scAll.toFixed(2) + ' / 5.0',
                  '--------------------------------'
                ];
              },
              label: function(context) {
                const ds = context.dataset;
                const val = context.parsed.y;
                if (val === null || val === undefined) return '';
                if (ds.yAxisID === 'yVolume') {
                  if (ds.label.includes('lớp')) {
                    return ds.label + ': ' + val + ' lớp';
                  }
                  return ds.label + ': ' + val + ' tiết';
                }
                return ds.label + ': ' + Number(val).toFixed(2) + ' / 5.0';
              }
            }
          }
        },
        scales: {
          yScores: {
            type: 'linear',
            position: 'left',
            min: 3.5,
            max: 5.0,
            ticks: {
              stepSize: 0.25,
              callback: function(v) { return Number(v).toFixed(2); },
              font: { size: 10.5, weight: '700' },
              color: '#8C1D40'
            },
            title: {
              display: true,
              text: 'Điểm đánh giá (1.0 - 5.0)',
              font: { size: 10, weight: '700' },
              color: '#8C1D40'
            },
            grid: { color: '#F1F5F9' }
          },
          yVolume: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            suggestedMax: suggestedMaxHours,
            ticks: {
              font: { size: 10, weight: '600' },
              color: '#475569',
              callback: function(v) { return Number.isInteger(v) ? v : ''; }
            },
            title: {
              display: true,
              text: 'Số tiết / Số lớp',
              font: { size: 10, weight: '700' },
              color: '#475569'
            },
            grid: { display: false }
          },
          x: {
            ticks: {
              font: { size: 10.5, weight: '600' },
              color: '#1E293B',
              maxRotation: 45,
              minRotation: 30,
              autoSkip: false
            },
            grid: { display: false }
          }
        }
      }
    });

    // Enable drag-to-scroll on horizontal container
    if (scrollOuter && !scrollOuter._hasDragScroll) {
      scrollOuter._hasDragScroll = true;
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      scrollOuter.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - scrollOuter.offsetLeft;
        scrollLeft = scrollOuter.scrollLeft;
      });
      scrollOuter.addEventListener('mouseleave', () => { isDown = false; });
      scrollOuter.addEventListener('mouseup', () => { isDown = false; });
      scrollOuter.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollOuter.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollOuter.scrollLeft = scrollLeft - walk;
      });
    }
  }

  function renderGvTable() {
    const tbody = document.getElementById('gvClassesTableBody');
    const filteredCountElem = document.getElementById('gvTableFilteredCount');
    const totalCountElem = document.getElementById('gvTableTotalCount');

    if (totalCountElem) totalCountElem.textContent = allGvItems.length.toLocaleString('vi-VN');
    if (filteredCountElem) filteredCountElem.textContent = filteredGvItems.length.toLocaleString('vi-VN');

    if (!tbody) return;

    if (filteredGvItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; padding: 2.5rem; color: var(--text-muted); font-style: italic;">Không tìm thấy bản ghi giảng viên nào phù hợp với điều kiện lọc hiện tại.</td></tr>';
      return;
    }

    const html = filteredGvItems.map((item, idx) => {
      // Format Badge
      let fmtBadgeClass = 'badge-format-direct';
      if (item.hinh_thuc_hoc === 'Trực tuyến') fmtBadgeClass = 'badge-format-online';
      else if (item.hinh_thuc_hoc === 'Trực tiếp kết hợp Trực tuyến') fmtBadgeClass = 'badge-format-hybrid';

      // Score Badges
      const scoreBadge = (score) => {
        if (!score && score !== 0) return '<span style="color: #94A3B8;">—</span>';
        let color = '#0F5132';
        let bg = '#ECFDF5';
        if (score >= 4.5) { color = '#0F5132'; bg = '#ECFDF5'; }
        else if (score >= 4.0) { color = '#0284C7'; bg = '#E0F2FE'; }
        else if (score >= 3.0) { color = '#D97706'; bg = '#FEF3C7'; }
        else { color = '#DC2626'; bg = '#FEE2E2'; }
        return '<span class="score-badge" style="background: ' + bg + '; color: ' + color + '; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.8rem;">' + score.toFixed(2) + '</span>';
      };

      const titleDegree = item.hoc_ham_hoc_vi ? '<span style="font-size: 0.72rem; color: #64748B; font-weight: 600; margin-right: 0.25rem;">(' + item.hoc_ham_hoc_vi + ')</span>' : '';
      const nguonTag = item.nguon_gv === 'Agribank' ? 
        '<span style="background: #FEE2E2; color: var(--brand-crimson); font-size: 0.68rem; font-weight: 700; padding: 1px 5px; border-radius: 3px;">Agribank</span>' : 
        '<span style="background: #E0F2FE; color: #0369A1; font-size: 0.68rem; font-weight: 700; padding: 1px 5px; border-radius: 3px;">Mời ngoài</span>';

      const fullProg = String(item.ten_ct_full || item.chuong_trinh || '');
      const fmtBadge = getFormatBadge(item).replace('TRỰC TIẾP KẾT HỢP TRỰC TUYẾN', 'TRỰC TIẾP KẾT HỢP<br>TRỰC TUYẾN');

      return '<tr onclick="window.openGvModalById(' + item.id + ')" style="cursor: pointer;">' +
        '<td style="text-align: center; color: var(--text-muted); font-weight: 600;">' + (idx + 1) + '</td>' +
        '<td>' +
          '<div style="font-weight: 800; color: #1E293B;">' + titleDegree + (item.ten_gv || '') + '</div>' +
          (item.chuc_danh ? '<div style="font-size: 0.72rem; color: #64748B;">' + item.chuc_danh + '</div>' : '') +
        '</td>' +
        '<td>' +
          '<div style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.15rem;">' + nguonTag + '</div>' +
          '<div style="font-size: 0.75rem; color: #334155; font-weight: 600;">' + (item.don_vi || 'Chưa cập nhật') + '</div>' +
        '</td>' +
        '<td>' +
          '<div style="font-weight: 800; color: var(--brand-primary);">' + (item.ma_lop || '') + '</div>' +
          '<div style="font-size: 0.73rem; color: #64748B; line-height: 1.25;" title="' + fullProg + '">' + 
            (fullProg.length > 55 ? fullProg.slice(0, 52) + '...' : fullProg) + 
          '</div>' +
        '</td>' +
        '<td style="text-align: center;">' +
          fmtBadge +
        '</td>' +
        '<td style="text-align: center; font-size: 0.74rem;">' +
          '<div>' + (item.ngay_bd || '—') + '</div>' +
          (item.cbql ? '<div style="font-size: 0.7rem; color: #64748B;">QL: ' + item.cbql + '</div>' : '') +
        '</td>' +
        '<td style="text-align: center; font-weight: 700;">' + (item.so_tiet || '—') + '</td>' +
        '<td style="text-align: center; font-weight: 700; color: #475569;">' + (item.tong_phieu || 0) + '</td>' +
        '<td style="text-align: center;">' + scoreBadge(item.diem_ktcm) + '</td>' +
        '<td style="text-align: center;">' + scoreBadge(item.diem_knsp) + '</td>' +
        '<td style="text-align: center;">' + scoreBadge(item.diem_tdtp) + '</td>' +
        '<td style="text-align: center;">' + scoreBadge(item.diem_tb) + '</td>' +
        '<td style="text-align: center;" onclick="event.stopPropagation(); window.openGvModalById(' + item.id + ');">' +
          '<button type="button" class="btn btn-sm btn-outline-primary" style="padding: 0.2rem 0.55rem; font-size: 0.75rem; font-weight: 700; border-radius: 4px; cursor: pointer;">' +
            '<i class="fa-solid fa-eye"></i> Xem' +
          '</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    tbody.innerHTML = html;
  }

  // Detail Modal Handlers
  window.openGvModalById = function(id) {
    if (!id) return;
    const item = allGvItems.find(x => x.id === Number(id));
    if (!item) return;

    const modal = document.getElementById('gvDetailModal');
    if (!modal) return;

    // Set Header
    const elemCode = document.getElementById('modalGvClassCode');
    const elemName = document.getElementById('modalGvLecturerName');
    if (elemCode) elemCode.textContent = item.ma_lop;
    if (elemName) {
      const degree = item.hoc_ham_hoc_vi ? '(' + item.hoc_ham_hoc_vi + ') ' : '';
      elemName.textContent = degree + item.ten_gv;
    }

    // Set Info Grid
    const infoGrid = document.getElementById('modalGvInfoGrid');
    if (infoGrid) {
      infoGrid.innerHTML = 
        '<div class="modal-item">' +
          '<label><i class="fa-solid fa-user-tie"></i> Giảng viên</label>' +
          '<span style="font-weight: 800; color: #1E293B;">' + item.ten_gv + '</span>' +
        '</div>' +
        '<div class="modal-item">' +
          '<label><i class="fa-solid fa-building-columns"></i> Đơn vị công tác / Đối tác</label>' +
          '<span>' + (item.don_vi || 'Chưa cập nhật') + ' (' + item.nguon_gv + ')</span>' +
        '</div>' +
        '<div class="modal-item full-width">' +
          '<label><i class="fa-solid fa-book-open"></i> Chương trình đào tạo</label>' +
          '<span style="font-weight: 700; color: var(--brand-primary);">' + item.ten_ct_full + '</span>' +
        '</div>' +
        '<div class="modal-item">' +
          '<label><i class="fa-solid fa-shapes"></i> Hình thức đào tạo</label>' +
          '<span>' + item.hinh_thuc_hoc + '</span>' +
        '</div>' +
        '<div class="modal-item">' +
          '<label><i class="fa-regular fa-calendar-days"></i> Thời gian tổ chức</label>' +
          '<span>' + item.ngay_bd + (item.ngay_kt ? ' — ' + item.ngay_kt : '') + '</span>' +
        '</div>' +
        '<div class="modal-item">' +
          '<label><i class="fa-solid fa-clock"></i> Số tiết giảng dạy</label>' +
          '<span style="font-weight: 800; color: #0284C7;">' + (item.so_tiet || 0) + ' tiết</span>' +
        '</div>' +
        '<div class="modal-item">' +
          '<label><i class="fa-solid fa-square-poll-vertical"></i> Tổng phiếu khảo sát</label>' +
          '<span style="font-weight: 800; color: #0F5132;">' + (item.tong_phieu || 0) + ' phiếu hợp lệ</span>' +
        '</div>' +
        (item.cbql ? 
          '<div class="modal-item">' +
            '<label><i class="fa-solid fa-user-shield"></i> Cán bộ quản lý</label>' +
            '<span>' + item.cbql + '</span>' +
          '</div>' : '') +
        (item.noi_dung_giang ? 
          '<div class="modal-item full-width">' +
            '<label><i class="fa-solid fa-graduation-cap"></i> Nội dung / Chuyên đề giảng dạy</label>' +
            '<span style="white-space: pre-line; font-size: 0.82rem; line-height: 1.5; color: #334155;">' + item.noi_dung_giang + '</span>' +
          '</div>' : '');
    }

    // Set Criteria Breakdown
    const critContent = document.getElementById('modalGvCriteriaContent');
    if (critContent) {
      const renderCritBox = (title, icon, color, c5, c4, c3, c2, c1, score, posRate, totVotes) => {
        const p5 = totVotes ? ((c5 / totVotes) * 100).toFixed(1) : '0.0';
        const p4 = totVotes ? ((c4 / totVotes) * 100).toFixed(1) : '0.0';
        const p3 = totVotes ? ((c3 / totVotes) * 100).toFixed(1) : '0.0';
        const p2 = totVotes ? ((c2 / totVotes) * 100).toFixed(1) : '0.0';
        const p1 = totVotes ? ((c1 / totVotes) * 100).toFixed(1) : '0.0';

        return '<div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1rem;">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">' +
            '<div style="display: flex; align-items: center; gap: 0.5rem;">' +
              '<i class="' + icon + '" style="color: ' + color + '; font-size: 1.1rem;"></i>' +
              '<strong style="font-size: 0.95rem; color: #1E293B;">' + title + '</strong>' +
            '</div>' +
            '<div style="display: flex; align-items: center; gap: 0.75rem;">' +
              '<span style="font-size: 0.8rem; font-weight: 700; color: #0F5132; background: #ECFDF5; padding: 2px 8px; border-radius: 4px;">Tích cực: ' + posRate + '%</span>' +
              '<span style="font-size: 1.1rem; font-weight: 800; color: ' + color + ';">' + (score ? score.toFixed(2) : '0.00') + ' <span style="font-size: 0.75rem; font-weight: 600; color: #64748B;">/ 5.0</span></span>' +
            '</div>' +
          '</div>' +
          // 5-level stacked bar visual
          '<div style="height: 14px; display: flex; border-radius: 4px; overflow: hidden; background: #E2E8F0; margin-bottom: 0.75rem;">' +
            '<div style="width: ' + p5 + '%; background: #0F5132;" title="Xuất sắc: ' + c5 + ' (' + p5 + '%)"></div>' +
            '<div style="width: ' + p4 + '%; background: #22C55E;" title="Tốt: ' + c4 + ' (' + p4 + '%)"></div>' +
            '<div style="width: ' + p3 + '%; background: #EAB308;" title="Khá: ' + c3 + ' (' + p3 + '%)"></div>' +
            '<div style="width: ' + p2 + '%; background: #F97316;" title="Bình thường: ' + c2 + ' (' + p2 + '%)"></div>' +
            '<div style="width: ' + p1 + '%; background: #EF4444;" title="Hạn chế: ' + c1 + ' (' + p1 + '%)"></div>' +
          '</div>' +
          // 5 stats pill row
          '<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; text-align: center; font-size: 0.75rem;">' +
            '<div style="background: white; border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px;">' +
              '<div style="color: #0F5132; font-weight: 700;">5 - Xuất sắc</div>' +
              '<div style="font-weight: 800;">' + c5 + ' <span style="font-size: 0.68rem; font-weight: 600; color: #64748B;">(' + p5 + '%)</span></div>' +
            '</div>' +
            '<div style="background: white; border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px;">' +
              '<div style="color: #22C55E; font-weight: 700;">4 - Tốt</div>' +
              '<div style="font-weight: 800;">' + c4 + ' <span style="font-size: 0.68rem; font-weight: 600; color: #64748B;">(' + p4 + '%)</span></div>' +
            '</div>' +
            '<div style="background: white; border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px;">' +
              '<div style="color: #EAB308; font-weight: 700;">3 - Khá</div>' +
              '<div style="font-weight: 800;">' + c3 + ' <span style="font-size: 0.68rem; font-weight: 600; color: #64748B;">(' + p3 + '%)</span></div>' +
            '</div>' +
            '<div style="background: white; border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px;">' +
              '<div style="color: #F97316; font-weight: 700;">2 - Bình thường</div>' +
              '<div style="font-weight: 800;">' + c2 + ' <span style="font-size: 0.68rem; font-weight: 600; color: #64748B;">(' + p2 + '%)</span></div>' +
            '</div>' +
            '<div style="background: white; border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px;">' +
              '<div style="color: #EF4444; font-weight: 700;">1 - Hạn chế</div>' +
              '<div style="font-weight: 800;">' + c1 + ' <span style="font-size: 0.68rem; font-weight: 600; color: #64748B;">(' + p1 + '%)</span></div>' +
            '</div>' +
          '</div>' +
        '</div>';
      };

      critContent.innerHTML = 
        renderCritBox('Tiêu chí 1: Kiến thức chuyên môn', 'fa-solid fa-graduation-cap', '#0F5132', item.c5_ktcm, item.c4_ktcm, item.c3_ktcm, item.c2_ktcm, item.c1_ktcm, item.diem_ktcm, item.ty_le_tich_cuc_ktcm, item.tong_phieu_ktcm) +
        renderCritBox('Tiêu chí 2: Kỹ năng sư phạm / Phương pháp giảng dạy', 'fa-solid fa-chalkboard-user', '#0284C7', item.c5_knsp, item.c4_knsp, item.c3_knsp, item.c2_knsp, item.c1_knsp, item.diem_knsp, item.ty_le_tich_cuc_knsp, item.tong_phieu_knsp) +
        renderCritBox('Tiêu chí 3: Thái độ và tác phong chuyên nghiệp', 'fa-solid fa-user-check', '#D97706', item.c5_tdtp, item.c4_tdtp, item.c3_tdtp, item.c2_tdtp, item.c1_tdtp, item.diem_tdtp, item.ty_le_tich_cuc_tdtp, item.tong_phieu_tdtp);
    }

    modal.classList.add('active');
  };

  window.closeGvModal = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const modal = document.getElementById('gvDetailModal');
    if (modal) modal.classList.remove('active');
  };

  window.closeGvModalOnOverlay = function(e) {
    if (e.target && e.target.id === 'gvDetailModal') {
      window.closeGvModal(e);
    }
  };

  // Export functions
  function exportGvToCsv() {
    if (!filteredGvItems || filteredGvItems.length === 0) {
      if (typeof showToast === 'function') showToast('Không có dữ liệu giảng viên để xuất CSV', 'warning');
      return;
    }

    const headers = [
      'STT', 'Mã lớp', 'Chương trình đào tạo', 'Hình thức học', 'Ngày bắt đầu', 'Ngày kết thúc',
      'Giảng viên', 'Học hàm học vị', 'Nguồn GV', 'Đơn vị công tác', 'Chức danh', 'Số tiết',
      'Tổng phiếu', 'Điểm KTCM', 'Điểm KNSP', 'Điểm TDTP', 'Điểm TB', 'Tỷ lệ tích cực (%)', 'Cán bộ QL'
    ];

    const rows = filteredGvItems.map((item, idx) => [
      idx + 1,
      '"' + (item.ma_lop || '').replace(/"/g, '""') + '"',
      '"' + (item.ten_ct_full || item.chuong_trinh || '').replace(/"/g, '""') + '"',
      '"' + (item.hinh_thuc_hoc || '').replace(/"/g, '""') + '"',
      '"' + (item.ngay_bd || '') + '"',
      '"' + (item.ngay_kt || '') + '"',
      '"' + (item.ten_gv || '').replace(/"/g, '""') + '"',
      '"' + (item.hoc_ham_hoc_vi || '').replace(/"/g, '""') + '"',
      '"' + (item.nguon_gv || '').replace(/"/g, '""') + '"',
      '"' + (item.don_vi || '').replace(/"/g, '""') + '"',
      '"' + (item.chuc_danh || '').replace(/"/g, '""') + '"',
      item.so_tiet || 0,
      item.tong_phieu || 0,
      item.diem_ktcm ? item.diem_ktcm.toFixed(2) : '',
      item.diem_knsp ? item.diem_knsp.toFixed(2) : '',
      item.diem_tdtp ? item.diem_tdtp.toFixed(2) : '',
      item.diem_tb ? item.diem_tb.toFixed(2) : '',
      item.ty_le_tich_cuc_tb ? item.ty_le_tich_cuc_tb.toFixed(1) : '',
      '"' + (item.cbql || '').replace(/"/g, '""') + '"'
    ]);

    const csvContent = '\\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\\r\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Danh_sach_danh_gia_giang_vien_2026.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (typeof showToast === 'function') {
      showToast('Đã xuất thành công ' + filteredGvItems.length + ' bản ghi ra file CSV!', 'success');
    }
  }

  function exportGvToExcel() {
    if (!filteredGvItems || filteredGvItems.length === 0) {
      if (typeof showToast === 'function') showToast('Không có dữ liệu giảng viên để xuất Excel', 'warning');
      return;
    }

    let tableHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    tableHtml += '<head><meta charset="utf-8"/><style>table{border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;} th,td{border:1px solid #CBD5E1;padding:6px;text-align:left;} th{background:#8C1D40;color:#ffffff;font-weight:bold;text-align:center;} .center{text-align:center;} .num{text-align:right;} .badge{font-weight:bold;color:#0F5132;}</style></head><body>';
    tableHtml += '<h2 style="color:#8C1D40;text-align:center;">BÁO CÁO KẾT QUẢ ĐÁNH GIÁ CHẤT LƯỢNG GIẢNG VIÊN</h2>';
    tableHtml += '<p style="text-align:center;font-style:italic;color:#64748B;">Hệ thống Quản lý Đào tạo Agribank 2026 — Xuất ngày: ' + new Date().toLocaleDateString('vi-VN') + '</p>';
    tableHtml += '<table><thead><tr>';
    tableHtml += '<th>STT</th><th>Mã lớp</th><th>Chương trình đào tạo</th><th>Hình thức</th><th>Ngày BD</th><th>Giảng viên</th><th>Học vị</th><th>Nguồn</th><th>Đơn vị</th><th>Số tiết</th><th>Phiếu</th><th>KTCM</th><th>KNSP</th><th>TDTP</th><th>Điểm TB</th><th>Cán bộ QL</th>';
    tableHtml += '</tr></thead><tbody>';

    filteredGvItems.forEach((item, idx) => {
      tableHtml += '<tr>' +
        '<td class="center">' + (idx + 1) + '</td>' +
        '<td>' + (item.ma_lop || '') + '</td>' +
        '<td>' + (item.ten_ct_full || item.chuong_trinh || '') + '</td>' +
        '<td class="center">' + (item.hinh_thuc_hoc || '') + '</td>' +
        '<td class="center">' + (item.ngay_bd || '') + '</td>' +
        '<td><b>' + (item.ten_gv || '') + '</b></td>' +
        '<td class="center">' + (item.hoc_ham_hoc_vi || '') + '</td>' +
        '<td class="center">' + (item.nguon_gv || '') + '</td>' +
        '<td>' + (item.don_vi || '') + '</td>' +
        '<td class="center">' + (item.so_tiet || 0) + '</td>' +
        '<td class="center">' + (item.tong_phieu || 0) + '</td>' +
        '<td class="center">' + (item.diem_ktcm ? item.diem_ktcm.toFixed(2) : '') + '</td>' +
        '<td class="center">' + (item.diem_knsp ? item.diem_knsp.toFixed(2) : '') + '</td>' +
        '<td class="center">' + (item.diem_tdtp ? item.diem_tdtp.toFixed(2) : '') + '</td>' +
        '<td class="center badge">' + (item.diem_tb ? item.diem_tb.toFixed(2) : '') + '</td>' +
        '<td>' + (item.cbql || '') + '</td>' +
      '</tr>';
    });

    tableHtml += '</tbody></table></body></html>';

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Bao_cao_danh_gia_giang_vien_2026.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (typeof showToast === 'function') {
      showToast('Đã xuất thành công báo cáo Excel Đánh giá Giảng viên!', 'success');
    }
  }

  // Live Sync for GV
  async function syncGvGoogleSheetData(url, options = {}) {
    if (!url) return;
    try {
      const response = await fetch(url, { cache: 'no-store', redirect: 'follow' });
      if (!response.ok) return;
      const csvText = await response.text();
      if (!csvText || csvText.length < 50) return;

      const parsedItems = parseGvCsvContent(csvText);
      if (Array.isArray(parsedItems) && parsedItems.length > 0) {
        allGvItems = parsedItems;
        normalizeAllModuleData();
        window.allGvItems = allGvItems;
        try {
          localStorage.setItem(STORAGE_KEY_GV_DATA, JSON.stringify(allGvItems));
        } catch (e) {}

        populateGvFilterDropdowns();
        if (activeView === 'gv') applyGvFilters();

        if (!options.silent && typeof showToast === 'function') {
          showToast('Đã đồng bộ ' + allGvItems.length + ' bản ghi Đánh giá Giảng viên từ Google Sheets!', 'success');
        }
      }
    } catch (e) {
      console.warn('Sync GV Sheet error:', e);
    }
  }

  function parseGvCsvContent(csvText) {
    if (!csvText || csvText.trim().startsWith('<')) return null;
    const rows = parseCsvToRows(csvText);
    if (!rows || rows.length < 2) return null;

    const headerRow = rows[0].map(h => (h || '').trim().toLowerCase());
    if (!headerRow.some(h => h.includes('giảng viên')) || !headerRow.some(h => h.includes('mã lớp'))) {
      return null;
    }

    const validRows = rows.slice(1).filter(r => r[1] && r[1].trim().length > 0 && r[12] && r[12].trim().length > 0);
    if (validRows.length === 0) return null;

    // Check class formats
    const classFormats = new Map();
    validRows.forEach(r => {
      const ml = (r[1] || '').trim();
      const fmt = (r[2] || '').trim();
      if (!classFormats.has(ml)) classFormats.set(ml, new Set());
      if (fmt) classFormats.get(ml).add(fmt);
    });

    const items = [];
    validRows.forEach((r, idx) => {
      const chuongTrinh = (r[0] || '').trim();
      const maLop = (r[1] || '').trim();
      let hinhThucHoc = (r[2] || '').trim();
      const ngayBd = (r[3] || '').trim();
      const ngayKt = (r[4] || '').trim();
      const maGv = (r[5] || '').trim();
      const nguonGv = (r[6] || '').trim() || 'Mời ngoài';
      const doiTuongGv = (r[7] || '').trim();
      const donVi = (r[8] || '').trim();
      const chucDanh = (r[9] || '').trim();
      const phongBan = (r[10] || '').trim();
      const hocHamHocVi = (r[11] || '').trim();
      const tenGv = (r[12] || '').trim();
      const noiDungGiang = (r[13] || '').trim();
      const soTiet = Number(r[14]) || 0;

      const formatsForClass = classFormats.get(maLop);
      if (formatsForClass && formatsForClass.has('Trực tiếp') && formatsForClass.has('Trực tuyến') && hinhThucHoc === 'Trực tuyến') {
        hinhThucHoc = 'Trực tiếp kết hợp Trực tuyến';
      }

      // KTCM
      const c5_ktcm = Number(r[15]) || 0;
      const c4_ktcm = Number(r[16]) || 0;
      const c3_ktcm = Number(r[17]) || 0;
      const c2_ktcm = Number(r[18]) || 0;
      const c1_ktcm = Number(r[19]) || 0;
      const tong_phieu_ktcm = c5_ktcm + c4_ktcm + c3_ktcm + c2_ktcm + c1_ktcm;
      const diem_ktcm = tong_phieu_ktcm > 0 ? (5 * c5_ktcm + 4 * c4_ktcm + 3 * c3_ktcm + 2 * c2_ktcm + 1 * c1_ktcm) / tong_phieu_ktcm : 0;
      const ty_le_tich_cuc_ktcm = tong_phieu_ktcm > 0 ? ((c5_ktcm + c4_ktcm) / tong_phieu_ktcm) * 100 : 0;

      // KNSP
      const c5_knsp = Number(r[20]) || 0;
      const c4_knsp = Number(r[21]) || 0;
      const c3_knsp = Number(r[22]) || 0;
      const c2_knsp = Number(r[23]) || 0;
      const c1_knsp = Number(r[24]) || 0;
      const tong_phieu_knsp = c5_knsp + c4_knsp + c3_knsp + c2_knsp + c1_knsp;
      const diem_knsp = tong_phieu_knsp > 0 ? (5 * c5_knsp + 4 * c4_knsp + 3 * c3_knsp + 2 * c2_knsp + 1 * c1_knsp) / tong_phieu_knsp : 0;
      const ty_le_tich_cuc_knsp = tong_phieu_knsp > 0 ? ((c5_knsp + c4_knsp) / tong_phieu_knsp) * 100 : 0;

      // TDTP
      const c5_tdtp = Number(r[25]) || 0;
      const c4_tdtp = Number(r[26]) || 0;
      const c3_tdtp = Number(r[27]) || 0;
      const c2_tdtp = Number(r[28]) || 0;
      const c1_tdtp = Number(r[29]) || 0;
      const tong_phieu_tdtp = c5_tdtp + c4_tdtp + c3_tdtp + c2_tdtp + c1_tdtp;
      const diem_tdtp = tong_phieu_tdtp > 0 ? (5 * c5_tdtp + 4 * c4_tdtp + 3 * c3_tdtp + 2 * c2_tdtp + 1 * c1_tdtp) / tong_phieu_tdtp : 0;
      const ty_le_tich_cuc_tdtp = tong_phieu_tdtp > 0 ? ((c5_tdtp + c4_tdtp) / tong_phieu_tdtp) * 100 : 0;

      const cbql = (r[30] || '').trim();

      const tong_phieu = Math.max(tong_phieu_ktcm, tong_phieu_knsp, tong_phieu_tdtp);
      let diem_tb = 0;
      let validCritCount = 0;
      if (tong_phieu_ktcm > 0) { diem_tb += diem_ktcm; validCritCount++; }
      if (tong_phieu_knsp > 0) { diem_tb += diem_knsp; validCritCount++; }
      if (tong_phieu_tdtp > 0) { diem_tb += diem_tdtp; validCritCount++; }
      diem_tb = validCritCount > 0 ? diem_tb / validCritCount : 0;

      let ty_le_tich_cuc_tb = validCritCount > 0 ? (ty_le_tich_cuc_ktcm + ty_le_tich_cuc_knsp + ty_le_tich_cuc_tdtp) / validCritCount : 0;

      let tenCtFull = chuongTrinh;
      if (typeof allNddtItems !== 'undefined') {
        const f = allNddtItems.find(x => x.ma_lop === maLop || x.chuong_trinh === chuongTrinh);
        if (f && f.ten_ct_full && f.ten_ct_full !== f.chuong_trinh) tenCtFull = f.ten_ct_full;
      }
      if (tenCtFull === chuongTrinh && typeof allPphtdtItems !== 'undefined') {
        const f = allPphtdtItems.find(x => x.ma_lop === maLop || x.chuong_trinh === chuongTrinh);
        if (f && f.ten_ct_full && f.ten_ct_full !== f.chuong_trinh) tenCtFull = f.ten_ct_full;
      }
      if (tenCtFull === chuongTrinh && typeof RAW_GV_DATA !== 'undefined') {
        const f = RAW_GV_DATA.find(x => x.ma_lop === maLop || x.chuong_trinh === chuongTrinh);
        if (f && f.ten_ct_full && f.ten_ct_full !== f.chuong_trinh) tenCtFull = f.ten_ct_full;
      }

      items.push({
        id: idx + 1,
        chuong_trinh: chuongTrinh,
        ten_ct_full: tenCtFull,
        ma_lop: maLop,
        hinh_thuc_hoc: hinhThucHoc,
        ngay_bd: ngayBd,
        ngay_kt: ngayKt,
        ma_gv: maGv,
        nguon_gv: nguonGv,
        doi_tuong_gv: doiTuongGv,
        don_vi: donVi,
        chuc_danh: chucDanh,
        phong_ban: phongBan,
        hoc_ham_hoc_vi: hocHamHocVi,
        ten_gv: tenGv,
        noi_dung_giang: noiDungGiang,
        so_tiet: soTiet,
        c5_ktcm, c4_ktcm, c3_ktcm, c2_ktcm, c1_ktcm, tong_phieu_ktcm,
        diem_ktcm: Number(diem_ktcm.toFixed(2)),
        ty_le_tich_cuc_ktcm: Number(ty_le_tich_cuc_ktcm.toFixed(1)),
        c5_knsp, c4_knsp, c3_knsp, c2_knsp, c1_knsp, tong_phieu_knsp,
        diem_knsp: Number(diem_knsp.toFixed(2)),
        ty_le_tich_cuc_knsp: Number(ty_le_tich_cuc_knsp.toFixed(1)),
        c5_tdtp, c4_tdtp, c3_tdtp, c2_tdtp, c1_tdtp, tong_phieu_tdtp,
        diem_tdtp: Number(diem_tdtp.toFixed(2)),
        ty_le_tich_cuc_tdtp: Number(ty_le_tich_cuc_tdtp.toFixed(1)),
        tong_phieu,
        diem_tb: Number(diem_tb.toFixed(2)),
        ty_le_tich_cuc_tb: Number(ty_le_tich_cuc_tb.toFixed(1)),
        cbql
      });
    });

    return items;
  }
  // End of GV Module


  function closeSheetUrlModal() {
    window.closeSheetModal();
  }
});


  
/**
 * MOBILE-FIRST RESPONSIVE SYSTEM FOR AGRIBANK SMART TRAINING DASHBOARD
 * Modules supported: All 7 modules + General Report (Class, Program, Time)
 * Constraints: Zero horizontal page overflow, preserves all Desktop calculations & exports.
 */
(function () {
  'use strict';

  const MOBILE_BP = 768;
  const DRAWER_BP = 900;
  const STORAGE_COLS_PREFIX = 'agribank_mob_cols_v1_';

  const MODULE_META = {
    screenClassStatus: {
      title: 'Tình hình lớp học',
      filterTitle: 'Bộ lọc Tình hình lớp học',
      filterPanel: '#screenClassStatus > .slicer-card',
      dateApplyBtn: '#btnApplyCustomDate',
      defaultPreset: 'today',
      actions: []
    },
    screenContentEval: {
      title: 'Nội dung đào tạo',
      filterTitle: 'Bộ lọc Nội dung đào tạo',
      filterPanel: '#screenContentEval > .slicer-card',
      dateApplyBtn: '#btnApplyNddtDate',
      resetBtn: '#btnResetNddtFilters',
      actions: [
        { id: '#btnExportNddtExcel', label: 'Excel', icon: 'fa-solid fa-file-excel', cls: 'excel' },
        { id: '#btnExportNddtCsv', label: 'CSV', icon: 'fa-solid fa-file-csv', cls: 'csv' }
      ]
    },
    screenPphtdt: {
      title: 'Phương pháp & Hình thức',
      filterTitle: 'Bộ lọc Phương pháp & Hình thức',
      filterPanel: '#screenPphtdt > .slicer-card',
      dateApplyBtn: '#btnApplyPphtdtDate',
      resetBtn: '#btnResetPphtdtFilters',
      actions: [
        { id: '#btnExportPphtdtExcel', label: 'Excel', icon: 'fa-solid fa-file-excel', cls: 'excel' },
        { id: '#btnExportPphtdtCsv', label: 'CSV', icon: 'fa-solid fa-file-csv', cls: 'csv' }
      ]
    },
    screenCsvc: {
      title: 'Tổ chức & CSVC',
      filterTitle: 'Bộ lọc Tổ chức & CSVC',
      filterPanel: '#screenCsvc > .slicer-card',
      dateApplyBtn: '#btnApplyCsvcDate',
      resetBtn: '#btnResetCsvcFilters',
      actions: [
        { id: '#btnExportCsvcExcel', label: 'Excel', icon: 'fa-solid fa-file-excel', cls: 'excel' },
        { id: '#btnExportCsvcCsv', label: 'CSV', icon: 'fa-solid fa-file-csv', cls: 'csv' }
      ]
    },
    screenGv: {
      title: 'Đánh giá Giảng viên',
      filterTitle: 'Bộ lọc Đánh giá Giảng viên',
      filterPanel: '#screenGv > .slicer-card',
      dateApplyBtn: '#btnApplyGvDate',
      resetBtn: '#btnResetGvFilter',
      actions: [
        { id: '#btnExportGvExcel', label: 'Excel', icon: 'fa-solid fa-file-excel', cls: 'excel' },
        { id: '#btnExportGvCsv', label: 'CSV', icon: 'fa-solid fa-file-csv', cls: 'csv' }
      ]
    },
    screenDgc: {
      title: 'Đánh giá chung',
      filterTitle: 'Bộ lọc Đánh giá chung',
      filterPanel: '#screenDgc > .filter-panel',
      dateApplyBtn: '#btnApplyDgcDate',
      resetBtn: '#btnResetDgcFilter',
      actions: [
        { id: '#btnExportDgcExcel', label: 'Excel', icon: 'fa-solid fa-file-excel', cls: 'excel' },
        { id: '#btnExportDgcCsv', label: 'CSV', icon: 'fa-solid fa-file-csv', cls: 'csv' }
      ]
    },
    screenGeneralReport: {
      title: 'Báo cáo chung',
      filterTitle: 'Bộ lọc Báo cáo chung',
      filterPanel: null, // Dynamic per mode (Class / Program / Time)
      actions: [] // Top action buttons already visible right above on Report screen
    }
  };

  const state = {
    activeScreen: 'screenClassStatus',
    sheetOpen: false,
    sheetScreenId: null,
    sheetPanelEl: null,
    sheetPlaceholder: null,
    sheetSnapshot: null,
    colSheetTableId: null,
    tableState: new Map(), // tableId -> { mode: 'cards'|'table', page, pageSize, search, sortIdx, sortDir, hiddenCols: Set }
    filterPlaceholders: new Map(), // key -> { panelEl, placeholderEl, barEl }
    tableObservers: new Map(),
    resizeTimer: null
  };

  function isMobile() {
    return window.innerWidth < MOBILE_BP;
  }

  function stripVN(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  function getActiveScreenId() {
    const activeEl = document.querySelector('.screen-content.active');
    if (activeEl && activeEl.id) return activeEl.id;
    const activeTab = document.querySelector('.screen-tab.active');
    return (activeTab && activeTab.dataset.screen) || 'screenClassStatus';
  }

  function getActiveReportMode() {
    if (document.getElementById('btnReportModeTime')?.classList.contains('active')) return 'time';
    if (document.getElementById('btnReportModeProgram')?.classList.contains('active')) return 'program';
    return 'class';
  }

  function getActiveFilterConfig(screenId) {
    const base = MODULE_META[screenId] || MODULE_META.screenClassStatus;
    if (screenId !== 'screenGeneralReport') return { ...base, key: screenId };

    const mode = getActiveReportMode();
    if (mode === 'time') {
      return {
        ...base,
        key: 'screenGeneralReport_time',
        filterTitle: 'Bộ lọc Báo cáo theo Thời gian',
        filterPanel: '#reportTimeSelectorArea',
        dateApplyBtn: '#btnApplyTimeDateRange',
        resetBtn: '#btnResetTimeFilters',
        applyBtn: '#btnApplyTimeReport'
      };
    }
    if (mode === 'program') {
      return {
        ...base,
        key: 'screenGeneralReport_program',
        filterTitle: 'Chọn & Lọc Chương trình đào tạo',
        filterPanel: '#reportProgramSelectorArea'
      };
    }
    return {
      ...base,
      key: 'screenGeneralReport_class',
      filterTitle: 'Chọn & Lọc Lớp học',
      filterPanel: '#reportClassSelectorArea'
    };
  }

  // =========================================================================
  // 1. MOBILE NAVIGATION DRAWER
  // =========================================================================
  function openNavDrawer() {
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const btn = document.getElementById('btnMobileMenuOpen');
    if (!drawer || !backdrop) return;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    syncDrawerActiveState(getActiveScreenId());
  }

  function closeNavDrawer() {
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const btn = document.getElementById('btnMobileMenuOpen');
    if (!drawer || !backdrop) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function syncDrawerActiveState(screenId) {
    state.activeScreen = screenId || getActiveScreenId();
    const meta = MODULE_META[state.activeScreen];
    const headerLabel = document.getElementById('mobileHeaderModuleLabel');
    if (headerLabel && meta) headerLabel.textContent = meta.title;

    document.querySelectorAll('#mobileDrawerNavList .mobile-drawer-item').forEach((item) => {
      const match = item.dataset.screen === state.activeScreen;
      item.classList.toggle('active', match);
    });
  }

  function initNavigationDrawer() {
    document.getElementById('btnMobileMenuOpen')?.addEventListener('click', openNavDrawer);
    document.getElementById('btnMobileMenuClose')?.addEventListener('click', closeNavDrawer);
    document.getElementById('mobileNavBackdrop')?.addEventListener('click', closeNavDrawer);

    document.querySelectorAll('#mobileDrawerNavList .mobile-drawer-item').forEach((item) => {
      item.addEventListener('click', () => {
        const target = item.dataset.screen;
        closeNavDrawer();
        if (target && typeof window.switchScreen === 'function') {
          window.switchScreen(target);
        }
      });
    });

    document.getElementById('btnMobileDrawerSync')?.addEventListener('click', () => {
      closeNavDrawer();
      document.getElementById('btnSyncNow')?.click();
    });

    // Mirror sync status badge to drawer footer
    const syncTextEl = document.getElementById('syncStatusText');
    const drawerStatusEl = document.getElementById('mobileDrawerSyncStatus');
    if (syncTextEl && drawerStatusEl) {
      const mirror = () => {
        const span = drawerStatusEl.querySelector('span:last-child');
        if (span) span.textContent = syncTextEl.textContent || 'Sẵn sàng';
      };
      mirror();
      new MutationObserver(mirror).observe(syncTextEl, { childList: true, characterData: true, subtree: true });
    }

    // Wrap window.switchScreen once it exists
    const wrapSwitch = () => {
      if (typeof window.switchScreen === 'function' && !window.switchScreen._mobWrapped) {
        const orig = window.switchScreen;
        const wrapped = function (targetId) {
          const res = orig.apply(this, arguments);
          syncDrawerActiveState(targetId);
          setTimeout(() => {
            syncMobileFilterBars();
            adaptChartsForViewport();
            enhanceAllTables();
            if (targetId === 'screenGeneralReport') updateReportQuickNav();
          }, 80);
          return res;
        };
        wrapped._mobWrapped = true;
        window.switchScreen = wrapped;
      }
    };
    wrapSwitch();
    setTimeout(wrapSwitch, 300);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeNavDrawer();
        if (state.sheetOpen) closeFilterSheet(false);
        closeColSelectorSheet();
      }
    });

    syncDrawerActiveState(getActiveScreenId());
  }

  // =========================================================================
  // 2. MOBILE FILTER BOTTOM SHEET & ACTIVE SUMMARY CHIPS
  // =========================================================================
  function countPanelActiveFilters(panelEl, cfg) {
    if (!panelEl) return { count: 0, chips: [] };
    const chips = [];
    let count = 0;

    // Date range inputs
    const dateInputs = Array.from(panelEl.querySelectorAll('input[type="date"]'));
    if (dateInputs.length >= 2) {
      const start = dateInputs[0].value;
      const end = dateInputs[1].value;
      const activePill = panelEl.querySelector('.preset-pills .pill.active, .preset-group .btn.active');
      if (activePill && activePill.dataset.preset !== 'all' && activePill.dataset.dgcPreset !== 'all') {
        count++;
        chips.push(activePill.textContent.trim());
      } else if (start || end) {
        const isDefaultYear = start === '2026-01-01' && end === '2026-12-31' && (!activePill || activePill.dataset.preset === 'all');
        if (!isDefaultYear && (start || end)) {
          count++;
          chips.push((start || '...') + ' → ' + (end || '...'));
        }
      }
    }

    // Time report active granularity + year + period
    if (cfg && cfg.key === 'screenGeneralReport_time') {
      const yearVal = document.getElementById('selectTimeYear')?.value;
      const periodText = document.getElementById('selectTimePeriod')?.selectedOptions?.[0]?.textContent?.trim();
      if (yearVal) chips.push('Năm ' + yearVal);
      if (periodText) {
        count++;
        chips.push(periodText);
      }
    }

    // Select elements
    panelEl.querySelectorAll('select').forEach((sel) => {
      if (sel.id === 'selectTimeYear' || sel.id === 'selectTimePeriod') return;
      const val = (sel.value || '').trim();
      if (!val || val === 'all' || val === 'Tất cả') return;
      count++;
      const optText = sel.selectedOptions?.[0]?.textContent?.trim() || val;
      chips.push(optText.length > 26 ? optText.slice(0, 24) + '…' : optText);
    });

    // Search text inputs
    panelEl.querySelectorAll('input[type="text"], input[type="search"]').forEach((inp) => {
      if (inp.classList.contains('mob-select-search-input')) return;
      const val = (inp.value || '').trim();
      if (val) {
        count++;
        chips.push('"' + (val.length > 18 ? val.slice(0, 16) + '…' : val) + '"');
      }
    });

    return { count, chips };
  }

  function ensureMobileFilterHost(cfg) {
    if (!cfg || !cfg.filterPanel) return null;
    const panelEl = document.querySelector(cfg.filterPanel);
    if (!panelEl || !panelEl.parentNode) return null;

    if (!state.filterPlaceholders.has(cfg.key)) {
      const placeholder = document.createComment('mob-filter-placeholder:' + cfg.key);
      const bar = document.createElement('div');
      bar.className = 'mob-filter-bar';
      bar.dataset.filterKey = cfg.key;

      panelEl.parentNode.insertBefore(bar, panelEl);
      panelEl.parentNode.insertBefore(placeholder, panelEl);
      panelEl.classList.add('mob-filter-hosted');

      state.filterPlaceholders.set(cfg.key, {
        cfg,
        panelEl,
        placeholderEl: placeholder,
        barEl: bar
      });

      // Keep summary bar in sync whenever user changes filters anywhere
      const refreshDebounced = () => setTimeout(() => renderMobileFilterBar(cfg.key), 40);
      panelEl.addEventListener('change', refreshDebounced, true);
      panelEl.addEventListener('input', refreshDebounced, true);
      panelEl.addEventListener('click', (e) => {
        if (e.target.closest('.pill, button')) refreshDebounced();
      }, true);
    }

    return state.filterPlaceholders.get(cfg.key);
  }

  function renderMobileFilterBar(key) {
    const entry = state.filterPlaceholders.get(key);
    if (!entry) return;
    const { cfg, panelEl, barEl } = entry;

    // For Screen 7 selector areas that depend on active mode, hide inactive mode's mob bar
    if (cfg.key.startsWith('screenGeneralReport_')) {
      const mode = getActiveReportMode();
      const expectedKey = 'screenGeneralReport_' + mode;
      if (key !== expectedKey) {
        barEl.style.setProperty('display', 'none', 'important');
        return;
      } else {
        barEl.style.removeProperty('display');
      }
    }

    const { count, chips } = countPanelActiveFilters(panelEl, cfg);

    let extraTopHtml = '';
    if (cfg.key === 'screenGeneralReport_time') {
      const isMonth = document.getElementById('btnTimeGranMonth')?.classList.contains('active');
      const isQuarter = document.getElementById('btnTimeGranQuarter')?.classList.contains('active');
      const isYear = document.getElementById('btnTimeGranYear')?.classList.contains('active');
      extraTopHtml = `
        <div class="mob-time-quick-seg" role="group" aria-label="Cấp độ báo cáo thời gian">
          <button type="button" class="mob-time-quick-btn ${isMonth ? 'active' : ''}" data-gran-btn="btnTimeGranMonth">Tháng</button>
          <button type="button" class="mob-time-quick-btn ${isQuarter ? 'active' : ''}" data-gran-btn="btnTimeGranQuarter">Quý</button>
          <button type="button" class="mob-time-quick-btn ${isYear ? 'active' : ''}" data-gran-btn="btnTimeGranYear">Năm</button>
        </div>
      `;
    }

    const actionsHtml = (cfg.actions || []).map((a) => `
      <button type="button" class="mob-filter-mini-btn" data-proxy-click="${a.id}" title="${a.label}">
        <i class="${a.icon}"></i> <span>${a.label}</span>
      </button>
    `).join('');

    const chipsHtml = chips.length
      ? chips.slice(0, 4).map((c) => `<span class="mob-filter-chip has-filter">${escapeHtml(c)}</span>`).join('') +
        (chips.length > 4 ? `<span class="mob-filter-chip">+${chips.length - 4} khác</span>` : '')
      : `<span class="mob-filter-chip">Mặc định / Tất cả dữ liệu</span>`;

    const triggerLabel = cfg.key.startsWith('screenGeneralReport_') && !cfg.key.endsWith('time')
      ? 'CHỌN & LỌC'
      : 'BỘ LỌC';

    barEl.innerHTML = `
      ${extraTopHtml}
      <div class="mob-filter-bar-top">
        <button type="button" class="mob-filter-trigger-btn" data-open-filter="${cfg.key}">
          <i class="fa-solid fa-sliders"></i>
          <span>${triggerLabel}</span>
          <span class="mob-filter-badge ${count === 0 ? 'is-zero' : ''}">${count}</span>
        </button>
        <div class="mob-filter-actions-row">
          ${actionsHtml}
        </div>
      </div>
      <div class="mob-filter-chips">${chipsHtml}</div>
    `;

    barEl.querySelectorAll('[data-open-filter]').forEach((btn) => {
      btn.addEventListener('click', () => openFilterSheet(btn.dataset.openFilter));
    });

    barEl.querySelectorAll('[data-proxy-click]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetBtn = document.querySelector(btn.dataset.proxyClick);
        if (targetBtn) targetBtn.click();
      });
    });

    barEl.querySelectorAll('[data-gran-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const realBtn = document.getElementById(btn.dataset.granBtn);
        if (realBtn) realBtn.click();
        setTimeout(() => {
          renderMobileFilterBar(key);
          adaptChartsForViewport();
          enhanceAllTables();
        }, 80);
      });
    });
  }

  function injectSearchableSelectHelpers(panelEl) {
    panelEl.querySelectorAll('select').forEach((sel) => {
      if (sel.options.length < 10) return;
      if (sel.previousElementSibling?.classList.contains('mob-select-search-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'mob-select-search-wrap';
      wrap.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i><input type="text" class="mob-select-search-input" placeholder="Tìm nhanh trong danh sách...">';
      sel.parentNode.insertBefore(wrap, sel);

      const input = wrap.querySelector('input');
      input.addEventListener('input', () => {
        const q = stripVN(input.value);
        Array.from(sel.options).forEach((opt, idx) => {
          if (idx === 0 && !opt.value) {
            opt.hidden = false;
            return;
          }
          const matched = !q || stripVN(opt.textContent).includes(q) || stripVN(opt.value).includes(q);
          opt.hidden = !matched;
        });
      });
    });
  }

  function removeSearchableSelectHelpers(panelEl) {
    if (!panelEl) return;
    panelEl.querySelectorAll('.mob-select-search-wrap').forEach((w) => w.remove());
    panelEl.querySelectorAll('select option[hidden]').forEach((opt) => { opt.hidden = false; });
  }

  function capturePanelSnapshot(panelEl) {
    const snap = { values: [], activePillIdx: -1, activeDgcIdx: -1, activeGranId: null };
    panelEl.querySelectorAll('input, select').forEach((el, idx) => {
      if (el.classList.contains('mob-select-search-input')) return;
      snap.values.push({ el, idx, value: el.type === 'checkbox' ? el.checked : el.value });
    });
    const pills = Array.from(panelEl.querySelectorAll('.preset-pills .pill'));
    snap.activePillIdx = pills.findIndex((p) => p.classList.contains('active'));
    const dgcBtns = Array.from(panelEl.querySelectorAll('.dgc-preset-btn'));
    snap.activeDgcIdx = dgcBtns.findIndex((b) => b.classList.contains('active'));
    const granBtn = panelEl.querySelector('[id^="btnTimeGran"].active');
    snap.activeGranId = granBtn ? granBtn.id : null;
    return snap;
  }

  function restorePanelSnapshot(panelEl, snap) {
    if (!panelEl || !snap) return;
    if (snap.activePillIdx >= 0) {
      const pills = Array.from(panelEl.querySelectorAll('.preset-pills .pill'));
      if (pills[snap.activePillIdx] && !pills[snap.activePillIdx].classList.contains('active')) {
        pills[snap.activePillIdx].click();
      }
    }
    if (snap.activeDgcIdx >= 0) {
      const btns = Array.from(panelEl.querySelectorAll('.dgc-preset-btn'));
      if (btns[snap.activeDgcIdx] && !btns[snap.activeDgcIdx].classList.contains('active')) {
        btns[snap.activeDgcIdx].click();
      }
    }
    if (snap.activeGranId) {
      const gb = document.getElementById(snap.activeGranId);
      if (gb && !gb.classList.contains('active')) gb.click();
    }
    snap.values.forEach((item) => {
      const el = item.el;
      if (!el) return;
      const cur = el.type === 'checkbox' ? el.checked : el.value;
      if (cur !== item.value) {
        if (el.type === 'checkbox') el.checked = item.value;
        else el.value = item.value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  function openFilterSheet(key) {
    const entry = state.filterPlaceholders.get(key);
    if (!entry) return;
    const { cfg, panelEl, placeholderEl } = entry;

    const overlay = document.getElementById('mobileFilterSheetOverlay');
    const body = document.getElementById('mobileFilterSheetBody');
    const titleEl = document.getElementById('mobileFilterSheetTitle');
    if (!overlay || !body) return;

    state.sheetOpen = true;
    state.sheetScreenId = key;
    state.sheetPanelEl = panelEl;
    state.sheetPlaceholder = placeholderEl;
    state.sheetSnapshot = capturePanelSnapshot(panelEl);

    if (titleEl) titleEl.textContent = cfg.filterTitle || 'BỘ LỌC DỮ LIỆU';

    panelEl.classList.add('mob-in-sheet');
    if (panelEl.style.display === 'none') {
      panelEl.dataset.mobPrevDisplay = 'none';
      panelEl.style.display = 'block';
    }
    // Ensure Screen 1 secondaryFiltersPanel is expanded in sheet
    const secPanel = panelEl.querySelector('#secondaryFiltersPanel');
    if (secPanel) secPanel.classList.add('show');

    body.innerHTML = '';
    body.appendChild(panelEl);
    injectSearchableSelectHelpers(panelEl);

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeFilterSheet(applyChanges) {
    if (!state.sheetOpen) return;
    const overlay = document.getElementById('mobileFilterSheetOverlay');
    const entry = state.filterPlaceholders.get(state.sheetScreenId);
    const panelEl = state.sheetPanelEl;
    const placeholderEl = state.sheetPlaceholder;

    if (panelEl) {
      if (!applyChanges && state.sheetSnapshot) {
        restorePanelSnapshot(panelEl, state.sheetSnapshot);
      } else if (applyChanges && entry) {
        const cfg = entry.cfg;
        // If custom dates changed while user didn't tap inline apply button, click applyBtn
        if (cfg.dateApplyBtn) {
          const dateInputs = Array.from(panelEl.querySelectorAll('input[type="date"]'));
          const prevSnap = state.sheetSnapshot?.values || [];
          const dateChanged = dateInputs.some((di) => {
            const old = prevSnap.find((v) => v.el === di);
            return old && old.value !== di.value;
          });
          if (dateChanged) document.querySelector(cfg.dateApplyBtn)?.click();
        }
        if (cfg.applyBtn) {
          document.querySelector(cfg.applyBtn)?.click();
        }
      }

      removeSearchableSelectHelpers(panelEl);
      panelEl.classList.remove('mob-in-sheet');
      if (panelEl.dataset.mobPrevDisplay === 'none') {
        panelEl.style.display = 'none';
        delete panelEl.dataset.mobPrevDisplay;
      }

      if (placeholderEl && placeholderEl.parentNode) {
        placeholderEl.parentNode.insertBefore(panelEl, placeholderEl.nextSibling);
      }
    }

    if (overlay) {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    }

    const closedKey = state.sheetScreenId;
    state.sheetOpen = false;
    state.sheetScreenId = null;
    state.sheetPanelEl = null;
    state.sheetPlaceholder = null;
    state.sheetSnapshot = null;

    if (closedKey) renderMobileFilterBar(closedKey);
    setTimeout(() => {
      adaptChartsForViewport();
      enhanceAllTables();
    }, 80);
  }

  function resetActiveSheetFilters() {
    if (!state.sheetOpen || !state.sheetScreenId) return;
    const entry = state.filterPlaceholders.get(state.sheetScreenId);
    if (!entry) return;
    const { cfg, panelEl } = entry;

    if (cfg.resetBtn) {
      const rb = document.querySelector(cfg.resetBtn);
      if (rb) rb.click();
    } else {
      // Fallback reset (e.g. Screen 1 / Program selector / Class selector)
      panelEl.querySelectorAll('select').forEach((sel) => {
        if (sel.selectedIndex > 0) {
          sel.selectedIndex = 0;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      panelEl.querySelectorAll('input[type="text"], input[type="search"]').forEach((inp) => {
        if (inp.classList.contains('mob-select-search-input')) return;
        if (inp.value) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      const defaultPill = panelEl.querySelector('.preset-pills .pill[data-preset="all"]') ||
        panelEl.querySelector('.preset-pills .pill:first-child');
      if (defaultPill) defaultPill.click();
    }
    // Update snapshot so closing via Apply doesn't re-trigger old dates
    state.sheetSnapshot = capturePanelSnapshot(panelEl);
    renderMobileFilterBar(state.sheetScreenId);
  }

  function syncMobileFilterBars() {
    if (!isMobile() && state.sheetOpen) {
      closeFilterSheet(true);
    }

    Object.keys(MODULE_META).forEach((screenId) => {
      if (screenId === 'screenGeneralReport') {
        ['class', 'program', 'time'].forEach((m) => {
          const fakeCfg = {
            ...MODULE_META.screenGeneralReport,
            key: 'screenGeneralReport_' + m,
            filterPanel: m === 'time' ? '#reportTimeSelectorArea' : (m === 'program' ? '#reportProgramSelectorArea' : '#reportClassSelectorArea'),
            filterTitle: m === 'time' ? 'Bộ lọc Báo cáo theo Thời gian' : (m === 'program' ? 'Chọn & Lọc Chương trình đào tạo' : 'Chọn & Lọc Lớp học'),
            dateApplyBtn: m === 'time' ? '#btnApplyTimeDateRange' : undefined,
            resetBtn: m === 'time' ? '#btnResetTimeFilters' : undefined,
            applyBtn: m === 'time' ? '#btnApplyTimeReport' : undefined
          };
          const entry = ensureMobileFilterHost(fakeCfg);
          if (entry) renderMobileFilterBar(fakeCfg.key);
        });
      } else {
        const cfg = getActiveFilterConfig(screenId);
        const entry = ensureMobileFilterHost(cfg);
        if (entry) renderMobileFilterBar(cfg.key);
      }
    });
  }

  function initFilterSheetSystem() {
    document.getElementById('btnMobileFilterSheetClose')?.addEventListener('click', () => closeFilterSheet(false));
    document.getElementById('btnMobileFilterApply')?.addEventListener('click', () => closeFilterSheet(true));
    document.getElementById('btnMobileFilterReset')?.addEventListener('click', resetActiveSheetFilters);
    document.getElementById('mobileFilterSheetOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'mobileFilterSheetOverlay') closeFilterSheet(false);
    });

    // Listen to Report mode buttons so active filter bar switches instantaneously
    ['btnReportModeClass', 'btnReportModeProgram', 'btnReportModeTime'].forEach((id) => {
      document.getElementById(id)?.addEventListener('click', () => {
        setTimeout(() => {
          syncMobileFilterBars();
          updateReportQuickNav();
          adaptChartsForViewport();
          enhanceAllTables();
        }, 60);
      });
    });

    syncMobileFilterBars();
  }

  // =========================================================================
  // 3. REPORT QUICK-JUMP SUBNAV ON MOBILE
  // =========================================================================
  function updateReportQuickNav() {
    const host = document.getElementById('screenGeneralReport');
    if (!host) return;
    let nav = document.getElementById('mobReportQuickNav');
    if (!nav) {
      nav = document.createElement('div');
      nav.id = 'mobReportQuickNav';
      nav.className = 'mob-report-quicknav no-print';
      const contentArea = document.getElementById('reportContentArea');
      if (contentArea && contentArea.parentNode) {
        contentArea.parentNode.insertBefore(nav, contentArea);
      } else {
        host.appendChild(nav);
      }
    }

    const mode = getActiveReportMode();
    let targets = [];
    if (mode === 'time') {
      targets = [
        { id: 'reportTimeOverviewCard', label: 'Tổng quan & KPI' },
        { id: 'timeVolumeTrendChart', label: 'Quy mô & Hình thức' },
        { id: 'timeQualityTrendChart', label: 'Chất lượng 5 phân hệ' },
        { id: 'timeGvEvaluationCard', label: 'Giảng viên' },
        { id: 'timeLocationEvaluationCard', label: 'Địa điểm CSVC' },
        { id: 'reportTimeSummaryTable', label: 'Bảng tổng hợp kỳ' },
        { id: 'reportTimeProgramsTable', label: 'Chương trình & Lớp' }
      ];
    } else {
      const prefix = mode === 'program' ? 'reportProgramContentArea' : 'reportClassContentArea';
      targets = [
        { id: prefix, label: 'Tổng quan' },
        { id: 'reportNddtSection', label: 'I. Nội dung' },
        { id: 'reportPphtSection', label: 'II. PP & HT' },
        { id: 'reportCsvcSection', label: 'III. Tổ chức & CSVC' },
        { id: 'reportGvSection', label: 'IV. Giảng viên' },
        { id: 'reportDgcSection', label: 'V. Đánh giá chung' }
      ];
    }

    nav.innerHTML = targets
      .map((t, i) => `<button type="button" class="mob-quicknav-pill ${i === 0 ? 'active' : ''}" data-scroll-target="${t.id}">${t.label}</button>`)
      .join('');

    nav.querySelectorAll('.mob-quicknav-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        nav.querySelectorAll('.mob-quicknav-pill').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.scrollTarget);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // =========================================================================
  // 4. RESPONSIVE KPI TAGS & LONG TEXT READ-MORE
  // =========================================================================
  function tagSpan2KpiCards() {
    document.querySelectorAll('.kpi-card-light').forEach((card) => {
      if (card.querySelector('.criteria-kpi-list')) {
        card.classList.add('kpi-card-span2-mobile');
      }
    });
  }

  function enhanceLongFeedbackComments() {
    if (!isMobile()) return;
    document.querySelectorAll('.report-comment-item, #dgcQualFeedbackList .feedback-item').forEach((item) => {
      if (item.dataset.mobReadmoreInit) return;
      const text = (item.textContent || '').trim();
      if (text.length < 155) return;
      item.dataset.mobReadmoreInit = '1';

      const cloneContent = document.createElement('div');
      cloneContent.className = 'mob-comment-text-clamped';
      cloneContent.style.display = '-webkit-box';
      cloneContent.style.webkitBoxOrient = 'vertical';
      cloneContent.style.webkitLineClamp = '3';
      cloneContent.style.overflow = 'hidden';
      while (item.firstChild) cloneContent.appendChild(item.firstChild);
      item.appendChild(cloneContent);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mob-readmore-btn';
      btn.innerHTML = 'Xem thêm <i class="fa-solid fa-chevron-down"></i>';
      let expanded = false;
      btn.addEventListener('click', () => {
        expanded = !expanded;
        cloneContent.style.display = expanded ? 'block' : '-webkit-box';
        cloneContent.style.webkitLineClamp = expanded ? 'unset' : '3';
        btn.innerHTML = expanded
          ? 'Thu gọn <i class="fa-solid fa-chevron-up"></i>'
          : 'Xem thêm <i class="fa-solid fa-chevron-down"></i>';
      });
      item.appendChild(btn);
    });
  }

  // =========================================================================
  // 5. RESPONSIVE CHARTS ADAPTATION
  // =========================================================================
  function adaptChartsForViewport() {
    if (typeof Chart === 'undefined') return;
    const mobile = isMobile();

    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((canvas) => {
      const chart = typeof Chart.getChart === 'function' ? Chart.getChart(canvas) : null;
      if (!chart || !chart.options) return;

      // Save pristine Desktop snapshot once
      if (!chart._mobDesktopSnap) {
        const leg = chart.options.plugins?.legend || {};
        const xTicks = chart.options.scales?.x?.ticks || {};
        const yTicks = chart.options.scales?.y?.ticks || {};
        const y1Ticks = chart.options.scales?.y1?.ticks || {};
        chart._mobDesktopSnap = {
          legendPos: leg.position || 'top',
          legendBoxWidth: leg.labels?.boxWidth,
          legendFontSize: leg.labels?.font?.size,
          legendPadding: leg.labels?.padding,
          xMaxTicks: xTicks.maxTicksLimit,
          xAutoSkip: xTicks.autoSkip,
          xMaxRot: xTicks.maxRotation,
          xFontSize: xTicks.font?.size,
          yFontSize: yTicks.font?.size,
          y1FontSize: y1Ticks.font?.size,
          tooltipConfine: chart.options.plugins?.tooltip?.confine
        };
      }

      const snap = chart._mobDesktopSnap;
      const inScrollOuter = Boolean(canvas.closest('.chart-scroll-outer'));

      if (mobile) {
        if (chart.options.plugins?.legend) {
          chart.options.plugins.legend.position = 'bottom';
          if (!chart.options.plugins.legend.labels) chart.options.plugins.legend.labels = {};
          chart.options.plugins.legend.labels.boxWidth = 10;
          chart.options.plugins.legend.labels.padding = 8;
          chart.options.plugins.legend.labels.font = {
            ...(chart.options.plugins.legend.labels.font || {}),
            size: 10
          };
        }
        if (chart.options.plugins?.tooltip) {
          chart.options.plugins.tooltip.confine = true;
        }
        if (chart.options.scales?.x) {
          const x = chart.options.scales.x;
          if (!x.ticks) x.ticks = {};
          x.ticks.font = { ...(x.ticks.font || {}), size: 10 };
          if (!inScrollOuter) {
            x.ticks.autoSkip = true;
            x.ticks.maxTicksLimit = 6;
            x.ticks.maxRotation = 35;
          }
        }
        if (chart.options.scales?.y?.ticks) {
          chart.options.scales.y.ticks.font = { ...(chart.options.scales.y.ticks.font || {}), size: 10 };
        }
        if (chart.options.scales?.y1?.ticks) {
          chart.options.scales.y1.ticks.font = { ...(chart.options.scales.y1.ticks.font || {}), size: 10 };
        }

        // Ensure scrollable inner chart width doesn't squish labels when > 5 categories
        if (inScrollOuter) {
          const scrollInner = canvas.closest('.chart-scroll-inner');
          const lblCount = (chart.data && Array.isArray(chart.data.labels)) ? chart.data.labels.length : 0;
          if (scrollInner && lblCount > 5) {
            const targetW = Math.max(scrollInner.parentElement?.clientWidth || 300, lblCount * 52);
            scrollInner.style.minWidth = targetW + 'px';
          }
        }
      } else {
        // Restore Desktop snapshot cleanly
        if (chart.options.plugins?.legend) {
          chart.options.plugins.legend.position = snap.legendPos;
          if (chart.options.plugins.legend.labels) {
            if (snap.legendBoxWidth !== undefined) chart.options.plugins.legend.labels.boxWidth = snap.legendBoxWidth;
            else delete chart.options.plugins.legend.labels.boxWidth;
            if (snap.legendPadding !== undefined) chart.options.plugins.legend.labels.padding = snap.legendPadding;
            else delete chart.options.plugins.legend.labels.padding;
            if (chart.options.plugins.legend.labels.font) {
              if (snap.legendFontSize !== undefined) chart.options.plugins.legend.labels.font.size = snap.legendFontSize;
              else delete chart.options.plugins.legend.labels.font.size;
            }
          }
        }
        if (chart.options.plugins?.tooltip) {
          if (snap.tooltipConfine !== undefined) chart.options.plugins.tooltip.confine = snap.tooltipConfine;
          else delete chart.options.plugins.tooltip.confine;
        }
        if (chart.options.scales?.x?.ticks) {
          const t = chart.options.scales.x.ticks;
          if (snap.xMaxTicks !== undefined) t.maxTicksLimit = snap.xMaxTicks;
          else delete t.maxTicksLimit;
          if (snap.xAutoSkip !== undefined) t.autoSkip = snap.xAutoSkip;
          else delete t.autoSkip;
          if (snap.xMaxRot !== undefined) t.maxRotation = snap.xMaxRot;
          else delete t.maxRotation;
          if (t.font) {
            if (snap.xFontSize !== undefined) t.font.size = snap.xFontSize;
            else delete t.font.size;
          }
        }
        if (chart.options.scales?.y?.ticks?.font && snap.yFontSize !== undefined) {
          chart.options.scales.y.ticks.font.size = snap.yFontSize;
        }
        if (chart.options.scales?.y1?.ticks?.font && snap.y1FontSize !== undefined) {
          chart.options.scales.y1.ticks.font.size = snap.y1FontSize;
        }
      }

      try {
        chart.update('none');
        chart.resize();
      } catch (_) {
        // Ignore hidden canvas resize timing
      }
    });
  }

  // =========================================================================
  // 6. UNIVERSAL SMART MOBILE TABLE -> CARD + HORIZONTAL MODE + COLUMN PICKER
  // =========================================================================
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function assignTableId(table, idx) {
    if (!table.id) {
      table.id = 'mobAutoTable_' + idx;
    }
    return table.id;
  }

  function loadHiddenCols(tableId) {
    try {
      const raw = localStorage.getItem(STORAGE_COLS_PREFIX + tableId);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return new Set(arr.map(Number));
      }
    } catch (_) {}
    return new Set();
  }

  function saveHiddenCols(tableId, hiddenSet) {
    try {
      localStorage.setItem(STORAGE_COLS_PREFIX + tableId, JSON.stringify(Array.from(hiddenSet)));
    } catch (_) {}
  }

  function getTableState(tableId) {
    if (!state.tableState.has(tableId)) {
      state.tableState.set(tableId, {
        mode: 'cards',
        page: 1,
        pageSize: 10,
        search: '',
        sortIdx: -1,
        sortDir: 'desc',
        hiddenCols: loadHiddenCols(tableId),
        swipeDismissed: false
      });
    }
    return state.tableState.get(tableId);
  }

  function extractHeaders(table) {
    const ths = Array.from(table.querySelectorAll('thead tr:first-child th'));
    return ths.map((th, idx) => ({
      idx,
      rawText: (th.textContent || '').replace(/[↕↑↓▲▼]/g, '').replace(/\s+/g, ' ').trim() || ('Cột ' + (idx + 1))
    }));
  }

  function isCriteriaTable(headers) {
    const joined = headers.map((h) => stripVN(h.rawText)).join(' | ');
    return joined.includes('tieu chi danh gia') && (joined.includes('tot (4)') || joined.includes('xuat sac (5)'));
  }

  function classifyColumns(tableId, headers) {
    const n = headers.length;
    const norm = headers.map((h) => stripVN(h.rawText));
    const findIdx = (patterns) => norm.findIndex((t) => patterns.some((p) => t.includes(p)));

    const sttIdx = findIdx(['stt']);
    const actionIdx = findIdx(['thao tac', 'chi tiet']);
    const formatIdx = findIdx(['hinh thuc']);

    let titleIdx = -1;
    let subtitleIdx = -1;
    let scoreIdx = -1;

    if (tableId === 'gvClassesTable' || tableId === 'reportGvDataTable') {
      titleIdx = findIdx(['giang vien', 'ho va ten']);
      subtitleIdx = findIdx(['don vi', 'chuc danh', 'ma lop']);
      scoreIdx = findIdx(['diem tb', 'gpa']);
    } else if (tableId === 'reportTimeSummaryTable') {
      titleIdx = findIdx(['ky bao cao']);
      scoreIdx = findIdx(['dgc', 'gv', 'phan hoi']);
    } else if (tableId === 'reportCsvcLocationTable') {
      titleIdx = findIdx(['dia diem']);
      scoreIdx = findIdx(['csvc', 'cttc']);
    } else {
      titleIdx = findIdx(['ten chuong trinh', 'ma lop / chuong trinh', 'ho va ten', 'ma lop', 'tieu chi', 'ky bao cao']);
      if (titleIdx === -1) titleIdx = sttIdx === 0 && n > 1 ? 1 : 0;
      subtitleIdx = findIdx(['chuong trinh', 'thoi gian', 'dia diem']);
      if (subtitleIdx === titleIdx) subtitleIdx = -1;
      scoreIdx = findIdx(['diem tb', 'gpa', 'ty le tham du', 'tich cuc', 'hoan thanh', 'trang thai', 'xep loai']);
    }

    // Priority 4 metrics for Card Main Grid
    const priorityIndices = [];
    const pushIfValid = (idx) => {
      if (idx >= 0 && idx < n && idx !== sttIdx && idx !== titleIdx && idx !== formatIdx && idx !== actionIdx && !priorityIndices.includes(idx)) {
        priorityIndices.push(idx);
      }
    };

    if (tableId === 'gvClassesTable' || tableId === 'reportGvDataTable') {
      pushIfValid(findIdx(['chuyen mon', 'ktcm']));
      pushIfValid(findIdx(['su pham', 'knsp']));
      pushIfValid(findIdx(['tac phong', 'tdtp']));
      pushIfValid(findIdx(['so lop']));
      pushIfValid(findIdx(['so tiet']));
    } else {
      pushIfValid(scoreIdx);
      pushIfValid(findIdx(['thoi gian']));
      pushIfValid(findIdx(['dia diem']));
      pushIfValid(findIdx(['so lop', 'so phieu', 'phieu', 'luot hv', 'hv thuc te']));
      pushIfValid(findIdx(['tich cuc', 'phan hoi', 'cbql', 'can bo']));
    }

    for (let i = 0; i < n && priorityIndices.length < 4; i++) {
      pushIfValid(i);
    }

    return { sttIdx, titleIdx, subtitleIdx, formatIdx, scoreIdx, actionIdx, priorityIndices: priorityIndices.slice(0, 4) };
  }

  function buildSortableNum(text) {
    const cleaned = String(text || '').replace(/\s+/g, '').replace('%', '').replace('/4.0', '').replace('/5.0', '');
    // Vietnamese thousand separator handling e.g. 1.054 vs decimal 3.84
    if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
      return Number(cleaned.replace(/\./g, ''));
    }
    const m = cleaned.match(/-?\d+(\.\d+)?/);
    return m ? Number(m[0]) : NaN;
  }

  function applyHorizontalColVisibility(table, hiddenCols) {
    table.querySelectorAll('tr').forEach((tr) => {
      const cells = Array.from(tr.children);
      if (cells.length === 1 && cells[0].hasAttribute('colspan')) return;
      cells.forEach((cell, idx) => {
        cell.classList.toggle('mob-col-hidden', hiddenCols.has(idx));
      });
    });
  }

  function openColSelectorSheet(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const headers = extractHeaders(table);
    const ts = getTableState(tableId);
    state.colSheetTableId = tableId;

    const overlay = document.getElementById('mobileColSheetOverlay');
    const body = document.getElementById('mobileColSheetBody');
    if (!overlay || !body) return;

    const listHtml = headers.map((h) => {
      const checked = !ts.hiddenCols.has(h.idx);
      return `
        <div class="mob-col-item ${checked ? 'checked' : ''}">
          <label>
            <input type="checkbox" data-col-idx="${h.idx}" ${checked ? 'checked' : ''}>
            <span>${escapeHtml(h.rawText)}</span>
          </label>
        </div>
      `;
    }).join('');

    body.innerHTML = `<div class="mob-col-list">${listHtml}</div>`;
    body.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const idx = Number(cb.dataset.colIdx);
        const visibleCount = body.querySelectorAll('input[type="checkbox"]:checked').length;
        if (visibleCount === 0) {
          cb.checked = true; // Never allow hiding every column
          return;
        }
        if (cb.checked) ts.hiddenCols.delete(idx);
        else ts.hiddenCols.add(idx);
        cb.closest('.mob-col-item')?.classList.toggle('checked', cb.checked);
        saveHiddenCols(tableId, ts.hiddenCols);
        applyHorizontalColVisibility(table, ts.hiddenCols);
        renderSingleTableMobileUI(table);
      });
    });

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeColSelectorSheet() {
    const overlay = document.getElementById('mobileColSheetOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    state.colSheetTableId = null;
  }

  function createCardFromRow(tr, headers, cls, tableId, rowOriginalIdx) {
    const cells = Array.from(tr.children);
    // Group header / colspan row
    if (cells.length === 1 || (cells[0] && Number(cells[0].getAttribute('colspan') || 1) > 1)) {
      const div = document.createElement('div');
      div.className = 'mob-group-divider';
      div.innerHTML = cells[0].innerHTML;
      return div;
    }

    const card = document.createElement('article');
    card.className = 'mob-data-card';
    const bg = (tr.style.background || '').toLowerCase();
    if (bg.includes('fff1f2') || bg.includes('f1f5f9') || tr.classList.contains('subtotal-row')) {
      card.classList.add('is-subtotal');
    }

    const getText = (i) => (i >= 0 && cells[i]) ? (cells[i].textContent || '').replace(/\s+/g, ' ').trim() : '';
    const getHtml = (i) => (i >= 0 && cells[i]) ? cells[i].innerHTML : '';

    // Special layout for Criteria Tables (Section I-IV)
    if (isCriteriaTable(headers)) {
      const critHtml = getHtml(cls.titleIdx >= 0 ? cls.titleIdx : 1);
      const sttTxt = getText(0);
      const totalIdx = headers.findIndex((h) => stripVN(h.rawText).includes('tong so'));
      const scoreColIdx = headers.findIndex((h) => stripVN(h.rawText).includes('diem tb'));
      const levelIdxs = headers
        .map((h, i) => ({ h, i, norm: stripVN(h.rawText) }))
        .filter((x) => /\([1-5]\)/.test(x.norm));

      card.innerHTML = `
        <div class="mob-card-head">
          <div class="mob-card-title-block">
            ${sttTxt ? `<span class="mob-card-code">#${escapeHtml(sttTxt)}</span>` : ''}
            <div class="mob-card-title">${critHtml}</div>
            ${totalIdx >= 0 ? `<div class="mob-card-sub">Tổng phiếu: <strong>${escapeHtml(getText(totalIdx))}</strong></div>` : ''}
          </div>
          ${scoreColIdx >= 0 ? `<div class="mob-card-score-pill">${escapeHtml(getText(scoreColIdx))}</div>` : ''}
        </div>
        <div class="mob-card-footer">
          <button type="button" class="mob-card-expand-btn">
            <i class="fa-solid fa-layer-group"></i> Xem ${levelIdxs.length} mức đánh giá <i class="fa-solid fa-chevron-down"></i>
          </button>
        </div>
        <div class="mob-card-extra">
          ${levelIdxs.map((lv) => `
            <div class="mob-metric-cell">
              <div class="mob-metric-label">${escapeHtml(lv.h.rawText)}</div>
              <div class="mob-metric-val">${getHtml(lv.i)}</div>
            </div>
          `).join('')}
        </div>
      `;
      const expBtn = card.querySelector('.mob-card-expand-btn');
      const extraBox = card.querySelector('.mob-card-extra');
      expBtn?.addEventListener('click', () => {
        const opened = extraBox.classList.toggle('open');
        expBtn.innerHTML = opened
          ? `<i class="fa-solid fa-layer-group"></i> Thu gọn <i class="fa-solid fa-chevron-up"></i>`
          : `<i class="fa-solid fa-layer-group"></i> Xem ${levelIdxs.length} mức đánh giá <i class="fa-solid fa-chevron-down"></i>`;
      });
      return card;
    }

    // Standard Data / Report Card
    const sttTxt = cls.sttIdx >= 0 ? getText(cls.sttIdx) : String(rowOriginalIdx + 1);
    const titleHtml = cls.titleIdx >= 0 ? getHtml(cls.titleIdx) : getHtml(0);
    const formatHtml = cls.formatIdx >= 0 ? getHtml(cls.formatIdx) : '';
    const scoreTxt = cls.scoreIdx >= 0 ? getText(cls.scoreIdx) : '';

    // Check DGC long feedback text inside any cell (> 140 chars)
    const shownSet = new Set([cls.sttIdx, cls.titleIdx, cls.formatIdx, cls.actionIdx, ...cls.priorityIndices]);
    const extraIndices = [];
    for (let i = 0; i < headers.length && i < cells.length; i++) {
      if (!shownSet.has(i)) extraIndices.push(i);
    }

    const headHtml = `
      <div class="mob-card-head">
        <div class="mob-card-title-block">
          ${sttTxt ? `<span class="mob-card-code">#${escapeHtml(sttTxt)}</span>` : ''}
          <div class="mob-card-title">${titleHtml}</div>
        </div>
        ${scoreTxt && cls.scoreIdx !== cls.titleIdx ? `<div class="mob-card-score-pill">${escapeHtml(scoreTxt)}</div>` : ''}
      </div>
      ${formatHtml ? `<div class="mob-card-badges-row">${formatHtml}</div>` : ''}
    `;

    const primaryGridHtml = cls.priorityIndices.length ? `
      <div class="mob-card-metrics-grid">
        ${cls.priorityIndices.map((ci) => `
          <div class="mob-metric-cell">
            <div class="mob-metric-label">${escapeHtml(headers[ci]?.rawText || '')}</div>
            <div class="mob-metric-val">${cells[ci] ? cells[ci].innerHTML : '—'}</div>
          </div>
        `).join('')}
      </div>
    ` : '';

    const extraGridHtml = extraIndices.length ? `
      <div class="mob-card-extra">
        ${extraIndices.map((ci) => `
          <div class="mob-metric-cell">
            <div class="mob-metric-label">${escapeHtml(headers[ci]?.rawText || '')}</div>
            <div class="mob-metric-val">${cells[ci] ? cells[ci].innerHTML : '—'}</div>
          </div>
        `).join('')}
      </div>
    ` : '';

    // Action trigger: original row button OR clickable tr
    const origBtn = cells[cls.actionIdx]?.querySelector('button, a') || tr.querySelector('button.btn-detail, button');
    const rowClickable = Boolean(tr.onclick || tr.getAttribute('onclick') || (tr.style.cursor === 'pointer'));
    const hasAction = Boolean(origBtn || rowClickable);
    const actionLabel = origBtn ? (origBtn.textContent || 'Chi tiết').replace(/\s+/g, ' ').trim() : 'Xem chi tiết';

    card.innerHTML = `
      ${headHtml}
      ${primaryGridHtml}
      ${extraGridHtml}
      ${(extraIndices.length || hasAction) ? `
        <div class="mob-card-footer">
          ${extraIndices.length ? `
            <button type="button" class="mob-card-expand-btn">
              <span>Chi tiết (${extraIndices.length})</span> <i class="fa-solid fa-chevron-down"></i>
            </button>
          ` : ''}
          ${hasAction ? `
            <button type="button" class="mob-card-action-btn">
              <i class="fa-solid fa-eye"></i> <span>${escapeHtml(actionLabel)}</span>
            </button>
          ` : ''}
        </div>
      ` : ''}
    `;

    // Wire expand toggle
    const expBtn = card.querySelector('.mob-card-expand-btn');
    const extraBox = card.querySelector('.mob-card-extra');
    if (expBtn && extraBox) {
      expBtn.addEventListener('click', () => {
        const opened = extraBox.classList.toggle('open');
        expBtn.innerHTML = opened
          ? `<span>Thu gọn</span> <i class="fa-solid fa-chevron-up"></i>`
          : `<span>Chi tiết (${extraIndices.length})</span> <i class="fa-solid fa-chevron-down"></i>`;
      });
    }

    // Wire action button to real original DOM button / tr click
    const actBtn = card.querySelector('.mob-card-action-btn');
    if (actBtn) {
      actBtn.addEventListener('click', () => {
        if (origBtn) origBtn.click();
        else tr.click();
      });
    }

    // Clamp overly long text blocks inside card metrics (e.g. DGC feedback / long CT names > 160 chars)
    card.querySelectorAll('.mob-metric-val').forEach((valEl) => {
      const txt = (valEl.textContent || '').trim();
      if (txt.length > 160 && !valEl.querySelector('button')) {
        valEl.dataset.fullHtml = valEl.innerHTML;
        const shortTxt = txt.slice(0, 130) + '…';
        valEl.innerHTML = `<span>${escapeHtml(shortTxt)}</span> `;
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'mob-readmore-btn';
        rm.textContent = 'Xem thêm';
        let open = false;
        rm.addEventListener('click', () => {
          open = !open;
          if (open) {
            valEl.innerHTML = valEl.dataset.fullHtml + ' ';
            rm.textContent = 'Thu gọn';
            valEl.appendChild(rm);
          } else {
            valEl.innerHTML = `<span>${escapeHtml(shortTxt)}</span> `;
            rm.textContent = 'Xem thêm';
            valEl.appendChild(rm);
          }
        });
        valEl.appendChild(rm);
      }
    });

    return card;
  }

  function renderSingleTableMobileUI(table) {
    if (!table || !table.parentNode) return;
    const tableId = table.id;
    const ts = getTableState(tableId);
    const parent = table.parentNode;

    // Ensure mobile sibling host wrapper right beside table
    let wrap = document.getElementById('mobWrap_' + tableId);
    let hScrollWrap = table.closest('.mob-table-hscroll-wrap');

    if (!isMobile()) {
      // Desktop: restore raw table and hide Mobile wrappers cleanly
      table.classList.remove('mob-table-is-cards');
      table.querySelectorAll('.mob-col-hidden').forEach((c) => c.classList.remove('mob-col-hidden'));
      if (wrap) wrap.style.display = 'none';
      if (hScrollWrap) {
        hScrollWrap.classList.remove('mob-table-hscroll-wrap');
      }
      return;
    }

    const headers = extractHeaders(table);
    if (headers.length < 3) return;
    const cls = classifyColumns(tableId, headers);

    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'mobWrap_' + tableId;
      wrap.className = 'mob-table-companion no-print';
      parent.insertBefore(wrap, table);
    }
    wrap.style.display = 'block';

    // Ensure horizontal scroll wrapper exists around table when in table mode
    if (!parent.classList.contains('mob-table-hscroll-wrap') && !parent.classList.contains('table-container')) {
      const scroller = document.createElement('div');
      scroller.className = 'mob-table-hscroll-wrap';
      parent.insertBefore(scroller, table);
      scroller.appendChild(table);
      hScrollWrap = scroller;
    } else if (parent.classList.contains('table-container')) {
      parent.classList.add('mob-table-hscroll-wrap');
      hScrollWrap = parent;
    } else {
      hScrollWrap = parent;
    }

    // Read visible rows from tbody
    const tbody = table.querySelector('tbody');
    const allRows = tbody ? Array.from(tbody.querySelectorAll('tr')) : [];
    let visibleRows = allRows.filter((tr) => tr.style.display !== 'none');

    // Apply card quick search filter
    if (ts.search.trim()) {
      const q = stripVN(ts.search);
      visibleRows = visibleRows.filter((tr) => {
        const isGroup = tr.children.length === 1 && tr.children[0].hasAttribute('colspan');
        return isGroup || stripVN(tr.textContent).includes(q);
      });
    }

    // Apply card sort if selected
    if (ts.sortIdx >= 0 && ts.sortIdx < headers.length && !isCriteriaTable(headers)) {
      const dir = ts.sortDir === 'asc' ? 1 : -1;
      visibleRows = [...visibleRows].sort((a, b) => {
        const ta = (a.children[ts.sortIdx]?.textContent || '').trim();
        const tb = (b.children[ts.sortIdx]?.textContent || '').trim();
        const na = buildSortableNum(ta);
        const nb = buildSortableNum(tb);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return (na - nb) * dir;
        return ta.localeCompare(tb, 'vi') * dir;
      });
    }

    const totalRows = visibleRows.length;
    const isCards = ts.mode === 'cards';
    table.classList.toggle('mob-table-is-cards', isCards);
    if (!isCards) {
      applyHorizontalColVisibility(table, ts.hiddenCols);
    }

    // Toolbar markup
    const visibleColCount = headers.length - ts.hiddenCols.size;
    const sortableCols = headers.filter((h) => h.idx !== cls.sttIdx && h.idx !== cls.actionIdx);

    wrap.innerHTML = `
      <div class="mob-table-toolbar">
        <div class="mob-table-toolbar-row1">
          <div class="mob-view-seg" role="group" aria-label="Chế độ xem bảng">
            <button type="button" class="mob-view-btn ${isCards ? 'active' : ''}" data-mob-mode="cards">
              <i class="fa-solid fa-address-card"></i> Dạng Thẻ
            </button>
            <button type="button" class="mob-view-btn ${!isCards ? 'active' : ''}" data-mob-mode="table">
              <i class="fa-solid fa-table"></i> Bảng ngang
            </button>
          </div>
          ${!isCards ? `
            <button type="button" class="mob-col-picker-btn" data-open-cols="${tableId}">
              <i class="fa-solid fa-table-columns"></i> Cột (${visibleColCount}/${headers.length})
            </button>
          ` : `
            <span style="font-size: 0.74rem; font-weight: 700; color: #64748B;">
              ${totalRows} bản ghi
            </span>
          `}
        </div>
        ${isCards && !isCriteriaTable(headers) ? `
          <div class="mob-table-toolbar-row2">
            <input type="text" class="mob-tbl-search" placeholder="Tìm nhanh trong bảng..." value="${escapeHtml(ts.search)}">
            <select class="mob-tbl-sort" aria-label="Sắp xếp">
              <option value="-1">Mặc định</option>
              ${sortableCols.map((h) => `
                <option value="${h.idx}_desc" ${ts.sortIdx === h.idx && ts.sortDir === 'desc' ? 'selected' : ''}>↓ ${escapeHtml(h.rawText)}</option>
                <option value="${h.idx}_asc" ${ts.sortIdx === h.idx && ts.sortDir === 'asc' ? 'selected' : ''}>↑ ${escapeHtml(h.rawText)}</option>
              `).join('')}
            </select>
            <select class="mob-tbl-pagesize" aria-label="Số dòng/trang">
              ${[10, 20, 50, 9999].map((ps) => `
                <option value="${ps}" ${ts.pageSize === ps ? 'selected' : ''}>${ps === 9999 ? 'Tất cả' : ps + ' dòng'}</option>
              `).join('')}
            </select>
          </div>
        ` : ''}
      </div>
      ${!isCards ? `
        <div class="mob-swipe-hint ${ts.swipeDismissed ? 'dismissed' : ''}">
          <i class="fa-solid fa-hand-point-right"></i>
          <span>Vuốt ngang để xem thêm cột dữ liệu</span>
        </div>
      ` : ''}
      <div class="mob-cards-container" style="display: ${isCards ? 'flex' : 'none'} !important;"></div>
      <div class="mob-pagination-bar" style="display: none;"></div>
    `;

    // Wire toolbar controls
    wrap.querySelectorAll('[data-mob-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ts.mode = btn.dataset.mobMode;
        renderSingleTableMobileUI(table);
      });
    });

    wrap.querySelector('[data-open-cols]')?.addEventListener('click', () => openColSelectorSheet(tableId));

    const searchEl = wrap.querySelector('.mob-tbl-search');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        ts.search = searchEl.value;
        ts.page = 1;
        const pos = searchEl.selectionStart || ts.search.length;
        renderSingleTableMobileUI(table);
        const restored = document.querySelector('#mobWrap_' + tableId + ' .mob-tbl-search');
        if (restored) {
          restored.focus();
          restored.setSelectionRange(pos, pos);
        }
      });
    }

    const sortEl = wrap.querySelector('.mob-tbl-sort');
    if (sortEl) {
      sortEl.addEventListener('change', () => {
        const v = sortEl.value;
        if (v === '-1') {
          ts.sortIdx = -1;
        } else {
          const [idxStr, dir] = v.split('_');
          ts.sortIdx = Number(idxStr);
          ts.sortDir = dir || 'desc';
        }
        ts.page = 1;
        renderSingleTableMobileUI(table);
      });
    }

    const pageSizeEl = wrap.querySelector('.mob-tbl-pagesize');
    if (pageSizeEl) {
      pageSizeEl.addEventListener('change', () => {
        ts.pageSize = Number(pageSizeEl.value) || 10;
        ts.page = 1;
        renderSingleTableMobileUI(table);
      });
    }

    // Swipe hint dismissal on horizontal scroll
    if (!isCards && hScrollWrap && !hScrollWrap.dataset.mobSwipeBound) {
      hScrollWrap.dataset.mobSwipeBound = '1';
      hScrollWrap.addEventListener('scroll', () => {
        if (hScrollWrap.scrollLeft > 16 && !ts.swipeDismissed) {
          ts.swipeDismissed = true;
          wrap.querySelector('.mob-swipe-hint')?.classList.add('dismissed');
        }
      }, { passive: true });
    }

    // Render cards + pagination slice
    if (isCards) {
      const cardsBox = wrap.querySelector('.mob-cards-container');
      const pagerBox = wrap.querySelector('.mob-pagination-bar');

      if (totalRows === 0) {
        cardsBox.innerHTML = `
          <div class="mob-data-card" style="text-align: center; padding: 1.25rem; color: #64748B;">
            <i class="fa-solid fa-folder-open" style="font-size: 1.35rem; color: #94A3B8; margin-bottom: 0.35rem;"></i>
            <div style="font-size: 0.84rem; font-weight: 700;">Không có dữ liệu phù hợp với điều kiện lọc</div>
          </div>
        `;
        return;
      }

      const effSize = isCriteriaTable(headers) ? 9999 : ts.pageSize;
      const totalPages = Math.max(1, Math.ceil(totalRows / effSize));
      if (ts.page > totalPages) ts.page = totalPages;
      const start = (ts.page - 1) * effSize;
      const end = start + effSize;
      const slice = visibleRows.slice(start, end);

      slice.forEach((tr, i) => {
        cardsBox.appendChild(createCardFromRow(tr, headers, cls, tableId, start + i));
      });

      if (totalPages > 1) {
        pagerBox.style.removeProperty('display');
        pagerBox.innerHTML = `
          <button type="button" class="mob-page-btn" data-page-dir="-1" ${ts.page <= 1 ? 'disabled' : ''}>
            <i class="fa-solid fa-chevron-left"></i> Trước
          </button>
          <span class="mob-page-info">Trang <strong>${ts.page}</strong> / ${totalPages} (${start + 1}–${Math.min(end, totalRows)} / ${totalRows})</span>
          <button type="button" class="mob-page-btn" data-page-dir="1" ${ts.page >= totalPages ? 'disabled' : ''}>
            Sau <i class="fa-solid fa-chevron-right"></i>
          </button>
        `;
        pagerBox.querySelectorAll('.mob-page-btn').forEach((pb) => {
          pb.addEventListener('click', () => {
            ts.page += Number(pb.dataset.pageDir);
            renderSingleTableMobileUI(table);
            wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
      }
    }
  }

  function observeTable(table, idx) {
    const tableId = assignTableId(table, idx);
    if (state.tableObservers.has(tableId)) return;
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    let timer = null;
    const obs = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        renderSingleTableMobileUI(table);
        enhanceLongFeedbackComments();
        tagSpan2KpiCards();
      }, 60);
    });
    obs.observe(tbody, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    state.tableObservers.set(tableId, obs);
  }

  function enhanceAllTables() {
    const tableSet = new Set();
    document.querySelectorAll('.table-wrapper table, .table-container table, table.data-table').forEach((t) => {
      if (t.querySelector('thead') && t.querySelector('tbody')) {
        tableSet.add(t);
      }
    });
    Array.from(tableSet).forEach((t, idx) => {
      observeTable(t, idx);
      renderSingleTableMobileUI(t);
    });
  }

  function initColSelectorSheet() {
    document.getElementById('btnMobileColSheetClose')?.addEventListener('click', closeColSelectorSheet);
    document.getElementById('btnMobileColDone')?.addEventListener('click', closeColSelectorSheet);
    document.getElementById('mobileColSheetOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'mobileColSheetOverlay') closeColSelectorSheet();
    });
    document.getElementById('btnMobileColReset')?.addEventListener('click', () => {
      const tid = state.colSheetTableId;
      if (!tid) return;
      const ts = getTableState(tid);
      ts.hiddenCols.clear();
      saveHiddenCols(tid, ts.hiddenCols);
      const t = document.getElementById(tid);
      if (t) {
        applyHorizontalColVisibility(t, ts.hiddenCols);
        renderSingleTableMobileUI(t);
      }
      openColSelectorSheet(tid);
    });
  }

  // =========================================================================
  // 7. GLOBAL DYNAMIC DOM WATCHER (FOR DYNAMIC REPORT SECTIONS)
  // =========================================================================
  function initDynamicDomWatcher() {
    const reportContainer = document.getElementById('reportContentArea');
    if (reportContainer) {
      let repTimer = null;
      new MutationObserver(() => {
        clearTimeout(repTimer);
        repTimer = setTimeout(() => {
          tagSpan2KpiCards();
          enhanceLongFeedbackComments();
          enhanceAllTables();
          adaptChartsForViewport();
          updateReportQuickNav();
        }, 90);
      }).observe(reportContainer, { childList: true, subtree: true });
    }
  }

  // =========================================================================
  // 8. INIT & RESIZE / ORIENTATION LISTENER
  // =========================================================================
  function runFullSync() {
    syncDrawerActiveState(getActiveScreenId());
    syncMobileFilterBars();
    tagSpan2KpiCards();
    enhanceLongFeedbackComments();
    enhanceAllTables();
    adaptChartsForViewport();
    updateReportQuickNav();
  }

  function init() {
    initNavigationDrawer();
    initFilterSheetSystem();
    initColSelectorSheet();
    initDynamicDomWatcher();

    // Run after app.js initial renders settle
    setTimeout(runFullSync, 150);
    setTimeout(runFullSync, 650);

    const onViewportChange = () => {
      clearTimeout(state.resizeTimer);
      state.resizeTimer = setTimeout(runFullSync, 140);
    };
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', onViewportChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


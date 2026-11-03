const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sheetFiles = {
  '1POvv': 'raw_sheets/class.csv',
  '1903847251': 'raw_sheets/gv.csv',
  '1487920193': 'raw_sheets/pphtdt.csv',
  '1679681935': 'raw_sheets/csvc.csv',
  '194686666': 'raw_sheets/dgc.csv',
  '13JU-7nLGTpt1ceoTJ4rCyk7WMeUagQ': 'raw_sheets/nddt_old.csv',
  'gid=0': 'raw_sheets/nddt.csv'
};

const mockFetch = async (url) => {
  let file = 'raw_sheets/class.csv';
  if (url.includes('194686666')) file = 'raw_sheets/dgc.csv';
  else if (url.includes('1903847251')) file = 'raw_sheets/gv.csv';
  else if (url.includes('1487920193')) file = 'raw_sheets/pphtdt.csv';
  else if (url.includes('1679681935')) file = 'raw_sheets/csvc.csv';
  else if (url.includes('13JU-7nLGTpt1ceoTJ4rCyk7WMeUagQ')) file = 'raw_sheets/nddt_old.csv';
  else if (url.includes('1kLmS5c7MuNZYHE7') && (url.includes('gid=0') || !url.includes('gid='))) file = 'raw_sheets/nddt.csv';
  else if (url.includes('1POvv')) file = 'raw_sheets/class.csv';

  const text = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  return {
    ok: true,
    status: 200,
    text: async () => text
  };
};

const storageMap = new Map();
const mockLocalStorage = {
  getItem: (k) => storageMap.get(k) || null,
  setItem: (k, v) => storageMap.set(k, String(v)),
  removeItem: (k) => storageMap.delete(k)
};

let domCallback = null;
const mockWindow = {
  atob: (s) => Buffer.from(s, 'base64').toString('utf8'),
  btoa: (s) => Buffer.from(s, 'utf8').toString('base64'),
  fetch: mockFetch,
  localStorage: mockLocalStorage,
  addEventListener: () => {},
  document: {
    addEventListener: (evt, cb) => {
      if (evt === 'DOMContentLoaded') domCallback = cb;
    },
    getElementById: (id) => ({
      addEventListener: () => {},
      style: {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      getContext: () => ({})
    }),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, style: {}, classList: { add: () => {}, remove: () => {} } }),
    body: { style: {}, appendChild: () => {}, removeChild: () => {} }
  },
  Chart: class { constructor() {} static register() {} destroy() {} update() {} },
  navigator: {},
  location: { href: 'http://localhost:9669' },
  console: console,
  setTimeout: (fn) => setTimeout(fn, 0),
  setInterval: () => {},
  requestAnimationFrame: (fn) => fn()
};
mockWindow.window = mockWindow;

const context = vm.createContext(mockWindow);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8'), context);

(async () => {
  console.log('--- TEST 1: Initial load before sync ---');
  if (domCallback) domCallback();

  // Test KNTT on initial data.js load
  let knttInit = context.window.getDetailedProgramReport('TH - KNTT');
  console.log('KNTT initial classes count:', knttInit.classes.length);
  knttInit.classes.forEach(c => {
    console.log(`- ${c.classCode}: DGC = ${c.dgc ? (c.dgc.score || c.dgc.diem_tb) : 'NONE'}`);
  });
  const c4Init = knttInit.classes.find(c => c.classCode === 'TH-KNTT/26-04');
  if (!c4Init || !c4Init.dgc) {
    console.error('FAIL: TH-KNTT/26-04 missing DGC on initial load!');
    process.exit(1);
  }

  // Test Cacbon on initial data.js load
  let cacbonInit = context.window.getDetailedProgramReport('PS-Cacbon/26');
  console.log('Cacbon initial classes count:', cacbonInit.classes.length);
  cacbonInit.classes.forEach(c => {
    console.log(`- ${c.classCode}: DGC = ${c.dgc ? (c.dgc.score || c.dgc.diem_tb) : 'NONE'}`);
  });
  if (!cacbonInit.dgc) {
    console.error('FAIL: PS-Cacbon/26 missing Section V DGC on initial load!');
    process.exit(1);
  }

  console.log('\n--- TEST 2: Waiting for background syncAllModulesData ---');
  await new Promise(r => setTimeout(r, 1500));

  // Verify sync updated state and localStorage
  console.log('Total classes after sync:', context.window.allClasses.length);
  console.log('Total DGC items after sync:', context.window.allDgcItems.length);

  let knttSynced = context.window.getDetailedProgramReport('TH - KNTT');
  console.log('KNTT synced classes count:', knttSynced.classes.length);
  knttSynced.classes.forEach(c => {
    console.log(`- ${c.classCode}: DGC = ${c.dgc ? (c.dgc.score || c.dgc.diem_tb) : 'NONE'}`);
  });
  const c4Synced = knttSynced.classes.find(c => c.classCode === 'TH-KNTT/26-04');
  if (!c4Synced || !c4Synced.dgc || Number(c4Synced.dgc.diem_tb || c4Synced.dgc.score) <= 0) {
    console.error('FAIL: TH-KNTT/26-04 missing DGC after sync!');
    process.exit(1);
  }

  let cacbonSynced = context.window.getDetailedProgramReport('PS-Cacbon/26');
  console.log('Cacbon synced classes count:', cacbonSynced.classes.length);
  cacbonSynced.classes.forEach(c => {
    console.log(`- ${c.classCode}: DGC = ${c.dgc ? (c.dgc.score || c.dgc.diem_tb) : 'NONE'}`);
  });
  if (!cacbonSynced.dgc || Number(cacbonSynced.dgc.score) <= 0) {
    console.error('FAIL: PS-Cacbon/26 missing DGC after sync!');
    process.exit(1);
  }

  console.log('\n--- TEST 3: Test loadProgramReport & loadClassReport ---');
  context.window.loadProgramReport('TH - KNTT');
  console.log('loadProgramReport(TH - KNTT) passed successfully!');
  context.window.loadProgramReport('PS-Cacbon/26');
  console.log('loadProgramReport(PS-Cacbon/26) passed successfully!');
  context.window.loadClassReport('TH-KNTT/26-04');
  console.log('loadClassReport(TH-KNTT/26-04) passed successfully!');
  context.window.loadClassReport('PS-Cacbon/26');
  console.log('loadClassReport(PS-Cacbon/26) passed successfully!');

  console.log('\n>>> ALL REFRESH & LIVE SYNC TESTS PASSED 100%! <<<');
})();


const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appJsCode = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

let domCallback = null;
const mockWindow = {
  atob: (s) => Buffer.from(s, 'base64').toString('utf8'),
  btoa: (s) => Buffer.from(s, 'utf8').toString('base64'),
  addEventListener: () => {},
  document: {
    addEventListener: (evt, cb) => {
      if (evt === 'DOMContentLoaded') domCallback = cb;
    },
    getElementById: () => ({ addEventListener: () => {}, style: {}, classList: { add: () => {}, remove: () => {} }, getContext: () => ({}) }),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, style: {}, classList: { add: () => {}, remove: () => {} } }),
    body: { style: {}, appendChild: () => {}, removeChild: () => {} }
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  Chart: class { constructor() {} static register() {} },
  navigator: {}, location: { href: '' },
  console: console,
  setTimeout: () => {}, setInterval: () => {}, requestAnimationFrame: () => {}
};
mockWindow.window = mockWindow;

const context = vm.createContext(mockWindow);
// Run with empty data variables
vm.runInContext('var RAW_DATA = []; var RAW_GV_DATA = []; var RAW_NDDT_DATA = []; var RAW_NDDT_OLD_DATA = []; var RAW_PPHTDT_DATA = []; var RAW_CSVC_DATA = []; var RAW_DGC_DATA = [];', context);
vm.runInContext(appJsCode, context);

if (domCallback) {
  domCallback();
}

const w = context.window;
console.log('Parsers loaded on window:', {
  parseCsvToClasses: typeof w.parseCsvToClasses,
  parseGvCsvContent: typeof w.parseGvCsvContent,
  parseCsvToNddtItems: typeof w.parseCsvToNddtItems,
  parseCsvToPphtdtItems: typeof w.parseCsvToPphtdtItems,
  parseCsvToCsvcItems: typeof w.parseCsvToCsvcItems,
  parseDgcCsvToObjects: typeof w.parseDgcCsvToObjects
});

const rawDir = path.join(__dirname, '..', 'raw_sheets');
const classCsv = fs.readFileSync(path.join(rawDir, 'class.csv'), 'utf8');
const gvCsv = fs.readFileSync(path.join(rawDir, 'gv.csv'), 'utf8');
const nddtCsv = fs.readFileSync(path.join(rawDir, 'nddt.csv'), 'utf8');
const nddtOldCsv = fs.readFileSync(path.join(rawDir, 'nddt_old.csv'), 'utf8');
const pphtdtCsv = fs.readFileSync(path.join(rawDir, 'pphtdt.csv'), 'utf8');
const csvcCsv = fs.readFileSync(path.join(rawDir, 'csvc.csv'), 'utf8');
const dgcCsv = fs.readFileSync(path.join(rawDir, 'dgc.csv'), 'utf8');

const rawData = w.parseCsvToClasses(classCsv);
w.allClasses = rawData.filter(x => x.is_class);

const rawGvData = w.parseGvCsvContent(gvCsv) || [];
const rawNddtData = w.parseCsvToNddtItems(nddtCsv) || [];
const rawNddtOldData = w.parseCsvToNddtItems(nddtOldCsv) || [];
const rawPphtdtData = w.parseCsvToPphtdtItems(pphtdtCsv) || [];
const rawCsvcData = w.parseCsvToCsvcItems(csvcCsv) || [];
const rawDgcData = w.parseDgcCsvToObjects(dgcCsv) || [];

console.log('Parsed record counts:');
console.log('- RAW_DATA:', rawData.length);
console.log('- RAW_GV_DATA:', rawGvData.length);
console.log('- RAW_NDDT_DATA:', rawNddtData.length);
console.log('- RAW_NDDT_OLD_DATA:', rawNddtOldData.length);
console.log('- RAW_PPHTDT_DATA:', rawPphtdtData.length);
console.log('- RAW_CSVC_DATA:', rawCsvcData.length);
console.log('- RAW_DGC_DATA:', rawDgcData.length);

// Verify targets in rawDgcData
const dgcTargets = rawDgcData.filter(d => d.ma_lop === 'TH-KNTT/26-04' || d.ma_lop.includes('Cacbon'));
console.log('Targets in RAW_DGC_DATA:', dgcTargets.map(d => ({ ma_lop: d.ma_lop, diem_tb: d.diem_tb, tong_phieu: d.tong_phieu })));

// Build content of data.js
let outJs = `var RAW_DATA = ${JSON.stringify(rawData, null, 2)};\n\n`;
outJs += `var RAW_GV_DATA = ${JSON.stringify(rawGvData, null, 2)};\n\n`;
outJs += `var RAW_NDDT_DATA = ${JSON.stringify(rawNddtData, null, 2)};\n\n`;
outJs += `var RAW_NDDT_OLD_DATA = ${JSON.stringify(rawNddtOldData, null, 2)};\n\n`;
outJs += `var RAW_PPHTDT_DATA = ${JSON.stringify(rawPphtdtData, null, 2)};\n\n`;
outJs += `var RAW_CSVC_DATA = ${JSON.stringify(rawCsvcData, null, 2)};\n\n`;
outJs += `var RAW_DGC_DATA = ${JSON.stringify(rawDgcData, null, 2)};\n`;

const outPath = path.join(__dirname, '..', 'data.js');
fs.writeFileSync(outPath, outJs, 'utf8');
console.log(`Successfully generated ${outPath} (${(outJs.length / 1024).toFixed(1)} KB)`);

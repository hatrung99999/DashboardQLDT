const https = require('https');
const fs = require('fs');
const path = require('path');

const SHEETS = {
  class: 'https://docs.google.com/spreadsheets/d/1POvv-bVZMvKyXii-3Rxb9WAY67s93xAwxDwC_peA01o/export?format=csv&gid=0',
  gv: 'https://docs.google.com/spreadsheets/d/1kLmS5c7MuNZYHE7_A9GRWwJgxL5Z05k-rMJl-Bs0TfE/export?format=csv&gid=1903847251',
  nddt: 'https://docs.google.com/spreadsheets/d/1kLmS5c7MuNZYHE7_A9GRWwJgxL5Z05k-rMJl-Bs0TfE/export?format=csv&gid=0',
  nddt_old: 'https://docs.google.com/spreadsheets/d/13JU-7nLGTpt1ceoTJ4rCyk7WMeUagQ_2cXwUD_iP55E/export?format=csv&gid=0',
  pphtdt: 'https://docs.google.com/spreadsheets/d/1kLmS5c7MuNZYHE7_A9GRWwJgxL5Z05k-rMJl-Bs0TfE/export?format=csv&gid=1487920193',
  csvc: 'https://docs.google.com/spreadsheets/d/1kLmS5c7MuNZYHE7_A9GRWwJgxL5Z05k-rMJl-Bs0TfE/export?format=csv&gid=1679681935',
  dgc: 'https://docs.google.com/spreadsheets/d/1kLmS5c7MuNZYHE7_A9GRWwJgxL5Z05k-rMJl-Bs0TfE/export?format=csv&gid=194686666'
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).on('error', reject);
  });
}

async function main() {
  const outDir = path.join(__dirname, '..', 'raw_sheets');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const [key, url] of Object.entries(SHEETS)) {
    console.log(`Fetching ${key}...`);
    try {
      const csv = await fetchUrl(url);
      const filePath = path.join(outDir, `${key}.csv`);
      fs.writeFileSync(filePath, csv, 'utf8');
      console.log(`Saved ${key}.csv (${csv.length} bytes, ${csv.split('\n').length} lines)`);
    } catch (err) {
      console.error(`Failed to fetch ${key}:`, err.message);
    }
  }
}

main();

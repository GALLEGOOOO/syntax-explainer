// Uso: node tools/add.js <lang> < archivo  (líneas "palabra|texto"; las existentes se sobrescriben)
const fs = require('fs'); const lang = process.argv[2];
const f = `src/keywords/${lang}.json`;
const d = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
let n = 0;
for (const line of fs.readFileSync(0, 'utf8').split('\n')) {
  const i = line.indexOf('|'); if (i < 1) continue;
  const k = line.slice(0, i).trim(), v = line.slice(i + 1).trim();
  if (!k || !v) continue; d[k] = v; n++;
}
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(lang, '+' + n, '=', Object.keys(d).length);

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'keywords');
const dicts = {};
for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) dicts[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));

// languageId de VS Code -> diccionarios (orden: los últimos tienen prioridad)
const LANG_MAP = {
  javascript: ['javascript'], typescript: ['javascript'],
  javascriptreact: ['javascript', 'react'], typescriptreact: ['javascript', 'react'],
  html: ['html'], css: ['css'], scss: ['css'], less: ['css'],
  php: ['php'], python: ['python'], java: ['java'], sql: ['sql']
};
const CASE_INSENSITIVE = new Set(['sql', 'html']);
const WORD_REGEX = {
  css: /!?[@:\w-]+/, scss: /!?[@:\w-]+/, less: /!?[@:\w-]+/,
  php: /\$?[A-Za-z_]\w*/,
  default: /[A-Za-z_$][A-Za-z0-9_$]*/
};
let remote = {};
function setRemote(r) { remote = r && typeof r === 'object' ? r : {}; }
const has = (o, k) => o && Object.prototype.hasOwnProperty.call(o, k);

function lookup(word, languageId = 'javascript') {
  const names = LANG_MAP[languageId];
  if (!names) return undefined;
  for (let i = names.length - 1; i >= 0; i--) {
    const n = names[i];
    const key = CASE_INSENSITIVE.has(n) ? word.toLowerCase() : word;
    for (const d of [remote[n], dicts[n]]) if (has(d, key)) return d[key];
  }
  // CSS: ":hover" escrito como "a:hover" o "a::before"
  if (names.includes('css')) { const m = word.match(/::?[\w-]+$/); if (m && m[0] !== word) return lookup(m[0], languageId); }
  return undefined;
}
function insideStringOrComment(line, col, languageId = 'javascript') {
  const hash = languageId === 'python' || languageId === 'php';
  const dash = languageId === 'sql';
  let q = null;
  for (let i = 0; i < col && i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === '/' && line[i + 1] === '/' && languageId !== 'css' && line[i - 1] !== ':') return true;
    if (hash && c === '#') return true;
    if (dash && c === '-' && line[i + 1] === '-') return true;
    if (c === '"' || c === "'" || c === '`') q = c;
  }
  if (q) return true;
  const t = line.trimStart();
  if (t.startsWith('/*') || (t.startsWith('*') && !t.startsWith('*/'))) return true;
  const open = line.lastIndexOf('/*', col), close = line.lastIndexOf('*/', col);
  return open !== -1 && open > close;
}
module.exports = { dicts, LANG_MAP, WORD_REGEX, lookup, insideStringOrComment, setRemote };

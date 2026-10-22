const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'keywords');
const dicts = {};
for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) dicts[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));

// languageId de VS Code -> diccionarios, de MENOR a MAYOR prioridad (el último gana).
const LANG_MAP = {
  javascript: ['rxjs', 'javascript'],
  typescript: ['rxjs', 'angular', 'javascript', 'typescript'],
  javascriptreact: ['rxjs', 'javascript', 'react'],
  typescriptreact: ['rxjs', 'javascript', 'typescript', 'react'],
  html: ['angular', 'html'],
  vue: ['javascript', 'html', 'vue'],
  css: ['css'], scss: ['css'], less: ['css'],
  php: ['php'], python: ['python'], java: ['java'], sql: ['sql'],
  csharp: ['csharp'], c: ['c'], cpp: ['c', 'cpp'], go: ['go'], rust: ['rust'],
  kotlin: ['kotlin'], swift: ['swift'], dart: ['dart'], shellscript: ['shellscript'],
  json: ['json'], jsonc: ['json'], yaml: ['yaml'], markdown: ['markdown']
};
const CASE_INSENSITIVE = new Set(['sql', 'html']);

const ID = /[A-Za-z_$][A-Za-z0-9_$]*/;
const CSSW = /!?@?[\w-]+|::?[\w-]+/; // display, @media, :hover, ::before, !important
// Patrones de palabra por lenguaje; se prueban en orden hasta encontrar una explicación.
const WORD_REGEX = {
  default: [ID],
  css: [CSSW], scss: [CSSW], less: [CSSW],
  html: [/[A-Za-z][\w-]*/, ID],
  vue: [/[A-Za-z_$][\w$-]*/, ID],
  php: [/\$?[A-Za-z_]\w*/],
  c: [/#?[A-Za-z_]\w*/], cpp: [/#?[A-Za-z_]\w*/],
  rust: [/[A-Za-z_]\w*!?/],
  shellscript: [/\$(?:[A-Za-z_]\w*|[0-9#?@!$*])|[A-Za-z_]\w*/],
  json: [/\$?[A-Za-z_][\w-]*/], jsonc: [/\$?[A-Za-z_][\w-]*/],
  yaml: [/[A-Za-z_][\w-]*/],
  markdown: [/[#*_~`>|!\[\]()+-]+/]
};
const regexesFor = lang => WORD_REGEX[lang] || WORD_REGEX.default;

const has = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);

function rawLookup(word, names) {
  for (let i = names.length - 1; i >= 0; i--) {
    const n = names[i];
    const key = CASE_INSENSITIVE.has(n) ? word.toLowerCase() : word;
    if (has(dicts[n], key)) return dicts[n][key];
  }
}
function lookup(word, languageId = 'javascript') {
  const names = LANG_MAP[languageId];
  if (!names || !word) return undefined;
  let r = rawLookup(word, names);
  if (r) return r;
  const alt = [];
  if (names.includes('css')) {
    const pseudo = word.match(/::?[\w-]+$/); if (pseudo && pseudo[0] !== word) alt.push(pseudo[0]); // a:hover
    const unit = word.match(/^-?\d*\.?\d+([a-z]+)$/i); if (unit) alt.push(unit[1]);                   // 16px
  }
  if (names.includes('html')) {
    if (/^data-/i.test(word)) alt.push('data');
    if (/^aria-/i.test(word)) alt.push('aria');
  }
  if (word.length > 1 && word.endsWith('!')) alt.push(word.slice(0, -1)); // Rust: x!= y
  if (word.length > 1 && word.startsWith('#')) alt.push(word.slice(1));   // C: #algo desconocido
  for (const w of alt) if ((r = rawLookup(w, names))) return r;
  return undefined;
}

const SLASH = new Set(['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'dart', 'php', 'scss', 'less', 'vue', 'jsonc']);
const BLOCK = new Set([...SLASH, 'css']);
const HASH = new Set(['python', 'php', 'shellscript', 'yaml']);
const HTMLCOMMENT = new Set(['html', 'vue', 'markdown']);
const QUOTES = { rust: '"', shellscript: "'", html: '"', vue: '"', css: '"\'', scss: '"\'', less: '"\'', yaml: '', json: '', jsonc: '', markdown: '' };

// Heurística por línea: ¿la posición está dentro de una cadena o un comentario?
function insideStringOrComment(line, col, languageId = 'javascript') {
  const quotes = languageId in QUOTES ? QUOTES[languageId] : '"\'`';
  const slash = SLASH.has(languageId), hash = HASH.has(languageId), dash = languageId === 'sql';
  let q = null;
  for (let i = 0; i < col && i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (slash && c === '/' && line[i + 1] === '/' && line[i - 1] !== ':') return true;
    if (hash && c === '#' && (i === 0 || /\s/.test(line[i - 1]))) return true;
    if (dash && c === '-' && line[i + 1] === '-') return true;
    if (quotes.includes(c)) q = c;
  }
  if (q) return true;
  if (BLOCK.has(languageId)) {
    const cont = /^\s*\*(\s|$)/.test(line) && !(['css', 'scss', 'less'].includes(languageId) && line.includes('{')); // en CSS, "* {" es un selector
    if ((/^\s*\/\*/.test(line) || cont) && !/^\s*\*\//.test(line)) return true;
    const open = line.lastIndexOf('/*', col), close = line.lastIndexOf('*/', col);
    if (open !== -1 && open > close) return true;
  }
  if (HTMLCOMMENT.has(languageId)) {
    const open = line.lastIndexOf('<!--', col), close = line.lastIndexOf('-->', col);
    if (open !== -1 && open > close) return true;
  }
  return false;
}

// Filtros de contexto para evitar ruido en lenguajes de datos/marcado.
const MD_LINE_START = new Set(['#', '##', '###', '####', '#####', '######', '-', '+', '*', '>', '```', '---', '***']);
function contextAllows(languageId, word, line, start, end) {
  const before = line.slice(0, start), after = line.slice(end);
  if (languageId === 'json' || languageId === 'jsonc') return /"\s*$/.test(before) && /^"\s*:/.test(after); // solo claves
  if (languageId === 'yaml') return /^\s*(-\s+)?["']?$/.test(before) && /^["']?\s*:/.test(after);          // solo claves
  if (languageId === 'markdown' && MD_LINE_START.has(word)) return /^\s*(>\s*)*$/.test(before);
  return true;
}

// Busca la explicación para la posición `col` de `line`. Devuelve {word, text, start, end} o undefined.
function explainAt(line, col, languageId) {
  if (!LANG_MAP[languageId]) return undefined;
  for (const re of regexesFor(languageId)) {
    const g = new RegExp(re.source, 'g');
    let m;
    while ((m = g.exec(line))) {
      if (m[0] === '') { g.lastIndex++; continue; }
      const start = m.index, end = start + m[0].length;
      if (start > col) break;
      if (col >= start && col <= end) {
        // Llamada suelta (no tras un punto), p. ej. of(1) o map(x => x) en RxJS: prueba antes la clave "palabra()".
        const call = /^\s*\(/.test(line.slice(end)) && !/\.\s*$/.test(line.slice(0, start));
        const text = (call && rawLookup(m[0] + '()', LANG_MAP[languageId])) || lookup(m[0], languageId);
        if (text && contextAllows(languageId, m[0], line, start, end) && !insideStringOrComment(line, start, languageId))
          return { word: m[0], text, start, end };
        break;
      }
    }
  }
  return undefined;
}
module.exports = { dicts, LANG_MAP, WORD_REGEX, CASE_INSENSITIVE, lookup, insideStringOrComment, explainAt };

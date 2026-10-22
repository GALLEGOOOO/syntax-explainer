const a = require('assert');
const fs = require('fs');
const path = require('path');
const { dicts, LANG_MAP, WORD_REGEX, CASE_INSENSITIVE, lookup: l, insideStringOrComment: s, explainAt: x } = require('../src/lookup');

// 1. Todos los diccionarios: JSON válido, textos no vacíos, claves en minúsculas donde toca
const kwDir = path.join(__dirname, '..', 'src', 'keywords');
const files = fs.readdirSync(kwDir).filter(f => f.endsWith('.json'));
a.strictEqual(files.length, Object.keys(dicts).length);
let total = 0;
for (const f of files) {
  const name = f.slice(0, -5);
  const d = JSON.parse(fs.readFileSync(path.join(kwDir, f), 'utf8'));
  a.ok(d && typeof d === 'object' && !Array.isArray(d), name);
  const keys = Object.keys(d);
  a.ok(keys.length >= 20, `${name}: pocas entradas`);
  for (const k of keys) {
    a.ok(k.trim() === k && k.length > 0, `${name}: clave rara "${k}"`);
    a.ok(typeof d[k] === 'string' && d[k].trim().length >= 10, `${name}.${k}: texto vacío o corto`);
    a.ok(/[.!?)]$/.test(d[k].trim()), `${name}.${k}: el texto debería terminar en punto`);
    if (CASE_INSENSITIVE.has(name)) a.strictEqual(k, k.toLowerCase(), `${name}.${k} debe ir en minúsculas`);
  }
  total += keys.length;
  console.log(name.padEnd(12), keys.length);
}
console.log('TOTAL'.padEnd(12), total);

// 2. Mapeo: cada diccionario se usa en algún lenguaje y cada lenguaje apunta a diccionarios existentes
const used = new Set(Object.values(LANG_MAP).flat());
for (const n of Object.keys(dicts)) a.ok(used.has(n), `diccionario sin usar: ${n}`);
for (const [lang, names] of Object.entries(LANG_MAP)) for (const n of names) a.ok(dicts[n], `${lang} -> ${n} no existe`);
for (const lang of Object.keys(LANG_MAP)) for (const re of (WORD_REGEX[lang] || WORD_REGEX.default)) a.ok(!re.test(''), `${lang}: regex vacía`);
const pkg = require('../package.json');
for (const lang of Object.keys(LANG_MAP)) a.ok(pkg.activationEvents.includes('onLanguage:' + lang), `falta activationEvent ${lang}`);

// 3. Búsquedas básicas y prioridades
a.ok(l('function').startsWith('Declara una función'));
a.strictEqual(l('foo'), undefined);
a.ok(l('useState', 'typescriptreact')); a.strictEqual(l('useState', 'typescript'), undefined);
a.ok(l('satisfies', 'typescript')); a.ok(l('satisfies', 'typescriptreact')); a.strictEqual(l('satisfies', 'javascript'), undefined);
a.ok(l('async', 'typescript').includes('asíncrona'), 'angular no debe tapar a JS/TS');
a.ok(l('ngOnInit', 'typescript')); a.ok(l('ngIf', 'html')); a.ok(l('Component', 'typescript'));
a.ok(l('input', 'html').toLowerCase().includes('campo'));
a.ok(l('v-if', 'vue')); a.ok(l('const', 'vue')); a.ok(l('div', 'vue'));
a.ok(l('SELECT', 'sql')); a.ok(l('select', 'sql')); a.ok(l('DIV', 'html'));
a.ok(l('data-id', 'html').includes('data-')); a.ok(l('aria-hidden', 'html'));
a.ok(l('justify-content', 'scss')); a.ok(l('@media', 'css')); a.ok(l('a:hover', 'css')); a.ok(l('!important', 'less'));
a.ok(l('16px', 'css')); a.ok(l('1.5rem', 'css')); a.ok(l('100vh', 'css'));
a.ok(l('$this', 'php')); a.ok(l('def', 'python')); a.strictEqual(l('Def', 'python'), undefined);
a.ok(l('String', 'java')); a.strictEqual(l('select', 'markdown'), undefined);
a.ok(l('#include', 'c')); a.ok(l('#include', 'cpp')); a.ok(l('vector', 'cpp')); a.ok(l('printf', 'cpp'));
a.ok(l('println!', 'rust')); a.ok(l('fn', 'rust')); a.ok(l('x!', 'rust') === undefined);
a.ok(l('$HOME', 'shellscript')); a.ok(l('$#', 'shellscript')); a.ok(l('esac', 'shellscript'));
a.ok(l('func', 'go')); a.ok(l('fun', 'kotlin')); a.ok(l('guard', 'swift')); a.ok(l('late', 'dart')); a.ok(l('foreach', 'csharp'));
a.ok(l('dependencies', 'json')); a.ok(l('runs-on', 'yaml')); a.ok(l('##', 'markdown'));
a.strictEqual(l('anything', 'plaintext'), undefined);

// 4. Patrones de palabra + contexto (explainAt)
const w = (line, col, lang) => (x(line, col, lang) || {}).word;
a.strictEqual(w('function f() {}', 2, 'javascript'), 'function');
a.strictEqual(w('  display: flex;', 4, 'css'), 'display');
a.strictEqual(w('.a { margin-top: 0 }', 7, 'css'), 'margin-top');
a.strictEqual(w('$this->name', 2, 'php'), '$this');
a.strictEqual(w('#include <stdio.h>', 3, 'c'), '#include');
a.strictEqual(w('    println!("hola");', 6, 'rust'), 'println!');
a.strictEqual(w('if x!= y {', 3, 'rust'), undefined);
a.strictEqual(w('echo "$#" $HOME', 12, 'shellscript'), '$HOME');
a.strictEqual(w('<div v-if="ok">', 6, 'vue'), 'v-if');
a.strictEqual(w('<div data-id="3">', 7, 'html'), 'data-id');
a.strictEqual(w('<li *ngFor="let x of xs">', 6, 'html'), 'ngFor');
a.strictEqual(w('  "scripts": {', 4, 'json'), 'scripts');
a.strictEqual(w('  "name": "scripts"', 13, 'json'), undefined, 'en JSON solo claves');
a.strictEqual(w('    runs-on: ubuntu-latest', 6, 'yaml'), 'runs-on');
a.strictEqual(w('name: on', 7, 'yaml'), undefined, 'en YAML solo claves');
a.strictEqual(w('## Título', 0, 'markdown'), '##');
a.strictEqual(w('una frase - con guion', 10, 'markdown'), undefined);
a.strictEqual(w('- elemento', 0, 'markdown'), '-');
a.strictEqual(w('Texto **negrita**', 6, 'markdown'), '**');

// 5. Cadenas y comentarios
a.ok(!s('const x = 1', 0)); a.ok(s('// const x', 3)); a.ok(s('"const"', 1)); a.ok(!s('"a" + const', 6));
a.ok(s('x = 1  # def', 9, 'python')); a.ok(s('-- select', 4, 'sql')); a.ok(!s('a { color: red }', 4, 'css'));
a.ok(!s('* { margin: 0 }', 4, 'css'), 'selector * no es comentario');
a.ok(s('<!-- div -->', 5, 'html')); a.ok(!s('echo $# items', 8, 'shellscript'), '$# no es comentario');
a.ok(s('ls # rm', 6, 'shellscript')); a.ok(!s("fn f<'a>(x: &'a str)", 18, 'rust'), "lifetimes de Rust no son cadenas");
a.ok(s('// fn', 3, 'go')); a.ok(s('let s = "fn"', 9, 'rust'));
a.ok(!s('#include <x>', 1, 'c'), '#include no es comentario en C');

const w2 = (line, col, lang) => (x(line, col, lang) || {}).word;
a.strictEqual(w2('a:hover { color: red }', 3, 'css'), ':hover');
a.strictEqual(w2('p::before {', 4, 'css'), '::before');
a.strictEqual(w2('@media (max-width: 600px) {', 2, 'css'), '@media');
a.strictEqual(w2('  width: 100vh;', 11, 'css'), '100vh');
a.strictEqual(w2('  color: red !important;', 16, 'css'), '!important');
console.log('OK css');
const ext = fs.readFileSync(path.join(__dirname, '..', 'src', 'extension.js'), 'utf8');
a.ok(!/secrets|token|https?:/i.test(ext), 'la extensión no debe usar red ni tokens');
console.log('OK');

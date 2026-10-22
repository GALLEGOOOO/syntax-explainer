const a = require('assert');
const { dicts, lookup: l, insideStringOrComment: s, setRemote, WORD_REGEX } = require('../src/lookup');
for (const [k, d] of Object.entries(dicts)) { a.ok(Object.keys(d).length >= 30, k); for (const v of Object.values(d)) a.ok(typeof v === 'string' && v.length > 5); console.log(k.padEnd(11), Object.keys(d).length); }
a.ok(l('function').startsWith('Declara una función'));
a.strictEqual(l('foo'), undefined); a.strictEqual(l('toString'), undefined);
a.ok(l('useState', 'typescriptreact')); a.strictEqual(l('useState', 'typescript'), undefined);
a.ok(l('const', 'javascriptreact'));
a.ok(l('SELECT', 'sql')); a.ok(l('select', 'sql')); a.ok(l('DIV', 'html'));
a.ok(l('justify-content', 'scss')); a.ok(l('@media', 'css')); a.ok(l('a:hover', 'css')); a.ok(l('!important', 'less'));
a.ok(l('$this', 'php')); a.ok(l('def', 'python')); a.strictEqual(l('Def', 'python'), undefined);
a.ok(l('String', 'java')); a.strictEqual(l('select', 'markdown'), undefined);
a.ok('justify-content'.match(WORD_REGEX.css)[0] === 'justify-content'); a.ok('$this->x'.match(WORD_REGEX.php)[0] === '$this');
a.ok(!s('const x = 1', 0)); a.ok(s('// const x', 3)); a.ok(s('"const"', 1)); a.ok(!s('"a" + const', 6));
a.ok(s('x = 1  # def', 9, 'python')); a.ok(s('-- select', 4, 'sql')); a.ok(!s('a { color: red }', 4, 'css'));
setRemote({ python: { def: 'remoto', nuevo: 'x' }, sql: { join: 'J' } });
a.strictEqual(l('def', 'python'), 'remoto'); a.strictEqual(l('nuevo', 'python'), 'x'); a.strictEqual(l('JOIN', 'sql'), 'J');
setRemote({}); a.notStrictEqual(l('def', 'python'), 'remoto');
console.log('OK');
// remoto
const r = require('../src/remote'); const fs = require('fs');
const api = 'https://api.github.com/repos/GALLEGOOOO/syntax-explainer/contents/diccionario.json';
const h = r.buildHeaders(api, 'tok');
a.strictEqual(h.Authorization, 'Bearer tok'); a.strictEqual(h.Accept, 'application/vnd.github.raw'); a.ok(h['User-Agent']);
a.strictEqual(r.buildHeaders('https://example.com/d.json', 'tok').Authorization, undefined);
a.ok(!r.isGitHubApi('https://api.github.com.evil.com/x'));
const dic = JSON.parse(fs.readFileSync(__dirname + '/../diccionario.json', 'utf8'));
a.ok(r.isValidDictionary(dic)); a.deepStrictEqual(dic, dicts); a.ok(!r.isValidDictionary([])); a.ok(!r.isValidDictionary({ a: 'x' }));
console.log('OK remoto');

// Descarga del diccionario remoto (sin dependencia de vscode, para poder testearlo con node).
function isGitHubApi(url) { try { return new URL(url).hostname === 'api.github.com'; } catch { return false; } }
function buildHeaders(url, token) {
  const h = { 'User-Agent': 'explicador-palabras-clave', Accept: 'application/json' };
  if (isGitHubApi(url)) {
    h.Accept = 'application/vnd.github.raw';
    h['X-GitHub-Api-Version'] = '2022-11-28';
    if (token) h.Authorization = `Bearer ${token}`;
  }
  return h;
}
function fetchJson(url, token, redirects = 3) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? require('https') : require('http');
    const req = lib.get(url, { timeout: 8000, headers: buildHeaders(url, token) }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
        res.resume();
        // No reenviar el token a otro host
        const next = new URL(res.headers.location, url).toString();
        return resolve(fetchJson(next, isGitHubApi(next) ? token : undefined, redirects - 1));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
      let data = ''; res.setEncoding('utf8');
      res.on('data', c => (data += c));
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}
function isValidDictionary(d) {
  return !!d && typeof d === 'object' && !Array.isArray(d) &&
    Object.values(d).every(v => v && typeof v === 'object' && !Array.isArray(v));
}
module.exports = { isGitHubApi, buildHeaders, fetchJson, isValidDictionary };

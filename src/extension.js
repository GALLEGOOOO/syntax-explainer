const vscode = require('vscode');
const { LANG_MAP, WORD_REGEX, lookup, insideStringOrComment, setRemote } = require('./lookup');
const { isGitHubApi, fetchJson, isValidDictionary } = require('./remote');
const CACHE_KEY = 'remoteDictionary';
const TOKEN_KEY = 'syntaxExplainer.githubToken';
const DAY = 24 * 60 * 60 * 1000;
const cfg = () => vscode.workspace.getConfiguration('syntaxExplainer');

// Devuelve true si se descargó; silencioso salvo que verbose = true (comando manual).
async function refreshRemote(context, verbose = false) {
  const url = (cfg().get('remoteUrl') || '').trim();
  if (!url) { setRemote({}); if (verbose) vscode.window.showInformationMessage('Syntax Explainer: no hay URL remota configurada.'); return false; }
  setRemote(context.globalState.get(CACHE_KEY) || {});
  const token = await context.secrets.get(TOKEN_KEY);
  if (isGitHubApi(url) && !token) {
    if (verbose) vscode.window.showWarningMessage('Syntax Explainer: configura antes un token con "Syntax Explainer: Configurar token de GitHub".');
    return false;
  }
  try {
    const data = await fetchJson(url, token);
    if (!isValidDictionary(data)) throw new Error('formato no válido');
    setRemote(data); await context.globalState.update(CACHE_KEY, data);
    if (verbose) vscode.window.showInformationMessage('Syntax Explainer: diccionario actualizado.');
    return true;
  } catch (e) {
    if (verbose) vscode.window.showWarningMessage('Syntax Explainer: no se pudo descargar el diccionario (' + e.message + ').');
    return false;
  }
}
function activate(context) {
  refreshRemote(context);
  const timer = setInterval(() => refreshRemote(context), DAY);
  context.subscriptions.push({ dispose: () => clearInterval(timer) });

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('syntaxExplainer.remoteUrl')) refreshRemote(context);
    }),
    vscode.commands.registerCommand('syntaxExplainer.configurarToken', async () => {
      const token = await vscode.window.showInputBox({
        title: 'Token de GitHub', prompt: 'Pega un token fine-grained con acceso de solo lectura a Contents del repo del diccionario',
        password: true, ignoreFocusOut: true
      });
      if (!token || !token.trim()) return;
      await context.secrets.store(TOKEN_KEY, token.trim());
      vscode.window.showInformationMessage('Syntax Explainer: token guardado de forma segura.');
      refreshRemote(context, true);
    }),
    vscode.commands.registerCommand('syntaxExplainer.borrarToken', async () => {
      await context.secrets.delete(TOKEN_KEY);
      vscode.window.showInformationMessage('Syntax Explainer: token borrado.');
    }),
    vscode.commands.registerCommand('syntaxExplainer.actualizar', () => refreshRemote(context, true))
  );

  const provider = {
    provideHover(document, position) {
      if (!cfg().get('enabled', true)) return;
      const lang = document.languageId;
      const range = document.getWordRangeAtPosition(position, WORD_REGEX[lang] || WORD_REGEX.default);
      if (!range) return;
      const word = document.getText(range);
      const text = lookup(word, lang);
      if (!text) return;
      if (insideStringOrComment(document.lineAt(position.line).text, range.start.character, lang)) return;
      return new vscode.Hover(new vscode.MarkdownString(`**${word}** — ${text}`), range);
    }
  };
  context.subscriptions.push(vscode.languages.registerHoverProvider(Object.keys(LANG_MAP), provider));
}
function deactivate() {}
module.exports = { activate, deactivate };

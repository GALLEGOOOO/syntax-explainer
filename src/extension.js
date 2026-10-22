const vscode = require('vscode');
const { LANG_MAP, explainAt } = require('./lookup');

function activate(context) {
  const provider = {
    provideHover(document, position) {
      if (!vscode.workspace.getConfiguration('syntaxExplainer').get('enabled', true)) return;
      const line = document.lineAt(position.line).text;
      if (line.length > 2000) return; // líneas enormes (minificadas): no merece la pena
      const r = explainAt(line, position.character, document.languageId);
      if (!r) return;
      const md = new vscode.MarkdownString();
      md.appendMarkdown('**');
      md.appendText(r.word);
      md.appendMarkdown('** — ');
      md.appendText(r.text);
      return new vscode.Hover(md, new vscode.Range(position.line, r.start, position.line, r.end));
    }
  };
  context.subscriptions.push(vscode.languages.registerHoverProvider(Object.keys(LANG_MAP), provider));
}
function deactivate() {}
module.exports = { activate, deactivate };

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  Diagnostic,
  DiagnosticCollection,
  DiagnosticSeverity,
  ExtensionContext,
  Position,
  Range,
  TextDocument,
  Uri,
  languages,
  workspace
} from 'vscode'

import {run} from 'dockerfilelint'

let diagnosticCollection: DiagnosticCollection
let diagnosticMap: Map<string, Diagnostic[]>

const LANGUAGE_ID = 'dockerfile'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  diagnosticCollection = languages.createDiagnosticCollection('dockerlint')
  diagnosticMap = new Map()
  context.subscriptions.push(
    workspace.onDidChangeTextDocument(event => {
      if (event.document.languageId === LANGUAGE_ID) {
        lint(event.document)
      }
    })
  )

  context.subscriptions.push(
    workspace.onDidOpenTextDocument(event => {
      if (event.languageId === LANGUAGE_ID) {
        lint(event)
      }
    })
  )
}

function lint(document: TextDocument) {
  const workspaceFolder = workspace.getWorkspaceFolder(document.uri)
  let workspaceBase = ''
  if (workspaceFolder && workspaceFolder.uri.scheme === 'file') {
    workspaceBase = workspaceFolder.uri.fsPath
  }
  const text = document.getText()
  const lines = text.split(/\r?\n/)
  const items = run(workspaceBase, text)
  const diagnostics = items.map(item => {
    const line = item.line - 1
    const start = new Position(line, 0)
    const end = new Position(line, lines[line].length)
    const range = new Range(start, end)
    return new Diagnostic(range, item.description, DiagnosticSeverity.Warning)
  })
  diagnosticMap.set(document.uri.toString(), diagnostics)
  reset()
}

function reset() {
  diagnosticCollection.clear()
  diagnosticMap.forEach((diagnostic, uri) => {
    diagnosticCollection.set(Uri.parse(uri), diagnostic)
  })
}

import {
  Diagnostic,
  DiagnosticCollection,
  DiagnosticSeverity,
  ExtensionContext,
  Position,
  Range,
  TextDocument,
  languages,
  workspace
} from 'vscode'

import {run} from 'dockerfilelint'

const LANGUAGE_ID = 'dockerfile'

export function activate(context: ExtensionContext) {
  const diagnosticCollection = languages.createDiagnosticCollection('dockerfilelint')

  workspace.textDocuments.forEach(document => lint(diagnosticCollection, document))

  context.subscriptions.push(
    workspace.onDidChangeTextDocument(event => {
      if (event.document.languageId === LANGUAGE_ID) {
        lint(diagnosticCollection, event.document)
      }
    })
  )

  context.subscriptions.push(
    workspace.onDidOpenTextDocument(event => {
      if (event.languageId === LANGUAGE_ID) {
        lint(diagnosticCollection, event)
      }
    })
  )

  context.subscriptions.push(
    workspace.onDidCloseTextDocument(event => {
      if (event.languageId === LANGUAGE_ID && diagnosticCollection.has(event.uri)) {
        diagnosticCollection.delete(event.uri)
      }
    })
  )
}

export function lint(diagnosticCollection: DiagnosticCollection, document: TextDocument) {
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
  diagnosticCollection.set(document.uri, diagnostics)
}

import assert from 'assert'

import {languages, workspace} from 'vscode'

import {lint} from '../extension'

suite('lint', function() {
  test('lint() add diagnostic to diagnosticCollection', async function() {
    const diagnosticCollection = await languages.createDiagnosticCollection('dockerfilelint')
    const document = await workspace.openTextDocument({language: 'dockerfile', content: 'FROM ubuntu\n'})
    lint(diagnosticCollection, document)
    const diagnostic = diagnosticCollection.get(document.uri)
    if (!diagnostic) {
      return assert(false, 'lint not create diagnostic')
    }
    assert(diagnostic.length, 'Not report any lint error')
  })
})

import test from 'tape'
import { languages, workspace } from 'vscode'

import { lint } from '../extension'

test('link() add diagnostic to diagnosticCollection', async (t) => {
  t.plan(2)
  const diagnosticCollection = await languages.createDiagnosticCollection('dockerfilelint')
  const document = await workspace.openTextDocument({ language: 'dockerfile', content: 'FROM ubuntu\n' })
  lint(diagnosticCollection, document)
  const diagnostic = diagnosticCollection.get(document.uri)
  t.assert(diagnostic, 'lint not create diagnostic')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  t.assert(diagnostic!.length > 0, 'Not report any lint error')
})

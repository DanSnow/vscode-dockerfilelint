import assert from 'assert'
import { languages, workspace } from 'vscode'

import { lint } from '../extension'

/*
Here just put the assert in `run` because:
1. I can't require external package in VSCode if we are using Yarn PnP
2. I can't not find a test harness which support reporting about all of the test is finished and also able to bundle with webpack

[tape](https://github.com/substack/tape) is possibly the closest one which I want. But the `test.onFailure` seems not working for me.
*/
export async function run(): Promise<void> {
  const diagnosticCollection = await languages.createDiagnosticCollection('dockerfilelint')
  const document = await workspace.openTextDocument({ language: 'dockerfile', content: 'FROM ubuntu\n' })
  lint(diagnosticCollection, document)
  const diagnostic = diagnosticCollection.get(document.uri)
  assert(diagnostic, 'lint not create diagnostic')
  assert(diagnostic.length > 0, 'Not report any lint error')
}

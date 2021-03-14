import assert from 'assert'
import { promises } from 'fs'

import { readmePath, updateReadme } from './sync-changelog'

const { readFile } = promises

async function main() {
  const currentContent = await readFile(readmePath, 'utf8')
  const updatedContent = await updateReadme()
  assert(currentContent === updatedContent, 'Release Notes has NOT updated')
}

main().catch(console.error)

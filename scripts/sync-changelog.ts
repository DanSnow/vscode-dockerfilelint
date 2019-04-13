import dedent from 'dedent'
import {promises} from 'fs'
import {resolve} from 'path'

const {readFile, writeFile} = promises
const changelogPath = resolve(__dirname, '../CHANGELOG.md')
export const readmePath = resolve(__dirname, '../README.md')

interface Changelog {
  version: string
  content: string[]
}

async function main() {
  const updatedReadme = await updateReadme()
  await writeFile(readmePath, updatedReadme)
}

export async function updateReadme(): Promise<string> {
  const changelogContent = await readFile(changelogPath, 'utf8')
  const changelog = parse(changelogContent.split('\n')).filter(({version}) => version.toLowerCase() !== 'unrelease')
  const readmeContent = await readFile(readmePath, 'utf8')
  const readme = readmeContent.split(/(\n)/)
  const releaseNoteStart = readme.findIndex(line => line.trim().toLowerCase() === 'release notes') + 4
  return readme.slice(0, releaseNoteStart).join('') + '\n' + toReleaseNote(changelog)
}

function toReleaseNote(changelog: Changelog[]): string {
  return (
    changelog
      .map(
        ({version, content}) => dedent`
        ### ${version}

        ${content.map(line => `${line}\n`).join()}
        `
      )
      .join('\n\n') + '\n'
  )
}

function parse(changelog: string[]): Changelog[] {
  const result: Changelog[] = []
  let current: Changelog | undefined
  for (let i = 0; i < changelog.length; ++i) {
    if (!changelog[i].trim()) {
      continue
    }
    if (changelog[i].match(/--+/)) {
      if (current) {
        result.push(current)
      }
      current = {
        version: changelog[i - 1].trim(),
        content: []
      }
    } else if (current && !changelog[i + 1].match(/--+/)) {
      current.content.push(changelog[i])
    }
  }
  if (current) {
    result.push(current)
  }
  return result
}

if (require.main === module) {
  main().catch(console.error)
}

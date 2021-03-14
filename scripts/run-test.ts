import { resolve } from 'path'
import { runTests } from 'vscode-test'

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = resolve(__dirname, '../dist')

    // The path to the extension test runner script
    // Passed to --extensionTestsPath
    const extensionTestsPath = resolve(__dirname, '../out/test.js')

    // Download VS Code, unzip it and run the integration test
    await runTests({ extensionDevelopmentPath, extensionTestsPath })
  } catch (err) {
    console.error('Error:', err)
    console.error('Failed to run tests')
    process.exit(1)
  }
}

main()

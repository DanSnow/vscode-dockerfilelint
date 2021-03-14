import test from 'tape'

export async function run(): Promise<void> {
  return new Promise((resolve, reject) => {
    importAll(require.context('.', true, /\.test\.ts$/))
    test.onFailure(() => reject(new Error('test failed')))
    test.onFinish(resolve)
  })
}

function importAll(r: ReturnType<typeof require.context>): void {
  r.keys().forEach(r)
}

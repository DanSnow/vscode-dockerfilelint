import { resolve } from 'path'
import { Configuration } from 'webpack'

const baseConfig: Configuration = {
  target: 'node',
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
}

const config: Configuration[] = [
  {
    name: 'extension',
    mode: 'production',
    devtool: 'source-map',
    optimization: {
      minimize: false,
    },

    entry: './src/extension.ts',
    output: {
      path: resolve(__dirname, 'dist'),
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    ...baseConfig,
  },
  {
    name: 'test',
    mode: 'development',
    devtool: false,

    entry: './src/test/index.ts',
    output: {
      path: resolve(__dirname, 'out'),
      filename: 'test.js',
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    ...baseConfig,
  },
]

export default config

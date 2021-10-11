import path from 'path'
import { createServer } from './modules/http-server'
import { CssPlugin } from './plugins/css'
import { TypescriptPlugin } from './plugins/typescript'
import { ICometConfig } from './types'

main()

async function main () {
  const cometConfig: ICometConfig = {
    entry: path.resolve(process.cwd(), './src/index.html'),

    devServer: {
      host: '0.0.0.0',
      port: 8080
    },

    resolves: ['.ts', '.tsx'],

    plugins: [
      TypescriptPlugin({
        jsc: {
          parser: {
            syntax: 'typescript',
            dynamicImport: true,
            decorators: true
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true
          }
        }
      }),

      CssPlugin()
    ]
  }

  createServer(cometConfig)
}

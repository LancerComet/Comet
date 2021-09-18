import path from 'path'
import { createServer } from './modules/http-server'
import { ICometConfig } from './types'

main()

/**
 * TODO：
 * 1. 启动 Http 服务器.
 * 2. 把文件打包，按文件路径生成 src，并保存在内存里.
 * 3. 加入钩子, 处理不同类型文件.
 */
async function main () {
  const cometConfig: ICometConfig = {
    entry: path.resolve(process.cwd(), './src/index.html'),
    devServer: {
      host: '0.0.0.0',
      port: 8080
    },
    resolves: ['.ts', '.tsx'],
    swcConfig: {
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
    }
  }
  createServer(cometConfig)
}

/**
 * 创建 Http 服务器.
 */

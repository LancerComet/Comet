import http from 'http'
import path from 'path'
import * as swc from '@swc/core'
import { watchFile } from './modules/file-watcher'
import { getFileAbsolutePath, isFileExistAsync, readFileAsync } from './modules/fs'
import { isMemFileExist, readMemFile, writeMemFile } from './modules/memfs'
import { ICometOption } from './types'

const cometConfig: ICometOption = {
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

main()

/**
 * TODO：
 * 1. 启动 Http 服务器.
 * 2. 把文件打包，按文件路径生成 src，并保存在内存里.
 * 3. 加入钩子, 处理不同类型文件.
 */
async function main () {
  createServer(
    cometConfig.devServer.host,
    cometConfig.devServer.port,
    cometConfig.entry
  )
}

/**
 * 创建 Http 服务器.
 */
function createServer (host: string, port: number, entryHtml: string) {
  const server = http.createServer(async (req, res) => {
    const relativePath = '.' + (req.url?.replace(/\?.+/, '') ?? '')

    if (relativePath === './' || relativePath === '.') {
      const indexFile = await readFileAsync(entryHtml)
      res.writeHead(200)
      res.end(indexFile)
      return
    }

    const absoluteFilePath = await resolveFilePath(getFileAbsolutePath(relativePath))
    if (!isMemFileExist(relativePath)) {
      const build = async () => {
        const buildResult = await buildFile(absoluteFilePath)
        if (buildResult) {
          writeMemFile(relativePath, buildResult.contentType, buildResult.content)
        }
      }
      watchFile(absoluteFilePath, build)
      await build()
    }

    if (isMemFileExist(relativePath)) {
      const file = readMemFile(relativePath)!
      res.writeHead(200, {
        'Content-Type': file.contentType
      })
      res.end(file.content)
      return
    }

    res.writeHead(404)
    res.end('not found')
  })

  server.listen(port, host, () => {
    console.log(`Server is on at ${host}:${port}.`)
  })
}

async function buildFile (filePath: string) {
  switch (true) {
    case /\.tsx?$/.test(filePath): {
      const fileContent = await buildTsFile(filePath)
      return {
        contentType: 'text/javascript',
        content: fileContent
      }
    }

    default: {
      return null
    }
  }
}

async function resolveFilePath (filePath: string): Promise<string> {
  if (!/\.\w+$/.test(filePath)) {
    for (const extension of cometConfig.resolves) {
      const newFilePath = filePath + extension
      if (await isFileExistAsync(newFilePath)) {
        return newFilePath
      }
    }
  }
  return filePath
}

async function buildTsFile (filepath: string): Promise<string> {
  const fileContent = await readFileAsync(filepath)
  const output = await swc.transform(fileContent, cometConfig.swcConfig)
  return output.code
}

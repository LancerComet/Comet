import http from 'http'
import * as swc from '@swc/core'
import { Options } from '@swc/core'
import { ICometConfig } from '../types'
import { watchFile } from './file-watcher'
import { getFileAbsolutePath, isFileExistAsync, readFileAsync } from './fs'
import { isMemFileExist, readMemFile, writeMemFile } from './memfs'

function createServer (cometConfig: ICometConfig) {
  const server = http.createServer(async (req, res) => {
    const relativePath = '.' + (req.url?.replace(/\?.+/, '') ?? '')

    if (relativePath === './' || relativePath === '.') {
      const entryHtml = cometConfig.entry
      const indexFile = await readFileAsync(entryHtml)
      res.writeHead(200)
      res.end(indexFile)
      return
    }

    const absoluteFilePath = await resolveFilePath(
      getFileAbsolutePath(relativePath),
      cometConfig.resolves
    )

    if (!isMemFileExist(relativePath)) {
      const build = async () => {
        const buildResult = await buildFile(absoluteFilePath, cometConfig)
        if (buildResult) {
          writeMemFile(relativePath, buildResult.contentType, buildResult.content)
        }
        console.log('File build complete:', absoluteFilePath)
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

  const { host, port } = cometConfig.devServer
  server.listen(port, host, () => {
    console.log(`Server is on at ${host}:${port}.`)
  })
}

export {
  createServer
}

async function buildFile (filePath: string, cometConfig: ICometConfig) {
  switch (true) {
    case /\.tsx?$/.test(filePath): {
      const fileContent = await buildTsFile(filePath, cometConfig.swcConfig)
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

async function buildTsFile (filepath: string, swcConfig: Options): Promise<string> {
  const fileContent = await readFileAsync(filepath)
  const output = await swc.transform(fileContent, swcConfig)
  return output.code
}

async function resolveFilePath (
  filePath: string,
  resolves: string[]
): Promise<string> {
  if (!/\.\w+$/.test(filePath)) {
    for (const extension of resolves) {
      const newFilePath = filePath + extension
      if (await isFileExistAsync(newFilePath)) {
        return newFilePath
      }
    }
  }
  return filePath
}

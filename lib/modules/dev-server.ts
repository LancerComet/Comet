import { createReadStream } from 'fs'
import http, { IncomingMessage, ServerResponse } from 'http'
import { ICometConfig } from '../types'
import { watchFile } from '../utils/file-watcher'
import { getFileAbsolutePath, isFileExistAsync, readFileAsTextAsync } from '../utils/fs'
import { isMemFileExist, readMemFile, writeMemFile } from '../utils/memfs'
import { resolveFilePath } from '../utils/path'

function createDevServer (cometConfig: ICometConfig) {
  const server = http.createServer(async (req, res) => {
    const fileUrl = '.' + (req.url?.replace(/\?.+/, '') ?? '')

    if (fileUrl === './' || fileUrl === '.') {
      return await handleRootPath(cometConfig, req, res)
    }

    const filePath = await resolveFilePath(
      getFileAbsolutePath(fileUrl),
      cometConfig.resolves
    )

    if (!isMemFileExist(fileUrl) && await isFileExistAsync(filePath)) {
      await buildFile(cometConfig, fileUrl, filePath)
    }

    if (isMemFileExist(fileUrl)) {
      const isFileSent = await returnMemoryFile(fileUrl, res)
      if (isFileSent) {
        return
      }
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
  createDevServer
}

async function handleRootPath (config: ICometConfig, req: IncomingMessage, res: ServerResponse) {
  const entryHtml = config.entry
  const indexFile = await readFileAsTextAsync(entryHtml)
  res.writeHead(200)
  res.end(indexFile)
}

async function buildFile (
  config: ICometConfig,
  fileUrl: string,
  filePath: string
) {
  const buildExec = async () => {
    const plugins = config.plugins ?? []

    for (const plugin of plugins) {
      const buildResult = await plugin({
        mode: 'dev',
        fileUrl,
        filePath
      })

      if (buildResult !== null) {
        const contentType = buildResult.contentType ?? 'text/javascript'
        writeMemFile(fileUrl, filePath, contentType, buildResult.content)
        console.log('File build complete:', filePath)
        break
      }
    }
  }

  watchFile(filePath, buildExec)
  await buildExec()
}

async function returnMemoryFile (
  fileUrl: string,
  res: ServerResponse
): Promise<boolean> {
  const file = readMemFile(fileUrl)!
  res.writeHead(200, {
    'Content-Type': file.contentType
  })

  if (typeof file.content === 'string') {
    res.end(file.content)
    return true
  }

  // File reading operation must be double checked.
  if (await isFileExistAsync(file.filePath)) {
    const stream = createReadStream(file.filePath)
    stream.pipe(res)
    return true
  }

  return false
}

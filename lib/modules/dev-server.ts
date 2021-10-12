import http from 'http'
import { ICometConfig } from '../types'
import { resolveFilePath } from '../utils'
import { watchFile } from '../utils/file-watcher'
import { getFileAbsolutePath, isFileExistAsync, readFileAsTextAsync } from '../utils/fs'
import { isMemFileExist, readMemFile, writeMemFile } from '../utils/memfs'

function createDevServer (cometConfig: ICometConfig) {
  const server = http.createServer(async (req, res) => {
    const fileUrl = '.' + (req.url?.replace(/\?.+/, '') ?? '')

    if (fileUrl === './' || fileUrl === '.') {
      const entryHtml = cometConfig.entry
      const indexFile = await readFileAsTextAsync(entryHtml)
      res.writeHead(200)
      res.end(indexFile)
      return
    }

    const filePath = await resolveFilePath(
      getFileAbsolutePath(fileUrl),
      cometConfig.resolves
    )

    if (await isFileExistAsync(filePath)) {
      const buildFile = async () => {
        const plugins = cometConfig.plugins ?? []

        for (const plugin of plugins) {
          const buildResult = await plugin({
            fileUrl,
            filePath
          })

          if (buildResult !== null) {
            const contentType = buildResult.contentType ?? 'text/javascript'
            writeMemFile(fileUrl, contentType, buildResult.content)
            console.log('File build complete:', filePath)
            break
          }
        }
      }

      watchFile(filePath, buildFile)
      await buildFile()
    }

    if (isMemFileExist(fileUrl)) {
      const file = readMemFile(fileUrl)!
      res.writeHead(200, {
        'Content-Type': file.contentType
      })

      if (typeof file.content === 'string') {
        res.end(file.content)
      } else {
        file.content.pipe(res)
      }
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
  createDevServer
}

import http from 'http'
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

    if (await isFileExistAsync(absoluteFilePath)) {
      const buildFile = async () => {
        const plugins = cometConfig.plugins ?? []
        const filePath = absoluteFilePath
        const fileContent = await readFileAsync(filePath)

        for (const plugin of plugins) {
          const buildResult = await plugin({
            filePath,
            fileContent
          })

          if (buildResult !== null) {
            writeMemFile(relativePath, buildResult.contentType, buildResult.content)
            console.log('File build complete:', absoluteFilePath)
            break
          }
        }
      }

      watchFile(absoluteFilePath, buildFile)
      await buildFile()
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

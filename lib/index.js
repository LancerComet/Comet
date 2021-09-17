const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')
const swc = require('@swc/core')

const { readFileAsync, existAsync} = require('./modules/fs')

const CWD_PATH = process.cwd()
const FILE_CACHE_POOL = {
  __example: {
    contentType: '',
    content: ''
  }
}

const entryHtml = path.resolve(CWD_PATH, './src/index.html')
const resolves = ['.ts', '.tsx']

const swcConfig = {
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

main()

/**
 * TODO：
 * 1. 启动 Http 服务器.
 * 2. 把文件打包，按文件路径生成 src，并保存在内存里.
 */
async function main () {
  createServer(8080, entryHtml)
}

/**
 * 创建 Http 服务器.
 *
 * @param port
 * @param entryHtml
 */
function createServer (
  port = 8080,
  entryHtml = ''
) {
  const requestListener = async (req, res) => {
    const path = req.url.replace(/\?.+/, '')

    if (path === '/') {
      const indexFile = fs.readFileSync(entryHtml)
      res.writeHead(200)
      res.end(indexFile)
      return
    }

    if (!FILE_CACHE_POOL[path]) {
      const buildResult = await buildFile(path)
      if (buildResult) {
        FILE_CACHE_POOL[path] = buildResult
      }
    }

    if (FILE_CACHE_POOL[path]) {
      res.writeHead(200, {
        'Content-Type': FILE_CACHE_POOL[path].contentType
      })
      res.end(FILE_CACHE_POOL[path].content)
      return
    }

    res.writeHead(404)
    res.end('not found')
  }

  const server = http.createServer(requestListener)
  server.listen(port)
}

async function buildFile (fileUrl = '') {
  let filePath = path.resolve(CWD_PATH, '.' + fileUrl)

  if (!/\.\w+$/.test(fileUrl)) {
    for (const extension of resolves) {
      const newFileUrl = fileUrl + extension
      const newFilePath = path.resolve(CWD_PATH, '.' + newFileUrl)
      if (await existAsync(newFilePath)) {
        filePath = newFilePath
        break
      }
    }
  }

  switch (true) {
    case /\.tsx?$/.test(filePath):
      const fileContent = await buildTsFile(filePath)
      return {
        contentType: 'text/javascript',
        content: fileContent
      }

    default:
      return null
  }
}

async function buildTsFile (filepath = '') {
  const fileContent = await readFileAsync(filepath)
  const output = await swc.transform(fileContent, swcConfig)
  return output.code
}

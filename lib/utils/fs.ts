import { promises, stat, createReadStream } from 'fs'
import path from 'path'

const CWD_PATH = process.cwd()

function readFileAsTextAsync (filePath: string) {
  return promises.readFile(filePath, {
    encoding: 'utf-8'
  })
}

function readFileAsStream (filePath: string) {
  const readStream = createReadStream(filePath)
  readStream.setEncoding('utf-8')
  return readStream
}

function isFileExistAsync (filePath: string) {
  return new Promise(resolve => {
    stat(filePath, (error, stats) => {
      if (!error && stats) {
        const isExist = stats.isFile()
        resolve(isExist)
      } else {
        resolve(false)
      }
    })
  })
}

function getFileAbsolutePath (relativePath: string): string {
  return path.resolve(CWD_PATH, relativePath)
}

export {
  readFileAsTextAsync,
  readFileAsStream,
  isFileExistAsync,
  getFileAbsolutePath
}

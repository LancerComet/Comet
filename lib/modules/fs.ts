import { promises, stat } from 'fs'

const readFileAsync = (filePath: string) => promises.readFile(filePath, {
  encoding: 'utf-8'
})

const isFileExistAsync = (filePath: string) => new Promise(resolve => {
  stat(filePath, (error, stats) => {
    if (!error && stats) {
      const isExist = stats.isFile()
      resolve(isExist)
    }
  })
})

export {
  readFileAsync,
  isFileExistAsync
}

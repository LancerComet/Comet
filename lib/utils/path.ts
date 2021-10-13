import { isFileExistAsync } from './fs'

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

export {
  resolveFilePath
}

import { Stream } from 'stream'

interface IMemFileItem {
  contentType: string
  content: string | Stream
}

const FILE_CACHE: { [filePath: string]: IMemFileItem } = {}

function readMemFile (filePath: string): IMemFileItem | undefined {
  return FILE_CACHE[filePath]
}

function writeMemFile (filePath: string, contentType: string, content: string | Stream) {
  if (!isMemFileExist(filePath)) {
    FILE_CACHE[filePath] = {
      contentType,
      content
    }
  } else {
    FILE_CACHE[filePath].contentType = contentType
    FILE_CACHE[filePath].content = content
  }
}

const isMemFileExist = (filePath: string) => typeof FILE_CACHE[filePath] !== 'undefined'

export {
  readMemFile,
  writeMemFile,
  isMemFileExist
}

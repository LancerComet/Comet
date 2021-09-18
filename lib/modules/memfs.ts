interface IMemFileItem {
  contentType: string
  content: string
}

const FILE_CACHE: { [filePath: string]: IMemFileItem } = {}

const readMemFile = (filePath: string): IMemFileItem | undefined => {
  return FILE_CACHE[filePath]
}

const writeMemFile = (filePath: string, contentType: string, content: string) => {
  if (!isMemFileExist(filePath)) {
    FILE_CACHE[filePath] = {
      contentType,
      content
    }
  }
}

const isMemFileExist = (filePath: string) => typeof FILE_CACHE[filePath] !== 'undefined'

export {
  readMemFile,
  writeMemFile,
  isMemFileExist
}

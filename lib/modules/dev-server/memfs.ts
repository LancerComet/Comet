interface IMemFileItem {
  filePath: string
  contentType: string
  content?: string
}

const FILE_CACHE: { [id: string]: IMemFileItem } = {}

function readMemFile (id: string): IMemFileItem | undefined {
  return FILE_CACHE[id]
}

/**
 * Add memory file.
 *
 * @param id The ID to indicate this file.
 * @param filePath The real file path.
 * @param contentType Content type of this file.
 * @param content The text content of this file. Undefined is allowed.
 */
function writeMemFile (
  id: string,
  filePath: string,
  contentType: string,
  content?: string
) {
  FILE_CACHE[id] = {
    filePath,
    contentType,
    content
  }
}

const isMemFileExist = (id: string) => {
  return typeof FILE_CACHE[id] !== 'undefined'
}

export {
  readMemFile,
  writeMemFile,
  isMemFileExist
}

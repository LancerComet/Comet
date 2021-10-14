import crypto, { BinaryLike } from 'crypto'

import { isMemFileExist, writeMemFile } from '../modules/dev-server/memfs'
import { CometPlugin } from '../types'
import { readFileAsBuffer } from '../utils/fs'

const FILE_REGEXP = /\.(jpe?g|png|gif|bmp)$/
const EXT_REGEXP = /\.[0-9a-z]+$/i

const ImagePlugin = (): CometPlugin => {
  return async context => {
    const { filePath } = context
    if (!FILE_REGEXP.test(filePath)) {
      return null
    }

    const ext = filePath.match(EXT_REGEXP)?.[0] ?? ''
    const imageId = `${hashContent(filePath)}${ext}`
    const imagePath = `./${imageId}`
    if (!isMemFileExist(imagePath)) {
      const contentType = await getContentType(filePath)
      writeMemFile(imagePath, filePath, contentType)
    }

    const content = `export default '${imageId}'`
    return {
      content
    }
  }
}

export {
  ImagePlugin
}

async function getContentType (filePath: string): Promise<string> {
  const fileBuffer = await readFileAsBuffer(filePath)
  let header = ''
  for (let i = 0; i < 4; i++) {
    header += fileBuffer[i].toString(16)
  }

  switch (header) {
    case '89504e47':
      return 'image/png'

    case '47494638':
      return 'image/gif'

    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg'

    default:
      return 'application/octet-stream'
  }
}

function hashContent (content: string | BinaryLike): string {
  const md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

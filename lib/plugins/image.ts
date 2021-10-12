import crypto, { BinaryLike } from 'crypto'
import { createReadStream } from 'fs'

import { CometPlugin } from '../types'
import { isMemFileExist, writeMemFile } from '../utils/memfs'

const FILE_REGEXP = /\.(jpe?g|png|gif|bmp)$/
const EXT_REGEXP = /\.[0-9a-z]+$/i

const ImagePlugin = (): CometPlugin => {
  return async context => {
    const { filePath } = context
    if (!FILE_REGEXP.test(filePath)) {
      return null
    }

    const ext = filePath.match(EXT_REGEXP)?.[0] ?? ''
    const hash = `${hashContent(filePath)}${ext}`
    if (!isMemFileExist(hash)) {
      const stream = createReadStream(filePath)
      const contentType = getContentType(filePath)
      writeMemFile(`./${hash}`, contentType, stream)
    }

    const content = `export default '${hash}'`

    return {
      content
    }
  }
}

export {
  ImagePlugin
}

function getContentType (filePath: string): string {
  if (filePath.endsWith('jpg') || filePath.endsWith('jpeg')) {
    return 'image/jpeg'
  }

  if (filePath.endsWith('png')) {
    return 'image/png'
  }

  if (filePath.endsWith('gif')) {
    return 'image/gif'
  }

  if (filePath.endsWith('bmp')) {
    return 'image/bmp'
  }

  return 'application/octet-stream'
}

function hashContent (content: string | BinaryLike): string {
  const md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

import { BinaryLike, createHash } from 'crypto'

function md5String (content: string | BinaryLike): string {
  const md5 = createHash('md5')
  return md5.update(content).digest('hex')
}

export {
  md5String
}

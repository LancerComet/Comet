import * as swc from '@swc/core'

interface ICometOption {
  entry: string
  devServer: {
    host: string
    port: number
  }
  swcConfig: swc.Options
  resolves: string[]
}

export {
  ICometOption
}

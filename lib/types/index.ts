import * as swc from '@swc/core'

interface ICometConfig {
  entry: string
  devServer: {
    host: string
    port: number
  }
  swcConfig: swc.Options
  resolves: string[]
}

export {
  ICometConfig
}

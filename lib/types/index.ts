interface ICometPluginContext {
  filePath: string
  fileContent: string
}

interface ICometPluginOutput {
  contentType: string
  content: string
}

type CometPlugin = (context: ICometPluginContext) => Promise<ICometPluginOutput | null>

interface ICometConfig {
  entry: string
  devServer: {
    host: string
    port: number
  }
  resolves: string[]
  plugins?: CometPlugin[]
}

export {
  ICometConfig,
  ICometPluginContext,
  CometPlugin
}

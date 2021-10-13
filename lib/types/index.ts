/**
 * 插件上下文对象.
 */
interface ICometPluginContext {
  mode: 'dev' | 'build'

  /**
   * 文件请求 URL.
   *
   * @example /my-awesome-photo.png
   */
  fileUrl: string

  /**
   * 文件的本机路径.
   * @example C:\my-project\src\assets\my-awesome-photo.png
   */
  filePath: string
}

interface ICometPluginOutput {
  contentType?: string
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

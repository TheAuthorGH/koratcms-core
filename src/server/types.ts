import {Server} from 'http';

export interface KoratPlugin {
  attach: (server: KoratServer) => void
}

export interface KoratServerConfig {
  port: number
}

export interface KoratServer {
  server: Server | null,

  start: (serverConfig: KoratServerConfig) => Promise<void>,
  stop: () => Promise<void>,
  attachPlugin: (plugin: KoratPlugin) => void
}

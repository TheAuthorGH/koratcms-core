import {Server} from 'http';
import {Express} from 'express';

export interface KoratPlugin {
  name: string,

  attachEndpoints?: (server: Express, middleware: object) => void
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

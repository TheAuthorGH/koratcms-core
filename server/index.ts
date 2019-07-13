import express from 'express';
import {Server} from 'http';

interface KoratPlugin {
  attach: (server: KoratServer) => void
}

interface KoratServerConfig {
  port: number
}

interface KoratServer {
  server: Server | null,

  start: (serverConfig: KoratServerConfig) => Promise<void>,
  stop: () => Promise<void>,
  attachPlugin: (plugin: KoratPlugin) => void
}

const createServer = (): KoratServer => {
  const expressApp = express();

  return {
    server: null,

    async start(serverConfig: KoratServerConfig) {
      this.server = await new Promise((resolve, reject) => {
        expressApp
          .listen(serverConfig.port, resolve)
          .on('error', reject);
      });
    },
    async stop() {
      await new Promise((resolve, reject) => {
        this.server && this.server.close((err) => {
          if(err) reject(err);
          else resolve();
        });
      });
    },

    attachPlugin(plugin: KoratPlugin) {
      plugin.attach(this);
    }
  };
};

export default {createServer};

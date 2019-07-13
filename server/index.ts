import express from 'express';
import {Server} from 'http';

interface KoratPlugin {
  attach: (server: KoratServer) => void
}

interface KoratServerConfig {
  port: number
}

interface KoratServer {
  router: any,

  start: (serverConfig: KoratServerConfig) => Promise<void>,
  stop: () => Promise<void>,
  attachPlugin: (plugin: KoratPlugin) => void
}

const createServer = (): KoratServer => {
  const router = express();

  let server: Server;

  return {
    router,

    async start(serverConfig: KoratServerConfig) {
      server = await new Promise((resolve, reject) => {
        router
          .listen(serverConfig.port, resolve)
          .on('error', reject);
      });
    },
    async stop() {
      await new Promise((resolve, reject) => {
        server.close((err) => {
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

import express from 'express';
import { KoratServer, KoratServerConfig, KoratPlugin } from './types';

export function createServer(): KoratServer {
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
      plugin.attachEndpoints && plugin.attachEndpoints(expressApp, {
        static: express.static
      });
    }
  };
};

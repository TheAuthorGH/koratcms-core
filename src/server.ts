import {Express} from 'express';
import {Server} from 'http';
import {KoratCore} from './core';

import express from 'express';

export interface KoratServerConfig {
  port: number
}

export interface KoratServer {
  httpServer: Server | null,
  expressApp: Express,

  start: (serverConfig: KoratServerConfig) => Promise<void>,
  stop: () => Promise<void>,
}

export function createServer(core: KoratCore): KoratServer {
  return {
    httpServer: null,
    expressApp: express(),

    async start(serverConfig) {
      this.httpServer = await new Promise((resolve, reject) => {
        this.expressApp
          .listen(serverConfig.port, resolve)
          .on('error', reject);
      });
    },

    async stop() {
      await new Promise((resolve, reject) => {
        this.httpServer && this.httpServer.close((err) => {
          if(err) reject(err);
          else resolve();
        });
      });
    }
  }
}

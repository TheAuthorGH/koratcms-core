import {Server} from 'http';
import express, {Express} from 'express';
import mongoose, {Connection} from 'mongoose';
import {KoratCore} from './core';

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

export interface KoratServerConfig {
  port: number,
  dbUrl: string,
}

export interface KoratServer {
  httpServer: Server | null,
  mongooseConnection: Connection | null
  expressApp: Express,
  middleware: Record<string, Function>,

  start: (serverConfig: KoratServerConfig) => Promise<void>,
  stop: () => Promise<void>,
  addMiddleware: (key: string, middleware: Function) => void,
}

export function createServer(core: KoratCore): KoratServer {
  return {
    httpServer: null,
    mongooseConnection: null,
    expressApp: express(),
    middleware: {
      static: express.static
    },

    async start(serverConfig) {
      this.mongooseConnection = await mongoose.createConnection(`mongodb://${serverConfig.dbUrl}`);
      this.httpServer = await new Promise((resolve, reject) => {
        this.expressApp
          .listen(serverConfig.port, resolve)
          .on('error', reject);
      });
    },

    async stop() {
      this.mongooseConnection && await this.mongooseConnection.close();
      await new Promise((resolve, reject) => {
        this.httpServer && this.httpServer.close((err) => {
          if(err) reject(err);
          else resolve();
        });
      });
    },

    addMiddleware(key, middleware) {
      this.middleware[key] = middleware;
    }
  }
}

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
  running: boolean,
  httpServer: Server | null,
  mongooseConnection: Connection | null,
  expressApp: Express,
  middleware: Record<string, Function>,

  start: (serverConfig: KoratServerConfig) => Promise<void>,
  stop: () => Promise<void>,
  afterStart: (handler: () => Promise<void>) => void,
  beforeStop: (handler: () => Promise<void>) => void,
  addMiddleware: (key: string, middleware: Function) => void,
}

export function createServer(core: KoratCore): KoratServer {
  const afterStartHandlers: (() => Promise<void>)[] = [];
  const beforeStopHandlers: (() => Promise<void>)[] = [];

  return {
    running: false,
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
          .on('error', (error) => {
            reject(error);
            this.running = false;
          });
      });

      this.running = true;
      await Promise.all(afterStartHandlers.map(handler => handler()));
    },

    async stop() {
      await Promise.all(beforeStopHandlers.map(handler => handler()));

      this.mongooseConnection && await this.mongooseConnection.close();
      this.httpServer && await new Promise((resolve, reject) => {
        this.httpServer!.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      this.running = false;
    },

    afterStart(handler) {
      afterStartHandlers.push(handler);
    },

    beforeStop(handler) {
      beforeStopHandlers.push(handler);
    },

    addMiddleware(key, middleware) {
      this.middleware[key] = middleware;
    }
  }
}

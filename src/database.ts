import {KoratCore} from "./core";
import {Schema, Model, Document} from "mongoose";

export interface KoratDatabaseManager {
  createModel: <T extends Document> (name: string, schema: Schema) => void,
  getModel: <T extends Document> (name: string) => Model<T>,
}

export function createDatabaseManager(core: KoratCore): KoratDatabaseManager {
  const {server, events} = core;

  return {
    createModel(name, schema) {
      const {mongooseConnection} = server;

      if(!server.running) {
        events.listen('server-started', () => this.createModel(name, schema));
        return;
      }
      if (!mongooseConnection)
        throw new Error('No mongoose database connection available.');

      mongooseConnection.model(name, schema);
    },

    getModel(name) {
      const {mongooseConnection} = server;
      if (!mongooseConnection)
        throw new Error('No mongoose database connection available.');

      return mongooseConnection.model(name);
    }
  };
}

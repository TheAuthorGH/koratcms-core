import {KoratCore} from "./core";
import {Schema, Model, Document} from "mongoose";

export interface KoratDatabaseManager {
  createModel: <T extends Document> (name: string, schema: Schema) => Model<T>,
  getModel: <T extends Document> (name: string) => Model<T>
}

export function createDatabaseManager(core: KoratCore): KoratDatabaseManager {
  return {
    createModel(name, schema) {
      const {mongooseConnection} = core.server;
      if(!mongooseConnection)
        throw Error('No mongoose database connection available.');

      return mongooseConnection.model(name, schema);
    },
    getModel(name) {
      const {mongooseConnection} = core.server;
      if(!mongooseConnection)
        throw Error('No mongoose database connection available.');

      return mongooseConnection.model(name);
    }
  };
}

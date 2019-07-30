import {KoratCore} from "./core";
import {Schema, Model, Document} from "mongoose";

export interface KoratDatabaseManager {
  createModel: <T extends Document> (name: string, schema: Schema) => Model<T>,
  getModel: <T extends Document> (name: string) => Model<T>
}

export function createDatabaseManager(core: KoratCore): KoratDatabaseManager {
  return {
    createModel(name, schema) {
      if(!core.server.mongooseConnection)
        throw Error('No mongoose database connection available.');

      return core.server.mongooseConnection.model(name, schema);
    },
    getModel(name) {
      if(!core.server.mongooseConnection)
        throw Error('No mongoose database connection available.');

      return core.server.mongooseConnection.model(name);
    }
  };
}

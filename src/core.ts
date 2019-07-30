import {KoratServer, createServer} from './server';
import {KoratPluginManager, createPluginManager} from './plugins';
import {KoratDatabaseManager, createDatabaseManager} from "./database";

export class KoratCore {
  server: KoratServer = createServer(this);
  databaseManager: KoratDatabaseManager = createDatabaseManager(this);
  plugins: KoratPluginManager = createPluginManager(this);
}

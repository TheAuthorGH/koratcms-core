import {KoratServer, createServer} from './server';
import {KoratDatabaseManager, createDatabaseManager} from './database';
import {KoratEventManager, createEventManager} from './events';
import {KoratPluginManager, createPluginManager} from './plugins';

export class KoratCore {
  events: KoratEventManager = createEventManager(this);
  server: KoratServer = createServer(this);
  databaseManager: KoratDatabaseManager = createDatabaseManager(this);
  plugins: KoratPluginManager = createPluginManager(this);
}

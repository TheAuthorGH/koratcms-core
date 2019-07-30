import {KoratServer, createServer} from './server';
import {KoratDatabaseManager, createDatabaseManager} from './database';
import {KoratEventManager, createEventManager} from './events';
import {KoratPluginManager, createPluginManager} from './plugins';
import {KoratConfig, createConfig} from './config';

export class KoratCore {
  events: KoratEventManager = createEventManager(this);
  server: KoratServer = createServer(this);
  databaseManager: KoratDatabaseManager = createDatabaseManager(this);
  config: KoratConfig = createConfig(this);
  plugins: KoratPluginManager = createPluginManager(this);
}

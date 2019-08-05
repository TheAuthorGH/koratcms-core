import {KoratServer, createServer} from './server';
import {KoratPluginManager, createPluginManager} from './plugins';
import {KoratConfig, createConfig} from './config';
import {KoratEntityManager, createEntityManager} from './entities';

export class KoratCore {
  server: KoratServer = createServer(this);
  config: KoratConfig = createConfig(this);
  entities: KoratEntityManager = createEntityManager(this);
  plugins: KoratPluginManager = createPluginManager(this);
}

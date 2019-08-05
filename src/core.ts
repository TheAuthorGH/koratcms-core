import {KoratServer, createServer} from './server';
import {KoratPluginManager, createPluginManager} from './plugins';
import {KoratConfig, createConfig} from './config';

export class KoratCore {
  server: KoratServer = createServer(this);
  config: KoratConfig = createConfig(this);
  plugins: KoratPluginManager = createPluginManager(this);
}

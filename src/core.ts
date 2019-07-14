import { KoratServer, createServer } from './server';
import { KoratPluginManager, createPluginManager } from './plugins';

export class KoratCore {
  server: KoratServer = createServer(this);
  plugins: KoratPluginManager = createPluginManager(this);
}

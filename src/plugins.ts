import {Express} from 'express';
import {KoratCore} from './core';

export interface KoratPlugin {
  id: string,
  displayName: string,

  attachEndpoints?: (server: Express, middleware: object) => void
}

export interface KoratPluginManager {
  attachedPlugins: Set<string>,

  attachPlugin: (plugin: KoratPlugin) => void
}

export function createPluginManager(core: KoratCore): KoratPluginManager {
  return {
    attachedPlugins: new Set(),

    attachPlugin(plugin) {
      this.attachedPlugins.add(plugin.id);

      plugin.attachEndpoints && plugin.attachEndpoints.call(core, core.server.expressApp, {});
    }
  };
}

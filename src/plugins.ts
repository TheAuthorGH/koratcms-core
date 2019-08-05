import {Express} from 'express';
import {KoratCore} from './core';
import {createValue} from './data';

export interface KoratPlugin {
  id: string,
  displayName: string,

  config?: Record<string, KoratPluginConfigItem>,

  attachEndpoints?: (this: KoratCore, server: Express, middleware: object) => void,
}

export interface KoratPluginConfigItem {
  initialValue?: any,
}

export interface KoratPluginManager {
  attachedPlugins: Set<string>,

  attachPlugin: (plugin: KoratPlugin) => Promise<void>
}

export function createPluginManager(core: KoratCore): KoratPluginManager {
  const {server, config} = core;

  return {
    attachedPlugins: new Set(),

    async attachPlugin(plugin) {
      if (!server.running) {
        server.afterStart(() => this.attachPlugin(plugin));
        return;
      }

      this.attachedPlugins.add(plugin.id);

      if (plugin.config) {
        for (let [key, configItem] of Object.entries(plugin.config)) {
          key = `${plugin.id}.${key}`;

          if (config.entryExists(key)) {
            // TODO keep old value, merge new data.
          } else {
            config.addEntry(key, createValue(configItem.initialValue));
          }
        }

        await config.saveEntries();
      }

      plugin.attachEndpoints && plugin.attachEndpoints.call(core, server.expressApp, server.middleware);
    }
  };
}

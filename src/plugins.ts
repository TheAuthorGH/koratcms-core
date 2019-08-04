import {Express} from 'express';
import {KoratCore} from './core';

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
  const {server, config, events} = core;

  return {
    attachedPlugins: new Set(),

    async attachPlugin(plugin) {
      if (!server.running) {
        events.listen('server-started', () => this.attachPlugin(plugin));
        return;
      }

      this.attachedPlugins.add(plugin.id);

      if (plugin.config) {
        for (let key of Object.keys(plugin.config)) {
          const configItem = plugin.config[key];
          key = `${plugin.id}.${key}`;

          if (config.entryExists(key)) {
            // TODO keep old value, merge new data.
          } else {
            config.addEntry(key, {
              value: configItem.initialValue,
            });
          }
        }

        await config.saveEntries();
      }

      plugin.attachEndpoints && plugin.attachEndpoints.call(core, server.expressApp, server.middleware);
    }
  };
}

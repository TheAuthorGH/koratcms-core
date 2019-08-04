import {Schema, Document} from 'mongoose';
import {KoratCore} from './core';

export interface KoratConfig {
  getEntry: (key: string) => void,
  addEntry: (key: string, entry?: KoratConfigEntry) => void,
  entryExists: (key: string) => boolean,
  getValue: (key: string) => any,
  setValue: (key: string, value: any) => void,
  saveEntries: () => Promise<void>,
  loadEntries: () => Promise<void>,
}

export interface KoratConfigEntry {
  value?: any,
}

interface ConfigDocument extends Document {
  key: string,
  value: any
}

const configSchema = new Schema({
  key: {type: String, required: true, unique: true},
  value: Object,
});

export function createConfig(core: KoratCore): KoratConfig {
  const {databaseManager, events} = core;

  databaseManager.createModel('Config', configSchema);
  events.listen('server-started', () => core.config.loadEntries());
  events.listen('server-stopping', () => core.config.saveEntries());

  const entries: Record<string, KoratConfigEntry> = {};

  return {
    getEntry(key) {
      return entries[key];
    },

    addEntry(key, entry = {}) {
      if (this.entryExists(key))
        throw new Error(`Config entry with key ${key} already exists.`);
      entries[key] = entry || {};
    },

    entryExists(key) {
      return key in entries;
    },

    getValue(key) {
      return entries[key] && entries[key].value;
    },

    setValue(key, value) {
      if (!this.entryExists(key))
        throw new Error(`Config entry with key ${key} does not exist.`);
      entries[key].value = value;
    },

    async saveEntries() {
      const ConfigModel = databaseManager.getModel<ConfigDocument>('Config');

      await ConfigModel.deleteMany({});
      await ConfigModel.insertMany(Object.keys(entries).map(key => ({
        key,
        value: this.getValue(key)
      })));
    },

    async loadEntries() {
      const ConfigModel = databaseManager.getModel<ConfigDocument>('Config');

      for (let entry of await ConfigModel.find()) {
        this.addEntry(entry.key, {
          value: entry.value
        })
      }
    }
  };
}

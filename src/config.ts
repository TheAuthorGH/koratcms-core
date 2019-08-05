import {Schema, Document} from 'mongoose';
import {KoratCore} from './core';
import {KoratValue, KoratValueConstraints, createValue} from './data';

export interface KoratConfig {
  getEntry: (key: string) => KoratValue,
  addEntry: (key: string, entry?: KoratValue) => void,
  entryExists: (key: string) => boolean,
  getValue: (key: string) => any,
  setValue: (key: string, value: any) => void,
  saveEntries: () => Promise<void>,
  loadEntries: () => Promise<void>,
}

interface ConfigDocument extends Document {
  key: string,
  value: any,
  constraints: object,
}

const configSchema = new Schema({
  key: {type: String, required: true, unique: true},
  value: {type: Object},
  constraints: {type: Object},
});

export function createConfig(core: KoratCore): KoratConfig {
  const {server} = core;

  server.afterStart(async () => {
    server.mongooseConnection && server.mongooseConnection.model('Config', configSchema);
    await core.config.loadEntries();
  });
  server.beforeStop(async () => {
    await core.config.saveEntries();
  });

  const entries: Record<string, KoratValue> = {};

  return {
    getEntry(key) {
      return entries[key];
    },

    addEntry(key, value) {
      if (this.entryExists(key))
        throw new Error(`Config entry with key ${key} already exists.`);
      entries[key] = value || createValue();
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
      const entriesToSave = Object.entries(entries).map(([key, entry]) => ({
        key,
        value: entry.value,
        constraints: entry.constraints
      }));

      const ConfigModel = server.mongooseConnection && server.mongooseConnection.model<ConfigDocument>('Config');
      if (!ConfigModel) throw new Error();

      await ConfigModel.deleteMany({});
      await ConfigModel.insertMany(entriesToSave);
    },

    async loadEntries() {
      const ConfigModel = server.mongooseConnection && server.mongooseConnection.model<ConfigDocument>('Config');
      if (!ConfigModel) throw new Error();

      for (let entry of await ConfigModel.find()) {
        this.addEntry(entry.key, createValue(entry.value, <KoratValueConstraints>entry.constraints));
      }
    }
  };
}

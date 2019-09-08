import {Schema, Document, Model} from 'mongoose';
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

  let ConfigModel: Model<ConfigDocument>;

  server.afterStart(async () => {
    ConfigModel = server.mongooseConnection!.model<ConfigDocument>('Config', configSchema);
    await core.config.loadEntries();
  });
  server.beforeStop(async () => {
    await core.config.saveEntries();
  });

  const entries = new Map<string, KoratValue>();

  return {
    getEntry(key) {
      if (!entries.has(key))
        throw new Error(`Config entry with key ${key} does not exist.`);
      return <KoratValue>entries.get(key);
    },

    addEntry(key, value) {
      if (this.entryExists(key))
        throw new Error(`Config entry with key ${key} already exists.`);
      entries.set(key, value || createValue());
    },

    entryExists(key) {
      return key in entries;
    },

    getValue(key) {
      const entry = entries.get(key);
      return entry && entry.value;
    },

    setValue(key, value) {
      this.getEntry(key).value = value;
    },

    async saveEntries() {
      const entriesToSave = Array.from(entries).map(([key, entry]) => ({
        key,
        value: entry.value,
        constraints: entry.constraints
      }));

      await ConfigModel.deleteMany({});
      await ConfigModel.insertMany(entriesToSave);
    },

    async loadEntries() {
      for (let entry of await ConfigModel.find()) {
        this.addEntry(entry.key, createValue(entry.value, <KoratValueConstraints>entry.constraints));
      }
    }
  };
}

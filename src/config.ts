import {Schema, Document} from 'mongoose';
import {KoratCore} from './core';

export interface KoratConfig {
  values: Record<string, string>,

  getValue: (key: string) => any,
  setValue: (key: string, value: any) => void,
  saveValues: () => Promise<void>,
  loadValues: () => Promise<void>,
}

interface ConfigDocument extends Document {
  key: string,
  value: any
}

export function createConfig(core: KoratCore): KoratConfig {
  const {databaseManager, events} = core;

  const configSchema = new Schema({
    key: {type: String, required: true, unique: true},
    value: Object,
  });

  databaseManager.createModel('Config', configSchema);

  return {
    values: {},

    getValue(key) {
      return this.values[key];
    },

    setValue(key, value) {
      this.values[key] = value;
    },

    async saveValues() {
      const ConfigModel = databaseManager.getModel<ConfigDocument>('Config');

      await ConfigModel.deleteMany({});
      await ConfigModel.insertMany(Object.keys(this.values).map(key => ({
        key,
        value: this.getValue(key)
      })));
    },

    async loadValues() {
      const ConfigModel = databaseManager.getModel<ConfigDocument>('Config');

      for (let entry of await ConfigModel.find()) {
        this.values[entry.key] = entry.value;
      }
    }
  };
}

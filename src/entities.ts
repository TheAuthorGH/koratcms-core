import {KoratCore} from './core';
import {KoratValueConstraints} from './data';

export interface KoratEntityType {
  key: string,

  getFieldConstraints: (key: string) => KoratValueConstraints,
  hasField: (key: string) => boolean,
  addField: (key: string, constraints: KoratValueConstraints) => void,
  createEntity: () => KoratEntity,
  getEntityById: (id: number) => KoratEntity | null,
  findEntities: () => KoratEntity[],
}

export interface KoratEntity {
  typeKey: string,
  id: number,

  getFieldValue: (key: string) => any,
  setFieldValue: (key: string, value: any) => void,
}

export interface KoratEntityManager {
  getEntityTypeByKey: (key: string) => KoratEntityType | null,
  entityTypeExists: (key: string) => boolean,
  getEntityById: (type: KoratEntityType | string, id: number) => KoratEntity | null,
  findEntities: (type: KoratEntityType | string) => KoratEntity[],
  createEntityType: (key: string) => KoratEntityType,
  createEntity: (type: KoratEntityType) => KoratEntity,
}

export function createEntityManager(core: KoratCore): KoratEntityManager {
  const entityTypes: KoratEntityType[] = [];
  const entities: KoratEntity[] = [];

  return {
    getEntityTypeByKey(key) {
      return entityTypes.find(entityType => entityType.key === key) || null;
    },

    entityTypeExists(key) {
      return entityTypes.some(entityType => entityType.key === key);
    },

    getEntityById(type, id) {
      if (typeof type !== 'string') type = type.key;
      return entities.find(entity => entity.typeKey === type && entity.id === id) || null;
    },

    findEntities(type) {
      if (typeof type !== 'string') type = type.key;
      return entities.filter(entity => entity.typeKey === type);
    },

    createEntityType(key) {
      if (this.entityTypeExists(key))
        throw new Error(`Entity Type with key '${key}' already exists.`);

      const fields: Record<string, KoratValueConstraints> = {};

      const entityType: KoratEntityType = {
        key,

        getFieldConstraints(key) {
          return fields[key];
        },

        hasField(key) {
          return key in fields;
        },

        addField(key, constraints) {
          if (entityType.hasField(key))
            throw new Error(`Entity Type with key '${entityType.key}' already has a field with key '${key}'`);
          fields[key] = constraints;
        },

        createEntity() {
          return core.entities.createEntity(this);
        },

        getEntityById(id) {
          return core.entities.getEntityById(this, id);
        },

        findEntities() {
          return core.entities.findEntities(this);
        }
      };

      entityTypes.push(entityType);

      return entityType;
    },

    createEntity(type) {
      const fieldValues: Record<string, any> = {};

      const entity: KoratEntity = {
        id: 0,
        typeKey: type.key,

        getFieldValue(key) {
          return fieldValues[key];
        },
        setFieldValue(key, value) {
          if (!type.hasField(key))
            throw new Error(`Entity Type '${type.key}' has no field '${key}'`);

          fieldValues[key] = value;
        }
      };

      entities.push(entity);

      return entity;
    },
  };
}

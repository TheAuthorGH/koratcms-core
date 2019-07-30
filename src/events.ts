import {KoratCore} from './core';

export interface KoratEventManager {
  listeners: Record<string, Set<(event?: any) => void>>,
  listen: (eventKey: string, handler: (event?: any) => void) => void,
  trigger: (eventKey: string, event?: any) => void,
}

export function createEventManager(core: KoratCore): KoratEventManager {
  return {
    listeners: {},

    listen(eventKey, handler) {
      if (!this.listeners[eventKey])
        this.listeners[eventKey] = new Set();
      this.listeners[eventKey].add(handler);
    },

    trigger(eventKey, event) {
      this.listeners[eventKey] && this.listeners[eventKey].forEach(listener => listener(event));
    }
  };
}

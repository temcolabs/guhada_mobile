import { useStaticRendering } from 'mobx-react';
import Root from './stores/Root';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

export let root = null;

export function initializeStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return new Root(isServer, initialState);
  }
  if (root === null) {
    root = new Root(isServer, initialState);
  }
  return root;
}

export const applyInitialData = ({
  initialData = {},
  storeName = '',
  store = {},
} = {}) => {
  const storeInitialData = initialData[storeName];

  if (!!storeInitialData) {
    Object.keys(storeInitialData).forEach(key => {
      store[key] = storeInitialData[key];
    });
  }
};

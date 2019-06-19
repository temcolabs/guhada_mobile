import { action, observable } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import Root from './stores/Root';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

export let root = null;

export function initializeStore(initialData) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return new Root(isServer, initialData);
  }
  if (root === null) {
    root = new Root(isServer, initialData);
  }
  return root;
}

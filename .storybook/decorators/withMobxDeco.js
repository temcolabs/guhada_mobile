import React from 'react';
import { Provider } from 'mobx-react';
import { initializeStore } from '../../store';

export default (initialData = {}) => fn => {
  const store = initializeStore(initialData);

  return <Provider {...store}>{fn()}</Provider>;
};

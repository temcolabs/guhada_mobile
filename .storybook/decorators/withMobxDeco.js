import { Provider } from 'mobx-react';
import { initializeStore } from '../../stores';

export default (initialData = {}) => (fn) => {
  const store = initializeStore(initialData);

  return <Provider {...store}>{fn()}</Provider>;
};

import React from 'react';
import { MobXProviderContext } from 'mobx-react';

/**
 * React hook 안에서 store를 가져올 때 사용한다.
 * @returns {import('./Root').default} the singleton Root store
 */
function useStores() {
  return React.useContext(MobXProviderContext);
}

export default useStores;

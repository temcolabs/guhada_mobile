import { useEffect } from 'react';
import { observer } from 'mobx-react';
import qs from 'qs';
import { pushRoute } from 'lib/router';
import HeadForSEO from 'lib/components/HeadForSEO';
import Error from 'template/Error';
import useStores from 'stores/useStores';

function ErrorPage() {
  /**
   * states
   */
  const { alert: alertStore } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    const query = qs.parse(window.location.search.substring(1));

    if (query.fromDesktop) {
      alertStore.showAlert({
        content: () => (
          <p>
            페이지를 찾을 수 없습니다. <br /> 데스크탑에서 확인해주세요.
          </p>
        ),
        onConfirm: () => pushRoute('/'),
      });
    }
  });

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="오류 페이지" />
      <Error />
    </>
  );
}

export default observer(ErrorPage);

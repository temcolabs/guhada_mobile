import { useEffect } from 'react';
import { observer } from 'mobx-react';
import Form from 'stores/form-store/_.forms';
import withAuth from 'components/common/hoc/withAuth';
import HeadForSEO from 'components/head/HeadForSEO';
import Login from 'template/signin/Login';

function LoginPage() {
  /**
   * side effects
   */
  useEffect(() => {
    Form.signIn.clear();
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="로그인" />
      <Login form={Form.signIn} />
    </>
  );
}

export default withAuth({ isAuthRequired: false })(observer(LoginPage));

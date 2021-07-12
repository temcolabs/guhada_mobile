import PropTypes from 'prop-types';
import Router from 'next/router';
import SignUpSuccess from 'components/login/SignUpSuccess';
import HeadForSEO from 'lib/components/HeadForSEO';
import { isBrowser } from 'lib/common/isServer';
import { getCookie } from 'lib/common/cookieUtils';

function SignUpSuccessPage({ signUpUserEmail }) {
  return (
    <>
      <HeadForSEO pageName="회원가입 완료" />
      <SignUpSuccess email={signUpUserEmail} />
    </>
  );
}
SignUpSuccessPage.getInitialProps = function({ req, res }) {
  if (isBrowser) {
    return Router.push('/');
  }

  const signUpUserEmail = getCookie('signupemail', req.headers.cookie);
  if (signUpUserEmail.length > 0) {
    return { signUpUserEmail };
  }

  return res.redirect('/error');
};

SignUpSuccessPage.propTypes = {
  signUpUserEmail: PropTypes.string,
};

export default SignUpSuccessPage;

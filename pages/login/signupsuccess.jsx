import React from 'react';
import Router from 'next/router';
import SignUpSuccess from 'components/login/SignUpSuccess';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import { isBrowser } from 'childs/lib/common/isServer';
import { getCookie } from 'childs/lib/common/cookieUtils';

function getInitialProps(ctx) {
  if (isBrowser) {
    return Router.push('/');
  }

  const { req, res } = ctx;

  const signUpUserEmail = getCookie('signupemail', req.headers.cookie);
  if (signUpUserEmail.length) {
    return { signUpUserEmail };
  }

  return res.redirect('/error');
}

function SignUpSuccessPage(props) {
  return (
    <>
      <HeadForSEO pageName="회원가입 완료" />
      <SignUpSuccess email={props.signUpUserEmail} />
    </>
  );
}
SignUpSuccessPage.getInitialProps = getInitialProps;

export default SignUpSuccessPage;

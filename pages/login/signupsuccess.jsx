import React, { Component } from 'react';
import { inject } from 'mobx-react';
import SignUpSuccess from 'components/login/SignUpSuccess';
import Error from 'template/Error';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

import daumTracker from 'childs/lib/tracking/daum/daumTracker';
import naverShoppingTrakers from 'childs/lib/tracking/navershopping/naverShoppingTrakers';
import momentTracker from 'childs/lib/tracking/kakaomoment/momentTracker';
import ReactPixel from 'react-facebook-pixel';
import gtagTracker from 'childs/lib/tracking/google/gtagTracker';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';

@inject('login')
class signupsuccess extends Component {
  componentWillUnmount() {
    const { login } = this.props;
    login.signUpData = {};
  }

  componentDidMount() {
    const { login } = this.props;
    if (login.signUpData.result === 'SUCCESS') {
      try {
        naverShoppingTrakers.signup();
        daumTracker.signup();
        momentTracker.signup();
        ReactPixel.track('CompleteRegistration', login.signUpData);
        gtagTracker.signup(); // gtagTracker.signup('/');
        criteoTracker.signUpUser(login.signUpData.data.email);
      } catch (error) {
        // console.error('[tracker]', error.message);
      }
    }
  }

  render() {
    const { login } = this.props;
    if (login.signUpData.result !== 'SUCCESS') {
      if (typeof window !== 'undefined') {
        window.history.replaceState('', '', '/error');
      }
      return (
        <>
          <HeadForSEO pageName="오류 페이지" />
          <Error />
        </>
      );
    } else {
      return (
        <>
          <HeadForSEO pageName="회원가입 완료" />
          <SignUpSuccess email={login.signUpData.data.email} />
        </>
      );
    }
  }
}

export default signupsuccess;

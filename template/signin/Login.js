import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';

class Login extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <DefaultLayout pageTitle={'로그인'}>Login</DefaultLayout>;
  }
}

export default Login;

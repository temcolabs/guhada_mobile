import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import Signup from 'template/signin/Signup';

@observer
export class signup extends Component {
  componentDidMount() {}

  render() {
    Form.signUp.clear();
    return (
      <>
        <Head>
          <title>회원가입</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>
        <div>
          <Signup form={Form.signUp} />
        </div>
      </>
    );
  }
}

export default signup;

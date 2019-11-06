import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import Signup from 'template/signin/Signup';

@observer
export class signup extends Component {
  render() {
    Form.signUp.clear();
    Form.termAgree.clear();
    return (
      <>
        <Head>
          <title>회원가입</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <div>
          <Signup form={Form.signUp} termAgree={Form.termAgree} />
        </div>
      </>
    );
  }
}

export default signup;

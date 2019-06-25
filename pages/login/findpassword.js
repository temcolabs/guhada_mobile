import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import FindId from 'template/signin/FindId';
import FindPassword from 'template/signin/FindPassword';

@observer
export class findpassword extends Component {
  render() {
    Form.findPasswordMobile.clear();
    Form.findPasswordEmail.clear();

    return (
      <>
        <Head>
          <title>패스워드 찾기</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>
        <div>
          <FindPassword
            formMobile={Form.findPasswordMobile}
            formEmail={Form.findPasswordEmail}
          />
        </div>
      </>
    );
  }
}

export default findpassword;

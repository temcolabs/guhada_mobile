import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import FindPasswordResult from 'template/signin/FindPasswordResult';
import { pushRoute } from 'lib/router';

@inject('authmobile')
@observer
class findpasswordresult extends Component {
  render() {
    let formValue;
    let verificationTargetType;
    let { authmobile } = this.props;

    if (Form.findPasswordEmail.values().verificationNumber !== '') {
      formValue = Form.findPasswordEmail;
      verificationTargetType = 'EMAIL';
    } else if (Form.findPasswordMobile.values().verificationNumber !== '') {
      formValue = Form.findPasswordMobile;
      verificationTargetType = 'MOBILE';
    } else if (authmobile.verifyParams.diCode !== '') {
      formValue = authmobile.verifyParams;
    } else {
      pushRoute('/login/findpassword');
    }

    return (
      <>
        <Head>
          <title>비밀번호 재설정 하기</title>
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
          <FindPasswordResult
            form={Form.findPasswordResult}
            formValue={formValue}
            verificationTargetType={verificationTargetType}
          />
        </div>
      </>
    );
  }
}

export default findpasswordresult;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import FindPasswordResult from 'template/signin/FindPasswordResult';
import { pushRoute } from 'lib/router';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@inject('authmobile')
@observer
class findpasswordresult extends Component {
  componentDidMount() {
    let { authmobile } = this.props;
    if (Form.findPasswordEmail.values().verificationNumber !== '') {
    } else if (Form.findPasswordMobile.values().verificationNumber !== '') {
    } else if (authmobile.verifyParams.diCode !== '') {
    } else {
      pushRoute('/login/findpassword');
    }
  }
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
    }

    return (
      <>
        <HeadForSEO pageName="비밀번호 재설정" />

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

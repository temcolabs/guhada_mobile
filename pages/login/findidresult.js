import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import FindIdResult from 'template/signin/FindIdResult';
import { pushRoute } from 'lib/router';

@inject('authmobile')
@observer
class findidresult extends Component {
  componentDidMount() {
    let { authmobile } = this.props;
    if (authmobile.verifyParams.diCode !== '') {
    } else if (Form.idFind.values().mobile !== '') {
    } else {
      pushRoute('/login/findid');
    }
  }
  render() {
    let formValue;
    let { authmobile } = this.props;
    if (authmobile.verifyParams.diCode !== '') {
      formValue = authmobile.verifyParams;
    } else if (Form.idFind.values().mobile !== '') {
      formValue = Form.idFind;
    }
    return (
      <>
        <Head>
          <title>아이디 찾기 결과</title>
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
          <FindIdResult form={Form.idFind} formValue={formValue} />
        </div>
      </>
    );
  }
}

export default findidresult;

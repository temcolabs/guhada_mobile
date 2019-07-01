import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import FindPasswordResult from 'template/signin/FindPasswordResult';

@observer
export class findpasswordresult extends Component {
  render() {
    return (
      <>
        <Head>
          <title>비밀번호 재설정 하기</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>
        <div>
          <FindPasswordResult form={Form.findPasswordResult} />
        </div>
      </>
    );
  }
}

export default findpasswordresult;

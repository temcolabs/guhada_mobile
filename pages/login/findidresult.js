import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import FindIdResult from 'template/signin/FindIdResult';

@observer
class findidresult extends Component {
  render() {
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
          <FindIdResult form={Form.idFind} />
        </div>
      </>
    );
  }
}

export default findidresult;

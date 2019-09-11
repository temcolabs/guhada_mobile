import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import FindId from 'template/signin/FindId';

@observer
class findid extends Component {
  render() {
    Form.idFind.clear();
    return (
      <>
        <Head>
          <title>아이디 찾기</title>
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
          <FindId form={Form.idFind} />
        </div>
      </>
    );
  }
}

export default findid;

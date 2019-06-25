import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Form from '../../stores/form-store/_.forms';
import FindId from 'template/signin/FindId';

@observer
export class findid extends Component {
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
        </Head>
        <div>
          <FindId form={Form.idFind} />
        </div>
      </>
    );
  }
}

export default findid;

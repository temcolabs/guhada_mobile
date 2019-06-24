import React from 'react';
import Home from 'template/Home';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Login from 'template/signin/Login';
import Form from '../../stores/form-store/_.forms';

@observer
class index extends React.Component {
  componentDidMount() {}

  render() {
    Form.signIn.clear();

    return (
      <>
        <Head>
          <title>로그인</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>
        <div>
          <Login form={Form.signIn}></Login>
        </div>
      </>
    );
  }
}

export default index;

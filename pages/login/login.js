import React from 'react';
import Home from 'template/Home';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Login from 'template/signin/Login';

@inject('login')
@observer
class index extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <>
        <Head>
          <title>구하다 웹</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>
        <div>
          <Login></Login>
        </div>
      </>
    );
  }
}

export default index;

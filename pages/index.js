import React from 'react';
import Home from 'template/Home';
import Head from 'next/head';
import { inject, observer } from 'mobx-react';

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
          <Home></Home>
        </div>
      </>
    );
  }
}

export default index;
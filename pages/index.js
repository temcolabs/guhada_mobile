import React from 'react';
import Home from 'template/Home';
import Head from 'next/head';
import { inject, observer } from 'mobx-react';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';

@inject('login', 'user')
@observer
class index extends React.Component {
  componentDidMount() {
    const { user: userStore } = this.props;
    userStore.pushJobForUserInfo(() => {
      criteoTracker.homepage({
        email: userStore.userInfo.email,
      });
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>구하다(GUHADA)</title>
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
          <Home />
        </div>
      </>
    );
  }
}

export default index;

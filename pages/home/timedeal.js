import React, { Component } from 'react';
import Head from 'next/head';
import TimeDeal from 'template/home/TimeDeal';
export class timedeal extends Component {
  render() {
    return (
      <>
        <Head>
          <title>타임딜</title>
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
          <TimeDeal />
        </div>
      </>
    );
  }
}

export default timedeal;

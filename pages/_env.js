import React, { Fragment } from 'react';
import Head from 'next/head';
import { HOSTNAME } from 'constant/hostname';

class test extends React.Component {
  render() {
    return (
      <Fragment>
        <Head>
          <title>구하다 envrionments</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>

        <div>
          <p>HOSTNAME: {HOSTNAME}</p>
          <p>API_PRODUCT_URL: {process.env.API_PRODUCT_URL}</p>
          <p>API_SEARCH: {process.env.API_SEARCH}</p>
          <p>API_USER: {process.env.API_USER}</p>
          <p>API_ORDER: {process.env.API_ORDER}</p>
          <p>API_CLAIM: {process.env.API_CLAIM}</p>
          <p>API_CLOUD: {process.env.API_CLOUD}</p>
        </div>
      </Fragment>
    );
  }
}

export default test;

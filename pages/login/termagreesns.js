import React, { Component } from 'react';
import Head from 'next/head';
import Term from 'components/login/Term';
import Form from '../../stores/form-store/_.forms';
import withAuth from 'components/common/hoc/withAuth';

export class termagreesns extends Component {
  render() {
    return (
      <>
        <Head>
          <title>약관동의</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>
        <div>
          <Term form={Form.termAgree} />
        </div>
      </>
    );
  }
}

export default withAuth({ isAuthRequired: false, redirectTo: '/' })(
  termagreesns
);

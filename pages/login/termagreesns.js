import React, { Component } from 'react';
import Head from 'next/head';
import Term from 'components/login/Term';
import Form from '../../stores/form-store/_.forms';
import withAuth from 'components/common/hoc/withAuth';

export class termagreesns extends Component {
  render() {
    Form.termAgree.clear();
    Form.termAgree.$('sns').set('value', true);

    return (
      <>
        <Head>
          <title>약관동의</title>
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
          <Term form={Form.termAgree} />
        </div>
      </>
    );
  }
}

export default termagreesns;

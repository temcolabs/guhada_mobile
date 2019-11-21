import React from 'react';
import Head from 'next/head';

export default function CommonHead() {
  return (
    <Head>
      {/* favicon */}
      <link rel="shortcut icon" type="image/x-icon" href="/static/guhada.ico" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
    </Head>
  );
}

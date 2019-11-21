import React from 'react';

export default function CommonHead() {
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />

      {/* ============================================================ */}
      {/* favicon */}
      {/* ============================================================ */}
      <link rel="icon" type="image/png" href="/static/guhada.ico" />
      {/* IE */}
      <link rel="shortcut icon" href="/static/guhada.ico" />
      {/* Windows 8  */}
      <meta name="msapplication-TileImage" content="/static/guhada.ico" />
      {/* Windows 8  */}
      <meta name="msapplication-TileColor" content="#5d2ed1" />
      {/*  iPad Retina--> */}
      <link
        rel="apple-touch-icon-precomposed"
        sizes="144x144"
        href="/static/appicon/guhada-icon-144.png"
      />
      {/* iPhone Retina --> */}
      <link
        rel="apple-touch-icon-precomposed"
        sizes="114x114"
        href="/static/appicon/guhada-icon-57.png"
      />
      {/*  iPad 1 e 2 --> */}
      <link
        rel="apple-touch-icon-precomposed"
        sizes="72x72"
        href="/static/appicon/guhada-icon-72.png"
      />
      {/*  iPhone, iPod e Android 2.2+ --> */}
      <link
        rel="apple-touch-icon-precomposed"
        href="/static/appicon/guhada-icon-57.png"
      />
    </>
  );
}

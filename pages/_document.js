// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

const useragent = require('express-useragent');
const parse = require('url-parse');

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const { req, res } = ctx;

    // 데스크탑 웹에서 접근했다면, 구하다 데스크탑 웹사이트로 이동시킨다
    const ua = useragent.parse(req.headers['user-agent']);

    if (!ua.isMobile) {
      const parsedUrl = parse(req.url);
      const targetDesktopUrl = `${process.env.HOSTNAME}${parsedUrl.href}`;
      res.redirect(targetDesktopUrl);
    }

    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Global site tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-9SXJBX8EXX`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-9SXJBX8EXX');`,
            }}
          />
          {/* bootstrap 스타일시트는 summernote의 dependency */}
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
            integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
            crossOrigin="anonymous"
          />
          <script src="https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js" />
          <meta
            name="google-site-verification"
            content="pNZ8iQTxAxE_4Le0CrNz7CKZYbK77vs-AUr_gTHFjKA"
          />
          <meta
            name="naver-site-verification"
            content="1afd6b85b3b1b6b0030bc86e1c392cd057b33b4c"
          />
          <script type="text/javascript" src="//wcs.naver.net/wcslog.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              if (!wcs_add) var wcs_add={};
              wcs_add["wa"] = "s_57744e5ca3ee";
              if (!_nasa) var _nasa={};
              wcs.inflow();
              wcs_do(_nasa);`,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

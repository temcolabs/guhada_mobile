import React from 'react';
import seo from 'childs/lib/constant/seo';
import Head from 'next/head';

export default function CommonHead({
  isRobotAllowed = true, // 검색 엔진에게 인덱싱을 허용할 것인지
  fullUrl,
  children,
}) {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <meta
        name="robots"
        // content={isRobotAllowed ? 'index,follow' : 'noindex,nofollow'}
        content={'index,follow'}
      />

      {/* <link rel="manifest" href="/static/manifest.json" /> */}

      {/* ============================================================ */}
      {/* favicon and app icons*/}
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

      {/* ios 앱 */}
      {seo.IOS_APPSTORE_ID && (
        <meta property="al:ios:app_store_id" content={seo.IOS_APPSTORE_ID} />
      )}
      {seo.IOS_APP_NAME && (
        <meta property="al:ios:app_name" content={seo.IOS_APP_NAME} />
      )}
      {/* 커스텀 앱 스키마 */}
      {/* <meta property="al:ios:url" content={seo.IOS_APP_LINK} /> */}

      {/* 안드로이드 앱 */}
      {seo.ANDROID_APP_NAME && (
        <meta property="al:android:app_name" content={seo.ANDROID_APP_NAME} />
      )}
      {seo.ANDROID_PACKAGE_ID && (
        <meta property="al:android:package" content={seo.ANDROID_PACKAGE_ID} />
      )}
      {/* 커스텀 앱 스키마 */}
      {/* <meta property="al:android:url" content={seo.ANDROID_APP_LINK} /> */}

      {/* 사이트 연관 채널 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'http://schema.org',
            '@type': 'Organization',
            name: '구하다',
            url: 'https://www.guhada.com',
            sameAs: [
              'https://www.instagram.com/guhada.official',
              'https://play.google.com/store/apps/details?id=io.temco.guhada&hl=ko',
              'https://apps.apple.com/kr/app/구하다-명품-쇼핑-필수앱/id1478120259',
            ],
          }),
        }}
      />
      {children}
    </Head>
  );
}

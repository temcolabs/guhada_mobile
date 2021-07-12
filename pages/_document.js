import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import urlConstant from 'childs/lib/constant/url';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    return (
      <Html>
        <Head>
          {/* Global site tag (gtag.js) - Google Analytics */}
          <script
            id="GTAG_TRACKER"
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-145072876-1"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-145072876-1');`,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PN8SGDH');`,
            }}
          />

          {/* 다음 주소검색 */}
          <script defer id="daumPostcode" src={urlConstant.daumPostCode} />

          {/* 네이버 쇼핑 트래커 */}
          <script type="text/javascript" src="//wcs.naver.net/wcslog.js" />

          {/* 코차바 */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(a,b,c,d,e){var f=window.kochava=window.kochava||[];if(f.loaded)return void(window.console&&console.error&&console.error("Kochava snippet already included"));f.loaded=!0,f.methods=["page","identify","activity","conversion","init"],stub=function(a){return function(){var b=Array.prototype.slice.call(arguments);return b.unshift(a),f.push(b),f}};for(var g=0;g<f.methods.length;g++){var h=f.methods[g];f[h]=stub(h)}f.init((new Date).getTime(),a,e),function(){var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=("https:"===document.location.protocol?"https://":"http://")+"assets.kochava.com/kochava.js/"+b+"/kochava.min.js",d||(a.src=a.src+"?c="+Math.random());var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)}(),c&&f.page() }("koguhada-web-mobile-6ok9xewt","v2.1",true,false,true,false);`,
            }}
          />
          <script
            type="text/javascript"
            charSet="UTF-8"
            src="//t1.daumcdn.net/adfit/static/kp.js"
          />

          {/* 모비온 - device: 'M' for mobile */}
          <script
            id="MOBON_TRACKER"
            dangerouslySetInnerHTML={{
              __html: `
              (function(a,g,e,n,t){a.enp=a.enp||function(){(a.enp.q=a.enp.q||[]).push(arguments)};n=g.createElement(e);n.async=!0;n.defer=!0;n.src="https://cdn.megadata.co.kr/dist/prod/enp_tracker_self_hosted.min.js";t=g.getElementsByTagName(e)[0];t.parentNode.insertBefore(n,t)})(window,document,"script");enp('create', 'common', 'guhada9', { device: 'M' });enp('send', 'common', 'guhada9');
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />

          <script
            dangerouslySetInnerHTML={{
              __html: `
              if (!wcs_add) var wcs_add={};
              wcs_add["wa"] = "s_256ea496e0f6";
              if (!_nasa) var _nasa={};
              wcs.inflow();
              wcs_do(_nasa);`,
            }}
          />

          {/* AceCounter Mobile WebSite Gathering Script V.7.5.2019080601 */}
          <script
            language="javascript"
            dangerouslySetInnerHTML={{
              __html: `
              var _AceGID=(function(){var Inf=['m.guhada.com','m.guhada.com','AZ3A77834','AM','0','NaPm,Ncisy','ALL','0']; var _CI=(!_AceGID)?[]:_AceGID.val;var _N=0;if(_CI.join('.').indexOf(Inf[3])<0){ _CI.push(Inf);  _N=_CI.length; } return {o: _N,val:_CI}; })();
              var _AceCounter=(function(){var G=_AceGID;var _sc=document.createElement('script');var _sm=document.getElementsByTagName('script')[0];if(G.o!=0){var _A=G.val[G.o-1];var _G=(_A[0]).substr(0,_A[0].indexOf('.'));var _C=(_A[7]!='0')?(_A[2]):_A[3];var _U=(_A[5]).replace(/\,/g,'_');_sc.src=(location.protocol.indexOf('http')==0?location.protocol:'http:')+'//cr.acecounter.com/Mobile/AceCounter_'+_C+'.js?gc='+_A[2]+'&py='+_A[1]+'&up='+_U+'&rd='+(new Date().getTime());_sm.parentNode.insertBefore(_sc,_sm);return _sc.src;}})();`,
            }}
          />
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<img
              src={'http://gmb.acecounter.com/mwg/?mid=AZ3A77834&tp=noscript&ce=0&'}
              border="0"
              width="0"
              height="0"
              alt=""
            />`,
            }}
          />
          {/* AceCounter Mobile Gathering Script End */}

          {/* widerplanet */}
          <div id="wp_tg_cts" style={{ display: 'none' }} />

          {/* beusable */}
          <script
            language="javascript"
            dangerouslySetInnerHTML={{
              __html: `
              (function(w, d, a){
                w.__beusablerumclient__ = {
                    load : function(src){
                        var b = d.createElement("script");
                        b.src = src; b.async=true; b.type = "text/javascript";
                        d.getElementsByTagName("head")[0].appendChild(b);
                    }
                };w.__beusablerumclient__.load(a);
              })(window, document, "//rum.beusable.net/script/b210310e150402u581/f1b987dd0b");`,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

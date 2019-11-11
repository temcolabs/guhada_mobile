// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="Description"
            content="명품 특가 타임딜! 정품 100% 보장! 전 상품 무료 배송! 명품쇼핑의 즐거움을 구하다"
          />
          <meta
            property="og:description"
            content="명품 특가 타임딜! 정품 100% 보장! 전 상품 무료 배송! 명품쇼핑의 즐거움을 구하다"
          />
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(a,b,c,d,e){var f=window.kochava=window.kochava||[];if(f.loaded)return void(window.console&&console.error&&console.error("Kochava snippet already included"));f.loaded=!0,f.methods=["page","identify","activity","conversion","init"],stub=function(a){return function(){var b=Array.prototype.slice.call(arguments);return b.unshift(a),f.push(b),f}};for(var g=0;g<f.methods.length;g++){var h=f.methods[g];f[h]=stub(h)}f.init((new Date).getTime(),a,e),function(){var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=("https:"===document.location.protocol?"https://":"http://")+"assets.kochava.com/kochava.js/"+b+"/kochava.min.js",d||(a.src=a.src+"?c="+Math.random());var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)}(),c&&f.page() }("koguhada-web-mobile-6ok9xewt","v2.1",true,false,false,false);`,
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
        </body>
      </Html>
    );
  }
}

export default MyDocument;

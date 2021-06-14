const express = require('express');
const next = require('next');
const mobxReact = require('mobx-react');
const compression = require('compression');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const routes = require('./routes');
const PORT = dev ? 8081 : process.env.PORT || 3000;
const returnUrls = require('./routes/returnUrls');
const useragent = require('express-useragent');

mobxReact.useStaticRendering(true);

/**
 * 라우트 파라미터와 쿼리스트링을 함께 전달
 * @param {*} req
 */
const getQueryParams = (req) => {
  const queryParams = Object.assign({}, req.params, req.query);
  return queryParams;
};

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(compression());
    server.use(express.urlencoded({ extended: false }));
    server.use(express.json());
    server.use(useragent.express());
    server.enable('trust proxy', 'loopback');

    let isAppGoingToBeClosed = false; // PM@의 SIGINT 시그널을 받았는지 여부. 앱이 곧 종료될 것임을 의미한다.

    server.use(function(req, res, next) {
      // 프로세스 종료 예정이라면 리퀘스트를 처리하지 않는다
      if (isAppGoingToBeClosed) {
        res.set('Connection', 'close');
      }

      next();
    });

    const robotsOptions = {
      root: __dirname + '/static/',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
    };
    server.get('/robots.txt', (req, res) =>
      res.status(200).sendFile('robots.txt', robotsOptions)
    );

    const sitemapOptions = {
      root: __dirname + '/static/',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
      },
    };
    server.get('/sitemap.xml', (req, res) =>
      res.status(200).sendFile('sitemap.xml', sitemapOptions)
    );

    /**
     * 데스크탑에서 접속하면 데스크탑 웹으로 보낸다
     */
    server.use(function(req, res, next) {
      const ua = useragent.parse(req.headers['user-agent']);

      // 리다이렉트 하지 않을 경로
      const pathToIgnore = [
        /^\/_next/, // 리소스
        /^\/static/, // 리소스
      ];

      const isRedirectRequired =
        ua.isDesktop && pathToIgnore.findIndex((r) => r.test(req.path)) < 0;

      if (isRedirectRequired) {
        console.log('process.env.HOSTNAME', `${process.env.HOSTNAME}`);
        console.log('req.originalUrl', `${req.originalUrl}`);

        res.redirect(`${process.env.HOSTNAME}${req.originalUrl}`);
      } else {
        next();
      }
    });

    /**
     * 일부 라우트는 production 모드에서 접근했을 때 인덱스(/) 라우트로 보낸다
     */

    // server.use(function(req, res, next) {
    //   const isProd = process.env.NODE_ENV === 'production';
    //   const host = req.headers.host;
    //   const isProdHost = isProd && host === 'm.guhada.com';

    //   const routeRegexToBlock = [/^\/mypage/];
    //   const isRedirectRequired =
    //     routeRegexToBlock.findIndex(r => r.test(req.path)) > -1;

    //   if (isProdHost && isRedirectRequired) {
    //     res.redirect('/');
    //   } else {
    //     next();
    //   }
    // });

    // return urls
    for (const route of returnUrls) {
      server[route.method](route.url, route.handler);
    }

    /**
     * custom route setting
     */
    for (const route of routes) {
      server.get(route.asPath, (req, res) => {
        app.render(req, res, route.pagePath, { ...getQueryParams(req) });
      });
    }

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    const listeningServer = server.listen(PORT, '127.0.0.1', (err) => {
      if (err) throw err;
      console.log(`> Ready on mobile https://localhost:${PORT}`);

      // PM2에게 앱 구동이 완료되었음을 전달한다
      if (process.send) {
        process.send('ready');
        console.log('sent ready signal to PM2 at', new Date());
      }
    });

    process.on('SIGINT', function() {
      console.log('received SIGNIT signal');

      isAppGoingToBeClosed = true; // 앱이 종료될 것

      // pm2 재시작 신호가 들어오면 서버를 종료시킨다.
      listeningServer.close(function(err) {
        console.log('server closed');
        process.exit(err ? 1 : 0);
      });
    });
  })
  .catch((ex) => {
    // console.error(ex.stack);
    process.exit(1);
  });

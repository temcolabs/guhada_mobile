const express = require('express');
const next = require('next');
const mobxReact = require('mobx-react');
const compression = require('compression');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const routes = require('./routes');
const PORT = 8080;
const returnUrls = require('./routes/returnUrls');

mobxReact.useStaticRendering(true);

/**
 * 라우트 파라미터와 쿼리스트링을 함께 전달
 * @param {*} req
 */
const getQueryParams = req => {
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

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on mobile http://localhost:${PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

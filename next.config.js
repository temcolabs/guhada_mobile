// next.config.js
const path = require('path');
const webpack = require('webpack');
// const withSass = require('@zeit/next-sass');
const loaderUtils = require('loader-utils');
// const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
  // exptend webpack settings
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]',
        },
      },
    });

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'public/icons',
          publicPath: './public/icons/',
        },
      },
    });

    // config.plugins.push(
    //   new FilterWarningsPlugin({
    //     exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
    //   })
    // );

    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ko|en/)
    );
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /validatorjs[/\\]src[/\\]lang/,
        /ko|en/
      )
    );

    return config;
  },

  // sass, css loader options
  // sassLoaderOptions: {
  //   includePaths: [path.resolve(__dirname, 'node_modules')],
  // },
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: '[local]--[hash:base64:6]',
    getLocalIdent: (loaderContext, localIdentName, localName, options) => {
      const { resourcePath, rootContext } = loaderContext;

      //  파일명에 "module" 문자열이 없거나 npm 패키지에서 가져온 스타일시트는 모듈 적용 안함
      if (
        resourcePath.indexOf('.module.') < 0 ||
        resourcePath.includes('node_modules')
      ) {
        return localName;
      }

      if (!options.context) {
        options.context = rootContext;
      }

      const request = path
        .relative(rootContext, loaderContext.resourcePath)
        .replace(/\\/g, '/');

      options.content = `${request}+${localName}`;

      localIdentName = localIdentName.replace(/\[local\]/gi, localName);

      return loaderUtils.interpolateName(
        loaderContext,
        localIdentName,
        options
      );
    },
  },

  // webpack bundle analyzer
  // analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // bundleAnalyzerConfig: {
  //   server: {
  //     analyzerMode: 'static',
  //     reportFilename: './bundles/server.html',
  //   },
  //   browser: {
  //     analyzerMode: 'static',
  //     reportFilename: './bundles/client.html',
  //   },
  // },
};

const path = require('path');
const loaderUtils = require('loader-utils');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: !!process.env.ANALYZE,
});
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = withBundleAnalyzer({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    /**
     * rules
     */
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

    /**
     * plugins
     */
    const customPlugins = [
      new LodashModuleReplacementPlugin(),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /en|ko/),
      new webpack.IgnorePlugin(
        /^.\/(?!ko)(.+)$/,
        /validatorjs[\/\\]src[\/\\]lang/
      ),
    ];

    /**
     * set webpack config
     */
    config.plugins = [...config.plugins, ...customPlugins];
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
});

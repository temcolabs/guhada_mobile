const loaderUtils = require('loader-utils');
const path = require('path');

// ./.storybook/webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[local]--[hash:base64:6]',
              getLocalIdent: (context, localIdentName, localName, options) => {
                const { resourcePath, rootContext } = context;

                if (resourcePath.indexOf('.module') < 0) {
                  return localName;
                }

                if (!options.context) {
                  options.context = rootContext;
                }

                const request = path
                  .relative(rootContext, context.resourcePath)
                  .replace(/\\/g, '/');

                options.content = `${request}+${localName}`;

                localIdentName = localIdentName.replace(
                  /\[local\]/gi,
                  localName
                );

                return loaderUtils.interpolateName(
                  context,
                  localIdentName,
                  options
                );
              },
            },
          },
          require.resolve('sass-loader'),
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]',
          },
        },
      },
    ],
  },
};

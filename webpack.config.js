/* eslint-disable sort-keys */
const VueLoaderPlugin = require(`vue-loader/lib/plugin`);
const config = require(`config`);
const { resolve } = require(`path`);
const { ProvidePlugin } = require(`webpack`);

module.exports = {
  mode: config.get(`webpack.mode`),
  entry: {
    vue: `./src/main.js`,
    login: `./src/login.js`,
  },
  resolve: {
    extensions: [ `.js`, `.vue`, `.json` ],
    alias: {
      "@": resolve(__dirname, `src/`),
      "Constants": resolve(__dirname, `constants.js`),
    },
  },
  output: {
    path: `${__dirname}/public/js`,
    filename: `[name].js`,
    publicPath: `/js/`,
  },
  watchOptions: {
    poll: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: `vue-loader`,
      },
      {
        test: /\.css$/,
        use: [
          `style-loader`,
          `css-loader`,
        ],
      },
      {
        test: /\.scss$/,
        use: [
          `vue-style-loader`,
          `css-loader`,
          `sass-loader`,
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: `file-loader`,
            options: {
              name: `[name].[ext]`,
              outputPath: `../fonts/`,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: `file-loader`,
            options: {
              name: `[name].[ext]`,
              outputPath: `../images/`,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ProvidePlugin({
      '$': `jquery`,
      'jQuery': `jquery`,
      'window.jQuery': `jquery`,
      'window.$': `jquery`,
    }),
  ],
};

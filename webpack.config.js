const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const log = require('debug')('webpack:config:client');

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];

const nullModule = 'nullModule';
const config = {
  name: 'default',
  mode: 'development',
  entry: {
    app: [path.resolve(__dirname, './src/Client')],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/bundle/'),
    publicPath: '/bundle/',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react', '@babel/typescript'],
          },
        },
      },
    ],
  },
  devServer: {
    port: 8082,
    static: false,
    compress: true,
    hot: true,
    proxy: {
      '**': 'http://localhost:8081',
    },
    historyApiFallback: true,
  },
  plugins: [],
  externals: {},
  devtool: 'source-map',
  resolve: {
    extensions,
    plugins: [new TsconfigPathsPlugin({ extensions })],
    fallback: {},
  },
};

// preRender `.static` files
// replacing `.static` files with `nullModule`
config.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /\.static(.[jt]sx?)?$/g,
    nullModule,
  ));
// ignore it in browser
config.resolve.fallback[nullModule] = false;

// TODO execlude preRenderHook file

module.exports = config;

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];

module.exports = {
  mode: 'development',
  target: 'node',
  externalsPresets: { node: true },
  externals: nodeExternals(),
  entry: {
    server: [path.resolve(__dirname, './server/index.ts'), './node_modules/webpack/hot/poll?1000'],

  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react', '@babel/typescript'],
          },
        },
        // exclude: /[\\/]modules[\\/]/,
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devtool: 'source-map',
  resolve: {
    extensions,
    plugins: [new TsconfigPathsPlugin({ extensions })],
  },
};

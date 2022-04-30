/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  // target: 'node',
  externalsPresets: { node: true },
  externals: nodeExternals(),
  entry: {
    server: [path.resolve(__dirname, './server/server.ts')],
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
  plugins: [],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};

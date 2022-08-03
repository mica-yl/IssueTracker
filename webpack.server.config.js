/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
// plugins
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const RunInMemoryPlugin = require('RunInMemoryPlugin');

/**
 * @typedef {{
 * production:boolean,
 * inMem:boolean,
 * }} wepbackEnv
 * @param {wepbackEnv} env
 * @param {Record<string,any>} argv
 * @returns {webpack.Configuration}webpackServerConfig
 */
function serverConfig(env, argv) {
  const production = env.production || argv.mode === 'production';
  const development = !production;
  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
  /**  @type {webpack.Configuration}  */
  const config = {
    mode: production ? 'production' : 'development',
    target: 'node',
    externalsPresets: { node: true },
    externals: nodeExternals(),
    entry: {
      server: [path.resolve(__dirname, './server/index.ts')],

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
    devtool: development ? 'source-map' : 'eval',
    resolve: {
      extensions,
      plugins: [new TsconfigPathsPlugin({ extensions })],
    },
  };

  if (development) {
    config.entry.server.push(path.join(__dirname, './node_modules/webpack/hot/poll?1000'));
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
    );
    // build in memory
    if (env.inMem) {
      config.plugins.push(
        new RunInMemoryPlugin({
          requireFile: path.join(__dirname, './dist/server.bundle.js')
        }),
      );
    }
  }

  return config;
}

module.exports = serverConfig;

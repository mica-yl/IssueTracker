/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
// plugins
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const RunInMemoryPlugin = require('RunInMemoryPlugin');
// logging
const log = require('debug')('app:webpack');
const logClient = require('debug')('app:webpack:client');
const logServer = require('debug')('app:webpack:server');


// TODO move to webpack.config.js

/**
 * 
 * @param {import('./webpack.config').wepbackEnv} env
 * @param {Record<string,any>} argv
 * @returns {webpack.Configuration}webpackServerConfig
 */
function webpackConfig(env, argv) {
  const production = env.production || argv.mode === 'production';
  const development = !production;
  /** @type import('./webpack.config').Build */
  const build = {
    type: env.type || 'client',
  };
  let config;
  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
  log('build: %o', build);
  log('production: %o', production);
  // server
  if (build.type === 'server') {
    /**  @type {webpack.Configuration}  */
    const serverConfig = {
      name: 'server',
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
      serverConfig.entry.server.push(path.join(__dirname, './node_modules/webpack/hot/poll?1000'));
      serverConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
      );
      // build in memory
      if (env.inMem) {
        serverConfig.plugins.push(
          new RunInMemoryPlugin({
            requireFile: path.join(__dirname, './dist/server.bundle.js')
          }),
        );
      }
    }

    config = serverConfig;
  } else if (build.type === 'client') {// client
    const nullModule = 'nullModule';
    /**  @type {webpack.Configuration}  */
    const clientConfig = {
      name: 'client',
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
    clientConfig.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /\.static(.[jt]sx?)?$/g,
        nullModule,
      ));
    // ignore it in browser
    clientConfig.resolve.fallback[nullModule] = false;

    // TODO execlude preRenderHook file
    config = clientConfig;
  }

  return config;
}

module.exports = webpackConfig;

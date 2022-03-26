const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: [path.resolve(__dirname, './src/App')],
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
        test: /\.tsx$/,
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
      '*': 'http://localhost:8081',
    },
  },
  plugins: [],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },
};

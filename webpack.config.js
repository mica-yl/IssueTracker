const path = require('path');


module.exports = {
    mode: 'development',
    entry: {
        app: [path.resolve(__dirname, './src/App.jsx')],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'static/bundle/'),
        publicPath:'/bundle/',
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
                test: /\.jsx$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env',],
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
    plugins:[],
    devtool:'source-map',
}
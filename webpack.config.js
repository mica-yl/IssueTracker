const path = require('path');


module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/App.jsx'),
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'static/bundle'),
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env',],
                    },
                },
            },
        ],
    },
}
const path = require('path');

module.exports = {
    entry: './src/main/js/app.js',
    devtool: 'source-map',
    cache: true,
    mode: 'production', // Or 'production' for optimized builds
    output: {
        path: path.resolve(__dirname, './src/main/resources/static/built'),
        filename: 'bundle.js',
    },
    devServer: {
        hot: true, // Enable hot module replacement
        open: true, // Automatically open the browser
        historyApiFallback: true,

    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }


};

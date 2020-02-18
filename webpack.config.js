const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
    context: path.resolve(__dirname, ''),
    entry: {
        shikicinema: ['./src/watch-button.js', './src/contributions.js'],
        background: './src/background.js'
    },
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    failOnError: true
                }
            },
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: 'manifest.json' }
        ])
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    compress: IS_PRODUCTION,
                    ecma: 6,
                    output: {
                        comments: false
                    }
                }
            })
        ],
    },
    devtool: IS_PRODUCTION ? 'hidden-source-map' : 'source-map'
};

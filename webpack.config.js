const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function processManifest(content) {
    const PROCESSED_MANIFEST = JSON.parse(content.toString());

    PROCESSED_MANIFEST.content_security_policy += IS_PRODUCTION ? '' : ' \'unsafe-eval\'';
    return JSON.stringify(PROCESSED_MANIFEST);
}

module.exports = {
    context: path.resolve(__dirname, ''),
    entry: {
        shikicinema: ['./src/fetch-timeout.js', './src/watch-button.js', './src/contributions.js'],
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
            { from: './src/watch-button.css' },
            {
                from: 'manifest.json',
                to: './',
                transform(content, path) {
                    return processManifest(content);
                }
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.KODIK_TOKEN': JSON.stringify(process.env.KODIK_TOKEN)
        })
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

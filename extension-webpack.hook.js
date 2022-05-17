const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function processManifest(content) {
    const PROCESSED_MANIFEST = JSON.parse(content.toString());

    PROCESSED_MANIFEST.content_security_policy += isProduction ? '' : ' \'unsafe-eval\'';
    return JSON.stringify(PROCESSED_MANIFEST);
}

const isProduction = process.env.NODE_ENV === 'production';
const webpackConfig = {
    mode: isProduction ? 'production' : 'development',
    context: path.resolve(__dirname, ''),
    entry: {
        shikicinema: ['./extension-src/fetch-timeout.js', './extension-src/watch-button.js', './extension-src/contributions.js'],
        background: './extension-src/background.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
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
        new CopyPlugin({
            patterns: [
                {
                    from: './extension-src/watch-button.css'
                },
                {
                    from: './extension-src/manifest.json',
                    transform: (content, _) => processManifest(content),
                }
            ]
        }),
        new webpack.DefinePlugin({
            'process.env.KODIK_TOKEN': JSON.stringify(process.env.KODIK_TOKEN)
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: isProduction,
                    ecma: 2015,
                    output: {
                        comments: false
                    }
                }
            })
        ],
    },
    devtool: isProduction ? 'hidden-source-map' : 'source-map'
};

module.exports = function() {
    webpack(
        webpackConfig,
        (err, stats) => {
        if (err || stats.hasErrors()) {
            console.error('%cThere are errors', 'color: red', err || stats.toJson('minimal'));
        } else {
            console.log(stats.toString({ colors: true }));
        }
    });
};

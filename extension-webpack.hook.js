const webpack = require('webpack');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const dotenv = require('dotenv');

const packageJson = require('./package.json');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const manifestVersion = process.env.MANIFEST_VERSION || 'v2';

function processManifest(content) {
    const manifestContents = JSON.parse(content.toString());

    manifestContents.version = packageJson.version;

    if (manifestVersion !== 'v3') {
        manifestContents.content_security_policy += isProduction ? '' : ' \'unsafe-eval\'';
    }

    return JSON.stringify(manifestContents);
}

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
                test: /\.js$/,
                exclude: '/node_modules/',
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new ESLintPlugin({
            files: '**.js',
            exclude: [ 'node_modules', 'dist' ],
            failOnError: true,
            eslintPath: 'eslint/use-at-your-own-risk'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './extension-src/watch-button.css'
                },
                {
                    from: `./extension-src/manifest.${manifestVersion}.json`,
                    to: 'manifest.json',
                    transform: (content, _) => processManifest(content),
                }
            ]
        }),
        new webpack.DefinePlugin({
            'process.env.KODIK_AUTH_TOKEN': JSON.stringify(process.env.KODIK_AUTH_TOKEN)
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

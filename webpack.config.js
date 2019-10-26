const path = require('path');
const dotenv = require('dotenv');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

dotenv.config();
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
    context: path.resolve(__dirname, ''),
    entry: {
        'shikicinema': './src/shikicinema.js',
        'background': './src/background.js'
    },
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: '[name].js',
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                "test": /\.js$/,
                "exclude": "/node_modules/",
                "loader": "babel-loader"
            },
            {
                "test": /\.css$/,
                "loader": 'style!css!'
            },
            {
                "test": /\.json$/,
                "exclude": /node_modules/,
                "loader": 'json'
            },
            {
                "test": /\.html$/,
                "loader": 'html-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: 'manifest.json' },
            { from: '**', context: 'src/ui/dist/ui/'},
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

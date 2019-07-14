const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, ''),
    "entry": "./src/shikicinema.js",
    "output": {
        "path": path.resolve(__dirname, 'bin'),
        "filename": "shikicinema.min.js",
        "libraryTarget": "umd"
    },
    "module": {
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
            { from: 'src/shikicinema.css' },
            { from: 'assets/*.png' }
        ]),
    ],
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'source-map'
};

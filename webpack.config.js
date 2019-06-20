const path = require('path');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    "entry": "./shikicinema.js",
    "output": {
        "path": path.resolve(__dirname, 'bin'),
        "filename": "shikicinema.min.js",
        "libraryTarget": "umd"
    },
    "module": {
        rules: [
            {
                "exclude": "/node_modules/",
                "loader": "babel-loader"
            },
            {
                "test": /\.css$/,
                "loader": 'style!css!'
            }
        ]
    },
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'source-map'
};

module.exports = {
    "entry": ["./src/shikicinema.js"],
    "output": {
        "path": __dirname + "/bin/",
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
    devtool: "hidden-source-map"
};

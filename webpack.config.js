const path = require("path");
const copyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin")
const cssLoader = require("mini-css-extract-plugin");


module.exports = {
entry:{
    window: "./src/window/index.html",
    background: "./src/javascript/background.js",
    content: "./src/javascript/content.js",
    styling: "./src/style/style.css"
},
module:{
    rules: [
        {
            use: "babel-loader",
            test: /\.js$/,
            exclude: /node_modules/
        },
        {
            use: [cssLoader.loader, "css-loader"],
            test: /\.css$/,
            exclude: /node_modules/
        },
        {
            test: /\.json$/,
            type: "asset/resource"
        },
        {
            test: /\.html$/,
            loader: "html-loader"
        }
    ]
},
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js",
    clean: true
},
mode: "development",
plugins: [
    new copyPlugin({
      patterns: [
        { from: path.resolve("./src/assets/manifest.json"), to: path.resolve("dist") },
        { from: path.resolve("./src/assets/icon.png"), to: path.resolve("dist") }
      ]
    }),
    new HtmlPlugin({
        title: "ReactJS Boilerplate",
        filename: "index.html"
    }),
    new cssLoader({
        filename: "style.css"
    })
]
}
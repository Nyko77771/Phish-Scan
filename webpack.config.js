const path = require("path");
const copyPlugin = require("copy-webpack-plugin");

module.exports = {
entry:{
    background: "./src/background.js",
    content: "./src/content.js"
},
module:{
    rules: [
        {
            use: "babel-loader",
            test: /\.js$/,
            exclude: /node_modules/
        },
        {
            use: ["style-loader", "css-loader"],
            test: /\.css$/,
            exclude: /node_modules/
        },
        {
            test: /\.json$/,
            type: "asset/resource"
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
    })
]
}
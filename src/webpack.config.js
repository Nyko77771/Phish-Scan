const path = require("path");
const copyPlugin = require("copy-webpack-plugin");
const htmlPlugin = require("html-webpack-plugin");
const cssLoader = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    popup: "./src/javascript/popup.jsx",
    background: "./src/background.js",
    content: "./src/content.js",
    styling: "./src/style/style.css",
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
      },
      {
        use: [cssLoader.loader, "css-loader"],
        test: /\.css$/,
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        type: "asset/resource",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  mode: "development",
  plugins: [
    new copyPlugin({
      patterns: [
        {
          from: path.resolve("./src/assets/manifest.json"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve("./src/assets/icon.png"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve("./src/assets/logo.png"),
          to: path.resolve("dist"),
        },
      ],
    }),
    new htmlPlugin({
      template: "./src/popup/popup.html",
      filename: "popup.html",
      chunks: ["popup", "styling"],
    }),
    new cssLoader({
      filename: "style.css",
    }),
  ],
};

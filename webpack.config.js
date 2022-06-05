const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "bundle.js",
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 8888,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/css/font-awesome.min.css",
          to: "css/font-awesome.min.css"
        },
        {
          from: "src/assets",
          to: "assets",
        },
      ],
    }),
    new WriteFilePlugin()
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "sass-loader",
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                ["autoprefixer"]
              ]
            }
          }
        }
      ]
    }]
  }
};

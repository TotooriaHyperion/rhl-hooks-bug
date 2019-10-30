const path = require("path");
const webpack = require("webpack");
const express = require("express");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExt = require("script-ext-html-webpack-plugin");
const CaseSensitivePlugin = require("case-sensitive-paths-webpack-plugin");
const DevMiddleware = require("webpack-dev-middleware");
const HotMiddleware = require("webpack-hot-middleware");

const srcPath = path.resolve(__dirname, "src");
const publicPath = "/";

const webpackConfig = {
  // mode: 'production',
  mode: "development",
  devtool: "source-map",
  cache: true,
  devServer: {
    // publicPath,
    host: "127.0.0.1",
    disableHostCheck: true,
    port: 8844,
    hot: true,
    watchContentBase: true,
  },
  entry: [
    `webpack-hot-middleware/client?path=${publicPath}webpack_hot&timeout=5000&overlay=false&reload=false`,
    "webpack/hot/only-dev-server",
    `${srcPath}/index.tsx`,
  ],
  output: {
    publicPath,
    filename: "[name].js",
  },
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(srcPath, "tsconfig.json"),
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
    ],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(srcPath, "tsconfig.json"),
        },
      },
      {
        test: /\.jsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(srcPath, "tsconfig.json"),
        },
      },
      {
        test: /\.s?css$/,
        include: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("autoprefixer")(),
                require("postcss-flexbugs-fixes")(),
              ],
            },
          },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(png|gif|svg|jpe?g|mp4|mp3|ttf)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 2048,
              name: "[hash:8]-[name].[ext]",
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: JSON.stringify(true),
      __PUBLIC_PATH__: JSON.stringify(publicPath),
    }),
    new HtmlWebpackPlugin({
      template: `${srcPath}/index.html`,
      filename: "index.html",
      inject: "head",
    }),
    new CaseSensitivePlugin({}),
    new ScriptExt({
      defaultAttribute: "defer",
    }),
    // new HtmlWebpackInlineSourcePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};

const compiler = webpack(webpackConfig);
const server = express();
server.use(
  DevMiddleware(compiler, {
    publicPath,
  }),
);
server.use(
  HotMiddleware(compiler, {
    path: `${publicPath}webpack_hot`,
    heartbeat: 1000,
  }),
);
server.listen(webpackConfig.devServer.port);
